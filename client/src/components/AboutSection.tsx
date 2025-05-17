// Define Calendly types to avoid TypeScript errors
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    }
  }
}

const AboutSection = () => {
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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Professional headshot of male LSAT tutor */}
          <div className="md:w-5/12">
            <img 
              src="/germaine_photo.jpg" 
              alt="Germaine Washington, LSAT Tutor" 
              className="rounded-xl shadow-lg w-full h-auto object-cover" 
            />
          </div>
          
          <div className="md:w-7/12">
            <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-6">Hi, I'm Germaine Washington.</h2>
            
            <p className="text-foreground leading-relaxed mb-6">
              When I was studying for the LSAT, I fell into the trap that so many students do: trying to juggle dozens of disconnected strategies. My breakthrough came when I shifted focus, moving away from memorization and toward understanding how arguments actually work. That mindset shift led to my perfect 180 score in 2020.
            </p>
            
            <p className="text-foreground leading-relaxed mb-6">
              Since then, I've helped over 500 students by building a system that breaks the LSAT into fundamental reasoning tasks. My method teaches students to identify what each question truly tests, apply structured frameworks, and build those skills until they become second nature. My long-term students improve by an average of over 14 points, and that kind of score transformation is what I aim to deliver to every LSAT taker I work with.
            </p>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={openCalendly}
                className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md transition-colors font-semibold"
              >
                <i className="fas fa-calendar-check mr-2"></i> Schedule Time With Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;