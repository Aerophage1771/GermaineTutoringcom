import type { ContentBlock } from "@/types/studentLibrary";
import { ContentBlockRenderer } from "@/components/LearningLibrary/ContentBlockRenderer";

const content: ContentBlock[] = [{"type":"h3","text":"What Makes the Hardest MBT Questions Unique?"},{"type":"paragraph","text":"The hardest \"Must Be True\" questions are unique not because their logic is fundamentally different, but because of how that logic is **camouflaged, combined, or contextualized**. They are designed to punish superficial reading."},{"type":"h4","text":"Factor 1: High Cognitive Load"},{"type":"paragraph","text":"The LSAT presents a dense, multi-part rule or set of rules that you must hold in your working memory. The deduction itself is often simple, but accurately processing the complex setup is the main challenge (e.g., nested conditions, comparative elements)."},{"type":"h4","text":"Factor 2: Multi-Step Inference Chains"},{"type":"paragraph","text":"These questions require chaining together multiple pieces of information. The logical path is disguised through disjunctive premises (\"Either X or Y\") or chains requiring a contrapositive to link."},{"type":"h4","text":"Factor 3: Inferences from Disparity"},{"type":"paragraph","text":"These questions present two facts that seem slightly at odds. For example, a property of a subgroup conflicts with the property of the total population. The inference is almost always about the \"other\" group that must exist to balance the equation."},{"type":"h4","text":"Factor 4: Precision in Scope"},{"type":"paragraph","text":"These questions hinge on extremely precise language. They set up a narrow definition or causal mechanism, and the correct answer is the only one that respects those boundaries perfectly, while distractors tempt you with plausible assumptions."}];

export default function Lesson() {
  return (
    <div className="space-y-1">
      {content.map((block, index) => (
        <ContentBlockRenderer key={index} block={block} />
      ))}
    </div>
  );
}
