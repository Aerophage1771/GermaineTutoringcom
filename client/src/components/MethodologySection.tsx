const MethodologySection = () => {
  return (
    <section id="methodology" className="py-20 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-4">Why My Method Works</h2>
          <p className="text-foreground text-lg leading-relaxed">
            Unlike most tutors who teach by intuition, I've developed a structured, rule-based system 
            that consistently delivers exceptional results.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          {/* Three-step approach */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
            <div className="grid md:grid-cols-3 divide-x divide-blue-100">
              <div className="p-6 md:p-8 hover:bg-blue-50 transition-colors duration-300">
                <h3 className="font-heading font-bold text-primary text-xl mb-3">DEFINE</h3>
                <p className="text-foreground/80 leading-relaxed">
                  My approach begins by breaking down complex LSAT questions into clear, actionable patterns. You'll learn concrete rules that form the foundation for mastering any question type.
                </p>
              </div>
              
              <div className="p-6 md:p-8 hover:bg-blue-50 transition-colors duration-300">
                <h3 className="font-heading font-bold text-primary text-xl mb-3">DEMONSTRATE</h3>
                <p className="text-foreground/80 leading-relaxed">
                  Core strategies are demonstrated within a personalized learning path. I diagnose your strengths and weaknesses to create a customized study plan targeting your unique needs.
                </p>
              </div>
              
              <div className="p-6 md:p-8 hover:bg-blue-50 transition-colors duration-300">
                <h3 className="font-heading font-bold text-primary text-xl mb-3">DUPLICATE</h3>
                <p className="text-foreground/80 leading-relaxed">
                  The goal is for you to independently duplicate this approach. My students achieve 170+ scores because this method empowers them to internalize proven strategies for all learning styles.
                </p>
              </div>
            </div>
          </div>
          
          {/* Strategy cards */}
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
    </section>
  );
};

export default MethodologySection;
