---
name: blog-angle
description: Thẩm định một ý tưởng (từ ideas/inbox.md hoặc tác giả kể) cho blog xem có đủ luận điểm để thành bài không, rồi sinh outline.md và scaffold thư mục draft. Dùng skill này BẤT CỨ KHI NÀO tác giả hỏi "ý này viết được không", "nên viết bài gì tiếp", "lên outline cho ý này", "chốt góc viết", muốn chọn bài tiếp theo từ ideas/inbox.md, hoặc mô tả một ý tưởng và hỏi có nên viết không. KHÔNG dùng để viết nội dung bài — đó là việc của blog-draft.
---

# blog-angle

Cổng chặn giữa inbox và bản nháp. Nhiệm vụ chính là **nói không**.

## Vì sao skill này tồn tại

Phần lớn bài blog kỹ thuật dở không phải vì viết dở — mà vì không có luận điểm. Tác giả
mô tả một thứ mình đã làm, người đọc gật gù, rồi quên sạch, vì bài không yêu cầu họ
thay đổi gì.

Skill này tồn tại để chặn những bài đó **trước khi** tốn công viết. Một `REJECT` ở đây
tiết kiệm 4 tiếng; một bài nhạt đã đăng thì không rút lại được.

Cứ 3 ý qua cổng mà không có ý nào bị chặn là dấu hiệu skill đang chạy quá dễ dãi.

## Câu hỏi cổng

Mỗi ý phải trả lời được **cả ba**, bằng câu cụ thể, không bằng câu chung chung:

1. **Người đọc làm khác đi điều gì sau khi đọc?**
   Không trả lời được → `REJECT`.
   Lưu ý: "hiểu thêm về X" không phải câu trả lời. "Ngừng gộp liệt kê và phân loại vào
   một pass" mới là.

2. **Điều gì trong bài này người khác không viết được?**
   Nếu toàn bộ nội dung tra được trong docs chính thức trong 5 phút → `REJECT`.
   Lợi thế hợp lệ: trải nghiệm thật, số liệu thật, cách làm đã hỏng, đánh đổi đã trả giá.

3. **Có bằng chứng cụ thể không?**
   Ít nhất một trong: log, code diff, số đo, ảnh chụp, tên lỗi cụ thể.
   Không có gì cả → `REJECT` kèm gợi ý thu thập gì để hồi sinh ý này.

## Đầu ra: đúng một trong bốn nhãn

### `PASS`
Qua cả ba câu hỏi. → sang phần "Khi PASS".

### `REJECT`
Trượt ít nhất một câu. Trả lời gồm: trượt câu nào, vì sao, và **điều kiện hồi sinh** —
cần thêm dữ kiện gì để ý này thành viết được. Đánh dấu mục trong inbox thành `[REJECTED]`
kèm một dòng lý do, **không xoá**. Ý bị chặn hôm nay có thể sống lại sau ba tháng.

### `MERGE`
Ý này một mình quá mỏng nhưng ghép với mục khác trong inbox thì thành bài tử tế.
Nêu rõ ghép với mục nào và luận điểm chung sau khi ghép. Chờ tác giả đồng ý rồi mới gộp.

### `SPLIT`
Ý này chứa từ hai luận điểm độc lập trở lên, nhồi chung sẽ loãng cả hai. Đề xuất tách
thành các mục riêng, chỉ ra nên viết mục nào trước.

## Khi PASS

### Bước 1 — Chốt luận điểm bằng một câu

Viết ra đúng **một câu** dạng: *"Bài này thuyết phục người đọc rằng ___, bằng cách ___."*
Câu này đi thẳng lên đầu `outline.md` và là thước đo cho mọi bước sau. Nếu không viết
gọn được trong một câu thì ý vẫn chưa chín — quay lại `SPLIT`.

### Bước 2 — Scaffold

```bash
node blog/bin/blog.js new "<tiêu đề>"
```

CLI lo slugify (bỏ dấu tiếng Việt), tạo thư mục, sinh frontmatter và các file rỗng.
**Không tự tạo thư mục bằng tay** — slug sai chuẩn sẽ hỏng các bước sau.

