import type { Video } from "../../schema/schema";

type Scene = Video["scenes"][number];

/**
 * Luật riêng cho từng layout — thuần TS, không React, để validate chạy được ngoài Remotion.
 * Layout nào chưa có ở đây = chưa dựng, render sẽ từ chối.
 */
export const LAYOUT_RULES: Partial<Record<Scene["layout"], (sc: Scene) => string[]>> = {
  "card+cycle": (sc) => {
    const errs: string[] = [];
    const count = (k: string) => sc.elements.filter((e) => e.kind === k).length;
    if (count("actor") !== 1) errs.push(`cần đúng 1 actor (đang có ${count("actor")})`);
    const boxes = count("box");
    if (boxes < 3 || boxes > 7) errs.push(`vòng lặp cần 3–7 box (đang có ${boxes})`);
    if (count("note") > 1) errs.push("tối đa 1 note (hiện ở giữa vòng)");
    for (const k of ["arrow", "code", "verdict"])
      if (count(k)) errs.push(`không dùng "${k}" — mũi tên tự nối theo thứ tự box`);
    return errs;
  },
};

export const SUPPORTED_LAYOUTS = Object.keys(LAYOUT_RULES);
