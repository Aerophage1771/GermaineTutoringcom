import type { ContentBlock } from "@/types/studentLibrary";
import { ContentBlockRenderer } from "@/components/LearningLibrary/ContentBlockRenderer";

const content: ContentBlock[] = [{"type":"h3","text":"Step-by-Step Approach"},{"type":"h4","text":"Step 1: Create a Passage Blueprint"},{"type":"paragraph","text":"After reading, create a quick, high-level map of the passage's structure. For each paragraph, write a short, functional summary. Don't summarize the content; summarize the paragraph's job. Use abstract verbs to describe what the author is doing."},{"type":"list","items":["**Example Blueprint:**","Para 1: Introduces a common theory.","Para 2: Presents evidence that challenges this theory.","Para 3: Proposes an alternative theory.","Para 4: Discusses the implications of the alternative theory."]},{"type":"h4","text":"Step 2: Match Your Blueprint to the Answer Choices"},{"type":"paragraph","text":"Systematically compare the structural description in each answer choice to the blueprint you created. The correct answer will be the one that most accurately maps the entire logical flow. Eliminate any choice that misrepresents the function or sequence of even one part of the passage. For comparative passages, your blueprint should map the relationship between the two passages (e.g., Passage A presents a theory; Passage B applies it to a specific case)."},{"type":"hr"},{"type":"h3","text":"If You Get Stuck Between Two Choices..."},{"type":"h4","text":"Tie-Breaker #1: Focus on the Verbs"},{"type":"paragraph","text":"Isolate the primary action verbs in your final two choices (e.g., \"refuting\" vs. \"qualifying,\" \"contrasting\" vs. \"evaluating\"). Go back to the passage and ask which verb more precisely describes what the author is actually doing. Does the author completely tear down the old theory (refute), or just point out its limitations while acknowledging some value (qualify)? This precision is often the deciding factor."},{"type":"h4","text":"Tie-Breaker #2: Check the Scope and Emphasis"},{"type":"paragraph","text":"Re-read your two final choices. Does one of them describe a minor, supporting part of the passage as if it were a main structural component? The best answer will accurately reflect the weight and emphasis the author gives to each part of the argument. For example, if the author spends three paragraphs critiquing a theory and one sentence mentioning an alternative, an answer describing the passage as \"contrasting two theories\" is likely less accurate than one describing it as \"critiquing a prevailing view.\""}];

export default function Lesson() {
  return (
    <div className="space-y-1">
      {content.map((block, index) => (
        <ContentBlockRenderer key={index} block={block} />
      ))}
    </div>
  );
}
