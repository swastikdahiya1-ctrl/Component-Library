import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Aperture, Folder, Headphones, Home, PenTool } from "lucide-react";

const apps = [
  { name: "Home", icon: Home },
  { name: "Files", icon: Folder },
  { name: "Create", icon: PenTool },
  { name: "Photos", icon: Aperture },
  { name: "Listen", icon: Headphones },
];

export default function ExpandableDock() {
  const [hot, setHot] = useState<number | null>(null);
  const [selected, setSelected] = useState(0);
  const reduce = useReducedMotion();
  const id = useId();
  return (
    <div
      className="min-h-[100dvh] bg-[#080808] text-white flex flex-col items-center justify-center p-5"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <div className="h-24 text-center">
        <p className="text-[11px] text-neutral-400 mb-3">Workspace</p>
        <h2 className="text-[38px] font-medium tracking-[-.05em]" role="status">
          {apps[selected].name}
        </h2>
      </div>
      <div className="mt-10 p-[5px] rounded-[25px] bg-white/[.025] ring-1 ring-white/10">
        <div
          className="flex gap-1 sm:gap-3 items-end rounded-[20px] px-2 sm:px-4 pt-4 pb-3 bg-[#191919] shadow-[inset_0_1px_0_0_rgba(255,255,255,.06)]"
          aria-label="Application dock"
          onMouseLeave={() => setHot(null)}
        >
          {apps.map(({ name, icon: Icon }, i) => {
            const distance = hot === null ? 10 : Math.abs(i - hot);
            const scale = distance === 0 ? 1.22 : distance === 1 ? 1.08 : 1;
            return (
              <div
                key={name}
                className="relative w-12 sm:w-14 flex flex-col items-center"
              >
                <motion.span
                  aria-hidden="true"
                  className="absolute bottom-[82px] py-1.5 px-3 rounded-lg bg-[#262626] ring-1 ring-white/10 text-[11px] text-white"
                  initial={false}
                  animate={{
                    opacity: hot === i ? 1 : 0,
                    transform: reduce
                      ? "none"
                      : `translateY(${hot === i ? 0 : 4}px)`,
                  }}
                  transition={{ duration: 0.15 }}
                >
                  {name}
                </motion.span>
                <motion.button
                  aria-label={name}
                  aria-pressed={selected === i}
                  onClick={() => setSelected(i)}
                  onFocus={() => setHot(i)}
                  onBlur={() => setHot(null)}
                  onMouseEnter={() => {
                    if (
                      matchMedia("(hover: hover) and (pointer: fine)").matches
                    )
                      setHot(i);
                  }}
                  initial={false}
                  animate={{
                    transform: reduce
                      ? "none"
                      : `translateY(${distance === 0 ? -9 : distance === 1 ? -3 : 0}px) scale(${scale})`,
                  }}
                  transition={{
                    type: "spring",
                    duration: reduce ? 0 : 0.32,
                    bounce: 0,
                  }}
                  style={{ transformOrigin: "50% 100%" }}
                  className={`w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-[14px] ring-1 ring-inset ring-white/10 focus-visible:outline-2 focus-visible:outline-white ${selected === i ? "bg-[#eeeeee] text-[#111]" : "bg-[#292929] text-neutral-300"}`}
                >
                  <Icon size={22} strokeWidth={1.4} />
                </motion.button>
                <div className="relative w-3 h-[3px] mt-3">
                  {selected === i && (
                    <motion.span
                      layoutId={`${id}-selection`}
                      className="absolute inset-0 rounded-full bg-neutral-300"
                      transition={{
                        duration: reduce ? 0 : 0.22,
                        ease: [0.23, 1, 0.32, 1],
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-[11px] text-neutral-400 mt-8">
        Hover to explore. Click to switch.
      </p>
    </div>
  );
}
