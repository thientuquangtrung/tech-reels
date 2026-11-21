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
