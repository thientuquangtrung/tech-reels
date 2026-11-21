# Blog

Bộ skill + CLI cho blog kỹ thuật tiếng Việt, có đường dịch sang tiếng Anh tuỳ bài.
Luật cho Claude: `CLAUDE.md`. Repo gốc (blog + video): `../CLAUDE.md`.

## Việc bạn phải tự làm

**Điền `voice.md` mục 6** (ở gốc repo) — 2–3 đoạn do chính bạn viết tay. Không skill nào làm hộ được.

## Skill

Đều nằm trong `../.claude/skills/` và đã bật: `capture` (chung với video), `blog-angle`, `blog-draft`,
`blog-review`, `blog-translate-en`, `blog-publish-check`.

## CLI

Không cần cài package. Chạy ở gốc repo (trong devcontainer):

    npm run blog -- new "<tiêu đề>"
    npm run blog -- status
    npm run blog -- stats <slug>
    npm run blog -- images <slug>
    npm run blog -- links <slug>
    npm run blog -- check <slug>
    npm run blog -- publish <slug>
