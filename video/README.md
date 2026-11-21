# devdraw

Video TikTok dọc 30–60s, sơ đồ kiểu vẽ tay, sinh từ JSON bằng Remotion.
Luật viết script cho Claude: xem `CLAUDE.md`. Repo gốc (blog + video): `../CLAUDE.md`.

Code chạy trong devcontainer, `npm ci` tự chạy lúc tạo container. Lệnh dưới đây chạy ở gốc repo hoặc trong `video/` đều được;
từ máy host thì bọc qua mvp-toolkit: `scripts/dc projects/devlog npm run …`.

Lần render đầu Remotion tự tải Chrome Headless Shell (~100MB).

## Quy trình một video

✋ = bạn · 🤖 = Claude · phần còn lại code tự kiểm/tính.

### 1. Ý tưởng
- ✋ Đưa nguyên liệu (link, file, ảnh, mô tả) hoặc chọn một mục `Kênh: video` trong `../ideas/inbox.md`.
- 🤖 Skill `idea-intake` viết `videos/NNN-slug/idea.md`: một ý duy nhất, điểm mấu chốt có nguồn, hook ứng viên, mục cần kiểm.
- 🤖 `npm run check-idea -- NNN` đến khi pass.
- ✋ Duyệt, xử lý các mục "cần kiểm", đổi **`status: approved`**.

### 2. Script
- 🤖 Chỉ viết khi idea đã `approved`: `idea.md` → `script.json` (thoại, scene, step; không có toạ độ hay thời lượng).
- 🤖 `npm run validate -- NNN` đến khi pass (schema + luật layout + tràn khung).
- 🤖 Tự soi độ chính xác kỹ thuật, liệt kê chỗ đang đơn giản hoá quá mức.
- ✋ Duyệt nội dung.

### 3. Chốt hình (chưa tiếng)
```bash
npm run render -- NNN --still 90,400,800   # xem nhanh vài khung hình
npm run studio                             # preview trong Remotion Studio
npm run render -- NNN                      # → out.mp4 chưa tiếng, timing ước lượng theo số từ
```
- ✋🤖 Sửa script/hình/phụ đề rồi render lại, đến khi **bạn chốt**.
  Bản `out.mp4` chưa tiếng này sẽ hiện trên trang thu âm ở bước 4.

### 4. Thu giọng (bước cuối)
- ✋ Kiểm tra mic trước khi thu: System Settings → Sound → Input, chọn đúng mic, Input volume đủ cao.
  Tai nghe jack 3.5mm phải đúng chuẩn CTIA, không thì giọng rất bé còn tiếng phòng lại to.
- ✋ Mở trang thu âm:
  ```bash
  npm run record -- NNN
  ```
  Vào http://127.0.0.1:3123. Mỗi câu thoại hiện kèm đoạn video tương ứng.
  - **Space**: ghi / dừng. Ghi xong tự phát lại kèm hình.
  - **→ / ←**: câu sau / trước. **P**: xem lại đoạn này.
  - Thanh mic nên vượt vạch giữa khi nói. Có cảnh báo thì xem lại mic rồi thu lại câu đó.
  - Code tự cắt tiếng gõ phím + khoảng lặng, chuẩn hoá âm lượng, lưu `public/voice/NNN-slug/sN.mp3`.
    Đủ mọi câu thì ghi `timings.json`.
- ✋ Ctrl+C để tắt server.

Thay thế: ElevenLabs API. Cần credit API riêng, vì credit gói thường chỉ dùng được trên web.
```bash
npm run voice -- NNN        # xem trước câu nào sẽ gen, bao nhiêu ký tự, không gọi API
npm run voice -- NNN --go   # gọi API thật
```
Key đặt ở `ELEVENLABS_API_KEY` trong `.env.local`.

### 5. Render bản cuối
```bash
npm run render -- NNN       # → videos/NNN-slug/out.mp4 có tiếng, hình giãn theo giọng thật
```
- ✋ Xem lại lần cuối rồi đăng.

## Sửa sau khi đã thu giọng

- Sửa câu thoại trong `script.json` thì `sync` báo voice cũ và tạm render không tiếng, để không phát giọng sai.
- Chạy lại `npm run record -- NNN`: trang chỉ đánh dấu những câu cần thu lại.
- Đổi thuật toán cắt khoảng lặng hoặc chuẩn hoá âm lượng thì không cần thu lại: `npm run record -- NNN --reprocess`
  xử lý lại từ bản ghi gốc.

## File trong mỗi video

| file | ai tạo | commit |
|---|---|---|
| `videos/NNN/idea.md` | Claude viết, bạn duyệt | ✓ |
| `videos/NNN/script.json` | Claude | ✓ |
| `public/voice/NNN/*.mp3` + `manifest.json` | trang thu âm / `voice` | ✓ |
| `videos/NNN/timings.json` | code | ✓ |
| `videos/NNN/voice-raw/` (bản ghi gốc) | trang thu âm | ✗ |
| `videos/NNN/out.mp4`, `still-*.png` | render | ✗ |
