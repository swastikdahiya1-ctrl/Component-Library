import { lazy } from 'react';

export type ComponentSource = 'aceternity' | 'magicui' | 'custom';

export interface ComponentEntry {
  id: string;
  name: string;
  source: ComponentSource;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
}

export const componentsRegistry: ComponentEntry[] = [
  {
    id: 'accordion',
    name: 'Accordion',
    source: 'custom',
    component: lazy(() => import('../../../components/Accordion'))
  },
  {
    id: 'alert-dialog',
    name: 'Alert Dialog',
    source: 'custom',
    component: lazy(() => import('../../../components/AlertDialog'))
  },
  {
    id: 'calendar',
    name: 'Calendar',
    source: 'custom',
    component: lazy(() => import('../../../components/Calendar'))
  },
  {
    id: 'context-menu',
    name: 'Context Menu',
    source: 'custom',
    component: lazy(() => import('../../../components/ContextMenu'))
  },
  {
    id: 'copy-button',
    name: 'Copy Button',
    source: 'custom',
    component: lazy(() => import('../../../components/CopyButton'))
  },
  {
    id: 'hover-image-reveal',
    name: 'Hover Image Reveal',
    source: 'custom',
    component: lazy(() => import('../../../components/HoverImageReveal'))
  },
  {
    id: 'magnetic-cursor',
    name: 'Magnetic Cursor',
    source: 'custom',
    component: lazy(() => import('../../../components/MagneticCursor'))
  },
  {
    id: 'menu-bar',
    name: 'Menu Bar',
    source: 'custom',
    component: lazy(() => import('../../../components/MenuBar'))
  },
  {
    id: 'morphing-modal',
    name: 'Morphing Modal',
    source: 'custom',
    component: lazy(() => import('../../../components/MorphingModal'))
  },
  {
    id: 'physics-text',
    name: 'Physics Text',
    source: 'custom',
    component: lazy(() => import('../../../components/PhysicsText'))
  },
  {
    id: 'physics-text-2',
    name: 'Blackhole Physics',
    source: 'custom',
    component: lazy(() => import('../../../components/PhysicsText2'))
  },
  {
    id: 'radial-menu',
    name: 'Radial Menu',
    source: 'custom',
    component: lazy(() => import('../../../components/RadialMenu'))
  },
  {
    id: 'toaster',
    name: 'Toaster',
    source: 'custom',
    component: lazy(() => import('../../../components/Toaster'))
  }
];
