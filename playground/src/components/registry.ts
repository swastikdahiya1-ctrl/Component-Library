import { lazy } from 'react';

export type ComponentSource = 'aceternity' | 'magicui' | 'custom';
export type ComponentCategory = 'Text Animations' | 'Navigations' | 'Cursors' | 'Overlays & Modals' | 'Interactive UI';

export interface ComponentEntry {
  id: string;
  name: string;
  source: ComponentSource;
  category: ComponentCategory;
  filename: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
}

export const componentsRegistry: ComponentEntry[] = [
  { id: 'physics-text', name: 'Physics Text', source: 'custom', category: 'Text Animations', filename: 'PhysicsText.tsx', component: lazy(() => import('../../../components/PhysicsText')) },
  { id: 'physics-text-2', name: 'Blackhole Physics', source: 'custom', category: 'Text Animations', filename: 'PhysicsText2.tsx', component: lazy(() => import('../../../components/PhysicsText2')) },
  { id: 'split-text-scatter', name: 'Text Scatter', source: 'custom', category: 'Text Animations', filename: 'SplitTextScatter.tsx', component: lazy(() => import('../../../components/SplitTextScatter')) },
  { id: 'typewriter', name: 'Typewriter', source: 'custom', category: 'Text Animations', filename: 'Typewriter.tsx', component: lazy(() => import('../../../components/Typewriter')) },
  
  { id: 'mega-menu', name: 'Mega Menu', source: 'custom', category: 'Navigations', filename: 'MegaMenu.tsx', component: lazy(() => import('../../../components/MegaMenu')) },
  { id: 'radial-menu', name: 'Radial Menu', source: 'custom', category: 'Navigations', filename: 'RadialMenu.tsx', component: lazy(() => import('../../../components/RadialMenu')) },
  { id: 'menu-bar', name: 'Menu Bar', source: 'custom', category: 'Navigations', filename: 'MenuBar.tsx', component: lazy(() => import('../../../components/MenuBar')) },
  { id: 'context-menu', name: 'Context Menu', source: 'custom', category: 'Navigations', filename: 'ContextMenu.tsx', component: lazy(() => import('../../../components/ContextMenu')) },
  { id: 'animated-sidebar', name: 'Animated Sidebar', source: 'custom', category: 'Navigations', filename: 'AnimatedSidebar.tsx', component: lazy(() => import('../../../components/AnimatedSidebar')) },

  { id: 'magnetic-cursor', name: 'Magnetic Cursor', source: 'custom', category: 'Cursors', filename: 'MagneticCursor.tsx', component: lazy(() => import('../../../components/MagneticCursor')) },
  { id: 'custom-content-cursor', name: 'Custom Cursor', source: 'custom', category: 'Cursors', filename: 'CustomContentCursor.tsx', component: lazy(() => import('../../../components/CustomContentCursor')) },

  { id: 'morphing-modal', name: 'Morphing Modal', source: 'custom', category: 'Overlays & Modals', filename: 'MorphingModal.tsx', component: lazy(() => import('../../../components/MorphingModal')) },
  { id: 'alert-dialog', name: 'Alert Dialog', source: 'custom', category: 'Overlays & Modals', filename: 'AlertDialog.tsx', component: lazy(() => import('../../../components/AlertDialog')) },
  { id: 'toaster', name: 'Toaster', source: 'custom', category: 'Overlays & Modals', filename: 'Toaster.tsx', component: lazy(() => import('../../../components/Toaster')) },

  { id: 'apple-watch-home', name: 'Apple Watch', source: 'custom', category: 'Interactive UI', filename: 'AppleWatchHome.tsx', component: lazy(() => import('../../../components/AppleWatchHome')) },
  { id: 'ios-app-folder', name: 'App Folder', source: 'custom', category: 'Interactive UI', filename: 'IosAppFolder.tsx', component: lazy(() => import('../../../components/IosAppFolder')) },
  { id: 'swipe-actions', name: 'Swipe Actions', source: 'custom', category: 'Interactive UI', filename: 'SwipeActions.tsx', component: lazy(() => import('../../../components/SwipeActions')) },
  { id: 'ios-slider', name: 'iOS Slider', source: 'custom', category: 'Interactive UI', filename: 'IosSlider.tsx', component: lazy(() => import('../../../components/IosSlider')) },
  { id: 'number-price-switcher', name: 'Price Switcher', source: 'custom', category: 'Interactive UI', filename: 'NumberPriceSwitcher.tsx', component: lazy(() => import('../../../components/NumberPriceSwitcher')) },
  { id: 'chat-interface', name: 'Chat UI', source: 'custom', category: 'Interactive UI', filename: 'ChatInterface.tsx', component: lazy(() => import('../../../components/ChatInterface')) },
  { id: 'calendar', name: 'Calendar', source: 'custom', category: 'Interactive UI', filename: 'Calendar.tsx', component: lazy(() => import('../../../components/Calendar')) },
  { id: 'accordion', name: 'Accordion', source: 'custom', category: 'Interactive UI', filename: 'Accordion.tsx', component: lazy(() => import('../../../components/Accordion')) },
  { id: 'copy-button', name: 'Copy Button', source: 'custom', category: 'Interactive UI', filename: 'CopyButton.tsx', component: lazy(() => import('../../../components/CopyButton')) },
  { id: 'hover-image-reveal', name: 'Hover Image Reveal', source: 'custom', category: 'Interactive UI', filename: 'HoverImageReveal.tsx', component: lazy(() => import('../../../components/HoverImageReveal')) }
];
