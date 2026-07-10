import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Sun } from 'lucide-react';

export default function IosSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // 0 is top, 200 is bottom (empty)
  const y = useMotionValue(100);
  const height = useTransform(y, [0, 200], ["100%", "0%"]);

  return (
    <div className="w-full min-h-screen bg-[#121212] flex items-center justify-center font-sans">
      <motion.div 
        ref={containerRef}
        className="w-24 h-64 bg-zinc-800 rounded-[48px] relative overflow-hidden flex items-end shadow-2xl cursor-grab active:cursor-grabbing border border-white/5"
        animate={{ scale: isDragging ? 0.95 : 1 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.4 }}
      >
        <motion.div 
          className="absolute bottom-0 left-0 right-0 bg-white"
          style={{ height }}
        />
        
        <motion.div
          className="absolute inset-0 z-10"
          drag="y"
          dragConstraints={{ top: 0, bottom: 200 }}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          style={{ y }}
        />

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-0 pointer-events-none text-black mix-blend-difference">
          <Sun className="w-8 h-8 opacity-80" />
        </div>
      </motion.div>
    </div>
  );
}
