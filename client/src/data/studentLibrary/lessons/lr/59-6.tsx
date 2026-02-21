import type { ContentBlock } from "@/types/studentLibrary";
import { ContentBlockRenderer } from "@/components/LearningLibrary/ContentBlockRenderer";

const content: ContentBlock[] = [{"type":"h3","text":"Module Conclusion: Test Day Strategy"},{"type":"paragraph","text":"You have learned that LSAT Math is not a math test; it is a logic test in disguise. To succeed, you need a rapid-fire diagnostic routine."},{"type":"h4","text":"Your Quantitative Reasoning Checklist"},{"type":"process","steps":["**1. What is the Language?** Identify the terms: Percentages? Averages? Rates? Raw numbers? Naming them primes your brain.","**2. What is the Context?** Challenge the numbers. \"A percentage... of what total?\" \"Is this sample representative?\" \"What skews this average?\"","**3. Is the Math Valid?** Check the calculation. \"Do groups overlap?\" \"Is the probability reversed?\" \"What about costs vs. revenue?\"","**4. Is the Prediction Sound?** If it claims something is \"due,\" ask if the events are independent (Gambler's Fallacy)."]},{"type":"paragraph","text":"Apply this checklist actively. When you see a number, don't freeze—interrogate it. You now have the tools to strip away the numerical smokescreen and attack the logical core."}];

export default function Lesson() {
  return (
    <div className="space-y-1">
      {content.map((block, index) => (
        <ContentBlockRenderer key={index} block={block} />
      ))}
    </div>
  );
}
