import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

// ============================================================================
// ANIMATION CONFIGURATION
// ============================================================================
export const ANIMATION_CONFIG = {
  // Staggering
  staggerDelay: 0.015,
  initialDelay: 0.05,
  
  // Items staggering downwards
  itemYOffset: -10,
  itemTransition: { type: "spring", bounce: 0.4, duration: 0.5 },

  // Container Dropdown
  containerScale: 0.9,
  containerYOffset: -10,
  containerTransition: { type: "spring", bounce: 0.35, duration: 0.5 }
};
// ============================================================================

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const FULL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

interface CalendarProps {
  isMultiSelect?: boolean;
}

const getGridDays = (viewDate: Date) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  
  const grid = [];
  
  // Prev month trailing days
  for (let i = 0; i < startingDayOfWeek; i++) {
    const day = daysInPrevMonth - startingDayOfWeek + i + 1;
    grid.push({
      date: new Date(year, month - 1, day),
      isCurrentMonth: false
    });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    grid.push({
      date: new Date(year, month, i),
      isCurrentMonth: true
    });
  }
  
  // Next month leading days (fill up to 42)
  const remaining = 42 - grid.length;
  for (let i = 1; i <= remaining; i++) {
    grid.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false
    });
  }
  
  return grid;
};

const isSameDate = (date1: Date, date2: Date) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

export default function Calendar({ isMultiSelect = false }: CalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"calendar" | "months">("calendar");
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setTimeout(() => setView("calendar"), 300); // Reset view after animation
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (date: Date) => {
    if (isMultiSelect) {
      setSelectedDates(prev => {
        const exists = prev.find(d => isSameDate(d, date));
        if (exists) {
          return prev.filter(d => !isSameDate(d, date));
        }
        return [...prev, date];
      });
    } else {
      setSelectedDates([date]);
      setIsOpen(false);
      setTimeout(() => setView("calendar"), 300);
    }
  };

  const handleMonthSelect = (monthIndex: number) => {
    setViewDate(new Date(viewDate.getFullYear(), monthIndex, 1));
    setView("calendar");
  };

  const gridDays = getGridDays(viewDate);

  const itemVariants = {
    hidden: { opacity: 0, y: ANIMATION_CONFIG.itemYOffset, filter: "blur(0px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: ANIMATION_CONFIG.itemTransition },
    exit: { opacity: 0, filter: "blur(0px)", transition: { duration: 0.1 } }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pb-48 bg-black font-sans relative" ref={containerRef}>
      
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-[260px] px-4 py-2.5 bg-[#09090b] hover:bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
      >
        <span>
          {selectedDates.length === 0 
            ? "Pick a date" 
            : selectedDates.length === 1 
              ? selectedDates[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
              : `${selectedDates.length} dates selected`}
        </span>
        <ChevronDown className="w-4 h-4 text-zinc-500" />
      </button>

      {/* Dropdown Container */}
      <div className="absolute top-[calc(50%+30px)] left-1/2 -translate-x-1/2 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: ANIMATION_CONFIG.containerScale, y: ANIMATION_CONFIG.containerYOffset }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: ANIMATION_CONFIG.containerScale, y: ANIMATION_CONFIG.containerYOffset }}
              transition={ANIMATION_CONFIG.containerTransition}
              style={{ transformOrigin: "top" }}
              className="w-[280px] bg-[#18181b] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-3 will-change-transform"
            >
              <AnimatePresence mode="wait">
                {view === "calendar" ? (
                  <motion.div
                    key="calendar"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={{
                      visible: { transition: { staggerChildren: ANIMATION_CONFIG.staggerDelay, delayChildren: ANIMATION_CONFIG.initialDelay } }
                    }}
                    className="flex flex-col"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3 px-1">
                      <motion.button variants={itemVariants} onClick={handlePrevMonth} className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-zinc-100 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                      </motion.button>
                      <motion.button 
                        variants={itemVariants}
                        onClick={() => setView("months")}
                        className="font-semibold text-[15px] text-zinc-100 hover:bg-zinc-800 px-3 py-1 rounded-md transition-colors tracking-wide"
                      >
                        {FULL_MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                      </motion.button>
                      <motion.button variants={itemVariants} onClick={handleNextMonth} className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-zinc-100 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </div>

                    {/* Weekdays */}
                    <div className="grid grid-cols-7 mb-2">
                      {WEEKDAYS.map((day, i) => (
                        <motion.div key={day} variants={itemVariants} className="text-center text-xs font-medium text-zinc-500 py-1">
                          {day}
                        </motion.div>
                      ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-y-1 gap-x-1">
                      {gridDays.map((dayObj, i) => {
                        const isSelected = selectedDates.some(d => isSameDate(d, dayObj.date));
                        return (
                          <motion.button
                            key={i}
                            variants={itemVariants}
                            onClick={() => handleDateSelect(dayObj.date)}
                            className={`
                              h-9 w-full flex items-center justify-center text-[13px] font-medium rounded-lg transition-colors outline-none
                              will-change-transform [backface-visibility:hidden]
                              ${!dayObj.isCurrentMonth ? 'text-zinc-600 hover:text-zinc-300' : 'text-zinc-200'}
                              ${isSelected ? 'bg-blue-600 text-white hover:bg-blue-500' : 'hover:bg-zinc-800'}
                            `}
                          >
                            {dayObj.date.getDate()}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="months"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={{
                      visible: { transition: { staggerChildren: ANIMATION_CONFIG.staggerDelay * 1.5, delayChildren: ANIMATION_CONFIG.initialDelay } }
                    }}
                    className="flex flex-col"
                  >
                    <div className="flex items-center justify-center mb-4 px-1 mt-1">
                      <motion.div variants={itemVariants} className="font-semibold text-[15px] text-zinc-100">
                        {viewDate.getFullYear()}
                      </motion.div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {MONTHS.map((month, i) => (
                        <motion.button
                          key={month}
                          variants={itemVariants}
                          onClick={() => handleMonthSelect(i)}
                          className={`
                            py-3 flex items-center justify-center text-sm font-medium rounded-lg transition-colors outline-none
                            will-change-transform [backface-visibility:hidden]
                            ${viewDate.getMonth() === i ? 'bg-blue-600 text-white' : 'text-zinc-300 hover:bg-zinc-800'}
                          `}
                        >
                          {month}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
