import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

// Advanced spring physics for organic, viscous movement
const SPRING_CONFIG = { damping: 20, stiffness: 300, mass: 0.5 };

export default function MagneticCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Motion values for the custom cursor
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorWidth = useMotionValue(16);
  const cursorHeight = useMotionValue(16);
  const cursorRadius = useMotionValue(100);
  
  // Smooth springs applied to motion values
  const springX = useSpring(cursorX, SPRING_CONFIG);
  const springY = useSpring(cursorY, SPRING_CONFIG);
  const springWidth = useSpring(cursorWidth, SPRING_CONFIG);
  const springHeight = useSpring(cursorHeight, SPRING_CONFIG);
  const springRadius = useSpring(cursorRadius, SPRING_CONFIG);

  // Parallax translation for the text
  const textX = useMotionValue(0);
  const textY = useMotionValue(0);
  const springTextX = useSpring(textX, SPRING_CONFIG);
  const springTextY = useSpring(textY, SPRING_CONFIG);

  // Continuous mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isHovered && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        // Since the text itself is shifting around, we want the magnetic center 
        // to be based on the original un-shifted bounding box. 
        // However, using the dynamic bounding box adds a crazy cool fluid feedback loop!
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        
        // Background magnet (15% pull)
        cursorX.set(centerX + distanceX * 0.15);
        cursorY.set(centerY + distanceY * 0.15);
        
        // Text magnet (20% pull - creates 3D depth against background)
        textX.set(distanceX * 0.2);
        textY.set(distanceY * 0.2);
      } else {
        // Normal cursor follow
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered]);

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsHovered(true);
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      
      // Snap to morph shape immediately
      cursorX.set(centerX + distanceX * 0.15);
      cursorY.set(centerY + distanceY * 0.15);
      cursorWidth.set(rect.width);
      cursorHeight.set(rect.height);
      cursorRadius.set(12); // Round pill edges
      
      textX.set(distanceX * 0.2);
      textY.set(distanceY * 0.2);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    setIsHovered(false);
    
    // Snap back to dot
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    cursorWidth.set(16);
    cursorHeight.set(16);
    cursorRadius.set(100);
    
    // Reset text position
    textX.set(0);
    textY.set(0);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center cursor-none overflow-hidden relative">
      
      {/* The Target Button */}
      <motion.button
        ref={buttonRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ x: springTextX, y: springTextY }}
        className="flex items-center gap-1 text-blue-600 font-medium text-[22px] relative z-20 outline-none cursor-none px-6 py-3 tracking-wide"
      >
        <ChevronLeft className="w-7 h-7" strokeWidth={2.5} />
        Appearance
      </motion.button>

      {/* The Custom Morphing Cursor */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          width: springWidth,
          height: springHeight,
          borderRadius: springRadius,
          translateX: "-50%", // Keep origin perfectly centered at all times
          translateY: "-50%",
        }}
        className="fixed top-0 left-0 bg-white z-10 pointer-events-none"
      />
      
    </div>
  );
}
