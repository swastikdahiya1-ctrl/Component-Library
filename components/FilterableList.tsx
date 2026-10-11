import { useId, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight, FileText, Image, Video } from "lucide-react";

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
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[420px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium tracking-tight">
            Your working files
          </h2>
          <span className="text-xs text-zinc-400" role="status">
            {visible.length} files
          </span>
        </div>
        <div className="flex gap-2 mb-6" aria-label="File type">
          {["All", "Docs", "Images", "Video"].map((type) => (
            <button
              key={type}
              aria-pressed={filter === type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg text-xs focus-visible:outline-2 focus-visible:outline-lime-300 ${filter === type ? "bg-lime-300 text-zinc-950" : "bg-zinc-900 text-zinc-400"}`}
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
                  layout="position"
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
                  className="flex items-center gap-4 p-4 mb-2 bg-zinc-900 rounded-xl border border-zinc-800"
                >
                  <span
                    className={`p-3 rounded-lg ${type === "Docs" ? "bg-lime-300/10 text-lime-300" : type === "Images" ? "bg-blue-300/10 text-blue-300" : "bg-orange-300/10 text-orange-300"}`}
                  >
                    <Icon size={18} />
                  </span>
                  <div className="flex-1">
                    <h3 className="text-sm">{name}</h3>
                    <p className="mt-1 text-xs text-zinc-400">{detail}</p>
                  </div>
                  <ArrowUpRight size={15} className="text-zinc-500" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      </div>
    </div>
  );
}
