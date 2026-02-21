/**
 * Codegen: from lr.json, rc.json, advanced.json produces:
 * - lr.structure.ts, rc.structure.ts, advanced.structure.ts (section + modules, lessons as { id, title } only)
 * - lessons/<key>/<lessonId>.tsx for each lesson (default-export React component using ContentBlockRenderer)
 *
 * Run from repo root: node scripts/generate-lesson-tsx.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(REPO_ROOT, "client", "src", "data", "studentLibrary");
const LESSONS_DIR = path.join(DATA_DIR, "lessons");

const SECTIONS = [
  { key: "lr", jsonFile: "lr.json" },
  { key: "rc", jsonFile: "rc.json" },
  { key: "advanced", jsonFile: "advanced.json" },
];

function escapeTsString(s) {
  if (typeof s !== "string") return s;
  return s
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r");
}

function writeStructureFile(key, data) {
  const section = data.section;
  const modules = data.modules.map((m) => ({
    id: m.id,
    title: m.title,
    category: m.category,
    unit: m.unit,
    description: m.description,
    lessons: m.lessons.map((l) => ({ id: l.id, title: l.title })),
  }));
  const out = `import type { SectionData } from "@/types/studentLibrary";

const data: SectionData = ${JSON.stringify({ section, modules }, null, 2)};

export default data;
`;
  const filePath = path.join(DATA_DIR, `${key}.structure.ts`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, out, "utf8");
  console.log("Wrote", filePath);
}

function writeLessonTsx(sectionKey, lessonId, content) {
  const contentJson = JSON.stringify(content);
  const out = `import type { ContentBlock } from "@/types/studentLibrary";
import { ContentBlockRenderer } from "@/components/LearningLibrary/ContentBlockRenderer";

const content: ContentBlock[] = ${contentJson};

export default function Lesson() {
  return (
    <div className="space-y-1">
      {content.map((block, index) => (
        <ContentBlockRenderer key={index} block={block} />
      ))}
    </div>
  );
}
`;
  const dir = path.join(LESSONS_DIR, sectionKey);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${lessonId}.tsx`);
  fs.writeFileSync(filePath, out, "utf8");
}

let totalLessons = 0;
for (const { key, jsonFile } of SECTIONS) {
  const jsonPath = path.join(DATA_DIR, jsonFile);
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  writeStructureFile(key, data);
  for (const mod of data.modules) {
    for (const lesson of mod.lessons) {
      writeLessonTsx(key, lesson.id, lesson.content);
      totalLessons++;
    }
  }
}
console.log("Wrote", totalLessons, "lesson .tsx files.");
