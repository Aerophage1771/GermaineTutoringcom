import { useState, useEffect } from 'react';

// Define Calendly types to avoid TypeScript errors
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    }
  }
}

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

const ProgramsSection = () => {
  // Add Calendly script to the document when component mounts
  useEffect(() => {
    // Check if Calendly script already exists
    if (!document.getElementById('calendly-script')) {
      // Add Calendly CSS
      const link = document.createElement('link');
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      
      // Add Calendly JS
      const script = document.createElement('script');
      script.id = 'calendly-script';
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);
    }
    
    // We don't need to remove the script on unmount as it might be needed elsewhere
    return () => {};
  }, []);
  const programs: Program[] = [
    {
      title: "2-Hour LSAT Acceleration Session",
      description: "Strategic session focused on rapidly improving performance and uncovering opportunities for growth on the LSAT",
      price: "$199",
      duration: "2 hours",
      hourly: "$99.50",
      savings: null,
      features: [
        { included: true, text: "Comprehensive Tutoring Hours: 2 Hours" },
        { included: false, text: "Focused Diagnostic & Initial Strategy Session" },
        { included: true, text: "Section-Specific Strategy Discussion" },
        { included: true, text: "Personalized Study Plan Outline" },
        { included: false, text: "Free Practice Test Review Sessions" },
        { included: false, text: "Permanent Question Explanation Database Access" },
        { included: false, text: "Custom Strategy Materials" },
        { included: true, text: "Email & Text Support" },
        { included: false, text: "Priority in New Material Creation/Selection" }
      ],
      buttonText: "Purchase Session",
      highlighted: false
    },
    {
      title: "8-Hour LSAT Elevation Course",
      description: "For students targeting a 5–10 point gain. Focused section work, strategy drills, and a custom study plan.",
      price: "$699",
      duration: "8 hours",
      hourly: "$87.38",
      savings: "(12.5% savings)",
      features: [
        { included: true, text: "Comprehensive Tutoring Hours: 8 Hours" },
        { included: true, text: "Focused Diagnostic & Strategy Call" },
        { included: true, text: "Section-Specific Strategy Discussion" },
        { included: true, text: "Personalized Study Plan Outline" },
        { included: true, text: "One Free Practice Test Review Session", bonus: true },
        { included: true, text: "Permanent Question Explanation Database Access", bonus: true },
        { included: true, text: "Custom Strategy Materials" },
        { included: true, text: "Email & Text Support" },
        { included: false, text: "Priority in New Material Creation/Selection" }
      ],
      buttonText: "Enroll in Course",
      highlighted: false
    },
    {
      title: "24-Hour LSAT Mastery Program",
      description: "For 10+ point improvements or 170+ goals. Intensive coaching, advanced strategy, and full-section mastery.",
      price: "$1,799",
      duration: "24 hours",
      hourly: "$74.96",
      savings: "(25% savings)",
      features: [
        { included: true, text: "Comprehensive Tutoring Hours: 24 Hours" },
        { included: true, text: "Focused Diagnostic & Initial Strategy Session" },
        { included: true, text: "Section-Specific Strategy Discussion" },
        { included: true, text: "Personalized Study Plan Outline" },
        { included: true, text: "Three One-Hour Free Practice Test Review Sessions", bonus: true },
        { included: true, text: "Permanent Full Question Explanation Database Access", bonus: true },
        { included: true, text: "Custom Strategy Materials" },
        { included: true, text: "Email & Text Support" },
        { included: true, text: "Priority in New Material Creation/Selection" }
      ],
      buttonText: "Enroll in Mastery",
      highlighted: true
    }
  ];

  const openCalendly = (e: React.MouseEvent) => {
    e.preventDefault();
    // Check if Calendly is loaded
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/germaine-washington-tutoring/initial-consultation?primary_color=d39e17'
      });
    } else {
      console.error('Calendly not loaded yet');
      // Fallback - open directly
      window.open('https://calendly.com/germaine-washington-tutoring/initial-consultation?primary_color=d39e17', '_blank');
    }
  };

  // Open Calendly for the 2-hour program
  const openTwoHourCalendly = (e: React.MouseEvent) => {
    e.preventDefault();
    // Check if Calendly is loaded
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/germaine-washington-tutoring/2-hour-lsat-tutoring'
      });
    } else {
      console.error('Calendly not loaded yet');
      // Fallback - open directly
      window.open('https://calendly.com/germaine-washington-tutoring/2-hour-lsat-tutoring', '_blank');
    }
  };
  
  // Open Calendly for the 8-hour program
  const open8HourCalendly = (e: React.MouseEvent) => {
    e.preventDefault();
    // Check if Calendly is loaded
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/germaine-washington-tutoring/8-hr-lsat-plan'
      });
    } else {
      console.error('Calendly not loaded yet');
      // Fallback - open directly
      window.open('https://calendly.com/germaine-washington-tutoring/8-hr-lsat-plan', '_blank');
    }
  };
  
  // Open Calendly for the 24-hour program
  const open24HourCalendly = (e: React.MouseEvent) => {
    e.preventDefault();
    // Check if Calendly is loaded
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/germaine-washington-tutoring/24-hour-lsat-premium-mastery-program'
      });
    } else {
      console.error('Calendly not loaded yet');
      // Fallback - open directly
      window.open('https://calendly.com/germaine-washington-tutoring/24-hour-lsat-premium-mastery-program', '_blank');
    }
  };
  
  // Handler for program buttons
  const handleProgramButtonClick = (programTitle: string) => {
    console.log(`Button clicked for: ${programTitle}`);
    
    // Different actions based on program title
    if (programTitle === "2-Hour LSAT Acceleration Session") {
      openTwoHourCalendly(new MouseEvent('click') as any);
    } else if (programTitle === "8-Hour LSAT Elevation Course") {
      open8HourCalendly(new MouseEvent('click') as any);
    } else if (programTitle === "24-Hour LSAT Mastery Program") {
      open24HourCalendly(new MouseEvent('click') as any);
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
              className={`flex flex-col ${ // Added flex flex-col to allow button to be pushed to bottom
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

              <div className="p-8 flex flex-col flex-grow"> {/* Added flex-grow to content area */}
                <h3 className={`font-heading font-bold ${program.highlighted ? "text-white" : "text-primary"} text-2xl mb-2`}>
                  {program.title}
                </h3>
                <p className={`${program.highlighted ? "text-white/80" : "text-foreground/80"} mb-6 text-sm`}> {/* Made description text-sm */}
                  {program.description}
                </p>

                <div className="flex flex-col mb-6">
                  <div className="flex items-baseline">
                    <span className={`${program.highlighted ? "text-accent" : "text-primary"} font-heading font-bold text-4xl`}>
                      {program.price}
                    </span>
                    <span className={`${program.highlighted ? "text-white/70" : "text-foreground/70"} ml-2 text-sm`}> {/* Made duration text-sm */}
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

                <ul className="space-y-2 mb-8 text-sm"> {/* Reduced space-y and made feature text-sm */}
                  {program.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className={`flex items-start ${feature.included ? "" : program.highlighted ? "text-white/60" : "text-foreground/60"} ${program.highlighted && feature.included ? "text-white" : ""}`}>
                      {feature.included ? (
                        <i className={`fas fa-check ${program.highlighted ? "text-accent" : "text-accent"} mt-1 mr-2 shrink-0`}></i> // Reduced mr
                      ) : (
                        <i className={`fas fa-times ${program.highlighted ? "text-white/60" : "text-foreground/60"} mt-1 mr-2 shrink-0`}></i> // Reduced mr
                      )}
                      <span className="leading-snug"> {/* Added leading-snug for tighter line height */}
                        {feature.text}
                        {feature.bonus && <span className={`ml-1 ${program.highlighted ? "text-accent" : "text-accent"} font-bold`}>+ BONUS</span>} {/* Reduced ml */}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto"> {/* This pushes the button to the bottom */}
                  <button
                    onClick={() => handleProgramButtonClick(program.title)} // Changed to more generic handler
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

        <div className="text-center bg-muted/50 rounded-lg p-6 max-w-3xl mx-auto">
          <p className="text-foreground mb-4">
            <i className="fas fa-info-circle mr-2 text-primary"></i>
            <span className="font-semibold">Financing options available during checkout.</span>
          </p>
          <button
            onClick={openCalendly}
            className="inline-block bg-primary text-white hover:bg-primary/90 font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            I Need a Custom Plan
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;