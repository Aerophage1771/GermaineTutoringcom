import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

const Methodology = () => {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      
      <main className="py-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading font-bold text-primary text-4xl md:text-5xl mb-6">
              The Princeton Method: A Systematic Approach to LSAT Mastery
            </h1>
            <p className="text-foreground text-xl leading-relaxed mb-8">
              After achieving a perfect 180 LSAT score and helping hundreds of students reach their target scores, 
              I've developed a proven methodology that transforms how students approach the test.
            </p>
            <div className="inline-flex items-center space-x-6 text-primary">
              <div className="text-center">
                <div className="text-4xl font-bold text-accent">180</div>
                <div className="text-sm">My LSAT Score</div>
              </div>
              <div className="w-px h-16 bg-primary/20"></div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent">14+</div>
                <div className="text-sm">Avg. Point Improvement</div>
              </div>
              <div className="w-px h-16 bg-primary/20"></div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent">73%</div>
                <div className="text-sm">10+ Point Gains</div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Philosophy */}
        <section className="bg-blue-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-12 text-center">
                The Three Pillars of Success
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform">
                  <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-book-open text-3xl text-primary"></i>
                  </div>
                  <h3 className="font-heading font-bold text-primary text-2xl mb-4">DEFINE</h3>
                  <p className="text-foreground leading-relaxed mb-4">
                    Break down complex LSAT patterns into clear, actionable rules.
                  </p>
                  <ul className="text-left space-y-2 text-foreground/80">
                    <li className="flex items-start">
                      <i className="fas fa-check text-accent mt-1 mr-2"></i>
                      <span>Identify question type signatures</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-accent mt-1 mr-2"></i>
                      <span>Map argument structures</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-accent mt-1 mr-2"></i>
                      <span>Create mental frameworks</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform">
                  <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-chart-line text-3xl text-primary"></i>
                  </div>
                  <h3 className="font-heading font-bold text-primary text-2xl mb-4">DEMONSTRATE</h3>
                  <p className="text-foreground leading-relaxed mb-4">
                    Apply strategies within your personalized learning path.
                  </p>
                  <ul className="text-left space-y-2 text-foreground/80">
                    <li className="flex items-start">
                      <i className="fas fa-check text-accent mt-1 mr-2"></i>
                      <span>Targeted practice sets</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-accent mt-1 mr-2"></i>
                      <span>Real-time feedback</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-accent mt-1 mr-2"></i>
                      <span>Adaptive difficulty</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform">
                  <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-trophy text-3xl text-primary"></i>
                  </div>
                  <h3 className="font-heading font-bold text-primary text-2xl mb-4">DUPLICATE</h3>
                  <p className="text-foreground leading-relaxed mb-4">
                    Master independent application of proven strategies.
                  </p>
                  <ul className="text-left space-y-2 text-foreground/80">
                    <li className="flex items-start">
                      <i className="fas fa-check text-accent mt-1 mr-2"></i>
                      <span>Internalize techniques</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-accent mt-1 mr-2"></i>
                      <span>Build test confidence</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-accent mt-1 mr-2"></i>
                      <span>Achieve consistency</span>
                    </li>
                  </ul>
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
                Section-Specific Mastery
              </h2>
              
              <div className="space-y-12">
                {/* Logical Reasoning */}
                <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-accent">
                  <div className="flex items-start">
                    <div className="w-16 h-16 bg-accent/20 rounded-lg flex items-center justify-center mr-6 flex-shrink-0">
                      <i className="fas fa-brain text-2xl text-primary"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-primary text-2xl mb-4">
                        Logical Reasoning: The Foundation
                      </h3>
                      <p className="text-foreground leading-relaxed mb-6">
                        Making up nearly half your score, LR requires systematic pattern recognition and strategic thinking.
                      </p>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Key Techniques</h4>
                          <ul className="space-y-2 text-foreground/80">
                            <li className="flex items-start">
                              <i className="fas fa-chevron-right text-accent mt-1 mr-2 text-xs"></i>
                              <span>Question stem analysis before stimulus</span>
                            </li>
                            <li className="flex items-start">
                              <i className="fas fa-chevron-right text-accent mt-1 mr-2 text-xs"></i>
                              <span>Conclusion identification shortcuts</span>
                            </li>
                            <li className="flex items-start">
                              <i className="fas fa-chevron-right text-accent mt-1 mr-2 text-xs"></i>
                              <span>Answer prediction methodology</span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Common Improvements</h4>
                          <ul className="space-y-2 text-foreground/80">
                            <li className="flex items-start">
                              <i className="fas fa-chart-up text-accent mt-1 mr-2"></i>
                              <span>-8 to -3 in 4-6 weeks</span>
                            </li>
                            <li className="flex items-start">
                              <i className="fas fa-chart-up text-accent mt-1 mr-2"></i>
                              <span>90%+ accuracy on targeted types</span>
                            </li>
                            <li className="flex items-start">
                              <i className="fas fa-chart-up text-accent mt-1 mr-2"></i>
                              <span>3-5 minute time savings per section</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reading Comprehension */}
                <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-accent">
                  <div className="flex items-start">
                    <div className="w-16 h-16 bg-accent/20 rounded-lg flex items-center justify-center mr-6 flex-shrink-0">
                      <i className="fas fa-book text-2xl text-primary"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-primary text-2xl mb-4">
                        Reading Comprehension: Strategic Analysis
                      </h3>
                      <p className="text-foreground leading-relaxed mb-6">
                        Transform from passive reading to active structural analysis for dramatic improvements.
                      </p>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-primary mb-2">The 3-Pass System</h4>
                          <ul className="space-y-2 text-foreground/80">
                            <li className="flex items-start">
                              <i className="fas fa-chevron-right text-accent mt-1 mr-2 text-xs"></i>
                              <span>Structure scan (30 seconds)</span>
                            </li>
                            <li className="flex items-start">
                              <i className="fas fa-chevron-right text-accent mt-1 mr-2 text-xs"></i>
                              <span>Content mapping (2-3 minutes)</span>
                            </li>
                            <li className="flex items-start">
                              <i className="fas fa-chevron-right text-accent mt-1 mr-2 text-xs"></i>
                              <span>Strategic question attack (3-4 minutes)</span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Proven Results</h4>
                          <ul className="space-y-2 text-foreground/80">
                            <li className="flex items-start">
                              <i className="fas fa-chart-up text-accent mt-1 mr-2"></i>
                              <span>-7 to -2 average improvement</span>
                            </li>
                            <li className="flex items-start">
                              <i className="fas fa-chart-up text-accent mt-1 mr-2"></i>
                              <span>Consistent passage timing</span>
                            </li>
                            <li className="flex items-start">
                              <i className="fas fa-chart-up text-accent mt-1 mr-2"></i>
                              <span>Increased inference accuracy</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logic Games */}
                <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-accent">
                  <div className="flex items-start">
                    <div className="w-16 h-16 bg-accent/20 rounded-lg flex items-center justify-center mr-6 flex-shrink-0">
                      <i className="fas fa-puzzle-piece text-2xl text-primary"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-primary text-2xl mb-4">
                        Logic Games: Systematic Solutions
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
                              <span>8-9 minutes per game mastery</span>
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

        {/* Why This Works */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-12 text-center">
                Why The Princeton Method Works
              </h2>
              
              <div className="space-y-8">
                <div className="bg-white rounded-xl shadow-md p-8">
                  <h3 className="font-heading font-bold text-primary text-xl mb-4 flex items-center">
                    <i className="fas fa-graduation-cap text-accent mr-3"></i>
                    Proven Academic Foundation
                  </h3>
                  <p className="text-foreground leading-relaxed">
                    Developed through years of perfect scoring and refined through teaching hundreds of students, 
                    this methodology combines Princeton-level analytical rigor with practical test-taking strategies.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-8">
                  <h3 className="font-heading font-bold text-primary text-xl mb-4 flex items-center">
                    <i className="fas fa-users text-accent mr-3"></i>
                    Personalized Application
                  </h3>
                  <p className="text-foreground leading-relaxed">
                    Unlike one-size-fits-all courses, every strategy is adapted to your specific strengths, 
                    weaknesses, and learning style for maximum efficiency and results.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-8">
                  <h3 className="font-heading font-bold text-primary text-xl mb-4 flex items-center">
                    <i className="fas fa-chart-line text-accent mr-3"></i>
                    Data-Driven Results
                  </h3>
                  <p className="text-foreground leading-relaxed">
                    With 73% of students achieving 10+ point improvements and many reaching 170+ scores, 
                    the results speak for themselves. This isn't theory—it's proven practice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center bg-primary rounded-xl p-12 text-white">
              <h2 className="font-heading font-bold text-3xl mb-6">
                Ready to Transform Your LSAT Approach?
              </h2>
              <p className="text-xl mb-8 text-white/90 leading-relaxed">
                Schedule a consultation to discuss how The Princeton Method can help you achieve your target score.
              </p>
              <button 
                onClick={() => {
                  if ((window as any).Calendly) {
                    (window as any).Calendly.initPopupWidget({
                      url: 'https://calendly.com/germaine-washington-tutoring/initial-consultation?primary_color=1b385f'
                    });
                  }
                }}
                className="bg-accent hover:bg-accent/90 text-primary font-bold py-4 px-8 rounded-lg transition-colors text-lg"
              >
                Schedule Your Strategy Session
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Methodology;