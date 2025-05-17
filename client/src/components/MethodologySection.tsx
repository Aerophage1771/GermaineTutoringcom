const MethodologySection = () => {
  return (
    <section id="methodology" className="py-20 methodology-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-4">Why My Method Works</h2>
          <p className="text-foreground text-lg leading-relaxed mb-10">
            Unlike most tutors who teach by intuition, I've developed a structured, rule-based system 
            that consistently delivers exceptional results.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <div className="bg-blue-50 rounded-xl p-8">
            <div className="space-y-8">
              <div>
                <h3 className="font-heading font-bold text-primary text-2xl mb-4">DEFINE</h3>
                <p className="text-foreground leading-relaxed">
                  My approach begins by breaking down complex LSAT questions into clear, actionable patterns. Instead of relying on intuition, you'll learn the concrete, actionable rules that form the foundation for mastering any question type.
                </p>
              </div>
              
              <div>
                <h3 className="font-heading font-bold text-primary text-2xl mb-4">DEMONSTRATE</h3>
                <p className="text-foreground leading-relaxed">
                  These core rules and strategies are then demonstrated within a personalized learning path. I diagnose your specific strengths and weaknesses to create a customized study plan, ensuring every technique is modeled and practiced in a way that targets your unique needs, with no wasted time.
                </p>
              </div>
              
              <div>
                <h3 className="font-heading font-bold text-primary text-2xl mb-4">DUPLICATE</h3>
                <p className="text-foreground leading-relaxed">
                  The goal is for you to independently and consistently duplicate this successful approach. My students achieve 170+ scores and gain admission to top law schools because this structured method empowers them to internalize and replicate proven strategies, effective for all LSAT learning styles.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-accent/20 rounded-full text-primary">
                    <i className="fas fa-brain"></i>
                  </div>
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-primary text-xl mb-2">Logical Reasoning Mastery</h4>
                  <p className="text-foreground/80">
                    Learn to quickly break down and judge any LSAT argument.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-accent/20 rounded-full text-primary">
                    <i className="fas fa-book-open"></i>
                  </div>
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-primary text-xl mb-2">Reading Comprehension Strategy</h4>
                  <p className="text-foreground/80">
                    Learn a clear method to fully understand passages and accurately find main ideas and implied meanings.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-accent/20 rounded-full text-primary">
                    <i className="fas fa-clock"></i>
                  </div>
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-primary text-xl mb-2">Test Performance Strategy</h4>
                  <p className="text-foreground/80">
                    Learn how to manage your time, stay focused, learn from mistakes, and tackle the test with confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;
