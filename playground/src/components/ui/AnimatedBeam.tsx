import React, { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";

// Dummy component
export const AnimatedBeam = (props: any) => (
  <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-r from-transparent via-blue-500 to-transparent">
    [AnimatedBeam Placeholder]
  </div>
);

const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(({ className, children }, ref) => {
  return (
    <div ref={ref} className={cn("z-10 flex size-12 items-center justify-center rounded-full border-2 bg-zinc-900 p-3 shadow-lg", className)}>
      {children}
    </div>
  )
});
Circle.displayName = "Circle";

export default function AnimatedBeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);

  return (
    <div className="relative flex h-[300px] w-full items-center justify-center overflow-hidden p-10" ref={containerRef}>
      <div className="flex size-full max-h-[200px] max-w-lg flex-row items-stretch justify-between gap-10">
        <Circle ref={div1Ref}>A</Circle>
        <Circle ref={div2Ref}>B</Circle>
      </div>
      <AnimatedBeam containerRef={containerRef} fromRef={div1Ref} toRef={div2Ref} />
    </div>
  );
}
