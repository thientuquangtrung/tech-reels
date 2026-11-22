# IN vs EXISTS vs USING, và NOT IN trên Postgres

Lab đi kèm bài blog *"Đừng đổi IN sang EXISTS cho nhanh nữa. Quả bom thật tên là NOT IN"*.

Script dựng hai bảng `orders` / `order_items`, rồi đo bằng `EXPLAIN ANALYZE`:

- **A.** Xoá item của đơn đã huỷ bằng `IN`, `EXISTS`, `USING` — có và không có index.
- **B.** Xoá đơn không còn item bằng `NOT IN` vs `NOT EXISTS` — trước và sau khi thêm một dòng `NULL`.
- **C.** `NOT IN` ở `work_mem` mặc định: tăng dần cỡ dữ liệu để thấy lúc plan đổi từ `hashed SubPlan` sang quét lại từng dòng.

Mọi câu DELETE chạy trong `BEGIN … ROLLBACK`. Script tự tạo bảng khi bắt đầu và xoá bảng khi xong, nên **chỉ chạy trên database dùng để thử**.

## Chạy

Cần Docker và Node 18+.

```bash
docker run -d --name pg-lab -e POSTGRES_HOST_AUTH_METHOD=trust -p 5433:5432 postgres:18
npm install
PGHOST=localhost PGPORT=5433 PGUSER=postgres node lab.mjs > results.md
```

Mất khoảng 10 phút, phần lớn là chờ các câu `NOT IN` chạm timeout 120 giây (mục B1 và hai dòng cuối mục C).
`N_ORDERS` đổi cỡ dữ liệu của mục A và B (mặc định 200000); mục C luôn chạy các cỡ cố định.

Dọn dẹp:

```bash
docker rm -f pg-lab
```

## Kết quả mẫu

`results.md` là một lần chạy trên PostgreSQL 18.7, trong container trên laptop.
Số mili giây tuyệt đối sẽ khác trên máy bạn; thứ đáng so là hình dạng plan và tỉ lệ giữa các câu.
