import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

// Define Calendly types
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    }
  }
}

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  
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
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
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
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <h1 className="text-primary font-heading font-bold text-xl md:text-2xl">GermaineTutoring.com</h1>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden text-primary focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          <i className="fas fa-bars text-xl"></i>
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          {isAuthenticated ? (
            // Authenticated: Show only Logout button
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              Logout
            </Button>
          ) : (
            // Not authenticated: Show full navigation
            <>
              <Link href="/">
                <button 
                  onClick={scrollToTop}
                  className="text-foreground hover:text-primary font-medium text-sm lg:text-base transition-colors">
                  Home
                </button>
              </Link>
              <Link href="/methodology">
                <button 
                  onClick={scrollToTop}
                  className="text-foreground hover:text-primary font-medium text-sm lg:text-base transition-colors">
                  Methodology & Results
                </button>
              </Link>
              <Link href="/programs">
                <button 
                  onClick={scrollToTop}
                  className="text-foreground hover:text-primary font-medium text-sm lg:text-base transition-colors">
                  Tutoring Programs
                </button>
              </Link>
              <Link href="/blog">
                <button 
                  onClick={scrollToTop}
                  className="text-foreground hover:text-primary font-medium text-sm lg:text-base transition-colors">
                  LSAT Blog
                </button>
              </Link>
              <a
                href="https://student.germainetutoring.com"
                className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-5 rounded-lg transition-colors text-sm lg:text-base border-2 border-primary"
              >
                Student Log-In
              </a>
              <button 
                onClick={openCalendly} 
                className="bg-accent hover:bg-accent/90 text-primary font-bold px-5 py-2 rounded-lg transition-colors text-sm lg:text-base"
              >
                Schedule Consultation
              </button>
            </>
          )}
        </nav>
      </div>
      
      {/* Mobile Navigation */}
      <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} bg-white w-full px-4 py-4 shadow-lg md:hidden`}>
        <div className="flex flex-col space-y-4">
          {isAuthenticated ? (
            // Authenticated: Show only Logout button
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white w-full"
            >
              Logout
            </Button>
          ) : (
            // Not authenticated: Show full navigation
            <>
              <Link href="/">
                <button 
                  onClick={() => {
                    scrollToTop();
                    setMobileMenuOpen(false);
                  }}
                  className="text-foreground hover:text-primary font-medium transition-colors text-left"
                >
                  Home
                </button>
              </Link>
              <Link href="/methodology">
                <button 
                  onClick={() => {
                    scrollToTop();
                    setMobileMenuOpen(false);
                  }}
                  className="text-foreground hover:text-primary font-medium transition-colors text-left"
                >
                  Methodology & Results
                </button>
              </Link>
              <Link href="/programs">
                <button 
                  onClick={() => {
                    scrollToTop();
                    setMobileMenuOpen(false);
                  }}
                  className="text-foreground hover:text-primary font-medium transition-colors text-left"
                >
                  Tutoring Programs
                </button>
              </Link>
              <Link href="/blog">
                <button 
                  onClick={() => {
                    scrollToTop();
                    setMobileMenuOpen(false);
                  }}
                  className="text-foreground hover:text-primary font-medium transition-colors text-left"
                >
                  LSAT Blog
                </button>
              </Link>
              <a
                href="https://student.germainetutoring.com"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg transition-colors text-left"
              >
                Student Log-In
              </a>
              <button 
                onClick={openCalendly} 
                className="bg-accent hover:bg-accent/90 text-primary font-bold px-4 py-2 rounded-lg text-center transition-colors"
              >
                Schedule Consultation
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
