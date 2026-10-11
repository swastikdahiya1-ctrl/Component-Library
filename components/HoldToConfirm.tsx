import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Fingerprint, RotateCcw } from "lucide-react";

// A demo confirmation only. Connect on completion to your own action.
export default function HoldToConfirm() {
  const [holding, setHolding] = useState(false);
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();
  const instructions = useId();
  const cancel = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setHolding(false);
  };
  const begin = () => {
    if (done || timer.current) return;
    setHolding(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      setDone(true);
      setHolding(false);
    }, 1200);
  };
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[340px] text-center">
        <p className="text-sm text-zinc-400 mb-8">
          Some decisions deserve a moment.
        </p>
        <button
          aria-label={done ? "Confirmed" : "Hold to confirm"}
          aria-describedby={instructions}
          disabled={done}
          onPointerDown={(e) => {
            if (e.button !== 0 || !e.isPrimary) return;
            if (e.isTrusted) e.currentTarget.setPointerCapture(e.pointerId);
            begin();
          }}
          onPointerUp={cancel}
          onPointerCancel={cancel}
          onLostPointerCapture={cancel}
          onBlur={cancel}
          onKeyDown={(e) => {
            if ([" ", "Enter"].includes(e.key)) {
              e.preventDefault();
              if (!e.repeat) begin();
            }
          }}
          onKeyUp={(e) => {
            if ([" ", "Enter"].includes(e.key)) {
              e.preventDefault();
              cancel();
            }
          }}
          className="relative w-full h-16 rounded-xl border border-zinc-700 bg-zinc-900 overflow-hidden select-none focus-visible:outline-2 focus-visible:outline-lime-300"
          style={{ touchAction: "none" }}
        >
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 bg-lime-300"
            initial={false}
            animate={{
              clipPath:
                done || holding ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
            }}
            transition={{
              duration: holding ? 1.2 : 0.2,
              ease: holding ? "linear" : [0.23, 1, 0.32, 1],
            }}
          />
          <span
            className={`relative flex items-center justify-center gap-3 font-medium ${done ? "text-zinc-950" : "text-white mix-blend-difference"}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={done ? "check" : "print"}
                initial={{
                  opacity: 0,
                  transform: reduce ? "none" : "translateY(6px)",
                }}
                animate={{ opacity: 1, transform: "translateY(0px)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16 }}
              >
                {done ? <Check size={22} /> : <Fingerprint size={22} />}
              </motion.span>
            </AnimatePresence>
            {done ? "Confirmed" : holding ? "Keep holding" : "Hold to confirm"}
          </span>
        </button>
        <p
          id={instructions}
          role="status"
          className="mt-4 text-xs text-zinc-400 h-8"
        >
          {done
            ? "All set. A deliberate action, clearly acknowledged."
            : "Hold for 1.2 seconds. Release early to cancel.\nKeyboard: hold Space or Enter."}
        </p>
        <button
          onClick={() => {
            cancel();
            setDone(false);
          }}
          className="inline-flex items-center gap-2 text-xs text-zinc-400 mt-5 p-3 rounded-lg focus-visible:outline-2 focus-visible:outline-lime-300"
        >
          <RotateCcw size={13} />
          Reset confirmation
        </button>
      </div>
    </div>
  );
}
