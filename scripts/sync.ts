import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { checkDir, printResult, ROOT, VIDEOS, videoDirs } from "./lib";

/** Sinh src/videos.generated.ts: mỗi video hợp lệ thành một composition trong Studio. */
export function sync(): void {
  const lines: string[] = ["// File sinh tự động bởi scripts/sync.ts — đừng sửa tay.", ""];
  const entries: string[] = [];
  videoDirs().forEach((dir, i) => {
    if (!printResult(dir, checkDir(dir))) return;
    lines.push(`import s${i} from "../videos/${dir}/script.json";`);
    const hasTimings = existsSync(join(VIDEOS, dir, "timings.json"));
    if (hasTimings) lines.push(`import t${i} from "../videos/${dir}/timings.json";`);
    entries.push(`  { dir: ${JSON.stringify(dir)}, script: s${i}, timings: ${hasTimings ? `t${i}` : "undefined"} },`);
  });
  lines.push(
    `import type { Timing } from "./timeline";`,
    "",
    "export const videos: { dir: string; script: unknown; timings?: Timing[] }[] = [",
    ...entries,
    "];",
    "",
  );
  writeFileSync(join(ROOT, "src", "videos.generated.ts"), lines.join("\n"));
}

if (require.main === module) sync();
