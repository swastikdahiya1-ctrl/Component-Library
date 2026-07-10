import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Settings, Users, Search, Bell, Menu } from 'lucide-react';

export default function AnimatedSidebar() {
  const [expanded, setExpanded] = useState(false);

  const ITEMS = [
    { icon: <Home className="w-5 h-5" />, label: "Dashboard" },
    { icon: <Search className="w-5 h-5" />, label: "Search" },
    { icon: <Bell className="w-5 h-5" />, label: "Notifications" },
    { icon: <Users className="w-5 h-5" />, label: "Customers" },
    { icon: <Settings className="w-5 h-5" />, label: "Settings" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] flex font-sans">
      <motion.div 
        className="h-screen bg-[#111] border-r border-white/10 p-4 flex flex-col gap-4 relative shadow-2xl"
        animate={{ width: expanded ? 260 : 80 }}
        transition={{ type: "spring", bounce: 0, duration: 0.5 }}
      >
        <button 
          onClick={() => setExpanded(!expanded)}
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors self-start"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col gap-2 mt-8">
          {ITEMS.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap overflow-hidden">
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">{item.icon}</div>
              <motion.span
                animate={{ opacity: expanded ? 1 : 0, filter: expanded ? "blur(0px)" : "blur(4px)" }}
                transition={{ duration: 0.2 }}
                className="font-medium"
              >
                {item.label}
              </motion.span>
            </div>
          ))}
        </div>
      </motion.div>
      <div className="flex-1 p-12 text-white">
        <h1 className="text-5xl font-semibold mb-4 tracking-tight">Sidebar Navigation</h1>
        <p className="text-zinc-500 text-lg">Click the hamburger icon to toggle the fluid sidebar morph.</p>
      </div>
    </div>
  );
}
