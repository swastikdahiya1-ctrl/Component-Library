import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NumberPriceSwitcher() {
  const [isYearly, setIsYearly] = useState(false);
  const price = isYearly ? "99" : "19";

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center font-sans gap-12">
      <div className="flex bg-zinc-900 rounded-full p-1.5 border border-white/5 relative shadow-xl">
        <motion.div 
          className="absolute inset-y-1.5 w-1/2 bg-white rounded-full z-0"
          animate={{ x: isYearly ? "100%" : "0%" }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
        />
        <button 
          onClick={() => setIsYearly(false)}
          className={`px-8 py-3 rounded-full text-sm transition-colors relative z-10 ${!isYearly ? 'text-black font-semibold' : 'text-zinc-400 hover:text-white'}`}
        >
          Monthly
        </button>
        <button 
          onClick={() => setIsYearly(true)}
          className={`px-8 py-3 rounded-full text-sm transition-colors relative z-10 ${isYearly ? 'text-black font-semibold' : 'text-zinc-400 hover:text-white'}`}
        >
          Yearly
        </button>
      </div>

      <div className="flex text-[120px] font-bold text-white tracking-tighter">
        <span className="text-zinc-500 mr-2">$</span>
        <div className="flex h-[1.1em] overflow-hidden relative leading-none">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={price}
              initial={{ y: isYearly ? 120 : -120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: isYearly ? -120 : 120, opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            >
              {price}
            </motion.span>
          </AnimatePresence>
        </div>
        <span className="text-2xl text-zinc-600 font-medium self-end mb-8 ml-2">/mo</span>
      </div>
    </div>
  );
}
