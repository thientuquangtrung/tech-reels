# devlog — blog + video kỹ thuật tiếng Việt

Một nguồn ý tưởng, hai kênh:

- **Blog** (`blog/`): bài dài, kể đủ bối cảnh, cách đầu hỏng, cách sau và đánh đổi. Chi tiết: `blog/CLAUDE.md`.
- **Video devdraw** (`video/`): TikTok dọc 30–60s, sơ đồ vẽ tay sinh bằng Remotion, một video một ý. Chi tiết: `video/CLAUDE.md`.

Người đọc/xem chung: dev Việt Nam, đang làm hệ thống chạy thật (backend, frontend, AI agent).

## Nguyên tắc chung

1. **Model suy luận, code đếm.** Đếm chữ, slugify, kiểm layout, tính thời lượng, quét rò rỉ — đều là việc của CLI
   (`node blog/bin/blog.js`, `npm run validate`, `npm run check-idea`…). Không tự làm phần việc của CLI,
   không sửa luật/schema để nội dung "lọt" — luật sai thì báo người dùng.
2. **Không bịa sự kiện.** Blog: thiếu số liệu thì `[CẦN SỐ LIỆU]`. Video: sự thật kỹ thuật phải có `[nguồn N]`,
   chưa có nguồn thì vào "Cần kiểm".
3. **Không tự động sang bước sau.** Mỗi skill dừng ở đầu ra của mình và hỏi. Không tự `publish`, không tự `voice --go`.
4. **`voice.md` là nguồn chuẩn về giọng.** Bảng đầu file ghi kênh nào đọc mục nào. Số mục cố định, đừng đánh số lại.

## Routing

| Người dùng nói gì | Route tới | Đầu ra |
|---|---|---|
| "vừa fix xong X", "ghi lại ý này", "cái này làm video/viết blog được" | `capture` | thêm mục vào `ideas/inbox.md` |
| "ý này viết được không", "lên outline", "nên viết bài gì tiếp" | `blog-angle` | `PASS`/`REJECT`/`MERGE` + `blog/drafts/<slug>/outline.md` |
| "viết bài này đi", "bài này cần ảnh gì" | `blog-draft` | `index.vi.md` + `images.md` |
| "review bài này", "đoạn 3 dài quá" | `blog-review` | `review-log.md` / sửa nhắm đích |
| "làm bản EN" | `blog-translate-en` | `index.en.md` |
| "chuẩn bị đăng bài" | `blog-publish-check` | báo cáo rò rỉ + checklist |
| dán link/tài liệu, "làm video về cái này", "làm video gì tiếp" | `idea-intake` | `video/videos/NNN-slug/idea.md` |
| idea đã `approved`, "viết script" | theo `video/CLAUDE.md` | `script.json` |

**Khi mơ hồ** (chỉ dán một link mà không nói làm gì): hỏi một câu — lưu lại (`capture`), làm video (`idea-intake`)
hay viết bài (`blog-angle`) — rồi mới route.

## Ý tưởng đi qua hai kênh

```
              ┌→ blog-angle → blog/drafts/<slug>/ → blog/published/<slug>/
capture → ideas/inbox.md
              └→ idea-intake → video/videos/NNN-slug/ → out.mp4
```

Mỗi mục inbox có `Kênh` (`blog` / `video (...)` / `cả hai` / `?`) và, khi đã dùng, `Đã thành: <đường dẫn>`.
Mục `cả hai` mới có một đường dẫn vẫn là ứng viên cho kênh còn lại.

## Cấu trúc

```
├── CLAUDE.md  voice.md  package.json   # package.json gốc chỉ proxy lệnh sang video/ và blog/
├── ideas/inbox.md                      # hàng đợi ý tưởng chung
├── .claude/skills/                     # capture, idea-intake, blog-*
├── blog/                               # bin/blog.js, drafts/, published/
└── video/                              # module Node riêng: Remotion, schema, scripts, videos/, public/voice/
```

## Chạy lệnh

Mọi lệnh chạy ở gốc repo, **bên trong devcontainer** (repo này nằm trong mvp-toolkit, máy host không chạy code dự án).
Từ gốc mvp-toolkit:

```bash
scripts/dc projects/devlog npm run blog -- status
scripts/dc projects/devlog npm run validate -- 002
scripts/dc projects/devlog npm run render -- 002 --still 90,400
```

Remotion Studio: `npm run studio` → http://127.0.0.1:3010. Trang thu âm: `npm run record -- NNN` → http://127.0.0.1:3123
(mở trên trình duyệt của máy host để dùng mic). Git commit/push làm trên host.
