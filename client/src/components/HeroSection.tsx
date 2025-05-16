const HeroSection = () => {
  const scrollToConsultation = () => {
    const element = document.getElementById('consultation');
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="hero-gradient text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
            Achieve Your Target LSAT Score with Proven, Rule-Based Guidance from a Princeton Logic Expert
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-3xl mx-auto">
            Expert tutoring from a 180 LSAT scorer with a Princeton Philosophy of Logic degree. 
            Students on our Premium Mastery Program average a 12+ point increase. 
            Learn the systematic approach to conquer the LSAT.
          </p>
          <button 
            onClick={scrollToConsultation}
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
            <span className="text-accent text-4xl font-heading font-bold block mb-2">Princeton</span>
            <span className="text-white/90 font-medium">Philosophy of Logic</span>
          </div>
          
          {/* Stat Card 3 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20 transform transition-transform hover:translate-y-[-5px]">
            <span className="text-accent text-4xl font-heading font-bold block mb-2">500+</span>
            <span className="text-white/90 font-medium">Students Helped</span>
          </div>
          
          {/* Stat Card 4 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20 transform transition-transform hover:translate-y-[-5px]">
            <span className="text-accent text-4xl font-heading font-bold block mb-2">12+</span>
            <span className="text-white/90 font-medium">Avg. Point Increase</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
