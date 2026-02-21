import type { ContentBlock } from "@/types/studentLibrary";
import { ContentBlockRenderer } from "@/components/LearningLibrary/ContentBlockRenderer";

const content: ContentBlock[] = [{"type":"h3","text":"Step-by-Step Approach"},{"type":"h4","text":"Step 1: Isolate the Original Relationship & State It Abstractly"},{"type":"paragraph","text":"Go to the specific scenario in the passage. Identify its key components (e.g., the cause, the effect, the intention, the outcome). Your goal is to create a simple, abstract sentence that describes this dynamic. Ignore the topic and focus on the logic."},{"type":"list","items":["**Example:** If the passage describes a tool created for scientific research that becomes popular as a children's toy, your abstract rule is: \"X is designed for a serious purpose but becomes widely used for an unintended, recreational one.\""]},{"type":"h4","text":"Step 2: Test Each Answer Choice Against Your Abstract Rule"},{"type":"paragraph","text":"Read each answer choice and break it down into its own components, just as you did with the original. Check if its underlying logic perfectly matches the abstract rule you created in Step 1. Be ruthless—eliminate any choice that has extra components, missing pieces, or a different sequence of events. The correct answer must be a perfect structural parallel."},{"type":"hr"},{"type":"h3","text":"If You Get Stuck Between Two Choices..."},{"type":"h4","text":"Tie-Breaker #1: The Reverse Test"},{"type":"paragraph","text":"Take one of your strong contenders and treat it as the original scenario. Create a new abstract rule based only on that answer choice. Now, ask yourself: \"Does the original scenario from the passage perfectly fit this new rule?\" If the fit is awkward or incomplete, it's likely the wrong answer. The correct answer and the original scenario should be interchangeable logical blueprints."},{"type":"h4","text":"Tie-Breaker #2: Focus on the Difference"},{"type":"paragraph","text":"Stop looking at how your final two choices are similar to the original. Instead, ask, \"What is the single key difference between these two answer choices?\" Isolate that one point of divergence. Then, go back to the passage one last time and check which choice's unique element is a better match for the original scenario's logic. This simplifies your final decision by focusing only on what separates the two options."}];

export default function Lesson() {
  return (
    <div className="space-y-1">
      {content.map((block, index) => (
        <ContentBlockRenderer key={index} block={block} />
      ))}
    </div>
  );
}
