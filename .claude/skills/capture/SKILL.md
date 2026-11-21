---
name: capture
description: Ghi nhanh một ý tưởng thô (cho blog, video, hoặc chưa biết) vào ideas/inbox.md theo schema cố định. Dùng skill này BẤT CỨ KHI NÀO tác giả vừa kể xong một thứ mình vừa làm/vừa fix/vừa quyết định trong công việc và có ý muốn lưu lại — kể cả khi họ chỉ nói "cái này viết blog được đấy", "cái này làm video được", "ghi lại giúp tôi", "vừa xong cái này hay phết", "note lại ý này", hoặc kể lể một bug vừa sửa mà chưa nói rõ để làm gì. KHÔNG dùng skill này để viết bài, lên outline, làm idea.md video hay đánh giá ý tưởng hay dở.
---

# capture

Bắt ý tưởng ngay lúc nó còn nóng, tốn dưới 3 phút của tác giả. Một inbox chung cho cả
blog lẫn video: ý nào thành bài, ý nào thành video là việc của bước sau.

## Vì sao skill này tồn tại

Blog và kênh video đều chết vì hết ý, không phải vì làm dở. Ý tưởng tốt nhất xuất hiện ngay sau khi
vừa giải quyết xong một thứ khó — và bốc hơi trong vòng 48 giờ. Nhiệm vụ duy nhất của
skill này là bắt lấy chúng với chi phí ma sát thấp nhất có thể.

Hệ quả thiết kế: **mọi thứ làm tác giả tốn thêm thời gian ở bước này đều là lỗi.**
Nếu capture tốn 20 phút, tác giả sẽ ngừng capture sau tuần thứ hai và cả hệ thống chết theo.

## Ràng buộc cứng

- **Không viết bài, không viết đoạn văn hoàn chỉnh, không đề xuất outline.** Kể cả khi
  ý tưởng hay đến mức ngứa tay. Muốn viết bài luôn → `blog-angle`; muốn làm video luôn → `idea-intake`.
- **Tối đa 2 câu hỏi làm rõ.** Gộp vào một lượt, không hỏi lẻ tẻ nhiều lượt.
  Không tiêu câu hỏi vào chuyện chọn kênh.
- **Không đánh giá ý tưởng hay/dở.** Đó là việc của `blog-angle` / `idea-intake`. Ở đây mọi ý đều được ghi.
- **Không bịa.** Trường nào tác giả không nói thì ghi `?`, không suy diễn.
- Ghi bằng đúng chữ của tác giả nhiều nhất có thể. Chỉnh chính tả, không chỉnh giọng.

## Quy trình

### Bước 1 — Trích xuất từ những gì đã nghe

Đọc lại đoạn tác giả vừa kể (có thể là vài lượt hội thoại trước) và tự điền tối đa
6 trường dưới đây. Đừng hỏi thứ đã có sẵn trong hội thoại.

| Trường | Nội dung |
|---|---|
| `Bối cảnh` | Chuyện xảy ra ở đâu, trong hệ thống nào, đang cố làm gì |
| `Quyết định` | Cuối cùng đã làm gì |
| `Vì sao` | Lý do chọn cách đó thay vì cách khác |
| `Cái giá` | Đánh đổi phải chấp nhận |
| `Ai cần biết` | Kiểu người đọc sẽ thấy hữu ích |
| `Chứng cứ có sẵn` | Log, code, ảnh, số liệu đang có trong tay |
| `Kênh` | `blog`, `video`, `cả hai` hoặc `?` — xem bảng dưới |

Điền `Kênh` theo lời tác giả ("viết blog được đấy" → `blog`). Họ không nói thì gợi ý theo
hình dạng nội dung, không chắc thì ghi `?`:

| Nội dung có dạng | Kênh gợi ý |
|---|---|
| Sai vs đúng, gói gọn trong một đoạn code / một cấu hình | `video` (series `wrong_right`) |
| Một thực thể và vòng lặp hành vi của nó | `video` (series `one_x`) |
| Con số / kết quả ngược trực giác | `video` (series `counterintuitive`) |
| Cách đầu hỏng, cách sau có đánh đổi, cần bối cảnh mới hiểu | `blog` |
| Có cả một khoảnh khắc "à" ngắn lẫn một câu chuyện dài | `cả hai` |

Nếu gợi ý `video`, thêm series vào sau, ví dụ `video (wrong_right)`.

### Bước 2 — Hỏi tối đa 2 câu

