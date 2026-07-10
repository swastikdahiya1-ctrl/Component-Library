import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useVelocity, useTransform, AnimatePresence } from 'framer-motion';

const ITEMS = [
  { id: 1, title: 'Architecture', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80' },
  { id: 2, title: 'Minimalism', img: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=800&q=80' },
  { id: 3, title: 'Industrial', img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80' },
];

export default function CustomContentCursor() {
  const [hovered, setHovered] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { damping: 20, stiffness: 150, mass: 0.5 });
  const smoothY = useSpring(mouseY, { damping: 20, stiffness: 150, mass: 0.5 });

  const velocityX = useVelocity(smoothX);
  const skewX = useTransform(velocityX, [-1000, 1000], [15, -15]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden font-sans">
      <div className="flex flex-col gap-8 z-10 text-center">
        {ITEMS.map((item) => (
          <h1 
            key={item.id}
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
            className="text-7xl font-bold text-white/20 hover:text-white transition-colors duration-500 cursor-pointer"
          >
            {item.title}
          </h1>
        ))}
      </div>

      <motion.div
        className="absolute top-0 left-0 w-72 h-96 rounded-2xl overflow-hidden pointer-events-none shadow-2xl"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          skewX: skewX,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: hovered !== null ? 1 : 0, 
          opacity: hovered !== null ? 1 : 0,
          transformOrigin: 'top center'
        }}
        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
      >
        <AnimatePresence mode="popLayout">
          {hovered !== null && (
            <motion.img
              key={hovered}
              src={ITEMS.find(i => i.id === hovered)?.img}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
