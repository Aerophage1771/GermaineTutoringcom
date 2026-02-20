/** Content block types used in Student_Content_JSON lesson content */
export type ContentBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "h4"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "blockquote"; text: string }
  | { type: "hr" }
  | { type: "callout"; title?: string; variant?: string; text: string }
  | {
      type: "breakdown";
      labels: { title: string; text: string };
      items: Array<{ title: string; text: string; badge?: string; badgeColor?: string }>;
    }
  | { type: "accordion"; title: string; content: string }
  | { type: "options"; items: string[] }
  | { type: "process"; steps: string[] };

export interface Lesson {
  id: string;
  title: string;
  content: ContentBlock[];
}

export interface LibraryModule {
  id: number;
  title: string;
  category: string;
  unit: string;
  description: string;
  lessons: Lesson[];
}

export interface SectionData {
  section: string;
  modules: LibraryModule[];
}
