import React from "react";
import type { z } from "zod";
import type { Element } from "../../schema/schema";
import { FONT_HAND, FONT_MONO, INK, INK_SOFT, TONES, fitFont } from "../theme";
import type { ElState } from "../state";
import { sub } from "../state";
import { RoughStroke, roundRectD } from "./rough";

type BoxEl = Extract<z.infer<typeof Element>, { kind: "box" }>;

export type Rect = { cx: number; cy: number; w: number; h: number };

export const Box: React.FC<{ el: BoxEl; rect: Rect; st: ElState }> = ({ el, rect, st }) => {
  if (st.draw <= 0) return null;
  const { cx, cy, w, h } = rect;
  const x = cx - w / 2;
  const y = cy - h / 2;
  const tone = TONES[el.tone];
  const d = roundRectD(x, y, w, h, 18);
  const scale = 1 + st.pulse;
  const fillP = sub(st.draw, 0.35, 0.8);
  const textP = sub(st.draw, 0.5, 1);

  const labelSize = fitFont(el.label, w - 36, 46);
  const subSize = el.sub ? fitFont(el.sub, w - 36, 32, el.mono) : 0;
  const labelY = el.sub ? cy - 6 : cy + labelSize * 0.33;

  return (
    <g
      opacity={1 - 0.65 * st.dim}
      transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}
    >
      {st.highlight > 0 && (
        <path
          d={roundRectD(x - 12, y - 12, w + 24, h + 24, 26)}
          fill={tone.stroke}
          opacity={0.16 * st.highlight}
        />
      )}
      <path d={d} fill={tone.fill} opacity={fillP} />
      {el.stroke === "solid" ? (
        <RoughStroke d={d} seed={el.id} color={tone.stroke} width={3.5 + 2 * st.highlight} progress={st.draw} />
      ) : (
        <path
          d={d}
          fill="none"
          stroke={tone.stroke}
          strokeWidth={3.5 + 2 * st.highlight}
          strokeDasharray="13 10"
          strokeLinecap="round"
          opacity={sub(st.draw, 0, 0.5)}
        />
      )}
      <g opacity={textP}>
        <text x={cx} y={labelY} textAnchor="middle" fontFamily={FONT_HAND} fontSize={labelSize} fill={INK}>
          {el.label}
        </text>
        {el.sub && (
          <text
            x={cx}
            y={cy + 38}
            textAnchor="middle"
            fontFamily={el.mono ? FONT_MONO : FONT_HAND}
            fontSize={subSize}
            fill={INK_SOFT}
          >
            {el.sub}
          </text>
        )}
      </g>
    </g>
  );
};
