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
    id: 'aceternity-background-boxes',
    name: 'Background Boxes',
    source: 'aceternity',
    component: lazy(() => import('./ui/BackgroundBoxes'))
  },
  {
    id: 'aceternity-3d-card',
    name: '3D Card Effect',
    source: 'aceternity',
    component: lazy(() => import('./ui/ThreeDCard'))
  },
  {
    id: 'aceternity-meteors',
    name: 'Meteors',
    source: 'aceternity',
    component: lazy(() => import('./ui/Meteors'))
  },
  {
    id: 'aceternity-spotlight',
    name: 'Spotlight',
    source: 'aceternity',
    component: lazy(() => import('./ui/Spotlight'))
  },
  {
    id: 'aceternity-typewriter',
    name: 'Typewriter Effect',
    source: 'aceternity',
    component: lazy(() => import('./ui/Typewriter'))
  },
  {
    id: 'magicui-animated-beam',
    name: 'Animated Beam',
    source: 'magic-ui',
    component: lazy(() => import('./ui/AnimatedBeam'))
  },
  {
    id: 'magicui-marquee',
    name: 'Marquee',
    source: 'magic-ui',
    component: lazy(() => import('./ui/Marquee'))
  },
  {
    id: 'magicui-dock',
    name: 'Dock',
    source: 'magic-ui',
    component: lazy(() => import('./ui/Dock'))
  },
  {
    id: 'magicui-globe',
    name: 'Globe',
    source: 'magic-ui',
    component: lazy(() => import('./ui/Globe'))
  },
  {
    id: 'magicui-confetti',
    name: 'Confetti',
    source: 'magic-ui',
    component: lazy(() => import('./ui/Confetti'))
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
    id: 'hover-image-reveal',
    name: 'Hover Image Reveal',
    source: 'custom',
    component: lazy(() => import('../../../components/HoverImageReveal'))
  },
  {
    id: 'morphing-modal',
    name: 'Morphing Modal',
    source: 'custom',
    component: lazy(() => import('../../../components/MorphingModal'))
  }
];
