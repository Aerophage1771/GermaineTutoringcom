const ProgramsSection = () => {
  const programs = [
    {
      title: "Targeted Strategy Session",
      description: "Focus on specific sections or question types causing difficulty",
      price: "$299",
      duration: "2 hours",
      features: [
        { included: true, text: "2 hours of 1-on-1 instruction" },
        { included: true, text: "Targeted diagnostic assessment" },
        { included: true, text: "Section-specific strategy guide" },
        { included: true, text: "48-hour follow-up email support" },
        { included: false, text: "Comprehensive study plan" },
        { included: false, text: "Practice test reviews" }
      ],
      buttonText: "Book a Session",
      highlighted: false
    },
    {
      title: "Standard Prep Program",
      description: "Comprehensive preparation for 5-15 point improvements",
      price: "$1,199",
      duration: "8 hours",
      features: [
        { included: true, text: "8 hours of 1-on-1 instruction" },
        { included: true, text: "Full diagnostic assessment" },
        { included: true, text: "Personalized study plan" },
        { included: true, text: "1 full practice test review" },
        { included: true, text: "Question database access" },
        { included: true, text: "Email support between sessions" }
      ],
      buttonText: "Explore Program",
      highlighted: false
    },
    {
      title: "Premium Mastery Program",
      description: "Intensive preparation for 12+ point improvements or 170+ scores",
      price: "$3,599",
      duration: "24 hours",
      features: [
        { included: true, text: "24 hours of 1-on-1 instruction" },
        { included: true, text: "Advanced diagnostic assessment" },
        { included: true, text: "Comprehensive custom study plan" },
        { included: true, text: "3 full practice test reviews" },
        { included: true, text: "Premium question database access" },
        { included: true, text: "Priority email & text support" },
        { included: true, text: "Advanced strategy materials" },
        { included: true, text: "Application guidance session" }
      ],
      buttonText: "Book a Consultation",
      highlighted: true
    }
  ];

  const scrollToConsultation = () => {
    const element = document.getElementById('consultation');
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="programs" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-4">Tutoring Programs</h2>
          <p className="text-foreground text-lg leading-relaxed">
            Choose the program that aligns with your goals and timeline. Each program is tailored to deliver 
            specific outcomes based on your starting point and target score.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {programs.map((program, index) => (
            <div 
              key={index}
              className={`${
                program.highlighted 
                  ? "bg-primary border-2 border-accent rounded-xl shadow-xl overflow-hidden relative transform transition-all hover:scale-105" 
                  : "bg-white border border-muted rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg"
              }`}
            >
              {program.highlighted && (
                <div className="absolute top-0 right-0 bg-accent text-primary font-bold py-1 px-4 rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}
              
              <div className="p-8">
                <h3 className={`font-heading font-bold ${program.highlighted ? "text-white" : "text-primary"} text-2xl mb-2`}>
                  {program.title}
                </h3>
                <p className={`${program.highlighted ? "text-white/80" : "text-foreground/80"} mb-6`}>
                  {program.description}
                </p>
                
                <div className="flex items-baseline mb-6">
                  <span className={`${program.highlighted ? "text-accent" : "text-primary"} font-heading font-bold text-4xl`}>
                    {program.price}
                  </span>
                  <span className={`${program.highlighted ? "text-white/70" : "text-foreground/70"} ml-2`}>
                    / {program.duration}
                  </span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {program.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className={`flex items-start ${feature.included ? "" : "text-foreground/50"} ${program.highlighted ? "text-white" : ""}`}>
                      {feature.included ? (
                        <i className="fas fa-check text-accent mt-1 mr-3"></i>
                      ) : (
                        <i className="fas fa-times mt-1 mr-3"></i>
                      )}
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={scrollToConsultation}
                  className={`block text-center w-full py-3 px-6 rounded-lg transition-colors font-semibold ${
                    program.highlighted 
                      ? "bg-accent border-2 border-accent text-primary hover:bg-accent/90" 
                      : "bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white"
                  }`}
                >
                  {program.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center bg-muted/50 rounded-lg p-6 max-w-2xl mx-auto">
          <p className="text-foreground mb-2">
            <i className="fas fa-info-circle mr-2 text-primary"></i> 
            <span className="font-semibold">Financing options available.</span> Spread program costs over multiple payments.
          </p>
          <a href="#" className="text-primary hover:text-accent font-semibold underline">
            Learn more about payment plans
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
