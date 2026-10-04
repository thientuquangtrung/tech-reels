import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FONT_HAND, HIGHLIGHTER, INK, SAFE } from "./theme";
import type { Timeline } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Hook to ở giữa màn hình trong lúc chưa có hình nào được vẽ. */
export const Hook: React.FC<{ text: string; tl: Timeline }> = ({ text, tl }) => {
  const frame = useCurrentFrame();
  const firstStep = Math.min(...tl.scenes[0].steps.map((s) => s.frame));
  if (frame >= firstStep + 10) return null;
  const opacity = interpolate(frame, [0, 8, firstStep - 4, firstStep + 10], [0, 1, 1, 0], clamp);
  const scale = interpolate(frame, [0, 10], [0.94, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        width: SAFE.right - SAFE.left,
        top: 760,
        textAlign: "center",
        fontFamily: FONT_HAND,
        fontSize: 92,
        lineHeight: 1.15,
        color: INK,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {text}
    </div>
  );
};

/** Phụ đề câu thoại hiện tại, nằm ngay dưới vùng nội dung. */
export const Caption: React.FC<{ tl: Timeline }> = ({ tl }) => {
  const frame = useCurrentFrame();
  if (frame >= tl.outroFrom) return null;
  const seg = tl.segments.find((s, i) => frame >= s.from && frame < (tl.segments[i + 1]?.from ?? tl.outroFrom));
  if (!seg) return null;
  const opacity = interpolate(frame, [seg.from, seg.from + 5], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        width: SAFE.right - SAFE.left,
        top: SAFE.bottom + 40,
        display: "flex",
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: FONT_HAND,
          fontSize: 46,
          lineHeight: 1.25,
          color: INK,
          textAlign: "center",
          background: "rgba(255,255,255,0.85)",
          border: `3px solid ${INK}`,
          borderRadius: 22,
          padding: "12px 26px",
        }}
      >
        {seg.text}
      </div>
    </div>
  );
};

/** Câu chốt ở cuối video. */
export const Takeaway: React.FC<{ text: string; tl: Timeline }> = ({ text, tl }) => {
  const frame = useCurrentFrame();
  if (frame < tl.outroFrom) return null;
  const t = frame - tl.outroFrom;
  const opacity = interpolate(t, [0, 10], [0, 1], clamp);
  const lift = interpolate(t, [0, 12], [30, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        width: SAFE.right - SAFE.left,
        top: SAFE.bottom + 40,
        opacity,
        transform: `translateY(${lift}px)`,
        fontFamily: FONT_HAND,
        fontSize: 54,
        lineHeight: 1.25,
        color: INK,
        textAlign: "center",
        background: HIGHLIGHTER,
        borderRadius: 26,
        padding: "20px 30px",
        border: `3px solid ${INK}`,
      }}
    >
      {text}
    </div>
  );
};
