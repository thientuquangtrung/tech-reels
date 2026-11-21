---
name: idea-intake
description: Biến nguyên liệu thô (link, file PDF/ảnh/slide, đoạn mô tả của người dùng) thành video/videos/NNN-slug/idea.md có cấu trúc cho kênh video devdraw. Dùng khi người dùng dán link, đính kèm tài liệu, chọn một mục trong ideas/inbox.md hoặc kể một ý tưởng và muốn "lên idea video", "làm video về cái này". Chỉ muốn lưu ý tưởng lại → dùng capture. Không dùng để viết script.json.
---

# idea-intake

Đầu vào: bất cứ thứ gì người dùng đưa, hoặc một mục trong `ideas/inbox.md`.
Đầu ra: **một** `video/videos/NNN-slug/idea.md` hợp lệ, và các góc không chọn được nối vào `ideas/inbox.md`.

Đường dẫn trong skill tính từ gốc repo; lệnh `npm run` chạy ở gốc (proxy sang `video/`).

Người dùng hỏi chung chung ("làm video gì tiếp") → đọc `ideas/inbox.md`, liệt kê tối đa 3 mục
`RAW` có `Kênh` là `video`, `cả hai` hoặc `?` (cộng mục `PASSED` kênh `cả hai` mà `Đã thành` chưa có video)
và để người dùng chọn. Mục được chọn là một nguồn: các trường `Bối cảnh` / `Quyết định` / `Vì sao` thuộc "Góc của tôi".

Việc của skill này là **thu hẹp**: một nguồn có thể chứa 5 ý, một video chỉ nói 1 ý.

## Quy trình

### 1. Đọc nguồn

| Đầu vào | Cách đọc |
|---|---|
| Link | WebFetch. Không đọc được (paywall, chặn) → nói rõ, xin người dùng dán nội dung |
| PDF, docx | Read (PDF dài: đọc theo trang, chỉ phần liên quan) |
| Ảnh, ảnh chụp slide/sơ đồ | Read để xem ảnh; ghi lại cấu trúc sơ đồ (khối nào nối khối nào) — đây thường là gợi ý layout tốt |
| Mô tả của người dùng | Chính nó là một nguồn: ghi `"mô tả của tôi"` trong `sources` |

Đánh số nguồn theo thứ tự trong `sources` (nguồn 1, nguồn 2…). Không đọc được nguồn nào thì
không được trích nguồn đó.

### 2. Tách ba loại thông tin

- **Sự thật kỹ thuật có nguồn** → "Điểm mấu chốt", mỗi ý kết thúc bằng `[nguồn N]`.
- **Điều người dùng tự nói** (đã gặp ở dự án, nghĩ khác tài liệu) → "Góc của tôi", giữ nguyên ý họ.
- **Điều nghe có lý nhưng chưa có nguồn**, kể cả kiến thức của chính bạn → "Cần kiểm", dạng `- [ ]`.

### 3. Đề xuất góc, để người dùng chọn

Đưa ra 1–3 góc làm video. Mỗi góc gồm: một câu "ý duy nhất", series, layout, một hook mẫu.
Chọn series/layout theo hình dạng nội dung:

| Nội dung có dạng | series | layout |
|---|---|---|
| Một thực thể và vòng lặp hành vi của nó | `one_x` | `card+cycle` |
| Cách làm sai cạnh cách làm đúng | `wrong_right` | `compare` |
| Chuỗi sự kiện theo thời gian | `what_happens` | `flow` |
| Một con số / kết quả ngược trực giác | `counterintuitive` | `stack` |
| Hành trình tự học của người dùng | `learn_public` | tuỳ nội dung |

Layout đã dựng nằm trong `video/src/layouts/rules.ts`. Góc dùng layout chưa dựng vẫn đề xuất được,
nhưng phải nói rõ "cần dựng layout X trước".

Hỏi người dùng chọn góc nào. Họ không có mặt để trả lời → lấy góc có layout đã dựng, ghi lý do ở đầu câu trả lời.

### 4. Ghi idea.md

- Số thứ tự: lấy số lớn nhất trong `video/videos/` + 1, ba chữ số. Slug: tiếng Anh, ngắn, gạch nối.
- Copy khung từ `template.md` cùng thư mục, điền vào, xoá các comment hướng dẫn.
- `status: draft`. Chỉ người dùng mới chuyển sang `approved`.

### 5. Kiểm và dọn

- Chạy `npm run check-idea -- NNN`. Có lỗi → sửa idea.md, chạy lại đến khi pass.
  Không sửa `video/scripts/check-idea.ts` để cho qua.
- Ý lấy từ inbox → trong inbox đổi `[RAW]` thành `[PASSED]` và thêm (hoặc nối vào) dòng
  `- **Đã thành:** video/videos/NNN-slug`.
- Nối các góc không được chọn vào cuối `ideas/inbox.md`, mỗi góc một mục `[RAW]` ngắn:
  tiêu đề là chủ đề, `- **Kênh:** video (<series>, layout: <layout>)`, `- **Nguồn:** <nguồn>`.
  Các trường khác không biết thì bỏ, đừng điền `?` cho đủ.
- Báo lại người dùng: góc đã chọn, các lưu ý (`!`) từ check-idea, và danh sách "Cần kiểm".

## Luật

1. **Mọi sự thật kỹ thuật phải có nguồn.** Không có nguồn thì nằm ở "Cần kiểm", không ở "Điểm mấu chốt".
   Đừng gắn bừa `[nguồn 1]` cho ý mà nguồn 1 không nói.
2. **Diễn giải, không chép.** Viết lại bằng lời của mình, không chép đoạn văn từ nguồn.
   Toàn bộ ý tưởng đến từ đúng một nguồn → nhắc người dùng tìm góc riêng hoặc nguồn thứ hai.
3. **Không bịa "Góc của tôi".** Chỉ ghi điều người dùng đã nói trong cuộc trò chuyện. Không có thì để trống
   và hỏi một câu: "Bạn từng gặp chuyện này ở đâu chưa?"
4. **Một idea = một ý.** "Một ý duy nhất" ≤ 160 ký tự. Muốn nói hai ý → hai idea.

## Ví dụ ngắn

Người dùng dán link bài "Exponential backoff and jitter" và nói "team mình từng sập vì retry dồn".

Góc đề xuất:
1. `wrong_right` / `compare` — Retry ngay lập tức làm service chết lần hai. Hook: "Retry cứu bạn, hay giết bạn?"
2. `counterintuitive` / `stack` — Thêm jitter ngẫu nhiên lại làm hệ thống ổn định hơn.

Câu "team mình từng sập vì retry dồn" → "Góc của tôi". Con số cụ thể về thời gian phục hồi mà bài
không nêu → "Cần kiểm".
