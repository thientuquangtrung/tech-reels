# Idea: IN, EXISTS hay USING: cùng một plan, chỉ NOT IN là bẫy

<!-- Copy nguyên từ ideas/inbox.md (2026-11-22) -->

## [PASSED] 2026-11-22 — IN vs EXISTS vs USING: khác nhau thật ở đâu

- **Bối cảnh:** gặp khi viết TypeORM migration xoá dữ liệu cha/con trên Postgres: câu `WHERE x IN (SELECT ...)` chạy đúng, nhưng được góp ý nên đổi sang `EXISTS` hoặc `USING` — và chưa rõ ba cách khác nhau thật ở đâu.
- **Quyết định:** ? (đang cân nhắc giữ `IN` hay đổi sang `EXISTS` / `DELETE ... USING`)
- **Vì sao:** chưa rõ khác biệt thật giữa ba cách: `IN` "gom danh sách rồi so khớp", `EXISTS` "kiểm từng dòng, ngắt sớm", `USING` là join delete riêng của Postgres. Điểm chắc chắn đáng kể: `NOT IN` gặp một `NULL` trong subquery là trả rỗng, `NOT EXISTS` thì không.
- **Cái giá:** `USING` không chạy được trên DB khác; `EXISTS` dài hơn, cần alias.
- **Ai cần biết:** dev backend viết migration / câu DELETE có subquery trên Postgres.
- **Chứng cứ có sẵn:** code migration gốc; ví dụ 6 dòng dữ liệu mẫu (101/102 cha, 201–204 con) đã dựng step-by-step. Phần giải thích cơ chế đến từ chat với Gemini — cần kiểm bằng `EXPLAIN ANALYZE` (Postgres thường biến `IN (subquery)` thành semi-join giống `EXISTS`).
- **Kênh:** cả hai — video (wrong_right: `NOT IN` + NULL vs `NOT EXISTS`), blog (so sánh ba cách kèm plan thật)
- **Cần ẩn danh:** tên bảng/cột/class thật của migration gốc và các khái niệm nghiệp vụ — không ghi vào repo.

## Bổ sung sau khi đo (2026-11-22)

Thí nghiệm ở `lab/` (Postgres 18.7 native trong devcontainer, 200k orders / ~950k order_items, dữ liệu dựng để thử):

- `IN`, `EXISTS`, `USING` cho câu DELETE ra **cùng một plan** (Hash Join), cùng ~125 ms, có hay không có index đều vậy.
- `NOT IN` khi subquery có 1 `NULL` → xoá **0** dòng; `NOT EXISTS` → xoá đúng 10,000.
- `NOT IN` ở work_mem mặc định 4MB là vách đá, không phải dốc: 55k orders / 261k items → hashed SubPlan, 29 ms; 60k / 285k → SubPlan không hash, > 120 s. `NOT EXISTS` ở 60k: 34 ms. (Bảng "bậc hai" lần đo đầu sai: thu nhỏ dữ liệu bằng DELETE trong transaction nên planner vẫn dùng thống kê của bảng lớn.)
- Chi tiết + plan nguyên văn: `lab/results.md`.
