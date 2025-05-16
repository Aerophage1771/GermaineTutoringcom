const MethodologySection = () => {
  const steps = [
    {
      number: 1,
      title: "Define the Problem",
      description: "Precisely identify what the question is asking and what components need to be addressed."
    },
    {
      number: 2,
      title: "Identify Steps",
      description: "Determine the logical pathway to answer the question correctly."
    },
    {
      number: 3,
      title: "Execute",
      description: "Apply the appropriate logical rules and reasoning techniques to reach the solution."
    },
    {
      number: 4,
      title: "Know When to Apply",
      description: "Recognize pattern signatures that indicate which approach is most effective."
    },
    {
      number: 5,
      title: "Adapt",
      description: "Modify your approach based on feedback and evolving understanding."
    }
  ];

  const teachingModel = [
    {
      title: "Describe",
      icon: "fas fa-book",
      description: "I first explain the underlying logical principles and rules relevant to the question type. This is where my Princeton Philosophy of Logic background truly adds value—making complex concepts accessible and practical."
    },
    {
      title: "Demonstrate",
      icon: "fas fa-chalkboard-teacher",
      description: "Next, I walk through example problems, showing exactly how the principles apply in real LSAT scenarios. I verbalize my thought process, making my reasoning transparent and replicable."
    },
    {
      title: "Duplicate",
      icon: "fas fa-user-graduate",
      description: "Finally, you apply the approach to similar problems under my guidance, gradually building independence. I provide real-time feedback to refine your reasoning until mastery is achieved."
    }
  ];

  return (
    <section id="methodology" className="py-20 methodology-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-4">My Proven Approach</h2>
          <p className="text-foreground text-lg leading-relaxed">
            Drawing from my Princeton background in Philosophy of Logic, I've developed a comprehensive methodology 
            that transforms how students understand and approach the LSAT.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <div className="bg-white rounded-xl shadow-md p-8 border-t-4 border-accent">
            <h3 className="font-heading font-bold text-primary text-2xl mb-4">5-Step Critical Thinking Framework</h3>
            <div className="space-y-6">
              {steps.map((step) => (
                <div className="flex" key={step.number}>
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-accent rounded-full text-white font-bold">
                      {step.number}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground text-lg mb-1">{step.title}</h4>
                    <p className="text-foreground/80">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-8 border-t-4 border-primary">
            <h3 className="font-heading font-bold text-primary text-2xl mb-6">'Describe, Demonstrate, Duplicate' Teaching Model</h3>
            
            <div className="space-y-8">
              {teachingModel.map((item, index) => (
                <div key={index}>
                  <h4 className="font-heading font-semibold text-xl text-primary flex items-center mb-2">
                    <span className="text-accent mr-2"><i className={item.icon}></i></span> {item.title}
                  </h4>
                  <p className="text-foreground/80 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}

              <div className="pt-2 border-t border-muted">
                <p className="text-foreground italic">
                  "I don't just teach LSAT techniques—I develop your ability to think logically and critically, skills that extend far beyond the test itself."
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* LSAT exam preparation image */}
        <div className="bg-primary rounded-xl overflow-hidden shadow-xl">
          <div className="md:flex">
            <div className="md:w-1/2 p-8 md:p-12 flex items-center">
              <div>
                <h3 className="font-heading font-bold text-white text-2xl md:text-3xl mb-4">
                  Understanding Underlying Logic, Not Just Memorization
                </h3>
                <p className="text-white/90 leading-relaxed mb-6">
                  The LSAT isn't testing your ability to memorize information—it's evaluating how well you can think. 
                  My approach focuses on developing deep logical reasoning skills rather than superficial tricks or shortcuts.
                </p>
                <p className="text-white/90 leading-relaxed">
                  When you understand the fundamental reasoning behind each question type, you can tackle even unfamiliar problems with confidence. 
                  This is why my students consistently outperform expectations on test day.
                </p>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Student working through LSAT preparation materials" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;
