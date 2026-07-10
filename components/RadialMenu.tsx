import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Home, Heart, Star, Share2, Settings, Search } from 'lucide-react';

// ============================================================================
// ANIMATION CONFIGURATION
// ============================================================================
export const ANIMATION_CONFIG = {
  radius: 110, // Pixels from center to orbital items
  spring: { type: "spring", bounce: 0.4, duration: 0.6 },
  staggerDelay: 0.04, // Delay between each item popping out
};

// 6 items, spaced exactly 60 degrees apart starting from top (-90 deg)
const MENU_ITEMS = [
  { icon: <Home className="w-6 h-6 text-white" strokeWidth={2} />, color: "bg-blue-500", angle: -90 },
  { icon: <Heart className="w-6 h-6 text-white" strokeWidth={2} />, color: "bg-pink-500", angle: -30 },
  { icon: <Star className="w-6 h-6 text-white" strokeWidth={2} />, color: "bg-amber-500", angle: 30 },
  { icon: <Share2 className="w-6 h-6 text-white" strokeWidth={2} />, color: "bg-emerald-500", angle: 90 },
  { icon: <Settings className="w-6 h-6 text-white" strokeWidth={2} />, color: "bg-indigo-500", angle: 150 },
  { icon: <Search className="w-6 h-6 text-white" strokeWidth={2} />, color: "bg-purple-500", angle: 210 },
];
// ============================================================================

export default function RadialMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black font-sans relative overflow-hidden">
      
      {/* Container to center the absolute positioning math */}
      <div className="relative flex items-center justify-center w-64 h-64">
        
        {/* Child Items */}
        <AnimatePresence>
          {isOpen && MENU_ITEMS.map((item, index) => {
            // Convert degrees to radians for trigonometric calculation
            const rad = item.angle * (Math.PI / 180);
            
            // Calculate orbital coordinates
            const targetX = Math.cos(rad) * ANIMATION_CONFIG.radius;
            const targetY = Math.sin(rad) * ANIMATION_CONFIG.radius;

            // Hover state: 10% further out in the same trajectory
            const hoverX = targetX * 1.1;
            const hoverY = targetY * 1.1;

            return (
              <motion.button
                key={index}
                initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                animate={{ 
                  x: targetX, 
                  y: targetY, 
                  scale: 1, 
                  opacity: 1,
                  transition: {
                    ...ANIMATION_CONFIG.spring,
                    delay: index * ANIMATION_CONFIG.staggerDelay // Clockwise stagger on open
                  }
                }}
                exit={{ 
                  x: 0, 
                  y: 0, 
                  scale: 0, 
                  opacity: 0,
                  transition: {
                    ...ANIMATION_CONFIG.spring,
                    delay: 0 // Retract all at once on close
                  }
                }}
                whileHover={{ 
                  x: hoverX, 
                  y: hoverY, 
                  scale: 1.05, 
                  transition: { type: "spring", bounce: 0.5, duration: 0.4 } 
                }}
                className={`absolute flex items-center justify-center w-14 h-14 rounded-full shadow-2xl ${item.color} z-10 outline-none`}
              >
                {item.icon}
              </motion.button>
            );
          })}
        </AnimatePresence>

        {/* Center Trigger Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute z-20 flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-2xl outline-none"
        >
          <motion.div
            // Rotate 135 degrees to cleanly spin a '+' into an 'x'
            animate={{ rotate: isOpen ? 135 : 0 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
          >
            <Plus className="w-8 h-8 text-black" strokeWidth={2.5} />
          </motion.div>
        </motion.button>

      </div>
    </div>
  );
}
