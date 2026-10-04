import type { Video } from "../schema/schema";
import { FPS } from "./theme";

/** Timestamp thật từ TTS/whisper (giây). Khi có file timings.json, nó thay cho ước lượng. */
export type Timing = { id: string; start: number; end: number };

export type Segment = { id: string; text: string; from: number; to: number }; // frame
export type StepAt = { frame: number; action: Video["scenes"][number]["steps"][number]["action"]; target: string };
export type SceneTimeline = { id: string; from: number; to: number; steps: StepAt[] };

export type Timeline = {
  segments: Segment[];
  scenes: SceneTimeline[];
  outroFrom: number;
  total: number;
};

const LEAD_S = 0.4; // khoảng lặng đầu video
const GAP_S = 0.25; // nghỉ giữa hai câu (khi ước lượng)
const OUTRO_S = 3; // thời gian hiện takeaway
const STEP_DELAY = 6; // frame: hình bắt đầu sau khi câu thoại bắt đầu một chút
const STAGGER = 10; // frame: nhiều target trong một step thì lần lượt từng cái

/** Không có audio: ước lượng thời lượng đọc theo số từ (~3.2 từ/giây). */
export function estimateSeconds(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.min(8, Math.max(1.8, words / 3.2 + 0.4));
}

export function buildTimeline(video: Video, timings?: Timing[]): Timeline {
  const f = (s: number) => Math.round(s * FPS);
  const byId = new Map((timings ?? []).map((t) => [t.id, t]));

  let cursor = LEAD_S;
  const segments: Segment[] = video.voice.map((v) => {
    const t = byId.get(v.id);
    const start = t ? t.start : cursor;
    const end = t ? t.end : start + estimateSeconds(v.text);
    cursor = end + GAP_S;
    return { id: v.id, text: v.text, from: f(start), to: f(end) };
  });
  const segFrom = new Map(segments.map((s) => [s.id, s.from]));

  const last = segments[segments.length - 1];
  const outroFrom = last.to + f(0.3);
  const total = outroFrom + f(OUTRO_S);

  // Scene i chạy từ câu thoại của step đầu tiên đến scene kế tiếp
  const starts = video.scenes.map((sc, i) => (i === 0 ? 0 : segFrom.get(sc.steps[0].at)!));
  const scenes: SceneTimeline[] = video.scenes.map((sc, i) => {
    const steps: StepAt[] = [];
    for (const st of sc.steps) {
      const base = segFrom.get(st.at)! + STEP_DELAY;
      st.targets.forEach((target, k) => steps.push({ frame: base + k * STAGGER, action: st.action, target }));
    }
    return { id: sc.id, from: starts[i], to: i + 1 < starts.length ? starts[i + 1] : total, steps };
  });

  return { segments, scenes, outroFrom, total };
}
