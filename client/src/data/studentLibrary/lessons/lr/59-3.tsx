import type { ContentBlock } from "@/types/studentLibrary";
import { ContentBlockRenderer } from "@/components/LearningLibrary/ContentBlockRenderer";

const content: ContentBlock[] = [{"type":"h3","text":"Lesson 3: Lies, Damned Lies, and Averages"},{"type":"paragraph","text":"**Lesson Objective:** To deconstruct arguments that use averages (means, medians, and weighted averages) to conceal critical information. Treat the word \"average\" as a red flag."},{"type":"h4","text":"Fallacy 1: Total vs. Average vs. Individual"},{"type":"paragraph","text":"An unjustified leap between the group's total/average and individual performance."},{"type":"list","items":["**The Core Trap:** Confusing a change in the total with a change in individual members.","**Example:** \"Total sales went up, so each salesperson must be improving.\" (Flaw: Maybe they just hired more people).","**LSAT Application:** \"Average donation increased, so alumni are more generous.\" (Flaw: One billionaire could skew the average while the median donation dropped)."]},{"type":"h4","text":"Fallacy 2: The Weighted Average Fallacy"},{"type":"paragraph","text":"Failing to account for unequal subgroup sizes when combining averages."},{"type":"list","items":["**The Core Trap:** Ignoring the \"weight\" of different groups.","**Example:** \"Average salary in State A went up, and in State B went up. But the combined average went down. Impossible!\" (Fact: Possible if workers moved from the high-salary state to the low-salary state, shifting the weight).","**LSAT Application (Student Housing):** Overall rate is 38%. Dorm A is 29%. Dorm B must be significantly higher than 38% to pull the average up, especially if Dorm B is smaller."]},{"type":"h4","text":"Fallacy 3: The Mean vs. Median Fallacy"},{"type":"paragraph","text":"Using the mean to represent a \"typical\" case when outliers are skewing the data."},{"type":"list","items":["**The Core Trap:** Using the mean when the median is more appropriate.","**Example:** \"Average salary is $150k, so it's a great place for new grads.\" (Reality: CEO makes $5M, everyone else makes $40k).","**Deconstruction:** The mean hides the distribution. The median ($40k) tells the real story."]},{"type":"callout","variant":"summary","title":"Lesson Takeaway","text":"Never trust an average. Ask:\n1. **What skews this?** (Outliers?)\n2. **What are the group sizes?** (Weighted average?)\n3. **What does this really prove?** (Don't leap from average to individual)."}];

export default function Lesson() {
  return (
    <div className="space-y-1">
      {content.map((block, index) => (
        <ContentBlockRenderer key={index} block={block} />
      ))}
    </div>
  );
}
