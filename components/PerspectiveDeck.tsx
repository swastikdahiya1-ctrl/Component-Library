import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

const cards = [
  {
    title: "Form follows feeling.",
    label: "Design systems",
    color: "#c7ef86",
    shape: "rounded-full",
    word: "FORM",
  },
  {
    title: "Find a different angle.",
    label: "Creative direction",
    color: "#a6c8ff",
    shape: "rounded-[32px]",
    word: "SHIFT",
  },
  {
    title: "Leave space to explore.",
    label: "Digital experiences",
    color: "#f1b7a8",
    shape: "rounded-[80px_0_80px_0]",
    word: "SPACE",
  },
];

export default function PerspectiveDeck() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col items-center justify-center gap-7 p-6 font-sans">
      <div
        className="relative w-full max-w-[330px] h-[340px]"
        style={{ perspective: 1100 }}
      >
        {cards.map((card, i) => {
          const depth = (i - active + cards.length) % cards.length;
          return (
            <motion.div
              key={card.word}
              aria-hidden={depth !== 0}
              initial={false}
              animate={{
                transform: reduce
                  ? "none"
                  : `translateY(${depth * -19}px) translateZ(${-depth * 70}px) rotateX(${depth * 5}deg) rotateZ(${depth * -3}deg)`,
                opacity: reduce && depth ? 0 : 1,
              }}
              transition={
                reduce
                  ? { duration: 0.12 }
                  : { type: "spring", duration: 0.5, bounce: 0.08 }
              }
              style={{
                zIndex: 3 - depth,
                background: card.color,
                transformOrigin: "50% 90%",
              }}
              className="absolute inset-0 rounded-2xl p-6 text-zinc-950 overflow-hidden border border-black/10"
            >
              <div className="flex justify-between text-xs font-medium">
                <span>{card.label}</span>
                <ArrowUpRight size={18} />
              </div>
              <div
                aria-hidden="true"
                className="h-[184px] flex items-center justify-center relative"
              >
                <div
                  className={`absolute w-36 h-36 border-[22px] border-black/85 ${card.shape}`}
                />
                <span className="relative text-[46px] font-black tracking-[-0.08em] mix-blend-difference text-white">
                  {card.word}
                </span>
              </div>
              <h2 className="text-3xl max-w-[240px] font-medium tracking-tight leading-[1.05]">
                {card.title}
              </h2>
              <p className="mt-4 text-xs opacity-70">0{i + 1} / 03</p>
            </motion.div>
          );
        })}
      </div>
      <div className="flex items-center gap-5">
        <button
          aria-label="Previous card"
          onClick={() => setActive((n) => (n + 2) % 3)}
          className="p-3 rounded-full border border-zinc-700 focus-visible:outline-2 focus-visible:outline-lime-300"
        >
          <ArrowLeft size={17} />
        </button>
        <span className="text-xs text-zinc-400 tabular-nums" role="status">
          {active + 1} / 3
        </span>
        <button
          aria-label="Next card"
          onClick={() => setActive((n) => (n + 1) % 3)}
          className="p-3 rounded-full border border-zinc-700 focus-visible:outline-2 focus-visible:outline-lime-300"
        >
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}
