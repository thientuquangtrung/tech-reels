# Ideas inbox

Hàng đợi ý tưởng thô cho cả blog lẫn video. `capture` ghi vào đây; `blog-angle` lấy ra
làm bài, `idea-intake` lấy ra làm video. Không sửa file này bằng tay khi đang chạy skill — để skill append.

**Trạng thái:** `RAW` (mới ghi) → `PASSED` (đã thành bài/video) → `REJECTED` / `MERGED`
**Kênh:** `blog` | `video (<series>, layout: <layout>)` | `cả hai` | `?`
**Đã thành:** đường dẫn bài/video đã làm từ ý này. Kênh `cả hai` mà mới có một đường dẫn → vẫn là ứng viên cho kênh còn lại.

---

<!-- MẪU — giữ nguyên để tham chiếu schema, đừng xoá -->

## [RAW] 2026-01-01 — Ví dụ: vì sao tách deduplication thành hai pha

- **Bối cảnh:** agent liệt kê và phân loại cùng lúc trong một pass, output có mục lặp.
- **Quyết định:** tách thành hai pha — pha 1 chỉ liệt kê im lặng, pha 2 mới phân loại
  một lượt.
- **Vì sao:** khi phân loại xen giữa lúc liệt kê, model bị mất dấu những gì đã liệt kê
  trước đó.
- **Cái giá:** tốn thêm một lượt gọi, output chậm hơn.
- **Ai cần biết:** người viết agent có bước liệt kê rồi phân loại trên cùng một tập.
- **Chứng cứ có sẵn:** log trước/sau khi sửa, file SKILL.md hai phiên bản.
- **Kênh:** blog

---

<!-- Chuyển từ backlog.md của devdraw ngày 2026-11-21 -->

## [RAW] 2026-10-04 — Retry ngay lập tức vs exponential backoff + jitter

- **Kênh:** video (wrong_right, layout: compare)

---

## [RAW] 2026-10-04 — Load test không think time vs có think time

- **Kênh:** video (wrong_right, layout: compare)

---

## [RAW] 2026-10-04 — N+1 query

- **Kênh:** video (wrong_right, layout: compare)

---

## [RAW] 2026-10-04 — watch() re-render cả form vs useWatch() chỉ component cần (react-hook-form)

- **Kênh:** video (wrong_right, layout: compare)
- **Nguồn:** master-constraint-filter-panel-rerender-report.md, docs RHF watch/useWatch

---

## [RAW] 2026-10-04 — trigger(["a","b"]) làm cả bảng re-render, gọi từng field thì không (react-hook-form)

- **Kênh:** video (wrong_right, layout: compare)
- **Nguồn:** master-constraint-rhf-trigger-rerender-fix-report.md

---

## [RAW] 2026-10-04 — JWT hết hạn giữa chừng

- **Kênh:** video (what_happens, layout: flow)

---

## [RAW] 2026-10-04 — Consumer Kafka chết khi đang xử lý message

- **Kênh:** video (what_happens, layout: flow)

---

## [RAW] 2026-10-04 — useFieldArray append 1 row → mọi row bị tạo lại, cả bảng re-render

- **Kênh:** video (what_happens, layout: flow)
- **Nguồn:** master-constraint-rerender-fix-report.md

---

## [RAW] 2026-10-04 — 1000 VU ≠ 1000 người dùng đồng thời

- **Kênh:** video (counterintuitive, layout: stack)

---

## [RAW] 2026-10-04 — p95 đẹp nhưng user vẫn kêu chậm

- **Kênh:** video (counterintuitive, layout: stack)

---

## [RAW] 2026-10-04 — Thêm React.memo làm checkbox đứng hình: memo chỉ so props

- **Kênh:** video (counterintuitive, layout: stack)
- **Nguồn:** master-constraint-rerender-and-zustand-selector-report.md

---

## [RAW] 2026-10-04 — Đổi function sang const memo() làm lộ circular import (TDZ)

- **Kênh:** video (counterintuitive, layout: stack)
- **Nguồn:** master-constraint-filter-panel-rerender-report.md

---

