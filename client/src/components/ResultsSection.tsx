const ResultsSection = () => {
  const testimonials = [
    {
      name: "Alex K.",
      scoreBefore: 155,
      scoreAfter: 172,
      improvement: "+17",
      text: "I was skeptical about going back to the basics at first, but in our first session, Germaine broke down my last practice test and showed me exactly where some wrong assumptions I had were leading me to miss problems I was 99% the way there on. That let me get through the test so much faster!"
    },
    {
      name: "Taylor M.",
      scoreBefore: 159,
      scoreAfter: 173,
      improvement: "+14",
      text: "I initially started just with LR but the RC was actually the place where I saw the most growth. Mr. Washington explained that I was actually rushing through the passages, but that ended up costing me time on the questions themselves. And when I slowed down my passages actually both got faster and I want from -7/-8 to like -2 in a month."
    },
    {
      name: "Jordan P.",
      scoreBefore: 163,
      scoreAfter: 174,
      improvement: "+11",
      text: "Rockstar tutor. The strategies were nice and all but the but best part was Germaine really made me feel like a score I never thought possible was in reach. His confidence in me was contagious and I actually kinda stopped dreading working on the LSAT :P"
    }
  ];

  const lawSchools = [
    "Harvard", "Yale", "Stanford", "Columbia", "Chicago", "NYU",
    "Penn", "Virginia", "Berkeley", "Duke", "Michigan", "Cornell"
  ];

  const statistics = [
    {
      value: "91%",
      description: "of Premium students achieve 5+ point improvement"
    },
    {
      value: "73%",
      description: "of Premium students achieve 10+ point improvement"
    },
    {
      value: "42%",
      description: "of Premium students achieve 15+ point improvement"
    }
  ];

  return (
    <section id="results" className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        {/* Testimonials - Now First */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 transform transition-transform hover:scale-105">
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
        </div>
        
        {/* Stats Box - Now with Inverted Colors & More Distinctive */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Left side - Score Improvements */}
              <div className="bg-primary p-8 md:p-10">
                <h3 className="font-heading font-bold text-white text-2xl mb-4">Score Improvements</h3>
                <p className="text-white/90 mb-6">
                  My students see an average improvement of 14+ points. Many achieve 170+ scores that open doors to top law schools.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-white font-medium">5+ Point Improvement</p>
                      <p className="text-accent font-bold">91% of students</p>
                    </div>
                    <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: "91%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-white font-medium">10+ Point Improvement</p>
                      <p className="text-accent font-bold">73% of students</p>
                    </div>
                    <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: "73%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-white font-medium">15+ Point Improvement</p>
                      <p className="text-accent font-bold">42% of students</p>
                    </div>
                    <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: "42%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right side - Law School Acceptances */}
              <div className="bg-white p-8 md:p-10">
                <h3 className="font-heading font-bold text-primary text-2xl mb-4">Law School Acceptances</h3>
                <p className="text-foreground/80 mb-6">
                  My students have been accepted to every T14 law school in the United States.
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  {lawSchools.map((school, index) => (
                    <div key={index} className="bg-primary/5 hover:bg-primary/10 transition-colors rounded-lg p-3 text-center">
                      <p className="text-primary font-medium">{school}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
