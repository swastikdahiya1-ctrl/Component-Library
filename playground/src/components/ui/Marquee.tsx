import React from "react";
import { cn } from "@/lib/utils";

// Dummy component
export const Marquee = ({ className, children, ...props }: any) => (
  <div className={cn("flex w-full overflow-hidden", className)} {...props}>
    <div className="flex w-full animate-marquee gap-4">
      {children}
    </div>
  </div>
);

export default function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden h-[400px]">
      <Marquee pauseOnHover className="[--duration:20s]">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-32 w-64 border border-zinc-800 bg-zinc-900 rounded-xl p-4 flex flex-col justify-between shrink-0">
             <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-zinc-700" />
               <div className="flex flex-col">
                 <div className="w-16 h-2 bg-zinc-700 rounded" />
                 <div className="w-12 h-2 bg-zinc-800 rounded mt-1" />
               </div>
             </div>
             <div className="w-full h-2 bg-zinc-800 rounded" />
             <div className="w-3/4 h-2 bg-zinc-800 rounded" />
          </div>
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black to-transparent"></div>
    </div>
  );
}
