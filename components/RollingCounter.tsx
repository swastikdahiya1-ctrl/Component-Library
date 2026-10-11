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
      className="relative inline-block w-[0.68em] h-[1em] overflow-hidden"
      aria-hidden="true"
    >
      <motion.span
        className="absolute left-0 top-0 flex flex-col"
        initial={false}
        animate={{ transform: `translateY(-${digit * 10}%)` }}
        transition={{
          duration: reduce ? 0 : 0.45 + place * 0.05,
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
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[390px] rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
        <div className="flex justify-between text-sm text-zinc-400">
          <span>Seats reserved</span>
          <span className="text-lime-300">Live count</span>
        </div>
        <div
          className="mt-9 mb-7 text-[clamp(64px,12vw,88px)] font-medium tracking-[-0.07em] leading-none tabular-nums"
          role="status"
          aria-label={`${value} seats reserved`}
        >
          {[2, 1, 0].map((place) => (
            <Digit key={place} value={value} place={place} reduce={reduce} />
          ))}
        </div>
        <p className="text-sm text-zinc-400 mb-8">
          Every place makes a difference.
        </p>
        <div className="flex items-center justify-between border-t border-zinc-800 pt-5">
          <button
            aria-label="Remove one seat"
            disabled={value === 0}
            onClick={() => setValue((n) => Math.max(0, n - 1))}
            className="p-3 rounded-full bg-zinc-800 disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-lime-300"
          >
            <Minus size={17} />
          </button>
          <button
            onClick={() =>
              setValue((n) => (n === 128 ? 256 : n === 256 ? 512 : 128))
            }
            className="text-xs text-zinc-400 px-3 py-2 rounded-lg focus-visible:outline-2 focus-visible:outline-lime-300"
          >
            Try a bigger change
          </button>
          <button
            aria-label="Add one seat"
            disabled={value === 999}
            onClick={() => setValue((n) => Math.min(999, n + 1))}
            className="p-3 rounded-full bg-lime-300 text-zinc-950 disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-white"
          >
            <Plus size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
