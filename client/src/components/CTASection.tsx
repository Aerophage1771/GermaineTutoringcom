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
          <div className="md:flex">
            {/* Princeton University campus image */}
            <div className="md:w-1/2 relative">
              <img 
                src="https://pixabay.com/get/g472bcf764fad77edf8cc7db4eb49b01bfbe9db1b758e777f12c3fe83afff78bb94cd0acd15c834174bd368d305209e05f843aae3567ea0b454a526b63c7ad4c2_1280.jpg" 
                alt="Princeton University campus" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-primary/30"></div>
            </div>
            
            <div className="md:w-1/2 p-8 md:p-12">
              <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-4">
                Ready to Transform Your LSAT Score? Let's Strategize.
              </h2>
              <p className="text-foreground leading-relaxed mb-8">
                Schedule a free 20-minute consultation to discuss your current performance, target score, 
                and how my methodology can help you achieve your goals.
              </p>
              
              <Button 
                onClick={openCalendly}
                className="w-full bg-accent hover:bg-accent/90 text-primary font-bold py-5 px-6 rounded-lg transition-colors text-lg"
              >
                Schedule Time With Me
              </Button>
              
              <p className="mt-4 text-sm text-foreground/70 text-center">
                Click the button above to access my calendar and select a time that works for you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
