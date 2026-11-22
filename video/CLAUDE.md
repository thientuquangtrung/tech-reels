# devdraw — kênh TikTok kiến thức lập trình, hình vẽ tay

## Kênh này là gì

Video dọc 30–60s giải thích backend / hệ thống chạy thật (load testing, queue, retry, auth, AI agent…)
bằng sơ đồ kiểu Excalidraw. Tiếng Việt, giọng như đồng nghiệp vẽ bảng trắng giải thích — không giảng bài.
Giọng thoại: `voice.md` (gốc repo) mục 1, 3, 5, 6, 9.

Đường dẫn trong file này tính từ `video/`. Lệnh `npm run …` chạy được cả ở gốc repo (package.json gốc proxy sang đây).

## Nguyên tắc số 1: model suy luận, code đếm

- Claude chỉ viết **nội dung và cấu trúc**: `videos/<id>/script.json`.
- Không bao giờ đưa toạ độ, pixel, frame, thời lượng vào script. Layout, timing, cỡ chữ đều do code tính.
- Script viết xong **bắt buộc** chạy `npm run validate -- <id>`. Lỗi thì sửa script và chạy lại đến khi pass.
  Không được sửa schema hay luật layout để script "lọt" — nếu luật sai, báo người dùng.

## Quy trình một video

1. Người dùng đưa nguyên liệu (link, file, ảnh, mô tả) hoặc chọn một mục trong `../ideas/inbox.md` → skill `idea-intake` ghi `videos/NNN-slug/idea.md`
   → `npm run check-idea -- NNN` đến khi pass. Người dùng đổi `status: approved` khi đã duyệt.
2. Chỉ viết script khi idea `status: approved`. Claude đọc `idea.md` → viết `script.json` → `npm run validate -- NNN` đến khi pass.
3. Claude tự soi lại độ chính xác kỹ thuật, liệt kê chỗ nào đang đơn giản hoá quá mức → người dùng duyệt.
4. `npm run studio` / `npm run render -- NNN` → video **chưa tiếng**, timing ước lượng theo số từ.
   Sửa script/hình/phụ đề ở bước này cho đến khi người dùng chốt.
5. **Giọng đọc là bước cuối**, chỉ làm khi người dùng đã chốt bước 4:
   - **Tự thu (mặc định):** `npm run record -- NNN` → mở http://localhost:3123. Mỗi câu hiện kèm đoạn `out.mp4`
     tương ứng; Space ghi/dừng, tự cắt lặng đầu/cuối, lưu `public/voice/NNN-slug/sN.mp3`, đủ câu thì ghi `timings.json`.
   - **ElevenLabs API** (cần credit API riêng, credit gói thường chỉ dùng trên web): `npm run voice -- NNN` xem trước
     số ký tự, `--go` mới gọi API. Claude **không tự chạy `--go`** khi chưa được người dùng đồng ý.
6. `npm run render -- NNN` → `videos/NNN-slug/out.mp4` có tiếng, hình chạy theo thời lượng thật.

Xem nhanh vài khung hình mà không render cả video: `npm run render -- NNN --still 90,400,800`.

## Viết script.json

Schema: `schema/schema.ts`. Ví dụ chuẩn: `videos/001-one-user/script.json`.

- `voice`: các câu thoại theo thứ tự, mỗi câu một id (`s1`, `s2`…). Câu ngắn, văn nói.
- `scenes[].steps`: mỗi step gắn với một câu thoại (`at`) — "khi đọc câu này thì vẽ/nhấn cái kia".
  Action: `draw` (bắt buộc trước mọi action khác), `highlight`, `dim`, `pulse`, `flow`.
- `hook` ≤ 10 từ, hiện to giữa màn hình trong câu thoại đầu. Đó là lý do câu `s1` thường không vẽ gì.
- `takeaway`: một câu chốt hiện ở cuối.
- Chữ trên hình phải ngắn (label ≤ 22 ký tự) — xem trên điện thoại.
- Số liệu: dùng số thật trong `idea.md` nếu có; không có thì đặt số minh hoạ gây ấn tượng nhưng hợp lý,
  nói như một kịch bản ("Bạn chạy load test 1000 virtual user…"), không nói như kết quả đã đo.
  Luật đầy đủ: `../CLAUDE.md` mục 2.

### Layout đã dựng

| layout | dùng khi | luật |
|---|---|---|
| `card+cycle` | "ONE x là gì": một thực thể + vòng lặp hành vi của nó | đúng 1 `actor`, 3–7 `box` theo thứ tự vòng (mũi tên tự nối), ≤1 `note` ở giữa |
| `compare` | sai vs đúng, nửa trên / nửa dưới | đúng 2 `verdict` (một wrong, một right), element đầu là verdict; element sau mỗi verdict thuộc nửa đó. Mỗi nửa: ≤1 `code`, ≤3 `box` (một hàng), ≤1 `note`, có ít nhất code hoặc box. Không `actor`/`arrow`/`flow`. Tràn khung → validate báo |

Layout còn lại trong schema (`flow`, `stack`, `code`) **chưa dựng** — validate sẽ báo lỗi.
Muốn dùng thì phải dựng trước: component trong `src/layouts/`, luật trong `src/layouts/rules.ts`,
đăng ký trong `src/layouts/index.tsx`.

## Cấu trúc `video/`

- `schema/` — zod schema chung cho mọi video
- `src/` — Remotion: `timeline.ts` (frame), `state.ts` (trạng thái element theo frame),
  `elements/` (nét vẽ tay bằng rough.js), `layouts/`, `theme.ts` (màu, font, vùng an toàn TikTok)
- `../.claude/skills/idea-intake/` — nguyên liệu thô / mục inbox → idea.md (khung: `template.md`)
- `scripts/` — `check-idea`, `validate`, `sync` (sinh `src/videos.generated.ts`, đừng sửa tay), `render`, `record` (+ `record.html`), `voice`
- `public/voice/NNN-slug/` — mp3 từng câu thoại + `manifest.json` (text đã đọc, thời lượng, nguồn). Commit vào git.
  Sửa câu thoại sau khi đã có giọng → `sync` cảnh báo và tạm bỏ tiếng; `record` đánh dấu câu cần thu lại, `voice --go` chỉ gen lại câu đã sửa.
  Key: `ELEVENLABS_API_KEY` trong `.env.local` (gitignore); đổi giọng/model qua `ELEVENLABS_VOICE_ID` / `ELEVENLABS_MODEL_ID`.
- `videos/NNN-slug/` — `idea.md` (skill idea-intake, người duyệt), `script.json` (Claude), còn lại do code sinh
- Ý tưởng chưa làm: `../ideas/inbox.md`, mục có `Kênh: video …`

## Chưa có (làm sau, đúng thứ tự)

1. Skill `../.claude/skills/tiktok-script/` — rút ra sau 3–5 video, khi đã biết hook nào hiệu quả.
2. Agent `../.claude/agents/tech-reviewer.md` — khi bắt đầu phải sửa lỗi kỹ thuật thường xuyên.
