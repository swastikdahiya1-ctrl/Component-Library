import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, RotateCcw } from "lucide-react";

const steps = [
  {
    name: "Prepare",
    title: "Prepare your project",
    text: "Collect the files and assets you want to share.",
  },
  {
    name: "Review",
    title: "Review the details",
    text: "Check your content before the final step.",
  },
  {
    name: "Publish",
    title: "Ready to publish",
    text: "Your project is prepared and reviewed.",
  },
];
const ease = [0.23, 1, 0.32, 1] as const;

export default function ProcessStepper() {
  const [step, setStep] = useState(0);
  const reduce = useReducedMotion();
  const id = useId();
  const complete = step === steps.length;
  return (
    <div className="min-h-[100dvh] bg-[#080808] text-neutral-100 flex items-center justify-center p-6 font-['Geist']">
      <div className="w-full max-w-[470px] p-[6px] rounded-[26px] bg-white/[.025] ring-1 ring-white/10">
        <div className="p-6 sm:p-8 rounded-[20px] bg-[#161616] shadow-[inset_0_1px_0_0_rgba(255,255,255,.06)]">
          <ol
            className="flex items-center mb-10"
            aria-label="Publishing progress"
          >
            {steps.map(({ name }, i) => (
              <li
                key={name}
                aria-current={step === i ? "step" : undefined}
                className="flex-1 flex items-center gap-2"
              >
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <span
                    className={`relative w-9 h-9 rounded-full flex items-center justify-center text-xs ring-1 ring-inset ${i <= step ? "bg-[#eee] ring-white/10 text-[#111]" : "ring-white/15 text-neutral-400"}`}
                  >
                    {i < step ? (
                      <motion.span
                        key="check"
                        initial={{
                          opacity: 0,
                          transform: reduce ? "none" : "scale(0.9)",
                        }}
                        animate={{ opacity: 1, transform: "scale(1)" }}
                        transition={{ duration: 0.18, ease }}
                      >
                        <Check size={16} strokeWidth={1.6} />
                      </motion.span>
                    ) : (
                      `0${i + 1}`
                    )}
                  </span>
                  <span className="text-xs text-neutral-400">{name}</span>
                </div>
                {i < 2 && (
                  <div className="relative h-px flex-1 mr-2 bg-neutral-700 -mt-6 overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-white origin-left"
                      initial={false}
                      animate={{ transform: `scaleX(${step > i ? 1 : 0})` }}
                      transition={{ duration: reduce ? 0 : 0.3, ease }}
                    />
                  </div>
                )}
              </li>
            ))}
          </ol>
          <div className="min-h-[116px]" role="status">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={{
                  opacity: 0,
                  transform: reduce ? "none" : "translateY(8px)",
                }}
                animate={{ opacity: 1, transform: "translateY(0px)" }}
                exit={{
                  opacity: 0,
                  transform: reduce ? "none" : "translateY(-5px)",
                }}
                transition={{ duration: 0.18, ease }}
              >
                <h2 className="text-2xl font-medium tracking-tight">
                  {complete ? "Project complete" : steps[step].title}
                </h2>
                <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
                  {complete
                    ? "All three steps complete. This is a demo; nothing was published."
                    : steps[step].text}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          <button
            aria-describedby={`${id}-hint`}
            onClick={() => setStep((n) => (complete ? 0 : n + 1))}
            className="mt-6 w-full flex items-center justify-between bg-[#eee] text-neutral-950 rounded-full pl-5 pr-1.5 py-1.5 text-sm font-medium transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[.98] motion-reduce:transform-none focus-visible:outline-2 focus-visible:outline-white"
          >
            {complete ? "Start again" : step === 2 ? "Finish demo" : "Continue"}
            <span className="rounded-full bg-black/[.06] p-3">
              {complete ? (
                <RotateCcw size={16} strokeWidth={1.5} />
              ) : (
                <ArrowRight size={16} strokeWidth={1.5} />
              )}
            </span>
          </button>
          <p id={`${id}-hint`} className="mt-4 text-xs text-neutral-400">
            Step {Math.min(step + 1, 3)} of 3
          </p>
        </div>
      </div>
    </div>
  );
}
