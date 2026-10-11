import React from "react";
import type { z } from "zod";
import type { Element } from "../../schema/schema";
import { FONT_MONO, INK, INK_SOFT, TONES, fitFont } from "../theme";
import type { ElState } from "../state";
import { sub } from "../state";
import { CODE_LINE, CODE_PAD, codeHeight } from "../layouts/compare-geometry";
import { RoughStroke, roundRectD } from "./rough";

type CodeEl = Extract<z.infer<typeof Element>, { kind: "code" }>;

const CODE_FILL = "#f6f4ee";

const isComment = (l: string) => /^\s*(\/\/|#|--)/.test(l);

/** Khối code nền giấy ngà; các dòng hiện lần lượt như đang gõ. */
export const Code: React.FC<{ el: CodeEl; x: number; y: number; w: number; st: ElState }> = ({ el, x, y, w, st }) => {
  if (st.draw <= 0) return null;
  const h = codeHeight(el.lines.length);
  const d = roundRectD(x, y, w, h, 16);
  const longest = el.lines.reduce((m, l) => Math.max(m, l.length), 1);
  const size = fitFont("x".repeat(longest), w - 2 * CODE_PAD, 36, true);
  const n = el.lines.length;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const glow = TONES.accent.stroke;

  return (
    <g
      opacity={1 - 0.65 * st.dim}
      transform={`translate(${cx} ${cy}) scale(${1 + st.pulse}) translate(${-cx} ${-cy})`}
    >
      {st.highlight > 0 && (
        <path d={roundRectD(x - 12, y - 12, w + 24, h + 24, 24)} fill={glow} opacity={0.16 * st.highlight} />
      )}
      <path d={d} fill={CODE_FILL} opacity={sub(st.draw, 0, 0.3)} />
      <RoughStroke
        d={d}
        seed={el.id}
        color={st.highlight > 0 ? glow : INK_SOFT}
        width={3 + 2 * st.highlight}
        progress={sub(st.draw, 0, 0.4)}
      />
      {el.lines.map((line, i) => {
        const p = sub(st.draw, 0.3 + (0.7 * i) / n, 0.3 + (0.7 * (i + 1)) / n);
        if (p <= 0) return null;
        const shown = line.slice(0, Math.ceil(line.length * p));
        return (
          <text
            key={i}
            x={x + CODE_PAD}
            y={y + CODE_PAD + i * CODE_LINE + CODE_LINE * 0.72}
            fontFamily={FONT_MONO}
            fontSize={size}
            fill={isComment(line) ? INK_SOFT : INK}
            style={{ whiteSpace: "pre", fontVariantLigatures: "none" }}
          >
            {shown}
          </text>
        );
      })}
    </g>
  );
};
