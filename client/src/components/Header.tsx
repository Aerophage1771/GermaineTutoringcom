import { useState } from "react";
import { Link } from "wouter";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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
          <button 
            onClick={() => scrollToSection('methodology')} 
            className="text-foreground hover:text-primary font-medium text-sm lg:text-base transition-colors"
          >
            My Methodology
          </button>
          <button 
            onClick={() => scrollToSection('programs')} 
            className="text-foreground hover:text-primary font-medium text-sm lg:text-base transition-colors"
          >
            Tutoring Programs
          </button>
          <button 
            onClick={() => scrollToSection('results')} 
            className="text-foreground hover:text-primary font-medium text-sm lg:text-base transition-colors"
          >
            Student Results
          </button>
          <button 
            onClick={() => scrollToSection('guides')} 
            className="text-foreground hover:text-primary font-medium text-sm lg:text-base transition-colors"
          >
            Free LSAT Guides
          </button>
          <button 
            onClick={() => scrollToSection('consultation')} 
            className="bg-accent hover:bg-accent/90 text-white px-5 py-2 rounded font-semibold text-sm lg:text-base transition-colors"
          >
            Book Consultation
          </button>
        </nav>
      </div>
      
      {/* Mobile Navigation */}
      <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} bg-white w-full px-4 py-4 shadow-lg md:hidden`}>
        <div className="flex flex-col space-y-4">
          <button 
            onClick={() => scrollToSection('methodology')} 
            className="text-foreground hover:text-primary font-medium transition-colors text-left"
          >
            My Methodology
          </button>
          <button 
            onClick={() => scrollToSection('programs')} 
            className="text-foreground hover:text-primary font-medium transition-colors text-left"
          >
            Tutoring Programs
          </button>
          <button 
            onClick={() => scrollToSection('results')} 
            className="text-foreground hover:text-primary font-medium transition-colors text-left"
          >
            Student Results
          </button>
          <button 
            onClick={() => scrollToSection('guides')} 
            className="text-foreground hover:text-primary font-medium transition-colors text-left"
          >
            Free LSAT Guides
          </button>
          <button 
            onClick={() => scrollToSection('consultation')} 
            className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded font-semibold text-center transition-colors"
          >
            Book Consultation
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
