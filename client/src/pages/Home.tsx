import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import MethodologySection from "@/components/MethodologySection";
import ProgramsSection from "@/components/ProgramsSection";
import ResultsSection from "@/components/ResultsSection";
import GuidesSection from "@/components/GuidesSection";
import CTASection from "@/components/CTASection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="bg-background">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <MethodologySection />
        <ProgramsSection />
        <ResultsSection />
        <GuidesSection />
        <CTASection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
