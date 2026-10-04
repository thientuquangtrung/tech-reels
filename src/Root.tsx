import React from "react";
import { Composition } from "remotion";
import { checkVideo } from "./check";
import { FPS, H, W } from "./theme";
import { buildTimeline } from "./timeline";
import { VideoComp } from "./VideoComp";
import { videos } from "./videos.generated";

/** Mỗi thư mục trong videos/ = một composition, id dạng "v001-one-user". */
export const Root: React.FC = () => (
  <>
    {videos.map(({ dir, script, timings }) => {
      const res = checkVideo(script);
      if (!res.ok) return null; // sync đã in lỗi ra terminal
      const tl = buildTimeline(res.video, timings);
      return (
        <Composition
          key={dir}
          id={`v${dir}`}
          component={VideoComp}
          width={W}
          height={H}
          fps={FPS}
          durationInFrames={tl.total}
          defaultProps={{ video: res.video, tl }}
        />
      );
    })}
  </>
);
