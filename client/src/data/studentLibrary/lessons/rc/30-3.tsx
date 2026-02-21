import type { ContentBlock } from "@/types/studentLibrary";
import { ContentBlockRenderer } from "@/components/LearningLibrary/ContentBlockRenderer";

const content: ContentBlock[] = [{"type":"h3","text":"Pattern Recognition"},{"type":"paragraph","text":"By analyzing this question type, we can identify three common patterns. Recognizing these will help you anticipate the structure of the correct answer."},{"type":"breakdown","labels":{"title":"Pattern Type","text":"Clue & Structure"},"items":[{"title":"Pattern 1: The Standard of Evaluation","text":"**Clue:** The question asks for the basis of an author's or critic's judgment or evaluation of something (e.g., a work of art, a theory, a historical narrative).\n**Pattern:** The correct answer will state the criterion for what makes something \"good,\" \"valuable,\" \"acceptable,\" or \"correct\" according to that person's viewpoint. The principle often takes the form: \"Something is valuable if it accomplishes X.\"","badge":"Evaluation","badgeColor":"indigo"},{"title":"Pattern 2: The Justification for Action","text":"**Clue:** The question asks for the principle behind the actions or decisions of a person or group described in the passage.\n**Pattern:** The correct answer will be a general rule that explains the underlying motivation or justification for that behavior, often framed with words like \"should\" or \"must.\" The principle often takes the form: \"One should act in a way that achieves X.\"","badge":"Justification","badgeColor":"blue"},{"title":"Pattern 3: The Underlying Logical Rule","text":"**Clue:** The question asks for the principle behind a specific line of reasoning or the rejection of a theory.\n**Pattern:** The correct answer will state the unstated logical assumption or rule that connects the evidence to the conclusion. It's often a general rule of logic or scientific inquiry. For example, if the passage says a conclusion was reached because of a lack of evidence, the principle might be that a lack of evidence can be used to disprove a claim.","badge":"Logic","badgeColor":"green"}]}];

export default function Lesson() {
  return (
    <div className="space-y-1">
      {content.map((block, index) => (
        <ContentBlockRenderer key={index} block={block} />
      ))}
    </div>
  );
}
