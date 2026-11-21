import { checkDir, printResult, resolveDir, videoDirs } from "./lib";

// npm run validate            → kiểm mọi video
// npm run validate -- 001     → kiểm một video
const arg = process.argv[2];
const dirs = arg ? [resolveDir(arg)] : videoDirs();
const ok = dirs.map((d) => printResult(d, checkDir(d))).every(Boolean);
process.exit(ok ? 0 : 1);
