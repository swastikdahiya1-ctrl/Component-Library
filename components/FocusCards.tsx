import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const studies = [
  { title: "Optical", caption: "A study in perspective" },
  { title: "Frequency", caption: "Find your own rhythm" },
  { title: "Structure", caption: "A different frame of mind" },
];
const ease = [0.23, 1, 0.32, 1] as const;

export default function FocusCards() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  return (
    <div
      className="min-h-[100dvh] bg-[#080808] text-white flex items-center justify-center p-5 sm:p-8"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <div className="w-full max-w-[660px]">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-lg tracking-tight">Visual studies</h2>
          <span className="text-xs text-neutral-400">Select a perspective</span>
        </div>
        <div
          className="grid grid-cols-3 gap-2 sm:gap-3"
          style={{ perspective: 1400 }}
        >
          {studies.map(({ title, caption }, i) => (
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
                  : `translateY(${i === active ? -8 : 0}px) rotateY(${i === active ? 0 : i < active ? 5 : -5}deg)`,
              }}
              transition={{ duration: reduce ? 0 : 0.25, ease }}
              style={{
                color: i === active ? "#111" : "#b5b5b5",
                background: i === active ? "#eeeeee" : "#171717",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,.08)",
                transition: "color 180ms ease, background-color 180ms ease",
              }}
              className="relative h-[245px] sm:h-[320px] rounded-[16px] overflow-hidden text-left focus-visible:outline-2 focus-visible:outline-white"
            >
              <span className="absolute top-4 left-4 text-[10px] opacity-60">
                0{i + 1}
              </span>
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-7 h-[64%] flex items-center justify-center overflow-hidden"
              >
                {i === 0 &&
                  Array.from({ length: 10 }, (_, n) => (
                    <div
                      key={n}
                      className="absolute border rounded-full"
                      style={{
                        width: `${22 + n * 7}%`,
                        height: `${22 + n * 7}%`,
                        transform: "rotateX(30deg) rotateZ(-25deg)",
                        borderColor: "currentColor",
                        opacity: 0.7,
                      }}
                    />
                  ))}
                {i === 1 && (
                  <div className="flex items-center gap-[3px] sm:gap-[5px] w-[74%] h-[65%]">
                    {Array.from({ length: 19 }, (_, n) => (
                      <motion.div
                        key={n}
                        className="flex-1 bg-current rounded-full"
                        style={{
                          height: `${25 + Math.sin(n * 0.55) ** 2 * 70}%`,
                        }}
                        initial={false}
                        animate={{
                          transform: `scaleY(${i === active ? 1 : 0.65})`,
                        }}
                        transition={{
                          duration: reduce ? 0 : 0.3,
                          delay: reduce ? 0 : n * 0.01,
                          ease,
                        }}
                      />
                    ))}
                  </div>
                )}
                {i === 2 &&
                  Array.from({ length: 8 }, (_, n) => (
                    <div
                      key={n}
                      className="absolute border rounded-[3px]"
                      style={{
                        width: "55%",
                        height: "52%",
                        transform: `translate(${(n - 3.5) * 4}px, ${(n - 3.5) * -4}px) rotate(-12deg)`,
                        borderColor: "currentColor",
                        opacity: 0.55,
                      }}
                    />
                  ))}
              </div>
              <div className="absolute bottom-5 left-3 right-3 sm:left-5 sm:right-5">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] sm:text-lg tracking-tight font-medium">
                    {title}
                  </span>
                  <ArrowUpRight size={14} strokeWidth={1.3} />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
        <div className="flex justify-between items-center mt-5 text-xs text-neutral-400">
          <span role="status">{studies[active].caption}</span>
          <span className="tabular-nums">0{active + 1} / 03</span>
        </div>
      </div>
    </div>
  );
}
