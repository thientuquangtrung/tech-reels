import React from "react";
import { useCurrentFrame } from "remotion";
import type { Video } from "../../schema/schema";
import { Box } from "../elements/Box";
import { Code } from "../elements/Code";
import { Verdict } from "../elements/Verdict";
import { FONT_HAND, INK, INK_SOFT, TONES } from "../theme";
import { elState, sub } from "../state";
import type { SceneTimeline } from "../timeline";
import { MID, TOP, WIDTH, X, placeHalf, splitHalves } from "./compare-geometry";

type Scene = Video["scenes"][number];

export const Compare: React.FC<{ scene: Scene; tl: SceneTimeline }> = ({ scene, tl }) => {
  const frame = useCurrentFrame();
  const [top, bottom] = splitHalves(scene.elements);
  const placed = [...placeHalf(top, TOP), ...placeHalf(bottom, MID + 20)];

  // vạch ngăn hai nửa: chạy ra khi nửa dưới bắt đầu vẽ
  const bottomVerdict = bottom.find((e) => e.kind === "verdict");
  const divP = bottomVerdict ? sub(elState(bottomVerdict.id, frame, tl.steps).draw, 0, 0.6) : 0;

  return (
    <g>
      {divP > 0 && (
        <line
          x1={X}
          x2={X + WIDTH * divP}
          y1={MID}
          y2={MID}
          stroke={INK_SOFT}
          strokeWidth={3}
          strokeDasharray="14 12"
          strokeLinecap="round"
        />
      )}
      {placed.map((p) => {
        if ("rect" in p) return <Box key={p.el.id} el={p.el} rect={p.rect} st={elState(p.el.id, frame, tl.steps)} />;
        const el = p.el;
        switch (el.kind) {
          case "verdict":
            return <Verdict key={el.id} el={el} x={X} y={p.y} w={WIDTH} st={elState(el.id, frame, tl.steps)} />;
          case "code":
            // code dài hơn box → cho thời gian "gõ" lâu hơn
            return <Code key={el.id} el={el} x={X} y={p.y} w={WIDTH} st={elState(el.id, frame, tl.steps, 36)} />;
          case "note": {
            const st = elState(el.id, frame, tl.steps);
            if (st.draw <= 0) return null;
            return (
              <text
                key={el.id}
                x={X + WIDTH / 2}
                y={p.y + p.h * 0.7}
                textAnchor="middle"
                fontFamily={FONT_HAND}
                fontSize={46}
                fill={el.tone === "neutral" ? INK : TONES[el.tone].stroke}
                opacity={st.draw * (1 - 0.65 * st.dim)}
              >
                {el.text}
              </text>
            );
          }
        }
      })}
    </g>
  );
};
