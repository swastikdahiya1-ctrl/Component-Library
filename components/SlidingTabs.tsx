import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Layers, Radio, SlidersHorizontal } from "lucide-react";

const panels = [
  {
    name: "Overview",
    icon: Layers,
    title: "Workspace overview",
    text: "Your projects and resources, in one place.",
    stat: "24",
    label: "Projects in your workspace",
  },
  {
    name: "Activity",
    icon: Radio,
    title: "Recent activity",
    text: "A clear view of what changed today.",
    stat: "08",
    label: "Updates since your last visit",
  },
  {
    name: "Settings",
    icon: SlidersHorizontal,
    title: "Workspace settings",
    text: "Manage the tools connected to your workspace.",
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
    <div className="min-h-[100dvh] bg-[#080808] text-neutral-100 flex items-center justify-center p-6 font-['Geist']">
      <div className="w-full max-w-[480px] p-[6px] rounded-[24px] ring-1 ring-white/10 bg-white/[.025]">
        <div className="bg-[#151515] rounded-[18px] p-5 sm:p-7 shadow-[inset_0_1px_0_0_rgba(255,255,255,.06)]">
          <div
            className="flex rounded-full bg-[#222] p-1"
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
                className="relative flex-1 flex justify-center items-center gap-2 py-3 text-xs sm:text-sm rounded-full focus-visible:outline-2 focus-visible:outline-white"
              >
                {active === i && (
                  <motion.span
                    layoutId={`${id}-indicator`}
                    transition={{ duration: instant ? 0 : 0.25, ease }}
                    className="absolute inset-0 rounded-full bg-[#eee]"
                  />
                )}
                <Icon
                  size={14}
                  strokeWidth={1.4}
                  className={`relative ${active === i ? "text-neutral-950" : "text-neutral-400"}`}
                />
                <span
                  className={`relative ${active === i ? "text-neutral-950" : "text-neutral-400"}`}
                >
                  {name}
                </span>
              </button>
            ))}
          </div>
          <div
            id={`${id}-panel`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${active}`}
            tabIndex={0}
            className="mt-8 min-h-[245px] focus-visible:outline-2 focus-visible:outline-white rounded-lg"
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
                <h2 className="text-[27px] tracking-[-.04em] font-medium">
                  {panel.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                  {panel.text}
                </p>
                <div className="flex items-center gap-5 mt-7 pt-5 border-t border-white/[.08]">
                  <span className="text-[56px] leading-none font-medium tracking-[-.06em] tabular-nums">
                    {panel.stat}
                  </span>
                  <span className="text-xs text-neutral-400 max-w-[150px] leading-relaxed">
                    {panel.label}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
