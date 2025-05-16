const AboutSection = () => {
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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Professional headshot of male LSAT tutor */}
          <div className="md:w-5/12">
            <img 
              src="https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=700&q=80" 
              alt="Germaine Washington, LSAT Tutor" 
              className="rounded-xl shadow-lg w-full h-auto object-cover" 
            />
          </div>
          
          <div className="md:w-7/12">
            <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-6">Meet Germaine Washington</h2>
            
            <p className="text-foreground leading-relaxed mb-6">
              With a perfect 180 LSAT score and a degree in Philosophy of Logic from Princeton University, 
              I've developed a systematic, rule-based approach to the LSAT that transforms how students engage with the test.
            </p>
            
            <p className="text-foreground leading-relaxed mb-6">
              Over the past 5+ years, I've guided more than 500 students to significant score improvements, 
              with those on my Premium Mastery Program seeing an average increase of 12+ points. 
              My approach isn't about memorization or tricks—it's about developing the fundamental logical reasoning skills that the LSAT rewards.
            </p>
            
            <p className="text-foreground leading-relaxed mb-8">
              I'm passionate about breaking down complex logical concepts into accessible frameworks that allow you to see the LSAT with complete clarity. 
              My students don't just improve their scores—they develop problem-solving abilities that serve them throughout law school and beyond.
            </p>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={scrollToConsultation}
                className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md transition-colors font-semibold"
              >
                <i className="fas fa-calendar-check mr-2"></i> Book a Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
