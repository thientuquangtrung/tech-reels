# Blog workspace

Kho blog cá nhân. Ngôn ngữ mặc định: **tiếng Việt**. Bản tiếng Anh chỉ tồn tại khi
được yêu cầu rõ ràng, và là bản viết lại chứ không phải bản dịch.

## Nguyên tắc nền

1. **Deterministic ra CLI, phán đoán ra skill.** Mọi thứ đếm được, chuyển được,
   kiểm được bằng regex thì gọi `bin/blog.js`. Không tự đếm chữ, không tự tính
   reading time, không tự slugify.
2. **Không bịa sự kiện.** Blog này viết về công việc có thật. Số liệu, thông báo lỗi,
   tên hàm, kết quả — nếu không có trong input của tác giả thì để `[CẦN SỐ LIỆU]`,
   tuyệt đối không điền cho mượt.
3. **Không tự động sang bước sau.** Mỗi skill dừng đúng ở đầu ra của mình và hỏi.
   Capture xong không viết bài. Draft xong không tự review. Review xong không tự đăng.
4. **`voice.md` là nguồn chuẩn về giọng văn.** Skill nào sinh hoặc sửa câu chữ tiếng
   Việt đều phải đọc nó trước.

## Routing

Bảng routing chung (cả blog lẫn video) nằm ở `../CLAUDE.md`. Skill blog: `blog-angle`, `blog-draft`,
`blog-review`, `blog-translate-en`, `blog-publish-check`; ý tưởng vào qua `capture` (chung).

Đường dẫn trong file này và trong skill tính từ gốc repo.

## Vòng đời một bài

```
ideas/inbox.md  →  blog/drafts/<slug>/  →  blog/published/<slug>/
   capture          angle → draft → review → publish-check
                            ↕ translate-en (tuỳ chọn, bất cứ lúc nào sau review)
```

## Cấu trúc thư mục

```
├── voice.md                    # gốc repo — giọng văn, tác giả viết tay, skill chỉ đọc
├── ideas/inbox.md              # gốc repo — hàng đợi ý tưởng chung với video
└── blog/
    ├── CLAUDE.md
    ├── bin/blog.js             # CLI deterministic
    ├── drafts/<slug>/
    │   ├── idea.md             # mục đã tách khỏi inbox
    │   ├── outline.md          # từ blog-angle
    │   ├── index.vi.md         # bản chính
    │   ├── index.en.md         # chỉ khi được yêu cầu
    │   ├── images.md           # manifest ảnh
    │   └── review-log.md       # lịch sử review, để thấy lỗi lặp lại
    └── published/<slug>/
```

## CLI

`npm run blog -- <lệnh>` tương đương `node blog/bin/blog.js <lệnh>`.

```bash
node blog/bin/blog.js new "<tiêu đề>"   # slugify + scaffold thư mục draft
node blog/bin/blog.js status            # bảng trạng thái mọi bài
node blog/bin/blog.js stats <slug>      # số chữ, thời gian đọc, số ảnh
node blog/bin/blog.js images <slug>     # đối chiếu marker trong bài ↔ manifest
node blog/bin/blog.js links <slug>      # liệt kê link, cảnh báo link nội bộ
node blog/bin/blog.js check <slug>      # quét rò rỉ + placeholder còn sót
node blog/bin/blog.js publish <slug>    # drafts/ → published/, đóng dấu ngày
```

Mọi skill gọi CLI thay vì tự làm phần việc của CLI.
