import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success';

export default function MorphingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');

  // Handle loading and success states
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (status === 'loading') {
      timeout = setTimeout(() => {
        setStatus('success');
      }, 1500); 
    } else if (status === 'success') {
      timeout = setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
      }, 4000); 
    }
    return () => clearTimeout(timeout);
  }, [status]);

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#1c1d21] flex items-center justify-center font-sans text-white p-4">
      
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={status === 'idle' ? handleCancel : undefined}
          />
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="relative w-full max-w-md">
        
        {/* Invisible Spacer ensures the relative container is exactly the size of the open modal.
            This gives the absolute action row a perfectly stable box to sit inside. */}
        <div className="w-full p-6 opacity-0 pointer-events-none select-none invisible">
          <div className="flex items-center gap-2 mb-4">
            <Trash2 className="w-[22px] h-[22px]" />
            <h2 className="text-xl font-semibold">Delete Item</h2>
          </div>
          <p className="mb-8 font-medium">
            Are you sure you want to permanently delete this item? This action cannot be undone.
          </p>
          <div className="h-12 w-full"></div>
        </div>

        {/* The Modal Background & Text (Slides up behind the button) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute inset-0 z-40 bg-[#0a0c0b] rounded-[28px] p-6 shadow-2xl border border-white/5 pointer-events-none"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pointer-events-auto">
                <div className="flex items-center gap-2 text-zinc-100">
                  <Trash2 className="w-[22px] h-[22px] text-red-500" />
                  <h2 className="text-xl font-semibold">Delete Item</h2>
                </div>
                <button 
                  onClick={status === 'idle' ? handleCancel : undefined}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <p className="text-zinc-400 mb-8 font-medium">
                Are you sure you want to permanently delete this item? This action cannot be undone.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Action Row (ALWAYS rendered, NEVER moves vertically) */}
        <div className="absolute bottom-6 left-6 right-6 h-12 flex justify-end gap-3 z-50 pointer-events-none">
          
          {/* Cancel Button */}
          <AnimatePresence>
            {isOpen && status === 'idle' && (
              <motion.button
                // Use fixed width of 104px instead of 'auto' to prevent snapping!
                initial={{ opacity: 0, scale: 0.9, width: 0, paddingLeft: 0, paddingRight: 0 }}
                animate={{ opacity: 1, scale: 1, width: 104, paddingLeft: 24, paddingRight: 24 }}
                exit={{ opacity: 0, scale: 0.9, width: 0, paddingLeft: 0, paddingRight: 0 }}
                onClick={handleCancel}
                className="pointer-events-auto h-full rounded-full bg-[#1b1c22] text-zinc-300 font-medium whitespace-nowrap overflow-hidden hover:bg-zinc-800"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              >
                Cancel
              </motion.button>
            )}
          </AnimatePresence>

          {/* The SINGLE Delete Button */}
          <motion.button
            layout // Smoothly morphs width when Cancel button pushes it or when shrinking to circle
            disabled={status !== 'idle' && isOpen}
            onClick={() => {
              if (!isOpen) setIsOpen(true);
              else if (status === 'idle') setStatus('loading');
            }}
            className={`pointer-events-auto h-full bg-red-500 rounded-full text-white font-medium flex items-center justify-center relative overflow-hidden ${
              status === 'idle' ? 'flex-1' : 'w-12' // Automatically takes w-full when Cancel is gone!
            }`}
            // Removed whileHover and whileTap because they cause the button to snap back to scale: 1 when status changes!
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          >
            {/* Using standard AnimatePresence without mode="wait" to prevent layout stalling */}
            <AnimatePresence>
              {(!isOpen || status === 'idle') && (
                <motion.div 
                  key="text"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="whitespace-nowrap">Delete</span>
                </motion.div>
              )}
              {status === 'loading' && (
                <motion.svg
                  key="loading"
                  className="w-6 h-6 absolute"
                  viewBox="0 0 24 24"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 270 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ 
                    opacity: { duration: 0.2 },
                    rotate: { duration: 1.5, ease: "linear" } 
                  }}
                >
                  <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="3" />
                  <motion.circle
                    cx="12" cy="12" r="10" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="62.83"
                    initial={{ strokeDashoffset: 62.83 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                </motion.svg>
              )}
              {status === 'success' && (
                <motion.div
                  key="success"
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <motion.path
                      d="M5 13l4 4L19 7"
                      fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