## [RAW] 2026-10-04 — Tự học một tool mới trong 20 giờ: giờ thứ 1

- **Kênh:** video (learn_public)

---

## [PASSED] 2026-11-22 — IN vs EXISTS vs USING: khác nhau thật ở đâu

- **Bối cảnh:** gặp khi viết TypeORM migration xoá dữ liệu cha/con trên Postgres: câu `WHERE x IN (SELECT ...)` chạy đúng, nhưng được góp ý nên đổi sang `EXISTS` hoặc `USING` — và chưa rõ ba cách khác nhau thật ở đâu.
- **Quyết định:** ? (đang cân nhắc giữ `IN` hay đổi sang `EXISTS` / `DELETE ... USING`)
- **Vì sao:** chưa rõ khác biệt thật giữa ba cách: `IN` "gom danh sách rồi so khớp", `EXISTS` "kiểm từng dòng, ngắt sớm", `USING` là join delete riêng của Postgres. Điểm chắc chắn đáng kể: `NOT IN` gặp một `NULL` trong subquery là trả rỗng, `NOT EXISTS` thì không.
- **Cái giá:** `USING` không chạy được trên DB khác; `EXISTS` dài hơn, cần alias.
- **Ai cần biết:** dev backend viết migration / câu DELETE có subquery trên Postgres.
- **Chứng cứ có sẵn:** code migration gốc; ví dụ 6 dòng dữ liệu mẫu (101/102 cha, 201–204 con) đã dựng step-by-step. Phần giải thích cơ chế đến từ chat với Gemini — cần kiểm bằng `EXPLAIN ANALYZE` (Postgres thường biến `IN (subquery)` thành semi-join giống `EXISTS`).
- **Kênh:** cả hai — video (wrong_right: `NOT IN` + NULL vs `NOT EXISTS`), blog (so sánh ba cách kèm plan thật)
- **Cần ẩn danh:** tên bảng/cột/class thật của migration gốc và các khái niệm nghiệp vụ — không ghi vào repo.
- **Đã thành:** blog/published/in-exists-hay-using-cung-mot-plan-chi-not-in-la-bay (kênh video còn trống)

---

## [RAW] 2026-11-22 — Migration xoá dữ liệu: down() để trống là cái bẫy

- **Bối cảnh:** migration xoá dữ liệu không khôi phục được, `down()` để trống với comment "Deleted rows cannot be restored".
- **Quyết định:** ? (đề xuất: `down()` throw Error)
- **Vì sao:** `down()` rỗng thì `migration:revert` "thành công" âm thầm, xoá bản ghi trong bảng migrations → lần deploy sau `up()` chạy lại DELETE, người revert tưởng dữ liệu đã quay lại.
- **Cái giá:** không revert được migration đó nữa; muốn lùi phải xử lý tay.
- **Ai cần biết:** dev dùng TypeORM (hoặc tool migration có up/down) viết data migration.
- **Chứng cứ có sẵn:** code migration gốc.
- **Kênh:** video (wrong_right)
- **Cần ẩn danh:** tên bảng / class migration như mục trên.

---

## [RAW] 2026-11-22 — 23k dòng cần xoá: có cần batch delete không

- **Bối cảnh:** cùng migration trên; đếm thật được ~510.584 dòng tổng và ~23.570 dòng cha type 'E' (chưa đếm số dòng con).
- **Quyết định:** ? (hướng: giữ DELETE một lệnh trong migration, deploy off-peak)
- **Vì sao:** ở quy mô này không đáng tách batch; batch / tách khỏi migration / table swap + `VACUUM ANALYZE` chỉ cần khi hàng triệu dòng (lock, statement timeout, WAL, replica lag).
- **Cái giá:** vẫn giữ lock trong một transaction migration; chưa đo thời gian chạy thật.
- **Ai cần biết:** dev backend phải xoá/dọn dữ liệu qua migration trên bảng đang chạy production.
- **Chứng cứ có sẵn:** số đếm thật 510.584 / 23.570. Ước tính "1–3 giây" là của Gemini, chưa đo.
- **Kênh:** blog
- **Cần ẩn danh:** tên bảng / cột.

---
