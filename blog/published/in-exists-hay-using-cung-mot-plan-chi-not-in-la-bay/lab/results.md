# Kết quả: IN / EXISTS / USING, NOT IN / NOT EXISTS

PostgreSQL 18.7, work_mem mặc định = 4MB.
Dữ liệu: 200,000 orders (10% cancelled), 950,000 order_items (5% đơn không có item).

## A. Xoá item của đơn đã huỷ — CÓ index trên order_items(order_id)

### IN

```sql
delete from order_items
where order_id in (select id from orders where status = 'cancelled')
```

- Số dòng bị xoá: **100,000**
- Execution time (trung vị 3 lần): **120.6 ms**

```
Delete on order_items (actual time=120.559..120.560 rows=0.00 loops=1)
  Buffers: shared hit=106218
  ->  Hash Join (actual time=7.471..101.665 rows=100000.00 loops=1)
        Hash Cond: (order_items.order_id = orders.id)
        Buffers: shared hit=6218
        ->  Seq Scan on order_items (actual time=0.004..52.265 rows=950000.00 loops=1)
              Buffers: shared hit=5136
        ->  Hash (actual time=7.461..7.462 rows=20000.00 loops=1)
              Buckets: 32768  Batches: 1  Memory Usage: 1116kB
              Buffers: shared hit=1082
              ->  Seq Scan on orders (actual time=0.002..6.243 rows=20000.00 loops=1)
                    Filter: (status = 'cancelled'::text)
                    Rows Removed by Filter: 180000
                    Buffers: shared hit=1082
```

### EXISTS

```sql
delete from order_items i
where exists (select 1 from orders o where o.id = i.order_id and o.status = 'cancelled')
```

- Số dòng bị xoá: **100,000**
- Execution time (trung vị 3 lần): **139.0 ms**

```
Delete on order_items i (actual time=121.620..121.621 rows=0.00 loops=1)
  Buffers: shared hit=106218
  ->  Hash Join (actual time=7.855..102.773 rows=100000.00 loops=1)
        Hash Cond: (i.order_id = o.id)
        Buffers: shared hit=6218
        ->  Seq Scan on order_items i (actual time=0.084..52.671 rows=950000.00 loops=1)
              Buffers: shared hit=5136
        ->  Hash (actual time=7.763..7.764 rows=20000.00 loops=1)
              Buckets: 32768  Batches: 1  Memory Usage: 1116kB
              Buffers: shared hit=1082
              ->  Seq Scan on orders o (actual time=0.005..6.556 rows=20000.00 loops=1)
                    Filter: (status = 'cancelled'::text)
                    Rows Removed by Filter: 180000
                    Buffers: shared hit=1082
```

### USING

```sql
delete from order_items i
using orders o
where o.id = i.order_id and o.status = 'cancelled'
```

- Số dòng bị xoá: **100,000**
- Execution time (trung vị 3 lần): **116.2 ms**

```
Delete on order_items i (actual time=116.157..116.158 rows=0.00 loops=1)
  Buffers: shared hit=106218
  ->  Hash Join (actual time=7.760..100.432 rows=100000.00 loops=1)
        Hash Cond: (i.order_id = o.id)
        Buffers: shared hit=6218
        ->  Seq Scan on order_items i (actual time=0.005..51.169 rows=950000.00 loops=1)
              Buffers: shared hit=5136
        ->  Hash (actual time=7.747..7.748 rows=20000.00 loops=1)
              Buckets: 32768  Batches: 1  Memory Usage: 1116kB
              Buffers: shared hit=1082
              ->  Seq Scan on orders o (actual time=0.003..6.459 rows=20000.00 loops=1)
                    Filter: (status = 'cancelled'::text)
                    Rows Removed by Filter: 180000
                    Buffers: shared hit=1082
```

## A. Xoá item của đơn đã huỷ — KHÔNG có index trên order_items(order_id)

### IN

```sql
delete from order_items
where order_id in (select id from orders where status = 'cancelled')
```

- Số dòng bị xoá: **100,000**
- Execution time (trung vị 3 lần): **124.9 ms**

