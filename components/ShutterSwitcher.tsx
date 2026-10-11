import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const scenes = [
  {
    word: "Quiet.",
    caption: "Clarity in motion",
    background: "#eeeeee",
    foreground: "#111111",
    angle: -28,
  },
  {
    word: "Form.",
    caption: "Shape with intention",
    background: "#202020",
    foreground: "#eeeeee",
    angle: 28,
  },
  {
    word: "Detail.",
    caption: "Nothing out of place",
    background: "#bfbfbf",
    foreground: "#111111",
    angle: 0,
  },
];

export default function ShutterSwitcher() {
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const reduce = useReducedMotion();
  const next = () => {
    if (transitioning) return;
    setTransitioning(true);
    setPrevious(active);
    setActive((n) => (n + 1) % scenes.length);
  };
  const renderScene = (index: number) => {
    const scene = scenes[index];
    return (
      <div
        className="absolute inset-0 p-6 sm:p-8 overflow-hidden"
        style={{ background: scene.background, color: scene.foreground }}
      >
        <div className="flex justify-between text-[11px] opacity-65">
          <span>Type in motion</span>
          <span>0{index + 1} / 03</span>
        </div>
        <div className="mt-6 text-[clamp(62px,14vw,92px)] font-medium tracking-[-.07em] leading-none">
          {scene.word}
        </div>
        <div
          aria-hidden="true"
          className="absolute left-[12%] right-[12%] top-[43%] h-[32%] flex justify-center items-center"
        >
          {Array.from({ length: 18 }, (_, n) => (
            <span
              key={n}
              className="absolute border-t border-current"
              style={{
                width: "84%",
                transform: `translateY(${(n - 8.5) * 5}px) rotate(${scene.angle}deg)`,
                opacity: 0.35,
              }}
            />
          ))}
        </div>
        <div className="absolute bottom-7 left-6 right-6 sm:left-8 sm:right-8 flex justify-between items-end">
          <span className="text-base tracking-tight">{scene.caption}</span>
          <ArrowUpRight size={20} strokeWidth={1.25} />
        </div>
      </div>
    );
  };
  return (
    <div
      className="min-h-[100dvh] bg-[#080808] text-white flex items-center justify-center p-6"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <div className="w-full max-w-[460px]">
        <div
          className="relative h-[360px] overflow-hidden rounded-[20px] ring-1 ring-white/10"
          aria-hidden="true"
        >
          {renderScene(transitioning ? previous : active)}
          {transitioning &&
            Array.from({ length: 5 }, (_, i) => (
              <motion.div
                key={`${active}-${i}`}
                className="absolute inset-0"
                initial={{
                  clipPath: reduce
                    ? `inset(0 ${Math.max(0, 80 - i * 20 - 0.08)}% 0 ${Math.max(0, i * 20 - 0.08)}%)`
                    : `inset(100% ${Math.max(0, 80 - i * 20 - 0.08)}% 0 ${Math.max(0, i * 20 - 0.08)}%)`,
                }}
                animate={{
                  clipPath: `inset(0% ${Math.max(0, 80 - i * 20 - 0.08)}% 0 ${Math.max(0, i * 20 - 0.08)}%)`,
                }}
                onAnimationComplete={() => {
                  if (i === 4) setTransitioning(false);
                }}
                transition={{
                  duration: reduce ? 0 : 0.5,
                  delay: reduce ? 0 : i * 0.04,
                  ease: [0.77, 0, 0.175, 1],
                }}
              >
                {renderScene(active)}
              </motion.div>
            ))}
        </div>
        <div className="flex items-center justify-between mt-5">
          <span className="text-xs text-neutral-400" role="status">
            {scenes[active].caption}
          </span>
          <button
            aria-label="Next composition"
            aria-disabled={transitioning}
            onClick={next}
            className="flex items-center gap-4 py-1 pl-4 pr-1 bg-white/[.06] ring-1 ring-white/10 rounded-full text-xs focus-visible:outline-2 focus-visible:outline-white"
          >
            Next study
            <span className="p-2.5 rounded-full bg-white/10">
              <ArrowRight size={14} strokeWidth={1.5} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
