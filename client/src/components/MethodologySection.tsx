import { useState } from 'react';

const MethodologySection = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const defineContent = (
    // ADDED justify-center to vertically center the entire content block within this column
    <div className="p-5 bg-blue-50 rounded-b-lg md:rounded-bl-lg md:rounded-br-none border-t border-blue-100 h-full flex flex-col justify-center">
      <div> {/* Inner wrapper for content to be centered */}
        <h4 className="font-heading text-primary font-semibold mb-4">The DEFINE Process:</h4>
        <ul className="space-y-1">
          <li>
            <div className="flex items-start min-h-[4.5rem]">
              <span className="font-semibold w-28 h-12 flex items-center shrink-0">Name it:</span>
              <span className="ml-2 text-sm pt-1">Assign a clear label to the concept or technique (e.g., "Flaw Questions").</span>
            </div>
          </li>
          <li>
            <div className="flex items-start min-h-[4.5rem]">
              <span className="font-semibold w-28 h-12 flex items-center shrink-0">Describe it:</span>
              <span className="ml-2 text-sm pt-1">Provide a concise, jargon-free explanation of what it is and its core purpose.</span>
            </div>
          </li>
          <li>
            <div className="flex items-start min-h-[4.5rem]">
              <span className="font-semibold w-28 h-12 flex items-center shrink-0">Contextualize it:</span>
              <span className="ml-2 text-sm pt-1">Explain its significance, and where it typically appears (e.g., specific LSAT sections).</span>
            </div>
          </li>
          <li>
            <div className="flex items-start min-h-[4.5rem]">
              <span className="font-semibold w-28 h-12 flex items-center shrink-0">Deconstruct it:</span>
              <span className="ml-2 text-sm pt-1">Break it down into essential features, components, or common identifying markers.</span>
            </div>
          </li>
        </ul>

        {/* ADDED fixed height h-[300px] and overflow-y-auto */}
        <div className="mt-6 bg-white p-4 rounded-lg border border-blue-100 h-[300px] overflow-y-auto">
          <p className="font-semibold text-primary mb-2 text-base">Example: Defining "Flaw Questions"</p>
          <p className="mb-1 text-sm"><span className="font-semibold">Objective:</span> Establish a clear, actionable understanding of the "Flaw Question" type.</p>
          <p className="mt-2 mb-1 text-sm font-semibold">Key Elements Defined:</p>
          <ul className="list-disc pl-5 text-xs sm:text-sm space-y-0.5">
            <li><span className="font-semibold">Core Concept:</span> What these questions ask (i.e., identify reasoning errors).</li>
            <li><span className="font-semibold">Strategic Importance:</span> Why they matter for LSAT success (i.e., test critical analysis).</li>
            <li><span className="font-semibold">Common Identifiers:</span> Typical question phrasing and structural cues to look for.</li>
            <li><span className="font-semibold">Categorical Flaw Types:</span> Key examples of logical fallacies (e.g., Equivocation, Ad Hominem).</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const demonstrateContent = (
    // ADDED justify-center
    <div className="p-5 bg-blue-50 md:rounded-none border-t border-blue-100 h-full flex flex-col justify-center">
       <div> {/* Inner wrapper for content to be centered */}
        <h4 className="font-heading text-primary font-semibold mb-4">The DEMONSTRATE Process:</h4>
        <ul className="space-y-1">
          <li>
            <div className="flex items-start min-h-[4.5rem]">
              <span className="font-semibold w-28 h-12 flex items-center shrink-0">Walkthrough:</span>
              <span className="ml-2 text-sm pt-1">Apply the defined concept by working through a representative example, narrating the thought process.</span>
            </div>
          </li>
          <li>
            <div className="flex items-start min-h-[4.5rem]">
              <span className="font-semibold w-28 h-12 flex items-center shrink-0">Highlight decision points:</span>
              <span className="ml-2 text-sm pt-1">Explicitly show and explain key analytical choices and why they are made during the example.</span>
            </div>
          </li>
          <li>
            <div className="flex items-start min-h-[4.5rem]">
              <span className="font-semibold w-28 h-12 flex items-center shrink-0">Compare with errors:</span>
              <span className="ml-2 text-sm pt-1">Illustrate common mistakes or "bad" approaches to contrast with and reinforce the correct method.</span>
            </div>
          </li>
          <li>
            <div className="flex items-start min-h-[4.5rem]">
              <span className="font-semibold w-28 h-12 flex items-center shrink-0">Encourage observation:</span>
              <span className="ml-2 text-sm pt-1">Guide the learner to actively watch for specific patterns or defined markers during the demonstration.</span>
            </div>
          </li>
        </ul>

        {/* ADDED fixed height h-[300px] and overflow-y-auto */}
        <div className="mt-6 bg-white p-4 rounded-lg border border-blue-100 h-[300px] overflow-y-auto">
          <p className="font-semibold text-primary mb-2 text-base">Example: Demonstrating Flaw Analysis</p>
          <p className="mb-1 text-sm"><span className="font-semibold">Objective:</span> Illustrate the practical application of the defined framework to a sample Flaw Question.</p>
          <p className="mt-2 mb-1 text-sm font-semibold">Demonstration Focus:</p>
          <ul className="list-disc pl-5 text-xs sm:text-sm space-y-0.5">
              <li><span className="font-semibold">Argument Deconstruction:</span> Modeling how to identify conclusion, premises, and the core reasoning gap.</li>
              <li><span className="font-semibold">Flaw Identification:</span> Connecting the identified gap to specific, previously defined flaw categories.</li>
              <li><span className="font-semibold">Answer Choice Evaluation:</span> Articulating why incorrect options fail and how the correct one matches the flaw.</li>
              <li><span className="font-semibold">Recognizing Strategic Cues:</span> Highlighting textual markers or patterns that signal the flaw type.</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const duplicateContent = (
    // ADDED justify-center
    <div className="p-5 bg-blue-50 rounded-b-lg md:rounded-br-lg md:rounded-bl-none border-t border-blue-100 h-full flex flex-col justify-center">
      <div> {/* Inner wrapper for content to be centered */}
        <h4 className="font-heading text-primary font-semibold mb-4">The DUPLICATE Process:</h4>
        <ul className="space-y-1">
          <li>
            <div className="flex items-start min-h-[4.5rem]">
              <span className="font-semibold w-28 h-12 flex items-center shrink-0">Guided repetition:</span>
              <span className="ml-2 text-sm pt-1">Begin with scaffolded practice; offer hints, partial steps, or checklists for initial independent work.</span>
            </div>
          </li>
          <li>
            <div className="flex items-start min-h-[4.5rem]">
              <span className="font-semibold w-28 h-12 flex items-center shrink-0">Independent attempt:</span>
              <span className="ml-2 text-sm pt-1">Have the student apply the entire learned process to new, similar problems without direct aid.</span>
            </div>
          </li>
          <li>
            <div className="flex items-start min-h-[4.5rem]">
              <span className="font-semibold w-28 h-12 flex items-center shrink-0">Feedback loop:</span>
              <span className="ml-2 text-sm pt-1">Review student's work, focusing on their process and reasoning, not just the final answer.</span>
            </div>
          </li>
          <li>
            <div className="flex items-start min-h-[4.5rem]">
              <span className="font-semibold w-28 h-12 flex items-center shrink-0">Refine and repeat:</span>
              <span className="ml-2 text-sm pt-1">Address identified weak points, reinforce strengths, and cycle through further targeted practice.</span>
            </div>
          </li>
        </ul>

        {/* ADDED fixed height h-[300px] and overflow-y-auto */}
        <div className="mt-6 bg-white p-4 rounded-lg border border-blue-100 h-[300px] overflow-y-auto">
          <p className="font-semibold text-primary mb-2 text-base">Example: Independent Practice & Refinement</p>
          <p className="mb-1 text-sm"><span className="font-semibold">Objective:</span> Enable student to independently apply the process to new Flaw Questions and refine skills.</p>
          <p className="mt-2 mb-1 text-sm font-semibold">Practice Scenario & Review:</p>
          <ul className="list-disc pl-5 text-xs sm:text-sm space-y-0.5">
              <li><span className="font-semibold">Independent Task:</span> Student independently analyzes a set of new Flaw Questions.</li>
              <li><span className="font-semibold">Self-Correction Prompts:</span> Encouraged to recall defined elements and demonstrated steps during task.</li>
              <li><span className="font-semibold">Key Review Points (Post-Task):</span>
                  <ul className="list-circle pl-4 text-xs">
                      <li>Accuracy of argument deconstruction (conclusion/premises).</li>
                      <li>Correctness of specific flaw identification.</li>
                      <li>Effectiveness of answer elimination logic.</li>
                  </ul>
              </li>
              <li><span className="font-semibold">Actionable Feedback:</span> Review incorporated into plans for further, targeted skill development.</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <section id="methodology" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-4">Why My Method Works</h2>
          <p className="text-foreground text-lg leading-relaxed">
            Unlike many tutors who use a more intuition/vibes based approach, I focus on providing students
            with a structured, skill-based framework that consistently delivers exceptional results.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
            {/* Headers Row */}
            <div className="grid md:grid-cols-3 divide-x divide-blue-100">
              <div className="p-6 md:p-8 text-left">
                <h3 className="font-heading font-bold text-xl text-primary">DEFINE</h3>
                <p className="mt-2 leading-relaxed text-foreground/80">
                  My approach begins by breaking down complex LSAT questions into clear, actionable patterns.
                </p>
              </div>
              <div className="p-6 md:p-8 text-left">
                <h3 className="font-heading font-bold text-xl text-primary">DEMONSTRATE</h3>
                <p className="mt-2 leading-relaxed text-foreground/80">
                  Core strategies are demonstrated within a personalized learning path targeting your unique needs.
                </p>
              </div>
              <div className="p-6 md:p-8 text-left">
                <h3 className="font-heading font-bold text-xl text-primary">DUPLICATE</h3>
                <p className="mt-2 leading-relaxed text-foreground/80">
                  The goal is for you to independently duplicate this approach for consistent success.
                </p>
              </div>
            </div>

            {/* Global Toggle Button */}
            <div className="border-t border-blue-100">
              <button
                onClick={toggleDrawer}
                className="w-full p-4 flex items-center justify-center text-primary hover:bg-blue-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-expanded={isDrawerOpen}
                aria-controls="methodology-drawer-content"
              >
                <span className="font-semibold mr-2">{isDrawerOpen ? 'Hide Details' : 'Show Details'}</span>
                <svg className={`w-5 h-5 transition-transform duration-300 ${isDrawerOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
            </div>

            {/* Content Drawer */}
            {isDrawerOpen && (
              <div id="methodology-drawer-content" className="grid md:grid-cols-3 md:divide-x md:divide-blue-100">
                <div className="md:border-r md:border-blue-100">{defineContent}</div>
                <div className="md:border-r md:border-blue-100">{demonstrateContent}</div>
                <div>{duplicateContent}</div>
              </div>
            )}
          </div>

          {/* Strategy cards (unchanged) */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 mr-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-accent/20 rounded-full text-primary">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 1a9 9 0 00-9 9c0 2.066.693 4.072 2 5.572.31.366.683.688 1.105.95A7.001 7.001 0 0110 4a7 7 0 11-4.074 12.667C6.86 17.52 7.979 18 9 18c1.254 0 2.038-.67 2.038-.67.329.319.687.589 1.07.795 1.246.653 2.583.975 3.892.975A9.003 9.003 0 0010 1zm1 10a1 1 0 11-2 0 1 1 0 012 0zm-3 0a1 1 0 11-2 0 1 1 0 012 0zm5-1a1 1 0 100-2 1 1 0 000 2z"></path></svg>
                  </div>
                </div>
                <h4 className="font-heading font-semibold text-primary text-lg">Logical Reasoning Mastery</h4>
              </div>
              <p className="text-foreground/80 text-sm">
                Learn to quickly break down and judge any LSAT argument.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 mr-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-accent/20 rounded-full text-primary">
                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 001 11c0 1.202.268 2.334.752 3.36V17a1 1 0 001 1h2.64c1.026.484 2.158.752 3.36.752 4.411 0 7.968-3.557 7.968-7.968S13.411 4.804 9 4.804zm0 1.691c3.313 0 6 2.686 6 6s-2.687 6-6 6-6-2.686-6-6 2.687-6 6-6z"></path><path d="M6 10.5a.5.5 0 01.5-.5h2.793l-1.147-1.146a.5.5 0 11.708-.708l2 2a.5.5 0 010 .708l-2 2a.5.5 0 11-.708-.708L9.293 11H6.5a.5.5 0 01-.5-.5z"></path></svg>
                  </div>
                </div>
                <h4 className="font-heading font-semibold text-primary text-lg">Reading Comprehension</h4>
              </div>
              <p className="text-foreground/80 text-sm">
                Learn a clear method to understand passages and accurately find main ideas and implied meanings.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 mr-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-accent/20 rounded-full text-primary">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 10.586V6z" clipRule="evenodd"></path></svg>
                  </div>
                </div>
                <h4 className="font-heading font-semibold text-primary text-lg">Test Performance</h4>
              </div>
              <p className="text-foreground/80 text-sm">
                Learn how to manage your time, stay focused, learn from mistakes, and tackle the test with confidence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;