import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// ANIMATION CONFIGURATION
// ============================================================================
export const ANIMATION_CONFIG = {
  // Stagger Text Items
  staggerDelay: 0.02,
  initialDelay: 0.05,

  // Individual Text Item Slide
  itemXOffset: -10,
  itemYOffset: 0,
  itemTransition: { type: "spring", bounce: 0.3, duration: 0.5 },

  // Context Menu Container
  containerStartScale: 0.0,
  containerStartX: 0,
  containerStartY: -10,
  containerTransformOrigin: "top left",
  containerTransition: { type: "spring", bounce: 0.15, duration: 0.4 }
};
// ============================================================================

interface MenuItemProps {
  children: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  checked?: boolean;
  hasSubmenu?: boolean;
}

const itemVariants = {
  hidden: { opacity: 0, x: ANIMATION_CONFIG.itemXOffset, y: ANIMATION_CONFIG.itemYOffset, filter: "blur(0px)" },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    filter: "blur(0px)",
    transition: ANIMATION_CONFIG.itemTransition
  },
  exit: { opacity: 0, filter: "blur(0px)", transition: { duration: 0.1 } }
};

const MenuItem = ({
  children,
  shortcut,
  disabled = false,
  checked = false,
  hasSubmenu = false
}: MenuItemProps) => {
  return (
    <motion.button
      variants={itemVariants}
      disabled={disabled}
      className={`
        w-full flex items-center justify-between px-3 py-1.5 text-[13px] rounded-md outline-none transition-colors
        will-change-transform [backface-visibility:hidden]
        ${disabled ? 'text-zinc-500' : 'text-zinc-200 hover:bg-blue-600 hover:text-white'}
        relative group
      `}
    >
      <div className="w-4 mr-2 flex items-center justify-center">
        {checked && <Check className="w-3.5 h-3.5 text-white" />}
      </div>
      <span className="flex-1 text-left tracking-wide">{children}</span>
      {(shortcut || hasSubmenu) && (
        <span className={`ml-8 text-[11px] tracking-widest ${disabled ? 'text-zinc-600' : 'text-zinc-400 group-hover:text-zinc-200'} flex items-center font-medium`}>
          {shortcut}
          {hasSubmenu && <ChevronRight className="w-3.5 h-3.5 ml-2" />}
        </span>
      )}
    </motion.button>
  );
};

const MenuSeparator = () => (
  <motion.div variants={itemVariants} className="h-px bg-zinc-800 my-1.5 mx-2" />
);

export default function ContextMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [menuKey, setMenuKey] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if they right-clicked (handled by onContextMenu)
      if (event.button === 2) return;

      if (isOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
    setMenuKey(prev => prev + 1);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-black font-sans relative overflow-hidden"
      onContextMenu={handleContextMenu}
    >
      <div className="flex items-center justify-center w-[600px] h-[400px] border border-dashed border-zinc-800 rounded-2xl text-zinc-500 select-none">
        Right click here
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key={menuKey}
            ref={menuRef}
            initial={{
              opacity: 0,
              scale: ANIMATION_CONFIG.containerStartScale,
              x: ANIMATION_CONFIG.containerStartX,
              y: ANIMATION_CONFIG.containerStartY
            }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{
              opacity: 0,
              scale: ANIMATION_CONFIG.containerStartScale,
              x: ANIMATION_CONFIG.containerStartX,
              y: ANIMATION_CONFIG.containerStartY
            }}
            transition={ANIMATION_CONFIG.containerTransition}
            style={{
              position: 'fixed',
              top: position.y,
              left: position.x,
              transformOrigin: ANIMATION_CONFIG.containerTransformOrigin
            }}
            className="z-50 min-w-[260px] bg-[#18181b] border border-zinc-800/80 rounded-xl shadow-2xl p-1.5 overflow-hidden"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: ANIMATION_CONFIG.staggerDelay,
                    delayChildren: ANIMATION_CONFIG.initialDelay
                  }
                }
              }}
              className="flex flex-col"
            >
              <MenuItem shortcut="⌘[">Back</MenuItem>
              <MenuItem shortcut="⌘]" disabled>Forward</MenuItem>
              <MenuItem shortcut="⌘R">Reload</MenuItem>
              <MenuItem hasSubmenu>More Tools</MenuItem>
              <MenuSeparator />
              <MenuItem checked>Show Bookmarks</MenuItem>
              <MenuItem>Show Full URLs</MenuItem>
              <MenuSeparator />
              <MenuItem shortcut="⌘S">Save As...</MenuItem>
              <MenuItem shortcut="⌘P">Print...</MenuItem>
              <MenuItem hasSubmenu>Cast...</MenuItem>
              <MenuItem>Translate to English</MenuItem>
              <MenuItem shortcut="⌥⌘U">View Page Source</MenuItem>
              <MenuItem shortcut="⌥⌘I">Inspect</MenuItem>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
