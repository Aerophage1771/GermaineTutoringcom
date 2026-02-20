import type { SectionKey } from "./sections";

/** Module and lesson counts per section. Used for the section grid without loading full content. */
export const SECTION_COUNTS: Record<SectionKey, { modules: number; lessons: number }> = {
  lr: { modules: 22, lessons: 201 },
  rc: { modules: 27, lessons: 107 },
  advanced: { modules: 7, lessons: 47 },
};
