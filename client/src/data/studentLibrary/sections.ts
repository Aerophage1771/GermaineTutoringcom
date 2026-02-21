import type { SectionData } from "@/types/studentLibrary";
import { BookOpen, Brain, FileText } from "lucide-react";

/** Section keys for lazy-loaded content. One chunk per section to avoid loading all JSON at once. */
export type SectionKey = "lr" | "rc" | "advanced";

export interface SectionMeta {
  key: SectionKey;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

/** Lightweight list for the section grid. No content loaded until user clicks. */
export const SECTION_LIST: SectionMeta[] = [
  {
    key: "lr",
    title: "Logical Reasoning",
    description: "Master argument analysis and logical thinking",
    icon: Brain,
    color: "bg-emerald-600 hover:bg-emerald-700",
  },
  {
    key: "rc",
    title: "Reading Comprehension",
    description: "Develop advanced reading and analysis skills",
    icon: BookOpen,
    color: "bg-purple-600 hover:bg-purple-700",
  },
  {
    key: "advanced",
    title: "Advanced Passages",
    description: "Practice with advanced passage types and questions",
    icon: FileText,
    color: "bg-slate-600 hover:bg-slate-700",
  },
];

/** Load one section's structure on demand (modules + lesson id/title only; lesson content is in .tsx). */
export async function loadSectionData(key: SectionKey): Promise<SectionData> {
  switch (key) {
    case "lr":
      return (await import("./lr.structure")).default;
    case "rc":
      return (await import("./rc.structure")).default;
    case "advanced":
      return (await import("./advanced.structure")).default;
    default:
      throw new Error(`Unknown section: ${key}`);
  }
}