Chỉ hỏi những trường **trống mà quyết định giá trị của bài**. Thứ tự ưu tiên:
`Vì sao` > `Cái giá` > `Chứng cứ có sẵn` > phần còn lại.

`Bối cảnh` và `Ai cần biết` thường suy được từ ngữ cảnh — đừng tiêu câu hỏi vào đó.

Nếu cả 6 trường đã đủ rõ, **không hỏi gì cả**, ghi luôn.

### Bước 3 — Append vào `ideas/inbox.md`

Thêm vào **cuối file**, không chèn giữa, không sắp xếp lại các mục cũ.

```markdown
## [RAW] YYYY-MM-DD — <tiêu đề tạm, 6–12 chữ, mô tả nội dung không phải chủ đề>

- **Bối cảnh:** ...
- **Quyết định:** ...
- **Vì sao:** ...
- **Cái giá:** ...
- **Ai cần biết:** ...
- **Chứng cứ có sẵn:** ...
- **Kênh:** ...
```

Trường `Đã thành` không ghi ở bước này — `blog-angle` / `idea-intake` thêm vào khi dùng ý.

Tiêu đề tạm nên mô tả *cái đã xảy ra*, không phải chủ đề chung.
Tốt: `Vì sao tách Review-Test-Case thành agent riêng`.
Kém: `Về kiến trúc agent`.

### Bước 4 — Xác nhận ngắn

Báo lại đúng hai thứ: tiêu đề vừa ghi, và số mục `RAW` hiện có trong inbox.
Không tóm tắt lại nội dung vừa ghi — tác giả vừa nói nó xong.

Nếu inbox đã có **từ 5 mục `RAW` trở lên**, thêm một dòng gợi ý chạy `blog-angle` (chốt
bài tiếp theo) hoặc `idea-intake` (chốt video tiếp theo). Chỉ nhắc, không tự chạy.

## Trường hợp đặc biệt

**Tác giả kể một lúc nhiều thứ rời rạc** → tách thành nhiều mục riêng, mỗi mục một
quyết định. Đừng nhồi ba quyết định vào một mục.

**Ý tưởng trùng với mục đã có trong inbox** → không tạo mục mới. Bổ sung chi tiết vào
mục cũ và báo: "gộp vào mục ngày X".

**Tác giả kể về thứ chưa xong** ("đang thử cách này chưa biết ổn không") → vẫn ghi,
đánh dấu `Quyết định: [CHƯA CHỐT]`. Bài viết dở dang cũng là chất liệu tốt, nhưng phải
biết là nó chưa xong.

**Tác giả nói kèm dữ liệu nhạy cảm** (mã ticket thật, tên khách hàng) → vẫn ghi nguyên
văn vào inbox vì đây là file nội bộ, nhưng thêm dòng
`- **Cần ẩn danh:** <liệt kê những thứ phải thay trước khi đăng>`.

## Ví dụ

**Tác giả nói:**
> "Xong. Cái grep trong agent nãy giờ toang là do path có dấu cách, phải quote lại hết.
> Mất cả buổi chiều."

**Đã có trong hội thoại:** bối cảnh (agent QA), quyết định (quote path), cái giá (chưa rõ).
**Còn thiếu quan trọng:** vì sao không dùng cách khác + có log không.

**Hỏi (một lượt, hai câu):**
> Hai câu nhanh rồi tôi ghi: (1) bạn có cân nhắc cách nào khác ngoài quote không —
> ví dụ đổi cấu trúc thư mục? (2) còn giữ được log lỗi lúc chưa quote không?

**Ghi vào inbox:**
```markdown
## [RAW] 2026-08-15 — Grep trong agent chết vì path có dấu cách

- **Bối cảnh:** agent QA quét file trong repo, một số thư mục có dấu cách trong tên.
- **Quyết định:** quote toàn bộ path trong mọi lệnh grep của agent.
- **Vì sao:** đổi cấu trúc thư mục sẽ phá link của cả team, không đáng.
- **Cái giá:** phải nhớ quote ở mọi chỗ mới thêm, không có gì tự bắt lỗi này.
- **Ai cần biết:** người viết agent có gọi shell command trên path do người dùng nhập.
- **Chứng cứ có sẵn:** log lỗi trước khi sửa, diff của lần fix.
- **Kênh:** blog
```

**Xác nhận:**
> Đã ghi: "Grep trong agent chết vì path có dấu cách". Inbox giờ có 6 mục RAW —
> đủ để chạy `blog-angle` hoặc `idea-intake` khi bạn muốn.
