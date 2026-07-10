import React, { useRef } from "react";
import { cn } from "@/lib/utils";

// Dummy component
export const Confetti = ({ children, className }: any) => (
  <button className={cn("relative overflow-hidden rounded-xl bg-white px-6 py-3 font-semibold text-black transition-transform active:scale-95", className)}
          onClick={(e) => {
            const el = document.createElement("div");
            el.className = "absolute -inset-10 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 opacity-50 animate-ping blur-md rounded-full pointer-events-none z-50";
            e.currentTarget.appendChild(el);
            setTimeout(() => el.remove(), 1000);
          }}>
    {children}
  </button>
);

export default function ConfettiDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden bg-zinc-950">
      <span className="pointer-events-none mb-8 whitespace-pre-wrap bg-gradient-to-b from-white to-white/20 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent">
        Confetti
      </span>
      <Confetti>
        Trigger Confetti
      </Confetti>
    </div>
  );
}
