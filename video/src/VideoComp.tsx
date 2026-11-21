import "@fontsource/patrick-hand";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import type { Video } from "../schema/schema";
import { Title } from "./elements/Title";
import { LAYOUTS } from "./layouts";
import { Caption, Hook, Takeaway } from "./Overlays";
import { FONT_HAND, FONT_MONO, H, PAPER, W } from "./theme";
import type { Timeline } from "./timeline";

/** voice: thư mục trong public/ chứa <id>.mp3 cho từng câu thoại (do scripts/voice.ts sinh). Không có = video câm. */
export type VideoProps = { video: Video; tl: Timeline; voice?: string };

/** Chờ font (kể cả bộ ký tự tiếng Việt) tải xong rồi mới cho render frame. */
function useFonts() {
  const [handle] = useState(() => delayRender("fonts"));
  useEffect(() => {
    const sample = "Aa Ạờữ ậ";
    Promise.all([
      document.fonts.load(`48px ${FONT_HAND}`, sample),
      document.fonts.load(`32px ${FONT_MONO}`, sample),
      document.fonts.load(`700 32px ${FONT_MONO}`, sample),
    ]).then(() => continueRender(handle));
  }, [handle]);
}

export const VideoComp: React.FC<VideoProps> = ({ video, tl, voice }) => {
  useFonts();
  const frame = useCurrentFrame();
  const idx = tl.scenes.findIndex((s) => frame >= s.from && frame < s.to);
  const scene = video.scenes[Math.max(0, idx)];
  const sceneTl = tl.scenes[Math.max(0, idx)];
  const Layout = LAYOUTS[scene.layout]!;

  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
        {scene.title && <Title text={scene.title} from={sceneTl.from} />}
        <Layout scene={scene} tl={sceneTl} />
      </svg>
      <Hook text={video.hook} tl={tl} />
      <Caption tl={tl} />
      <Takeaway text={video.takeaway} tl={tl} />
      {voice &&
        tl.segments.map((s) => (
          <Sequence key={s.id} from={s.from} layout="none">
            <Html5Audio src={staticFile(`${voice}/${s.id}.mp3`)} />
          </Sequence>
        ))}
    </AbsoluteFill>
  );
};
