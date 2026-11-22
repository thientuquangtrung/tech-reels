#!/usr/bin/env node
/**
 * blog.js — CLI deterministic cho blog workspace.
 *
 * Nguyên tắc: mọi thứ đếm được / chuyển được / kiểm được bằng regex đều nằm ở đây,
 * không nằm trong model. Không phụ thuộc package ngoài.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DRAFTS = path.join(ROOT, "drafts");
const PUBLISHED = path.join(ROOT, "published");

/* ---------------------------------------------------------------- utils -- */

const C = {
  reset: "\x1b[0m", dim: "\x1b[2m", red: "\x1b[31m",
  green: "\x1b[32m", yellow: "\x1b[33m", cyan: "\x1b[36m", bold: "\x1b[1m",
};
const c = (color, s) => `${C[color]}${s}${C.reset}`;

function die(msg) {
  console.error(c("red", `✗ ${msg}`));
  process.exit(1);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

/** Slugify có xử lý dấu tiếng Việt và chữ đ/Đ. */
function slugify(input) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // bỏ dấu thanh + dấu mũ
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 80);
}

function readIf(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
}

function findSlug(slug) {
  const d = path.join(DRAFTS, slug);
  const p = path.join(PUBLISHED, slug);
  if (fs.existsSync(d)) return { dir: d, state: "draft" };
  if (fs.existsSync(p)) return { dir: p, state: "published" };
  die(`Không tìm thấy bài "${slug}" trong drafts/ hay published/`);
}

