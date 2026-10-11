import { lazy } from "react";

export type ComponentSource = "aceternity" | "magicui" | "custom";
export type ComponentCategory =
  | "Typography & Text"
  | "Navigation & Menus"
  | "Cursor & Hover Effects"
  | "Overlays & Feedback"
  | "Interactive Controls";

export interface ComponentEntry {
  id: string;
  name: string;
  source: ComponentSource;
  category: ComponentCategory;
  filename: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
}

export const componentsRegistry: ComponentEntry[] = [
  // Original motion studies: self-contained source with reduced-motion support.
  {
    id: "perspective-deck",
    name: "Perspective Card Deck",
    source: "custom",
    category: "Interactive Controls",
    filename: "PerspectiveDeck.tsx",
    component: lazy(() => import("../../../components/PerspectiveDeck")),
  },
  {
    id: "shutter-switcher",
    name: "Editorial Shutter",
    source: "custom",
    category: "Typography & Text",
    filename: "ShutterSwitcher.tsx",
    component: lazy(() => import("../../../components/ShutterSwitcher")),
  },
  {
    id: "focus-cards",
    name: "Perspective Focus Gallery",
    source: "custom",
    category: "Cursor & Hover Effects",
    filename: "FocusCards.tsx",
    component: lazy(() => import("../../../components/FocusCards")),
  },
  {
    id: "expandable-dock",
    name: "Proximity Dock",
    source: "custom",
    category: "Navigation & Menus",
    filename: "ExpandableDock.tsx",
    component: lazy(() => import("../../../components/ExpandableDock")),
  },
  {
    id: "rolling-counter",
    name: "Rolling Number Counter",
    source: "custom",
    category: "Typography & Text",
    filename: "RollingCounter.tsx",
    component: lazy(() => import("../../../components/RollingCounter")),
  },
  {
    id: "sliding-tabs",
    name: "Sliding Workspace Tabs",
    source: "custom",
    category: "Navigation & Menus",
    filename: "SlidingTabs.tsx",
    component: lazy(() => import("../../../components/SlidingTabs")),
  },
  {
    id: "filterable-list",
    name: "Reflowing Filter List",
    source: "custom",
    category: "Interactive Controls",
    filename: "FilterableList.tsx",
    component: lazy(() => import("../../../components/FilterableList")),
  },
  {
    id: "process-stepper",
    name: "Sequenced Progress",
    source: "custom",
    category: "Overlays & Feedback",
    filename: "ProcessStepper.tsx",
    component: lazy(() => import("../../../components/ProcessStepper")),
  },
  {
    id: "swipe-actions",
    name: "Swipe Action Reveal",
    source: "custom",
    category: "Interactive Controls",
    filename: "SwipeActionReveal.tsx",
    component: lazy(() => import("../../../components/SwipeActionReveal")),
  },
  {
    id: "hold-to-confirm",
    name: "Deliberate Confirmation",
    source: "custom",
    category: "Overlays & Feedback",
    filename: "HoldToConfirm.tsx",
    component: lazy(() => import("../../../components/HoldToConfirm")),
  },
  // Typography & Text
  {
    id: "physics-text-2",
    name: "Blackhole Gravity Text",
    source: "custom",
    category: "Typography & Text",
    filename: "PhysicsText2.tsx",
    component: lazy(() => import("../../../components/PhysicsText2")),
  },
  {
    id: "typewriter",
    name: "Kinetic Typewriter",
    source: "custom",
    category: "Typography & Text",
    filename: "Typewriter.tsx",
    component: lazy(() => import("../../../components/Typewriter")),
  },
  {
    id: "studio-hover-anim",
    name: "Studio Word Roll",
    source: "custom",
    category: "Typography & Text",
    filename: "StudioHoverAnim.tsx",
    component: lazy(() => import("../../../components/StudioHoverAnim")),
  },

  // Navigation & Menus
  {
    id: "mega-menu",
    name: "Expanding Mega Menu",
    source: "custom",
    category: "Navigation & Menus",
    filename: "MegaMenu.tsx",
    component: lazy(() => import("../../../components/MegaMenu")),
  },
  {
    id: "radial-menu",
    name: "Radial Menu",
    source: "custom",
    category: "Navigation & Menus",
    filename: "RadialMenu.tsx",
    component: lazy(() => import("../../../components/RadialMenu")),
  },
  {
    id: "menu-bar",
    name: "Desktop Menu Bar",
    source: "custom",
    category: "Navigation & Menus",
    filename: "MenuBar.tsx",
    component: lazy(() => import("../../../components/MenuBar")),
  },
  {
    id: "context-menu",
    name: "Context Menu",
    source: "custom",
    category: "Navigation & Menus",
    filename: "ContextMenu.tsx",
    component: lazy(() => import("../../../components/ContextMenu")),
  },
  {
    id: "animated-sidebar",
    name: "Morphing Sidebar",
    source: "custom",
    category: "Navigation & Menus",
    filename: "AnimatedSidebar.tsx",
    component: lazy(() => import("../../../components/AnimatedSidebar")),
  },

  // Cursor & Hover Effects
  {
    id: "magnetic-cursor",
    name: "Magnetic Cursor",
    source: "custom",
    category: "Cursor & Hover Effects",
    filename: "MagneticCursor.tsx",
    component: lazy(() => import("../../../components/MagneticCursor")),
  },
  {
    id: "hover-image-reveal",
    name: "Hover Image Follower",
    source: "custom",
    category: "Cursor & Hover Effects",
    filename: "HoverImageReveal.tsx",
    component: lazy(() => import("../../../components/HoverImageReveal")),
  },

  // Overlays & Feedback
  {
    id: "alert-dialog",
    name: "Kinetic Alert Dialog",
    source: "custom",
    category: "Overlays & Feedback",
    filename: "AlertDialog.tsx",
    component: lazy(() => import("../../../components/AlertDialog")),
  },
  {
    id: "toaster",
    name: "Stacked Toasts",
    source: "custom",
    category: "Overlays & Feedback",
    filename: "Toaster.tsx",
    component: lazy(() => import("../../../components/Toaster")),
  },

  // Interactive Controls
  {
    id: "ios-slider",
    name: "iOS Control Slider",
    source: "custom",
    category: "Interactive Controls",
    filename: "IosSlider.tsx",
    component: lazy(() => import("../../../components/IosSlider")),
  },
  {
    id: "chat-interface",
    name: "Interactive Chat Widget",
    source: "custom",
    category: "Interactive Controls",
    filename: "ChatInterface.tsx",
    component: lazy(() => import("../../../components/ChatInterface")),
  },
  {
    id: "accordion",
    name: "Fluid Accordion",
    source: "custom",
    category: "Interactive Controls",
    filename: "Accordion.tsx",
    component: lazy(() => import("../../../components/Accordion")),
  },
  {
    id: "copy-button",
    name: "Morphing Copy Button",
    source: "custom",
    category: "Interactive Controls",
    filename: "CopyButton.tsx",
    component: lazy(() => import("../../../components/CopyButton")),
  },
];
