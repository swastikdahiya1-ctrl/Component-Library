# Motion Library playground

A React component gallery with looping demonstrations, isolated interactive previews, and source-code controls.

From the repository root:

```sh
npm install --prefix playground
npm run dev
npm run build --prefix playground
npm run preview --prefix playground
npm run lint --prefix playground
```

In the gallery, `/` focuses search and Escape clears it. Pause previews stops all card demos. Reduced-motion preferences default the gallery to paused; visitors can choose Play previews. Previews unload outside the viewport and while the browser tab is hidden.

The component workspace provides responsive preview sizes, replay, source copying, source-file download, and a shareable component URL.

## Original motion studies

The collection now includes 26 registered components. Ten new standalone studies use the existing React, Tailwind, `framer-motion`, and `lucide-react` dependencies:

- Perspective Card Deck: layered 3D transforms with a single controlled overshoot.
- Editorial Shutter: five staggered clip masks across three compositions.
- Perspective Focus Gallery: focus, elevation, and perspective across three studies.
- Proximity Dock: neighboring icons respond to the hovered or focused target.
- Rolling Number Counter: independently animated digit columns.
- Sliding Workspace Tabs: a shared indicator, directional content, and arrow-key navigation.
- Reflowing Filter List: coordinated removal, insertion, and layout changes.
- Sequenced Progress: three checkpoints, progress lines, and content handoffs.
- Swipe Action Reveal: edge resistance, velocity-aware gestures, and accessible action buttons.
- Deliberate Confirmation: hold with pointer or keyboard; release early to cancel.

Each new file is self-contained, includes reduced-motion support, and has a gallery playback sequence. The new pieces use restrained easing and springs with no bounce, except the card deck's small deliberate overshoot. No new dependencies or image requests are needed. Existing source components remain unchanged.

## Preserving component behavior

The original components live in `../components`. `src/components/registry.ts` supplies their names, categories, source filenames, and lazy imports. `PreviewAutoplay.tsx` is a gallery-only input player: it sends clicks, hovers, and drag events to the original component without changing its animation settings. Full interactive previews do not use autoplay. Add a playback sequence there when registering a new interactive component; naturally looping components need no input sequence.

For the code cleanup in this revamp, verify that the emitted component runtime remains identical to the original baseline (unused React default imports are normalized because Vite removes them with automatic JSX):

```sh
node scripts/check-component-equivalence.cjs 1901b76
```

Run that command from the repository root. The baseline comparison covers all 25 source components, including those not currently registered in the gallery. It detects changes to styling, motion settings, state logic, and physics code. Component cleanup is limited to unused imports, browser-safe timer types, and literal types for shared motion configurations.

The production build passes. A full TypeScript check still reports existing issues in some original demos, including physics ref callbacks and the typewriter's transition object; those have been left unchanged to preserve runtime behavior.
