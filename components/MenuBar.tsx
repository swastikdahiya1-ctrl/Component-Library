import { useState, useRef, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { Check, ChevronRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItemProps {
  children: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  checked?: boolean;
  hasSubmenu?: boolean;
  submenuContent?: ReactNode;
  inset?: boolean;
  id?: string;
}

// ============================================================================
// ANIMATION CONFIGURATION
// ============================================================================
export const ANIMATION_CONFIG = {
  // Content Fade Animation
  contentTransition: { duration: 0.25, ease: "easeOut" },

  // Stagger Text Items
  staggerDelay: 0.04,
  initialDelay: 0.03,

  // Individual Text Item Slide (Main Menu)
  itemXOffset: 0,
  itemYOffset: 10,
  itemTransition: { type: "spring", bounce: 0.3, duration: 0.6 },

  // Submenu Text Items
  submenuItemXOffset: -5,
  submenuItemYOffset: 0,
  submenuItemTransition: { type: "spring", bounce: 0.3, duration: 0.6 },
  submenuStaggerDelay: 0.04,
  submenuInitialDelay: 0.03,

  // Background Box Glide (Main Menu)
  backgroundTransition: { type: "spring", bounce: 0.05, duration: 0.4 },

  // Submenu Pop-out Box
  submenuYOffset: 10,
  submenuTransition: { type: "spring", bounce: 0, duration: 0.4 }
};
// ============================================================================

const MenuContext = createContext<{
  activeSubmenuId: string | null;
  onHoverItem: (id: string, content?: ReactNode, top?: number) => void;
} | null>(null);

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

const submenuItemVariants = {
  hidden: { opacity: 0, x: ANIMATION_CONFIG.submenuItemXOffset, y: ANIMATION_CONFIG.submenuItemYOffset, filter: "blur(0px)" },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    filter: "blur(0px)",
    transition: ANIMATION_CONFIG.submenuItemTransition
  },
  exit: { opacity: 0, filter: "blur(0px)", transition: { duration: 0.1 } }
};

const MenuItem = ({
  children,
  shortcut,
  disabled = false,
  checked = false,
  hasSubmenu = false,
  submenuContent,
  inset = false,
  id = ""
}: MenuItemProps) => {
  const itemRef = useRef<HTMLButtonElement>(null);
  const context = useContext(MenuContext);

  const isSubmenuItem = context === null;
  const currentVariants = isSubmenuItem ? submenuItemVariants : itemVariants;

  const handleMouseEnter = () => {
    if (!context) return;
    if (submenuContent && id) {
      context.onHoverItem(id, submenuContent, itemRef.current?.offsetTop || 0);
    } else {
      context.onHoverItem(id || "default");
    }
  };

  return (
    <motion.button
      ref={itemRef}
      onMouseEnter={handleMouseEnter}
      variants={currentVariants}
      disabled={disabled}
      className={`
        w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md outline-none transition-colors
        will-change-transform [backface-visibility:hidden]
        ${disabled ? 'text-zinc-500' : 'text-zinc-200 hover:bg-blue-600'}
        ${context?.activeSubmenuId === id ? 'bg-blue-600 text-white' : 'hover:text-white'}
        ${inset ? 'pl-8' : ''}
        relative group
      `}
    >
      {checked && (
        <span className="absolute left-2 flex items-center justify-center text-white">
          <Check className="w-4 h-4" />
        </span>
      )}
      <span className="flex-1 text-left">{children}</span>
      {(shortcut || hasSubmenu) && (
        <span className={`ml-4 text-xs tracking-widest ${disabled ? 'text-zinc-600' : 'text-zinc-400 group-hover:text-zinc-200'} ${context?.activeSubmenuId === id ? 'text-zinc-200' : ''} flex items-center`}>
          {shortcut}
          {hasSubmenu && <ChevronRight className="w-4 h-4 ml-1" />}
        </span>
      )}
    </motion.button>
  );
};

const MenuSeparator = () => {
  const context = useContext(MenuContext);
  const isSubmenuItem = context === null;
  const currentVariants = isSubmenuItem ? submenuItemVariants : itemVariants;
  return <motion.div variants={currentVariants} className="h-px bg-zinc-800 my-1 mx-1" />;
};

export default function MenuBar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [previousMenu, setPreviousMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [activeSubmenu, setActiveSubmenu] = useState<{ id: string, content: ReactNode, top: number } | null>(null);
  const [extraTabs, setExtraTabs] = useState<{ id: string; name: string }[]>([]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
        setPreviousMenu(null);
        setActiveSubmenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // When top-level menu changes, reset submenu
  useEffect(() => {
    setActiveSubmenu(null);
  }, [activeMenu]);

  const onHoverItem = (id: string, content?: ReactNode, top?: number) => {
    if (content && top !== undefined) {
      setActiveSubmenu({ id, content, top });
    } else {
      setActiveSubmenu(null);
    }
  };

  const handleMenuClick = (menu: string) => {
    if (activeMenu === menu) {
      setActiveMenu(null);
      setPreviousMenu(null);
    } else {
      setPreviousMenu(activeMenu);
      setActiveMenu(menu);
    }
  };

  const handleMenuHover = (menu: string) => {
    if (activeMenu !== null && activeMenu !== menu) {
      setPreviousMenu(activeMenu);
      setActiveMenu(menu);
    }
  };

  const handleAddTab = () => {
    const id = `dynamic-${Date.now()}`;
    setExtraTabs(prev => [...prev, { id, name: `Tab ${prev.length + 1}` }]);
  };

  const handleDeleteTab = () => {
    setExtraTabs(prev => {
      const newTabs = [...prev];
      const removed = newTabs.pop();
      if (removed && activeMenu === removed.name) {
        setActiveMenu(null);
        setActiveSubmenu(null);
      }
      return newTabs;
    });
  };

  const staticMenus = [
    {
      name: 'File',
      content: (
        <div className="flex flex-col p-1 w-56">
          <MenuItem shortcut="⌘T">New Tab</MenuItem>
          <MenuItem shortcut="⌘N">New Window</MenuItem>
          <MenuItem disabled>New Incognito Window</MenuItem>
          <MenuSeparator />
          <MenuItem 
            id="share"
            hasSubmenu 
            submenuContent={
              <div className="flex flex-col p-1 w-48">
                <MenuItem>Email Link</MenuItem>
                <MenuItem>Messages</MenuItem>
                <MenuItem>AirDrop</MenuItem>
              </div>
            }
          >
            Share
          </MenuItem>
          <MenuSeparator />
          <MenuItem shortcut="⌘P">Print...</MenuItem>
        </div>
      )
    },
    {
      name: 'Edit',
      content: (
        <div className="flex flex-col p-1 w-56">
          <MenuItem shortcut="⌘Z">Undo</MenuItem>
          <MenuItem shortcut="⇧⌘Z">Redo</MenuItem>
          <MenuSeparator />
          <MenuItem 
            id="find"
            hasSubmenu 
            submenuContent={
              <div className="flex flex-col p-1 w-64">
                <div className="px-1 py-1 mb-1">
                  <div className="flex items-center px-2 py-1.5 bg-zinc-800/50 border border-zinc-700 rounded-md focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                    <Search className="w-3.5 h-3.5 mr-2 text-zinc-400" />
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      className="bg-transparent outline-none w-full text-sm text-zinc-200 placeholder-zinc-500"
                    />
                    <span className="ml-2 text-xs font-medium text-zinc-500">⌘F</span>
                  </div>
                </div>
                <MenuSeparator />
                <MenuItem shortcut="⌘G">Find Next</MenuItem>
                <MenuItem shortcut="⇧⌘G">Find Previous</MenuItem>
                <MenuSeparator />
                <MenuItem>Match Case</MenuItem>
                <MenuItem>Match Whole Word</MenuItem>
                <MenuItem shortcut="⌥⌘R">Use Regular Expressions</MenuItem>
              </div>
            }
          >
            Find
          </MenuItem>
          <MenuSeparator />
          <MenuItem>Cut</MenuItem>
          <MenuItem>Copy</MenuItem>
          <MenuItem>Paste</MenuItem>
        </div>
      )
    },
    {
      name: 'View',
      content: (
        <div className="flex flex-col p-1 w-56">
          <MenuItem inset>Bookmarks Bar</MenuItem>
          <MenuItem checked inset>Full URLs</MenuItem>
          <MenuSeparator />
          <MenuItem shortcut="⌘R" inset>Reload</MenuItem>
          <MenuItem disabled shortcut="⇧⌘R" inset>Force Reload</MenuItem>
          <MenuSeparator />
          <MenuItem inset>Toggle Fullscreen</MenuItem>
          <MenuSeparator />
          <MenuItem inset>Hide Sidebar</MenuItem>
        </div>
      )
    },
    {
      name: 'Profiles',
      content: (
        <div className="flex flex-col p-1 w-56">
          <MenuItem inset>Andy</MenuItem>
          <MenuItem checked inset>Benoit</MenuItem>
          <MenuItem inset>Luis</MenuItem>
          <MenuSeparator />
          <MenuItem inset>Edit...</MenuItem>
          <MenuSeparator />
          <MenuItem inset>Add Profile...</MenuItem>
        </div>
      )
    }
  ];

  const dynamicMenus = extraTabs.map((tab) => ({
    name: tab.name,
    content: (
      <div className="flex flex-col p-1 w-56">
        <MenuItem>Placeholder Item 1</MenuItem>
        <MenuItem>Placeholder Item 2</MenuItem>
        <MenuSeparator />
        <MenuItem 
          id={`sub-${tab.id}`}
          hasSubmenu 
          submenuContent={
            <div className="flex flex-col p-1 w-48">
              <MenuItem>Sub-item 1</MenuItem>
              <MenuItem>Sub-item 2</MenuItem>
            </div>
          }
        >
          Expandable Submenu
        </MenuItem>
      </div>
    )
  }));

  const menus = [...staticMenus, ...dynamicMenus];

  const getMenuIndex = (menuName: string | null) => {
    if (!menuName) return -1;
    return menus.findIndex((m) => m.name === menuName);
  };

  const currentIdx = getMenuIndex(activeMenu);

  return (
    <div className="flex items-start justify-center min-h-[500px] pt-24 w-full font-sans">
      <MenuContext.Provider value={{ activeSubmenuId: activeSubmenu?.id || null, onHoverItem }}>
        <motion.div 
          layout
          ref={menuRef}
          className="relative flex flex-wrap items-center p-1 bg-[#09090b] border border-zinc-800 rounded-lg shadow-lg max-w-[90vw]"
        >
          {/* Render Buttons */}
          <AnimatePresence>
            {menus.map((menu, i) => (
              <motion.button
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                key={menu.name}
                ref={(el) => {
                  buttonRefs.current[i] = el;
                }}
                onClick={() => handleMenuClick(menu.name)}
                onMouseEnter={() => handleMenuHover(menu.name)}
                className={`
                  px-3 py-1 rounded-md text-sm font-medium transition-colors outline-none relative z-10
                  ${activeMenu === menu.name ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'}
                `}
              >
                {menu.name}
              </motion.button>
            ))}
          </AnimatePresence>

          {/* The Single Persistent Dropdown Container */}
          <AnimatePresence>
            {activeMenu && currentIdx >= 0 && (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={ANIMATION_CONFIG.backgroundTransition}
                className="absolute top-full mt-1 bg-[#18181b] border border-zinc-800 rounded-lg shadow-2xl z-50 origin-top"
                style={{
                  left: buttonRefs.current[currentIdx]?.offsetLeft || 0
                }}
              >
                {/* Inner container handles the clipping for the layout sliding */}
                <div className="overflow-hidden relative w-56">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={activeMenu}
                      layout="position"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            ...ANIMATION_CONFIG.contentTransition,
                            staggerChildren: ANIMATION_CONFIG.staggerDelay,
                            delayChildren: ANIMATION_CONFIG.initialDelay
                          }
                        },
                        exit: {
                          opacity: 0,
                          transition: { duration: 0.2 }
                        }
                      }}
                    >
                      {menus[currentIdx].content}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Submenu Portal - rendered outside the overflow-hidden box! */}
                <AnimatePresence>
                  {activeSubmenu && (
                    <motion.div
                      initial={{ opacity: 0, y: ANIMATION_CONFIG.submenuYOffset }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: ANIMATION_CONFIG.submenuYOffset }}
                      transition={ANIMATION_CONFIG.submenuTransition}
                      className="absolute left-[calc(100%+4px)] bg-[#18181b] border border-zinc-800 rounded-lg shadow-xl"
                      style={{ top: activeSubmenu.top }}
                    >
                      <MenuContext.Provider value={null}>
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: ANIMATION_CONFIG.staggerDelay, delayChildren: ANIMATION_CONFIG.initialDelay } }
                          }}
                        >
                          {activeSubmenu.content}
                        </motion.div>
                      </MenuContext.Provider>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </MenuContext.Provider>

      {/* Controls */}
      <div className="fixed bottom-12 flex items-center gap-3">
        <button
          onClick={handleAddTab}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-md text-sm font-medium transition-colors border border-zinc-700"
        >
          Add Menu Option
        </button>
        <button
          onClick={handleDeleteTab}
          disabled={extraTabs.length === 0}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 disabled:opacity-50 disabled:hover:bg-zinc-800 rounded-md text-sm font-medium transition-colors border border-zinc-700"
        >
          Delete Option
        </button>
      </div>
    </div>
  );
}
