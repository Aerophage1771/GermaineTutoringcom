import type { ContentBlock } from "@/types/studentLibrary";
import { ContentBlockRenderer } from "@/components/LearningLibrary/ContentBlockRenderer";

const content: ContentBlock[] = [{"type":"h3","text":"Characteristics of High-Difficulty Most Strongly Supported Questions"},{"type":"paragraph","text":"Easy and medium-difficulty Most Strongly Supported questions typically involve a straightforward synthesis of two or three facts. The hardest questions, however, demand more sophisticated logical operations and a higher degree of precision. They are designed to trap test-takers who rely on intuition or superficial readings."},{"type":"h4","text":"1. Inference by Constraint"},{"type":"paragraph","text":"The stimulus establishes a strict boundary by using superlative language (\"purest,\" \"only,\" \"best,\" \"never\") or an exclusive definition. The inference is not about the item that meets this high standard, but about everything else that necessarily *fails* to meet it. You are required to reason about an implied or \"negative space\" category."},{"type":"h4","text":"2. Navigating Logical Density"},{"type":"paragraph","text":"These questions present a compact, intricate web of rules, where multiple conditional statements and quantifiers (\"all,\" \"most,\" \"some\") interact. The correct inference is a precisely worded statement that successfully traces a path through this logical maze without making a single misstep."},{"type":"h4","text":"3. Exploiting Semantic Nuance"},{"type":"paragraph","text":"Here, the difficulty is not in the complexity of the argument's structure, but in the precise, literal meaning of seemingly simple words or phrases. The entire inference often pivots on a subtle distinction that most test-takers read over too quickly (e.g., reading \"not necessarily social\" as \"antisocial\")."},{"type":"h4","text":"4. Cognitive Load from Task Framing"},{"type":"paragraph","text":"This often appears in the \"Least Supported\" format, which inverts the task: instead of finding one supported statement, you must find one *unsupported* statement, which requires you to test the validity of the other four. For dialogues, you must track who is saying what and what each statement logically implies about the other."}];

export default function Lesson() {
  return (
    <div className="space-y-1">
      {content.map((block, index) => (
        <ContentBlockRenderer key={index} block={block} />
      ))}
    </div>
  );
}
