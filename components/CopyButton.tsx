import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clipboard } from 'lucide-react';

const layoutTransition = { type: "spring", bounce: 0.4, duration: 0.5 };
const contentTransition = { type: "spring", bounce: 0, duration: 0.4 };

export default function CopyButton() {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black font-sans">
      <motion.button
        layout // Automatically animates the width expansion
        onClick={() => setCopied(true)}
        initial={false}
        animate={{
          borderColor: copied ? "#22c55e" : "#27272a", // green-500 vs zinc-800
          color: copied ? "#22c55e" : "#f4f4f5", // green-500 vs zinc-100
        }}
        transition={layoutTransition} // Bouncy layout expansion
        style={{ borderRadius: "8px" }} // Pass directly to style to prevent scale distortion
        className="flex items-center gap-2 px-4 py-2 bg-[#09090b] border outline-none shadow-lg relative overflow-hidden"
      >
        
        {/* Icon Container (Fixed width to prevent jumping) */}
        <motion.div layout className="relative flex items-center justify-center w-4 h-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {!copied ? (
              <motion.div
                layout
                key="clipboard"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={contentTransition}
                className="absolute flex items-center justify-center inset-0"
              >
                <Clipboard className="w-full h-full" strokeWidth={2.5} />
              </motion.div>
            ) : (
              <motion.svg
                layout
                key="check"
                initial={{ opacity: 0, x: 10 }} // Slide in from right
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }} // Slide out to right (avoids clipboard overlap)
                transition={contentTransition}
                className="absolute w-full h-full"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ 
                    pathLength: 1,
                    transition: { ...contentTransition, delay: 0.2 }
                  }}
                  exit={{ 
                    pathLength: 0,
                    transition: { ...contentTransition, delay: 0 }
                  }}
                  d="M4 12l5 5L20 6" // Reversed path data so it draws left-to-right, and erases right-to-left
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Text Container */}
        <motion.div layout className="flex items-center text-[15px] font-semibold relative h-5 overflow-hidden">
          <motion.span layout>Cop</motion.span>
          
          {/* Dynamic suffix wrapper */}
          <motion.div layout className="relative flex items-center justify-center">
            <AnimatePresence mode="popLayout" initial={false}>
              {!copied ? (
                <motion.span
                  layout
                  key="y"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={contentTransition}
                  className="inline-block"
                >
                  y
                </motion.span>
              ) : (
                <motion.span
                  layout
                  key="ied"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={contentTransition}
                  className="inline-block"
                >
                  ied!
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

      </motion.button>

      {/* Manual Reset Button */}
      <button 
        onClick={() => setCopied(false)}
        className="mt-8 px-4 py-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors outline-none"
      >
        Reset State
      </button>
    </div>
  );
}
