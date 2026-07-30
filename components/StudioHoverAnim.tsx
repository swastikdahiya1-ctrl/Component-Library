import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ROWS = [
  "NEW STUDIO",
  "NEW WEBSITE",
  "COOL ANIMATION",
  "OPINIONS?"
];

function HoverRow({ text }: { text: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="flex items-center cursor-pointer text-3xl sm:text-4xl md:text-5xl lg:text-[70px] font-normal uppercase tracking-tighter"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Pixelated Arrow */}
      <div className="mr-4 md:mr-8 flex items-center justify-center overflow-hidden translate-y-[5%]">
        <motion.div
          className="flex items-center justify-center text-black"
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "0%" : "-100%" }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <svg width="1.12em" height="1.12em" viewBox="0 0 24 24" fill="currentColor">
            {/* Stem */}
            <rect x="2" y="11" width="14" height="2" />
            {/* Center pixel of arrow head */}
            <rect x="16" y="11" width="2" height="2" />
            {/* Top diagonal */}
            <rect x="14" y="9" width="2" height="2" />
            <rect x="12" y="7" width="2" height="2" />
            {/* Bottom diagonal */}
            <rect x="14" y="13" width="2" height="2" />
            <rect x="12" y="15" width="2" height="2" />
          </svg>
        </motion.div>
      </div>

      {/* Text Characters */}
      <div className="flex">
        {text.split('').map((char, i) => (
          <div key={i} className="relative inline-block" style={{ clipPath: "inset(0 -20px 0 -20px)" }}>
            {/* Top Text - Exits completely out of bounds */}
            <motion.span
              className="inline-block origin-bottom leading-[0.8]"
              animate={isHovered ? "hovered" : "initial"}
              variants={{
                initial: { 
                  y: "0%", 
                  color: "#000000",
                },
                hovered: {
                  y: "-120%", 
                  color: "#ccff00",
                }
              }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.025
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>

            {/* Bottom Text - Starts completely out of bounds from below */}
            <motion.span
              className="absolute left-0 top-0 inline-block origin-bottom leading-[0.8]"
              animate={isHovered ? "hovered" : "initial"}
              variants={{
                initial: { 
                  y: "120%", 
                  color: "#ccff00",
                },
                hovered: {
                  y: "0%",
                  color: "#000000",
                }
              }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.025
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

export default function StudioHoverAnim() {
  return (
    <div className="w-full min-h-screen bg-[#FDFDFD] flex flex-col items-start justify-center font-sans overflow-hidden px-6 md:px-24 py-20">
      <div className="flex flex-col gap-2 md:gap-4">
        {ROWS.map((text, i) => (
          <HoverRow key={i} text={text} />
        ))}
      </div>
    </div>
  );
}
