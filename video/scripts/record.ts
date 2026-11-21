import { execFileSync, spawnSync } from "node:child_process";
import { createReadStream, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { join } from "node:path";
import { buildTimeline } from "../src/timeline";
import { FPS } from "../src/theme";
import {
  activeTimings,
  checkDir,
  printResult,
  readVoiceManifest,
  resolveDir,
  ROOT,
  staleVoiceLines,
  VIDEOS,
  VOICE,
  writeTimings,
  type VoiceManifest,
} from "./lib";

// npm run record -- 002              → mở http://localhost:3123: tự thu giọng từng câu, xem kèm đoạn video tương ứng.
// npm run record -- 002 --reprocess  → cắt/chuẩn hoá lại từ bản ghi gốc (videos/<dir>/voice-raw/), không cần thu lại.
//
// Cần videos/<dir>/out.mp4 (bản chưa tiếng đã chốt) để hiện hình. Mỗi câu ghi xong được cắt khoảng lặng
// đầu/cuối, lưu thành public/voice/<dir>/<id>.mp3; đủ mọi câu thì ghi timings.json như voice.ts.

const PORT = Number(process.env.PORT) || 3123;
const FRAME_S = 0.02; // phân tích mức âm theo khung 20ms
const RUN = 3; // ≥3 khung liền (60ms) vượt ngưỡng mới tính là giọng
const MIN_SNR_DB = 8; // giọng phải to hơn ồn nền ít nhất chừng này
const OK_SNR_DB = 18;
const QUIET_DB = -35; // giọng (p95 theo khung) dưới mức này → nhắc tăng mic
const TARGET_LUFS = -16; // chuẩn hoá âm lượng mọi câu về cùng mức
const PAD_S = 0.12; // chừa lại chút lặng đầu/cuối cho tự nhiên
const KEY_HEAD_S = 0.15; // bỏ tiếng gõ Space lúc bắt đầu ghi
const KEY_TAIL_S = 0.25; // … và lúc dừng ghi

const args = process.argv.slice(2);
const dir = resolveDir(args[0]);
const outDir = join(VOICE, dir);
const videoFile = join(VIDEOS, dir, "out.mp4");
const rawDir = join(VIDEOS, dir, "voice-raw");

function load() {
  const res = checkDir(dir);
  if (!res.ok) {
    printResult(dir, res);
    throw new Error("script.json chưa hợp lệ");
  }
  return res.video;
}

/** Chạy ffmpeg của Remotion, trả về stderr (nơi ffmpeg in log). */
function ffmpeg(a: string[]): string {
  const r = spawnSync("npx", ["remotion", "ffmpeg", "-hide_banner", ...a], { cwd: ROOT, encoding: "utf8" });
  if (r.status !== 0) throw new Error(`ffmpeg lỗi: ${r.stderr.slice(-500)}`);
  return r.stderr;
}
function probeSeconds(file: string): number {
  const out = execFileSync(
    "npx",
    ["remotion", "ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file],
    { cwd: ROOT, encoding: "utf8" },
  );
  return parseFloat(out.trim());
}

type Take = { seconds: number; speechDb: number; noiseDb: number; warn: string | null };

/** Giải mã về PCM 16kHz mono rồi tính mức âm (dB) từng khung FRAME_S giây. */
function frameLevels(raw: string): number[] {
  const r = spawnSync("npx", ["remotion", "ffmpeg", "-v", "error", "-i", raw, "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", "-f", "wav", "-"], {
    cwd: ROOT,
    maxBuffer: 1 << 28,
  });
  if (r.status !== 0) throw new Error(`không đọc được bản ghi: ${r.stderr.toString().slice(-300)}`);
  const pcm = r.stdout.subarray(r.stdout.indexOf("data") + 8);
  const per = Math.round(16000 * FRAME_S);
  const levels: number[] = [];
  for (let i = 0; i + per <= pcm.length / 2; i += per) {
    let sum = 0;
    for (let j = i; j < i + per; j++) sum += (pcm.readInt16LE(j * 2) / 32768) ** 2;
    levels.push(20 * Math.log10(Math.sqrt(sum / per) + 1e-9));
  }
  return levels;
}

const pct = (xs: number[], p: number) => [...xs].sort((a, b) => a - b)[Math.floor((xs.length - 1) * p)];

/**
 * Bản ghi thô (webm/mp4 từ trình duyệt) → mp3 đã cắt lặng đầu/cuối và chuẩn hoá âm lượng.
 * Ngưỡng lặng tính theo chính bản ghi (ồn nền vs giọng), không cố định — mỗi micro/phòng một khác.
 */
function processTake(raw: string, out: string): Take {
  const lv = frameLevels(raw);
  // bỏ tiếng gõ phím Space lúc bắt đầu/dừng ghi
  const i0 = Math.ceil(KEY_HEAD_S / FRAME_S);
  const i1 = lv.length - Math.ceil(KEY_TAIL_S / FRAME_S);
  const win = lv.slice(i0, i1);
  if (win.length < 10) throw new Error("bản ghi quá ngắn");
  const noiseDb = pct(win, 0.1);
  const speechDb = pct(win, 0.95);
  const snr = speechDb - noiseDb;
  const levels = `giọng ${speechDb.toFixed(0)}dB, ồn nền ${noiseDb.toFixed(0)}dB`;
  if (snr < MIN_SNR_DB) throw new Error(`không nghe ra giọng (${levels}) — kiểm tra micro / nói gần hơn`);

  // đầu/cuối giọng = khung đầu/cuối có ≥ RUN khung liên tiếp vượt ngưỡng (bỏ qua tiếng lách cách lẻ)
  const thr = noiseDb + Math.max(6, snr * 0.3);
  const loud = (k: number) => win.slice(k, k + RUN).length === RUN && win.slice(k, k + RUN).every((x) => x >= thr);
  let first = 0;
  while (first < win.length && !loud(first)) first++;
  let last = win.length - RUN;
  while (last > first && !loud(last)) last--;
  const a = Math.max(0, (i0 + first) * FRAME_S - PAD_S);
  const b = Math.min(i1 * FRAME_S, (i0 + last + RUN) * FRAME_S + PAD_S);

  ffmpeg([
    "-y", "-v", "error", "-i", raw,
    "-af", `atrim=start=${a}:end=${b},asetpts=PTS-STARTPTS,loudnorm=I=${TARGET_LUFS}:TP=-1.5:LRA=11`,
    "-ar", "44100", "-ac", "1", "-c:a", "libmp3lame", "-q:a", "2", out,
  ]);
  const warn =
    speechDb < QUIET_DB
      ? `Giọng thu khá nhỏ (${levels}). Đã tự tăng âm lượng, nhưng nên tăng Input volume của macOS hoặc nói gần micro hơn để đỡ ồn.`
      : snr < OK_SNR_DB
        ? `Ồn nền khá lớn so với giọng (${levels}).`
        : null;
  return { seconds: probeSeconds(out), speechDb, noiseDb, warn };
}

function state() {
  const video = load();
  const timings = activeTimings(dir, video.voice);
  const tl = buildTimeline(video, timings);
  const m = readVoiceManifest(dir);
  const stale = new Set(staleVoiceLines(video.voice, m));
  const sceneOf = (from: number) => tl.scenes.find((s) => from >= s.from && from < s.to)?.id ?? "";
  const videoStale = existsSync(videoFile) && statSync(videoFile).mtimeMs < statSync(join(VIDEOS, dir, "script.json")).mtimeMs;
  return {
    dir,
    fps: FPS,
    hook: video.hook,
    hasVideo: existsSync(videoFile),
    videoStale,
    lines: tl.segments.map((s, i) => ({
      id: s.id,
      text: s.text,
      scene: sceneOf(s.from),
      from: s.from / FPS,
      // đoạn hình của câu kéo tới lúc câu sau bắt đầu (hoặc tới takeaway)
      to: (tl.segments[i + 1]?.from ?? tl.outroFrom) / FPS,
      recorded: !stale.has(s.id),
      seconds: m?.lines[s.id]?.seconds ?? null,
    })),
  };
}

function saveTake(id: string, ext: string, body: Buffer) {
  const video = load();
  const line = video.voice.find((v) => v.id === id);
  if (!line) throw new Error(`không có câu ${id}`);
  mkdirSync(outDir, { recursive: true });
  // giữ bản ghi gốc (gitignore) để xử lý lại khi đổi thuật toán cắt/chuẩn hoá, khỏi thu lại
  mkdirSync(rawDir, { recursive: true });
  for (const f of readdirSync(rawDir)) if (f.startsWith(`${id}.`)) rmSync(join(rawDir, f));
  const raw = join(rawDir, `${id}.${ext}`);
  writeFileSync(raw, body);
  return commitTake(video, id, raw);
}

function commitTake(video: ReturnType<typeof load>, id: string, raw: string): Take {
  const line = video.voice.find((v) => v.id === id)!;
  const take = processTake(raw, join(outDir, `${id}.mp3`));
  const old = readVoiceManifest(dir);
  // bản ghi tay khác nguồn với TTS: đổi nguồn thì bỏ các câu cũ của nguồn kia
  const m: VoiceManifest = old?.voiceId === "self" ? old : { voiceId: "self", modelId: "recorded", lines: {} };
  m.lines[id] = { text: line.text, seconds: take.seconds };
  writeFileSync(join(outDir, "manifest.json"), JSON.stringify(m, null, 2) + "\n");
  console.log(`  ✓ ${id} ${take.seconds.toFixed(2)}s (giọng ${take.speechDb.toFixed(0)}dB, ồn ${take.noiseDb.toFixed(0)}dB)${take.warn ? " ! " + take.warn : ""}`);
  if (!staleVoiceLines(video.voice, m).length) writeTimings(dir, video.voice, m);
  return take;
}

/** Gửi file có hỗ trợ Range — trình duyệt cần để tua video. */
function sendFile(req: IncomingMessage, res: ServerResponse, file: string, type: string) {
  const size = statSync(file).size;
  const range = req.headers.range?.match(/bytes=(\d*)-(\d*)/);
  if (range) {
    const start = range[1] ? +range[1] : 0;
    const end = range[2] ? +range[2] : size - 1;
    res.writeHead(206, {
      "content-type": type,
      "content-range": `bytes ${start}-${end}/${size}`,
      "accept-ranges": "bytes",
      "content-length": end - start + 1,
      "cache-control": "no-store",
    });
    createReadStream(file, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { "content-type": type, "content-length": size, "accept-ranges": "bytes", "cache-control": "no-store" });
    createReadStream(file).pipe(res);
  }
}

function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((ok, fail) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => ok(Buffer.concat(chunks)));
    req.on("error", fail);
  });
}

