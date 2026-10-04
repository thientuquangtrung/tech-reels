import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import type { Video } from "../../schema/schema";
import { Actor } from "../elements/Actor";
import { Box, type Rect } from "../elements/Box";
import { FONT_HAND, INK, INK_SOFT, SAFE, TONES } from "../theme";
import { elState, sub } from "../state";
import type { SceneTimeline } from "../timeline";

type Scene = Video["scenes"][number];

// Hình học của layout (khung 1080×1920)
const CARD = { x: SAFE.left + 10, y: 290, w: SAFE.right - SAFE.left - 20, h: 300 };
const CYCLE = { cx: 520, cy: 1085, rx: 300, ry: 375 };
const BOX = { w: 236, h: 116 };
const PAD = 16;

/** Vị trí box trên elip, theo chiều kim đồng hồ bắt đầu từ đỉnh. */
function nodeRects(n: number): Rect[] {
  return Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI * i) / n;
    return { cx: CYCLE.cx + CYCLE.rx * Math.sin(a), cy: CYCLE.cy - CYCLE.ry * Math.cos(a), ...BOX };
  });
}

const inside = (p: { x: number; y: number }, r: Rect) =>
  Math.abs(p.x - r.cx) < r.w / 2 + PAD && Math.abs(p.y - r.cy) < r.h / 2 + PAD;

/** Cung elip giữa box i và i+1, cắt bỏ phần nằm trong hai box. Toàn bộ là phép tính, không đoán. */
function arcBetween(i: number, rects: Rect[]): { d: string; head: string } {
  const n = rects.length;
  const a0 = (2 * Math.PI * i) / n;
  const a1 = (2 * Math.PI * (i + 1)) / n;
  const pts: { x: number; y: number }[] = [];
  for (let k = 0; k <= 80; k++) {
    const a = a0 + ((a1 - a0) * k) / 80;
    const p = { x: CYCLE.cx + CYCLE.rx * Math.sin(a), y: CYCLE.cy - CYCLE.ry * Math.cos(a) };
    if (!inside(p, rects[i]) && !inside(p, rects[(i + 1) % n])) pts.push(p);
  }
  if (pts.length < 2) return { d: "", head: "" };
  const d = "M" + pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L");
  const e = pts[pts.length - 1];
  const b = pts[Math.max(0, pts.length - 4)];
  const ang = Math.atan2(e.y - b.y, e.x - b.x);
  const wing = (s: number) =>
    `${(e.x - 22 * Math.cos(ang + s)).toFixed(1)},${(e.y - 22 * Math.sin(ang + s)).toFixed(1)}`;
  return { d, head: `M${wing(0.5)} L${e.x.toFixed(1)},${e.y.toFixed(1)} L${wing(-0.5)}` };
}

export const CardCycle: React.FC<{ scene: Scene; tl: SceneTimeline }> = ({ scene, tl }) => {
  const frame = useCurrentFrame();
  const actor = scene.elements.find((e) => e.kind === "actor");
  const boxes = scene.elements.filter((e) => e.kind === "box");
  const note = scene.elements.find((e) => e.kind === "note");

  const rects = useMemo(() => nodeRects(boxes.length), [boxes.length]);
  const arcs = useMemo(() => rects.map((_, i) => arcBetween(i, rects)), [rects]);
  const states = boxes.map((b) => elState(b.id, frame, tl.steps));

  return (
    <g>
      {/* mũi tên: hiện cùng lúc với box đích; mũi tên khép vòng hiện sau box cuối */}
      {arcs.map((arc, i) => {
        const target = (i + 1) % boxes.length;
        const isClosing = target === 0;
        const src = states[i];
        const dst = states[target];
        const p = isClosing ? sub(src.draw, 0.4, 1) : sub(dst.draw, 0, 0.6);
        if (p <= 0 || !arc.d) return null;
        const flow = dst.flow;
        const color = flow > 0 ? TONES[boxes[target].tone].stroke : INK_SOFT;
        const maskId = `m-${scene.id}-${i}`;
        return (
          <g key={i} opacity={1 - 0.6 * Math.max(src.dim, dst.dim)}>
            <mask id={maskId}>
              <path
                d={arc.d}
                fill="none"
                stroke="white"
                strokeWidth={24}
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - p}
              />
            </mask>
            <path
              d={arc.d}
              fill="none"
              stroke={color}
              strokeWidth={4 + 2 * flow}
              strokeLinecap="round"
              strokeDasharray="12 12"
              strokeDashoffset={-frame * (0.6 + 2.4 * flow)}
              mask={`url(#${maskId})`}
            />
            <path
              d={arc.head}
              fill="none"
              stroke={color}
              strokeWidth={4.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={sub(p, 0.85, 1)}
            />
          </g>
        );
      })}

      {boxes.map((b, i) => (
        <Box key={b.id} el={b} rect={rects[i]} st={states[i]} />
      ))}

      {note && (() => {
        const st = elState(note.id, frame, tl.steps);
        if (st.draw <= 0) return null;
        return (
          <text
            x={CYCLE.cx}
            y={CYCLE.cy + 20}
            textAnchor="middle"
            fontFamily={FONT_HAND}
            fontSize={64}
            fill={INK}
            opacity={st.draw * (1 - 0.65 * st.dim)}
          >
            {note.text}
          </text>
        );
      })()}

      {actor && <Actor el={actor} {...CARD} st={elState(actor.id, frame, tl.steps, 40)} />}
    </g>
  );
};
