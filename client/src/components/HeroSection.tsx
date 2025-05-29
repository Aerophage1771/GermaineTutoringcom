import { useEffect } from 'react';

// Define Calendly types 
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    }
  }
}

const HeroSection = () => {
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
  }, []);
  
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

  return (
    <section className="hero-gradient text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
            LSAT Strategy Made Simple
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-3xl mx-auto">
            Navigate the LSAT with confidence using straightforward techniques designed for every learning style.
          </p>
          <button 
            onClick={openCalendly}
            className="inline-block bg-accent hover:bg-accent/90 text-primary font-bold text-lg px-8 py-4 rounded-md shadow-lg transition-all transform hover:scale-105"
          >
            Schedule Your Free Consultation
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {/* Stat Card 1 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20 transform transition-transform hover:translate-y-[-5px]">
            <span className="text-accent text-4xl font-heading font-bold block mb-2">180</span>
            <span className="text-white/90 font-medium">Perfect LSAT Score</span>
          </div>
          
          {/* Stat Card 2 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20 transform transition-transform hover:translate-y-[-5px]">
            <span className="text-accent text-4xl font-heading font-bold block mb-2">500+</span>
            <span className="text-white/90 font-medium">Students Helped</span>
          </div>
          
          {/* Stat Card 3 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20 transform transition-transform hover:translate-y-[-5px]">
            <span className="text-accent text-4xl font-heading font-bold block mb-2">14+</span>
            <span className="text-white/90 font-medium">Avg. Premium Increase</span>
          </div>
          
          {/* Stat Card 4 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20 transform transition-transform hover:translate-y-[-5px]">
            <span className="text-accent text-4xl font-heading font-bold block mb-2">98%+</span>
            <span className="text-white/90 font-medium">Improvement Rate</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