```
Delete on order_items (actual time=117.529..117.530 rows=0.00 loops=1)
  Buffers: shared hit=106218
  ->  Hash Join (actual time=7.816..101.027 rows=100000.00 loops=1)
        Hash Cond: (order_items.order_id = orders.id)
        Buffers: shared hit=6218
        ->  Seq Scan on order_items (actual time=0.007..52.224 rows=950000.00 loops=1)
              Buffers: shared hit=5136
        ->  Hash (actual time=7.803..7.804 rows=20000.00 loops=1)
              Buckets: 32768  Batches: 1  Memory Usage: 1116kB
              Buffers: shared hit=1082
              ->  Seq Scan on orders (actual time=0.002..6.612 rows=20000.00 loops=1)
                    Filter: (status = 'cancelled'::text)
                    Rows Removed by Filter: 180000
                    Buffers: shared hit=1082
```

### EXISTS

```sql
delete from order_items i
where exists (select 1 from orders o where o.id = i.order_id and o.status = 'cancelled')
```

- Số dòng bị xoá: **100,000**
- Execution time (trung vị 3 lần): **119.1 ms**

```
Delete on order_items i (actual time=119.088..119.090 rows=0.00 loops=1)
  Buffers: shared hit=106218
  ->  Hash Join (actual time=8.238..102.774 rows=100000.00 loops=1)
        Hash Cond: (i.order_id = o.id)
        Buffers: shared hit=6218
        ->  Seq Scan on order_items i (actual time=0.007..52.630 rows=950000.00 loops=1)
              Buffers: shared hit=5136
        ->  Hash (actual time=8.225..8.225 rows=20000.00 loops=1)
              Buckets: 32768  Batches: 1  Memory Usage: 1116kB
              Buffers: shared hit=1082
              ->  Seq Scan on orders o (actual time=0.002..6.947 rows=20000.00 loops=1)
                    Filter: (status = 'cancelled'::text)
                    Rows Removed by Filter: 180000
                    Buffers: shared hit=1082
```

### USING

```sql
delete from order_items i
using orders o
where o.id = i.order_id and o.status = 'cancelled'
```

- Số dòng bị xoá: **100,000**
- Execution time (trung vị 3 lần): **120.5 ms**

```
Delete on order_items i (actual time=118.279..118.281 rows=0.00 loops=1)
  Buffers: shared hit=106218 dirtied=22
  ->  Hash Join (actual time=8.670..102.812 rows=100000.00 loops=1)
        Hash Cond: (i.order_id = o.id)
        Buffers: shared hit=6218 dirtied=22
        ->  Seq Scan on order_items i (actual time=0.006..52.380 rows=950000.00 loops=1)
              Buffers: shared hit=5136 dirtied=22
        ->  Hash (actual time=8.658..8.658 rows=20000.00 loops=1)
              Buckets: 32768  Batches: 1  Memory Usage: 1116kB
              Buffers: shared hit=1082
              ->  Seq Scan on orders o (actual time=0.002..7.345 rows=20000.00 loops=1)
                    Filter: (status = 'cancelled'::text)
                    Rows Removed by Filter: 180000
                    Buffers: shared hit=1082
```

## B. Xoá đơn không còn item nào — NOT IN vs NOT EXISTS

### B1. order_items.order_id chưa có NULL

### NOT IN (work_mem mặc định)

```sql
delete from orders
where id not in (select order_id from order_items)
```

- **Quá 120s (timeout)**. Plan (EXPLAIN không ANALYZE):

```
Delete on orders
  ->  Seq Scan on orders
        Filter: (NOT (ANY (id = (SubPlan 1).col1)))
        SubPlan 1
          ->  Materialize
                ->  Seq Scan on order_items
```

### NOT IN (work_mem = 64MB)

```sql
delete from orders
where id not in (select order_id from order_items)
```

- Số dòng bị xoá: **10,000**
- Execution time (trung vị 3 lần): **137.8 ms**

