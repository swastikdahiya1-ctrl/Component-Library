import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WORDS = ["Design", "Code", "Ship", "Animate", "Build"];

export default function Typewriter() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const word = WORDS[index];

  return (
    <div className="w-full min-h-screen bg-black flex items-center justify-center font-sans">
      <h1 className="text-6xl md:text-8xl font-bold text-white flex items-center">
        <span className="mr-6 text-zinc-500">We love to</span>
        <span className="text-blue-500 inline-block relative h-[1.2em]">
          <AnimatePresence mode="wait">
            <motion.span
              key={word}
              className="absolute left-0 top-0 whitespace-nowrap"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
            >
              {word.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, display: 'none' }}
                  animate={{ opacity: 1, display: 'inline-block' }}
                  transition={{ delay: i * 0.1 }}
                >
                  {char}
                </motion.span>
              ))}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-1 md:w-2 h-[0.8em] bg-blue-500 inline-block ml-2 align-baseline"
              />
            </motion.span>
          </AnimatePresence>
        </span>
      </h1>
    </div>
  );
}
