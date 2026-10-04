import type React from "react";
import type { Video } from "../../schema/schema";
import type { SceneTimeline } from "../timeline";
import { CardCycle } from "./CardCycle";

type Scene = Video["scenes"][number];

/** Thêm layout mới: viết component + thêm luật trong rules.ts + đăng ký ở đây. */
export const LAYOUTS: Partial<Record<Scene["layout"], React.FC<{ scene: Scene; tl: SceneTimeline }>>> = {
  "card+cycle": CardCycle,
};