```
Delete on orders (actual time=141.787..141.788 rows=0.00 loops=1)
  Buffers: shared hit=16218
  ->  Seq Scan on orders (actual time=111.594..139.720 rows=10000.00 loops=1)
        Filter: (NOT (ANY (id = (hashed SubPlan 1).col1)))
        Rows Removed by Filter: 190000
        Buffers: shared hit=6218
        SubPlan 1
          ->  Seq Scan on order_items (actual time=0.005..35.711 rows=950000.00 loops=1)
                Buffers: shared hit=5136
```

### NOT EXISTS

```sql
delete from orders o
where not exists (select 1 from order_items i where i.order_id = o.id)
```

- Số dòng bị xoá: **10,000**
- Execution time (trung vị 3 lần): **159.7 ms**

```
Delete on orders o (actual time=159.694..159.696 rows=0.00 loops=1)
  Buffers: shared hit=16218, temp read=3934 written=3934
  ->  Hash Anti Join (actual time=101.159..156.387 rows=10000.00 loops=1)
        Hash Cond: (o.id = i.order_id)
        Buffers: shared hit=6218, temp read=3934 written=3934
        ->  Seq Scan on orders o (actual time=0.004..10.719 rows=200000.00 loops=1)
              Buffers: shared hit=1082
        ->  Hash (actual time=101.018..101.018 rows=950000.00 loops=1)
              Buckets: 262144  Batches: 8  Memory Usage: 7175kB
              Buffers: shared hit=5136, temp written=3242
              ->  Seq Scan on order_items i (actual time=0.002..41.675 rows=950000.00 loops=1)
                    Buffers: shared hit=5136
```

### B2. Thêm đúng 1 dòng order_items có order_id = NULL

### NOT IN (work_mem = 64MB)

```sql
delete from orders
where id not in (select order_id from order_items)
```

- Số dòng bị xoá: **0**
- Execution time (trung vị 3 lần): **131.7 ms**

```
Delete on orders (actual time=128.933..128.933 rows=0.00 loops=1)
  Buffers: shared hit=6218
  ->  Seq Scan on orders (actual time=128.932..128.932 rows=0.00 loops=1)
        Filter: (NOT (ANY (id = (hashed SubPlan 1).col1)))
        Rows Removed by Filter: 200000
        Buffers: shared hit=6218
        SubPlan 1
          ->  Seq Scan on order_items (actual time=0.005..35.556 rows=950001.00 loops=1)
                Buffers: shared hit=5136
```

### NOT EXISTS

```sql
delete from orders o
where not exists (select 1 from order_items i where i.order_id = o.id)
```

- Số dòng bị xoá: **10,000**
- Execution time (trung vị 3 lần): **157.1 ms**

```
Delete on orders o (actual time=157.088..157.089 rows=0.00 loops=1)
  Buffers: shared hit=16218, temp read=3934 written=3934
  ->  Hash Anti Join (actual time=97.939..153.673 rows=10000.00 loops=1)
        Hash Cond: (o.id = i.order_id)
        Buffers: shared hit=6218, temp read=3934 written=3934
        ->  Seq Scan on orders o (actual time=0.004..10.744 rows=200000.00 loops=1)
              Buffers: shared hit=1082
        ->  Hash (actual time=97.750..97.750 rows=950000.00 loops=1)
              Buckets: 262144  Batches: 8  Memory Usage: 7175kB
              Buffers: shared hit=5136, temp written=3242
              ->  Seq Scan on order_items i (actual time=0.002..40.157 rows=950001.00 loops=1)
                    Buffers: shared hit=5136
```

## C. NOT IN ở work_mem mặc định: vượt ngưỡng là rơi khỏi vách

Không có NULL. Mỗi cỡ dựng lại bảng từ đầu. Câu chạy quá 5s thì chỉ đo 1 lần.

| orders | order_items | plan NOT IN | NOT IN | NOT EXISTS |
|---|---|---|---|---|
| 25,000 | 118,750 | hashed SubPlan | 13 ms | 14 ms |
| 50,000 | 237,500 | hashed SubPlan | 28 ms | 28 ms |
| 55,000 | 261,250 | hashed SubPlan | 29 ms | 31 ms |
| 60,000 | 285,000 | SubPlan (không hash) | > 120 s | 34 ms |
| 70,000 | 332,500 | SubPlan (không hash) | > 120 s | 45 ms |
