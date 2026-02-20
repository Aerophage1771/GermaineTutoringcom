import { BlogPost } from "./types";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  snippet: string;
  tags: string[];
  author: string;
  readTime: number;
  content: string;
  featured_image?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "7-rc-tips-rules",
    title: "7 Tips for Dealing with the Hardest LSAT Reading Comp Questions",
    date: "2025-06-08",
    snippet: "Breaking down 7 concrete rules for tackling the toughest LSAT Reading Comprehension questions, with examples from a real test.",
    tags: ["reading-comprehension", "strategy", "lsat-prep", "rules"],
    author: "Germaine Washington",
    readTime: 8,
    content: `
      <p>I posted recently about analyzing LSAT practice tests and turning incorrect answers into rules you can apply going forward. Logical Reasoning often makes this easy because the arguments are compact and repeatable. Reading Comprehension can feel messier, but it still has repeatable, testable “process rules,” especially on the hardest questions where your first instinct is to reread and hope something clicks.</p>

      <p>The tips below were inspired by PrepTest 106, Section 4, Passage 2 (spoilers if you are saving it), but they are designed to be useful even if you have never seen that passage.</p>

      <h2>Rule 1: A strong Main Idea approach is two passes, not one</h2>
      <p>On harder Main Idea questions, do not try to “feel” the right answer. Use a two-pass elimination method.</p>
      <ul>
        <li><strong>First pass (factual check):</strong> Eliminate any answer that introduces information that the passage does not say.</li>
        <li><strong>Second pass (coverage check):</strong> Among the remaining factually accurate answers, choose the one with the broadest coverage. In plain terms, pick the answer that accounts for more of the passage’s key moves (major claims, contrast, and conclusion), rather than a true-but-narrow detail.</li>
      </ul>
      <blockquote><strong>Example (PT106 S4 P2, Q6):</strong> Several choices are wrong because they flip what the passage says about the size of effects or the reasoning behind an overestimate. The correct choice is the one that captures the full arc: a finding about a small global effect, followed by the explanation that regional effects can still be large through a particular mechanism discussed later.</blockquote>

      <h2>Rule 2: For difficult analogy questions, test both directions</h2>
      <p>Analogy questions are brutal because more than one answer can look “kind of similar.” When you are stuck, run a two-directional test.</p>
      <ul>
        <li><strong>Forward direction (default):</strong> Convert the passage’s situation into a general structure (for example, “a confounding factor causes an apparent effect that gets misattributed”), then eliminate answers that clearly do not match that structure.</li>
        <li><strong>Reverse direction (the tiebreaker):</strong> Take a tempting answer choice and ask, “If I were writing the passage, would this be the situation I would include to illustrate the same kind of error?” If the answer choice would require a different kind of passage, it is not the right analogy.</li>
      </ul>
      <blockquote><strong>Example (Q7):</strong> The passage’s error is misattributing temperature change to volcanoes when El Niño was a confounding factor. A wrong answer will often fail because it confuses what counts as the confounder versus the target cause, or because it treats the confounder as “fake data” rather than as a real causal force that simply needs to be separated. The correct answer matches the structure: a hidden cause affects the measured outcome, so you cannot isolate the effect of the cause you are trying to measure unless you control for the hidden cause.</blockquote>

      <h2>Rule 3: On LEAST, NOT, and EXCEPT questions, search for direct contradiction first</h2>
      <p>These stems are time traps because they invite you to “prove” four answers wrong one by one. Instead, start by scanning for an answer that directly contradicts what the question is asking for.</p>
      <p>Your goal is to find a choice that is clearly inconsistent with the passage or that clearly violates the condition in the stem. If you find it, you can often select it quickly and move on, rather than burning time validating four other answers.</p>
      <blockquote><strong>Example (Q8 and Q12):</strong> One wrong choice attributes the start of a process to the wrong cause, even though the passage explicitly assigns initiation to something else. Another wrong choice says there is no regional effect at all, even though the passage explicitly discusses regional effects. In both cases, you can win by spotting the contradiction instead of doing a full audit of every option.</blockquote>

      <h2>Rule 4: Meaning-in-context questions are won before you look at the answers</h2>
      <p>On meaning-in-context, the test punishes you for letting the answer choices define the word for you. You want a “pre-phrase,” meaning you decide the word’s function in the sentence using the nearby contrast and logic before you ever evaluate the options.</p>
      <p>Think of it like this: you are not defining the dictionary meaning of the word, you are identifying what the author is doing with it right there.</p>
      <blockquote><strong>Example (Q9):</strong> The passage contrasts “minor eruptions” with “major, dust-producing explosions.” So your pre-phrase should be something like, “minor means not dust-producing, or producing relatively little debris.” Several answer choices look like reasonable definitions of “minor” in isolation, but only the correct one captures the specific contrast the author is drawing.</blockquote>

      <h2>Rule 5: On concept-application questions, distill the concept into one abstract rule</h2>
      <p>These questions ask you to apply an idea from the passage to a new situation. The biggest mistake is dragging the entire paragraph into the answer choices. Instead, compress the concept into a simple abstract rule and trust it.</p>
      <p>If the concept is “feedback loop,” define it in your head as: “An initial change in X triggers a process that results in more X.” That is the core function. Then scan the answers for a situation where the same variable gets amplified.</p>
      <blockquote><strong>Example (Q10):</strong> Many wrong answers describe multi-step chains where X changes but does not end with more X, or where the system stabilizes (negative feedback) rather than amplifies. The correct answer is the one where an increase in X leads to a process that increases X further.</blockquote>

      <h2>Rule 6: For author-agreement questions, demand a quote or a clean inference anchor</h2>
      <p>Author-agreement questions are not vibe checks. The right answer is supported either by a direct quote or by a short, clean inference that is anchored in what the passage explicitly commits to.</p>
      <p>If you cannot point to the line or the explicit claim that forces your answer, you are taking a risk you do not need to take, especially on the hardest RC questions where tempting answers are written to feel “reasonable.”</p>
      <blockquote><strong>Example (Q11):</strong> Several choices are eliminated because they contradict stated measurements or stated descriptions. The correct choice is the one that follows from what the passage actually establishes about direct versus indirect effects. Even if the right answer is phrased broadly, it should still be traceable to a concrete anchor in the text.</blockquote>

      <h2>Rule 7: Paragraph-purpose questions are about the role the paragraph plays in the whole passage</h2>
      <p>To find a paragraph’s purpose, do not summarize it. Identify its job. Ask: “Given the passage’s overall argument, why did the author include this paragraph here?” Then run a removal test: “What would the passage lose if this paragraph disappeared?”</p>
      <p>A good pre-phrase here is usually a function statement, not a detail statement. For example: “This paragraph resolves an apparent conflict,” or “This paragraph explains how a limited finding can still produce a broader outcome.”</p>
      <blockquote><strong>Example (Q13):</strong> The final paragraph’s job is to explain how a small direct effect can still lead to the larger real-world outcome people associate with the phenomenon. The correct answer matches that function, not a minor detail from the paragraph.</blockquote>

      <h2>Closing thought</h2>
      <p>Reading Comprehension improvement accelerates when you stop treating misses as merely “I didn’t understand the passage” and start turning them into process rules you can repeat. Sometimes the problem really is comprehension, and if so, you fix that by tightening passage reading (slowing down, tracking viewpoint shifts, and re-paraphrasing dense sentences) until the structure becomes clear. But when comprehension is good enough to answer the question and you still miss, a process rule is how you remove that specific failure mode from future sections. Over time, those rules make the hardest questions feel far less unpredictable.</p>
    `
  },
  {
    slug: "mastering-logical-reasoning",
    title: "The #1 Worst Lie I See Students Tell Themselves (View of a 180 Scorer)",
    date: "2025-05-27",
    snippet: "A 180 scorer's take on why blaming the test for ambiguity is the biggest mistake you can make, and how to fix your process.",
    tags: ["mindset", "lsat-prep", "logical-reasoning", "motivation"],
    author: "Germaine Washington",
    readTime: 5,
    content: `
      <p>Far too often I see students here saying some variation of: "There are just some questions that are ambiguous and there's not much you can do about it." And that claim comes in multiple formats: "You need outside knowledge," or "There’s no consistent framework on the test."</p>
      
      <h2>Nonsense</h2>
      <p>Every single LSAT question has exactly one plausibly correct answer. Either the correct answer is unambiguously right, the incorrect answers are clearly wrong, or (usually) both. Now, if people want to argue that some questions are worded poorly or could be clearer, I get that. There are definitely some that suck.</p>
      
      <p>I recently saw a thread where someone asked how to start zeroing their LR, and the only comment said: “The LSAT isn’t consistent, so it’s not possible. There isn’t a strong internal logic to it…” Sorry, but no.</p>
      
      <p>The LSAT can be frustrating, but I was hitting -0 on about 90% of LR sections at the end of my practice. I’ve been tutoring for five years, and I’ve had multiple students consistently score -0 or -1. What you need to do is sit down and humbly drill into the flaws in your process.</p>
      
      <p>Take an untimed section. Record yourself talking through each question. Then review what you missed or couldn’t explain. Check explanations. Ask for feedback. Convert your errors into concrete rules for next time.</p>
      
      <p>Stop telling yourself you're just getting screwed by the test. You’re screwing yourself by not accepting that this test can be crushed if you commit to the work. So go do the damn work.</p>
    `
  },
  {
    slug: "weaken-question-strategy",
    title: "You Know Weakeners Should Hurt the Conclusion… But How?",
    date: "2025-06-01",
    snippet: "Four practical ways a weakener can undermine an LSAT argument, explained by a 180 scorer.",
    tags: ["logical-reasoning", "weaken", "lsat-prep"],
    author: "Germaine Washington",
    readTime: 4,
    content: `
      <p>Weaken questions can be stubborn for LSAT students. Ask most test-takers what a weakener does and you’ll hear: "It hurts the conclusion." Fine—<strong>but how?</strong> If you can’t state the typical mechanisms behind a weakener, narrowing the answer set on tougher items becomes guesswork.</p>

      <h2>A Four-Type Framework</h2>
      <p>I classify weakeners by where the info comes from and what it does:</p>
      
      <h3>1. Your Evidence Isn’t Strong (Premise - Attack)</h3>
      <p><strong>Effect:</strong> Directly attacks the quality of a premise. These challenge the reliability or completeness of the premises. Types: Pointing out sampling errors, flawed methods, or irrelevant data.</p>
      
      <h3>2. Your Evidence Fits Another Conclusion (Premise - Alternative)</h3>
      <p><strong>Effect:</strong> Reinterprets the premise to support a different outcome. They accept the facts provided but reinterpret their meaning. Types: Switching the direction of causation, posing alternate solutions.</p>
      
      <h3>3. New Info Hurts Your Conclusion (Non-Premise - Attack)</h3>
      <p><strong>Effect:</strong> Introduces facts that contradict the conclusion without touching the given premises. Example: "A new train will cut commute times... but most residents will keep driving."</p>
      
      <h3>4. New Info Suggests a Different Conclusion (Non-Premise - Alternative)</h3>
      <p><strong>Effect:</strong> Adds outside facts that shift priorities rather than refute logic. Example: "Product X may raise revenue, but Product Y would grow faster and we can't do both."</p>

      <h2>Why Bother Splitting Hairs?</h2>
      <p>The point isn’t rigid taxonomy; it’s having a fallback structure when a question feels amorphous. Use these four doors to guide your pre-phrase and slash time spent staring at five choices.</p>
    `
  },
  {
    slug: "score-improvement-timeline",
    title: "How to Train Yourself to Hit -0 on LR and RC (from a 180 Scorer)",
    date: "2025-06-05",
    snippet: "An intensive, step-by-step review process used by a 180 scorer to eliminate recurring errors and master the LSAT.",
    tags: ["lsat-prep", "logical-reasoning", "reading-comprehension", "strategy", "180-scorer"],
    author: "Germaine Washington",
    readTime: 8,
    content: `
      <p>The two questions I get most often from high-scoring students looking to hit that 175+ range consistently are: "How do you finally get rid of those same mistakes?" and "What do you do when every time you fix one mistake, it just results in another?"</p>
      
      <p>Here is the study process I used to get from -5 to -0. <strong>WARNING:</strong> This is intensive, demanding, and can be a grind. But it is also the most complete method I've found.</p>

      <h2>The Core Cycle</h2>
      <h3>Step 1: Take a Full-Length Timed Practice Test</h3>
      <p>Save your timed answers but do not look at the correct answers. Take a real break afterward.</p>

      <h3>Step 2: The COMPLETE Blind Review</h3>
      <p>For every single question (you haven't checked the answers yet), you need to write out or talk through your entire thought process. What is the question stem actually asking? Why is every single incorrect answer 100% incorrect?</p>

      <h3>Step 3: Audit Against the Answer Key</h3>
      <p>Now, check your answers. For any question you missed, find an external explanation and pinpoint exactly where your thought process went wrong.</p>

      <h3>Step 4: Rule Creation (The Most Important Step!!)</h3>
      <p>Convert your errors and breakthroughs into actionable rules. A <strong>good rule</strong> is specific and actionable, e.g., "In a conditional chain like 'A -> B+C', the contrapositive does not allow you to negate a standalone element like B."</p>

      <h3>Step 5: Triage and Implement Your Rules</h3>
      <p>Pick 3-5 to focus on for your next PT. Prioritize them based on how often the issue comes up.</p>

      <h2>How to Avoid Burnout</h2>
      <p>I usually recommend a three-test cycle...</p>
    `
  }
];
