import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, AudioLines, Aperture, ScanLine } from "lucide-react";

const studies = [
  {
    title: "Optical",
    caption: "A study in perspective",
    icon: Aperture,
    color: "#c7ef86",
  },
  {
    title: "Frequency",
    caption: "Find your own rhythm",
    icon: AudioLines,
    color: "#a6c8ff",
  },
  {
    title: "Structure",
    caption: "A different frame of mind",
    icon: ScanLine,
    color: "#f1b7a8",
  },
];
const ease = [0.23, 1, 0.32, 1] as const;

export default function FocusCards() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[620px]">
        <p className="text-sm text-zinc-400 mb-6">
          Three studies. One point of focus.
        </p>
        <div
          className="grid grid-cols-3 gap-2 sm:gap-4"
          style={{ perspective: 1000 }}
        >
          {studies.map(({ title, caption, icon: Icon, color }, i) => (
            <motion.button
              key={title}
              aria-pressed={i === active}
              aria-label={`${title}: ${caption}`}
              onClick={() => setActive(i)}
              onFocus={() => setActive(i)}
              onMouseEnter={() => {
                if (matchMedia("(hover: hover) and (pointer: fine)").matches)
                  setActive(i);
              }}
              initial={false}
              animate={{
                transform: reduce
                  ? "none"
                  : `translateY(${i === active ? -12 : 0}px) rotateY(${i === active ? 0 : i < active ? 8 : -8}deg)`,
                opacity: i === active ? 1 : 0.55,
              }}
              transition={{ duration: reduce ? 0.1 : 0.25, ease }}
              className="relative h-[250px] sm:h-[290px] border border-zinc-700 bg-zinc-900 rounded-xl overflow-hidden text-left focus-visible:outline-2 focus-visible:outline-lime-300"
            >
              <div
                className="absolute inset-x-0 top-0 h-[68%] flex items-center justify-center"
                style={{ color }}
              >
                <Icon size={76} strokeWidth={0.7} />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5">
                <div className="flex justify-between items-center">
                  <h2 className="text-[13px] sm:text-lg tracking-tight">
                    {title}
                  </h2>
                  <ArrowUpRight size={14} />
                </div>
                <motion.p
                  initial={false}
                  animate={{
                    opacity: i === active ? 1 : 0,
                    transform: reduce
                      ? "none"
                      : `translateY(${i === active ? 0 : 8}px)`,
                  }}
                  transition={{ duration: 0.2, ease }}
                  className="text-[10px] sm:text-xs text-zinc-400 mt-2 leading-relaxed"
                >
                  {caption}
                </motion.p>
              </div>
              <motion.div
                aria-hidden="true"
                className="absolute bottom-0 left-0 right-0 h-[2px] origin-left"
                style={{ background: color }}
                initial={false}
                animate={{ transform: `scaleX(${i === active ? 1 : 0})` }}
                transition={{ duration: reduce ? 0 : 0.25, ease }}
              />
            </motion.button>
          ))}
        </div>
        <p className="text-xs text-zinc-400 mt-6">
          Hover, focus, or tap a study.
        </p>
      </div>
    </div>
  );
}
