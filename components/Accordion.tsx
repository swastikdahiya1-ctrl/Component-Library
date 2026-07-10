import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MousePointer2, Sparkles, Sprout, Waves, LineChart } from 'lucide-react';

// ============================================================================
// ANIMATION CONFIGURATION
// ============================================================================
export const ANIMATION_CONFIG = {
  // Bouncy physics for the boxes splitting and morphing
  bouncy: { type: "spring", bounce: 0.35, duration: 0.6 },
  // Smooth physics for the content expanding so the text doesn't wobble
  smooth: { type: "spring", bounce: 0, duration: 0.4 },
};
// ============================================================================

const ACCORDION_DATA = [
  {
    title: "What is interaction design?",
    content: "Interaction design focuses on creating engaging interfaces with well thought out behaviors. Understanding how users and technology communicate with each other is fundamental to this field.",
    icon: <MousePointer2 className="w-5 h-5 text-zinc-400" />
  },
  {
    title: "Why motion matters?",
    content: "Motion design helps orient users, provides feedback, and brings your interface to life. It bridges the gap between static screens and the dynamic physical world we live in.",
    icon: <Sparkles className="w-5 h-5 text-zinc-400" />
  },
  {
    title: "Why we create?",
    content: "A collection of methods and ideas that bring clarity and emotion to complex interfaces. We create to solve problems and make digital spaces feel more human.",
    icon: <Sprout className="w-5 h-5 text-zinc-400" />
  },
  {
    title: "What drives interaction?",
    content: "User needs, psychological principles, and technological constraints drive interaction design. The best interactions feel completely invisible and natural to the user.",
    icon: <Waves className="w-5 h-5 text-zinc-400" />
  },
  {
    title: "How ideas grow?",
    content: "Ideas grow through iteration, prototyping, and continuous user testing. What starts as a simple sketch evolves into a robust system through rigorous refinement.",
    icon: <LineChart className="w-5 h-5 text-zinc-400" />
  }
];

const getItemStyle = (index: number, activeIndex: number | null, totalItems: number) => {
  // ALWAYS use 4 values so the interpolation engine doesn't crash/snap
  let borderRadius = "0px 0px 0px 0px";
  // We only use marginBottom for spacing, keeping marginTop 0 to avoid double-gaps
  let marginBottom = "-1px"; 

  if (activeIndex === null) {
    if (index === 0 && index === totalItems - 1) borderRadius = "16px 16px 16px 16px";
    else if (index === 0) borderRadius = "16px 16px 0px 0px";
    else if (index === totalItems - 1) borderRadius = "0px 0px 16px 16px";
    
    if (index === totalItems - 1) marginBottom = "0px";
  } else if (index === activeIndex) {
    borderRadius = "16px 16px 16px 16px";
    marginBottom = "12px";
  } else if (index < activeIndex) {
    if (index === 0 && index === activeIndex - 1) borderRadius = "16px 16px 16px 16px";
    else if (index === 0) borderRadius = "16px 16px 0px 0px";
    else if (index === activeIndex - 1) borderRadius = "0px 0px 16px 16px";
    
    if (index === activeIndex - 1) marginBottom = "12px";
  } else if (index > activeIndex) {
    if (index === activeIndex + 1 && index === totalItems - 1) borderRadius = "16px 16px 16px 16px";
    else if (index === activeIndex + 1) borderRadius = "16px 16px 0px 0px";
    else if (index === totalItems - 1) borderRadius = "0px 0px 16px 16px";
    
    if (index === totalItems - 1) marginBottom = "0px";
  }

  return { borderRadius, marginBottom };
};

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setActiveIndex(prev => prev === index ? null : index);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-black font-sans pb-32">
      <div className="w-full max-w-[440px] flex flex-col">
        {ACCORDION_DATA.map((item, index) => {
          const isActive = activeIndex === index;
          const { borderRadius, marginBottom } = getItemStyle(index, activeIndex, ACCORDION_DATA.length);

          return (
            <motion.div
              key={index}
              initial={false}
              animate={{ borderRadius, marginBottom }}
              transition={ANIMATION_CONFIG.bouncy}
              style={{
                border: "1px solid #27272a", // zinc-800
                zIndex: isActive ? 10 : 0 // Ensure the active item overlaps correctly
              }}
              className="bg-[#09090b] overflow-hidden relative"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between p-5 text-left outline-none"
              >
                <div className="flex items-center gap-4">
                  {item.icon}
                  <span className="text-zinc-100 font-semibold text-[15px]">
                    {item.title}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isActive ? 180 : 0 }}
                  transition={ANIMATION_CONFIG.bouncy}
                >
                  <ChevronDown className="w-5 h-5 text-zinc-500" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={ANIMATION_CONFIG.smooth}
                  >
                    <div className="px-5 pb-5 pt-1 text-[14px] leading-relaxed text-zinc-400">
                      {item.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
