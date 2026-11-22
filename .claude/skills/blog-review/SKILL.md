---
name: blog-review
description: Review bản nháp blog theo hai phase (cấu trúc/luận điểm, rồi câu chữ/giọng văn), phân loại BLOCKING và SUGGESTION, ghi review-log.md. Dùng skill này BẤT CỨ KHI NÀO tác giả nói "review bài này", "đọc giúp xem sao", "bài này ổn chưa", "góp ý giúp", hoặc chỉ ra một chỗ cần sửa như "đoạn mở bài chán quá", "phần 3 dài dòng", "câu này nghe AI quá". KHÔNG dùng để viết bài mới hay dịch sang tiếng Anh.
---

# blog-review

Review bản nháp và sửa. Hai đường sửa, chọn theo ý định của tác giả.

## Chọn đường trước khi làm gì khác

**Fix Path A — review đầy đủ.** Kích hoạt khi tác giả nói chung chung: "review bài này",
"đọc giúp", "ổn chưa". Chạy đủ Phase 1 → Phase 2 → báo cáo → sửa → re-verify toàn bài.

**Fix Path B — sửa nhắm đích.** Kích hoạt khi tác giả chỉ rõ chỗ cần sửa: "mở bài chán
quá", "đoạn 3 rút ngắn lại". Bỏ qua review toàn bài, sửa đúng chỗ đó, re-verify **giới
hạn trong phạm vi đã sửa cộng đoạn liền kề** (vì sửa một đoạn thường làm hỏng câu chuyển
đoạn bên cạnh).

Không rõ tác giả muốn gì → hỏi một câu. Chạy Path A khi tác giả chỉ muốn sửa một đoạn là
lãng phí; chạy Path B khi tác giả muốn review tổng thể là bỏ sót.

## Chuẩn bị

Đọc `voice.md`, `outline.md` (để biết luận điểm gốc), `review-log.md` (để biết lỗi nào
tác giả hay lặp). Chạy `node blog/bin/blog.js stats <slug>`.

---

## Phase 1 — Cấu trúc và luận điểm

Phase này quan trọng hơn Phase 2 rất nhiều. Một bài câu chữ mượt mà không có luận điểm
thì vẫn là bài bỏ đi; một bài luận điểm sắc mà câu chữ thô thì vẫn có người đọc hết.

Kiểm theo thứ tự:

**1.1 — Luận điểm còn nguyên không?**
So bài với dòng `Luận điểm:` trong `outline.md`. Bài viết ra thường trôi khỏi luận điểm
gốc. Trôi thì phải chọn: kéo bài về, hay cập nhật luận điểm. Không để lệch âm thầm.

**1.2 — Mở bài có xứng đáng để đọc tiếp không?**
Đọc riêng 4 câu đầu. Nếu chúng có thể đứng đầu bất kỳ bài nào cùng chủ đề thì mở bài hỏng.
Mở bài tốt chỉ đứng được ở đúng bài này.

**1.3 — Mỗi claim có bằng chứng không?**
Liệt kê mọi câu khẳng định mạnh ("cách này tốt hơn", "hiệu quả hơn hẳn", "nhanh hơn").
Câu nào không có số liệu, log, hay ví dụ cụ thể đi kèm → `BLOCKING`.

**1.4 — Có đoạn nào chỉ để lấp không?**
Với mỗi đoạn, hỏi: bỏ nó đi thì bài mất gì? Không trả lời được → đề xuất cắt.

**1.5 — Placeholder còn sót không?**
Quét `[CẦN SỐ LIỆU]`, `[TODO]`, `[?]`, `XXX`. Còn một cái → `BLOCKING`.
Chạy `node blog/bin/blog.js check <slug>` để quét bằng máy, đừng soi bằng mắt.
Dòng `<!-- minh hoạ -->` không phải placeholder, nhưng soát từng dòng: câu có đọc ra là kịch bản
không, số có hợp lý về kỹ thuật không? Đọc như kết quả thật của tác giả → `BLOCKING`.

**1.6 — Kết bài có nói điều mới không?**
Kết bài chỉ tóm tắt lại bài là kết bài lãng phí. Phải nói người đọc làm gì khác đi.

