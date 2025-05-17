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
              <div className="p-8 hover:bg-blue-50/50 transition-colors duration-300">
                <h3 className="font-heading font-bold text-xl text-primary text-center mb-4">DEFINE</h3>
                <p className="text-foreground/80 leading-relaxed text-center">
                  Breaking down complex LSAT questions into clear, actionable patterns.
                </p>
              </div>
              
              {/* DEMONSTRATE */}
              <div className="p-8 hover:bg-blue-50/50 transition-colors duration-300">
                <h3 className="font-heading font-bold text-xl text-primary text-center mb-4">DEMONSTRATE</h3>
                <p className="text-foreground/80 leading-relaxed text-center">
                  Showing strategies within a personalized learning path targeting your unique needs.
                </p>
              </div>
              
              {/* DUPLICATE */}
              <div className="p-8 hover:bg-blue-50/50 transition-colors duration-300">
                <h3 className="font-heading font-bold text-xl text-primary text-center mb-4">DUPLICATE</h3>
                <p className="text-foreground/80 leading-relaxed text-center">
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
                <div className="p-8">
                  <h4 className="font-heading text-primary font-semibold mb-6 text-center">The DEFINE Process</h4>
                  
                  <div className="grid grid-cols-[100px_1fr] gap-y-4">
                    <div className="font-semibold text-primary">Name it</div>
                    <div>– Clearly label the concept/technique.</div>
                    
                    <div className="font-semibold text-primary">Describe it</div>
                    <div>– Offer a concise, jargon-free explanation.</div>
                    
                    <div className="font-semibold text-primary">Contextualize it</div>
                    <div>– Explain when/why it matters or appears.</div>
                    
                    <div className="font-semibold text-primary">Deconstruct it</div>
                    <div>– Break it into essential features or steps.</div>
                  </div>
                  
                  <div className="mt-6 bg-white p-5 rounded-lg border border-blue-100 h-[200px]">
                    <p className="font-semibold text-primary mb-3">Example:</p>
                    <p className="mb-2"><span className="font-semibold">Name:</span> Flaw Questions</p>
                    <p className="mb-2"><span className="font-semibold">Describe:</span> These ask what mistake an argument makes.</p>
                    <p className="mb-2"><span className="font-semibold">Context:</span> Common in Logical Reasoning, tests critical reading.</p>
                    <p><span className="font-semibold">Deconstruct:</span> Flaws include equivocation, correlation-causation, etc.</p>
                  </div>
                </div>
                
                {/* DEMONSTRATE content */}
                <div className="p-8">
                  <h4 className="font-heading text-primary font-semibold mb-6 text-center">The DEMONSTRATE Process</h4>
                  
                  <div className="grid grid-cols-[100px_1fr] gap-y-4">
                    <div className="font-semibold text-primary">Walkthrough</div>
                    <div>– Apply the concept with full narration of thought process.</div>
                    
                    <div className="font-semibold text-primary">Highlight decision points</div>
                    <div>– Show when and why key choices are made.</div>
                    
                    <div className="font-semibold text-primary">Compare with errors</div>
                    <div>– Show "bad" approaches to reinforce correct ones.</div>
                    
                    <div className="font-semibold text-primary">Encourage observation</div>
                    <div>– Ask you to watch for specific markers as we go.</div>
                  </div>
                  
                  <div className="mt-6 bg-white p-5 rounded-lg border border-blue-100 h-[200px]">
                    <p className="font-semibold text-primary mb-3">Example:</p>
                    <p>
                      Walk through a Flaw Question: read the stimulus, identify conclusion/premise, flag reasoning gap, name the flaw, explain why each wrong answer fails, and provide clear justification for the correct one.
                    </p>
                  </div>
                </div>
                
                {/* DUPLICATE content */}
                <div className="p-8">
                  <h4 className="font-heading text-primary font-semibold mb-6 text-center">The DUPLICATE Process</h4>
                  
                  <div className="grid grid-cols-[100px_1fr] gap-y-4">
                    <div className="font-semibold text-primary">Guided repetition</div>
                    <div>– Start with scaffolding: hints and checklists.</div>
                    
                    <div className="font-semibold text-primary">Independent attempt</div>
                    <div>– You complete the full task solo.</div>
                    
                    <div className="font-semibold text-primary">Feedback loop</div>
                    <div>– Review process and identify correct moves/missteps.</div>
                    
                    <div className="font-semibold text-primary">Refine and repeat</div>
                    <div>– Target weak points and reinforce strengths.</div>
                  </div>
                  
                  <div className="mt-6 bg-white p-5 rounded-lg border border-blue-100 h-[200px] flex flex-col">
                    <p className="font-semibold text-primary mb-3">Example:</p>
                    <p>
                      You do 3 Flaw questions in front of me. Then we review:
                    </p>
                    <ul className="list-disc pl-5 mt-2 mb-2">
                      <li>Did you label conclusion/premise?</li>
                      <li>Did you correctly name the flaw?</li>
                      <li>Did you effectively remove incorrect answers?</li>
                    </ul>
                    <p>
                      Then we use the feedback to guide your upcoming practice.
                    </p>
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
