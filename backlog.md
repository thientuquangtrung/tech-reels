# Backlog ý tưởng

Mỗi dòng: series — chủ đề. Chọn một dòng → tạo `videos/NNN-slug/idea.md`.

## ONE x là gì (layout: card+cycle)
- ONE x — Một Kafka consumer làm gì trong một vòng poll
- ONE x — Một request đi qua những gì trước khi tới controller NestJS

## Sai vs Đúng (layout: compare)
- wrong_right — Retry ngay lập tức vs exponential backoff + jitter
- wrong_right — Load test không think time vs có think time
- wrong_right — N+1 query
- wrong_right — watch() re-render cả form vs useWatch() chỉ component cần (react-hook-form) (từ: master-constraint-filter-panel-rerender-report.md, docs RHF watch/useWatch)
- wrong_right — trigger(["a","b"]) làm cả bảng re-render, gọi từng field thì không (react-hook-form) (từ: master-constraint-rhf-trigger-rerender-fix-report.md)

## Chuyện gì xảy ra khi… (cần layout: flow)
- what_happens — JWT hết hạn giữa chừng
- what_happens — Consumer Kafka chết khi đang xử lý message
- what_happens — useFieldArray append 1 row → mọi row bị tạo lại, cả bảng re-render (từ: master-constraint-rerender-fix-report.md)

## Con số ngược trực giác
- counterintuitive — 1000 VU ≠ 1000 người dùng đồng thời
- counterintuitive — p95 đẹp nhưng user vẫn kêu chậm
- counterintuitive — Thêm React.memo làm checkbox đứng hình: memo chỉ so props (từ: master-constraint-rerender-and-zustand-selector-report.md)
- counterintuitive — Đổi function sang const memo() làm lộ circular import (TDZ) (từ: master-constraint-filter-panel-rerender-report.md)

## Learn in public
- learn_public — Tự học một tool mới trong 20 giờ: giờ thứ 1
