import type { ContentBlock } from "@/types/studentLibrary";
import { ContentBlockRenderer } from "@/components/LearningLibrary/ContentBlockRenderer";

const content: ContentBlock[] = [{"type":"h3","text":"Pattern Recognition: Correct Answers"},{"type":"list","items":["**The \"Two-Part Proof\" (Combining Facts):** This pattern involves logically combining two or more facts, often from different parts of the passage, to create a single, undeniable conclusion that is not stated on its own.","**The \"Necessarily Consequenced\":** This pattern occurs when a statement in the passage logically necessitates another statement to be true, often by ruling out other possibilities based on the provided text.","**Cautious Wording Matches Cautious Evidence:** This pattern reflects the careful, qualified language of the passage. Correct answers often use words like *some*, *can*, *may*, *likely* because the evidence they are based on is rarely absolute."]},{"type":"hr"},{"type":"h3","text":"Tactics, Do's and Don'ts"},{"type":"breakdown","labels":{"title":"Principle","text":"Guidelines"},"items":[{"title":"Evidence & Proof","text":"**DO:** Treat the passage as your only source of evidence. Pinpoint specific lines for proof.\n**DON'T:** Use outside knowledge. If the passage doesn't say it, it doesn't exist.","badge":"Discipline","badgeColor":"indigo"},{"title":"Standard of Proof","text":"**DO:** Apply the \"Must Be True\" standard. Look for logically unavoidable conclusions.\n**DON'T:** Settle for \"Could Be True.\" If it requires a debatable assumption, it is wrong.","badge":"Rigor","badgeColor":"blue"},{"title":"Precision & Wording","text":"**DO:** Pay close attention to wording. Look for careful paraphrasing.\n**DON'T:** Fall for keyword matching. Trap answers often lift phrases but distort the context.","badge":"Focus","badgeColor":"green"},{"title":"Focus & Attribution","text":"**DO:** Ensure your proof directly answers the question. Attribute views to the correct person.\n**DON'T:** Get sidetracked. Don't confuse the author's view with a cited critic's view.","badge":"Accuracy","badgeColor":"red"}]}];

export default function Lesson() {
  return (
    <div className="space-y-1">
      {content.map((block, index) => (
        <ContentBlockRenderer key={index} block={block} />
      ))}
    </div>
  );
}
