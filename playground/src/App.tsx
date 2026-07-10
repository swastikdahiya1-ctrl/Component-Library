import React, { useState } from 'react';
import Accordion from '../../components/Accordion';
import AlertDialog from '../../components/AlertDialog';
import Calendar from '../../components/Calendar';
import ContextMenu from '../../components/ContextMenu';
import CopyButton from '../../components/CopyButton';
import HoverImageReveal from '../../components/HoverImageReveal';
import MagneticCursor from '../../components/MagneticCursor';
import MenuBar from '../../components/MenuBar';
import MorphingModal from '../../components/MorphingModal';
import PhysicsText from '../../components/PhysicsText';
import PhysicsText2 from '../../components/PhysicsText2';
import RadialMenu from '../../components/RadialMenu';
import Toaster from '../../components/Toaster';
import ChatInterface from '../../components/ChatInterface';
import IosAppFolder from '../../components/IosAppFolder';
import CustomContentCursor from '../../components/CustomContentCursor';
import MegaMenu from '../../components/MegaMenu';
import IosSlider from '../../components/IosSlider';
import SwipeActions from '../../components/SwipeActions';
import AppleWatchHome from '../../components/AppleWatchHome';
import SplitTextScatter from '../../components/SplitTextScatter';
import NumberPriceSwitcher from '../../components/NumberPriceSwitcher';
import Typewriter from '../../components/Typewriter';
import AnimatedSidebar from '../../components/AnimatedSidebar';
const COMPONENTS = {
  'accordion': { name: 'Accordion', component: Accordion },
  'alert-dialog': { name: 'Alert Dialog', component: AlertDialog },
  'calendar': { name: 'Calendar', component: Calendar },
  'context-menu': { name: 'Context Menu', component: ContextMenu },
  'copy-button': { name: 'Copy Button', component: CopyButton },
  'hover-image': { name: 'Hover Image', component: HoverImageReveal },
  'magnetic-cursor': { name: 'Magnetic Cursor', component: MagneticCursor },
  'menu-bar': { name: 'Menu Bar', component: MenuBar },
  'morphing-modal': { name: 'Morphing Modal', component: MorphingModal },
  'physics': { name: 'Physics Text', component: PhysicsText },
  'physics2': { name: 'Blackhole Physics', component: PhysicsText2 },
  'radial-menu': { name: 'Radial Menu', component: RadialMenu },
  'toaster': { name: 'Toaster', component: Toaster },
  'chat': { name: 'Chat UI', component: ChatInterface },
  'ios-app-folder': { name: 'App Folder', component: IosAppFolder },
  'custom-content-cursor': { name: 'Custom Cursor', component: CustomContentCursor },
  'mega-menu': { name: 'Mega Menu', component: MegaMenu },
  'ios-slider': { name: 'iOS Slider', component: IosSlider },
  'swipe-actions': { name: 'Swipe Actions', component: SwipeActions },
  'apple-watch': { name: 'Apple Watch', component: AppleWatchHome },
  'text-scatter': { name: 'Text Scatter', component: SplitTextScatter },
  'price-switcher': { name: 'Price Switcher', component: NumberPriceSwitcher },
  'typewriter': { name: 'Typewriter', component: Typewriter },
  'sidebar': { name: 'Animated Sidebar', component: AnimatedSidebar },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<keyof typeof COMPONENTS>('physics2');
  
  const ActiveComponent = COMPONENTS[activeTab].component;

  return (
    <div className="min-h-screen bg-black flex flex-col overflow-hidden">
      <div className="p-4 border-b border-white/10 flex gap-2 flex-wrap bg-zinc-950 z-50">
        {Object.entries(COMPONENTS).map(([key, { name }]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as keyof typeof COMPONENTS)}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              activeTab === key ? 'bg-white text-black font-medium' : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center relative overflow-y-auto">
        <ActiveComponent />
      </div>
    </div>
  );
}
