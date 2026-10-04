import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { checkVideo } from "../src/check";

export const ROOT = join(__dirname, "..");
export const VIDEOS = join(ROOT, "videos");

/** Thư mục video có script.json, sắp theo tên. */
export function videoDirs(): string[] {
  return readdirSync(VIDEOS, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(VIDEOS, d.name, "script.json")))
    .map((d) => d.name)
    .sort();
}

/** "001" hoặc "001-one-user" → "001-one-user". */
export function resolveDir(arg: string | undefined): string {
  if (!arg) throw new Error("thiếu id video, vd: 001");
  const hits = videoDirs().filter((d) => d === arg || d.startsWith(arg + "-") || d.startsWith(arg));
  if (hits.length !== 1) throw new Error(`"${arg}" khớp ${hits.length} thư mục: ${hits.join(", ") || "(không có)"}`);
  return hits[0];
}

export function checkDir(dir: string) {
  const raw = JSON.parse(readFileSync(join(VIDEOS, dir, "script.json"), "utf8"));
  return checkVideo(raw);
}

export function printResult(dir: string, res: ReturnType<typeof checkVideo>): boolean {
  if (res.ok) {
    const v = res.video;
    const els = v.scenes.reduce((n, s) => n + s.elements.length, 0);
    console.log(`✓ ${dir}: ${v.scenes.length} scene, ${els} element, ${v.voice.length} câu thoại`);
    return true;
  }
  console.log(`✗ ${dir}: ${res.errors.length} lỗi`);
  res.errors.forEach((e) => console.log(`  - ${e}`));
  return false;
}
