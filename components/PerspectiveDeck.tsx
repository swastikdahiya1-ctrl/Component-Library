import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

const cards = [
  {
    title: "Form",
    label: "Shape & proportion",
    background: "#f4f4f4",
    foreground: "#111111",
    rotation: 0,
  },
  {
    title: "Space",
    label: "Distance & depth",
    background: "#202020",
    foreground: "#f4f4f4",
    rotation: 45,
  },
  {
    title: "Order",
    label: "Rhythm & repetition",
    background: "#cfcfcf",
    foreground: "#111111",
    rotation: 90,
  },
];

export default function PerspectiveDeck() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  return (
    <div
      className="min-h-[100dvh] bg-[#080808] text-white flex flex-col items-center justify-center gap-7 p-6"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <div
        className="relative w-full max-w-[370px] h-[390px]"
        style={{ perspective: 1400 }}
      >
        {cards.map((card, i) => {
          const depth = (i - active + cards.length) % cards.length;
          return (
            <motion.article
              key={card.title}
              aria-hidden={depth !== 0}
              initial={false}
              animate={{
                transform: reduce
                  ? "none"
                  : `translateY(${-depth * 17}px) translateZ(${-depth * 65}px) rotateZ(${-depth * 2.5}deg)`,
                opacity: reduce && depth ? 0 : 1,
              }}
              transition={
                reduce
                  ? { duration: 0.12 }
                  : { type: "spring", duration: 0.48, bounce: 0.06 }
              }
              style={{
                zIndex: 3 - depth,
                background: card.background,
                color: card.foreground,
                transformOrigin: "50% 90%",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,.12)",
              }}
              className="absolute inset-0 rounded-[20px] p-7 overflow-hidden"
            >
              <div className="flex items-center justify-between text-[11px] tracking-wide opacity-70">
                <span>Studies in form</span>
                <span>0{i + 1}</span>
              </div>
              <div
                aria-hidden="true"
                className="absolute top-[55px] left-0 right-0 h-[210px] flex items-center justify-center"
              >
                {Array.from({ length: 13 }, (_, n) => (
                  <div
                    key={n}
                    className="absolute border rounded-full"
                    style={{
                      width: 85 + n * 8,
                      height: 175,
                      transform: `rotate(${card.rotation + n * 9}deg)`,
                      opacity: 0.45,
                      borderColor: "currentColor",
                    }}
                  />
                ))}
              </div>
              <div className="absolute bottom-7 left-7 right-7">
                <h2 className="text-[68px] font-medium tracking-[-0.07em] leading-none">
                  {card.title}
                  <span className="opacity-40">.</span>
                </h2>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-current/20 text-xs">
                  <span>{card.label}</span>
                  <ArrowUpRight size={17} strokeWidth={1.4} />
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
      <div className="flex items-center gap-7">
        <button
          aria-label="Previous card"
          onClick={() => setActive((n) => (n + 2) % 3)}
          className="p-3 rounded-full bg-white/[.05] ring-1 ring-white/10 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-95 motion-reduce:transform-none focus-visible:outline-2 focus-visible:outline-white"
        >
          <ArrowLeft size={17} strokeWidth={1.5} />
        </button>
        <span
          className="text-[11px] text-neutral-400 tabular-nums tracking-[.12em]"
          role="status"
        >
          0{active + 1} / 03
        </span>
        <button
          aria-label="Next card"
          onClick={() => setActive((n) => (n + 1) % 3)}
          className="p-3 rounded-full bg-white/[.05] ring-1 ring-white/10 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-95 motion-reduce:transform-none focus-visible:outline-2 focus-visible:outline-white"
        >
          <ArrowRight size={17} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
