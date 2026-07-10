import React from "react";
import { cn } from "@/lib/utils";

// Dummy component due to missing scrape
export const Boxes = () => (
  <div className="absolute inset-0 z-0 flex items-center justify-center text-zinc-700 opacity-20">
    [Boxes Component Placeholder]
  </div>
);

export default function BackgroundBoxesDemo() {
  return (
    <div className="h-96 relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />
      <h1 className={cn("md:text-4xl text-xl text-white relative z-20")}>
        Tailwind is Awesome
      </h1>
      <p className="text-center mt-2 text-neutral-300 relative z-20">
        Framer motion is the best animation library ngl
      </p>
    </div>
  );
}