### Bước 3 — Chuyển ý sang draft

Copy nguyên nội dung mục trong inbox sang `blog/drafts/<slug>/idea.md`. Trong inbox, giữ
nguyên nội dung, đổi `[RAW]` thành `[PASSED]` và thêm (hoặc nối vào) dòng
`- **Đã thành:** blog/drafts/<slug>`. Mục đã có `Đã thành` từ video thì chỉ nối thêm.

### Bước 4 — Viết `outline.md`

```markdown
# Outline: <tiêu đề>

**Luận điểm:** Bài này thuyết phục người đọc rằng ___, bằng cách ___.
**Người đọc:** <cụ thể — "dev đang viết agent gọi shell", không phải "dev nói chung">
**Người đọc làm khác đi:** <hành động cụ thể>
**Độ dài dự kiến:** <1200–1800 chữ>

## §1 Mở bài — <hook cụ thể là gì>
- Vấn đề đã xảy ra thật, mô tả trong 3–4 câu
- KHÔNG định nghĩa, KHÔNG bối cảnh ngành

## §2 Bối cảnh — <vừa đủ để hiểu vấn đề>
- ...

## §3 Cách làm đầu tiên và vì sao hỏng
- ...

## §4 Cách làm hiện tại
- ...

## §5 Đánh đổi phải chấp nhận
- ...

## §6 Kết — người đọc mang gì về
- ...

## Fact gaps đã thấy trước
- [ ] §3: cần log lỗi nguyên văn
- [ ] §4: cần số liệu trước/sau

## Ảnh dự kiến
- §1: ILLUSTRATION — ảnh bìa
- §4: DIAGRAM — sơ đồ luồng
- §5: SCREENSHOT — output thật (tác giả tự chụp)
```

Số section linh hoạt, nhưng mỗi section phải **phục vụ luận điểm ở đầu file**. Section
nào không phục vụ thì cắt ngay ở bước này, đừng để nó sống tới bản nháp.

### Bước 5 — Dừng lại

Báo: đã tạo `<slug>`, luận điểm là gì, có mấy fact gap cần chuẩn bị.
**Không viết tiếp sang nội dung bài.** Hỏi tác giả có muốn chạy `blog-draft` không.

## Khi tác giả không chỉ rõ ý nào

Nếu tác giả hỏi chung chung ("nên viết gì tiếp"), đọc `ideas/inbox.md`, chấm nhanh mọi
mục `RAW` có `Kênh` là `blog`, `cả hai` hoặc `?` — cộng các mục `PASSED` có kênh `cả hai`
mà `Đã thành` chưa có bài blog — theo ba câu hỏi cổng, rồi trình bày **tối đa 3 ứng viên mạnh nhất** kèm một
dòng luận điểm dự kiến cho mỗi ứng viên. Để tác giả chọn. Không tự chọn hộ.

## Ví dụ

**Ý:** "Viết về cách dùng Jira MCP với Claude Code."

- Câu 1 — người đọc làm khác đi gì? Chưa rõ, mới chỉ là chủ đề.
- Câu 2 — người khác không viết được gì? Nếu chỉ hướng dẫn cài đặt thì docs có rồi.
- Câu 3 — bằng chứng? Có, hệ thống đang chạy thật.

→ **`REJECT`**, kèm điều kiện hồi sinh:

> Ý này đang là *chủ đề* chứ chưa phải *luận điểm*. Phần cài đặt thì docs chính thức
> làm tốt hơn bạn. Thứ bạn có mà docs không có là những chỗ docs nói thiếu — quyền hạn
> token, hành vi khi ticket bị đổi trạng thái giữa chừng, giới hạn số lần gọi.
> Ghi lại 3–4 chỗ như vậy, kèm cách bạn đã lách, rồi quay lại. Lúc đó luận điểm sẽ là:
> "Jira MCP dùng được trong production, nhưng có bốn chỗ docs không nói và đây là cách
> xử lý" — bài đó thì không ai viết thay bạn được.
