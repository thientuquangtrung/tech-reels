import { z } from "zod";

/**
 * Nguyên tắc: model chỉ quyết định NỘI DUNG + CẤU TRÚC.
 * Không có toạ độ, không có frame, không có pixel — Remotion tự tính.
 * Timing gắn với câu thoại (segment id), timestamp thật lấy từ TTS/whisper.
 */

// ---- Giới hạn cho màn hình điện thoại (code kiểm, không tin model) ----
export const LIMITS = {
  hookWords: 10,
  labelChars: 22,
  subChars: 28,
  elementsPerScene: 10,
  codeLines: 8,
  segmentChars: 160,
} as const;

const Id = z.string().regex(/^[a-z][a-z0-9_]*$/, "id: snake_case, bắt đầu bằng chữ");
const Label = z.string().min(1).max(LIMITS.labelChars);
const Sub = z.string().max(LIMITS.subChars);

export const Tone = z.enum(["neutral", "primary", "accent", "danger", "success"]);
export const Stroke = z.enum(["solid", "dashed"]);

// ---- Elements ----
const Box = z.object({
  kind: z.literal("box"),
  id: Id,
  label: Label,
  sub: Sub.optional(), // vd: "GET /feed", "3–7 s"
  mono: z.boolean().default(false), // sub hiển thị font code
  tone: Tone.default("neutral"),
  stroke: Stroke.default("solid"),
});

const Actor = z.object({
  kind: z.literal("actor"),
  id: Id,
  label: Label,
  badge: z.string().max(8).optional(), // vd: "k6"
  fields: z
    .array(z.object({ label: Label, value: z.string().max(24), tone: Tone.default("primary") }))
    .max(3)
    .default([]),
});

const Arrow = z.object({
  kind: z.literal("arrow"),
  id: Id,
  from: Id,
  to: Id,
  stroke: Stroke.default("dashed"),
  label: z.string().max(16).optional(),
});

const Code = z.object({
  kind: z.literal("code"),
  id: Id,
  lang: z.enum(["ts", "js", "py", "go", "sql", "bash", "yaml", "json"]),
  lines: z.array(z.string().max(40)).min(1).max(LIMITS.codeLines),
});

const Verdict = z.object({
  kind: z.literal("verdict"),
  id: Id,
  verdict: z.enum(["wrong", "right"]),
  text: z.string().max(40),
});

const Note = z.object({
  kind: z.literal("note"),
  id: Id,
  text: z.string().max(60),
  tone: Tone.default("neutral"),
});

export const Element = z.discriminatedUnion("kind", [Box, Actor, Arrow, Code, Verdict, Note]);

// ---- Steps: cái gì xảy ra, khi câu thoại nào bắt đầu ----
const Step = z.object({
  at: Id, // segment id
  action: z.enum(["draw", "highlight", "dim", "pulse", "flow"]),
  targets: z.array(Id).min(1),
});

// ---- Scene ----
export const Layout = z.enum([
  "card+cycle", // actor trên, vòng lặp dưới (như "ONE user")
  "flow", //       các bước dọc từ trên xuống
  "compare", //    sai vs đúng
  "stack", //      danh sách khối
  "code", //       code + chú thích
]);

const Scene = z.object({
  id: Id,
  layout: Layout,
  title: z.string().max(32).optional(),
  elements: z.array(Element).min(1).max(LIMITS.elementsPerScene),
  steps: z.array(Step).min(1),
});

// ---- Video ----
export const Series = z.enum(["one_x", "wrong_right", "what_happens", "counterintuitive", "learn_public"]);

export const Video = z
  .object({
    id: Id,
    series: Series,
    hook: z.string(),
    takeaway: z.string().max(80),
    voice: z
      .array(z.object({ id: Id, text: z.string().min(1).max(LIMITS.segmentChars) }))
      .min(2),
    scenes: z.array(Scene).min(1).max(4),
  })
  .superRefine((v, ctx) => {
    const err = (path: (string | number)[], message: string) =>
      ctx.addIssue({ code: "custom", path, message });

    // hook ngắn
    const hookWords = v.hook.trim().split(/\s+/).length;
    if (hookWords > LIMITS.hookWords) err(["hook"], `hook ${hookWords} từ > ${LIMITS.hookWords}`);

    // voice id duy nhất
    const segIds = new Set<string>();
    v.voice.forEach((s, i) => {
      if (segIds.has(s.id)) err(["voice", i, "id"], `trùng segment id "${s.id}"`);
      segIds.add(s.id);
    });

    const usedSegs = new Set<string>();
    const segOrder = new Map(v.voice.map((s, i) => [s.id, i]));

    v.scenes.forEach((sc, si) => {
      const ids = new Set<string>();
      sc.elements.forEach((el, ei) => {
        if (ids.has(el.id)) err(["scenes", si, "elements", ei, "id"], `trùng element id "${el.id}"`);
        ids.add(el.id);
      });

      // arrow trỏ tới element có thật, không phải arrow
      sc.elements.forEach((el, ei) => {
        if (el.kind !== "arrow") return;
        for (const end of ["from", "to"] as const) {
          const t = sc.elements.find((e) => e.id === el[end]);
          if (!t) err(["scenes", si, "elements", ei, end], `"${el[end]}" không tồn tại`);
          else if (t.kind === "arrow") err(["scenes", si, "elements", ei, end], `arrow không thể nối arrow`);
        }
      });

      // steps: segment có thật, target có thật, segment đi theo thứ tự
      let lastOrder = -1;
      const drawn = new Set<string>();
      sc.steps.forEach((st, ti) => {
        if (!segIds.has(st.at)) err(["scenes", si, "steps", ti, "at"], `segment "${st.at}" không tồn tại`);
        else {
          const o = segOrder.get(st.at)!;
          if (o < lastOrder) err(["scenes", si, "steps", ti, "at"], `step đi ngược thứ tự thoại`);
          lastOrder = o;
          usedSegs.add(st.at);
        }
        st.targets.forEach((t, k) => {
          if (!ids.has(t)) err(["scenes", si, "steps", ti, "targets", k], `target "${t}" không tồn tại`);
          if (st.action !== "draw" && !drawn.has(t))
            err(["scenes", si, "steps", ti, "targets", k], `"${t}" được ${st.action} trước khi draw`);
        });
        if (st.action === "draw") st.targets.forEach((t) => drawn.add(t));
      });

      // mọi element phải được vẽ
      ids.forEach((id) => {
        if (!drawn.has(id)) err(["scenes", si], `element "${id}" không bao giờ được draw`);
      });
    });

    // cảnh báo cứng: thoại không gắn hình nào (trừ câu mở + câu chốt)
    v.voice.slice(1, -1).forEach((s, i) => {
      if (!usedSegs.has(s.id)) err(["voice", i + 1], `segment "${s.id}" không có hình đi kèm`);
    });
  });

export type Video = z.infer<typeof Video>;
