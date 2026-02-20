import type { BlogPost } from "./types";

export const post: BlogPost = {
  slug: "7-rc-tips-rules",
  title: "7 Tips for Dealing with the Hardest LSAT Reading Comp Questions",
  date: "2025-06-08",
  snippet: "Breaking down 7 concrete rules for tackling the toughest LSAT Reading Comprehension questions, with examples from a real test.",
  tags: ["reading-comprehension", "strategy", "lsat-prep", "rules"],
  author: "Germaine Washington",
  readTime: 8,
  content: `
      <p>I posted recently about analyzing LSAT practice tests and turning incorrect answers into rules you can apply going forward. Logical Reasoning often makes this easy because the arguments are compact and repeatable. Reading Comprehension can feel messier, but it still has repeatable, testable "process rules," especially on the hardest questions where your first instinct is to reread and hope something clicks.</p>

      <p>The tips below were inspired by PrepTest 106, Section 4, Passage 2 (spoilers if you are saving it), but they are designed to be useful even if you have never seen that passage.</p>

      <h2>Rule 1: A strong Main Idea approach is two passes, not one</h2>
      <p>On harder Main Idea questions, do not try to "feel" the right answer. Use a two-pass elimination method.</p>
      <ul>
        <li><strong>First pass (factual check):</strong> Eliminate any answer that introduces information that the passage does not say.</li>
        <li><strong>Second pass (coverage check):</strong> Among the remaining factually accurate answers, choose the one with the broadest coverage. In plain terms, pick the answer that accounts for more of the passage's key moves (major claims, contrast, and conclusion), rather than a true-but-narrow detail.</li>
      </ul>
      <blockquote><strong>Example (PT106 S4 P2, Q6):</strong> Several choices are wrong because they flip what the passage says about the size of effects or the reasoning behind an overestimate. The correct choice is the one that captures the full arc: a finding about a small global effect, followed by the explanation that regional effects can still be large through a particular mechanism discussed later.</blockquote>

      <h2>Rule 2: For difficult analogy questions, test both directions</h2>
      <p>Analogy questions are brutal because more than one answer can look "kind of similar." When you are stuck, run a two-directional test.</p>
      <ul>
        <li><strong>Forward direction (default):</strong> Convert the passage's situation into a general structure (for example, "a confounding factor causes an apparent effect that gets misattributed"), then eliminate answers that clearly do not match that structure.</li>
        <li><strong>Reverse direction (the tiebreaker):</strong> Take a tempting answer choice and ask, "If I were writing the passage, would this be the situation I would include to illustrate the same kind of error?" If the answer choice would require a different kind of passage, it is not the right analogy.</li>
      </ul>
      <blockquote><strong>Example (Q7):</strong> The passage's error is misattributing temperature change to volcanoes when El Niño was a confounding factor. A wrong answer will often fail because it confuses what counts as the confounder versus the target cause, or because it treats the confounder as "fake data" rather than as a real causal force that simply needs to be separated. The correct answer matches the structure: a hidden cause affects the measured outcome, so you cannot isolate the effect of the cause you are trying to measure unless you control for the hidden cause.</blockquote>

      <h2>Rule 3: On LEAST, NOT, and EXCEPT questions, search for direct contradiction first</h2>
      <p>These stems are time traps because they invite you to "prove" four answers wrong one by one. Instead, start by scanning for an answer that directly contradicts what the question is asking for.</p>
      <p>Your goal is to find a choice that is clearly inconsistent with the passage or that clearly violates the condition in the stem. If you find it, you can often select it quickly and move on, rather than burning time validating four other answers.</p>
      <blockquote><strong>Example (Q8 and Q12):</strong> One wrong choice attributes the start of a process to the wrong cause, even though the passage explicitly assigns initiation to something else. Another wrong choice says there is no regional effect at all, even though the passage explicitly discusses regional effects. In both cases, you can win by spotting the contradiction instead of doing a full audit of every option.</blockquote>

      <h2>Rule 4: Meaning-in-context questions are won before you look at the answers</h2>
      <p>On meaning-in-context, the test punishes you for letting the answer choices define the word for you. You want a "pre-phrase," meaning you decide the word's function in the sentence using the nearby contrast and logic before you ever evaluate the options.</p>
      <p>Think of it like this: you are not defining the dictionary meaning of the word, you are identifying what the author is doing with it right there.</p>
      <blockquote><strong>Example (Q9):</strong> The passage contrasts "minor eruptions" with "major, dust-producing explosions." So your pre-phrase should be something like, "minor means not dust-producing, or producing relatively little debris." Several answer choices look like reasonable definitions of "minor" in isolation, but only the correct one captures the specific contrast the author is drawing.</blockquote>

      <h2>Rule 5: On concept-application questions, distill the concept into one abstract rule</h2>
      <p>These questions ask you to apply an idea from the passage to a new situation. The biggest mistake is dragging the entire paragraph into the answer choices. Instead, compress the concept into a simple abstract rule and trust it.</p>
      <p>If the concept is "feedback loop," define it in your head as: "An initial change in X triggers a process that results in more X." That is the core function. Then scan the answers for a situation where the same variable gets amplified.</p>
      <blockquote><strong>Example (Q10):</strong> Many wrong answers describe multi-step chains where X changes but does not end with more X, or where the system stabilizes (negative feedback) rather than amplifies. The correct answer is the one where an increase in X leads to a process that increases X further.</blockquote>

      <h2>Rule 6: For author-agreement questions, demand a quote or a clean inference anchor</h2>
      <p>Author-agreement questions are not vibe checks. The right answer is supported either by a direct quote or by a short, clean inference that is anchored in what the passage explicitly commits to.</p>
      <p>If you cannot point to the line or the explicit claim that forces your answer, you are taking a risk you do not need to take, especially on the hardest RC questions where tempting answers are written to feel "reasonable."</p>
      <blockquote><strong>Example (Q11):</strong> Several choices are eliminated because they contradict stated measurements or stated descriptions. The correct choice is the one that follows from what the passage actually establishes about direct versus indirect effects. Even if the right answer is phrased broadly, it should still be traceable to a concrete anchor in the text.</blockquote>

      <h2>Rule 7: Paragraph-purpose questions are about the role the paragraph plays in the whole passage</h2>
      <p>To find a paragraph's purpose, do not summarize it. Identify its job. Ask: "Given the passage's overall argument, why did the author include this paragraph here?" Then run a removal test: "What would the passage lose if this paragraph disappeared?"</p>
      <p>A good pre-phrase here is usually a function statement, not a detail statement. For example: "This paragraph resolves an apparent conflict," or "This paragraph explains how a limited finding can still produce a broader outcome."</p>
      <blockquote><strong>Example (Q13):</strong> The final paragraph's job is to explain how a small direct effect can still lead to the larger real-world outcome people associate with the phenomenon. The correct answer matches that function, not a minor detail from the paragraph.</blockquote>

      <h2>Closing thought</h2>
      <p>Reading Comprehension improvement accelerates when you stop treating misses as merely "I didn't understand the passage" and start turning them into process rules you can repeat. Sometimes the problem really is comprehension, and if so, you fix that by tightening passage reading (slowing down, tracking viewpoint shifts, and re-paraphrasing dense sentences) until the structure becomes clear. But when comprehension is good enough to answer the question and you still miss, a process rule is how you remove that specific failure mode from future sections. Over time, those rules make the hardest questions feel far less unpredictable.</p>
    `,
};
