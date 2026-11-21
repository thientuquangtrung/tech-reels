# Kế hoạch gộp devdraw + blog-system thành một repo

> Trạng thái: **đã làm** 2026-11-21. Quyết định: tên `devlog`; chưa tính nơi đăng blog; bật hết skill ngay.

## 1. Vì sao gộp

Hai hệ thống đang làm cùng một việc cho cùng một người đọc, chỉ khác đầu ra:

| | devdraw | blog-system |
|---|---|---|
| Người đọc | dev VN, backend/hệ thống chạy thật | dev VN 1–5 năm, đưa AI vào công việc thật |
| Nguyên liệu | report sửa bug, link, tài liệu (`master-constraint-*-report.md`…) | chuyện vừa fix/vừa quyết định trong công việc |
| Nguyên tắc | "model suy luận, code đếm" — `validate`, `check-idea` | "deterministic ra CLI, phán đoán ra skill" — `bin/blog.js` |
| Không bịa | điểm mấu chốt phải có `[nguồn N]`, còn lại vào "Cần kiểm" | thiếu số liệu thì ghi `[CẦN SỐ LIỆU]` |
| Hàng đợi ý | `backlog.md` + `videos/NNN/idea.md` | `ideas/inbox.md` |
| Đầu ra | video 30–60s | bài viết dài |

Một lần fix bug cho ra cả hai thứ: video nói **một** ý gây chú ý, bài blog kể **đủ** bối cảnh, cách làm hỏng và đánh đổi.
Hiện tại hai repo ghi ý tưởng ở hai nơi, nên cùng một nguồn bị phân tích hai lần và không ai biết ý nào đã thành video hay bài.

## 2. Đề xuất: một repo, chia theo kênh, dùng chung ý tưởng và giọng văn

Lấy repo `devdraw` (đã có git history, remote `tech-reels`) làm gốc. blog-system chưa có git nên chỉ cần copy vào.

```
devdraw/                         # (đổi tên? xem mục 6)
├── CLAUDE.md                    # routing chung: ý tưởng → blog / video / cả hai
├── voice.md                     # phần chung + "## Viết (blog)" + "## Nói (video)"
├── ideas/
│   └── inbox.md                 # hàng đợi DUY NHẤT (gộp backlog.md vào đây)
├── video/                       # = devdraw hiện tại, chuyển vào bằng git mv
│   ├── schema/  src/  scripts/  public/
│   └── videos/NNN-slug/         # idea.md, script.json, timings.json
├── blog/                        # = blog-system hiện tại
│   ├── bin/blog.js
│   ├── drafts/<slug>/
│   └── published/<slug>/
├── .claude/skills/              # skill của cả hai kênh, đều được load
│   ├── capture/                 # gộp blog-capture + phần "ghi vào backlog" của idea-intake
│   ├── idea-intake/             # (video) đổi đường dẫn
│   └── blog-angle/ blog-draft/ blog-review/ blog-translate-en/ blog-publish-check/
├── package.json                 # ở gốc; thêm script "blog": "node blog/bin/blog.js"
└── .devcontainer/               # một container cho cả repo
```

### Vì sao chia theo kênh, không theo chủ đề

Phương án khác là `content/<slug>/{idea.md, blog/, video/}`: một chủ đề một thư mục, chứa cả hai đầu ra.
Mình **không** chọn vì:

- Script của video giả định `videos/NNN-slug` (đánh số NNN, `npm run render -- 001`, `public/voice/NNN-slug`),
  còn `blog.js` giả định `drafts/` → `published/`. Chia theo chủ đề nghĩa là viết lại cả hai bộ công cụ.
- Phần lớn ý tưởng chỉ hợp **một** kênh (blog "tách deduplication thành hai pha" khó làm video 40s).
  Nối hai kênh bằng một liên kết là đủ, không cần chung một thư mục.

Nếu sau 10–15 nội dung thấy đa số chủ đề đều làm cả hai thì mới tính lại.

## 3. Điểm nối giữa hai kênh

**Một inbox, gắn kênh cho từng mục.** Thêm trường `Kênh` vào schema của `ideas/inbox.md`:

```md
## [RAW] 2026-11-21 — useFieldArray append 1 row → cả bảng re-render
- **Kênh:** video | blog | cả hai | ?
- **Nguồn:** master-constraint-rerender-fix-report.md
- ... (giữ các trường cũ của blog-capture)
- **Đã thành:** video/videos/004-field-array-rerender · blog/drafts/use-field-array-rerender
```

