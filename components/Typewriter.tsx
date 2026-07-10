import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WORDS = ["Games", "Websites", "Brands", "Experiences", "Apps"];

export default function Typewriter() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const word = WORDS[index];

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] flex items-center justify-center font-sans">
      <h1 className="text-5xl md:text-8xl font-bold text-white flex items-center tracking-tight">
        <span className="mr-4 md:mr-6 text-zinc-500">We build</span>
        <span className="text-white inline-flex items-center relative h-[1.2em]">
          <AnimatePresence mode="wait">
            <motion.span
              key={word}
              className="flex items-center whitespace-nowrap"
            >
              {word.split('').map((char, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ 
                    duration: 0.05, 
                    delay: i * 0.1, 
                    exit: { delay: (word.length - i - 1) * 0.05, duration: 0.05 } 
                  }}
                  className="overflow-hidden"
                >
                  {char}
                </motion.span>
              ))}
            </motion.span>
          </AnimatePresence>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
            className="w-[3px] md:w-[5px] h-[0.9em] bg-white inline-block ml-1 rounded-full flex-shrink-0"
          />
        </span>
      </h1>
    </div>
  );
}
