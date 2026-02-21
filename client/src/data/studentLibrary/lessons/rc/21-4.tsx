import type { ContentBlock } from "@/types/studentLibrary";
import { ContentBlockRenderer } from "@/components/LearningLibrary/ContentBlockRenderer";

const content: ContentBlock[] = [{"type":"h3","text":"Trap Answer Types"},{"type":"paragraph","text":"Knowing what wrong answers look like is just as important as knowing the right one. Watch out for these four common traps."},{"type":"breakdown","labels":{"title":"Trap Type","text":"The Flaw"},"items":[{"title":"1. Inaccurate Information","text":"These choices contain a detail or claim that is factually incorrect according to the text. Often, the first half is correct, but the second half slips in an error.\n\n**The Flaw:** A Main Idea choice must be 100% accurate.","badge":"Factual Error","badgeColor":"red"},{"title":"2. Outside the Scope or Too Extreme","text":"These choices make a claim that goes beyond the evidence. They might be **Too Broad** (applying an argument too widely) or **Too Extreme** (using words like \"always\" or \"prove\" when the author was cautious).\n\n**The Flaw:** Making a claim the author never supported.","badge":"Unsupported","badgeColor":"red"},{"title":"3. Too Narrow","text":"The most frequent distractor. The answer is factually correct, but it only summarizes one paragraph or one example rather than the whole text.\n\n**The Flaw:** Lacks the comprehensiveness to represent the entire passage.","badge":"Partial Truth","badgeColor":"red"},{"title":"4. Opposing Viewpoint","text":"In debate passages, these choices accurately summarize the viewpoint the author is *arguing against*.\n\n**The Flaw:** Identifies the topic but misidentifies the author's stance.","badge":"Wrong Side","badgeColor":"red"}]}];

export default function Lesson() {
  return (
    <div className="space-y-1">
      {content.map((block, index) => (
        <ContentBlockRenderer key={index} block={block} />
      ))}
    </div>
  );
}
