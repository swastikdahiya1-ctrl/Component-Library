import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MoveUpRight } from "lucide-react";

const scenes = [
  {
    title: "Less, but better.",
    word: "LESS",
    color: "#c7ef86",
    caption: "Reduce the noise. Keep the feeling.",
  },
  {
    title: "A new point of view.",
    word: "VIEW",
    color: "#a6c8ff",
    caption: "The same space. A different perspective.",
  },
  {
    title: "Make space for more.",
    word: "MORE",
    color: "#f1b7a8",
    caption: "Good ideas need room to breathe.",
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
        className="absolute inset-0 p-7 text-zinc-950 overflow-hidden"
        style={{ background: scene.color }}
      >
        <div className="flex justify-between text-xs font-medium">
          <span>Editorial motion study</span>
          <MoveUpRight size={18} />
        </div>
        <div className="absolute top-[24%] left-5 right-5 text-center text-[clamp(68px,18vw,104px)] font-black tracking-[-0.08em] leading-none">
          {scene.word}
        </div>
        <div className="absolute bottom-7 left-7 right-7">
          <h2 className="text-2xl font-medium tracking-tight">{scene.title}</h2>
          <p className="text-xs mt-2 opacity-75">{scene.caption}</p>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col items-center justify-center gap-5 p-6 font-sans">
      <div className="w-full max-w-[420px]">
        <div
          className="relative h-[310px] overflow-hidden rounded-2xl"
          aria-hidden="true"
        >
          {renderScene(previous)}
          {/* Each strip contains a full, aligned scene. Only its clip window moves. */}
          {Array.from({ length: 5 }, (_, i) => (
            <motion.div
              key={`${active}-${i}`}
              className="absolute inset-0"
              initial={{
                clipPath:
                  reduce || previous === active
                    ? `inset(0 ${80 - i * 20}% 0 ${i * 20}%)`
                    : `inset(100% ${80 - i * 20}% 0 ${i * 20}%)`,
              }}
              animate={{ clipPath: `inset(0% ${80 - i * 20}% 0 ${i * 20}%)` }}
              onAnimationComplete={() => {
                if (i === 4) setTransitioning(false);
              }}
              transition={{
                duration: reduce ? 0 : 0.55,
                delay: reduce ? 0 : i * 0.045,
                ease: [0.77, 0, 0.175, 1],
              }}
            >
              {renderScene(active)}
            </motion.div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-5">
          <span className="text-sm text-zinc-400" role="status">
            {scenes[active].title}
          </span>
          <button
            aria-label="Next composition"
            aria-disabled={transitioning}
            onClick={next}
            className="flex items-center gap-2 text-xs p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus-visible:outline-2 focus-visible:outline-lime-300"
          >
            Next
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
