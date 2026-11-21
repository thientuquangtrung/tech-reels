import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { checkVideo } from "../src/check";
import { GAP_S, LEAD_S, type Timing } from "../src/timeline";

export const ROOT = join(__dirname, "..");
export const VIDEOS = join(ROOT, "videos");

/** Thư mục video có file `file` (mặc định script.json), sắp theo tên. */
export function videoDirs(file = "script.json"): string[] {
  return readdirSync(VIDEOS, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(VIDEOS, d.name, file)))
    .map((d) => d.name)
    .sort();
}

/** "001" hoặc "001-one-user" → "001-one-user". */
export function resolveDir(arg: string | undefined, file = "script.json"): string {
  if (!arg) throw new Error("thiếu id video, vd: 001");
  const hits = videoDirs(file).filter((d) => d === arg || d.startsWith(arg + "-") || d.startsWith(arg));
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

/** Giọng đọc đã gen: public/voice/<dir>/<id>.mp3 + manifest.json (text đã đọc, thời lượng). */
export const VOICE = join(ROOT, "public", "voice");
export type VoiceManifest = { voiceId: string; modelId: string; lines: Record<string, { text: string; seconds: number }> };

export function readVoiceManifest(dir: string): VoiceManifest | null {
  const p = join(VOICE, dir, "manifest.json");
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
}

/** Câu thoại nào chưa có voice hoặc đã sửa sau khi gen. Rỗng = voice khớp script. */
export function staleVoiceLines(voice: { id: string; text: string }[], m: VoiceManifest | null): string[] {
  return voice.filter((v) => m?.lines[v.id]?.text !== v.text).map((v) => v.id);
}

/** Xếp các câu nối tiếp nhau theo thời lượng thật, cùng LEAD_S/GAP_S với timeline ước lượng → videos/<dir>/timings.json. */
export function writeTimings(dir: string, voice: { id: string }[], m: VoiceManifest): void {
  let cursor = LEAD_S;
  const timings: Timing[] = voice.map((v) => {
    const start = cursor;
    const end = start + m.lines[v.id].seconds;
    cursor = end + GAP_S;
    return { id: v.id, start: +start.toFixed(3), end: +end.toFixed(3) };
  });
  writeFileSync(join(VIDEOS, dir, "timings.json"), JSON.stringify(timings, null, 2) + "\n");
  console.log(`→ videos/${dir}/timings.json (${cursor.toFixed(1)}s thoại). Render lại: npm run render -- ${dir.slice(0, 3)}`);
}

/** Timings đang có hiệu lực: chỉ khi voice khớp mọi câu thoại (cùng luật với sync). */
export function activeTimings(dir: string, voice: { id: string; text: string }[]): Timing[] | undefined {
  const p = join(VIDEOS, dir, "timings.json");
  const m = readVoiceManifest(dir);
  if (!m || staleVoiceLines(voice, m).length || !existsSync(p)) return undefined;
  return JSON.parse(readFileSync(p, "utf8"));
}
