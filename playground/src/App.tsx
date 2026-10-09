import {
  Component,
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  Monitor,
  Moon,
  Play,
  RotateCcw,
  Search,
  Smartphone,
  Sun,
  X,
} from "lucide-react";
import { componentsRegistry, type ComponentEntry } from "./components/registry";
import "./App.css";

const CodeView = lazy(() => import("./components/CodeView"));
const rawCodes = import.meta.glob("../../components/*.tsx", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;
const repo = "https://github.com/swastikdahiya1-ctrl/Component-Library";
const descriptions: Record<string, string> = {
  "physics-text-2":
    "Typography with a gravitational pull. Move your cursor through the text and watch it find its way back.",
  typewriter:
    "A typewriter with rhythm. Animated words, a blinking caret, and a little personality.",
  "studio-hover-anim":
    "A cascading character roll that gives every hover a little more energy.",
  "mega-menu":
    "A navigation menu that opens up into a spacious, animated panel.",
  "radial-menu": "A spring-loaded menu that puts your actions in orbit.",
  "menu-bar":
    "Familiar desktop navigation with fluid transitions between menus.",
  "context-menu":
    "A contextual menu that appears right where you need it. Right-click to try it.",
  "animated-sidebar":
    "A compact sidebar that smoothly expands to reveal your navigation.",
  "magnetic-cursor":
    "A cursor that snaps to its target. Hover the button to feel the attraction.",
  "hover-image-reveal":
    "Images follow your cursor as you move between the project titles.",
  "alert-dialog":
    "An animated confirmation dialog with a little extra character.",
  toaster:
    "Notifications that stack, spring into place, and get out of your way.",
  "ios-slider":
    "A tactile control slider inspired by the interactions on your phone.",
  "chat-interface":
    "An interactive chat widget with animated message transitions.",
  accordion:
    "Expandable content with smooth transitions and a clean reading experience.",
  "copy-button":
    "A small interaction with a satisfying finish. Click to see it transform.",
};
const shortCategories: Record<string, string> = {
  "Typography & Text": "Typography",
  "Navigation & Menus": "Navigation",
  "Cursor & Hover Effects": "Cursor & hover",
  "Overlays & Feedback": "Feedback",
  "Interactive Controls": "Controls",
};
const categories = Object.keys(shortCategories);

class PreviewBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="preview-error">
        This preview couldn't load. Try replaying it.
      </div>
    ) : (
      this.props.children
    );
  }
}

