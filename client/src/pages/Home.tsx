import Header from "@/components/Header";
import { PricingBanner } from "@/components/PricingBanner";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import MethodologySection from "@/components/MethodologySection";
import ProgramsSection from "@/components/ProgramsSection";
import ResultsSection from "@/components/ResultsSection";
import CTASection from "@/components/CTASection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="bg-background">
      <PricingBanner />
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <MethodologySection />
        <ProgramsSection />
        <ResultsSection />
        <CTASection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
