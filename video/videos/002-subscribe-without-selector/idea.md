---
series: wrong_right
layout: compare
sources:
    - master-constraint-rerender-and-zustand-selector-report.md (báo cáo session, dự án của tôi)
    - https://github.com/pmndrs/zustand/blob/main/README.md
    - https://zustand.docs.pmnd.rs/reference/migrations/migrating-to-v5
status: scripted
---

# Subscribe không selector: tick một ô, cả trang render lại

## Một ý duy nhất

Component nghe cả store thì cái gì đổi nó cũng render lại; chỉ nghe đúng phần mình cần thì mới yên.

## Điểm mấu chốt

- Gọi hook store Zustand không truyền selector là lấy cả store: mọi thay đổi state đều làm component render lại, dù nó không dùng phần đổi. [nguồn 2] [nguồn 1]
- Hệ quả thực tế: tick checkbox một row làm tabs, bộ lọc, toolbar, cả bảng và phân trang cùng render lại. [nguồn 1]
- Sửa: selector lấy đúng một field, component chỉ render lại khi field đó đổi. [nguồn 2] [nguồn 1]
- Zustand so kết quả selector bằng `===`. Gom nhiều field thành object mới mỗi lần thì luôn bị coi là "khác" → bọc `useShallow` để so theo nội dung. [nguồn 2] [nguồn 1] Từ v5, selector trả reference mới còn có thể gây lặp vô hạn. [nguồn 3]

## Góc của tôi

- Gặp ở dự án thật: một bảng nghiệp vụ lớn (~80 cột), mất nhiều vòng fix mới hết render thừa.

## Hook ứng viên

- "Một dòng useStore(), cả trang render lại"
- "Tick một checkbox, cả trang render lại"
- "Component của bạn đang nghe lén cả store"

## Cần kiểm trước khi viết script

- [x] Tài liệu Zustand xác nhận: gọi hook không selector sẽ update với mọi thay đổi state → nguồn 2
- [x] Vì sao selector trả object cần `useShallow` → nguồn 2 (so `===`), nguồn 3 (v5: lặp vô hạn)
- [x] Thêm nguồn công khai → nguồn 2, 3
- [x] Phạm vi: chỉ Zustand, bỏ react-hook-form (để video riêng)
- [x] Không dùng tên dự án / màn hình công ty — ví dụ chung chung ("một bảng lớn")
