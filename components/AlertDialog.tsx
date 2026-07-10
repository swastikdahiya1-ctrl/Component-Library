import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// HEADER ANIMATION CONFIGURATION
// ============================================================================
const HEADER_CONFIG = {
  // The header text to split and animate
  text: "Are you absolutely sure?",

  // Delay before the first word starts animating (in seconds)
  delayChildren: 0.1,

  // Delay between each word's animation start (in seconds)
  staggerChildren: 0.035,

  // Starting horizontal offset (in pixels). Positive starts right, negative starts left
  startX: 6,

  // Starting vertical offset (in pixels). Positive starts below, negative starts above
  startY: 0,

  // Starting blur amount (in pixels)
  startBlur: 4,

  // Duration of the spring animation (in seconds)
  duration: 1,

  // Bounce factor (0 to 1). 0 is no bounce, 1 is max bounce.
  bounce: 0.4,
};

// ============================================================================
// SUBHEADER ANIMATION CONFIGURATION
// ============================================================================
const SUBHEADER_CONFIG = {
  // The subtext to split and animate
  text: "This action cannot be undone. This will permanently delete your account from our servers",

  // Delay before the first subheader word starts animating (in seconds)
  delayChildren: 0.12,

  // Delay between each word's animation start (in seconds)
  staggerChildren: 0.01,

  // Starting horizontal offset (in pixels)
  startX: 5,

  // Starting vertical offset (in pixels)
  startY: 0,

  // Starting blur amount (in pixels)
  startBlur: 4,

  // Duration of the spring animation (in seconds)
  duration: 1,

  // Bounce factor (0 to 1)
  bounce: 0.4,
};

// ============================================================================
// BUTTONS ANIMATION CONFIGURATION
// ============================================================================
const BUTTONS_CONFIG = {
  // Delay before the Cancel button starts animating (in seconds)
  cancelDelay: 0.15,

  // Delay before the Continue button starts animating (in seconds, stagger relative to Cancel)
  staggerDelay: 0.08,

  // Starting vertical offset (in pixels). Positive starts below (slides up)
  startY: 7,

  // Duration of the spring animation (in seconds)
  duration: 0.8,

  // Bounce factor (0 to 1). 0 is no bounce, 1 is max bounce.
  bounce: 0.,

  // Hover animation vertical offset (in pixels)
  hoverY: -2,

  // Hover animation duration (in seconds)
  hoverDuration: 0.4,

  // Hover animation bounce
  hoverBounce: 0.25,

  // Sphere color class for the Continue button
  sphereColor: "bg-red-600",

  // Hover text color for the Continue button
  continueTextHover: "#ffffff",

  // Duration for the sphere to expand (in seconds)
  sphereDuration: 0.5,

  // Duration for the sphere to retract (in seconds)
  sphereRetractDuration: 0.2
};

// ============================================================================
// DIALOG CONTAINER ANIMATION CONFIGURATION
// ============================================================================
const DIALOG_CONFIG = {
  // The starting scale of the dialog before it animates in (1 is full size)
  startScale: 0.85,

  // The duration of the spring animation (in seconds)
  duration: 0.6,

  // Bounce factor (0 to 1). 0 is no bounce, 1 is max bounce.
  bounce: 0.3
};

