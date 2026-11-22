---
name: blog-draft
description: Viết bản nháp tiếng Việt (index.vi.md) từ outline.md, và lập kế hoạch ảnh vào images.md kèm prompt sinh ảnh. Dùng skill này BẤT CỨ KHI NÀO tác giả nói "viết bài này đi", "draft từ outline", "viết tiếp phần sau", "viết giúp phần mở bài", "bài này cần ảnh gì", "lên plan ảnh", hoặc muốn biến một outline đã chốt thành bài viết. KHÔNG dùng khi chưa có outline — chạy blog-angle trước.
---

# blog-draft

Viết bản nháp tiếng Việt và lập kế hoạch ảnh. Đầu ra: `index.vi.md` + `images.md`.

## Nguyên tắc chi phối

Tác giả cung cấp **dữ kiện**, skill lo **câu chữ**. Nếu skill hỏi tác giả từng câu văn, nó vô dụng.

Cụ thể:
- Thông báo lỗi, tên hàm, tên file, kết quả đo thật, mốc thời gian → phải đến từ tác giả.
- Số liệu → thật trước, minh hoạ sau (`CLAUDE.md` gốc repo, mục 2). Hỏi số thật trong FACT-GAP;
  tác giả không có thì đặt số minh hoạ gây ấn tượng nhưng hợp lý, viết câu thành kịch bản
  ("giả sử bảng có 500 row…") và gắn `<!-- minh hoạ -->` cuối dòng.
- Không viết số tự đặt thành kết quả của tác giả ("team mình giảm 70%…"). Không viết "đáng kể",
  "khoảng 30%" mơ hồ — hoặc số thật, hoặc kịch bản minh hoạ có số cụ thể.

## Chuẩn bị

Đọc theo thứ tự, trước khi viết chữ nào:
1. `voice.md` — giọng văn và danh sách anti-patterns
2. `blog/drafts/<slug>/outline.md` — luận điểm và cấu trúc
3. `blog/drafts/<slug>/idea.md` — dữ kiện gốc từ capture

Thiếu `outline.md` → dừng, bảo tác giả chạy `blog-angle`.
`voice.md` còn `[CẦN TÁC GIẢ ĐIỀN]` hoặc `GỢI Ý — CHƯA DUYỆT` ở mục 6 → vẫn viết được, nhưng báo
trước rằng giọng văn sẽ trung tính hơn mong đợi cho tới khi tác giả điền/sửa mục đó.

---

## Phase 0 — Fact interview (bắt buộc, không bỏ qua)

Quét outline, liệt kê mọi chỗ cần dữ kiện mà skill **không thể tự biết**. Phân hai mức:

- **`BLOCKING`** — thiếu thì không viết được section đó một cách trung thực
- **`OPTIONAL`** — thiếu thì viết chung chung hơn, chấp nhận được

Trình bày một lượt, đánh số, kèm gợi ý dạng dữ liệu mong muốn:

```
FACT-GAP (BLOCKING)
  [1] §3 — lỗi cụ thể là gì? (paste nguyên văn error/log, càng thô càng tốt)
  [2] §3 — trước khi sửa, tỉ lệ trùng lặp thực tế khoảng bao nhiêu?
  [3] §4 — đã thử cách nào khác trước khi chọn cách này?

FACT-GAP (OPTIONAL)
  [4] §2 — dự án chạy được bao lâu rồi?
  [5] §5 — có ai trong team phản đối cách này không?
```

Tác giả trả lời gạch đầu dòng, sai chính tả, tiếng Việt không dấu — đều chấp nhận.

**Quy tắc cứng:** không có câu trả lời cho một mục `BLOCKING`:
- Mục là **số liệu** → viết lại đoạn đó thành kịch bản minh hoạ với số tự đặt, gắn `<!-- minh hoạ -->`.
- Mục là **thông báo lỗi, tên hàm, kết quả đo thật** mà bài không thể kể khác đi → viết
  `[CẦN SỐ LIỆU: mô tả cụ thể cần gì]` ngay tại chỗ. `blog-review` sẽ chặn bài nếu placeholder còn sót.

