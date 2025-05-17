import { useState } from 'react';

const MethodologySection = () => {
  const [activeTab, setActiveTab] = useState<string>('define');
  
  const toggleTab = (tab: string) => {
    setActiveTab(tab === activeTab ? '' : tab);
  };
  
  const defineContent = (
    <div className="p-5 bg-blue-50 rounded-b-lg border-t border-blue-100">
      <h4 className="font-heading text-primary font-semibold mb-3">The DEFINE Process:</h4>
      <ul className="space-y-4">
        <li>
          <span className="font-semibold">Name it</span> – Clearly label the concept/technique (e.g., "Main Conclusion," "Sufficient Assumption").
        </li>
        <li>
          <span className="font-semibold">Describe it</span> – Offer a concise, jargon-free explanation.
        </li>
        <li>
          <span className="font-semibold">Contextualize it</span> – Briefly explain when/why it matters or where it typically appears.
        </li>
        <li>
          <span className="font-semibold">Deconstruct it</span> – Break it into its essential features, steps, or telltale markers.
        </li>
      </ul>
      
      <div className="mt-4 bg-white p-4 rounded-lg border border-blue-100">
        <p className="font-semibold text-primary">Example:</p>
        <p className="mb-1"><span className="font-semibold">Name:</span> Flaw Questions</p>
        <p className="mb-1"><span className="font-semibold">Describe:</span> These ask what mistake an argument makes.</p>
        <p className="mb-1"><span className="font-semibold">Context:</span> Common in Logical Reasoning, often used to test critical reading.</p>
        <p><span className="font-semibold">Deconstruct:</span> Typical flaws include equivocation, correlation-causation, circular reasoning, etc.</p>
      </div>
    </div>
  );
  
  const demonstrateContent = (
    <div className="p-5 bg-blue-50 rounded-b-lg border-t border-blue-100">
      <h4 className="font-heading text-primary font-semibold mb-3">The DEMONSTRATE Process:</h4>
      <ul className="space-y-4">
        <li>
          <span className="font-semibold">Walkthrough</span> – Apply the concept to a real example with full narration of thought process.
        </li>
        <li>
          <span className="font-semibold">Highlight decision points</span> – Explicitly show when and why key choices are made.
        </li>
        <li>
          <span className="font-semibold">Compare with errors</span> – Show contrasting "bad" approaches to reinforce the correct one.
        </li>
        <li>
          <span className="font-semibold">Encourage observation</span> – Ask the learner to watch for specific markers or cues as you go.
        </li>
      </ul>
      
      <div className="mt-4 bg-white p-4 rounded-lg border border-blue-100">
        <p className="font-semibold text-primary">Example:</p>
        <p>
          Walk through a Flaw Question: read the stimulus aloud, identify the conclusion/premise, flag reasoning gap, name the flaw, explain why each wrong answer fails, and land on the correct one with clear justification.
        </p>
      </div>
    </div>
  );
  
  const duplicateContent = (
    <div className="p-5 bg-blue-50 rounded-b-lg border-t border-blue-100">
      <h4 className="font-heading text-primary font-semibold mb-3">The DUPLICATE Process:</h4>
      <ul className="space-y-4">
        <li>
          <span className="font-semibold">Guided repetition</span> – Start with scaffolding: hints, partial steps, checklists.
        </li>
        <li>
          <span className="font-semibold">Independent attempt</span> – Student does full task solo.
        </li>
        <li>
          <span className="font-semibold">Feedback loop</span> – Review their process, not just the result; identify both correct moves and missteps.
        </li>
        <li>
          <span className="font-semibold">Refine and repeat</span> – Target weak points, reinforce strengths, and cycle back as needed.
        </li>
      </ul>
      
      <div className="mt-4 bg-white p-4 rounded-lg border border-blue-100">
        <p className="font-semibold text-primary">Example:</p>
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
  );

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
          {/* Three-step approach with expandable content */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
            <div className="grid md:grid-cols-3 divide-x divide-blue-100">
              {/* DEFINE */}
              <div>
                <button 
                  onClick={() => toggleTab('define')}
                  className={`w-full p-6 md:p-8 text-left transition-colors duration-300 ${activeTab === 'define' ? 'bg-primary text-white' : 'hover:bg-blue-50'}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className={`font-heading font-bold text-xl ${activeTab === 'define' ? 'text-white' : 'text-primary'}`}>DEFINE</h3>
                    <i className={`fas ${activeTab === 'define' ? 'fa-chevron-up text-white' : 'fa-chevron-down text-primary'}`}></i>
                  </div>
                  <p className={`mt-2 leading-relaxed ${activeTab === 'define' ? 'text-white/90' : 'text-foreground/80'}`}>
                    My approach begins by breaking down complex LSAT questions into clear, actionable patterns.
                  </p>
                </button>
                {defineContent}
              </div>
              
              {/* DEMONSTRATE */}
              <div>
                <button 
                  onClick={() => toggleTab('demonstrate')}
                  className={`w-full p-6 md:p-8 text-left transition-colors duration-300 ${activeTab === 'demonstrate' ? 'bg-primary text-white' : 'hover:bg-blue-50'}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className={`font-heading font-bold text-xl ${activeTab === 'demonstrate' ? 'text-white' : 'text-primary'}`}>DEMONSTRATE</h3>
                    <i className={`fas ${activeTab === 'demonstrate' ? 'fa-chevron-up text-white' : 'fa-chevron-down text-primary'}`}></i>
                  </div>
                  <p className={`mt-2 leading-relaxed ${activeTab === 'demonstrate' ? 'text-white/90' : 'text-foreground/80'}`}>
                    Core strategies are demonstrated within a personalized learning path targeting your unique needs.
                  </p>
                </button>
                {demonstrateContent}
              </div>
              
              {/* DUPLICATE */}
              <div>
                <button 
                  onClick={() => toggleTab('duplicate')}
                  className={`w-full p-6 md:p-8 text-left transition-colors duration-300 ${activeTab === 'duplicate' ? 'bg-primary text-white' : 'hover:bg-blue-50'}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className={`font-heading font-bold text-xl ${activeTab === 'duplicate' ? 'text-white' : 'text-primary'}`}>DUPLICATE</h3>
                    <i className={`fas ${activeTab === 'duplicate' ? 'fa-chevron-up text-white' : 'fa-chevron-down text-primary'}`}></i>
                  </div>
                  <p className={`mt-2 leading-relaxed ${activeTab === 'duplicate' ? 'text-white/90' : 'text-foreground/80'}`}>
                    The goal is for you to independently duplicate this approach for consistent success.
                  </p>
                </button>
                {duplicateContent}
              </div>
            </div>
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
