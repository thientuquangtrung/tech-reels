# Giọng văn — blog và video

> **File này là file quan trọng nhất trong hệ thống, và là file duy nhất không skill
> nào viết hộ được.** Phần "Đoạn mẫu" bên dưới cần chính tác giả viết tay. Không có
> nó, mọi skill sẽ kéo nội dung về giọng trung tính vô hồn kiểu tài liệu kỹ thuật dịch máy.
>
> Điền được khoảng 60% là đã dùng tốt. Bổ sung dần sau mỗi bài, mỗi video.

| Mục | Blog (viết) | Video (nói) |
|---|---|---|
| 1. Người đọc · 3. Câu chữ · 5. Anti-patterns · 6. Đoạn mẫu | ✓ | ✓ |
| 2. Ngôi · 4. Cấu trúc bài · 7. Style ảnh · 8. Quy ước riêng | ✓ | |
| 9. Văn nói cho video | | ✓ |

Số mục cố định — skill trỏ tới "mục N", đừng đánh số lại. Thêm mục mới thì nối vào cuối.

---

## 1. Người đọc mục tiêu

Dev Việt Nam 1–5 năm kinh nghiệm, đang hoặc sắp đưa AI agent vào quy trình làm việc
thật của team. Họ đã đọc quá nhiều bài demo to-do app và muốn thấy thứ chạy trong
môi trường có ràng buộc thật.

**Giả định được phép có:** biết Git, biết CI/CD là gì, dùng qua ChatGPT/Claude.
**Không được giả định:** đã biết MCP, đã biết agent orchestration, đã đọc bài trước.

## 2. Ngôi và xưng hô

- Xưng **"tôi"**, gọi người đọc là **"bạn"**.
- Không "chúng ta cùng tìm hiểu", không "các bạn ơi".
- Kể chuyện đã xảy ra với mình, không giảng bài.

## 3. Nguyên tắc câu chữ

- Câu ngắn. Trung bình dưới 25 chữ. Câu dài chỉ dùng khi cố ý tạo nhịp.
- Chủ động thay bị động: "tôi tách agent này ra" chứ không "agent này đã được tách ra".
- Đoạn tối đa 5 câu. Đoạn 8 câu là dấu hiệu chưa nghĩ xong.
- Thuật ngữ tiếng Anh giữ nguyên, **không dịch cứng**: giữ `deduplication`, `guardrail`,
  `prompt`, `agent`, `test case`. Đừng viết "khử trùng lặp", "lan can bảo vệ".
- Số liệu phải cụ thể. "Nhanh hơn đáng kể" là câu vô nghĩa.

## 4. Cấu trúc bài quen thuộc

1. Mở bài: một vấn đề cụ thể đã xảy ra với tôi — không định nghĩa, không "trong thời
   đại AI bùng nổ".
2. Bối cảnh vừa đủ để hiểu vấn đề.
3. Cách làm đầu tiên và vì sao nó hỏng.
4. Cách làm hiện tại và đánh đổi kèm theo.
5. Kết: người đọc nên làm khác đi điều gì.

## 5. Anti-patterns — thấy là sửa

Danh sách này dùng trực tiếp làm rule cho `blog-review` Phase 2.

- Mở bài kiểu "Trong thời đại công nghệ 4.0 / AI đang bùng nổ / Như chúng ta đã biết".
- "Không chỉ ... mà còn ...", "đóng vai trò quan trọng", "mang lại nhiều lợi ích".
- "Hãy cùng tìm hiểu", "Hy vọng bài viết hữu ích", "Cảm ơn các bạn đã đọc".
- Liệt kê 3 gạch đầu dòng cân đối một cách đáng ngờ, mỗi gạch một câu dài bằng nhau.
- Câu chuyển đoạn rỗng: "Tiếp theo, chúng ta sẽ đi vào phần...".
- Emoji trong tiêu đề mục.
- Khẳng định không có bằng chứng: "cách này tốt hơn hẳn" mà không nói tốt hơn ở đâu.
- Kết bài bằng lời khuyên chung chung không ai phản đối được.

## 6. Đoạn mẫu — TÁC GIẢ TỰ VIẾT

> Dán vào đây 2–3 đoạn do chính bạn viết, không qua AI. Lấy từ tin nhắn Slack giải
> thích một quyết định kỹ thuật, hoặc mô tả PR, hoặc ghi chú cá nhân cũng được. Càng
> thô càng tốt — mục đích là bắt được nhịp và cách bạn xuống dòng, không phải bản đẹp.

### Mẫu A — giải thích một quyết định kỹ thuật

```
[CẦN TÁC GIẢ ĐIỀN]
```

### Mẫu B — kể lại một lần debug

```
[CẦN TÁC GIẢ ĐIỀN]
```

### Mẫu C — đoạn mở bài bạn thấy ưng

```
[CẦN TÁC GIẢ ĐIỀN]
```

### Mẫu D — một đoạn văn nói (cho video)

Chép lại nguyên văn từ một bản thu âm bạn đã ưng (`video/public/voice/`), kể cả chỗ ngập ngừng.

```
[CẦN TÁC GIẢ ĐIỀN]
```

## 7. Style ảnh chung của blog

Dùng cho mọi prompt sinh ảnh, để các bài nhìn cùng một hệ.

```
Flat minimal technical illustration. Dark background (#1a1a2e).
Single accent color: muted cyan-blue (#4ea8de). Geometric, generous negative space.
No text, no letters, no numbers anywhere in the image. No people, no faces.
No 3D render, no gradients-heavy corporate style, no stock-photo look.
```

- Ảnh bìa: tỉ lệ 16:9.
- Ảnh trong bài: 4:3 hoặc 16:9, không dùng ảnh dọc.

## 8. Quy ước riêng

- Tên viết tắt: lần đầu viết đầy đủ kèm ngoặc — "Model Context Protocol (MCP)" — các
  lần sau dùng viết tắt.
- Code block luôn có ngôn ngữ: ` ```ts `, ` ```bash `.
- Không đặt code block quá 25 dòng trong bài; dài hơn thì trích đoạn + link.
- Tiêu đề mục dùng câu khẳng định, không dùng danh từ cụt: "Vì sao gộp một pha thì
  trùng lặp" tốt hơn "Vấn đề trùng lặp".

## 9. Văn nói cho video

Áp dụng cho `voice` trong `script.json` và hook trong `idea.md`. Luật đếm được (độ dài hook,
label) do `npm run validate` / `check-idea` kiểm, ở đây chỉ ghi phần cần phán đoán.

- Giọng đồng nghiệp đứng cạnh bảng trắng giải thích, không phải giảng bài, không phải quảng cáo.
- Mỗi câu thoại nói được trong một hơi. Câu viết thì đọc được, câu nói thì phải nghe được:
  bỏ ngoặc đơn, không liệt kê quá ba thứ trong một câu.
- Câu đầu đặt người xem vào tình huống rồi hỏi: "Bạn tick đúng một checkbox, mà cả trang render lại. Vì sao?"
  Không chào, không "hôm nay mình sẽ".
- Một video = một ý. Muốn nói thêm ý thứ hai → để dành cho video khác hoặc cho bài blog.
- Thuật ngữ tiếng Anh giữ nguyên như mục 3, đọc theo cách dev Việt hay đọc.
- Không xưng ngôi thứ nhất; gọi người xem là "bạn".
- Câu thoại cuối là một nguyên tắc mang đi được ("Component nghe gì, thì mới nên render vì cái đó."), không phải tóm tắt.
