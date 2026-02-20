import type { SectionData } from "@/types/studentLibrary";

// Import JSON from repo root (parent of client). Content is bundled at build.
import lrJson from "../../../Student_Content_JSON/LSAT_Logical_Reasoning.json";
import rcJson from "../../../Student_Content_JSON/LSAT_Reading_Comprehension.json";
import advancedJson from "../../../Student_Content_JSON/LSAT_Advanced_Passages.json";

export const logicalReasoningData = lrJson as SectionData;
export const readingComprehensionData = rcJson as SectionData;
export const advancedPassagesData = advancedJson as SectionData;

export const studentLibrarySections: SectionData[] = [
  logicalReasoningData,
  readingComprehensionData,
  advancedPassagesData,
];
