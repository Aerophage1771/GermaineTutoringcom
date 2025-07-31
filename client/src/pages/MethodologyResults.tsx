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
    },
    {
      name: "Taylor M.",
      scoreBefore: 159,
      scoreAfter: 173,
      improvement: "+14",
      school: "Yale Law School",
      text: "I initially started just with LR but the RC was actually the place where I saw the most growth. Mr. Washington explained that I was actually rushing through the passages, but that ended up costing me time on the questions themselves. And when I slowed down my passages actually both got faster and I went from -7/-8 to like -2 in a month.",
    },
    {
      name: "Jordan P.",
      scoreBefore: 163,
      scoreAfter: 174,
      improvement: "+11",
      school: "Stanford Law School",
      text: "Rockstar tutor. The strategies were nice and all but the best part was Germaine really made me feel like a score I never thought possible was in reach. His confidence in me was contagious and I actually kinda stopped dreading working on the LSAT :P",
    },
    {
      name: "Sarah L.",
      scoreBefore: 151,
      scoreAfter: 168,
      improvement: "+17",
      school: "Columbia Law School",
      text: "Starting with a 151, I thought 160s were a pipe dream. Germaine's clear step-by-step lessons broke down every question type into easier patterns. After 6 weeks of tutoring, I scored 3 points above my goal!",
    },
    {
      name: "Michael R.",
      scoreBefore: 167,
      scoreAfter: 177,
      improvement: "+10",
      school: "USC - Gould",
      text: "I was already in the 160s, but something felt off. Germaine picked up on these little things in my approach that I didn’t even realize were holding me back. That shift from a 167 to a 177? Total game-changer",
    },
    {
      name: "Emily C.",
      scoreBefore: 158,
      scoreAfter: 171,
      improvement: "+13",
      school: "ASU Law",
      text: "Completely changed how I take the test. I used to be scrambling to finish and now I’m wrapping up with time to spare. Huge difference. Honestly worth every penny.",
    },
  ];

  const statistics = [
    {
      value: "87%",
      description: "of students achieve their target score improvement",
      detail: "Based on students who complete their tutoring program",
    },
    {
      value: "14.2",
      description: "average point improvement across all students",
      detail: "Many achieve 15+ point gains",
    },
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
              Every high score is built on proven methodology. Learn how my
              systematic approach has helped hundreds of students achieve their
              target scores and get into their dream law schools.
            </p>
            <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
              {statistics.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-foreground/80 leading-tight">
                    {stat.description}
                  </div>
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
                  <h3 className="font-heading font-bold text-primary text-2xl mb-4">
                    Define
                  </h3>
                  <p className="text-foreground leading-relaxed mb-6">
                    We identify your specific strengths and weaknesses by
                    analyzing your prior LSAT performances and engaging in a
                    complete diagnostic review of a new test.
                  </p>
                  <div className="space-y-3 text-left">
                    <div className="flex items-start">
                      <i className="fas fa-check-circle text-accent mt-1 mr-3"></i>
                      <span className="text-foreground/80">
                        Comprehensive diagnostic review
                      </span>
                    </div>
                    <div className="flex items-start">
                      <i className="fas fa-check-circle text-accent mt-1 mr-3"></i>
                      <span className="text-foreground/80">
                        Identification of easy improvement areas
                      </span>
                    </div>
                    <div className="flex items-start">
                      <i className="fas fa-check-circle text-accent mt-1 mr-3"></i>
                      <span className="text-foreground/80">
                        Personalized learning plan
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 2: Demonstrate */}
                <div className="bg-white rounded-xl shadow-lg p-8 text-center border-4 border-accent">
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-primary font-bold text-2xl">2</span>
                  </div>
                  <h3 className="font-heading font-bold text-primary text-2xl mb-4">
                    Demonstrate
                  </h3>
                  <p className="text-foreground leading-relaxed mb-6">
                    I show you exactly how to approach each question type with
                    proven strategies adapted to your learning style.
                  </p>
                  <div className="space-y-3 text-left">
                    <div className="flex items-start">
                      <i className="fas fa-check-circle text-accent mt-1 mr-3"></i>
                      <span className="text-foreground/80">
                        Live problem-solving sessions
                      </span>
                    </div>
                    <div className="flex items-start">
                      <i className="fas fa-check-circle text-accent mt-1 mr-3"></i>
                      <span className="text-foreground/80">
                        Step-by-step question explanations
                      </span>
                    </div>
                    <div className="flex items-start">
                      <i className="fas fa-check-circle text-accent mt-1 mr-3"></i>
                      <span className="text-foreground/80">
                        Real-time feedback and method adjustment
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 3: Duplicate */}
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white font-bold text-2xl">3</span>
                  </div>
                  <h3 className="font-heading font-bold text-primary text-2xl mb-4">
                    Duplicate
                  </h3>
                  <p className="text-foreground leading-relaxed mb-6">
                    You apply the strategies and receive feedback until they become second nature, with my guidance and support.
                  </p>
                  <div className="space-y-3 text-left">
                    <div className="flex items-start">
                      <i className="fas fa-check-circle text-accent mt-1 mr-3"></i>
                      <span className="text-foreground/80">
                        Independent practice + Guided review
                      </span>
                    </div>
                    <div className="flex items-start">
                      <i className="fas fa-check-circle text-accent mt-1 mr-3"></i>
                      <span className="text-foreground/80">
                        Progress monitoring and plan adjustment
                      </span>
                    </div>
                    <div className="flex items-start">
                      <i className="fas fa-check-circle text-accent mt-1 mr-3"></i>
                      <span className="text-foreground/80">
                        Speed and accuracy building exercises
                      </span>
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
                        Master the biggest part of your LSAT score with
                        systematic approach to argument analysis and
                        question-type recognition. Logical Reasoning success
                        requires understanding how arguments work, recognizing
                        patterns, and developing efficient problem-solving
                        strategies.
                      </p>
                      <div className="mb-6">
                        <h4 className="font-semibold text-primary mb-4">
                          Core Strategies
                        </h4>
                        <ul className="space-y-3 text-foreground/80">
                          <li className="flex items-start">
                            <i className="fas fa-chevron-right text-accent mt-1 mr-3 text-xs"></i>
                            <span>
                              <strong>
                                Argument structure identification:
                              </strong>{" "}
                              Learn to quickly identify premises, conclusions,
                              and assumptions. Understanding the logical flow
                              helps you predict what the question will ask and
                              where to look for answers.
                            </span>
                          </li>
                          <li className="flex items-start">
                            <i className="fas fa-chevron-right text-accent mt-1 mr-3 text-xs"></i>
                            <span>
                              <strong>
                                Question-type specific approaches:
                              </strong>{" "}
                              Each question type (strengthen, weaken,
                              assumption, inference, etc.) has specific patterns
                              and optimal solving strategies. Master these
                              patterns to work faster and more accurately.
                            </span>
                          </li>
                          <li className="flex items-start">
                            <i className="fas fa-chevron-right text-accent mt-1 mr-3 text-xs"></i>
                            <span>
                              <strong>
                                Efficient answer choice elimination:
                              </strong>{" "}
                              Develop systematic approaches to eliminate wrong
                              answers first, making the correct choice obvious
                              even when you're unsure of the perfect answer.
                            </span>
                          </li>
                          <li className="flex items-start">
                            <i className="fas fa-chevron-right text-accent mt-1 mr-3 text-xs"></i>
                            <span>
                              <strong>Time management techniques:</strong>{" "}
                              Balance thorough understanding with pace. Learn
                              when to move quickly and when to invest extra time
                              for maximum point return.
                            </span>
                          </li>
                        </ul>
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
                        Transform your reading approach to maximize
                        comprehension while minimizing time investment. Reading
                        Comprehension success comes from strategic reading that
                        balances speed with understanding, allowing you to
                        confidently answer questions about complex academic
                        passages.
                      </p>
                      <div className="mb-6">
                        <h4 className="font-semibold text-primary mb-4">
                          Core Strategies
                        </h4>
                        <ul className="space-y-3 text-foreground/80">
                          <li className="flex items-start">
                            <i className="fas fa-chevron-right text-accent mt-1 mr-3 text-xs"></i>
                            <span>
                              <strong>Passage mapping techniques:</strong>{" "}
                              Create mental roadmaps as you read, tracking main
                              ideas, supporting details, and structural
                              relationships. This helps you quickly locate
                              information when answering questions.
                            </span>
                          </li>
                          <li className="flex items-start">
                            <i className="fas fa-chevron-right text-accent mt-1 mr-3 text-xs"></i>
                            <span>
                              <strong>
                                Author perspective identification:
                              </strong>{" "}
                              Understand not just what the author says, but
                              their attitude, tone, and purpose. This insight is
                              crucial for inference and main point questions.
                            </span>
                          </li>
                          <li className="flex items-start">
                            <i className="fas fa-chevron-right text-accent mt-1 mr-3 text-xs"></i>
                            <span>
                              <strong>Question anticipation methods:</strong>{" "}
                              While reading, predict what questions might be
                              asked. This active reading approach helps you
                              focus on the most important information.
                            </span>
                          </li>
                          <li className="flex items-start">
                            <i className="fas fa-chevron-right text-accent mt-1 mr-3 text-xs"></i>
                            <span>
                              <strong>Comparative passage strategies:</strong>{" "}
                              Master the unique challenges of comparative
                              passages by understanding relationships between
                              texts and efficiently managing increased
                              complexity.
                            </span>
                          </li>
                        </ul>
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
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg p-8 transform transition-transform hover:scale-105"
                  >
                    <div className="flex items-center mb-6">
                      <div className="bg-accent rounded-full w-20 h-20 flex items-center justify-center text-primary font-bold text-2xl">
                        {testimonial.improvement}
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-heading font-bold text-primary text-xl">
                          {testimonial.name}
                        </h3>
                        <p className="text-foreground/70 font-medium">
                          {testimonial.scoreBefore} → {testimonial.scoreAfter}
                        </p>
                      </div>
                    </div>
                    <p className="text-foreground leading-relaxed">
                      {testimonial.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Law Schools Where Students Were Accepted */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-8">
                Law Schools Where My Students Were Accepted
              </h2>
              <p className="text-foreground/80 text-lg mb-12">
                My students have been accepted to top-tier law schools across
                the country
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  "Harvard Law School",
                  "Yale Law School",
                  "Stanford Law School",
                  "Columbia Law School",
                  "USC - Gould",
                  "ASU Law",
                ].map((school, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md p-6 text-center"
                  >
                    <p className="font-semibold text-primary">{school}</p>
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
                  <h3 className="font-heading font-bold text-primary text-xl mb-4">
                    Personalized Approach
                  </h3>
                  <p className="text-foreground leading-relaxed mb-4">
                    No two students learn the same way. My methodology adapts to
                    your learning style, schedule, and specific weaknesses.
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
                  <h3 className="font-heading font-bold text-primary text-xl mb-4">
                    Proven Track Record
                  </h3>
                  <p className="text-foreground leading-relaxed mb-4">
                    Hundreds of students have achieved their target scores using
                    this exact methodology.
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
                  </ul>
                </div>

                <div className="bg-white rounded-xl shadow-md p-8">
                  <h3 className="font-heading font-bold text-primary text-xl mb-4">
                    Continuous Support
                  </h3>
                  <p className="text-foreground leading-relaxed mb-4">
                    Learning doesn't stop when our session ends. You'll have
                    ongoing guidance throughout your LSAT journey.
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
                  <h3 className="font-heading font-bold text-primary text-xl mb-4">
                    Expert Credentials
                  </h3>
                  <p className="text-foreground leading-relaxed mb-4">
                    Learn from someone who mastered the test and understands the
                    path to top scores.
                  </p>
                  <ul className="space-y-2 text-foreground/80">
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
                This proven methodology has helped hundreds of students achieve
                their target scores. Schedule your consultation to see how it
                can work for you.
              </p>
              <button
                onClick={() => {
                  if ((window as any).Calendly) {
                    (window as any).Calendly.initPopupWidget({
                      url: "https://calendly.com/germaine-washington-tutoring/initial-consultation?primary_color=1b385f",
                    });
                  }
                }}
                className="bg-accent hover:bg-accent/90 text-primary font-bold py-4 px-8 rounded-lg transition-colors text-lg inline-flex items-center"
              >
                Schedule Your Consultation
                <i className="fas fa-arrow-right ml-3"></i>
              </button>
              <p className="mt-6 text-white/70 text-sm">
                Start your journey to your target score
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
