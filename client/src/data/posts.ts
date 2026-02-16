export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  snippet: string;
  tags: string[];
  author: string;
  content: string;
  readTime: number;
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
    readTime: 6,
    content: `
      <p>I posted recently about analyzing LSAT practice tests and turning incorrect answers into "rules" for the future. While Logical Reasoning lends itself more easily to rule-making, there are still plenty of rules that apply to Reading Comprehension. Here are a few inspired by a specific tough passage <strong>(LSAT 106 - Section 4 - Passage 2)</strong>, but they are meant to be broadly useful.</p>
      
      <h2>1. Main Idea Question Approach</h2>
      <p>For more difficult questions, you can use a two-pass elimination strategy.</p>
      <ul>
        <li><strong>First Pass (Factual Check):</strong> Eliminate any answer that includes information not found in the passage.</li>
        <li><strong>Second Pass (Coverage Check):</strong> Among the remaining factually accurate choices, choose the one that covers the broadest scope. Try to visualize which choice touches more of the key sections and arguments in the text.</li>
      </ul>

      <h2>2. Difficult Analogy Questions</h2>
      <p>Use a two-directional test if stuck on an Analogy question.</p>
      <ul>
        <li><strong>Forward Direction (Default):</strong> Convert the requested topic into general form and eliminate obvious answer mismatches.</li>
        <li><strong>Reverse Direction:</strong> Abstract a tempting answer’s structure and imagine how it would ideally be presented in the passage. If you were asked to write a passage that matches the answer's analogy, is this the one you would write? If no, consider removing that answer.</li>
      </ul>

      <h2>3. LEAST / EXCEPT Questions</h2>
      <p>In Least / Except questions, try scanning for a "silver bullet" answer first. This is an answer that directly contradicts the request given by the question stem. Often, people default to checking four incorrect answers to eliminate, while there might be a clear option they can select to save time.</p>

      <h2>4. Meaning in Context Questions</h2>
      <p>For "Meaning in Context" questions, defeat compelling but incorrect answer choices by pre-phrasing the word's specific function based on the nearby information in the passage. Decide on a meaning before getting swayed by answer choices.</p>

      <h2>5. Concept Application</h2>
      <p>When asked to apply a concept, first distill its core function into a simple, abstract rule and trust it. Scan the choices for a good match.</p>

      <h2>6. Author's Agreement Questions</h2>
      <p>Author’s Agreement questions have an answer that is supported by a clear inference from the passage. Don't take risks. Find a quote or a direct logical step to justify the Author's view you're asserting.</p>

      <h2>7. Paragraph Purpose Questions</h2>
      <p>To find a paragraph's purpose, determine its function in relation to the passage's overall argument. Pre-phrase your answer to the question: "Given the whole argument, why did the author add this paragraph here? What would the passage lose if it was removed?"</p>
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
