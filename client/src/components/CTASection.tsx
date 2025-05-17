import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

// Define Calendly types to avoid TypeScript errors
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    }
  }
}

const CTASection = () => {
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
    <section id="consultation" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12">
            <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-4">
              Ready to Transform Your LSAT Score? Let's Strategize.
            </h2>
            <p className="text-foreground leading-relaxed mb-8">
              Schedule a free 20-minute consultation to discuss your current performance, target score, 
              and how my methodology can help you achieve your goals.
            </p>
            
            {/* Calendly inline widget */}
            <div className="calendly-inline-widget" 
                 data-url="https://calendly.com/germaine-washington-tutoring/initial-consultation?primary_color=1b385f" 
                 style={{ minWidth: '320px', height: '900px' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
