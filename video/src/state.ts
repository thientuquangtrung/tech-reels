import { Easing, interpolate } from "remotion";
import type { StepAt } from "./timeline";

/** Trạng thái hình ảnh của một element tại một frame — tính thuần từ danh sách step. */
export type ElState = {
  draw: number; // 0..1 tiến độ "vẽ ra"
  highlight: number; // 0..1
  dim: number; // 0..1
  pulse: number; // độ phóng thêm, quanh 0
  flow: number; // 0..1 mũi tên dẫn vào đang chạy
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export function elState(id: string, frame: number, steps: StepAt[], drawFrames = 18): ElState {
  const s: ElState = { draw: 0, highlight: 0, dim: 0, pulse: 0, flow: 0 };
  for (const st of steps) {
    if (st.target !== id || frame < st.frame) continue;
    const t = frame - st.frame;
    switch (st.action) {
      case "draw":
        s.draw = Math.max(
          s.draw,
          interpolate(t, [0, drawFrames], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }),
        );
        break;
      case "highlight":
        s.highlight = Math.max(s.highlight, interpolate(t, [0, 10], [0, 1], clamp));
        break;
      case "dim":
        s.dim = Math.max(s.dim, interpolate(t, [0, 10], [0, 1], clamp));
        break;
      case "pulse":
        if (t < 45) s.pulse += 0.07 * Math.sin((2 * Math.PI * t) / 15) * (1 - t / 45);
        break;
      case "flow":
        if (t < 75) s.flow = Math.max(s.flow, interpolate(t, [0, 8, 60, 75], [0, 1, 1, 0], clamp));
        break;
    }
  }
  return s;
}

/** Tiến độ con trong khoảng [a,b] của tiến độ cha — để một element vẽ nhiều phần lần lượt. */
export const sub = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));
