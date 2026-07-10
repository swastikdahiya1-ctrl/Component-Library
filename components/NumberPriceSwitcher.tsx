import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NumberPriceSwitcher() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center font-sans gap-12">
      <div className="flex bg-zinc-900 rounded-full p-1.5 border border-white/10 relative shadow-xl">
        <motion.div 
          className="absolute inset-y-1.5 w-[calc(50%-6px)] bg-white rounded-full z-0"
          animate={{ x: isYearly ? "100%" : "0%" }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
          style={{ left: "6px" }}
        />
        <button 
          onClick={() => setIsYearly(false)}
          className={`w-32 py-2.5 rounded-full text-sm transition-colors relative z-10 font-semibold ${!isYearly ? 'text-black' : 'text-zinc-400 hover:text-white'}`}
        >
          Monthly
        </button>
        <button 
          onClick={() => setIsYearly(true)}
          className={`w-32 py-2.5 rounded-full text-sm transition-colors relative z-10 font-semibold ${isYearly ? 'text-black' : 'text-zinc-400 hover:text-white'}`}
        >
          Yearly
        </button>
      </div>

      <div className="flex text-[120px] font-bold text-white tracking-tighter items-start">
        <span className="text-zinc-500 mr-2 mt-5 text-6xl">$</span>
        <div className="flex h-[1.1em] overflow-hidden relative leading-none">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={isYearly ? "yearly" : "monthly"}
              initial={{ y: isYearly ? 120 : -120, opacity: 0, filter: "blur(4px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: isYearly ? -120 : 120, opacity: 0, filter: "blur(4px)" }}
              transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              className="flex"
            >
              {isYearly ? "99" : "19"}
            </motion.div>
          </AnimatePresence>
        </div>
        <span className="text-2xl text-zinc-600 font-medium self-end mb-8 ml-2">/mo</span>
      </div>
    </div>
  );
}
