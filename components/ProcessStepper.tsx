import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, RotateCcw } from "lucide-react";

const steps = [
  {
    name: "Prepare",
    title: "Start with the essentials.",
    text: "Your files are collected and ready for a closer look.",
  },
  {
    name: "Review",
    title: "Give it one last look.",
    text: "Check the details before sharing your work with the world.",
  },
  {
    name: "Publish",
    title: "Ready when you are.",
    text: "Everything is in place. Your next idea is ready to go live.",
  },
];
const ease = [0.23, 1, 0.32, 1] as const;

export default function ProcessStepper() {
  const [step, setStep] = useState(0);
  const reduce = useReducedMotion();
  const id = useId();
  const complete = step === steps.length;
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[430px] rounded-2xl border border-zinc-800 bg-zinc-900/40 p-7">
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
                  className={`relative w-9 h-9 rounded-full flex items-center justify-center text-xs border ${i <= step ? "border-lime-300 text-lime-300" : "border-zinc-700 text-zinc-400"}`}
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
                      <Check size={16} />
                    </motion.span>
                  ) : (
                    `0${i + 1}`
                  )}
                </span>
                <span className="text-xs text-zinc-400">{name}</span>
              </div>
              {i < 2 && (
                <div className="relative h-px flex-1 mr-2 bg-zinc-700 -mt-6 overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-lime-300 origin-left"
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
                {complete ? "Out in the world." : steps[step].title}
              </h2>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                {complete
                  ? "A small sequence, a clear sense of progress. This is a demo; nothing was published."
                  : steps[step].text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        <button
          aria-describedby={`${id}-hint`}
          onClick={() => setStep((n) => (complete ? 0 : n + 1))}
          className="mt-6 w-full flex items-center justify-between bg-lime-300 text-zinc-950 rounded-lg px-4 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-white"
        >
          {complete ? "Start again" : step === 2 ? "Finish demo" : "Continue"}
          {complete ? <RotateCcw size={16} /> : <ArrowRight size={16} />}
        </button>
        <p id={`${id}-hint`} className="mt-4 text-xs text-zinc-400">
          A three-step interaction study.
        </p>
      </div>
    </div>
  );
}
