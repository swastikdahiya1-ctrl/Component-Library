import { useId, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import { FileText, Image, Video } from "lucide-react";

const files = [
  {
    name: "Brand foundations",
    type: "Docs",
    icon: FileText,
    detail: "Updated today",
  },
  {
    name: "Summer campaign",
    type: "Images",
    icon: Image,
    detail: "12 artboards",
  },
  {
    name: "Motion principles",
    type: "Docs",
    icon: FileText,
    detail: "8 pages",
  },
  { name: "Launch sequence", type: "Video", icon: Video, detail: "00:24" },
];
const ease = [0.23, 1, 0.32, 1] as const;

export default function FilterableList() {
  const [filter, setFilter] = useState("All");
  const reduce = useReducedMotion();
  const id = useId();
  const visible = files.filter((f) => filter === "All" || f.type === filter);
  return (
    <div className="min-h-[100dvh] bg-[#080808] text-neutral-100 flex items-center justify-center p-6 font-['Geist']">
      <div className="w-full max-w-[470px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-medium tracking-tight">Library</h2>
          <span className="text-xs text-neutral-400" role="status">
            {visible.length} files
          </span>
        </div>
        <div
          className="inline-flex gap-1 mb-6 p-1 rounded-full bg-white/[.04] ring-1 ring-white/10"
          aria-label="File type"
        >
          {["All", "Docs", "Images", "Video"].map((type) => (
            <button
              key={type}
              aria-pressed={filter === type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2.5 rounded-full text-xs focus-visible:outline-2 focus-visible:outline-white ${filter === type ? "bg-[#eee] text-neutral-950" : "text-neutral-400"}`}
            >
              {type}
            </button>
          ))}
        </div>
        <LayoutGroup id={id}>
          <div className="relative min-h-[288px]">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map(({ name, type, icon: Icon, detail }) => (
                <motion.div
                  key={name}
                  layout={reduce ? false : "position"}
                  initial={{
                    opacity: 0,
                    transform: reduce ? "none" : "translateY(10px) scale(0.98)",
                  }}
                  animate={{
                    opacity: 1,
                    transform: "translateY(0px) scale(1)",
                  }}
                  exit={{
                    opacity: 0,
                    transform: reduce ? "none" : "translateX(16px) scale(0.98)",
                  }}
                  transition={{ duration: reduce ? 0.1 : 0.25, ease }}
                  className="flex items-center gap-4 px-4 py-4 mb-2 bg-[#151515] rounded-[14px] ring-1 ring-inset ring-white/[.06]"
                >
                  <span className="p-3 rounded-[10px] bg-[#242424] text-neutral-300 ring-1 ring-inset ring-white/[.06]">
                    <Icon size={20} strokeWidth={1.4} />
                  </span>
                  <div className="flex-1">
                    <h3 className="text-sm">{name}</h3>
                    <p className="mt-1 text-xs text-neutral-400">{detail}</p>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {type === "Docs"
                      ? ".md"
                      : type === "Images"
                        ? ".png"
                        : ".mov"}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      </div>
    </div>
  );
}
