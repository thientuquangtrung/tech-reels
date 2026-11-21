---
name: blog-publish-check
description: Kiểm tra một bài blog trước khi đăng — quét rò rỉ thông tin công ty/khách hàng, placeholder còn sót, ảnh chưa xong, link hỏng, metadata thiếu. Dùng skill này BẤT CỨ KHI NÀO tác giả nói "chuẩn bị đăng", "check trước khi publish", "bài này đăng được chưa", "sắp đăng rồi", hoặc chuẩn bị đưa bài ra công khai ở bất kỳ nền tảng nào. KHÔNG dùng để review chất lượng nội dung — đó là việc của blog-review.
---

# blog-publish-check

Cổng cuối. Chặn những thứ không rút lại được sau khi đăng.

## Vì sao skill này quan trọng hơn vẻ ngoài của nó

Blog này viết về công việc thật ở một công ty thật, có khách hàng thật. Một mã ticket
lọt ra, một ảnh chụp còn tên client, một dòng log còn URL nội bộ — hậu quả không nằm ở
chỗ bài kém hay, mà ở chỗ tác giả phải giải trình với công ty.

Đăng rồi thì Google đã cache, RSS đã đẩy, ai đó đã screenshot. Không có nút undo.

Vì vậy skill này **thà báo nhầm còn hơn bỏ sót**. Nghi ngờ thì gắn `BLOCKING` và để tác
giả quyết, đừng tự phán là an toàn.

## Bước 1 — Quét bằng máy trước

```bash
node blog/bin/blog.js check <slug>
```

CLI quét các pattern cố định: mã ticket, IP nội bộ, domain nội bộ, email công ty,
placeholder còn sót, URL localhost, đường dẫn file cá nhân. Đây là lớp lọc thô, nhanh
và không bỏ sót pattern đã biết.

Đọc kết quả CLI **trước**, rồi mới đọc bài bằng mắt để bắt những thứ regex không bắt được.

## Bước 2 — Checklist rò rỉ (BLOCKING)

Regex bắt được pattern, không bắt được ngữ nghĩa. Đọc bài và soát thủ công:

**2.1 — Danh tính tổ chức**
- Tên khách hàng, tên đối tác, tên dự án nội bộ
- Tên công ty trong ngữ cảnh có thể suy ra khách hàng
- Tên codename dự án mà người trong ngành đoán được

**2.2 — Danh tính cá nhân**
- Tên đồng nghiệp, kể cả tên riêng không họ
- Chức danh + bối cảnh đủ để nhận diện ("PO của team tôi")
- Ảnh chụp có avatar, tên trong Slack/Jira

**2.3 — Định danh hệ thống**
- Mã ticket thật (`ABC-1234` → đổi thành `PROJ-1234`)
- Tên repo nội bộ, tên branch có mã ticket
- URL nội bộ, hostname, IP, port
- Tên database, tên bảng, tên service nội bộ

**2.4 — Dữ liệu**
- Số liệu kinh doanh: doanh thu, số user, chi phí, SLA cam kết
- Dữ liệu thật trong ví dụ: email, số điện thoại, tên khách hàng trong test data
- Log còn payload thật
- API key, token, connection string — kể cả đã hết hạn

**2.5 — Ảnh** (mọi mục `type: SCREENSHOT` trong `images.md`)
- Đọc `capture_note` của từng ảnh, kiểm từng mục đã che chưa
- Kiểm cả rìa ảnh: tab trình duyệt, taskbar, thông báo pop-up, tên máy
- Ảnh chụp toàn màn hình gần như luôn lộ thứ gì đó

**2.6 — Ngữ cảnh có thể ghép nối**
Từng mảnh riêng lẻ vô hại nhưng ghép lại thì suy ra được: tên công ty + mô tả domain +
mốc thời gian + quy mô team. Đây là chỗ dễ bỏ sót nhất. Tự hỏi: *một người trong ngành
đọc bài này có đoán ra khách hàng là ai không?*

Với mỗi mục phát hiện, đưa **gợi ý thay thế cụ thể**, không chỉ báo lỗi:

```
BLOCKING — rò rỉ
  [L1] §3 dòng 42 — mã ticket "BKC-2417"
       → đổi thành "PROJ-1234"
  [L2] §4 — "hệ thống đặt vé của khách hàng bên bán lẻ"
       → "an internal booking system" (bỏ ngành)
  [L3] img-03 — capture_note yêu cầu che tên project, ảnh hiện tại chưa che
       → chụp lại hoặc bôi vùng góc trên trái
```

## Bước 3 — Checklist kỹ thuật

**Placeholder** — `[CẦN SỐ LIỆU]`, `[TODO]`, `XXX`, `???`, `lorem` → `BLOCKING`.

**Ảnh** — chạy `node blog/bin/blog.js images <slug>`:
- mọi marker trong bài có mục tương ứng trong manifest, và ngược lại
- mọi ảnh có `alt` không rỗng
- không còn `status: TODO` hoặc `NEEDS_CAPTURE` → `BLOCKING`

**Link** — chạy `node blog/bin/blog.js links <slug>`:
- link nội bộ (localhost, IP riêng, domain công ty) → `BLOCKING`
- link tới tài liệu cần đăng nhập → `BLOCKING`
- link tới nội dung có thể biến mất (Google Doc cá nhân) → `SUGGESTION`, đề xuất
  trích nội dung vào bài

**Metadata** — `title`, `description` (dưới 160 ký tự), `tags` (3–5), `date`, `slug`.
Thiếu → `SUGGESTION`, trừ `title` là `BLOCKING`.

**Code block** — có gắn ngôn ngữ; không chứa credential; đường dẫn không lộ tên máy
hay tên người dùng (`/Users/nguyenvana/...` → `~/project/...`).

## Bước 4 — Báo cáo và quyết định

```
=== PUBLISH CHECK: <slug> ===

BLOCKING (3)
  [L1] ... → gợi ý thay thế
  [L2] ...
  [T1] ...

SUGGESTION (2)
  [S1] ...

Kết luận: CHƯA ĐĂNG ĐƯỢC — 3 mục blocking.
```

**Còn `BLOCKING` → không chạy `blog publish`.** Không có ngoại lệ, kể cả khi tác giả
giục. Nếu tác giả khẳng định một mục là an toàn (ví dụ tên dự án đã public), ghi nhận
và bỏ mục đó, nhưng phải là tác giả nói rõ chứ không phải skill tự suy.

## Bước 5 — Publish

Sạch `BLOCKING` rồi:

```bash
node blog/bin/blog.js publish <slug>
```

CLI chuyển `blog/drafts/<slug>/` → `blog/published/<slug>/`, đặt `date`, đổi `status: published`.

Sau đó nhắc tác giả những việc CLI không làm được:
- ảnh còn ở local, cần upload lên nơi lưu trữ ảnh
- nếu có `index.en.md`, đặt canonical link giữa hai bản
- nếu đăng chéo nền tảng, đặt canonical về bản gốc

## Ghi nhận vào `voice.md`

Nếu cùng một loại rò rỉ xuất hiện ở **từ 2 bài trở lên**, đề xuất tác giả thêm nó thành
quy ước cố định trong `voice.md` mục 8 — ví dụ "mọi mã ticket viết dạng `PROJ-NNNN`
ngay từ lúc draft". Sửa ở nguồn rẻ hơn bắt lỗi ở cổng cuối.
