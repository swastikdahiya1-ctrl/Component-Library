import React from "react";
import { cn } from "@/lib/utils";

// Dummy component
export const Dock = ({ children, className }: any) => (
  <div className={cn("flex items-center gap-2 p-2 bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/10", className)}>
    {children}
  </div>
);

export const DockIcon = ({ children }: any) => (
  <div className="hover:scale-110 transition-transform duration-200">
    {children}
  </div>
);

export default function DockDemo() {
  return (
    <div className="flex flex-col items-center justify-center h-[300px]">
      <span className="bg-gradient-to-b from-white to-white/20 bg-clip-text text-center text-6xl font-semibold text-transparent mb-8">
        Dock
      </span>
      <Dock>
        {[1, 2, 3, 4, 5].map((i) => (
          <DockIcon key={i}>
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white/50 cursor-pointer hover:bg-white/20 hover:text-white transition-colors">
              {i}
            </div>
          </DockIcon>
        ))}
      </Dock>
    </div>
  );
}
