# Outline: IN, EXISTS hay USING: cùng một plan, chỉ NOT IN là bẫy

**Luận điểm:** Bài này thuyết phục người đọc rằng trên Postgres, đổi `IN` sang `EXISTS` hay `USING` "cho nhanh" là phí công — thứ thật sự cần sửa là mọi chỗ `NOT IN (subquery)` — bằng cách đặt plan `EXPLAIN ANALYZE` của cả ba cách cạnh nhau rồi cho thấy `NOT IN` vừa trả sai khi gặp một `NULL`, vừa rơi khỏi vách đá về tốc độ (29 ms → hơn 2 phút) khi subquery vượt ngưỡng `work_mem`.
**Người đọc:** dev backend đang viết migration hoặc câu DELETE/UPDATE có subquery trên Postgres, vừa bị (hoặc sắp) góp ý "đổi sang EXISTS cho nhanh".
**Người đọc làm khác đi:** (1) không đổi `IN` ↔ `EXISTS` ↔ `USING` vì lý do tốc độ khi chưa chạy `EXPLAIN`; (2) grep `NOT IN (SELECT` trong codebase và đổi sang `NOT EXISTS`.
**Độ dài dự kiến:** 1400–1800 chữ

## §1 Mở bài — lời góp ý "đổi sang EXISTS cho nhanh"
- Viết migration TypeORM xoá dữ liệu con theo cha bằng `WHERE ... IN (SELECT ...)`, chạy đúng.
- Review góp ý đổi sang `EXISTS` hoặc `DELETE ... USING`. Hỏi AI thì được lời giải thích nghe rất xuôi: `IN` gom danh sách rồi so, `EXISTS` kiểm từng dòng và ngắt sớm.
- Nghe xuôi nhưng chưa ai đo. Bài này đo.
- KHÔNG định nghĩa IN/EXISTS.

## §2 Bối cảnh — bài toán, đã ẩn danh
- Đổi sang `orders` / `order_items`: xoá item của các đơn đã huỷ. (Không dùng tên bảng gốc.)
- Ba câu SQL đặt cạnh nhau (IN / EXISTS / USING).
- Thiết lập đo: Postgres 18.7, 200k orders, ~950k items, mỗi câu chạy trong `BEGIN … ROLLBACK`, lấy median 3 lần. Nói rõ là dữ liệu dựng để thử, script ở cuối bài.

## §3 Niềm tin ban đầu và vì sao nó sai trên Postgres
- Mô hình "IN gom danh sách / EXISTS ngắt sớm" mô tả cách *đọc* câu SQL, không phải cách Postgres *chạy* nó.
- Bằng chứng: ba plan giống nhau từng dòng — cùng `Hash Join`, cùng `Buffers: shared hit=106488`, cùng ~124–130 ms. Bỏ index trên `order_items(order_id)` cũng không đổi.
- Giải thích ngắn: planner kéo subquery `IN`/`EXISTS` lên thành semi-join; ở đây `orders.id` là khoá chính nên semi-join thành join thường — đúng thứ `USING` viết ra.
- Hệ quả: chọn giữa ba cách là chuyện đọc dễ, không phải chuyện tốc độ.

## §4 Chỗ khác thật: NOT IN
- Đảo bài toán: xoá đơn không còn item nào. `NOT IN` vs `NOT EXISTS`.
- **Sai kết quả:** thêm đúng 1 dòng `order_items.order_id = NULL` → `NOT IN` xoá 0 dòng, `NOT EXISTS` xoá đúng 10,000. Giải thích bằng logic ba giá trị: `id <> NULL` là `NULL`, không phải `TRUE`, nên `NOT IN` không bao giờ đúng.
- **Vách đá tốc độ:** vì phải giữ ngữ nghĩa NULL, Postgres không biến `NOT IN` thành anti-join. Danh sách vừa `work_mem` → hashed SubPlan, nhanh ngang `NOT EXISTS`. Vượt ngưỡng (55k → 60k đơn, `work_mem` 4MB) → `SubPlan` + `Materialize`, quét lại từng dòng: 29 ms → > 120 s. `NOT EXISTS` vẫn 34 ms.
- Điểm đáng sợ: cùng một câu, nhanh ở môi trường dev (bảng nhỏ), sập ở production khi bảng lớn qua ngưỡng `work_mem`.

## §5 Vậy chọn gì — và đánh đổi
- Khẳng định (`IN` / `EXISTS` / `USING`): chọn theo độ dễ đọc. `IN` gọn nhất khi chỉ so một cột. `EXISTS` khi điều kiện nhiều cột. `USING` khi cần dùng cột của bảng kia (ví dụ trong `RETURNING`) hoặc join nhiều bảng.
- Phủ định: luôn `NOT EXISTS`. Không có ngoại lệ đáng nhớ.
- Đánh đổi: `USING` là cú pháp riêng của Postgres (MySQL có multi-table DELETE nhưng cú pháp khác) → kẹt nếu đổi DB. `EXISTS` dài hơn, cần alias.
- Quyết định cuối cùng cho migration gốc: [cần tác giả].
- Giới hạn của phép đo: một phiên bản Postgres, một hình dạng dữ liệu, chạy trong container trên laptop — con số tuyệt đối không mang đi so được, chỉ hình dạng plan và tỷ lệ là đáng tin. DB khác (MySQL, SQL Server…) không nằm trong bài.

## §6 Kết — mang gì về
- Trước khi đổi query "cho nhanh": chạy `EXPLAIN ANALYZE` cả hai bản, so plan. Plan giống nhau thì tranh luận xong.
- Một việc làm ngay: `grep -rn "NOT IN (SELECT"` trong migration và repository.
- Link script thí nghiệm để người đọc tự chạy.

## Fact gaps đã thấy trước
- [ ] §1: người góp ý đổi sang EXISTS/USING vì lý do gì (tốc độ? NULL? thói quen?) — tác giả xác nhận
- [ ] §1: có muốn trích đoạn code migration gốc (đã ẩn danh) không, hay chỉ dùng bản `orders`/`order_items`
- [ ] §5: cuối cùng migration gốc giữ `IN` hay đổi — và vì sao
- [ ] §3: nguồn cho câu "planner kéo IN/EXISTS lên thành semi-join" (docs Postgres / mã nguồn `pull_up_sublinks`) — cần link
- [ ] §4: nguồn cho ngữ nghĩa NULL của `NOT IN` (docs Postgres, mục Subquery Expressions) và wiki "Don't Do This" — cần link
- [ ] Cuối bài: script thí nghiệm đăng ở đâu (gist / repo) để link

## Ảnh dự kiến
- §1: ILLUSTRATION — ảnh bìa: ba câu SQL khác nhau chảy vào cùng một cây plan
- §3: DIAGRAM — ba câu SQL → một plan `Hash Join` (có thể thay bằng ba khối plan đặt cạnh, inline)
- §4: DIAGRAM — `NOT IN` với NULL: `5 <> 1 AND 5 <> 2 AND 5 <> NULL` → `NULL` → không xoá
- §4: (bỏ) — bảng vách đá trong bài đã đủ, không cần biểu đồ