Tác giả nói "cứ viết đi, số liệu điền sau" → vẫn viết theo hai luật trên, nhắc lại chỗ nào đang minh hoạ.

---

## Phase 1 — Viết theo cụm, có checkpoint

**Không xuất cả bài một lần.** Viết theo cụm 2–3 section rồi dừng hỏi:
*"Giọng thế này ổn chưa — đi tiếp hay chỉnh?"*

Lý do thực dụng: giọng lệch từ đầu mà viết một mạch 2000 chữ thì phải sửa cả bài; dừng
sớm chỉ sửa 300 chữ.

Thứ tự viết:
1. Cụm thân bài đầu (§2–§3) — checkpoint
2. Cụm thân bài sau (§4–§5) — checkpoint
3. Kết bài
4. **Mở bài viết sau cùng**, khi đã biết bài thật sự nói gì
5. Tiêu đề và mô tả frontmatter

Mở bài viết cuối là mẹo cũ nhưng hiệu quả nhất: mở bài viết trước luôn hứa hẹn thứ mà
phần còn lại không giao được.

### Quy tắc khi viết

- Bám `voice.md`. Trước khi kết thúc mỗi cụm, tự soát lại danh sách anti-patterns ở
  mục 5 của file đó.
- Mỗi section phải phục vụ luận điểm ở đầu `outline.md`. Section nào viết ra mà không
  chỉ được nó phục vụ luận điểm thế nào thì cắt và báo tác giả.
- Code block lấy từ dữ kiện tác giả cung cấp. **Không sinh code minh hoạ tưởng tượng.**
  Cần ví dụ mà không có code thật → hỏi.
- Không thêm phần "Kết luận" tóm tắt lại bài. Kết bài phải nói điều mới: người đọc nên
  làm gì khác đi.
- Giữ nguyên thuật ngữ tiếng Anh theo `voice.md` mục 3.

### Frontmatter

CLI đã sinh sẵn khung. Điền `title`, `description` (1 câu, dưới 160 ký tự), `tags`
(3–5 tag), giữ nguyên `slug`, `lang`, `status`.

---

## Phase 2 — Image planning

Không phải ảnh nào cũng nên generate. Phân loại trước, xử lý sau.

| Loại | Xử lý | Vì sao |
|---|---|---|
| `DIAGRAM` | Sinh **Mermaid** hoặc SVG inline ngay trong bài | Ảnh AI generate chữ luôn méo, không sửa được, không version control được. Diagram kỹ thuật mà chữ sai thì vô dụng. |
| `SCREENSHOT` | Ghi TODO cho tác giả tự chụp | Không được generate. Ảnh giả mạo screenshot là sai về mặt trung thực với người đọc. |
| `ILLUSTRATION` | Sinh prompt tiếng Anh cho tool generate | Đây mới đúng chỗ dùng AI image |

**Ngân sách:** tối đa 1 ảnh / 400 chữ. Mỗi ảnh phải qua được câu hỏi *"bỏ ảnh này thì
người đọc mất thông tin gì?"* — không trả lời được thì cắt. Ảnh trang trí xen giữa làm
loãng bài kỹ thuật, không làm nó dễ đọc hơn.

Với bài kỹ thuật điển hình, tỉ lệ thực tế thường là: 1 ILLUSTRATION (ảnh bìa) +
1–2 DIAGRAM + 0–2 SCREENSHOT.

### Marker trong bài

Chỉ đặt marker gọn, không nhúng spec:

```markdown
<!-- IMG: img-02 -->
```

`DIAGRAM` thì đặt marker rồi để code Mermaid ngay dưới.

### Manifest `images.md`

