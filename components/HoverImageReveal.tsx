import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useVelocity, useTransform, AnimatePresence } from 'framer-motion';

const LOCATIONS = [
  { id: '01', title: 'TOKYO', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop' },
  { id: '02', title: 'AMSTERDAM', image: 'https://images.unsplash.com/photo-1517736996303-4eec4a66bb17?q=80&w=800&auto=format&fit=crop' },
  { id: '03', title: 'LONDON', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop' },
];

export default function HoverImageReveal() {
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth drag delay (gives it that heavy, viscous feel)
  const springX = useSpring(mouseX, { damping: 25, stiffness: 150, mass: 0.5 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 150, mass: 0.5 });

  // Velocity skew logic
  // useVelocity mathematically derives the speed of the springX value
  const velocityX = useVelocity(springX);
  
  // Increased sensitivity by 10%+ by narrowing input range and widening output skew
  const skewX = useTransform(velocityX, [-2500, 2500], [18, -18]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleMouseEnter = (title: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveLocation(title);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // 50ms grace period prevents the box from collapsing when moving between adjacent text links
    timeoutRef.current = setTimeout(() => {
      setActiveLocation(null);
    }, 50);
  };

  const activeImage = LOCATIONS.find(loc => loc.title === activeLocation)?.image;
  
  // Keep track of the last active image so it stays rendered while the container wipes closed
  const lastImageRef = useRef(activeImage);
  if (activeImage) {
    lastImageRef.current = activeImage;
  }
  const displayImage = activeImage || lastImageRef.current;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-sans text-white relative overflow-hidden">
      
      {/* 
        List of text items 
      */}
      <div className="flex flex-col gap-6 z-10 relative pointer-events-auto">
        {LOCATIONS.map((loc) => (
          <div 
            key={loc.id}
            className="flex items-center gap-6 cursor-pointer group"
            onMouseEnter={() => handleMouseEnter(loc.title)}
            onMouseLeave={handleMouseLeave}
          >
            <span className="text-zinc-500 text-6xl font-light font-mono transition-colors duration-300 group-hover:text-zinc-300">
              {loc.id}
            </span>
            <span className="text-8xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-zinc-200">
              {loc.title}
            </span>
          </div>
        ))}
      </div>

      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-30 overflow-hidden"
        style={{
          x: springX,
          y: springY,
          translateX: "20%", // Offset so it hangs down and to the right of the cursor
          translateY: "-20%",
          width: 450,
          skewX, // Apply the mapped velocity skew!
          transformOrigin: "top center", // Ensures height clips from top down
        }}
        initial={{ height: 0 }}
        animate={{ height: activeLocation ? 320 : 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <AnimatePresence mode="wait">
          {displayImage && (
            <motion.img
              key={displayImage}
              src={displayImage}
              alt="Location"
              className="absolute inset-0 w-full h-full object-cover grayscale"
              initial={{ scale: 1.6 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }} 
            />
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}
