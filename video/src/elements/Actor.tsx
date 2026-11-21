import React from "react";
import type { z } from "zod";
import type { Element } from "../../schema/schema";
import { BADGE, FONT_HAND, FONT_MONO, INK, INK_SOFT, TONES, fitFont } from "../theme";
import type { ElState } from "../state";
import { sub } from "../state";
import { RoughStroke, roundRectD } from "./rough";

type ActorEl = Extract<z.infer<typeof Element>, { kind: "actor" }>;

/** Thẻ nhân vật nằm ngang: hình người bên trái, các field bên phải. */
export const Actor: React.FC<{ el: ActorEl; x: number; y: number; w: number; h: number; st: ElState }> = ({
  el,
  x,
  y,
  w,
  h,
  st,
}) => {
  if (st.draw <= 0) return null;
  const cardP = sub(st.draw, 0, 0.4);
  const personP = sub(st.draw, 0.25, 0.6);
  const blue = TONES.primary;

  // cột trái: người
  const px = x + 170;
  const headY = y + 88;
  const head = `M${px - 44},${headY} a44,44 0 1,0 88,0 a44,44 0 1,0 -88,0`;
  const bodyTop = headY + 58;
  const body = `M${px - 84},${bodyTop + 84} Q${px - 84},${bodyTop} ${px},${bodyTop} Q${px + 84},${bodyTop} ${
    px + 84
  },${bodyTop + 84} Z`;

  // cột phải: field
  const fx = x + 340;
  const fw = w - 340 - 36;
  const n = el.fields.length;
  const gap = 22;
  const fh = n ? Math.min(118, (h - 60 - gap * (n - 1)) / n) : 0;
  const fy0 = y + (h - (n * fh + (n - 1) * gap)) / 2;

  return (
    <g opacity={1 - 0.65 * st.dim}>
      <RoughStroke d={roundRectD(x, y, w, h, 24)} seed={el.id + "card"} color={INK} width={4} progress={cardP} />

      <g opacity={Math.min(1, personP * 2)}>
        <path d={head} fill={blue.fill} opacity={personP} />
        <path d={body} fill={blue.fill} opacity={personP} />
      </g>
      <RoughStroke d={head} seed={el.id + "head"} color={blue.stroke} width={5} progress={personP} />
      <RoughStroke d={body} seed={el.id + "body"} color={blue.stroke} width={5} progress={personP} />
      <text
        x={px}
        y={y + h - 22}
        textAnchor="middle"
        fontFamily={FONT_HAND}
        fontSize={fitFont(el.label, 290, 46)}
        fill={INK}
        opacity={personP}
      >
        {el.label}
      </text>

      {el.badge && (
        <g opacity={cardP}>
          <path d={roundRectD(x + w - 112, y - 26, 88, 52, 26)} fill={BADGE.fill} />
          <text
            x={x + w - 68}
            y={y + 10}
            textAnchor="middle"
            fontFamily={FONT_MONO}
            fontWeight={700}
            fontSize={30}
            fill={BADGE.text}
          >
            {el.badge}
          </text>
        </g>
      )}

      {el.fields.map((f, i) => {
        const p = sub(st.draw, 0.5 + i * 0.2, 0.8 + i * 0.2);
        const fy = fy0 + i * (fh + gap);
        const tone = TONES[f.tone];
        const d = roundRectD(fx, fy, fw, fh, 16);
        return (
          <g key={i}>
            <path d={d} fill={tone.fill} opacity={p} />
            <RoughStroke d={d} seed={`${el.id}f${i}`} color={tone.stroke} width={3} progress={p} />
            <g opacity={sub(p, 0.5, 1)}>
              <text x={fx + 24} y={fy + 40} fontFamily={FONT_HAND} fontSize={30} fill={INK_SOFT}>
                {f.label}
              </text>
              <text
                x={fx + 24}
                y={fy + fh - 22}
                fontFamily={FONT_MONO}
                fontSize={fitFont(f.value, fw - 48, 38, true)}
                fill={INK}
              >
                {f.value}
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
};
