// IN vs EXISTS vs USING, và NOT IN vs NOT EXISTS trên Postgres.
// Cách chạy: xem README.md. In kết quả (markdown) ra stdout:
//   node lab.mjs > results.md
// Kết nối đọc từ biến môi trường chuẩn của Postgres: PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE.
import pg from 'pg';

const N_ORDERS = Number(process.env.N_ORDERS ?? 200_000);
const ITEMS_PER_ORDER = 5;
const RUNS = 3;
const TIMEOUT_MS = 120_000;

const db = new pg.Client();
await db.connect();
const q = (sql) => db.query(sql);
const out = (s = '') => console.log(s);
const fmt = (n) => n.toLocaleString('en');

// orders: N đơn, 10% 'cancelled'. order_items: 5 item / đơn, trừ 5% đơn không có item nào.
async function setup({ orders = N_ORDERS, index = true } = {}) {
  await q('drop table if exists order_items, orders');
  await q('create table orders (id int primary key, status text not null)');
  await q('create table order_items (id serial primary key, order_id int, sku text)');
  await q(`insert into orders select g, case when g % 10 = 0 then 'cancelled' else 'paid' end
           from generate_series(1, ${orders}) g`);
  await q(`insert into order_items (order_id, sku)
           select o, 'sku-' || i from generate_series(1, ${orders}) o, generate_series(1, ${ITEMS_PER_ORDER}) i
           where o % 20 <> 7`);
  if (index) await q('create index on order_items(order_id)');
  await q('vacuum analyze orders');
  await q('vacuum analyze order_items');
}

// Chạy trong BEGIN … ROLLBACK để dữ liệu còn nguyên cho lần sau.
async function inRollback(fn) {
  await q('begin');
  await q(`set local statement_timeout = ${TIMEOUT_MS}`);
  try {
    return await fn();
  } catch (e) {
    if (/statement timeout/.test(e.message)) return null;
    throw e;
  } finally {
    await q('rollback');
  }
}

async function measure(sql) {
  const t0 = Date.now();
  const deleted = await inRollback(async () => (await q(sql)).rowCount);
  if (deleted === null) return { timedOut: true };
  if (Date.now() - t0 > 5_000) return { deleted, ms: Date.now() - t0, plan: '(chạy 1 lần, không lấy plan ANALYZE)' };
  const times = [];
  let plan;
  for (let r = 0; r < RUNS; r++) {
    const lines = await inRollback(async () =>
      (await q(`explain (analyze, costs off) ${sql}`)).rows.map((x) => x['QUERY PLAN']));
    plan = lines.slice(0, lines.findIndex((l) => /^(Planning|Execution Time)/.test(l))).join('\n');
    times.push(Number(lines.find((l) => l.startsWith('Execution Time')).match(/[\d.]+/)[0]));
  }
  times.sort((a, b) => a - b);
  return { deleted, ms: times[Math.floor(RUNS / 2)], plan };
}

async function report(title, sql) {
  const r = await measure(sql);
  out(`### ${title}\n`);
  out('```sql\n' + sql + '\n```\n');
  if (r.timedOut) {
    out(`- **Quá ${TIMEOUT_MS / 1000}s (timeout)**. Plan (EXPLAIN không ANALYZE):\n`);
    out('```\n' + (await q(`explain (costs off) ${sql}`)).rows.map((x) => x['QUERY PLAN']).join('\n') + '\n```\n');
    return;
  }
  out(`- Số dòng bị xoá: **${fmt(r.deleted)}**`);
  out(`- Execution time (trung vị ${RUNS} lần): **${r.ms.toFixed(1)} ms**\n`);
  out('```\n' + r.plan + '\n```\n');
}

const DEL_IN = `delete from order_items
where order_id in (select id from orders where status = 'cancelled')`;
const DEL_EXISTS = `delete from order_items i
where exists (select 1 from orders o where o.id = i.order_id and o.status = 'cancelled')`;
const DEL_USING = `delete from order_items i
using orders o
where o.id = i.order_id and o.status = 'cancelled'`;
const DEL_NOT_IN = `delete from orders
where id not in (select order_id from order_items)`;
const DEL_NOT_EXISTS = `delete from orders o
where not exists (select 1 from order_items i where i.order_id = o.id)`;

out('# Kết quả: IN / EXISTS / USING, NOT IN / NOT EXISTS\n');
out(`PostgreSQL ${(await q('show server_version')).rows[0].server_version}, work_mem mặc định = ${(await q('show work_mem')).rows[0].work_mem}.`);
out(`Dữ liệu: ${fmt(N_ORDERS)} orders (10% cancelled), ${fmt(N_ORDERS * 0.95 * ITEMS_PER_ORDER)} order_items (5% đơn không có item).\n`);

for (const index of [true, false]) {
  await setup({ index });
  out(`## A. Xoá item của đơn đã huỷ — ${index ? 'CÓ' : 'KHÔNG có'} index trên order_items(order_id)\n`);
  await report('IN', DEL_IN);
  await report('EXISTS', DEL_EXISTS);
  await report('USING', DEL_USING);
}

await setup();
out('## B. Xoá đơn không còn item nào — NOT IN vs NOT EXISTS\n');
out('### B1. order_items.order_id chưa có NULL\n');
await report('NOT IN (work_mem mặc định)', DEL_NOT_IN);
await q(`set work_mem = '64MB'`);
await report('NOT IN (work_mem = 64MB)', DEL_NOT_IN);
await q('reset work_mem');
await report('NOT EXISTS', DEL_NOT_EXISTS);

out('### B2. Thêm đúng 1 dòng order_items có order_id = NULL\n');
await q(`insert into order_items (order_id, sku) values (null, 'orphan')`);
await q('analyze order_items');
await q(`set work_mem = '64MB'`);
await report('NOT IN (work_mem = 64MB)', DEL_NOT_IN);
await q('reset work_mem');
await report('NOT EXISTS', DEL_NOT_EXISTS);

out('## C. NOT IN ở work_mem mặc định: vượt ngưỡng là rơi khỏi vách\n');
out('Không có NULL. Mỗi cỡ dựng lại bảng từ đầu. Câu chạy quá 5s thì chỉ đo 1 lần.\n');
out('| orders | order_items | plan NOT IN | NOT IN | NOT EXISTS |');
out('|---|---|---|---|---|');
for (const n of [25_000, 50_000, 55_000, 60_000, 70_000]) {
  await setup({ orders: n });
  const plan = (await q(`explain (costs off) ${DEL_NOT_IN}`)).rows.map((x) => x['QUERY PLAN']).join(' ');
  const notIn = await measure(DEL_NOT_IN);
  const notExists = await measure(DEL_NOT_EXISTS);
  const ms = (r) => (r.timedOut ? `> ${TIMEOUT_MS / 1000} s` : r.ms >= 1000 ? `${(r.ms / 1000).toFixed(1)} s` : `${r.ms.toFixed(0)} ms`);
  out(`| ${fmt(n)} | ${fmt(n * 0.95 * ITEMS_PER_ORDER)} | ${/hashed/.test(plan) ? 'hashed SubPlan' : 'SubPlan (không hash)'} | ${ms(notIn)} | ${ms(notExists)} |`);
}

await q('drop table if exists order_items, orders');
await db.end();
