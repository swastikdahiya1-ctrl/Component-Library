import { Suspense, useRef } from "react";
import type { ComponentEntry } from "./registry";
import { PreviewAutoplay } from "./PreviewAutoplay";

export default function EmbeddedPreview({
  entry,
  autoplay,
}: {
  entry: ComponentEntry;
  autoplay: boolean;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const Demo = entry.component;
  return (
    <div className="embed-root">
      <Suspense
        fallback={<div className="loading-state">Loading preview...</div>}
      >
        <div className="demo-stage" ref={stage}>
          <Demo />
          <PreviewAutoplay root={stage} id={entry.id} enabled={autoplay} />
        </div>
      </Suspense>
    </div>
  );
}
