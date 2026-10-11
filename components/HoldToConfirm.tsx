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
    <div className="min-h-[100dvh] bg-[#080808] text-neutral-100 flex flex-col items-center justify-center p-6 font-['Geist']">
      <div className="w-full max-w-[400px] text-center">
        <h2 className="text-[28px] tracking-[-.04em] font-medium mb-3">
          A deliberate action.
        </h2>
        <p className="text-sm text-neutral-400 mb-8">Press, hold, confirm.</p>
        <div className="p-[5px] rounded-[23px] bg-white/[.025] ring-1 ring-white/10">
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
            className="relative w-full h-[70px] rounded-[18px] bg-[#202020] overflow-hidden select-none shadow-[inset_0_1px_0_0_rgba(255,255,255,.07)] focus-visible:outline-2 focus-visible:outline-white"
            style={{ touchAction: "none" }}
          >
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 bg-[#eee]"
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
              className={`relative flex items-center justify-center gap-3 font-medium ${done ? "text-neutral-950" : "text-white mix-blend-difference"}`}
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
                  {done ? (
                    <Check size={22} strokeWidth={1.6} />
                  ) : (
                    <Fingerprint size={22} strokeWidth={1.4} />
                  )}
                </motion.span>
              </AnimatePresence>
              {done
                ? "Confirmed"
                : holding
                  ? "Keep holding"
                  : "Hold to confirm"}
            </span>
          </button>
        </div>
        <p
          id={instructions}
          role="status"
          className="mt-5 text-xs text-neutral-400 min-h-8 leading-relaxed"
        >
          {done
            ? "Confirmed successfully."
            : "Hold for 1.2 seconds. Release to cancel. Keyboard: hold Space or Enter."}
        </p>
        <button
          onClick={() => {
            cancel();
            setDone(false);
          }}
          className="inline-flex items-center gap-2 text-xs text-neutral-400 mt-5 p-3 rounded-lg focus-visible:outline-2 focus-visible:outline-white"
        >
          <RotateCcw size={13} strokeWidth={1.4} />
          Reset confirmation
        </button>
      </div>
    </div>
  );
}
