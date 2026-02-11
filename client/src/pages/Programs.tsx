import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface Feature {
  included: boolean;
  text: string;
  bonus?: boolean;
}

interface Program {
  title: string;
  description: string;
  price: string;
  duration: string;
  hourly: string;
  savings: string | null;
  features: Feature[];
  buttonText: string;
  highlighted: boolean;
}

const Programs = () => {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  const programs: Program[] = [
    {
      title: "4-Hour Acceleration & Alignment Audit",
      description: "Rapidly improve performance and uncover opportunities.",
      price: "$639",
      duration: "4 hours",
      hourly: "$159.75",
      savings: null,
      features: [
        { included: true, text: "Comprehensive Tutoring Hours: 4 Hours" },
        { included: false, text: "Focused Diagnostic & Initial Strategy Session" },
        { included: true, text: "Section-Specific Strategy Discussion" },
        { included: true, text: "Personalized Study Plan Outline" },
        { included: false, text: "Free Practice Test Review Sessions" },
        { included: false, text: "Permanent Question Explanation Database Access" },
        { included: false, text: "Custom Strategy Materials" },
        { included: true, text: "Email & Text Support" },
        { included: false, text: "Priority in New Material Creation/Selection" },
        { included: false, text: "Course not included", bonus: true }
      ],
      buttonText: "Purchase Session",
      highlighted: false
    },
    {
      title: "12-Hour LSAT Elevation Course",
      description: "For students targeting a 5–10 point gain. Custom study plan.",
      price: "$1,599",
      duration: "12 hours",
      hourly: "$133.25",
      savings: "(16% savings)",
      features: [
        { included: true, text: "Comprehensive Tutoring Hours: 12 Hours" },
        { included: true, text: "Focused Diagnostic & Strategy Call" },
        { included: true, text: "Section-Specific Strategy Discussion" },
        { included: true, text: "Personalized Study Plan Outline" },
        { included: true, text: "One Free Practice Test Review Session", bonus: true },
        { included: true, text: "Permanent Question Explanation Database Access", bonus: true },
        { included: true, text: "Custom Strategy Materials" },
        { included: true, text: "Email & Text Support" },
        { included: false, text: "Priority in New Material Creation/Selection" },
        { included: true, text: "LSAT content library included", bonus: true }
      ],
      buttonText: "Enroll in Course",
      highlighted: false
    },
    {
      title: "36-Hour LSAT Mastery Program",
      description: "For 10+ point improvements or 170+ goals. Full mastery.",
      price: "$3,359",
      duration: "36 hours",
      hourly: "$93.31",
      savings: "(41% savings)",
      features: [
        { included: true, text: "Comprehensive Tutoring Hours: 36 Hours" },
        { included: true, text: "Focused Diagnostic & Initial Strategy Session" },
        { included: true, text: "Section-Specific Strategy Discussion" },
        { included: true, text: "Personalized Study Plan Outline" },
        { included: true, text: "Three One-Hour Free Practice Test Review Sessions", bonus: true },
        { included: true, text: "Permanent Full Question Explanation Database Access", bonus: true },
        { included: true, text: "Custom Strategy Materials" },
        { included: true, text: "Email & Text Support" },
        { included: true, text: "Priority in New Material Creation/Selection" },
        { included: true, text: "LSAT content library included", bonus: true }
      ],
      buttonText: "Enroll in Mastery",
      highlighted: true
    }
  ];

  const handleProgramClick = (programTitle: string) => {
    if ((window as any).Calendly) {
      let url = '';
      if (programTitle === "4-Hour Acceleration & Alignment Audit") {
        url = 'https://calendly.com/germaine-washington-tutoring/4-hour-acceleration-alignment-audit';
      } else if (programTitle === "12-Hour LSAT Elevation Course") {
        url = 'https://calendly.com/germaine-washington-tutoring/12-hour-lsat-elevation-course';
      } else if (programTitle === "36-Hour LSAT Mastery Program") {
        url = 'https://calendly.com/germaine-washington-tutoring/36-hour-lsat-mastery-program';
      }
      
      if (url) {
        (window as any).Calendly.initPopupWidget({ url });
      }
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <Header />
      
      <main className="py-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading font-bold text-primary text-4xl md:text-5xl mb-6">
              Personalized LSAT Tutoring Programs
            </h1>
            <p className="text-foreground text-xl leading-relaxed mb-8">
              Choose the program that aligns with your goals, timeline, and starting point. 
              Each program is designed to deliver specific outcomes through personalized instruction.
            </p>
            <div className="inline-flex items-center justify-center space-x-4 text-sm text-primary/80">
              <div className="flex items-center">
                <i className="fas fa-check-circle text-accent mr-2"></i>
                <span>All programs include custom materials</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-accent mr-2"></i>
                <span>Flexible scheduling</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-accent mr-2"></i>
                <span>Proven methodology</span>
              </div>
            </div>
          </div>
        </section>



        {/* Program Cards */}
        <section className="container mx-auto px-4 mb-20">
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {programs.map((program, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  program.highlighted
                    ? "bg-primary border-2 border-accent rounded-xl shadow-xl overflow-hidden relative transform transition-all hover:scale-105"
                    : "bg-white border border-muted rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg"
                }`}
              >
                {program.highlighted && (
                  <div className="absolute top-0 right-0 bg-accent text-primary font-bold py-1 px-4 rounded-bl-lg z-10">
                    MOST POPULAR
                  </div>
                )}

                <div className="p-8 flex flex-col flex-grow">
                  <h3 className={`font-heading font-bold ${program.highlighted ? "text-white" : "text-primary"} text-2xl mb-2`}>
                    {program.title}
                  </h3>
                  <p className={`${program.highlighted ? "text-white/80" : "text-foreground/80"} mb-6 text-sm`}>
                    {program.description}
                  </p>

                  <div className="flex flex-col mb-6">
                    <div className="flex items-baseline">
                      <span className={`${program.highlighted ? "text-accent" : "text-primary"} font-heading font-bold text-4xl`}>
                        {program.price}
                      </span>
                      <span className={`${program.highlighted ? "text-white/70" : "text-foreground/70"} ml-2 text-sm`}>
                        / {program.duration}
                      </span>
                    </div>
                    <div className="mt-1">
                      <span className={`${program.highlighted ? "text-white/80" : "text-foreground/80"} text-sm`}>
                        {program.hourly} per hour
                      </span>
                      {program.savings && (
                        <span className={`${program.highlighted ? "text-accent" : "text-primary"} text-sm font-medium ml-2`}>
                          {program.savings}
                        </span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-2 mb-8 text-sm">
                    {program.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className={`flex items-start ${feature.included ? "" : program.highlighted ? "text-white/60" : "text-foreground/60"} ${program.highlighted && feature.included ? "text-white" : ""}`}>
                        {feature.included ? (
                          <i className={`fas fa-check ${program.highlighted ? "text-accent" : "text-accent"} mt-1 mr-2 shrink-0`}></i>
                        ) : (
                          <i className={`fas fa-times ${program.highlighted ? "text-white/60" : "text-foreground/60"} mt-1 mr-2 shrink-0`}></i>
                        )}
                        <span className="leading-snug">
                          {feature.text}
                          {feature.bonus && <span className={`ml-1 ${program.highlighted ? "text-accent" : "text-accent"} font-bold`}>+ BONUS</span>}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <button
                      onClick={() => handleProgramClick(program.title)}
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
              </div>
            ))}
          </div>
        </section>



        {/* Comparison Table */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-12 text-center">
                Compare Programs at a Glance
              </h2>
              
              <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-primary text-white">
                      <th className="p-4 text-left font-semibold">Feature</th>
                      <th className="p-4 text-center font-semibold">4-Hour Audit</th>
                      <th className="p-4 text-center font-semibold">12-Hour Course</th>
                      <th className="p-4 text-center font-semibold bg-accent/20">36-Hour Mastery</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Total Hours</td>
                      <td className="p-4 text-center">4</td>
                      <td className="p-4 text-center">12</td>
                      <td className="p-4 text-center font-semibold">36</td>
                    </tr>
                    <tr className="border-b bg-muted/10">
                      <td className="p-4 font-medium">Price per Hour</td>
                      <td className="p-4 text-center">$159.75</td>
                      <td className="p-4 text-center">$133.25</td>
                      <td className="p-4 text-center font-semibold text-accent">$93.31</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Best For</td>
                      <td className="p-4 text-center text-sm">Quick diagnosis & strategy</td>
                      <td className="p-4 text-center text-sm">5-10 point improvement</td>
                      <td className="p-4 text-center text-sm font-semibold">10+ points or 170+ goals</td>
                    </tr>
                    <tr className="border-b bg-muted/10">
                      <td className="p-4 font-medium">Free Practice Test Reviews</td>
                      <td className="p-4 text-center">—</td>
                      <td className="p-4 text-center">1 session</td>
                      <td className="p-4 text-center font-semibold">3 sessions</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Question Database Access</td>
                      <td className="p-4 text-center">—</td>
                      <td className="p-4 text-center">✓</td>
                      <td className="p-4 text-center font-semibold">✓ Full Access</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Success Path */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-12 text-center">
                Your Path to LSAT Success
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div className="ml-6">
                    <h3 className="font-heading font-bold text-primary text-xl mb-2">Initial Consultation</h3>
                    <p className="text-foreground leading-relaxed">
                      We'll discuss your current score, target schools, timeline, and learning style to recommend the ideal program.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div className="ml-6">
                    <h3 className="font-heading font-bold text-primary text-xl mb-2">Diagnostic Analysis</h3>
                    <p className="text-foreground leading-relaxed">
                      Through a comprehensive review of your practice test, we'll identify specific areas for improvement and create your personalized strategy.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div className="ml-6">
                    <h3 className="font-heading font-bold text-primary text-xl mb-2">Strategic Sessions</h3>
                    <p className="text-foreground leading-relaxed">
                      Each session builds on the previous, introducing new techniques while reinforcing mastered concepts for consistent improvement.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <div className="ml-6">
                    <h3 className="font-heading font-bold text-primary text-xl mb-2">Ongoing Support</h3>
                    <p className="text-foreground leading-relaxed">
                      Between sessions, you'll have email support, custom practice materials, and clear guidance on what to focus on.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-blue-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-12 text-center">
                Program FAQs
              </h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold text-primary text-lg mb-3">
                    How do I know which program is right for me?
                  </h3>
                  <p className="text-foreground leading-relaxed">
                    Schedule a free consultation! We'll discuss your current score, goals, and timeline to recommend the best fit. 
                    Generally, the 4-hour audit is great for diagnosis, 12-hour for moderate improvement, and 36-hour for significant gains.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold text-primary text-lg mb-3">
                    Can I upgrade my program later?
                  </h3>
                  <p className="text-foreground leading-relaxed">
                    Absolutely! Many students start with the 4-hour audit and upgrade. We'll credit your initial investment toward a larger program if you upgrade within 30 days.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold text-primary text-lg mb-3">
                    How are sessions scheduled?
                  </h3>
                  <p className="text-foreground leading-relaxed">
                    All sessions are conducted online via video conference with flexible scheduling including evenings and weekends. 
                    Most students complete their hours over 4-12 weeks depending on the program.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold text-primary text-lg mb-3">
                    What materials do I need?
                  </h3>
                  <p className="text-foreground leading-relaxed">
                    Just access to official LSAT practice tests. I'll provide all custom strategy materials, practice sets, and resources specific to your improvement plan.
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
                Ready to Start Your LSAT Journey?
              </h2>
              <p className="text-xl mb-8 text-white/90 leading-relaxed">
                Schedule a free consultation to discuss your goals and find the perfect program for your success.
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
                Schedule Free Consultation
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Programs;