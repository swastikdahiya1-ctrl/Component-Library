import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const springConfig = {
  type: "spring",
  bounce: 0.25,
  duration: 0.5,
};

const apps = [
  { id: 1, color: 'bg-blue-500', icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' }, // Mail like
  { id: 2, color: 'bg-green-500', icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' }, // Phone like
  { id: 3, color: 'bg-orange-500', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6' }, // Message
  { id: 4, color: 'bg-red-500', icon: 'M12 20V10M18 20V4M6 20v-4' }, // Music
  { id: 5, color: 'bg-indigo-500', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }, // Home
  { id: 6, color: 'bg-pink-500', icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 16v-4 M12 8h.01' }, // Safari
  { id: 7, color: 'bg-yellow-500', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' }, // Maps
  { id: 8, color: 'bg-teal-500', icon: 'M23 7l-7 5 7 5V7z M14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z' }, // Camera
  { id: 9, color: 'bg-purple-500', icon: 'M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' }, // Stocks
];

export default function IosAppFolder() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex items-center justify-center w-full min-h-[600px] bg-black relative font-sans selection:bg-transparent">
      {/* Background Wallpaper Simulation */}
      <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-indigo-900 via-black to-blue-900 pointer-events-none" />

      {/* Closed State Folder */}
      <div 
        className="flex flex-col items-center justify-center gap-2 cursor-pointer z-10"
        onClick={() => setIsOpen(true)}
      >
        <motion.div 
          layoutId="folder-container"
          className="w-[76px] h-[76px] bg-white/[0.15] backdrop-blur-xl rounded-[20px] p-2 flex flex-wrap gap-[4px] items-start justify-start content-start border border-white/[0.08] shadow-2xl"
          transition={springConfig}
          style={{ borderRadius: 20 }}
        >
          {apps.map(app => (
            <motion.div
              layoutId={`app-${app.id}`}
              key={app.id}
              className={`w-[16px] h-[16px] rounded-[4px] flex flex-col items-center justify-center ${app.color}`}
              transition={springConfig}
              style={{ borderRadius: 4 }}
            >
              {/* Very tiny fake UI inside the icons */}
            </motion.div>
          ))}
        </motion.div>
        <motion.span 
          layoutId="folder-label" 
          className="text-white text-[13px] font-medium tracking-wide drop-shadow-md"
          transition={springConfig}
        >
          Creator Studio
        </motion.span>
      </div>

      {/* Expanded Open State */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
            {/* Backdrop Blur */}
            <motion.div 
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-black/30"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Label floats above */}
            <motion.div
              className="relative z-10 mb-8 mt-12"
            >
              <motion.span 
                layoutId="folder-label" 
                className="text-white text-3xl font-semibold tracking-wide"
                transition={springConfig}
              >
                Creator Studio
              </motion.span>
            </motion.div>

            {/* Folder Container */}
            <motion.div 
              layoutId="folder-container"
              className="relative w-[340px] h-[340px] bg-white/[0.25] backdrop-blur-3xl p-6 flex flex-wrap gap-5 items-start justify-start content-start border border-white/[0.08] shadow-2xl"
              transition={springConfig}
              style={{ borderRadius: 44 }}
            >
              {apps.map(app => (
                <div key={app.id} className="flex flex-col items-center gap-1.5 cursor-pointer hover:scale-95 active:scale-90 transition-transform">
                  <motion.div
                    layoutId={`app-${app.id}`}
                    className={`w-[72px] h-[72px] rounded-[18px] shadow-sm flex items-center justify-center text-white/80 ${app.color}`}
                    transition={springConfig}
                    style={{ borderRadius: 18 }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 opacity-80">
                      <path d={app.icon} />
                    </svg>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
