import React from "react";
import type { z } from "zod";
import type { Element } from "../../schema/schema";
import { FONT_HAND, INK, TONES, fitFont } from "../theme";
import type { ElState } from "../state";
import { sub } from "../state";
import { RoughStroke } from "./rough";

type VerdictEl = Extract<z.infer<typeof Element>, { kind: "verdict" }>;

const R = 34;

/** Tiêu đề một nửa của compare: vòng tròn ✗ đỏ hoặc ✓ xanh + câu ngắn. */
export const Verdict: React.FC<{ el: VerdictEl; x: number; y: number; w: number; st: ElState }> = ({
  el,
  x,
  y,
  w,
  st,
}) => {
  if (st.draw <= 0) return null;
  const tone = el.verdict === "wrong" ? TONES.danger : TONES.success;
  const cx = x + R;
  const cy = y + R;
  const circle = `M${cx - R},${cy} a${R},${R} 0 1,0 ${2 * R},0 a${R},${R} 0 1,0 ${-2 * R},0`;
  const k = R * 0.42;
  const mark =
    el.verdict === "wrong"
      ? `M${cx - k},${cy - k} L${cx + k},${cy + k} M${cx + k},${cy - k} L${cx - k},${cy + k}`
      : `M${cx - k},${cy + 2} L${cx - k * 0.2},${cy + k * 0.8} L${cx + k},${cy - k * 0.8}`;
  const circleP = sub(st.draw, 0, 0.5);
  const markP = sub(st.draw, 0.35, 0.75);
  const textP = sub(st.draw, 0.4, 1);
  const tx = x + 2 * R + 26;

  return (
    <g opacity={1 - 0.65 * st.dim}>
      <path d={circle} fill={tone.fill} opacity={circleP} />
      <RoughStroke d={circle} seed={el.id + "c"} color={tone.stroke} width={4.5} progress={circleP} />
      <RoughStroke d={mark} seed={el.id + "m"} color={tone.stroke} width={6} progress={markP} />
      <text
        x={tx}
        y={cy + 18}
        fontFamily={FONT_HAND}
        fontSize={fitFont(el.text, x + w - tx, 54)}
        fill={INK}
        opacity={textP}
      >
        {el.text}
      </text>
    </g>
  );
};
