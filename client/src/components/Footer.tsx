import { useEffect } from 'react';

// Define Calendly types
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    }
  }
}

const Footer = () => {
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
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div className="md:col-span-2">
            <h3 className="font-heading font-bold text-xl mb-4">Germaine Washington LSAT Tutoring</h3>
            <p className="text-white/70 mb-4 leading-relaxed">
              Expert LSAT tutoring from a Princeton Logic graduate and perfect scorer. 
              Helping students achieve their target scores through proven, systematic methods.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-accent transition-colors" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white/70 hover:text-accent transition-colors" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white/70 hover:text-accent transition-colors" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-white/70 hover:text-accent transition-colors" aria-label="Reddit">
                <i className="fab fa-reddit-alien"></i>
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <button 
                onClick={() => document.getElementById('methodology')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="text-white/70 hover:text-accent transition-colors text-left"
              >
                My Methodology
              </button>
              <button 
                onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="text-white/70 hover:text-accent transition-colors text-left"
              >
                Tutoring Programs
              </button>
              <button 
                onClick={() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="text-white/70 hover:text-accent transition-colors text-left"
              >
                Student Results
              </button>
              <button 
                onClick={() => document.getElementById('guides')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="text-white/70 hover:text-accent transition-colors text-left"
              >
                Free LSAT Guides
              </button>
              <button 
                onClick={openCalendly}
                className="text-white/70 hover:text-accent transition-colors text-left"
              >
                Book Consultation
              </button>
            </nav>
          </div>
          
          {/* Column 3: Contact */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Contact</h3>
            <div className="space-y-2">
              <p className="flex items-center text-white/70">
                <i className="fas fa-envelope w-5 mr-2 text-accent"></i>
                <a href="mailto:germaine@germainetutoring.com" className="hover:text-accent transition-colors">
                  germaine@germainetutoring.com
                </a>
              </p>
              <p className="flex items-center text-white/70">
                <i className="fas fa-phone w-5 mr-2 text-accent"></i>
                <a href="tel:+15555555555" className="hover:text-accent transition-colors">
                  (555) 555-5555
                </a>
              </p>
              <p className="flex items-start text-white/70">
                <i className="fas fa-clock w-5 mr-2 text-accent mt-1"></i>
                <span>
                  Monday - Friday: 9am - 7pm EST<br />
                  Saturday: 10am - 4pm EST<br />
                  Sunday: Closed
                </span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
          <p className="mb-2">&copy; {new Date().getFullYear()} Germaine Washington LSAT Tutoring. All rights reserved.</p>
          <div>
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a> | 
            <a href="#" className="hover:text-accent transition-colors"> Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
