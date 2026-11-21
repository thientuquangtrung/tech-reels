import { Video } from "../schema/schema";
import { LAYOUT_RULES } from "./layouts/rules";

export type CheckResult = { ok: true; video: Video } | { ok: false; errors: string[] };

/** Schema chung + luật của từng layout. Dùng cho validate, sync và render. */
export function checkVideo(raw: unknown): CheckResult {
  const parsed = Video.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`),
    };
  }
  const errors: string[] = [];
  parsed.data.scenes.forEach((sc, i) => {
    const rule = LAYOUT_RULES[sc.layout];
    if (!rule) errors.push(`scenes.${i}: layout "${sc.layout}" chưa được dựng trong src/layouts`);
    else rule(sc).forEach((e) => errors.push(`scenes.${i} (${sc.layout}): ${e}`));
  });
  return errors.length ? { ok: false, errors } : { ok: true, video: parsed.data };
}
