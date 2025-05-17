const ResultsSection = () => {
  const testimonials = [
    {
      name: "Sarah K.",
      scoreBefore: 155,
      scoreAfter: 172,
      improvement: "+17",
      text: "Germaine's methodology completely transformed my approach to logical reasoning. His 5-step framework helped me see patterns I was completely missing before. The Premium program was worth every penny—I'm headed to Columbia Law!"
    },
    {
      name: "Michael T.",
      scoreBefore: 159,
      scoreAfter: 173,
      improvement: "+14",
      text: "The 'Describe, Demonstrate, Duplicate' teaching method clicked for me in a way no other prep did. Germaine helped me understand the underlying logic rather than just memorizing solutions. Now I actually enjoy the process!"
    },
    {
      name: "Jennifer R.",
      scoreBefore: 163,
      scoreAfter: 174,
      improvement: "+11",
      text: "After plateauing with self-study, Germaine helped me break through to the next level. His Princeton logic background was evident in every session. The strategies he taught me were game-changers, especially for RC and LG sections."
    }
  ];

  const lawSchools = [
    "Harvard", "Yale", "Stanford", "Columbia", "Chicago", "NYU",
    "Penn", "Virginia", "Berkeley", "Duke", "Michigan", "Cornell"
  ];

  const statistics = [
    {
      value: "98%+",
      description: "of students on a program see score improvement"
    },
    {
      value: "14+",
      description: "average point increase on Premium Mastery Program"
    },
    {
      value: "170+",
      description: "scores achieved by 40% of Premium program students"
    }
  ];

  return (
    <section id="results" className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading font-bold text-white text-3xl md:text-4xl mb-4">Student Results</h2>
          <p className="text-white/90 text-lg leading-relaxed">
            My students consistently achieve significant score improvements, with 98% of those on a program seeing measurable gains.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center text-primary font-bold text-xl">
                  {testimonial.improvement}
                </div>
                <div className="ml-4">
                  <h4 className="font-heading font-bold text-primary text-lg">{testimonial.name}</h4>
                  <p className="text-foreground/70">{testimonial.scoreBefore} → {testimonial.scoreAfter}</p>
                </div>
              </div>
              <p className="text-foreground leading-relaxed">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
        
        {/* Law School Acceptances */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-16">
          <h3 className="font-heading font-bold text-white text-2xl mb-6 text-center">Law School Acceptances</h3>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {lawSchools.map((school, index) => (
              <div key={index} className="bg-white/20 rounded-lg p-3 text-center">
                <p className="text-white font-heading font-bold">{school}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Statistics Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statistics.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-8 text-center">
              <span className="text-accent text-5xl font-heading font-bold block mb-4">{stat.value}</span>
              <p className="text-primary font-medium">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
