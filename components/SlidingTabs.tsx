import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Layers, Radio, SlidersHorizontal } from "lucide-react";

const panels = [
  {
    name: "Overview",
    icon: Layers,
    title: "A place for every idea.",
    text: "Bring your notes, references, and work into one considered space.",
    stat: "24",
    label: "Projects in your workspace",
  },
  {
    name: "Activity",
    icon: Radio,
    title: "Keep the signal clear.",
    text: "Follow the changes that matter, without the noise around them.",
    stat: "08",
    label: "Updates since your last visit",
  },
  {
    name: "Settings",
    icon: SlidersHorizontal,
    title: "Make room for your flow.",
    text: "Small adjustments. A workspace that feels entirely yours.",
    stat: "03",
    label: "Connected tools",
  },
];
const ease = [0.23, 1, 0.32, 1] as const;

export default function SlidingTabs() {
  const [active, setActive] = useState(0);
  const [keyboard, setKeyboard] = useState(false);
  const reduce = useReducedMotion();
  const id = useId();
  const panel = panels[active];
  const instant = reduce || keyboard;
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[440px]">
        <div
          className="flex rounded-xl bg-zinc-900 p-1"
          role="tablist"
          aria-label="Workspace sections"
        >
          {panels.map(({ name, icon: Icon }, i) => (
            <button
              key={name}
              id={`${id}-tab-${i}`}
              role="tab"
              aria-selected={active === i}
              aria-controls={`${id}-panel`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => {
                setKeyboard(false);
                setActive(i);
              }}
              onKeyDown={(e) => {
                const next =
                  e.key === "ArrowRight"
                    ? (i + 1) % 3
                    : e.key === "ArrowLeft"
                      ? (i + 2) % 3
                      : e.key === "Home"
                        ? 0
                        : e.key === "End"
                          ? 2
                          : null;
                if (next !== null) {
                  e.preventDefault();
                  setKeyboard(true);
                  setActive(next);
                  document.getElementById(`${id}-tab-${next}`)?.focus();
                }
              }}
              className="relative flex-1 flex justify-center items-center gap-2 py-3 text-sm rounded-lg focus-visible:outline-2 focus-visible:outline-lime-300"
            >
              {active === i && (
                <motion.span
                  layoutId={`${id}-indicator`}
                  transition={{ duration: instant ? 0 : 0.25, ease }}
                  className="absolute inset-0 rounded-lg bg-zinc-700/60"
                />
              )}
              <Icon size={15} className="relative" />
              <span className="relative">{name}</span>
            </button>
          ))}
        </div>
        <div
          id={`${id}-panel`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${active}`}
          tabIndex={0}
          className="mt-5 min-h-[280px] rounded-2xl border border-zinc-800 bg-zinc-900/40 p-7"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{
                opacity: 0,
                transform: instant ? "none" : "translateY(8px)",
              }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              exit={{
                opacity: 0,
                transform: instant ? "none" : "translateY(-5px)",
              }}
              transition={{ duration: instant ? 0 : 0.18, ease }}
            >
              <ArrowUpRight size={22} className="text-lime-300 mb-6" />
              <h2 className="text-2xl tracking-tight font-medium">
                {panel.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {panel.text}
              </p>
              <div className="flex items-end gap-3 mt-7">
                <span className="text-4xl tracking-tighter">{panel.stat}</span>
                <span className="text-xs text-zinc-400 pb-1">
                  {panel.label}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
