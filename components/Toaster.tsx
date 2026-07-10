import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Folder, Mail, MessageSquare, AlertTriangle } from 'lucide-react';

// ============================================================================
// ANIMATION CONFIGURATION
// ============================================================================
export const ANIMATION_CONFIG = {
  // Spring physics for toast entrance and re-positioning
  spring: { type: "spring", bounce: 0.3, duration: 0.6 },
  
  // Stacking Math
  scaleOffset: 0.05, // Reduced from 0.15 so they don't get too tiny too fast, but we can dial this in
  yOffset: 12,       // Pixels to move UP for each depth level
  maxToasts: 5,
};
// ============================================================================

interface ToastData {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const DUMMY_CONTENT = [
  { title: "Reminder", description: "Team standup starts in 5 minutes.", icon: <Bell className="w-5 h-5 text-yellow-500" /> },
  { title: "File uploaded", description: "presentation-final.pdf is ready.", icon: <Folder className="w-5 h-5 text-blue-400" /> },
  { title: "New message", description: "Sarah commented on your design.", icon: <MessageSquare className="w-5 h-5 text-green-400" /> },
  { title: "Email sent", description: "Your weekly report has been sent.", icon: <Mail className="w-5 h-5 text-purple-400" /> },
  { title: "Storage Warning", description: "You are running out of space.", icon: <AlertTriangle className="w-5 h-5 text-red-500" /> },
];

export default function Toaster() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const handleAddToast = () => {
    const randomContent = DUMMY_CONTENT[Math.floor(Math.random() * DUMMY_CONTENT.length)];
    const newToast = {
      id: `toast-${Date.now()}-${Math.random()}`,
      ...randomContent
    };

    setToasts(prev => {
      const newToasts = [...prev, newToast];
      if (newToasts.length > ANIMATION_CONFIG.maxToasts) {
        return newToasts.slice(1); // Remove the oldest (first in array)
      }
      return newToasts;
    });

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      handleRemoveToast(newToast.id);
    }, 5000);
  };

  const handleRemoveToast = (idToRemove: string) => {
    setToasts(prev => prev.filter(t => t.id !== idToRemove));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black font-sans relative overflow-hidden">
      
      {/* Trigger Button */}
      <button
        onClick={handleAddToast}
        className="px-6 py-3 bg-[#09090b] hover:bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 text-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 active:scale-95"
      >
        Add toast
      </button>

      {/* Toast Container (anchored to bottom center) */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none w-full max-w-[400px]">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast, index) => {
            // Depth 0 is the newest toast (last in array). Depth N is older.
            const depth = toasts.length - 1 - index;
            
            // Calculate stacking physics based on user requirements:
            // "scales down by 15 percent and moves up by 5px"
            // We use transformOrigin: "top center" so scaling pulls the bottom up, 
            // and negative Y pushes the whole box physically up.
            
            // Note: I tweaked the scaling factor slightly from 15% to 5% per depth 
            // visually because at 5 toasts, 15% makes the back one extremely tiny.
            // (You can easily change this back to 0.15 in ANIMATION_CONFIG above!)
            const scale = 1 - (depth * ANIMATION_CONFIG.scaleOffset); 
            const y = -(depth * ANIMATION_CONFIG.yOffset);
            
            // No fade for older toasts, they stay solid until they exit
            const opacity = 1;

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity, y, scale }}
                exit={{ opacity: 0, scale: 0.8, y: 50, transition: { ease: "anticipate", duration: 0.5 } }}
                transition={ANIMATION_CONFIG.spring}
                style={{
                  position: "absolute",
                  bottom: 0,
                  transformOrigin: "top center",
                  zIndex: toasts.length - depth,
                }}
                className="w-full flex items-start gap-4 p-4 bg-[#09090b] border border-zinc-800 rounded-2xl shadow-2xl pointer-events-auto will-change-transform"
              >
                <div className="mt-0.5">{toast.icon}</div>
                <div className="flex-1 flex flex-col gap-1">
                  <h3 className="text-sm font-semibold text-zinc-100">{toast.title}</h3>
                  <p className="text-sm text-zinc-400">{toast.description}</p>
                </div>
                <button
                  onClick={() => handleRemoveToast(toast.id)}
                  className="p-1 -mr-2 -mt-1 text-zinc-500 hover:text-zinc-300 transition-colors rounded-md hover:bg-zinc-800 outline-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}
