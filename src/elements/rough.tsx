import React, { useMemo } from "react";
import rough from "roughjs";

const gen = rough.generator();

/** Seed cố định theo id: nét run giống nhau ở mọi frame, không nhảy lung tung. */
export function seedOf(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (Math.abs(h) % 2147483646) + 1;
}

export function roundRectD(x: number, y: number, w: number, h: number, r: number): string {
  r = Math.min(r, w / 2, h / 2);
  return `M${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h - r} Q${x + w},${y + h} ${
    x + w - r
  },${y + h} H${x + r} Q${x},${y + h} ${x},${y + h - r} V${y + r} Q${x},${y} ${x + r},${y} Z`;
}

type Props = {
  d: string;
  seed: string;
  color: string;
  width?: number;
  progress?: number; // 0..1 vẽ ra
  roughness?: number;
};

/** Nét viền kiểu vẽ tay, có hiệu ứng "đang vẽ" qua stroke-dashoffset. */
export const RoughStroke: React.FC<Props> = ({ d, seed, color, width = 3.5, progress = 1, roughness = 1.1 }) => {
  const paths = useMemo(
    () =>
      gen.toPaths(
        gen.path(d, { seed: seedOf(seed), roughness, bowing: 0.8, stroke: color, strokeWidth: width }),
      ),
    [d, seed, color, width, roughness],
  );
  if (progress <= 0) return null;
  const drawing = progress < 1;
  return (
    <g>
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill="none"
          stroke={color}
          strokeWidth={p.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={drawing ? 1 : undefined}
          strokeDasharray={drawing ? "1 1" : undefined}
          strokeDashoffset={drawing ? 1 - progress : undefined}
        />
      ))}
    </g>
  );
};
