import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TEXT = "SCATTER";

export default function SplitTextScatter() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#111] flex flex-col items-center justify-center font-sans">
      <p className="text-zinc-500 mb-8 uppercase tracking-widest text-sm">Hover over me</p>
      <div 
        className="flex"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {TEXT.split('').map((char, i) => {
          const randomX = (Math.random() - 0.5) * 300;
          const randomY = (Math.random() - 0.5) * 300;
          const randomRotate = (Math.random() - 0.5) * 360;
          return (
            <motion.span
              key={i}
              className="text-8xl md:text-9xl font-black text-white cursor-pointer drop-shadow-2xl"
              animate={{
                x: isHovered ? randomX : 0,
                y: isHovered ? randomY : 0,
                rotate: isHovered ? randomRotate : 0,
                opacity: isHovered ? 0.2 : 1,
                scale: isHovered ? Math.random() * 0.5 + 0.5 : 1
              }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
            >
              {char}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}
