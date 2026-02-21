import type { ContentBlock } from "@/types/studentLibrary";
import { ContentBlockRenderer } from "@/components/LearningLibrary/ContentBlockRenderer";

const content: ContentBlock[] = [{"type":"h3","text":"Step-by-Step Approach"},{"type":"process","steps":["Scan for stated Answer Choices First","Look for Direct Matches","Eliminate Obvious Falsities","Locate & Clarify Uncertain Choices","Validate Indirect Inferences"]},{"type":"h4","text":"Step 1: Scan for stated Answer Choices First"},{"type":"paragraph","text":"Look for an answer that matches a detail you confidently recall. If you are absolutely sure it is supported and know why the others are likely wrong, select it and move on."},{"type":"h4","text":"Step 2: Look for Direct Matches"},{"type":"paragraph","text":"If no immediate answer stands out, scan the choices again for any that are close paraphrases of statements made in the text. This is often the quickest path to a correct answer."},{"type":"h4","text":"Step 3: Eliminate Obvious Falsities"},{"type":"paragraph","text":"If no direct match exists, review the remaining choices to identify and eliminate any that are obviously untrue or in direct conflict with the passage's main points or tone. This narrows the field of contenders."},{"type":"h4","text":"Step 4: Locate & Clarify Uncertain Choices"},{"type":"paragraph","text":"For the remaining choices that are in scope but you are unsure about, classify the information they contain (e.g., \"this is about the author's opinion,\" \"this is a scientific detail\"). Then, search the passage for where that specific topic is discussed. This targeted search is more efficient than reading."},{"type":"h4","text":"Step 5: Validate Indirect Inferences"},{"type":"paragraph","text":"For your top contenders, look for how information from different parts of the passage connects indirectly to prove the answer choice. These longer inferences are often a point of difficulty but can net you crucial points if you can trace the logical steps."},{"type":"list","items":["**Causality:** If an answer choice involves one thing causing another, look for signal words like *because, since, as a result, therefore, due to, consequently*.","**Contrasts:** Look for words like *however, but, in contrast, unlike, while*. If the passage contrasts A and B, a stated fact about A often allows you to infer the opposite about B.","**Definitions & Examples:** When a passage defines a category and then gives an example, you can infer that the example has the characteristics of that category."]}];

export default function Lesson() {
  return (
    <div className="space-y-1">
      {content.map((block, index) => (
        <ContentBlockRenderer key={index} block={block} />
      ))}
    </div>
  );
}
