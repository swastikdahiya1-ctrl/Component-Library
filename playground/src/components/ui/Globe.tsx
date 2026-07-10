import React from "react";
import { cn } from "@/lib/utils";

// Dummy component
export const Globe = ({ className }: any) => (
  <div className={cn("relative flex h-[300px] w-full max-w-[300px] items-center justify-center rounded-full border border-white/20 bg-blue-900/10", className)}>
    <div className="absolute inset-0 bg-[url('https://cobe.vercel.app/globe.png')] bg-cover opacity-50 blur-sm rounded-full" />
    <span className="z-10 text-white/50 text-sm">[Globe Placeholder]</span>
  </div>
);

export default function GlobeDemo() {
  return (
    <div className="relative flex h-[500px] w-full items-center justify-center overflow-hidden bg-black px-40 pb-40 pt-8 md:pb-60">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-white to-white/20 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent">
        Globe
      </span>
      <Globe className="absolute top-48" />
      <div className="pointer-events-none absolute inset-0 h-full bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}