```yaml
- id: img-01
  type: ILLUSTRATION
  status: TODO              # TODO | GENERATED | APPROVED
  section: "§1 Mở bài"
  purpose: "Ảnh bìa — gợi ý ý niệm agent tự rà soát kết quả của chính nó"
  prompt: >
    Flat minimal technical illustration. Dark background (#1a1a2e).
    Single accent color muted cyan-blue (#4ea8de). Two nested geometric shapes,
    the inner one mirroring the outer. Generous negative space.
    No text, no letters, no numbers. No people. 16:9.
  alt: "Minh hoạ trừu tượng về việc agent tự rà soát kết quả của chính nó"
  caption: ""

- id: img-02
  type: DIAGRAM
  status: INLINE
  section: "§3 Kiến trúc hai pha"
  purpose: "Cho thấy vì sao gộp một pha thì sinh trùng lặp"
  source: mermaid
  alt: "Sơ đồ luồng hai pha: liệt kê trước, phân loại sau"

- id: img-03
  type: SCREENSHOT
  status: NEEDS_CAPTURE
  section: "§5 Kết quả"
  purpose: "Output thật của agent sau khi sửa"
  capture_note: "Chụp terminal. Che mã ticket thật, che tên project, che tên đồng nghiệp."
  alt: "Kết quả chạy agent sau khi tách hai pha"
```

### Quy tắc manifest

- **`alt` bắt buộc với mọi ảnh.** Accessibility và SEO đều cần, và nếu skill không ép
  thì sẽ không bao giờ có.
- **`prompt` viết bằng tiếng Anh**, kể cả bài tiếng Việt — tool generate ăn tiếng Anh
  tốt hơn hẳn. Luôn kèm dòng style chung ở `voice.md` mục 7 để các bài nhìn cùng hệ.
- **Prompt luôn có `No text, no letters, no numbers`.** Chữ trong ảnh AI gần như luôn sai.
- `capture_note` phải liệt kê cụ thể thứ cần che — dòng này nối thẳng sang
  `blog-publish-check`, mọi `SCREENSHOT` tự động thành mục kiểm tra rò rỉ.

### Đối chiếu

Chạy `node blog/bin/blog.js images <slug>` để kiểm marker trong bài khớp manifest.

Bài có `DIAGRAM` dạng Mermaid → chạy `node blog/bin/blog.js diagrams <slug>` (trong devcontainer) để có
thêm bản PNG `<id>.png` cạnh bài. Tác giả dùng PNG thay khối mermaid khi đăng lên nền tảng không render
Mermaid. Sửa sơ đồ thì chạy lại — `images` sẽ cảnh báo khi PNG cũ hơn bài.
Lần đầu trong container cần Chrome headless: `npm --prefix video exec remotion browser ensure`.
Lệch thì sửa, đừng bỏ qua — marker mồ côi sẽ lộ ra trong bản đăng.

---

## Kết thúc

Chạy `node blog/bin/blog.js stats <slug>` rồi báo gọn:
- số chữ, thời gian đọc
- số `[CẦN SỐ LIỆU]` còn sót
- những câu đang dùng số minh hoạ (để tác giả thay bằng số thật nếu có)
- số ảnh theo từng loại, số ảnh còn `TODO` / `NEEDS_CAPTURE`

**Không tự chạy `blog-review`.** Hỏi tác giả có muốn review không.

## Chế độ chỉ chạy Phase 2

Khi tác giả nói "bài này cần ảnh gì" mà `index.vi.md` đã có nội dung: bỏ qua Phase 0 và 1,
đọc bài hiện có, chạy thẳng Phase 2.

## Chế độ viết tiếp

Khi tác giả nói "viết tiếp": đọc `index.vi.md` hiện tại, xác định section cuối đã viết
xong, viết tiếp từ đó. **Không viết lại phần đã có** trừ khi được yêu cầu — tác giả có
thể đã sửa tay và sửa đó phải được tôn trọng.
