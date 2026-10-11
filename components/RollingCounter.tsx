import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

function Digit({
  value,
  place,
  reduce,
}: {
  value: number;
  place: number;
  reduce: boolean | null;
}) {
  const digit = Math.floor(value / 10 ** place) % 10;
  return (
    <span
      className="relative inline-block flex-1 h-[1.15em] overflow-hidden rounded-lg bg-white/[.035]"
      aria-hidden="true"
    >
      <motion.span
        className="absolute inset-x-0 top-[.075em] flex flex-col items-center"
        initial={false}
        animate={{ transform: `translateY(-${digit * 10}%)` }}
        transition={{
          duration: reduce ? 0 : 0.4 + place * 0.035,
          ease: [0.23, 1, 0.32, 1],
        }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} className="h-[1em] leading-none">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export default function RollingCounter() {
  const [value, setValue] = useState(128);
  const reduce = useReducedMotion();
  return (
    <div
      className="min-h-[100dvh] bg-[#080808] text-white flex items-center justify-center p-6"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <div className="w-full max-w-[440px] p-[6px] rounded-[26px] bg-white/[.025] ring-1 ring-white/10">
        <div className="rounded-[20px] bg-[#161616] p-6 sm:p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,.06)]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-300">Seats reserved</span>
            <span className="text-[11px] text-neutral-400 tabular-nums">
              Capacity / 999
            </span>
          </div>
          <div
            className="flex justify-between gap-2 mt-7 mb-7 text-[clamp(64px,11vw,100px)] font-medium tracking-[-.06em] leading-none tabular-nums"
            role="status"
            aria-label={`${value} seats reserved`}
          >
            {[2, 1, 0].map((place) => (
              <Digit key={place} value={value} place={place} reduce={reduce} />
            ))}
          </div>
          <div className="flex items-center justify-between pt-5 border-t border-white/[.08]">
            <button
              aria-label="Remove one seat"
              disabled={value === 0}
              onClick={() => setValue((n) => Math.max(0, n - 1))}
              className="p-3 rounded-full bg-white/[.06] ring-1 ring-white/10 disabled:opacity-30 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-95 motion-reduce:transform-none focus-visible:outline-2 focus-visible:outline-white"
            >
              <Minus size={17} strokeWidth={1.5} />
            </button>
            <button
              aria-label="Cycle sample values"
              onClick={() =>
                setValue((n) => (n === 128 ? 256 : n === 256 ? 512 : 128))
              }
              className="text-xs text-neutral-400 px-3 py-3 rounded-lg focus-visible:outline-2 focus-visible:outline-white"
            >
              Sample values
            </button>
            <button
              aria-label="Add one seat"
              disabled={value === 999}
              onClick={() => setValue((n) => Math.min(999, n + 1))}
              className="p-3 rounded-full bg-[#eee] text-[#111] disabled:opacity-30 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-95 motion-reduce:transform-none focus-visible:outline-2 focus-visible:outline-white"
            >
              <Plus size={17} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
