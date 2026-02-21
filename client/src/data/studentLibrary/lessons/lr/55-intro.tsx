import type { ContentBlock } from "@/types/studentLibrary";
import { ContentBlockRenderer } from "@/components/LearningLibrary/ContentBlockRenderer";

const content: ContentBlock[] = [{"type":"h2","text":"Module: The Logic of Conditional Reasoning"},{"type":"paragraph","text":"Conditional reasoning sits at the center of the LSAT. For most students, it feels like the hardest part of the test because it does not follow the way we normally talk and think."},{"type":"paragraph","text":"In everyday life, we fill in gaps and assume what other people probably mean. On the LSAT, that habit gets you into trouble. The test is built to take advantage of loose, intuitive thinking. To succeed, you have to slow down and focus only on what the words actually say."},{"type":"paragraph","text":"In this module, you will learn how to see the logic beneath the language. We will begin with the basic if-then statement. Then we will practice contraposing statements correctly, linking rules together, and handling important ideas like some and most."},{"type":"paragraph","text":"By the end of this module, you will no longer rely on answers that simply feel correct. You will be able to show, step by step, what must be true."},{"type":"paragraph","text":"Let’s get started."}];

export default function Lesson() {
  return (
    <div className="space-y-1">
      {content.map((block, index) => (
        <ContentBlockRenderer key={index} block={block} />
      ))}
    </div>
  );
}