const json = (res: ServerResponse, code: number, data: unknown) => {
  res.writeHead(code, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
  try {
    if (url.pathname === "/") {
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(readFileSync(join(__dirname, "record.html")));
    } else if (url.pathname === "/state") {
      json(res, 200, state());
    } else if (url.pathname === "/video" && existsSync(videoFile)) {
      sendFile(req, res, videoFile, "video/mp4");
    } else if (url.pathname.startsWith("/take/") && req.method === "GET") {
      const f = join(outDir, `${url.pathname.slice(6).replace(/[^\w-]/g, "")}.mp3`);
      if (!existsSync(f)) return json(res, 404, { error: "chưa có" });
      sendFile(req, res, f, "audio/mpeg");
    } else if (url.pathname.startsWith("/take/") && req.method === "POST") {
      const id = url.pathname.slice(6).replace(/[^\w-]/g, "");
      const ext = (url.searchParams.get("ext") ?? "webm").replace(/\W/g, "");
      json(res, 200, saveTake(id, ext, await readBody(req)));
    } else {
      json(res, 404, { error: "not found" });
    }
  } catch (e: any) {
    console.error(`  ✗ ${e.message ?? e}`);
    json(res, 500, { error: String(e.message ?? e) });
  }
});

if (args.includes("--reprocess")) {
  // xử lý lại mọi bản ghi gốc với thuật toán hiện tại, không mở server
  const video = load();
  const raws = existsSync(rawDir) ? readdirSync(rawDir) : [];
  for (const v of video.voice) {
    const f = raws.find((r) => r.startsWith(`${v.id}.`));
    if (!f) console.log(`  - ${v.id}: chưa có bản ghi gốc`);
    else commitTake(video, v.id, join(rawDir, f));
  }
  process.exit(0);
}

const s = state();
if (!s.hasVideo) console.log(`! chưa có videos/${dir}/out.mp4 — vẫn thu được nhưng không có hình. Chạy: npm run render -- ${dir.slice(0, 3)}`);
if (s.videoStale) console.log(`! out.mp4 cũ hơn script.json — hình có thể không khớp câu thoại, nên render lại`);
server.listen(PORT, () => console.log(`Thu âm ${dir}: http://localhost:${PORT}  (Ctrl+C để dừng)`));
