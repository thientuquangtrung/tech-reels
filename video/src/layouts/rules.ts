import type { Video } from "../../schema/schema";
import { HALF_H, halfHeight, splitHalves } from "./compare-geometry";

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

  compare: (sc) => {
    const errs: string[] = [];
    const verdicts = sc.elements.filter((e) => e.kind === "verdict");
    if (verdicts.length !== 2) errs.push(`cần đúng 2 verdict, một wrong một right (đang có ${verdicts.length})`);
    else if (verdicts[0].verdict === verdicts[1].verdict) errs.push("2 verdict phải khác nhau: một wrong, một right");
    if (sc.elements[0]?.kind !== "verdict")
      errs.push("element đầu tiên phải là verdict — mỗi verdict mở một nửa, element sau nó thuộc nửa đó");
    for (const k of ["actor", "arrow"])
      if (sc.elements.some((e) => e.kind === k)) errs.push(`không dùng "${k}" trong compare`);
    if (sc.steps.some((s) => s.action === "flow")) errs.push(`không có mũi tên nên không dùng action "flow"`);

    splitHalves(sc.elements).forEach((half, i) => {
      const name = i === 0 ? "nửa trên" : "nửa dưới";
      const count = (k: string) => half.filter((e) => e.kind === k).length;
      if (count("code") > 1) errs.push(`${name}: tối đa 1 code`);
      if (count("box") > 3) errs.push(`${name}: tối đa 3 box (xếp một hàng)`);
      if (count("note") > 1) errs.push(`${name}: tối đa 1 note`);
      if (!count("code") && !count("box")) errs.push(`${name}: cần ít nhất 1 code hoặc 1 box`);
      const h = halfHeight(half);
      if (h > HALF_H) errs.push(`${name}: tràn khung (${Math.round(h)} > ${HALF_H}px) — bớt dòng code hoặc bỏ note`);
    });
    return errs;
  },
};

export const SUPPORTED_LAYOUTS = Object.keys(LAYOUT_RULES);
