import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MENU = [
  { id: 1, title: 'Products', content: 'We offer a wide variety of amazing products.' },
  { id: 2, title: 'Solutions', content: 'Tailored solutions for your business.' },
  { id: 3, title: 'Developers', content: 'API docs, guides, and community.' },
  { id: 4, title: 'Company', content: 'About us, careers, and legal.' },
];

export default function MegaMenu() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] flex items-start justify-center pt-32 font-sans relative">
      <div 
        className="flex gap-2 p-2 bg-zinc-900/50 backdrop-blur-md rounded-full border border-white/10 relative"
        onMouseLeave={() => setHovered(null)}
      >
        {MENU.map(item => (
          <div 
            key={item.id}
            onMouseEnter={() => setHovered(item.id)}
            className="px-6 py-2 text-sm text-zinc-300 hover:text-white cursor-pointer transition-colors relative z-10"
          >
            {item.title}
          </div>
        ))}

        <AnimatePresence>
          {hovered !== null && (
            <motion.div
              layoutId="mega-menu-bg"
              className="absolute left-0 top-full mt-4 bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            >
              <div className="w-[300px] p-6 text-zinc-300">
                <motion.h3 
                  key={`title-${hovered}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-semibold text-white mb-2"
                >
                  {MENU.find(i => i.id === hovered)?.title}
                </motion.h3>
                <motion.p
                  key={`content-${hovered}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  {MENU.find(i => i.id === hovered)?.content}
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