/** Tách frontmatter YAML đơn giản (key: value một dòng). */
function parseFrontmatter(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (kv) out[kv[1]] = kv[2].replace(/^["']|["']$/g, "").trim();
  }
  return out;
}

/** Bỏ code block + frontmatter để đếm chữ cho đúng. */
function proseOnly(md) {
  return md
    .replace(/^---\r?\n[\s\S]*?\r?\n---/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`\n]*`/g, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

function wordCount(md) {
  const t = proseOnly(md).replace(/[#*_>\-|]/g, " ").trim();
  return t ? t.split(/\s+/).length : 0;
}

/** Parse images.md dạng YAML list, không cần thư viện. */
function parseImages(txt) {
  if (!txt) return [];
  const items = [];
  let cur = null;
  for (const raw of txt.split(/\r?\n/)) {
    const start = raw.match(/^-\s+id:\s*(\S+)/);
    if (start) {
      if (cur) items.push(cur);
      cur = { id: start[1] };
      continue;
    }
    if (!cur) continue;
    const kv = raw.match(/^\s{2,}([a-z_]+):\s*(.*)$/);
    if (kv && kv[2] !== ">" && kv[2] !== "|") cur[kv[1]] = kv[2].replace(/^["']|["']$/g, "").trim();
    else if (kv) cur[kv[1]] = "(block)";
  }
  if (cur) items.push(cur);
  return items;
}

/* ------------------------------------------------------------ cmd: new -- */

function cmdNew(title) {
  if (!title) die('Cần tiêu đề. Ví dụ: node bin/blog.js new "Vì sao tôi tách agent"');
  const slug = slugify(title);
  if (!slug) die("Tiêu đề không sinh được slug hợp lệ.");
  const dir = path.join(DRAFTS, slug);
  if (fs.existsSync(dir)) die(`Đã tồn tại drafts/${slug}`);

  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(path.join(dir, "index.vi.md"),
`---
title: "${title.replace(/"/g, '\\"')}"
slug: ${slug}
description: ""
date: ""
status: draft
lang: vi
tags: []
---

<!-- Bản nháp do blog-draft viết. Đừng viết tay ở đây trước khi có outline.md. -->
`);

  fs.writeFileSync(path.join(dir, "idea.md"),
`# Idea: ${title}

<!-- blog-angle copy nội dung từ ideas/inbox.md sang đây. -->
`);

  fs.writeFileSync(path.join(dir, "outline.md"),
`# Outline: ${title}

**Luận điểm:** <blog-angle điền>
**Người đọc:**
**Người đọc làm khác đi:**
**Độ dài dự kiến:**
`);

  fs.writeFileSync(path.join(dir, "images.md"),
`# Image manifest: ${slug}
#
# type:   ILLUSTRATION | DIAGRAM | SCREENSHOT
# status: TODO | GENERATED | APPROVED | INLINE | NEEDS_CAPTURE
# alt là bắt buộc với mọi ảnh.

`);

  fs.writeFileSync(path.join(dir, "review-log.md"),
`# Review log: ${slug}

`);

  console.log(c("green", `✓ Đã tạo drafts/${slug}/`));
  console.log(c("dim", "  index.vi.md  idea.md  outline.md  images.md  review-log.md"));
  console.log(`\n  slug: ${c("cyan", slug)}`);
}

/* --------------------------------------------------------- cmd: status -- */

function stageOf(dir) {
  const vi = readIf(path.join(dir, "index.vi.md")) || "";
  const outline = readIf(path.join(dir, "outline.md")) || "";
  const log = readIf(path.join(dir, "review-log.md")) || "";
  const words = wordCount(vi);

  if (log.trim().split(/\r?\n/).length > 2) return "reviewed";
  if (words > 200) return "drafted";
  if (/\*\*Luận điểm:\*\*\s*\S+/.test(outline) && !/<blog-angle điền>/.test(outline)) return "outlined";
  return "scaffolded";
}

function cmdStatus() {
  const rows = [];
  for (const [base, state] of [[DRAFTS, "draft"], [PUBLISHED, "published"]]) {
    if (!fs.existsSync(base)) continue;
    for (const slug of fs.readdirSync(base)) {
      const dir = path.join(base, slug);
      if (!fs.statSync(dir).isDirectory()) continue;
      const vi = readIf(path.join(dir, "index.vi.md")) || "";
      const hasEn = fs.existsSync(path.join(dir, "index.en.md"));
      const imgs = parseImages(readIf(path.join(dir, "images.md")));
      const pending = imgs.filter(i => ["TODO", "NEEDS_CAPTURE"].includes(i.status)).length;
      const holes = (vi.match(/\[CẦN SỐ LIỆU[^\]]*\]|\[TODO\]|XXX/g) || []).length;
      rows.push({
        slug, state: state === "published" ? "published" : stageOf(dir),
        words: wordCount(vi), en: hasEn ? "EN" : "—",
        img: imgs.length ? `${imgs.length - pending}/${imgs.length}` : "—",
        holes,
      });
    }
  }
  if (!rows.length) return console.log(c("dim", "Chưa có bài nào. Chạy: node bin/blog.js new \"<tiêu đề>\""));

  const w = Math.max(4, ...rows.map(r => r.slug.length));
  console.log(c("bold", `\n${"SLUG".padEnd(w)}  ${"STAGE".padEnd(11)} ${"WORDS".padStart(6)}  ${"IMG".padStart(5)}  EN   HOLES`));
  console.log(c("dim", "─".repeat(w + 40)));
  for (const r of rows) {
    const color = r.holes > 0 ? "yellow" : r.state === "published" ? "green" : "reset";
    console.log(
      `${r.slug.padEnd(w)}  ${c(color, r.state.padEnd(11))} ${String(r.words).padStart(6)}  ` +
      `${r.img.padStart(5)}  ${r.en.padEnd(4)} ${r.holes ? c("yellow", String(r.holes)) : "0"}`
    );
  }
  console.log();
}

/* ---------------------------------------------------------- cmd: stats -- */

function cmdStats(slug) {
  const { dir } = findSlug(slug);
  const vi = readIf(path.join(dir, "index.vi.md")) || "";
  const en = readIf(path.join(dir, "index.en.md"));
  const imgs = parseImages(readIf(path.join(dir, "images.md")));
  const wv = wordCount(vi);

  console.log(c("bold", `\n${slug}`));
  console.log(`  VI: ${c("cyan", wv + " chữ")}  ~${Math.max(1, Math.round(wv / 200))} phút đọc`);
  if (en) {
    const we = wordCount(en);
    const diff = wv ? Math.round(((we - wv) / wv) * 100) : 0;
    console.log(`  EN: ${c("cyan", we + " words")}  (${diff > 0 ? "+" : ""}${diff}% so với VI)`);
  }
  const byType = {};
  for (const i of imgs) byType[i.type] = (byType[i.type] || 0) + 1;
  const pending = imgs.filter(i => ["TODO", "NEEDS_CAPTURE"].includes(i.status));
  console.log(`  Ảnh: ${imgs.length}` + (imgs.length ? `  (${Object.entries(byType).map(([k, v]) => `${k}:${v}`).join(", ")})` : ""));
  if (pending.length) console.log(c("yellow", `       ${pending.length} chưa xong: ${pending.map(i => i.id).join(", ")}`));

  const holes = vi.match(/\[CẦN SỐ LIỆU[^\]]*\]|\[TODO\]|\[\?\]|XXX/g) || [];
  const illus = vi.split(/\r?\n/).filter(l => ILLUSTRATIVE.test(l)).length;
  if (illus) console.log(c("yellow", `  Số minh hoạ: ${illus} dòng (thay bằng số thật nếu có)`));
  if (holes.length) console.log(c("yellow", `  Placeholder còn sót: ${holes.length}`));
  else console.log(c("green", "  Placeholder: sạch"));

  const budget = Math.floor(wv / 400) + 1;
  if (imgs.length > budget) console.log(c("yellow", `  ⚠ Vượt ngân sách ảnh: ${imgs.length} ảnh / ${wv} chữ (khuyến nghị ≤ ${budget})`));
  console.log();
}

/* --------------------------------------------------------- cmd: images -- */

function cmdImages(slug) {
  const { dir } = findSlug(slug);
  const imgs = parseImages(readIf(path.join(dir, "images.md")));
  let problems = 0;

  const check = (file, label) => {
    const md = readIf(path.join(dir, file));
    if (!md) return;
    const markers = [...md.matchAll(/<!--\s*IMG:\s*(\S+?)\s*-->/g)].map(m => m[1]);
    for (const id of markers) {
      if (!imgs.find(i => i.id === id)) {
        console.log(c("red", `  ✗ ${label}: marker ${id} không có trong manifest`)); problems++;
      }
    }
    for (const i of imgs) {
      if (!markers.includes(i.id)) {
        console.log(c("red", `  ✗ ${label}: ${i.id} có trong manifest nhưng không có marker trong bài`)); problems++;
      }
    }
  };

  console.log(c("bold", `\nImages: ${slug}`));
  check("index.vi.md", "VI");
  if (fs.existsSync(path.join(dir, "index.en.md"))) check("index.en.md", "EN");

  for (const i of imgs) {
    if (!i.alt || i.alt === '""') { console.log(c("red", `  ✗ ${i.id}: thiếu alt`)); problems++; }
    if (i.type === "ILLUSTRATION" && !i.prompt) { console.log(c("red", `  ✗ ${i.id}: ILLUSTRATION thiếu prompt`)); problems++; }
    if (i.type === "SCREENSHOT" && !i.capture_note) { console.log(c("red", `  ✗ ${i.id}: SCREENSHOT thiếu capture_note`)); problems++; }
    if (["TODO", "NEEDS_CAPTURE"].includes(i.status)) console.log(c("yellow", `  ⚠ ${i.id}: status ${i.status}`));
  }

  console.log(problems ? c("red", `\n  ${problems} lỗi cần sửa\n`) : c("green", "\n  ✓ Manifest khớp bài\n"));
  if (problems) process.exitCode = 1;
}

/* ---------------------------------------------------------- cmd: links -- */

const INTERNAL_LINK = /localhost|127\.0\.0\.1|192\.168\.|10\.\d+\.\d+\.\d+|\.local\b|\.internal\b|atlassian\.net|drive\.google\.com|docs\.google\.com/i;

function cmdLinks(slug) {
  const { dir } = findSlug(slug);
  console.log(c("bold", `\nLinks: ${slug}`));
  let flagged = 0, total = 0;

  for (const f of ["index.vi.md", "index.en.md"]) {
    const md = readIf(path.join(dir, f));
    if (!md) continue;
    const urls = [...md.matchAll(/https?:\/\/[^\s)\]<>"']+/g)].map(m => m[0]);
    for (const u of new Set(urls)) {
      total++;
      if (INTERNAL_LINK.test(u)) { console.log(c("red", `  ✗ [${f}] link nội bộ/cần đăng nhập: ${u}`)); flagged++; }
      else console.log(c("dim", `    ${u}`));
    }
  }
  console.log(flagged ? c("red", `\n  ${flagged}/${total} link cần xử lý\n`) : c("green", `\n  ✓ ${total} link, không có link nội bộ\n`));
  if (flagged) process.exitCode = 1;
}

/* ---------------------------------------------------------- cmd: check -- */

/** Prefix ticket đã ẩn danh — không tính là rò rỉ. */
const SAFE_TICKET = /^(?:PROJ|DEMO|EXAMPLE|SAMPLE|TEST|FOO)-/i;

const LEAK_PATTERNS = [
  { re: /\b[A-Z]{2,10}-\d{2,6}\b/g, label: "Mã ticket dạng ABC-1234",
    skip: v => SAFE_TICKET.test(v) },
  { re: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,                   label: "Địa chỉ IP" },
  { re: /localhost:\d+|127\.0\.0\.1:\d+/gi,               label: "URL localhost" },
  { re: /[\w.+-]+@(?!example\.com|gmail\.com)[\w-]+\.[\w.]+/g, label: "Email (không phải example/gmail)" },
  { re: /\/(?:Users|home)\/(?!claude\b)[a-zA-Z0-9._-]+\//g, label: "Đường dẫn lộ tên người dùng" },
  { re: /\b(?:api[_-]?key|secret|token|password|passwd|bearer)\s*[:=]\s*\S+/gi, label: "Có thể là credential" },
  { re: /\b[a-z0-9-]+\.(?:internal|corp|intranet|local)\b/gi, label: "Hostname nội bộ" },
  { re: /\bpostgres:\/\/|mysql:\/\/|mongodb(?:\+srv)?:\/\//gi, label: "Connection string" },
];

const HOLE_PATTERNS = [
  { re: /\[CẦN SỐ LIỆU[^\]]*\]/g, label: "Placeholder [CẦN SỐ LIỆU]" },
  { re: /\[TODO[^\]]*\]|\bTODO\b/g, label: "TODO còn sót" },
  { re: /\bXXX\b|\?\?\?/g,         label: "Đánh dấu tạm XXX / ???" },
  { re: /\blorem ipsum\b/gi,       label: "Lorem ipsum" },
];

/** Số minh hoạ do skill tự đặt — không blocking, nhưng tác giả phải soát trước khi đăng. */
const ILLUSTRATIVE = /<!--\s*minh\s+h(?:oạ|ọa)\s*-->/i;

function scanFile(md, patterns) {
  const lines = md.split(/\r?\n/);
  const hits = [];
  lines.forEach((line, idx) => {
    if (/^\s*(#|<!--)/.test(line)) return;
    for (const p of patterns) {
      p.re.lastIndex = 0;
      let found = line.match(p.re);
      if (found && p.skip) found = found.filter(v => !p.skip(v));
      if (found && found.length) hits.push({ line: idx + 1, label: p.label, sample: found.slice(0, 3).join(", ") });
    }
  });
  return hits;
}

function cmdCheck(slug) {
  const { dir } = findSlug(slug);
  console.log(c("bold", `\n=== PUBLISH CHECK: ${slug} ===\n`));
  let blocking = 0;

  for (const f of ["index.vi.md", "index.en.md"]) {
    const md = readIf(path.join(dir, f));
    if (!md) continue;

    const leaks = scanFile(md, LEAK_PATTERNS);
    const holes = scanFile(md, HOLE_PATTERNS);

    for (const h of leaks) {
      console.log(c("red", `  [LEAK]  ${f}:${h.line}  ${h.label}`) + c("dim", `  → ${h.sample}`));
      blocking++;
    }
    for (const h of holes) {
      console.log(c("red", `  [HOLE]  ${f}:${h.line}  ${h.label}`) + c("dim", `  → ${h.sample}`));
      blocking++;
    }

    const fm = parseFrontmatter(md);
    if (!fm.title) { console.log(c("red", `  [META]  ${f}  thiếu title`)); blocking++; }
    if (!fm.description) console.log(c("yellow", `  [META]  ${f}  thiếu description`));
    else if (fm.description.length > 160) console.log(c("yellow", `  [META]  ${f}  description ${fm.description.length} ký tự (>160)`));
    if (!fm.tags || fm.tags === "[]") console.log(c("yellow", `  [META]  ${f}  chưa có tags`));
  }

  for (const f of ["index.vi.md", "index.en.md"]) {
    const md = readIf(path.join(dir, f));
    if (!md) continue;
    md.split(/\r?\n/).forEach((line, idx) => {
      if (ILLUSTRATIVE.test(line)) console.log(c("yellow", `  [MINH HOẠ] ${f}:${idx + 1}`) + c("dim", `  → ${line.replace(ILLUSTRATIVE, "").trim().slice(0, 90)}`));
    });
  }

  const imgs = parseImages(readIf(path.join(dir, "images.md")));
  for (const i of imgs) {
    if (["TODO", "NEEDS_CAPTURE"].includes(i.status)) {
      console.log(c("red", `  [IMG]   ${i.id}  status ${i.status}`) + (i.capture_note ? c("dim", `  → ${i.capture_note}`) : ""));
      blocking++;
    }
    if (!i.alt) { console.log(c("red", `  [IMG]   ${i.id}  thiếu alt`)); blocking++; }
  }

  console.log();
  if (blocking) {
    console.log(c("red", `  ✗ CHƯA ĐĂNG ĐƯỢC — ${blocking} mục blocking.`));
    console.log(c("dim", "    Lưu ý: đây chỉ là lớp quét bằng regex. Vẫn phải đọc bài bằng mắt"));
    console.log(c("dim", "    theo checklist ngữ nghĩa trong skill blog-publish-check.\n"));
    process.exitCode = 1;
  } else {
    console.log(c("green", "  ✓ Sạch pattern đã biết."));
    console.log(c("dim", "    Vẫn cần soát thủ công: tên khách hàng, tên đồng nghiệp,\n" +
                        "    ngữ cảnh ghép nối, và nội dung bên trong ảnh.\n"));
  }
}

/* -------------------------------------------------------- cmd: publish -- */

function cmdPublish(slug) {
  const src = path.join(DRAFTS, slug);
  if (!fs.existsSync(src)) die(`Không tìm thấy drafts/${slug}`);
  const dest = path.join(PUBLISHED, slug);
  if (fs.existsSync(dest)) die(`published/${slug} đã tồn tại`);

  for (const f of ["index.vi.md", "index.en.md"]) {
    const p = path.join(src, f);
    if (!fs.existsSync(p)) continue;
    let md = fs.readFileSync(p, "utf8");
    md = md.replace(/^(---[\s\S]*?)status:\s*draft/m, `$1status: published`);
    md = md.replace(/^(---[\s\S]*?)date:\s*""/m, `$1date: "${today()}"`);
    fs.writeFileSync(p, md);
  }

  fs.mkdirSync(PUBLISHED, { recursive: true });
  fs.renameSync(src, dest);
  console.log(c("green", `✓ Đã publish: published/${slug}/  (date: ${today()})`));
  console.log(c("dim", "  Còn lại thủ công: upload ảnh, đặt canonical link nếu có bản EN."));
}

/* ----------------------------------------------------------------- main -- */

const [cmd, ...args] = process.argv.slice(2);
const HELP = `
blog.js — CLI cho blog workspace

  new "<tiêu đề>"     slugify (bỏ dấu tiếng Việt) + scaffold thư mục draft
  status              bảng trạng thái mọi bài
  stats <slug>        số chữ, thời gian đọc, ảnh, placeholder
  images <slug>       đối chiếu marker trong bài ↔ manifest
  links <slug>        liệt kê link, cảnh báo link nội bộ
  check <slug>        quét rò rỉ + placeholder + metadata
  publish <slug>      drafts/ → published/, đóng dấu ngày
`;

switch (cmd) {
  case "new":     cmdNew(args.join(" ")); break;
  case "status":  cmdStatus(); break;
  case "stats":   cmdStats(args[0] || die("Cần <slug>")); break;
  case "images":  cmdImages(args[0] || die("Cần <slug>")); break;
  case "links":   cmdLinks(args[0] || die("Cần <slug>")); break;
  case "check":   cmdCheck(args[0] || die("Cần <slug>")); break;
  case "publish": cmdPublish(args[0] || die("Cần <slug>")); break;
  default:        console.log(HELP);
}
