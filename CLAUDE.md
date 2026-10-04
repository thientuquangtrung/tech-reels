# devdraw — kênh TikTok kiến thức lập trình, hình vẽ tay

## Kênh này là gì

Video dọc 30–60s giải thích backend / hệ thống chạy thật (load testing, queue, retry, auth, AI agent…)
bằng sơ đồ kiểu Excalidraw. Tiếng Việt, giọng như đồng nghiệp vẽ bảng trắng giải thích — không giảng bài.

## Nguyên tắc số 1: model suy luận, code đếm

- Claude chỉ viết **nội dung và cấu trúc**: `videos/<id>/script.json`.
- Không bao giờ đưa toạ độ, pixel, frame, thời lượng vào script. Layout, timing, cỡ chữ đều do code tính.
- Script viết xong **bắt buộc** chạy `npm run validate -- <id>`. Lỗi thì sửa script và chạy lại đến khi pass.
  Không được sửa schema hay luật layout để script "lọt" — nếu luật sai, báo người dùng.

## Quy trình một video

1. Người dùng đưa nguyên liệu (link, file, ảnh, mô tả) → skill `idea-intake` ghi `videos/NNN-slug/idea.md`
   → `npm run check-idea -- NNN` đến khi pass. Người dùng đổi `status: approved` khi đã duyệt.
2. Chỉ viết script khi idea `status: approved`. Claude đọc `idea.md` → viết `script.json` → `npm run validate -- NNN` đến khi pass.
3. Claude tự soi lại độ chính xác kỹ thuật, liệt kê chỗ nào đang đơn giản hoá quá mức → người dùng duyệt.
4. (chưa có) `npm run voice -- NNN` → `audio.mp3` + `timings.json`.
5. `npm run studio` → xem preview trong Remotion Studio.
6. `npm run render -- NNN` → `videos/NNN-slug/out.mp4`.

Xem nhanh vài khung hình mà không render cả video: `npm run render -- NNN --still 90,400,800`.

## Viết script.json

Schema: `schema/schema.ts`. Ví dụ chuẩn: `videos/001-one-user/script.json`.

- `voice`: các câu thoại theo thứ tự, mỗi câu một id (`s1`, `s2`…). Câu ngắn, văn nói.
- `scenes[].steps`: mỗi step gắn với một câu thoại (`at`) — "khi đọc câu này thì vẽ/nhấn cái kia".
  Action: `draw` (bắt buộc trước mọi action khác), `highlight`, `dim`, `pulse`, `flow`.
- `hook` ≤ 10 từ, hiện to giữa màn hình trong câu thoại đầu. Đó là lý do câu `s1` thường không vẽ gì.
- `takeaway`: một câu chốt hiện ở cuối.
- Chữ trên hình phải ngắn (label ≤ 22 ký tự) — xem trên điện thoại.

### Layout đã dựng

| layout | dùng khi | luật |
|---|---|---|
| `card+cycle` | "ONE x là gì": một thực thể + vòng lặp hành vi của nó | đúng 1 `actor`, 3–7 `box` theo thứ tự vòng (mũi tên tự nối), ≤1 `note` ở giữa |

Layout còn lại trong schema (`flow`, `compare`, `stack`, `code`) **chưa dựng** — validate sẽ báo lỗi.
Muốn dùng thì phải dựng trước: component trong `src/layouts/`, luật trong `src/layouts/rules.ts`,
đăng ký trong `src/layouts/index.tsx`.

## Cấu trúc repo

- `schema/` — zod schema chung cho mọi video
- `src/` — Remotion: `timeline.ts` (frame), `state.ts` (trạng thái element theo frame),
  `elements/` (nét vẽ tay bằng rough.js), `layouts/`, `theme.ts` (màu, font, vùng an toàn TikTok)
- `.claude/skills/idea-intake/` — nguyên liệu thô → idea.md (khung: `template.md`)
- `scripts/` — `check-idea`, `validate`, `sync` (sinh `src/videos.generated.ts`, đừng sửa tay), `render`
- `videos/NNN-slug/` — `idea.md` (skill idea-intake, người duyệt), `script.json` (Claude), còn lại do code sinh
- `backlog.md` — ý tưởng chưa làm

## Chưa có (làm sau, đúng thứ tự)

1. `scripts/voice.ts` — TTS → audio + `timings.json` (format `[{id, start, end}]` giây). `timeline.ts` đã đọc sẵn.
   Khi chưa có, thời lượng câu được ước lượng theo số từ.
2. Skill `.claude/skills/tiktok-script/` — rút ra sau 3–5 video, khi đã biết hook nào hiệu quả.
3. Agent `.claude/agents/tech-reviewer.md` — khi bắt đầu phải sửa lỗi kỹ thuật thường xuyên.
