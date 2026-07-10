import React, { useRef } from 'react';
import { motion } from 'framer-motion';

export default function AppleWatchHome() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ICONS = Array.from({ length: 36 }).map((_, i) => i);

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] flex items-center justify-center font-sans overflow-hidden">
      <div className="w-[300px] h-[360px] bg-zinc-900 rounded-[48px] overflow-hidden relative shadow-[0_0_0_8px_#111,0_20px_40px_rgba(0,0,0,0.8)] border border-white/5" ref={containerRef}>
        <motion.div 
          className="absolute w-[600px] h-[600px] grid grid-cols-6 gap-3 p-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          drag
          dragConstraints={containerRef}
          whileTap={{ cursor: "grabbing" }}
          style={{ cursor: "grab" }}
        >
          {ICONS.map((id) => (
            <motion.div
              key={id}
              className="w-16 h-16 bg-white/10 rounded-full flex-shrink-0 flex items-center justify-center text-white/30 text-xs shadow-inner"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              App {id}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
