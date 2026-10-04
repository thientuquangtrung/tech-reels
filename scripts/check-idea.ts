import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";
import { LIMITS, Layout, Series } from "../schema/schema";
import { SUPPORTED_LAYOUTS } from "../src/layouts/rules";
import { resolveDir, VIDEOS, videoDirs } from "./lib";

// npm run check-idea            → kiểm mọi idea.md
// npm run check-idea -- 002     → kiểm một idea
//
// Model viết idea.md, code kiểm: frontmatter đúng enum, mọi điểm mấu chốt có trích nguồn,
// nguồn được trích phải tồn tại, hook đủ ngắn, idea đã duyệt thì không còn việc cần kiểm.

const Frontmatter = z.object({
  series: Series,
  layout: Layout,
  sources: z.array(z.string().trim().min(1)).min(1, "cần ít nhất 1 nguồn"),
  status: z.enum(["draft", "approved", "scripted"]),
});

const SECTIONS = {
  oneIdea: "Một ý duy nhất",
  points: "Điểm mấu chốt",
  mine: "Góc của tôi",
  hooks: "Hook ứng viên",
  verify: "Cần kiểm trước khi viết script",
} as const;

const MAX_ONE_IDEA_CHARS = 160;
const POINTS_MIN = 2;
const POINTS_MAX = 5;

type Report = { errors: string[]; warnings: string[] };

function splitFrontmatter(text: string): { fm: unknown; body: string } | null {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return null;
  return { fm: parseYaml(m[1]), body: m[2] };
}

/** "## Tên mục" → nội dung đến mục ## kế tiếp. */
function sections(body: string): Map<string, string> {
  const out = new Map<string, string>();
  const parts = body.split(/^##\s+/m).slice(1);
  for (const p of parts) {
    const nl = p.indexOf("\n");
    const name = (nl < 0 ? p : p.slice(0, nl)).trim();
    out.set(name, nl < 0 ? "" : p.slice(nl + 1).trim());
  }
  return out;
}

const bullets = (s: string) =>
  s
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => /^[-*]\s+/.test(l))
    .map((l) => l.replace(/^[-*]\s+/, ""))
    .filter((l) => l && !l.startsWith("<!--"));

export function checkIdea(text: string): Report {
  const r: Report = { errors: [], warnings: [] };
  const split = splitFrontmatter(text);
  if (!split) return { errors: ["thiếu frontmatter (--- ... ---) ở đầu file"], warnings: [] };

  const fm = Frontmatter.safeParse(split.fm);
  if (!fm.success) {
    fm.error.issues.forEach((i) => r.errors.push(`frontmatter.${i.path.join(".")}: ${i.message}`));
  }
  const nSources = fm.success ? fm.data.sources.length : 0;

  if (fm.success) {
    if (!SUPPORTED_LAYOUTS.includes(fm.data.layout))
      r.warnings.push(`layout "${fm.data.layout}" chưa dựng — phải dựng trước khi render`);
    if (nSources === 1) r.warnings.push("chỉ có 1 nguồn — nên có thêm góc riêng hoặc nguồn thứ hai");
  }

  if (!/^#\s+\S/m.test(split.body)) r.errors.push("thiếu tiêu đề # ...");

  const sec = sections(split.body);
  for (const name of Object.values(SECTIONS))
    if (!sec.has(name)) r.errors.push(`thiếu mục "## ${name}"`);

  // Một ý duy nhất
  const one = (sec.get(SECTIONS.oneIdea) ?? "").replace(/<!--[\s\S]*?-->/g, "").trim();
  if (sec.has(SECTIONS.oneIdea) && !one) r.errors.push(`"${SECTIONS.oneIdea}" đang trống`);
  if (one.length > MAX_ONE_IDEA_CHARS)
    r.errors.push(`"${SECTIONS.oneIdea}" dài ${one.length} ký tự > ${MAX_ONE_IDEA_CHARS} — chưa đủ hẹp`);

  // Điểm mấu chốt: 2–5 ý, ý nào cũng trích [nguồn N] với N có thật
  const points = bullets(sec.get(SECTIONS.points) ?? "");
  if (sec.has(SECTIONS.points) && (points.length < POINTS_MIN || points.length > POINTS_MAX))
    r.errors.push(`"${SECTIONS.points}" có ${points.length} ý, cần ${POINTS_MIN}–${POINTS_MAX}`);
  points.forEach((p, i) => {
    const refs = [...p.matchAll(/\[nguồn\s+(\d+)\]/g)].map((m) => Number(m[1]));
    if (!refs.length) r.errors.push(`điểm ${i + 1} không có [nguồn N] — chuyển sang "${SECTIONS.verify}"`);
    refs.forEach((n) => {
      if (n < 1 || n > nSources) r.errors.push(`điểm ${i + 1} trích [nguồn ${n}] nhưng chỉ có ${nSources} nguồn`);
    });
  });

  // Góc của tôi: được trống, nhưng nhắc
  if (sec.has(SECTIONS.mine) && !bullets(sec.get(SECTIONS.mine)!).length)
    r.warnings.push(`"${SECTIONS.mine}" trống — video sẽ thiếu trải nghiệm riêng`);

  // Hook: ít nhất 1, mỗi cái ≤ giới hạn từ của schema video
  const hooks = bullets(sec.get(SECTIONS.hooks) ?? "").map((h) => h.replace(/^["“]|["”]$/g, ""));
  if (sec.has(SECTIONS.hooks) && !hooks.length) r.errors.push(`"${SECTIONS.hooks}" cần ít nhất 1 hook`);
  hooks.forEach((h, i) => {
    const words = h.trim().split(/\s+/).length;
    if (words > LIMITS.hookWords) r.errors.push(`hook ${i + 1} dài ${words} từ > ${LIMITS.hookWords}`);
  });

  // Cần kiểm: checkbox. Đã duyệt thì không được còn ô trống.
  const todo = (sec.get(SECTIONS.verify) ?? "").split("\n").filter((l) => /^\s*[-*]\s+\[\s\]/.test(l));
  if (fm.success && fm.data.status !== "draft" && todo.length)
    r.errors.push(`status "${fm.data.status}" nhưng còn ${todo.length} mục chưa kiểm`);
  else if (todo.length) r.warnings.push(`còn ${todo.length} mục cần kiểm`);

  return r;
}

function main() {
  const arg = process.argv[2];
  const dirs = arg ? [resolveDir(arg, "idea.md")] : videoDirs("idea.md");
  let ok = true;
  for (const dir of dirs) {
    const r = checkIdea(readFileSync(join(VIDEOS, dir, "idea.md"), "utf8"));
    const mark = r.errors.length ? "✗" : "✓";
    console.log(`${mark} ${dir}/idea.md: ${r.errors.length} lỗi, ${r.warnings.length} lưu ý`);
    r.errors.forEach((e) => console.log(`  - ${e}`));
    r.warnings.forEach((w) => console.log(`  ! ${w}`));
    if (r.errors.length) ok = false;
  }
  process.exit(ok ? 0 : 1);
}

if (require.main === module) main();
