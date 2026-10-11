import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { checkDir, printResult, readVoiceManifest, resolveDir, ROOT, VIDEOS, VOICE, writeTimings, type VoiceManifest } from "./lib";

// npm run voice -- 002        → xem trước: câu nào sẽ gen, tốn bao nhiêu ký tự. KHÔNG gọi API.
// npm run voice -- 002 --go   → gen các câu mới/đã sửa bằng ElevenLabs, đo thời lượng, ghi timings.json
//
// Đây là bước CUỐI: chỉ chạy --go khi script, hình, phụ đề đã chốt (gen lại = tốn credit).
// Mỗi câu thoại một file mp3; câu nào text không đổi thì dùng lại, không tốn credit.

if (existsSync(join(ROOT, ".env.local"))) process.loadEnvFile(join(ROOT, ".env.local"));
const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "UsgbMVmY3U59ijwK5mdh";
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || "eleven_v4_turbo";

async function tts(text: string): Promise<Buffer> {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "xi-api-key": API_KEY!, "content-type": "application/json" },
    body: JSON.stringify({ text, model_id: MODEL_ID }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

/** Thời lượng file audio (giây), dùng ffprobe đi kèm Remotion. */
function probeSeconds(file: string): number {
  const out = execFileSync(
    "npx",
    ["remotion", "ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file],
    { cwd: ROOT, encoding: "utf8" },
  );
  const s = parseFloat(out.trim());
  if (!Number.isFinite(s)) throw new Error(`không đọc được thời lượng ${file}: ${out}`);
  return s;
}

function ideaStatus(dir: string): string | null {
  const p = join(VIDEOS, dir, "idea.md");
  if (!existsSync(p)) return null;
  const m = readFileSync(p, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? (parseYaml(m[1])?.status ?? null) : null;
}

async function main() {
  const args = process.argv.slice(2);
  const dir = resolveDir(args[0]);
  const go = args.includes("--go");

  const res = checkDir(dir);
  if (!printResult(dir, res) || !res.ok) process.exit(1);
  const voice = res.video.voice;

  const outDir = join(VOICE, dir);
  const old = readVoiceManifest(dir);
  const sameVoice = old?.voiceId === VOICE_ID && old?.modelId === MODEL_ID;
  const todo = voice.filter((v) => !sameVoice || old?.lines[v.id]?.text !== v.text || !existsSync(join(outDir, `${v.id}.mp3`)));
  const chars = todo.reduce((n, v) => n + v.text.length, 0);

  for (const v of voice) {
    const mark = todo.includes(v) ? `GEN  ${String(v.text.length).padStart(3)} ký tự` : "cache          ";
    console.log(`  ${v.id.padEnd(4)} ${mark}  ${v.text}`);
  }
  if (old && !sameVoice) console.log(`  (đổi giọng/model so với lần trước → gen lại toàn bộ)`);
  console.log(`→ cần gen ${todo.length}/${voice.length} câu, ~${chars} ký tự credit`);

  if (!go) {
    if (todo.length) console.log(`Chưa gọi API. Chốt xong script/hình/phụ đề thì chạy: npm run voice -- ${args[0]} --go`);
    if (!todo.length) writeTimings(dir, voice, old!);
    return;
  }
  const status = ideaStatus(dir);
  if (status === "draft") throw new Error(`idea.md đang status: draft — duyệt idea trước khi gen voice`);
  if (todo.length && !API_KEY) throw new Error("thiếu ELEVENLABS_API_KEY trong .env.local");

  mkdirSync(outDir, { recursive: true });
  const manifest: VoiceManifest = { voiceId: VOICE_ID, modelId: MODEL_ID, lines: sameVoice ? { ...old!.lines } : {} };
  for (const v of todo) {
    const file = join(outDir, `${v.id}.mp3`);
    writeFileSync(file, await tts(v.text));
    manifest.lines[v.id] = { text: v.text, seconds: probeSeconds(file) };
    // ghi sau từng câu: lỗi giữa chừng thì các câu đã trả tiền vẫn còn
    writeFileSync(join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
    console.log(`  ✓ ${v.id} ${manifest.lines[v.id].seconds.toFixed(2)}s`);
  }

  // dọn câu đã bị xoá khỏi script
  const ids = new Set(voice.map((v) => v.id));
  for (const id of Object.keys(manifest.lines)) if (!ids.has(id)) delete manifest.lines[id];
  for (const f of readdirSync(outDir)) if (f.endsWith(".mp3") && !ids.has(f.slice(0, -4))) rmSync(join(outDir, f));
  writeFileSync(join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

  writeTimings(dir, voice, manifest);
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
