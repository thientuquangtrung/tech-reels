import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { checkDir, printResult, readVoiceManifest, ROOT, staleVoiceLines, VIDEOS, videoDirs } from "./lib";

/** Sinh src/videos.generated.ts: mỗi video hợp lệ thành một composition trong Studio. */
export function sync(): void {
  const lines: string[] = ["// File sinh tự động bởi scripts/sync.ts — đừng sửa tay.", ""];
  const entries: string[] = [];
  videoDirs().forEach((dir, i) => {
    const res = checkDir(dir);
    if (!printResult(dir, res) || !res.ok) return;
    lines.push(`import s${i} from "../videos/${dir}/script.json";`);

    // Chỉ dùng voice + timings thật khi voice khớp từng câu thoại; lệch thì quay về timing ước lượng.
    const manifest = readVoiceManifest(dir);
    const stale = manifest ? staleVoiceLines(res.video.voice, manifest) : [];
    if (manifest && stale.length) console.log(`  ! voice cũ (${stale.join(", ")} đã sửa/chưa gen) → tạm bỏ tiếng. Chốt xong thì: npm run voice -- ${dir.slice(0, 3)}`);
    const hasVoice = !!manifest && !stale.length && existsSync(join(VIDEOS, dir, "timings.json"));
    if (hasVoice) lines.push(`import t${i} from "../videos/${dir}/timings.json";`);
    entries.push(
      `  { dir: ${JSON.stringify(dir)}, script: s${i}, timings: ${hasVoice ? `t${i}` : "undefined"}, voice: ${hasVoice ? JSON.stringify(`voice/${dir}`) : "undefined"} },`,
    );
  });
  lines.push(
    `import type { Timing } from "./timeline";`,
    "",
    "export const videos: { dir: string; script: unknown; timings?: Timing[]; voice?: string }[] = [",
    ...entries,
    "];",
    "",
  );
  writeFileSync(join(ROOT, "src", "videos.generated.ts"), lines.join("\n"));
}

if (require.main === module) sync();
