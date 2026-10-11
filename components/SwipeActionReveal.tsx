import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { Archive, ArrowLeft, Check, Mail, RotateCcw } from "lucide-react";

export default function SwipeActionReveal() {
  const [open, setOpen] = useState(false);
  const [archived, setArchived] = useState(false);
  const x = useMotionValue(0);
  const transform = useTransform(x, (value) => `translateX(${value}px)`);
  const start = useRef(0);
  const settling = useRef<{ stop: () => void } | null>(null);
  const actionToggle = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const control = animate(
      x,
      open ? -104 : 0,
      reduce ? { duration: 0 } : { type: "spring", duration: 0.4, bounce: 0 },
    );
    settling.current = control;
    return () => settling.current?.stop();
  }, [open, x, reduce]);
  return (
    <div className="min-h-[100dvh] bg-[#080808] text-neutral-100 flex flex-col items-center justify-center gap-5 p-6 font-['Geist']">
      <div className="w-full max-w-[480px]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg tracking-tight">Inbox</h2>
          <span className="text-[11px] text-neutral-400">1 conversation</span>
        </div>
        <div className="relative overflow-hidden rounded-[20px] bg-[#eee] ring-1 ring-white/10">
          <button
            aria-label="Archive message"
            tabIndex={open && !archived ? 0 : -1}
            aria-hidden={!open || archived}
            onClick={() => {
              setArchived(true);
              setOpen(false);
              actionToggle.current?.focus();
            }}
            className={`absolute right-0 top-0 bottom-0 w-[104px] text-neutral-950 flex flex-col items-center justify-center gap-2 text-xs focus-visible:outline-2 focus-visible:outline-black ${open && !archived ? "" : "pointer-events-none"}`}
          >
            <Archive size={22} strokeWidth={1.4} />
            Archive
          </button>
          <motion.div
            style={{ transform, touchAction: "pan-y" }}
            onPanStart={() => {
              settling.current?.stop();
              start.current = x.get();
            }}
            onPan={(_, info) => {
              if (archived) return;
              const next = start.current + info.offset.x;
              x.set(
                next > 0
                  ? next * 0.12
                  : next < -104
                    ? -104 + (next + 104) * 0.12
                    : next,
              );
            }}
            onPanEnd={(_, info) => {
              if (!archived) {
                const next =
                  info.velocity.x < -250 ||
                  (info.velocity.x < 250 && x.get() < -50);
                setOpen(next);
                if (next === open) {
                  settling.current = animate(x, next ? -104 : 0, {
                    duration: reduce ? 0 : 0.25,
                    ease: [0.23, 1, 0.32, 1],
                  });
                }
              }
            }}
            className="relative bg-[#191919] ring-1 ring-inset ring-white/10 rounded-[20px] p-6 sm:p-7 min-h-[170px] select-none shadow-[inset_0_1px_0_0_rgba(255,255,255,.06)]"
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="p-2.5 bg-[#eee] rounded-full text-neutral-950">
                {archived ? (
                  <Check size={18} strokeWidth={1.5} />
                ) : (
                  <Mail size={18} strokeWidth={1.5} />
                )}
              </span>
              <span className="text-sm font-medium">
                {archived ? "Conversation archived" : "Studio"}
              </span>
              <span className="ml-auto text-[11px] text-neutral-400">
                09:41
              </span>
            </div>
            <p
              className="text-sm text-neutral-400 leading-relaxed"
              role="status"
            >
              {archived
                ? "A clean inbox. You can restore this demo below."
                : "The new direction is looking good. Let’s pick it up tomorrow."}
            </p>
          </motion.div>
        </div>
        <div className="flex justify-between items-center mt-5 text-xs text-neutral-400">
          <span>
            {archived ? "Conversation archived" : "Swipe left for actions"}
          </span>
          <button
            ref={actionToggle}
            onClick={() => {
              if (archived) {
                setArchived(false);
                setOpen(false);
              } else setOpen((n) => !n);
            }}
            aria-label={
              archived
                ? "Restore message"
                : open
                  ? "Hide actions"
                  : "Show actions"
            }
            className="flex items-center gap-2 py-3 px-3 rounded-full bg-white/[.04] ring-1 ring-white/10 text-neutral-200 focus-visible:outline-2 focus-visible:outline-white"
          >
            {archived ? <RotateCcw size={14} /> : <ArrowLeft size={14} />}
            {archived ? "Restore" : open ? "Close" : "Try it"}
          </button>
        </div>
      </div>
    </div>
  );
}
