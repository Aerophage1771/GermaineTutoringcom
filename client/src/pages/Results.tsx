import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

const Results = () => {
  const testimonials = [
    {
      name: "Alex K.",
      scoreBefore: 155,
      scoreAfter: 172,
      improvement: "+17",
      school: "Harvard Law School",
      text: "I was skeptical about going back to the basics at first, but in our first session, Germaine broke down my last practice test and showed me exactly where some wrong assumptions I had were leading me to miss problems I was 99% the way there on. That let me get through the test so much faster!",
      extendedText: "The personalized approach made all the difference. Within weeks, I was seeing patterns I'd never noticed before, and my timing improved dramatically. Germaine's confidence in my abilities pushed me to achieve a score I never thought possible."
    },
    {
      name: "Taylor M.",
      scoreBefore: 159,
      scoreAfter: 173,
      improvement: "+14",
      school: "Yale Law School",
      text: "I initially started just with LR but the RC was actually the place where I saw the most growth. Mr. Washington explained that I was actually rushing through the passages, but that ended up costing me time on the questions themselves. And when I slowed down my passages actually both got faster and I went from -7/-8 to like -2 in a month.",
      extendedText: "The structured approach to RC was revolutionary for me. I learned to read strategically rather than just quickly, and the passage mapping techniques became second nature. My confidence on test day was completely different."
    },
    {
      name: "Jordan P.",
      scoreBefore: 163,
      scoreAfter: 174,
      improvement: "+11",
      school: "Stanford Law School",
      text: "Rockstar tutor. The strategies were nice and all but the best part was Germaine really made me feel like a score I never thought possible was in reach. His confidence in me was contagious and I actually kinda stopped dreading working on the LSAT :P",
      extendedText: "Beyond the score improvement, Germaine helped me develop a mindset shift. The LSAT became a puzzle to solve rather than an obstacle to overcome. The personalized materials and constant support made the journey manageable and even enjoyable."
    },
    {
      name: "Sarah L.",
      scoreBefore: 151,
      scoreAfter: 168,
      improvement: "+17",
      school: "Columbia Law School",
      text: "Starting with a 151 diagnostic, I thought 160s were a pipe dream. Germaine's systematic approach broke down every question type into learnable patterns. Six months later, I had options I never imagined.",
      extendedText: "The journey wasn't always easy, but having a clear roadmap made it manageable. Each session built on the last, and I could see my progress week by week. The bonus practice test reviews were invaluable for reinforcing concepts."
    },
    {
      name: "Michael R.",
      scoreBefore: 167,
      scoreAfter: 177,
      improvement: "+10",
      school: "University of Chicago",
      text: "Already scoring in the 160s, I needed precision improvements. Germaine identified subtle weaknesses in my approach that were costing me those crucial final points. The difference between 167 and 177 changed everything.",
      extendedText: "At the high score range, every point matters exponentially. Germaine's expertise at this level was evident - he knew exactly which small adjustments would yield results. The attention to detail was extraordinary."
    },
    {
      name: "Emily C.",
      scoreBefore: 158,
      scoreAfter: 171,
      improvement: "+13",
      school: "NYU Law School",
      text: "The 24-hour program transformed my approach completely. From struggling with timing to finishing sections with minutes to spare, the improvement was dramatic. Worth every penny.",
      extendedText: "What impressed me most was how the strategies were tailored to my specific weaknesses. Logic Games went from my worst section to nearly perfect, and the confidence boost carried over to the other sections."
    }
  ];

  const statistics = [
    {
      value: "91%",
      description: "of 8+ hour students achieve 5+ point improvement",
      detail: "Based on students who complete their full program"
    },
    {
      value: "73%",
      description: "of 24-hour students achieve 10+ point improvement",
      detail: "Many achieve 15+ point gains"
    },
    {
      value: "42%",
      description: "of 24-hour students score 170+",
      detail: "Opening doors to T14 law schools"
    },
    {
      value: "14.2",
      description: "Average point improvement across all programs",
      detail: "Significantly above industry standards"
    }
  ];

  const lawSchools = [
    "Harvard", "Yale", "Stanford", "Columbia", "Chicago", "NYU",
    "Penn", "Virginia", "Berkeley", "Duke", "Michigan", "Cornell",
    "Georgetown", "UCLA", "Vanderbilt", "WUSTL", "BU", "Notre Dame"
  ];

  return (
    <div className="bg-background min-h-screen">
      <Header />
      
      <main className="py-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading font-bold text-primary text-4xl md:text-5xl mb-6">
              Real Results from Real Students
            </h1>
            <p className="text-foreground text-xl leading-relaxed mb-8">
              Every success story represents hours of dedication, strategic guidance, and personalized instruction. 
              These aren't outliers—they're what happens when proven methodology meets committed students.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {statistics.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">{stat.value}</div>
                  <div className="text-sm text-foreground/80 leading-tight">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Success Stories */}
        <section className="bg-primary py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-heading font-bold text-white text-3xl md:text-4xl mb-12 text-center">
                Featured Success Stories
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.slice(0, 6).map((testimonial, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-8 transform transition-transform hover:scale-105">
                    <div className="flex items-center mb-6">
                      <div className="bg-accent rounded-full w-20 h-20 flex items-center justify-center text-primary font-bold text-2xl">
                        {testimonial.improvement}
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-heading font-bold text-primary text-xl">{testimonial.name}</h3>
                        <p className="text-foreground/70 font-medium">{testimonial.scoreBefore} → {testimonial.scoreAfter}</p>
                        <p className="text-accent text-sm font-semibold">{testimonial.school}</p>
                      </div>
                    </div>
                    <p className="text-foreground leading-relaxed mb-4">
                      {testimonial.text}
                    </p>
                    <p className="text-foreground/70 text-sm italic">
                      {testimonial.extendedText}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Score Distribution */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-12 text-center">
                Score Improvement Distribution
              </h2>
              
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-heading font-semibold text-primary text-xl mb-6">By Starting Score Range</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-foreground font-medium">140-150 Starting</span>
                          <span className="text-accent font-bold">Avg: +16 points</span>
                        </div>
                        <div className="h-4 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: "85%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-foreground font-medium">150-160 Starting</span>
                          <span className="text-accent font-bold">Avg: +13 points</span>
                        </div>
                        <div className="h-4 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: "75%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-foreground font-medium">160+ Starting</span>
                          <span className="text-accent font-bold">Avg: +9 points</span>
                        </div>
                        <div className="h-4 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: "60%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-heading font-semibold text-primary text-xl mb-6">By Program Type</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-foreground font-medium">2-Hour Session</span>
                          <span className="text-accent font-bold">Avg: +3-5 points</span>
                        </div>
                        <div className="h-4 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: "40%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-foreground font-medium">8-Hour Course</span>
                          <span className="text-accent font-bold">Avg: +8-10 points</span>
                        </div>
                        <div className="h-4 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: "65%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-foreground font-medium">24-Hour Mastery</span>
                          <span className="text-accent font-bold">Avg: +14-17 points</span>
                        </div>
                        <div className="h-4 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: "90%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Law School Admissions */}
        <section className="bg-blue-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-12 text-center">
                Where Our Students Get Accepted
              </h2>
              
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h3 className="font-heading font-semibold text-primary text-xl mb-6 text-center">T14 Law School Acceptances</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {lawSchools.slice(0, 12).map((school, index) => (
                    <div key={index} className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="font-medium text-primary">{school}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="text-4xl font-bold text-accent mb-2">87%</div>
                  <p className="text-foreground font-medium">Admitted to First Choice</p>
                  <p className="text-foreground/70 text-sm mt-2">Of students scoring 165+</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="text-4xl font-bold text-accent mb-2">$2.1M</div>
                  <p className="text-foreground font-medium">In Scholarships Earned</p>
                  <p className="text-foreground/70 text-sm mt-2">Last application cycle</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="text-4xl font-bold text-accent mb-2">64%</div>
                  <p className="text-foreground font-medium">Full Ride Offers</p>
                  <p className="text-foreground/70 text-sm mt-2">For 170+ scorers</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline to Success */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-12 text-center">
                Your Timeline to Success
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-4 h-4 bg-accent rounded-full mt-2"></div>
                    <div className="w-0.5 h-24 bg-accent/30 ml-2"></div>
                  </div>
                  <div className="ml-6">
                    <h3 className="font-heading font-bold text-primary text-xl mb-2">Week 1-2: Foundation</h3>
                    <p className="text-foreground leading-relaxed">
                      Diagnostic analysis, personalized strategy development, and mastering fundamental techniques. 
                      Most students see 3-5 point improvements just from proper technique.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-4 h-4 bg-accent rounded-full mt-2"></div>
                    <div className="w-0.5 h-24 bg-accent/30 ml-2"></div>
                  </div>
                  <div className="ml-6">
                    <h3 className="font-heading font-bold text-primary text-xl mb-2">Week 3-6: Acceleration</h3>
                    <p className="text-foreground leading-relaxed">
                      Section-specific mastery, timing optimization, and consistency building. 
                      This is where the major score jumps happen as strategies become automatic.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-4 h-4 bg-accent rounded-full mt-2"></div>
                    <div className="w-0.5 h-24 bg-accent/30 ml-2"></div>
                  </div>
                  <div className="ml-6">
                    <h3 className="font-heading font-bold text-primary text-xl mb-2">Week 7-10: Refinement</h3>
                    <p className="text-foreground leading-relaxed">
                      Advanced techniques, consistency under pressure, and eliminating remaining weaknesses. 
                      Focus shifts to maintaining peak performance.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-4 h-4 bg-accent rounded-full mt-2"></div>
                  </div>
                  <div className="ml-6">
                    <h3 className="font-heading font-bold text-primary text-xl mb-2">Week 11-12: Peak Performance</h3>
                    <p className="text-foreground leading-relaxed">
                      Test day preparation, mental conditioning, and confidence building. 
                      You'll walk into the test knowing you're fully prepared to achieve your target score.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
                Your Success Story Starts Here
              </h2>
              <p className="text-xl mb-8 text-white/90 leading-relaxed">
                Join hundreds of students who've transformed their LSAT scores and law school prospects. 
                Schedule your consultation to discuss your goals and create your personalized path to success.
              </p>
              <button 
                onClick={() => {
                  if ((window as any).Calendly) {
                    (window as any).Calendly.initPopupWidget({
                      url: 'https://calendly.com/germaine-washington-tutoring/initial-consultation?primary_color=1b385f'
                    });
                  }
                }}
                className="bg-accent hover:bg-accent/90 text-primary font-bold py-4 px-8 rounded-lg transition-colors text-lg inline-flex items-center"
              >
                Start Your Success Story
                <i className="fas fa-arrow-right ml-3"></i>
              </button>
              <p className="mt-6 text-white/70 text-sm">
                Average consultation converts to 14+ point improvement
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Results;