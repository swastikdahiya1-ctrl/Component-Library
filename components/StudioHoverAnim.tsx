import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TEXT = "STUDIO";

export default function StudioHoverAnim() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#FDFDFD] flex items-center justify-center font-sans overflow-hidden">
      <div 
        className="flex cursor-pointer text-8xl md:text-[150px] font-black uppercase tracking-tighter"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {TEXT.split('').map((char, i) => (
          <div key={i} className="overflow-hidden relative inline-block">
            {/* Top Text - Exits upwards, turns green, and fades out */}
            <motion.span
              className="inline-block origin-bottom leading-[0.8]"
              animate={isHovered ? "hovered" : "initial"}
              variants={{
                initial: { 
                  y: "0%", 
                  color: "#000000",
                  opacity: 1
                },
                hovered: {
                  y: "-100%",
                  color: "#10b981",
                  opacity: 0
                }
              }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.04
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>

            {/* Bottom Text - Enters from below starting green, fades in, and settles to black */}
            <motion.span
              className="absolute left-0 top-0 inline-block origin-bottom leading-[0.8]"
              animate={isHovered ? "hovered" : "initial"}
              variants={{
                initial: { 
                  y: "100%", 
                  color: "#10b981",
                  opacity: 0
                },
                hovered: {
                  y: "0%",
                  color: "#000000",
                  opacity: 1
                }
              }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.04
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          </div>
        ))}
      </div>
    </div>
  );
}
