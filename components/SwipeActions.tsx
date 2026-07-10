import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Archive, Trash2 } from 'lucide-react';

export default function SwipeActions() {
  const x = useMotionValue(0);

  return (
    <div className="w-full min-h-screen bg-[#121212] flex items-center justify-center p-4 font-sans overflow-hidden">
      <div className="w-full max-w-md relative rounded-2xl overflow-hidden bg-red-500 shadow-2xl">
        <div className="absolute inset-0 flex justify-between px-6 items-center">
           <div className="flex items-center gap-2 text-white font-medium">
             <Archive className="w-5 h-5" /> Archive
           </div>
           <div className="flex items-center gap-2 text-white font-medium">
             Delete <Trash2 className="w-5 h-5" />
           </div>
        </div>

        <motion.div 
          className="relative bg-zinc-900 border border-white/5 p-6 rounded-2xl z-10 flex items-center gap-4 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.4}
          onDragEnd={(e, info) => {
             // Let Framer Motion snap it back to 0 natively
          }}
          style={{ x }}
        >
          <div className="w-12 h-12 bg-white/10 rounded-full" />
          <div className="flex-1">
            <h3 className="text-white font-medium text-lg">Swipe me left or right</h3>
            <p className="text-zinc-400">Reveal hidden actions underneath</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
