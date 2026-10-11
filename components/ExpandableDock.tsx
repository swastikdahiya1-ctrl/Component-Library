import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Aperture, Folder, Headphones, Home, PenTool } from "lucide-react";

const apps = [
  { name: "Home", icon: Home, color: "#c7ef86" },
  { name: "Files", icon: Folder, color: "#a6c8ff" },
  { name: "Create", icon: PenTool, color: "#f1b7a8" },
  { name: "Photos", icon: Aperture, color: "#d4c3f5" },
  { name: "Listen", icon: Headphones, color: "#f3dda0" },
];

export default function ExpandableDock() {
  const [hot, setHot] = useState<number | null>(null);
  const [selected, setSelected] = useState(0);
  const reduce = useReducedMotion();
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col items-center justify-center gap-12 p-6 font-sans">
      <div className="text-center">
        <p className="text-xs text-zinc-400 mb-3">Your space, within reach.</p>
        <h2 className="text-3xl font-medium tracking-tight" role="status">
          {apps[selected].name}
        </h2>
      </div>
      <div
        className="flex gap-1 sm:gap-3 items-end bg-zinc-900 border border-zinc-700 rounded-2xl px-2 sm:px-4 py-4"
        aria-label="Application dock"
        onMouseLeave={() => setHot(null)}
      >
        {apps.map(({ name, icon: Icon, color }, i) => {
          const distance = hot === null ? 10 : Math.abs(i - hot);
          const scale = distance === 0 ? 1.28 : distance === 1 ? 1.1 : 1;
          return (
            <div
              key={name}
              className="relative w-12 sm:w-14 flex flex-col items-center"
            >
              <motion.span
                aria-hidden="true"
                className="absolute bottom-[78px] text-xs text-zinc-300"
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
                  if (matchMedia("(hover: hover) and (pointer: fine)").matches)
                    setHot(i);
                }}
                initial={false}
                animate={{
                  transform: reduce
                    ? "none"
                    : `translateY(${distance === 0 ? -10 : distance === 1 ? -4 : 0}px) scale(${scale})`,
                }}
                transition={{
                  type: "spring",
                  duration: reduce ? 0 : 0.35,
                  bounce: 0,
                }}
                style={{ color, transformOrigin: "50% 100%" }}
                className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-zinc-800 border border-zinc-700 focus-visible:outline-2 focus-visible:outline-lime-300"
              >
                <Icon size={23} strokeWidth={1.5} />
              </motion.button>
              <span
                aria-hidden="true"
                className={`h-1 w-1 rounded-full mt-3 ${selected === i ? "bg-zinc-200" : "bg-transparent"}`}
              />
            </div>
          );
        })}
      </div>
      <p className="text-xs text-zinc-400">
        Move across the dock. Click to select.
      </p>
    </div>
  );
}
