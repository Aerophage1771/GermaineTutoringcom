import type { ContentBlock } from "@/types/studentLibrary";
import { ContentBlockRenderer } from "@/components/LearningLibrary/ContentBlockRenderer";

const content: ContentBlock[] = [{"type":"h3","text":"Step-by-Step Approach"},{"type":"process","steps":["Read for the Overall Argument and Predict the Main Idea","Evaluate Answer Choices Using a Two-Step Test","Confirm Your Final Choice"]},{"type":"h4","text":"Step 1: Read for the Overall Argument and Predict the Main Idea"},{"type":"paragraph","text":"Your primary goal while reading is to understand the passage as a total argument. As you read, ask yourself: \"What is the point of this paragraph and how does it contribute to the passage as a whole?\" After reading, take a moment to consolidate these paragraphs into a main point in your own words before looking at the answer choices. A good prediction will summarize the primary topic and the author's conclusion about it."},{"type":"list","items":["The **last sentence of the first paragraph**","The **first sentence of each body paragraph**","The **final paragraph**"]},{"type":"h4","text":"Step 2: Evaluate Answer Choices Using a Two-Step Test"},{"type":"paragraph","text":"This is the most crucial step. Immediately look for an answer choice that matches the main idea you formulated. If a match isn't obvious, use this two-part filter to eliminate wrong answers."},{"type":"list","items":["**1. The Accuracy Test:** Your first filter is for basic accuracy. Eliminate any choice that is directly contradicted by the text, misrepresents the author's argument or tone, or contains information outside the scope of the passage.","**2. The Comprehensiveness Test:** After filtering for accuracy, you may have multiple choices left. The correct answer must be the most comprehensive one, encapsulating the entire passage's scope and purpose. A common trap is an answer that is factually correct but only covers a single paragraph or example."]},{"type":"h4","text":"Step 3: Confirm Your Final Choice"},{"type":"paragraph","text":"The answer you are left with should be both accurate and the most comprehensive summary of the author's primary purpose."}];

export default function Lesson() {
  return (
    <div className="space-y-1">
      {content.map((block, index) => (
        <ContentBlockRenderer key={index} block={block} />
      ))}
    </div>
  );
}
