import type { ContentBlock } from "@/types/studentLibrary";
import { ContentBlockRenderer } from "@/components/LearningLibrary/ContentBlockRenderer";

const content: ContentBlock[] = [{"type":"h3","text":"The Trap Library: Common Distractors"},{"type":"breakdown","labels":{"title":"Trap Type","text":"Analysis"},"items":[{"title":"The \"Too Extreme\" Trap","text":"The most common trap. Takes a moderate claim and makes it absolute.\n**Signals:** All, every, none, never, only, always, completely, impossible.","badge":"Red Flag","badgeColor":"red"},{"title":"The \"Out of Scope\" Trap","text":"Introduces a new idea, comparison, or detail that is plausible but not mentioned in the text.","badge":"Irrelevant","badgeColor":"slate"},{"title":"The \"Reversed Relationship\" Trap","text":"Accurately identifies elements but flips their cause-and-effect or sequential relationship.","badge":"Reversal","badgeColor":"red"},{"title":"The \"Misattributed View\" Trap","text":"Assigns a belief or argument to the wrong person or group in multi-perspective passages.","badge":"Confusion","badgeColor":"indigo"},{"title":"The \"One Word Off\" Trap","text":"The answer choice is 99% correct, but a single word or phrase makes it unsupportable.","badge":"Subtle","badgeColor":"red"}]},{"type":"hr"},{"type":"h3","text":"Speed and Success Metrics"},{"type":"callout","variant":"tip","title":"Speed Tip: Eliminate Traps First","text":"Use the Trap Library to quickly eliminate 2-3 obvious distractors (especially \"Too Extreme\" and \"Out of Scope\" answers) before you return to the text to verify the remaining contenders. This focuses your search for proof and saves valuable time."},{"type":"h4","text":"Success Metrics: Gauging Mastery"},{"type":"paragraph","text":"You have mastered RC Inference questions when you can consistently demonstrate the following:"},{"type":"list","items":["**Accuracy:** You are correctly answering over 90% of inference questions under timed conditions.","**Confidence:** You are no longer \"stuck between two.\" You can confidently eliminate wrong answers by identifying the specific trap they represent.","**Process:** Your internal monologue shifts from \"Which answer feels right?\" to **\"Which answer has direct, provable support in the text?\"**"]}];

export default function Lesson() {
  return (
    <div className="space-y-1">
      {content.map((block, index) => (
        <ContentBlockRenderer key={index} block={block} />
      ))}
    </div>
  );
}
