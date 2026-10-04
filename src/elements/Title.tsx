import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { FONT_HAND, HIGHLIGHTER, INK, SAFE, fitFont } from "../theme";

/** Tiêu đề viết tay + vạch dạ quang quét ngang bên dưới. */
export const Title: React.FC<{ text: string; from: number }> = ({ text, from }) => {
  const t = useCurrentFrame() - from;
  const opts = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) } as const;
  const show = interpolate(t, [0, 10], [0, 1], opts);
  const wipe = interpolate(t, [8, 30], [0, 1], opts);
  const size = fitFont(text, SAFE.right - SAFE.left - 20, 92);
  const width = Math.min(text.length * size * 0.47, SAFE.right - SAFE.left);
  const y = 225;
  return (
    <g>
      <rect x={SAFE.left + 8} y={y + 18} width={width * wipe} height={20} rx={10} fill={HIGHLIGHTER} />
      <text
        x={SAFE.left + 10}
        y={y}
        fontFamily={FONT_HAND}
        fontSize={size}
        fill={INK}
        opacity={show}
        transform={`translate(0 ${(1 - show) * 14})`}
      >
        {text}
      </text>
    </g>
  );
};
