import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TEXT = "SCATTER";

export default function SplitTextScatter() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#111] flex flex-col items-center justify-center font-sans overflow-hidden">
      <p className="text-zinc-500 mb-12 uppercase tracking-[0.2em] text-sm font-semibold">Hover over the text</p>
      <div 
        className="flex"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {TEXT.split('').map((char, i) => {
          const randomX = (Math.random() - 0.5) * 400;
          const randomY = (Math.random() - 0.5) * 400;
          const randomRotate = (Math.random() - 0.5) * 360;
          return (
            <motion.span
              key={i}
              className="text-[120px] md:text-[180px] font-black text-white cursor-pointer inline-block"
              style={{ originX: 0.5, originY: 0.5 }}
              animate={{
                x: isHovered ? randomX : 0,
                y: isHovered ? randomY : 0,
                rotate: isHovered ? randomRotate : 0,
                opacity: isHovered ? 0 : 1,
                scale: isHovered ? Math.random() * 0.5 + 0.5 : 1
              }}
              transition={{ 
                type: "spring", 
                bounce: 0.6, 
                damping: 10,
                stiffness: 100,
                mass: 1 
              }}
            >
              {char}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}