- `capture` chỉ ghi, kênh không rõ thì để `?`, giữ đúng ràng buộc "dưới 3 phút".
- Gợi ý chọn kênh: dạng "sai vs đúng" / "ONE x" / con số ngược trực giác → video. Dạng "cách đầu hỏng, cách sau có đánh đổi" → blog.
- `blog-angle` và `idea-intake` đều **lấy từ inbox** và ghi ngược lại vào `Đã thành`.
  Như vậy biết được ý nào đã dùng, ở kênh nào.
- Các dòng trong `backlog.md` chuyển thành mục `[RAW]` có `Kênh: video` và giữ nhãn series/layout.

**Chuyển ý giữa hai kênh (về sau, không làm ngay):** một skill `repurpose` biến bài blog đã publish thành `idea.md` cho video
(chọn một ý, đề xuất layout), hoặc ngược lại. Chỉ làm sau khi đã chuyển tay 2–3 lần và thấy lặp lại.

## 4. Gộp voice.md

`voice.md` của blog đã có phần dùng được cho cả hai: người đọc, giữ thuật ngữ tiếng Anh, số liệu cụ thể, anti-pattern.
Tách thành:

1. **Chung:** người đọc, thuật ngữ, không bịa, anti-pattern (mục 1, 3, 5 hiện tại).
2. **Viết (blog):** xưng "tôi/bạn", cấu trúc bài 5 phần, độ dài đoạn.
3. **Nói (video):** lấy từ `CLAUDE.md` của devdraw — văn nói, câu ngắn, "đồng nghiệp vẽ bảng trắng", hook ≤ 10 từ, label ≤ 22 ký tự.
4. **Đoạn mẫu tác giả tự viết:** vẫn để trống cho bạn điền, kèm 1 đoạn văn nói (chép lại từ bản thu âm thật).

Skill blog đọc 1+2+4, `idea-intake` và lúc viết `script.json` đọc 1+3+4.

## 5. Các bước thực hiện

| # | Việc | Ghi chú |
|---|---|---|
| 1 | Revoke token đang nằm trong URL remote, đặt lại remote không có token | làm trước khi động vào git |
| 2 | Commit nốt thay đổi đang dở trong devdraw (`public/`, `timings.json`) | để bước 3 có điểm quay về |
| 3 | `git mv` mã video vào `video/` (schema, src, scripts, public, videos) | giữ history. Sửa path trong `package.json`, `tsconfig.json`, `.gitignore`, `scripts/lib.ts` |
| 4 | Copy blog-system vào `blog/`; `voice.md` và `ideas/` lên gốc; `skills/` vào `.claude/skills/` | blog-system không có git nên copy là xong |
| 5 | Sửa đường dẫn trong 6 SKILL.md của blog (~32 chỗ: `bin/blog.js`, `drafts/`, `ideas/inbox`, `voice.md`) và trong `idea-intake` | blog.js: đặt thư mục gốc theo vị trí file thay vì `cwd` |
| 6 | Gộp `backlog.md` vào `ideas/inbox.md`, thêm trường `Kênh` / `Đã thành` | |
| 7 | Tách `voice.md` theo mục 4 | |
| 8 | Viết `CLAUDE.md` mới: phần chung + bảng routing gộp + trỏ tới `video/` và `blog/` để xem chi tiết | phần lớn nội dung hai CLAUDE.md cũ chuyển vào đó |
| 9 | `scripts/dc init` cho repo, thêm Chromium vào Dockerfile để Remotion render được | trang thu âm dùng cổng 3123, cần publish cổng này |
| 10 | Kiểm tra: `validate`/`render --still` cho 001 và 002, `npm run blog -- status`, thử capture 1 ý → video và 1 ý → blog | |

Bước 1–2 làm trên host (git). Bước 9–10 chạy trong container.

## 6. Cần bạn quyết

1. **Tên repo.** `devdraw` là tên kênh video, `tech-reels` (remote) thì chỉ nói về video.
   Repo chứa cả blog thì nên đổi tên chung hơn, ví dụ `devdraw` (thương hiệu chung cho cả hai), `devlog`, hoặc `tech-content`.
2. **Blog publish ra đâu?** Hiện `published/` chỉ là thư mục. Nếu sau này dùng Astro/Next để render blog,
   nó sẽ thành một module thứ ba (`site/`). Nên quyết trước khi đặt tên thư mục `blog/`.
3. **Thứ tự bật skill blog.** README của blog-system đề nghị bật dần theo tuần. Sau khi gộp, skill nằm trong `.claude/skills/`
   nên **bật hết ngay**. Muốn giữ lộ trình bật dần thì để các skill chưa dùng ở `blog/skills-later/`.
