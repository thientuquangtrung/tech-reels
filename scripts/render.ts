import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { join } from "node:path";
import { checkDir, printResult, resolveDir, ROOT, VIDEOS } from "./lib";
import { sync } from "./sync";

// npm run render -- 001                 → videos/001-.../out.mp4
// npm run render -- 001 --still 90,400  → ảnh PNG tại các frame đó (xem nhanh, không render cả video)
async function main() {
  const args = process.argv.slice(2);
  const dir = resolveDir(args[0]);
  const stillArg = args.indexOf("--still");
  const stills = stillArg >= 0 ? args[stillArg + 1].split(",").map(Number) : [];

  if (!printResult(dir, checkDir(dir))) process.exit(1);
  sync();

  // Máy bình thường: Remotion tự tải Chrome. Môi trường bị chặn mạng: trỏ REMOTION_BROWSER tới Chromium có sẵn.
  const browserExecutable = process.env.REMOTION_BROWSER || null;
  const chromiumOptions = browserExecutable ? { gl: "swiftshader" as const } : {};

  const serveUrl = await bundle({ entryPoint: join(ROOT, "src", "index.ts") });
  const composition = await selectComposition({
    serveUrl,
    id: `v${dir}`,
    browserExecutable,
    chromiumOptions,
  });

  if (stills.length) {
    for (const frame of stills) {
      const output = join(VIDEOS, dir, `still-${frame}.png`);
      await renderStill({ serveUrl, composition, frame, output, browserExecutable, chromiumOptions });
      console.log(`→ ${output}`);
    }
    return;
  }

  const outputLocation = join(VIDEOS, dir, "out.mp4");
  let last = -1;
  await renderMedia({
    serveUrl,
    composition,
    codec: "h264",
    outputLocation,
    browserExecutable,
    chromiumOptions,
    onProgress: ({ progress }) => {
      const pct = Math.floor(progress * 10) * 10;
      if (pct !== last) console.log(`render ${pct}%`), (last = pct);
    },
  });
  console.log(`→ ${outputLocation} (${(composition.durationInFrames / composition.fps).toFixed(1)}s)`);
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
