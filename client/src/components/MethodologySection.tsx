import { useState } from 'react';

const MethodologySection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <section id="methodology" className="py-20 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-4">Why My Method Works</h2>
          <p className="text-foreground text-lg leading-relaxed">
            Unlike many tutors who use a more intuition/vibes based approach, I focus on providing students 
            with a structured, skill-based framework that consistently delivers exceptional results.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          {/* Three-step approach with single expandable drawer */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
            {/* Top row with three sections */}
            <div className="grid md:grid-cols-3 divide-x divide-blue-100">
              {/* DEFINE */}
              <div className="p-6 md:p-8 hover:bg-blue-50/50 transition-colors duration-300">
                <h3 className="font-heading font-bold text-xl text-primary text-center">DEFINE</h3>
                <p className="mt-3 text-foreground/80 leading-relaxed text-center">
                  Breaking down complex LSAT questions into clear, actionable patterns.
                </p>
              </div>
              
              {/* DEMONSTRATE */}
              <div className="p-6 md:p-8 hover:bg-blue-50/50 transition-colors duration-300">
                <h3 className="font-heading font-bold text-xl text-primary text-center">DEMONSTRATE</h3>
                <p className="mt-3 text-foreground/80 leading-relaxed text-center">
                  Showing strategies within a personalized learning path targeting your unique needs.
                </p>
              </div>
              
              {/* DUPLICATE */}
              <div className="p-6 md:p-8 hover:bg-blue-50/50 transition-colors duration-300">
                <h3 className="font-heading font-bold text-xl text-primary text-center">DUPLICATE</h3>
                <p className="mt-3 text-foreground/80 leading-relaxed text-center">
                  Empowering you to independently use this approach for consistent success.
                </p>
              </div>
            </div>
            
            {/* Global drawer toggle */}
            <div className="border-t border-blue-100">
              <button 
                onClick={toggleExpand}
                className="w-full py-3 flex items-center justify-center bg-blue-50/50 hover:bg-blue-50 transition-colors"
              >
                <span className="font-medium text-primary mr-2">
                  {isExpanded ? "Hide details" : "View methodology details"}
                </span>
                <i className={`fas ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} text-primary`}></i>
              </button>
            </div>
            
            {/* Expandable content drawer */}
            {isExpanded && (
              <div className="grid md:grid-cols-3 divide-x divide-blue-100 border-t border-blue-100">
                {/* DEFINE content */}
                <div className="p-6 md:p-8 bg-blue-50/30">
                  <h4 className="font-heading text-primary font-semibold mb-5 text-center">The DEFINE Process</h4>
                  
                  <ul className="space-y-4">
                    <li className="flex">
                      <span className="font-semibold mr-2 text-primary">Name it</span>
                      <span>– Clearly label the concept/technique.</span>
                    </li>
                    <li className="flex">
                      <span className="font-semibold mr-2 text-primary">Describe it</span>
                      <span>– Offer a concise, jargon-free explanation.</span>
                    </li>
                    <li className="flex">
                      <span className="font-semibold mr-2 text-primary">Contextualize it</span>
                      <span>– Explain when/why it matters or appears.</span>
                    </li>
                    <li className="flex">
                      <span className="font-semibold mr-2 text-primary">Deconstruct it</span>
                      <span>– Break it into essential features or steps.</span>
                    </li>
                  </ul>
                  
                  <div className="mt-8 bg-white p-5 rounded-lg border border-blue-100 h-48 flex flex-col justify-between">
                    <div>
                      <p className="font-semibold text-primary mb-2">Example:</p>
                      <p className="mb-1"><span className="font-semibold">Name:</span> Flaw Questions</p>
                      <p className="mb-1"><span className="font-semibold">Describe:</span> These ask what mistake an argument makes.</p>
                      <p className="mb-1"><span className="font-semibold">Context:</span> Common in Logical Reasoning, tests critical reading.</p>
                      <p><span className="font-semibold">Deconstruct:</span> Flaws include equivocation, correlation-causation, etc.</p>
                    </div>
                  </div>
                </div>
                
                {/* DEMONSTRATE content */}
                <div className="p-6 md:p-8 bg-blue-50/30">
                  <h4 className="font-heading text-primary font-semibold mb-5 text-center">The DEMONSTRATE Process</h4>
                  
                  <ul className="space-y-4">
                    <li className="flex">
                      <span className="font-semibold mr-2 text-primary">Walkthrough</span>
                      <span>– Apply the concept with full narration of thought process.</span>
                    </li>
                    <li className="flex">
                      <span className="font-semibold mr-2 text-primary">Highlight decision points</span>
                      <span>– Show when and why key choices are made.</span>
                    </li>
                    <li className="flex">
                      <span className="font-semibold mr-2 text-primary">Compare with errors</span>
                      <span>– Show "bad" approaches to reinforce correct ones.</span>
                    </li>
                    <li className="flex">
                      <span className="font-semibold mr-2 text-primary">Encourage observation</span>
                      <span>– Ask you to watch for specific markers as we go.</span>
                    </li>
                  </ul>
                  
                  <div className="mt-8 bg-white p-5 rounded-lg border border-blue-100 h-48 flex flex-col justify-between">
                    <div>
                      <p className="font-semibold text-primary mb-2">Example:</p>
                      <p>
                        Walk through a Flaw Question: read the stimulus, identify conclusion/premise, flag reasoning gap, name the flaw, explain why each wrong answer fails, and provide clear justification for the correct one.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* DUPLICATE content */}
                <div className="p-6 md:p-8 bg-blue-50/30">
                  <h4 className="font-heading text-primary font-semibold mb-5 text-center">The DUPLICATE Process</h4>
                  
                  <ul className="space-y-4">
                    <li className="flex">
                      <span className="font-semibold mr-2 text-primary">Guided repetition</span>
                      <span>– Start with scaffolding: hints and checklists.</span>
                    </li>
                    <li className="flex">
                      <span className="font-semibold mr-2 text-primary">Independent attempt</span>
                      <span>– You complete the full task solo.</span>
                    </li>
                    <li className="flex">
                      <span className="font-semibold mr-2 text-primary">Feedback loop</span>
                      <span>– Review process and identify correct moves/missteps.</span>
                    </li>
                    <li className="flex">
                      <span className="font-semibold mr-2 text-primary">Refine and repeat</span>
                      <span>– Target weak points and reinforce strengths.</span>
                    </li>
                  </ul>
                  
                  <div className="mt-8 bg-white p-5 rounded-lg border border-blue-100 h-48 flex flex-col justify-between">
                    <div>
                      <p className="font-semibold text-primary mb-2">Example:</p>
                      <p>
                        You do 3 Flaw questions in front of me. Then we review:
                      </p>
                      <ul className="list-disc pl-5 mt-2">
                        <li>Did you label conclusion/premise?</li>
                        <li>Did you correctly name the flaw?</li>
                        <li>Did you effectively remove incorrect answers?</li>
                      </ul>
                      <p className="mt-2">
                        Then we use the feedback to guide your upcoming practice.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Strategy cards */}
          <div>
            <h3 className="font-heading font-bold text-primary text-2xl mb-6 text-center">Core LSAT Skills You'll Master</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-accent/20 rounded-full text-primary">
                      <i className="fas fa-brain"></i>
                    </div>
                  </div>
                  <h4 className="font-heading font-semibold text-primary text-lg">Logical Reasoning Mastery</h4>
                </div>
                <p className="text-foreground/80">
                  Learn to quickly break down and judge any LSAT argument.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-accent/20 rounded-full text-primary">
                      <i className="fas fa-book-open"></i>
                    </div>
                  </div>
                  <h4 className="font-heading font-semibold text-primary text-lg">Reading Comprehension</h4>
                </div>
                <p className="text-foreground/80">
                  Learn a clear method to understand passages and accurately find main ideas and implied meanings.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-accent/20 rounded-full text-primary">
                      <i className="fas fa-clock"></i>
                    </div>
                  </div>
                  <h4 className="font-heading font-semibold text-primary text-lg">Test Performance</h4>
                </div>
                <p className="text-foreground/80">
                  Learn how to manage your time, stay focused, learn from mistakes, and tackle the test with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;
