---
name: blog-translate-en
description: Viết lại một bài blog tiếng Việt thành bản tiếng Anh (index.en.md) cho độc giả quốc tế — không phải dịch từng câu mà chuyển đổi giả định văn hoá, ví dụ và register. Dùng skill này BẤT CỨ KHI NÀO tác giả nói "dịch bài này sang tiếng Anh", "làm bản EN", "đăng bài này lên dev.to được không", "bài này cho độc giả quốc tế", hoặc muốn có phiên bản tiếng Anh của một bài đã viết. KHÔNG dùng để viết bài mới hay dịch các file nội bộ như voice.md.
---

# blog-translate-en

Tạo `index.en.md`. Chạy theo yêu cầu, không bao giờ tự động.

## Đây không phải dịch

Nếu đầu ra là bản dịch từng câu, skill này thất bại. Bài tiếng Việt của tác giả giả định
người đọc:

- biết Viblo là gì, biết cộng đồng dev Việt vận hành thế nào
- quen văn hoá team Việt: cách nói vòng, cách nêu vấn đề gián tiếp, quan hệ với QA/PO
- đọc được register tiếng Việt kỹ thuật, vốn dài dòng hơn tiếng Anh kỹ thuật một cách tự nhiên

Bản EN phải bỏ hết những giả định đó. Chuyển đổi cần làm:

| Tiếng Việt | Bản EN |
|---|---|
| "team mình" / cách nói vòng, giữ ý | Chủ ngữ rõ, câu thẳng: "we", "I decided" |
| Ví dụ gắn với bối cảnh VN (Viblo, tên công ty VN) | Ví dụ trung lập hoặc giải thích một dòng |
| Câu dài nhiều mệnh đề | Cắt ngắn. Tiếng Anh kỹ thuật ưa câu ngắn hơn nhiều |
| Rào đón lịch sự trước khi nêu vấn đề | Vào thẳng vấn đề |
| Đơn vị/định dạng VN (dd/mm, VNĐ, "cả buổi chiều") | Định dạng quốc tế, thời lượng cụ thể |

## Ràng buộc cứng

- **Không bao giờ ghi đè `index.vi.md`.** Bản tiếng Việt là bản gốc, bất khả xâm phạm.
  Tạo file mới `index.en.md`.
- **Code block giữ nguyên byte-for-byte.** Không dịch comment trong code trừ khi tác giả
  yêu cầu rõ. Không đổi tên biến, tên hàm, tên file.
- **Tên riêng giữ nguyên:** tên người, tên sản phẩm, tên repo, mã ticket đã ẩn danh.
- **Thông báo lỗi và log giữ nguyên.** Người ta search bằng nguyên văn.
- **Không thêm nội dung mới.** Không "tiện thể" bổ sung ý cho bản EN. Hai bản phải nói
  cùng một thứ, nếu không sẽ không đồng bộ được về sau.
- **Không thay đổi luận điểm.**

## Quy trình

### Bước 1 — Kiểm tra điều kiện

Bản tiếng Việt phải đã qua `blog-review` và không còn `BLOCKING`. Dịch một bản nháp chưa
review nghĩa là sẽ phải sửa hai lần. Còn `BLOCKING` → báo và hỏi có chắc muốn dịch không.

Chạy `node blog/bin/blog.js check <slug>` để xác nhận không còn placeholder.

### Bước 2 — Đánh dấu các chỗ cần chuyển đổi

Trước khi viết, liệt kê những chỗ **không dịch thẳng được** và nêu cách xử lý:

```
CULTURAL-ADAPT
  [1] §2 — "đăng lên Viblo" → cần một dòng giải thích, hoặc đổi thành "a local
      dev community platform"
  [2] §4 — "PO bên mình hay đổi yêu cầu giữa sprint" → giữ ý, bỏ hàm ý văn hoá,
      viết thẳng: "requirements changed mid-sprint"
  [3] §5 — "mất cả buổi chiều" → "about four hours"
```

Chỗ nào cần tác giả quyết (ví dụ có nên giữ tên Viblo hay không) thì hỏi. Tối đa 3 câu hỏi.

### Bước 3 — Viết lại theo section

Không dịch tuần tự từng câu. Với mỗi section: đọc hiểu ý, rồi viết lại bằng tiếng Anh
như thể đang viết bài đó lần đầu cho độc giả quốc tế.

**Register tiếng Anh kỹ thuật cần đạt:**
- Câu chủ động, chủ ngữ rõ. "I split the agent" chứ không "The agent was split".
- Câu ngắn. Trung bình 15–20 từ.
- Không rào đón: bỏ "It is worth noting that", "As we all know", "In today's world".
- Không dùng từ hoa mỹ: `leverage` → `use`, `utilize` → `use`, `delve into` → `look at`.
- Đoạn tối đa 4 câu (ngắn hơn bản Việt một chút).
- Thuật ngữ kỹ thuật giữ nguyên như bản Việt — chúng vốn đã là tiếng Anh.

### Bước 4 — Frontmatter và ảnh

```yaml
---
title: "<tiêu đề EN — viết lại, không dịch máy móc>"
slug: <giữ nguyên slug gốc>
lang: en
translated_from: index.vi.md
date: <giữ nguyên>
status: draft
tags: [<tag EN tương ứng>]
---
```

- Marker ảnh `<!-- IMG: img-NN -->` **giữ nguyên vị trí và id** — hai bản dùng chung ảnh.
- `alt` text thì phải viết lại bằng tiếng Anh. Thêm vào `images.md` trường `alt_en`
  cho mỗi ảnh, không sửa `alt` gốc.
- Mermaid diagram: dịch nhãn trong sơ đồ sang tiếng Anh, tạo bản riêng cho `index.en.md`.
- Caption dịch, nhưng `capture_note` là ghi chú nội bộ nên giữ nguyên tiếng Việt.

### Bước 5 — Tự soát

Trước khi kết thúc, đọc lại bản EN và tự hỏi: **đọc như bài viết bởi người bản ngữ, hay
đọc như bài dịch?** Dấu hiệu còn mùi dịch:

- Câu bắt đầu bằng "In this article, we will..."
- Trạng ngữ chỉ thời gian đứng đầu câu quá nhiều: "After that", "Then", "Next"
- Danh từ hoá quá đà: "the implementation of the solution" thay vì "implementing it"
- Cấu trúc "Not only... but also..." (dấu vết dịch từ "không chỉ... mà còn...")
- Câu hỏi tu từ liên tiếp

Có ≥3 dấu hiệu → viết lại các đoạn đó.

### Bước 6 — Báo cáo

```
node blog/bin/blog.js stats <slug>
```

Báo: số chữ EN so với VI (bản EN thường ngắn hơn 10–20%, đó là bình thường và tốt),
những chỗ đã chuyển đổi văn hoá, những chỗ cần tác giả xác nhận.

## Đăng ở đâu

Nhắc tác giả nếu họ chưa nghĩ tới: bản EN và bản VI nên **canonical link** trỏ về nhau
để tránh trùng lặp nội dung trên công cụ tìm kiếm. Nếu đăng chéo nền tảng (dev.to,
Hashnode), đặt canonical về blog gốc.
