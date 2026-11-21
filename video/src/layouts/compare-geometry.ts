import type { Video } from "../../schema/schema";
import { SAFE } from "../theme";

/**
 * Hình học của layout compare — thuần TS (không React) để rules.ts kiểm tràn khung được.
 * Khung 1080×1920: hai nửa trên/dưới, mỗi nửa xếp chồng verdict → code → hàng box → note.
 */

type El = Video["scenes"][number]["elements"][number];
export type Rect = { cx: number; cy: number; w: number; h: number };

export const X = SAFE.left + 10;
export const WIDTH = SAFE.right - SAFE.left - 20;
export const TOP = 300;
export const MID = 890;
export const BOTTOM = SAFE.bottom;
export const HALF_H = MID - TOP - 20; // nửa dưới bắt đầu ở MID + 20, cao bằng nửa trên

const VERDICT_H = 68;
export const BOX_H = 120;
export const NOTE_H = 56;
const GAP = 30;
const BOX_GAP = 24;

export const CODE_PAD = 26;
export const CODE_LINE = 52;
export const codeHeight = (lines: number) => 2 * CODE_PAD + lines * CODE_LINE;

/** Element thuộc nửa của verdict đứng trước nó trong script. */
export function splitHalves(els: El[]): [El[], El[]] {
  const halves: El[][] = [];
  for (const e of els) {
    if (e.kind === "verdict" || !halves.length) halves.push([]);
    halves[halves.length - 1].push(e);
  }
  return [halves[0] ?? [], halves[1] ?? []];
}

export type Placed =
  | { el: Extract<El, { kind: "verdict" }>; y: number; h: number }
  | { el: Extract<El, { kind: "code" }>; y: number; h: number }
  | { el: Extract<El, { kind: "note" }>; y: number; h: number }
  | { el: Extract<El, { kind: "box" }>; rect: Rect };

/** Xếp một nửa từ y0 xuống. Thứ tự hình cố định (verdict, code, box, note), không theo thứ tự script. */
export function placeHalf(els: El[], y0: number): Placed[] {
  const out: Placed[] = [];
  let y = y0;
  const verdict = els.find((e) => e.kind === "verdict");
  const code = els.find((e) => e.kind === "code");
  const boxes = els.filter((e) => e.kind === "box");
  const note = els.find((e) => e.kind === "note");

  if (verdict) out.push({ el: verdict, y, h: VERDICT_H }), (y += VERDICT_H + GAP);
  if (code) {
    const h = codeHeight(code.lines.length);
    out.push({ el: code, y, h }), (y += h + GAP);
  }
  if (boxes.length) {
    const bw = (WIDTH - BOX_GAP * (boxes.length - 1)) / boxes.length;
    boxes.forEach((b, i) =>
      out.push({ el: b, rect: { cx: X + bw / 2 + i * (bw + BOX_GAP), cy: y + BOX_H / 2, w: bw, h: BOX_H } }),
    );
    y += BOX_H + GAP;
  }
  if (note) out.push({ el: note, y, h: NOTE_H });
  return out;
}

/** Chiều cao thật một nửa chiếm. */
export function halfHeight(els: El[]): number {
  return placeHalf(els, 0).reduce((m, p) => Math.max(m, "rect" in p ? p.rect.cy + p.rect.h / 2 : p.y + p.h), 0);
}
