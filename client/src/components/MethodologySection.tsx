import { useState } from 'react';

const MethodologySection = () => {
  const [activeTab, setActiveTab] = useState<string>('define');
  
  const selectTab = (tab: string) => {
    setActiveTab(tab);
  };
  
  const defineContent = (
    <div className={`p-5 bg-blue-50 rounded-lg border ${activeTab === 'define' ? 'border-primary border-2' : 'border-blue-100'}`}>
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
    <div className={`p-5 bg-blue-50 rounded-lg border ${activeTab === 'demonstrate' ? 'border-primary border-2' : 'border-blue-100'}`}>
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
    <div className={`p-5 bg-blue-50 rounded-lg border ${activeTab === 'duplicate' ? 'border-primary border-2' : 'border-blue-100'}`}>
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
          {/* Three-step approach tabs */}
          <div className="flex mb-6 border-b border-blue-100">
            <button 
              onClick={() => selectTab('define')}
              className={`py-3 px-6 font-heading font-medium text-lg transition-colors duration-300 ${activeTab === 'define' ? 'text-primary border-b-2 border-primary' : 'text-foreground/70 hover:text-primary'}`}
            >
              DEFINE
            </button>
            <button 
              onClick={() => selectTab('demonstrate')}
              className={`py-3 px-6 font-heading font-medium text-lg transition-colors duration-300 ${activeTab === 'demonstrate' ? 'text-primary border-b-2 border-primary' : 'text-foreground/70 hover:text-primary'}`}
            >
              DEMONSTRATE
            </button>
            <button 
              onClick={() => selectTab('duplicate')}
              className={`py-3 px-6 font-heading font-medium text-lg transition-colors duration-300 ${activeTab === 'duplicate' ? 'text-primary border-b-2 border-primary' : 'text-foreground/70 hover:text-primary'}`}
            >
              DUPLICATE
            </button>
          </div>
          
          {/* Display all content with highlighted active tab */}
          <div className="space-y-8 mb-16">
            <div>
              <h3 className={`font-heading font-bold text-xl ${activeTab === 'define' ? 'text-primary' : 'text-foreground/70'} mb-4 flex items-center`}>
                <div className={`w-6 h-6 rounded-full mr-2 flex items-center justify-center ${activeTab === 'define' ? 'bg-primary text-white' : 'bg-foreground/20'}`}>1</div>
                DEFINE
              </h3>
              {defineContent}
            </div>
            
            <div>
              <h3 className={`font-heading font-bold text-xl ${activeTab === 'demonstrate' ? 'text-primary' : 'text-foreground/70'} mb-4 flex items-center`}>
                <div className={`w-6 h-6 rounded-full mr-2 flex items-center justify-center ${activeTab === 'demonstrate' ? 'bg-primary text-white' : 'bg-foreground/20'}`}>2</div>
                DEMONSTRATE
              </h3>
              {demonstrateContent}
            </div>
            
            <div>
              <h3 className={`font-heading font-bold text-xl ${activeTab === 'duplicate' ? 'text-primary' : 'text-foreground/70'} mb-4 flex items-center`}>
                <div className={`w-6 h-6 rounded-full mr-2 flex items-center justify-center ${activeTab === 'duplicate' ? 'bg-primary text-white' : 'bg-foreground/20'}`}>3</div>
                DUPLICATE
              </h3>
              {duplicateContent}
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
