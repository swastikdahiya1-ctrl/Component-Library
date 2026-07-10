# IDE Automation Prompt

Copy and paste the following prompt directly into your AI IDE (like Cursor, Windsurf, or GitHub Copilot Chat). Make sure to open your Vite project workspace before running this.

***

**Context:**
I have scraped 184 premium React and Framer Motion UI components from Aceternity UI and Magic UI. The raw code for these components is located in the `./components/` directory relative to the project root. Each component has its own folder containing multiple scraped code blocks (e.g., `code_1.tsx`, `code_2.config.js`). 

I need you to systematically integrate these into my current Vite React environment and redesign our navigation system to handle a massive component library.

**Please execute the following steps:**

### Phase 1: Navigation & Routing Redesign
1. **Remove Tabs:** Completely remove our current tab-based navigation system for viewing components. With 180+ components, tabs will not scale.
2. **Global Header:** Create a global sticky header (or update the existing one) with a "Library Grid" button.
3. **Grid View (Home):** Create a new main index route (e.g., `src/pages/LibraryGrid.tsx`). This page should display a responsive grid (using Tailwind CSS `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`). Each grid item should act as a "thumbnail" card displaying the name of a component.
4. **Component View:** Create a dynamic route (e.g., `src/pages/ComponentPreview.tsx` or handle it conditionally if not using React Router). When a user clicks a thumbnail in the Grid View, it should take them to this view to display the component in isolation. 
5. **Go Back:** The Component View must include a prominent "← Back to Grid" button at the top left.

### Phase 2: Component Unification & Integration
1. **Iterate and Read:** Read the component folders located in the `./components/` directory.
2. **Merge into Single Files:** For each component folder, read the `code_*.tsx` and `code_*.config.js` files. Intelligently merge the logic into a **single unified `.tsx` file** for each component, saving them directly into `src/components/ui/` (or our standard components directory). 
3. **Resolve Imports:** Update all internal imports. If multiple scraped files contain utility functions (like `cn` or `clsx`), do not duplicate them. Map them to our global `src/lib/utils.ts` (create it if it doesn't exist).
4. **Tailwind Config Consolidation:** If you find Tailwind configuration code in the scraped files (like custom animations, keyframes, or colors), extract those values and merge them into our root `tailwind.config.js` file. Do not create separate config files per component.
5. **Register Components:** As you create each unified component in `src/components/ui/`, automatically register it in the `LibraryGrid` view so its thumbnail card appears, and map it so it can be dynamically rendered in the `ComponentPreview` view.

**Rules for Execution:**
- Work in chunks if necessary. If context limits prevent you from doing all 180 at once, start by writing the routing/grid logic and then integrate the first 10 components as a proof-of-concept. 
- Ensure all Framer Motion (`framer-motion` or `motion`) dependencies are correctly imported.
- Focus on clean, modular React architecture. No single file should contain duplicate Tailwind configs.
