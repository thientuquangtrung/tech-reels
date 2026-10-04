# 001 — Một virtual user là gì?

Series: ONE x là gì

Điểm mấu chốt:
- 1000 VU không phải 1000 request song song — mỗi VU phải hành xử như một người thật.
- Mỗi VU có tài khoản + token riêng (không dùng chung 1 token cho cả bài test).
- Phần lớn thời gian là đọc / chờ; ghi dữ liệu rất hiếm (like 15%, viết bài 2%).
- Bỏ think time = đang test một con bot, số liệu sẽ sai.
