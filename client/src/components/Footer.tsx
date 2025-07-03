import { useEffect } from 'react';
import { Link } from 'wouter';

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
              Simplify your LSAT journey. Custom tutoring and planning from a perfect scorer.
            </p>
            {/* Social media buttons removed as requested */}
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/methodology">
                <button className="text-white/70 hover:text-accent transition-colors text-left">
                  Methodology & Results
                </button>
              </Link>
              <Link href="/programs">
                <button className="text-white/70 hover:text-accent transition-colors text-left">
                  Tutoring Programs
                </button>
              </Link>

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
                <a href="mailto:germaine@alumni.princeton.edu" className="hover:text-accent transition-colors">
                  germaine@alumni.princeton.edu
                </a>
              </p>
              <p className="flex items-start text-white/70">
                <i className="fas fa-clock w-5 mr-2 text-accent mt-1"></i>
                <span>
                  Monday - Friday: 9:00 AM - Midnight Eastern Time<br />
                  Saturday - Sunday: 10:00 AM - 8:00 PM Eastern Time
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
