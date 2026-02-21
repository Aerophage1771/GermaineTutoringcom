import type { ContentBlock } from "@/types/studentLibrary";
import { ContentBlockRenderer } from "@/components/LearningLibrary/ContentBlockRenderer";

const content: ContentBlock[] = [{"type":"h3","text":"Lesson 5: Flawed Predictions"},{"type":"paragraph","text":"**Lesson Objective:** To identify arguments that incorrectly use past averages to predict future random events. Understanding independent vs. dependent events."},{"type":"h4","text":"The Gambler's Fallacy"},{"type":"paragraph","text":"The mistaken belief that probability has a \"memory\" and will self-correct in the short term."},{"type":"list","items":["**The Core Trap:** Believing an outcome is \"due\" because it hasn't happened recently.","**Example:** \"The coin landed heads 5 times. Tails is due!\" (Fact: The probability is still 50/50).","**LSAT Application (The Meteorite Case):** \"Meteorites strike every 100 million years on average. It's been 100 million years, so one is due.\" (Flaw: Nature doesn't keep a schedule. The probability is independent of the past)."]},{"type":"h4","text":"Independent vs. Dependent Events"},{"type":"paragraph","text":"This fallacy applies to **independent** events (coin flips, dice). It does *not* apply to dependent events (drawing cards from a deck without replacement), where past outcomes *do* change future odds. On the LSAT, arguments about \"averages\" predicting specific future events usually involve independent scenarios."},{"type":"callout","variant":"tip","title":"Lesson Takeaway","text":"When an argument predicts something is **\"due\"** or **\"bound to happen\"** based on past frequency, ask: **\"Are these events truly independent?\"** If so, the past does not influence the future."}];

export default function Lesson() {
  return (
    <div className="space-y-1">
      {content.map((block, index) => (
        <ContentBlockRenderer key={index} block={block} />
      ))}
    </div>
  );
}
