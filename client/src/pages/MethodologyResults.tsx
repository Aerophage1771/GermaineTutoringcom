import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

const MethodologyResults = () => {
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
      extendedText: "What impressed me most was how the strategies were tailored to my specific weaknesses. Analytical Reasoning went from my worst section to nearly perfect, and the confidence boost carried over to the other sections."
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

  return (
    <div className="bg-background min-h-screen">
      <Header />
      
      <main className="py-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading font-bold text-primary text-4xl md:text-5xl mb-6">
              My Methodology & Student Results
            </h1>
            <p className="text-foreground text-xl leading-relaxed mb-8">
              Every high score is built on proven methodology. Learn how my systematic approach has helped hundreds of students achieve their target scores and get into their dream law schools.
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

        {/* Three-Step Methodology */}
        <section className="bg-blue-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-12 text-center">
                The Three-Step Methodology That Works
              </h2>
              
              <div className="grid lg:grid-cols-3 gap-8 mb-16">
                {/* Step 1: Define */}
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white font-bold text-2xl">1</span>
                  </div>
                  <h3 className="font-heading font-bold text-primary text-2xl mb-4">Define</h3>
                  <p className="text-foreground leading-relaxed mb-6">
                    We identify your specific weaknesses and learning style through diagnostic analysis and targeted questioning.
                  </p>
                  <div className="space-y-3 text-left">
                    <div className="flex items-start">
                      <i className="fas fa-check-circle text-accent mt-1 mr-3"></i>
                      <span className="text-foreground/80">Comprehensive diagnostic review</span>
                    </div>
                    <div className="flex items-start">
                      <i className="fas fa-check-circle text-accent mt-1 mr-3"></i>
                      <span className="text-foreground/80">Learning style assessment</span>
                    </div>
                    <div className="flex items-start">
                      <i className="fas fa-check-circle text-accent mt-1 mr-3"></i>
                      <span className="text-foreground/80">Goal setting and timeline planning</span>
                    </div>
                  </div>
                </div>

                {/* Step 2: Demonstrate */}
                <div className="bg-white rounded-xl shadow-lg p-8 text-center border-4 border-accent">
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-primary font-bold text-2xl">2</span>
                  </div>
                  <h3 className="font-heading font-bold text-primary text-2xl mb-4">Demonstrate</h3>
                  <p className="text-foreground leading-relaxed mb-6">
                    I show you exactly how to approach each question type with proven strategies tailored to your learning style.
                  </p>
                  <div className="space-y-3 text-left">
                    <div className="flex items-start">
                      <i className="fas fa-check-circle text-accent mt-1 mr-3"></i>
                      <span className="text-foreground/80">Live problem-solving sessions</span>
                    </div>
                    <div className="flex items-start">
                      <i className="fas fa-check-circle text-accent mt-1 mr-3"></i>
                      <span className="text-foreground/80">Step-by-step strategy breakdown</span>
                    </div>
                    <div className="flex items-start">
                      <i className="fas fa-check-circle text-accent mt-1 mr-3"></i>
                      <span className="text-foreground/80">Real-time feedback and adjustment</span>
                    </div>
                  </div>
                </div>

                {/* Step 3: Duplicate */}
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white font-bold text-2xl">3</span>
                  </div>
                  <h3 className="font-heading font-bold text-primary text-2xl mb-4">Duplicate</h3>
                  <p className="text-foreground leading-relaxed mb-6">
                    You practice the strategies independently until they become automatic, with my guidance and support.
                  </p>
                  <div className="space-y-3 text-left">
                    <div className="flex items-start">
                      <i className="fas fa-check-circle text-accent mt-1 mr-3"></i>
                      <span className="text-foreground/80">Guided independent practice</span>
                    </div>
                    <div className="flex items-start">
                      <i className="fas fa-check-circle text-accent mt-1 mr-3"></i>
                      <span className="text-foreground/80">Progress monitoring and adjustment</span>
                    </div>
                    <div className="flex items-start">
                      <i className="fas fa-check-circle text-accent mt-1 mr-3"></i>
                      <span className="text-foreground/80">Confidence building and mastery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section-Specific Strategies */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-12 text-center">
                Section-Specific Strategies
              </h2>
              
              <div className="space-y-12">
                {/* Logical Reasoning */}
                <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-primary">
                  <div className="flex items-start">
                    <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mr-6 flex-shrink-0">
                      <i className="fas fa-brain text-2xl text-primary"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-primary text-2xl mb-4">
                        Logical Reasoning: Foundation of Success
                      </h3>
                      <p className="text-foreground leading-relaxed mb-6">
                        Master the 50% of your LSAT score with systematic approach to argument analysis and question-type recognition.
                      </p>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Core Strategies</h4>
                          <ul className="space-y-2 text-foreground/80">
                            <li className="flex items-start">
                              <i className="fas fa-chevron-right text-accent mt-1 mr-2 text-xs"></i>
                              <span>Argument structure identification</span>
                            </li>
                            <li className="flex items-start">
                              <i className="fas fa-chevron-right text-accent mt-1 mr-2 text-xs"></i>
                              <span>Question-type specific approaches</span>
                            </li>
                            <li className="flex items-start">
                              <i className="fas fa-chevron-right text-accent mt-1 mr-2 text-xs"></i>
                              <span>Efficient answer choice elimination</span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Expected Progress</h4>
                          <ul className="space-y-2 text-foreground/80">
                            <li className="flex items-start">
                              <i className="fas fa-chart-up text-accent mt-1 mr-2"></i>
                              <span>-1 to -3 per section average</span>
                            </li>
                            <li className="flex items-start">
                              <i className="fas fa-chart-up text-accent mt-1 mr-2"></i>
                              <span>1:20 average per question</span>
                            </li>
                            <li className="flex items-start">
                              <i className="fas fa-chart-up text-accent mt-1 mr-2"></i>
                              <span>90%+ accuracy on trained question types</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reading Comprehension */}
                <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-blue-500">
                  <div className="flex items-start">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center mr-6 flex-shrink-0">
                      <i className="fas fa-book text-2xl text-blue-600"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-primary text-2xl mb-4">
                        Reading Comprehension: Strategic Reading
                      </h3>
                      <p className="text-foreground leading-relaxed mb-6">
                        Transform your reading approach to maximize comprehension while minimizing time investment.
                      </p>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Core Strategies</h4>
                          <ul className="space-y-2 text-foreground/80">
                            <li className="flex items-start">
                              <i className="fas fa-chevron-right text-accent mt-1 mr-2 text-xs"></i>
                              <span>Passage mapping techniques</span>
                            </li>
                            <li className="flex items-start">
                              <i className="fas fa-chevron-right text-accent mt-1 mr-2 text-xs"></i>
                              <span>Author perspective identification</span>
                            </li>
                            <li className="flex items-start">
                              <i className="fas fa-chevron-right text-accent mt-1 mr-2 text-xs"></i>
                              <span>Question anticipation methods</span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Expected Progress</h4>
                          <ul className="space-y-2 text-foreground/80">
                            <li className="flex items-start">
                              <i className="fas fa-chart-up text-accent mt-1 mr-2"></i>
                              <span>-2 to -4 per section typical</span>
                            </li>
                            <li className="flex items-start">
                              <i className="fas fa-chart-up text-accent mt-1 mr-2"></i>
                              <span>3-4 minutes per passage</span>
                            </li>
                            <li className="flex items-start">
                              <i className="fas fa-chart-up text-accent mt-1 mr-2"></i>
                              <span>85%+ accuracy on practiced passages</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytical Reasoning */}
                <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-accent">
                  <div className="flex items-start">
                    <div className="w-16 h-16 bg-accent/20 rounded-lg flex items-center justify-center mr-6 flex-shrink-0">
                      <i className="fas fa-puzzle-piece text-2xl text-primary"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-primary text-2xl mb-4">
                        Analytical Reasoning: Systematic Solutions
                      </h3>
                      <p className="text-foreground leading-relaxed mb-6">
                        The most learnable section when approached with proper diagramming and inference techniques.
                      </p>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Core Strategies</h4>
                          <ul className="space-y-2 text-foreground/80">
                            <li className="flex items-start">
                              <i className="fas fa-chevron-right text-accent mt-1 mr-2 text-xs"></i>
                              <span>Universal diagramming system</span>
                            </li>
                            <li className="flex items-start">
                              <i className="fas fa-chevron-right text-accent mt-1 mr-2 text-xs"></i>
                              <span>Inference chain methodology</span>
                            </li>
                            <li className="flex items-start">
                              <i className="fas fa-chevron-right text-accent mt-1 mr-2 text-xs"></i>
                              <span>Split-boarding techniques</span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Expected Progress</h4>
                          <ul className="space-y-2 text-foreground/80">
                            <li className="flex items-start">
                              <i className="fas fa-chart-up text-accent mt-1 mr-2"></i>
                              <span>-0 to -2 achievable for most</span>
                            </li>
                            <li className="flex items-start">
                              <i className="fas fa-chart-up text-accent mt-1 mr-2"></i>
                              <span>8-9 minutes per set mastery</span>
                            </li>
                            <li className="flex items-start">
                              <i className="fas fa-chart-up text-accent mt-1 mr-2"></i>
                              <span>100% accuracy potential</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Success Stories */}
        <section className="bg-primary py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-heading font-bold text-white text-3xl md:text-4xl mb-12 text-center">
                Real Results from Real Students
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
                      "{testimonial.text}"
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

        {/* Why This Methodology Works */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-12 text-center">
                Why This Methodology Works
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-md p-8">
                  <h3 className="font-heading font-bold text-primary text-xl mb-4">Personalized Approach</h3>
                  <p className="text-foreground leading-relaxed mb-4">
                    No two students learn the same way. My methodology adapts to your learning style, schedule, and specific weaknesses.
                  </p>
                  <ul className="space-y-2 text-foreground/80">
                    <li className="flex items-start">
                      <i className="fas fa-user text-accent mt-1 mr-2"></i>
                      <span>Customized strategy selection</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-user text-accent mt-1 mr-2"></i>
                      <span>Flexible pacing and focus</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-user text-accent mt-1 mr-2"></i>
                      <span>Individual problem diagnosis</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-8">
                  <h3 className="font-heading font-bold text-primary text-xl mb-4">Proven Track Record</h3>
                  <p className="text-foreground leading-relaxed mb-4">
                    Hundreds of students have achieved their target scores using this exact methodology.
                  </p>
                  <ul className="space-y-2 text-foreground/80">
                    <li className="flex items-start">
                      <i className="fas fa-chart-line text-accent mt-1 mr-2"></i>
                      <span>14+ point average improvement</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-chart-line text-accent mt-1 mr-2"></i>
                      <span>87% reach target scores</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-chart-line text-accent mt-1 mr-2"></i>
                      <span>42% achieve 170+ scores</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-8">
                  <h3 className="font-heading font-bold text-primary text-xl mb-4">Continuous Support</h3>
                  <p className="text-foreground leading-relaxed mb-4">
                    Learning doesn't stop when our session ends. You'll have ongoing guidance throughout your LSAT journey.
                  </p>
                  <ul className="space-y-2 text-foreground/80">
                    <li className="flex items-start">
                      <i className="fas fa-clock text-accent mt-1 mr-2"></i>
                      <span>Between-session check-ins</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-clock text-accent mt-1 mr-2"></i>
                      <span>Progress monitoring tools</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-clock text-accent mt-1 mr-2"></i>
                      <span>Test day preparation guidance</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-8">
                  <h3 className="font-heading font-bold text-primary text-xl mb-4">Expert Credentials</h3>
                  <p className="text-foreground leading-relaxed mb-4">
                    Learn from someone who mastered the test and understands the path to top scores.
                  </p>
                  <ul className="space-y-2 text-foreground/80">
                    <li className="flex items-start">
                      <i className="fas fa-star text-accent mt-1 mr-2"></i>
                      <span>180 LSAT score (99.9th percentile)</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-star text-accent mt-1 mr-2"></i>
                      <span>Princeton Logic graduate</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-star text-accent mt-1 mr-2"></i>
                      <span>Years of tutoring experience</span>
                    </li>
                  </ul>
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
                Ready to Transform Your LSAT Score?
              </h2>
              <p className="text-xl mb-8 text-white/90 leading-relaxed">
                This proven methodology has helped hundreds of students achieve their target scores. 
                Schedule your consultation to see how it can work for you.
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
                Schedule Your Consultation
                <i className="fas fa-arrow-right ml-3"></i>
              </button>
              <p className="mt-6 text-white/70 text-sm">
                Start your journey to 170+ scores
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default MethodologyResults;