export default function AlertDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [enableBlur, setEnableBlur] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black font-sans">
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80"
              onClick={() => setIsOpen(false)}
            />

            {/* Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: DIALOG_CONFIG.startScale }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: DIALOG_CONFIG.startScale }}
              transition={{
                type: "spring",
                duration: DIALOG_CONFIG.duration,
                bounce: DIALOG_CONFIG.bounce
              }}
              className="relative z-50 flex flex-col w-full max-w-md border border-zinc-800 bg-[#09090b] p-0 shadow-lg sm:rounded-lg overflow-hidden"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="p-6 pb-6">
                {/* Animated Header */}
                <motion.h2
                  className="text-lg font-semibold tracking-tight text-white mb-2 flex flex-wrap gap-x-1"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        delayChildren: HEADER_CONFIG.delayChildren,
                        staggerChildren: HEADER_CONFIG.staggerChildren
                      }
                    }
                  }}
                >
                  {HEADER_CONFIG.text.split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      variants={{
                        hidden: {
                          opacity: 0,
                          x: HEADER_CONFIG.startX,
                          y: HEADER_CONFIG.startY,
                          filter: `blur(${enableBlur ? HEADER_CONFIG.startBlur : 0}px)`
                        },
                        visible: {
                          opacity: 1,
                          x: 0,
                          y: 0,
                          filter: "blur(0px)"
                        }
                      }}
                      transition={{
                        type: "spring",
                        duration: HEADER_CONFIG.duration,
                        bounce: HEADER_CONFIG.bounce
                      }}
                      className="inline-block"
                      style={{ willChange: "transform, filter, opacity" }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.h2>

                {/* Animated Subheader */}
                <motion.p
                  className="text-sm text-zinc-400 flex flex-wrap gap-x-1"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        delayChildren: SUBHEADER_CONFIG.delayChildren,
                        staggerChildren: SUBHEADER_CONFIG.staggerChildren
                      }
                    }
                  }}
                >
                  {SUBHEADER_CONFIG.text.split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      variants={{
                        hidden: {
                          opacity: 0,
                          x: SUBHEADER_CONFIG.startX,
                          y: SUBHEADER_CONFIG.startY,
                          filter: `blur(${enableBlur ? SUBHEADER_CONFIG.startBlur : 0}px)`
                        },
                        visible: {
                          opacity: 1,
                          x: 0,
                          y: 0,
                          filter: "blur(0px)"
                        }
                      }}
                      transition={{
                        type: "spring",
                        duration: SUBHEADER_CONFIG.duration,
                        bounce: SUBHEADER_CONFIG.bounce
                      }}
                      className="inline-block"
                      style={{ willChange: "transform, filter, opacity" }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.p>
              </div>

              <div className="flex items-center justify-end border-t border-zinc-800/50 bg-[#09090b] p-4 gap-2">
                {/* Animated Cancel Button */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0, y: BUTTONS_CONFIG.startY },
                    visible: {
                      opacity: 1,
                      y: 0
                    }
                  }}
                  transition={{
                    type: "spring",
                    duration: BUTTONS_CONFIG.duration,
                    bounce: BUTTONS_CONFIG.bounce,
                    delay: BUTTONS_CONFIG.cancelDelay,
                  }}
                  style={{ willChange: "transform, opacity" }}
                >
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    initial="rest"
                    animate="rest"
                    whileHover="hover"
                    variants={{
                      rest: { y: 0 },
                      hover: { y: BUTTONS_CONFIG.hoverY }
                    }}
                    transition={{
                      type: "spring",
                      bounce: BUTTONS_CONFIG.hoverBounce,
                      duration: BUTTONS_CONFIG.hoverDuration
                    }}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300 disabled:pointer-events-none disabled:opacity-50 border border-zinc-800 bg-transparent hover:bg-zinc-800 text-zinc-100 h-9 px-4 py-2"
                    style={{ willChange: "transform" }}
                  >
                    Cancel
                  </motion.button>
                </motion.div>

                {/* Animated Continue Button */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0, y: BUTTONS_CONFIG.startY },
                    visible: {
                      opacity: 1,
                      y: 0
                    }
                  }}
                  transition={{
                    type: "spring",
                    duration: BUTTONS_CONFIG.duration,
                    bounce: BUTTONS_CONFIG.bounce,
                    delay: BUTTONS_CONFIG.cancelDelay + BUTTONS_CONFIG.staggerDelay,
                  }}
                  style={{ willChange: "transform, opacity" }}
                >
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    initial="rest"
                    animate="rest"
                    whileHover="hover"
                    variants={{
                      rest: { y: 0 },
                      hover: { y: BUTTONS_CONFIG.hoverY }
                    }}
                    transition={{
                      type: "spring",
                      bounce: BUTTONS_CONFIG.hoverBounce,
                      duration: BUTTONS_CONFIG.hoverDuration
                    }}
                    className="relative overflow-hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300 disabled:pointer-events-none disabled:opacity-50 bg-zinc-50 h-9 px-4 py-2 group"
                    style={{ willChange: "transform" }}
                  >
                    <motion.div
                      variants={{
                        rest: { 
                          opacity: 0, 
                          x: "-50%", 
                          y: "-50%", 
                          transition: { duration: BUTTONS_CONFIG.sphereRetractDuration },
                          transitionEnd: { scale: 0 }
                        },
                        hover: { scale: 1, opacity: 1, x: "-50%", y: "-50%", transition: { type: "spring", duration: BUTTONS_CONFIG.sphereDuration, bounce: 0 } }
                      }}
                      className={`absolute w-32 h-32 ${BUTTONS_CONFIG.sphereColor} rounded-full pointer-events-none`}
                      style={{ left: "50%", top: "100%" }}
                    />
                    <motion.span
                      variants={{
                        rest: { color: "#18181b", transition: { duration: BUTTONS_CONFIG.sphereRetractDuration } },
                        hover: { color: BUTTONS_CONFIG.continueTextHover, transition: { duration: 0.2 } }
                      }}
                      className="relative z-10"
                    >
                      Continue
                    </motion.span>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-zinc-50 text-zinc-900 rounded-md text-sm font-medium"
        >
          Open Dialog
        </button>
      )}

      {/* Blur Toggle Switch */}
      <div className="fixed bottom-12 flex items-center gap-3 text-sm text-zinc-400">
        <span>Blur Effect</span>
        <button
          onClick={() => setEnableBlur(!enableBlur)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-300 ${enableBlur ? 'bg-zinc-100' : 'bg-zinc-800'
            }`}
        >
          <span
            className={`inline-block h-3 w-3 transform rounded-full bg-[#09090b] transition-transform ${enableBlur ? 'translate-x-5' : 'translate-x-1'
              }`}
          />
        </button>
      </div>
    </div>
  );
}