function PreviewFrame({
  entry,
  thumbnail = false,
  replay = 0,
}: {
  entry: ComponentEntry;
  thumbnail?: boolean;
  replay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [visible, setVisible] = useState(!thumbnail);
  useEffect(() => {
    const element = ref.current;
    if (!element || !thumbnail) return;
    const observer = new IntersectionObserver(
      ([item]) => setVisible(item.isIntersecting),
      { rootMargin: "100px" },
    );
    observer.observe(element);
    const resize = new ResizeObserver(([item]) => {
      if (frame.current)
        frame.current.style.transform = `scale(${item.contentRect.width / 900})`;
    });
    resize.observe(element);
    return () => {
      observer.disconnect();
      resize.disconnect();
    };
  }, [thumbnail, visible]);
  return (
    <div ref={ref} className={thumbnail ? "thumbnail-frame" : "full-frame"}>
      {visible && (
        <iframe
          ref={frame}
          key={`${entry.id}-${replay}`}
          src={`?embed=${entry.id}`}
          title={`${entry.name} ${thumbnail ? "thumbnail" : "interactive preview"}`}
          tabIndex={thumbnail ? -1 : 0}
          loading="lazy"
        />
      )}
    </div>
  );
}

function Gallery({
  query,
  setQuery,
  category,
  setCategory,
}: {
  query: string;
  setQuery: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
}) {
  const filtered = componentsRegistry.filter(
    (c) =>
      (category === "All components" || c.category === category) &&
      `${c.name} ${c.category}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">A collection of small delights</p>
          <h1>
            Good interfaces.
            <br />
            <span>Great feelings.</span>
          </h1>
          <p className="hero-description">
            Expressive components for the web.
            <br />
            Play with them. Grab the code. Make them yours.
          </p>
          <a href="#collection" className="primary-button">
            Explore the collection <ArrowDown size={17} />
          </a>
        </div>
        <a
          className="hero-playground"
          href="#/component/studio-hover-anim"
          title="Try Studio Word Roll"
        >
          <div className="hero-demo-label">
            <span>Made to be played with</span>
            <ArrowUpRight size={18} />
          </div>
          <div className="rolling-demo" aria-hidden="true">
            {["MAKE", "IT", "MOVE."].map((word, i) => (
              <div className="word-window" key={word}>
                <span style={{ transitionDelay: `${i * 40}ms` }}>{word}</span>
                <span style={{ transitionDelay: `${i * 40}ms` }}>{word}</span>
              </div>
            ))}
          </div>
          <div className="hero-demo-footer">
            <span>Studio word roll</span>
            <span>
              Hover to feel it <Play size={11} fill="currentColor" />
            </span>
          </div>
        </a>
      </section>
      <section
        id="collection"
        className="collection-section"
        aria-label="Component collection"
      >
        <div className="collection-heading">
          <div>
            <p className="eyebrow">The collection</p>
            <h2>
              A little motion goes a long way<span>.</span>
            </h2>
          </div>
          <span className="collection-count">
            {componentsRegistry.length} components
          </span>
        </div>
        <div className="collection-toolbar">
          <div className="category-tabs" aria-label="Filter by category">
            {["All components", ...categories].map((cat) => (
              <button
                key={cat}
                aria-pressed={category === cat}
                onClick={() => setCategory(cat)}
                className={category === cat ? "selected" : ""}
              >
                {shortCategories[cat] || cat}
              </button>
            ))}
          </div>
          <label className="search-field">
            <Search size={16} />
            <input
              aria-label="Search components"
              placeholder="Find a component..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear search">
                <X size={14} />
              </button>
            )}
          </label>
        </div>
        <p className="sr-only" role="status">
          {filtered.length} components found
        </p>
        <div className="component-grid">
          {filtered.map((entry, index) => (
            <a
              className="component-card"
              href={`#/component/${entry.id}`}
              key={entry.id}
              style={{ animationDelay: `${Math.min(index, 5) * 40}ms` }}
            >
              <div className="card-preview">
                <PreviewFrame entry={entry} thumbnail />
                <span className="preview-affordance">
                  <Play size={13} fill="currentColor" /> Try it out
                </span>
              </div>
              <div className="card-caption">
                <div>
                  <h3>{entry.name}</h3>
                  <p>{shortCategories[entry.category]}</p>
                </div>
                <ArrowUpRight size={18} />
              </div>
            </a>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="empty-state">
            <Search size={25} />
            <h3>No matches this time.</h3>
            <p>Try another name or browse the full collection.</p>
            <button
              className="secondary-button"
              onClick={() => {
                setQuery("");
                setCategory("All components");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </>
  );
}

function Workshop({ entry }: { entry: ComponentEntry }) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [size, setSize] = useState<"desktop" | "mobile">("desktop");
  const [replay, setReplay] = useState(0);
  const [code, setCode] = useState("");
  const [copyState, setCopyState] = useState("Copy code");
  const filename = entry.filename;
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    let cancelled = false;
    rawCodes[`../../components/${filename}`]?.()
      .then((source) => {
        if (!cancelled) setCode(source);
      })
      .catch(() => {
        if (!cancelled) setCopyState("Source unavailable");
      });
    return () => {
      cancelled = true;
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, [filename]);
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState("Copied!");
    } catch {
      setCopyState("Select code to copy");
      setTab("code");
    }
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopyState("Copy code"), 2000);
  }
  return (
    <section className="workshop">
      <a className="back-link" href="#collection">
        <ArrowLeft size={16} /> Back to collection
      </a>
      <div className="workshop-heading">
        <div>
          <p className="eyebrow">{shortCategories[entry.category]}</p>
          <h1>{entry.name}</h1>
          <p>{descriptions[entry.id]}</p>
        </div>
        <button className="primary-button" onClick={copy} disabled={!code}>
          {copyState === "Copied!" ? <Check size={16} /> : <Copy size={16} />}
          {copyState}
        </button>
      </div>
      <div className="workbench">
        <div className="workbench-toolbar">
          <div className="view-tabs">
            {(["preview", "code"] as const).map((value) => (
              <button
                key={value}
                aria-pressed={tab === value}
                onClick={() => setTab(value)}
                className={tab === value ? "selected" : ""}
              >
                {value === "preview" ? <Play size={14} /> : <Code2 size={15} />}
                {value === "preview" ? "Preview" : "Source code"}
              </button>
            ))}
          </div>
          {tab === "preview" ? (
            <div className="preview-tools">
              <button
                aria-label="Desktop preview"
                aria-pressed={size === "desktop"}
                onClick={() => setSize("desktop")}
                className={size === "desktop" ? "selected" : ""}
              >
                <Monitor size={16} />
              </button>
              <button
                aria-label="Mobile preview"
                aria-pressed={size === "mobile"}
                onClick={() => setSize("mobile")}
                className={size === "mobile" ? "selected" : ""}
              >
                <Smartphone size={16} />
              </button>
              <span className="tool-divider" />
              <button
                aria-label="Replay animation"
                onClick={() => setReplay((n) => n + 1)}
              >
                <RotateCcw size={16} />
              </button>
            </div>
          ) : (
            <span className="filename">{entry.filename}</span>
          )}
        </div>
        <div
          className={`workbench-content ${tab === "code" ? "code-content" : ""}`}
        >
          {tab === "preview" ? (
            <div className={`preview-viewport ${size}`}>
              <PreviewFrame entry={entry} replay={replay} />
            </div>
          ) : (
            <Suspense
              fallback={<div className="loading-state">Loading source...</div>}
            >
              <CodeView code={code} />
            </Suspense>
          )}
        </div>
        <div className="workbench-footer">
          <span>
            {tab === "preview"
              ? "An actual component. Go ahead, interact with it."
              : "Copy the source into your project and make it your own."}
          </span>
          <span>React / Tailwind / Motion</span>
        </div>
      </div>
      <div className="component-switcher">
        {componentsRegistry.map((c) => (
          <a
            key={c.id}
            href={`#/component/${c.id}`}
            className={c.id === entry.id ? "selected" : ""}
          >
            {c.name}
            <ArrowUpRight size={13} />
          </a>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [hash, setHash] = useState(window.location.hash);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All components");
  const [theme, setTheme] = useState(
    () =>
      localStorage.getItem("motion-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"),
  );
  useEffect(() => {
    const handler = () => {
      setHash(window.location.hash);
      if (window.location.hash.startsWith("#/")) window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  useEffect(() => {
    if (hash === "#collection") document.getElementById("collection")?.scrollIntoView();
  }, [hash]);
  const embedId = new URLSearchParams(window.location.search).get("embed");
  const entry = componentsRegistry.find(
    (c) => c.id === hash.replace("#/component/", ""),
  );
  if (embedId) {
    const embedded = componentsRegistry.find((c) => c.id === embedId);
    if (!embedded) return <p>Component not found.</p>;
    const Demo = embedded.component;
    return (
      <div className="embed-root">
        <PreviewBoundary>
          <Suspense
            fallback={<div className="loading-state">Loading preview...</div>}
          >
            <Demo />
          </Suspense>
        </PreviewBoundary>
      </div>
    );
  }
  return (
    <div className="site" data-theme={theme}>
      <a className="skip-link" href="#main" onClick={event => { event.preventDefault(); document.getElementById("main")?.focus(); }}>
        Skip to content
      </a>
      <header className="site-header">
        <a className="brand" href="#" aria-label="Motion Library home">
          <span className="brand-mark">
            <i />
            <i />
            <i />
          </span>
          motion <span className="brand-secondary">library</span>
        </a>
        <nav aria-label="Main navigation">
          <a className="nav-collection" href="#collection">
            Components <span>{componentsRegistry.length}</span>
          </a>
          <a
            className="github-link"
            aria-label="GitHub repository"
            href={repo}
            target="_blank"
            rel="noreferrer"
          >
            <Code2 size={17} />
            <span>GitHub</span>
            <ArrowUpRight size={13} />
          </a>
          <button
            className="theme-toggle"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            onClick={() => {
              const next = theme === "dark" ? "light" : "dark";
              setTheme(next);
              localStorage.setItem("motion-theme", next);
            }}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        {entry ? (
          <Workshop key={entry.id} entry={entry} />
        ) : hash.startsWith("#/component/") ? (
          <div className="empty-state">
            <h1>Component not found.</h1>
            <a href="#collection">Back to collection</a>
          </div>
        ) : (
          <Gallery
            query={query}
            setQuery={setQuery}
            category={category}
            setCategory={setCategory}
          />
        )}
      </main>
      <footer className="site-footer">
        <a className="brand" href="#">
          motion <span className="brand-secondary">library</span>
        </a>
        <p>Small details. Better experiences.</p>
        <a href={repo} target="_blank" rel="noreferrer">
          View the source <ArrowUpRight size={14} />
        </a>
      </footer>
    </div>
  );
}
