---
series: one_x
layout: card+cycle
sources:
  - ảnh sơ đồ "what is ONE user?" (k6, tham khảo)
status: draft
---

# Một virtual user là gì?

## Một ý duy nhất

Một virtual user phải hành xử như một người thật: tài khoản riêng, có lúc nghỉ, hiếm khi ghi.

## Điểm mấu chốt

- Mỗi VU có tài khoản và token đăng nhập riêng. [nguồn 1]
- Một vòng lặp: mở feed, chờ, mở bài, chờ, thỉnh thoảng like hoặc viết bài, chờ, lặp lại. [nguồn 1]
- Thao tác ghi rất hiếm: like 15% vòng, viết bài 2% vòng. [nguồn 1]

## Góc của tôi

## Hook ứng viên

- "1000 virtual user của bạn đang làm gì?"

## Cần kiểm trước khi viết script

- [ ] Nguồn cho ý "bỏ think time là đang test bot" (vd: tài liệu k6 về think time)
- [ ] Tỉ lệ 15% / 2% là số minh hoạ hay số đo thật?