---

## Phase 2 — Câu chữ và giọng văn

Đối chiếu trực tiếp với `voice.md` mục 5 (anti-patterns). Ngoài ra:

**2.1 — Dấu vết AI.** Câu cân đối đáng ngờ, ba gạch đầu dòng dài đều nhau, chuyển đoạn
rỗng ("Tiếp theo, chúng ta sẽ..."), tính từ đôi ("nhanh chóng và hiệu quả").

**2.2 — Câu bị động lê thê.** Đề xuất bản chủ động cụ thể, không chỉ gắn nhãn.

**2.3 — Đoạn quá dài.** Trên 5 câu → đề xuất chỗ ngắt.

**2.4 — Thuật ngữ dịch cứng.** Đối chiếu `voice.md` mục 3. `deduplication` không thành
"khử trùng lặp".

**2.5 — Nhịp.** Nhiều câu dài liên tiếp không có câu ngắn xen giữa thì đoạn văn nặng.

**2.6 — Code block.** Có gắn ngôn ngữ chưa, có dài quá 25 dòng không.

---

## Báo cáo

Trình bày gọn, gom theo mức độ, mỗi mục có vị trí cụ thể và đề xuất sửa cụ thể:

```
BLOCKING (3) — phải xử lý trước khi đăng
  [B1] §4 — "nhanh hơn đáng kể" không có số liệu. Cần con số trước/sau.
  [B2] §5 — còn [CẦN SỐ LIỆU: tỉ lệ trùng lặp].
  [B3] §1 — mở bài đứng được ở bất kỳ bài nào về AI agent. Đề xuất: mở bằng
        chính dòng log lỗi ở §3.

SUGGESTION (4) — nên sửa, không chặn
  [S1] §2 — đoạn 7 câu, ngắt sau câu "..." thì dễ thở hơn.
  [S2] §3 — "được thiết kế bởi" → "mình thiết kế".
  ...
```

Không gộp `BLOCKING` và `SUGGESTION` vào một danh sách — tác giả cần biết cái nào bắt buộc.

## Sửa

- **Path A:** báo cáo xong, chờ tác giả chốt sửa gì. Sửa xong chạy lại toàn bộ Phase 1 + 2.
- **Path B:** sửa luôn, re-verify phạm vi đã sửa + đoạn trước và sau nó.

Sửa xong luôn báo lại số chữ mới (`node blog/bin/blog.js stats <slug>`).

## Ghi `review-log.md`

Đây là phần biến "luyện viết" thành thứ đo được. Append, không ghi đè:

```markdown
## 2026-08-15 — Path A, vòng 1

**Blocking:** 3 (thiếu số liệu ×2, mở bài chung chung ×1)
**Suggestion:** 4 (đoạn dài ×2, bị động ×1, thuật ngữ dịch cứng ×1)
**Đã sửa:** B1, B3, S1, S2
**Bỏ qua:** B2 (tác giả sẽ bổ sung số liệu sau), S3, S4

**Lỗi lặp lại từ bài trước:** mở bài chung chung (lần thứ 3), khẳng định thiếu số liệu
(lần thứ 2).
```

Dòng "Lỗi lặp lại" là dòng có giá trị nhất trong cả file. Đọc `review-log.md` của các
bài trước để điền được nó. Khi một lỗi lặp từ 3 lần trở lên, đề xuất tác giả thêm nó
thành rule cụ thể trong `voice.md` mục 5 — đó là cách hệ thống tự học.

## Ranh giới

- **Không viết lại cả bài.** Nếu bài hỏng đến mức cần viết lại, nói thẳng và đề xuất
  quay về `blog-angle` xem lại luận điểm.
- **Không sửa dữ kiện.** Thấy số liệu đáng ngờ thì hỏi, không tự chỉnh.
- **Không tự chạy publish-check.**
- **Tôn trọng chỗ tác giả cố ý phá luật.** Một câu 40 chữ có thể là chủ ý tạo nhịp.
  Hỏi trước khi sửa những chỗ trông như phá luật có ý đồ.
