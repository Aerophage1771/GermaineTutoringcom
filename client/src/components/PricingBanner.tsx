import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    }
  }
}

export function PricingBanner() {
  const [, setLocation] = useLocation();

  const handleViewPlans = () => {
    setLocation('/programs');
  };

  return (
    <div className="bg-black text-white py-3 px-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        <div className="flex-1 mb-3 md:mb-0">
          <span className="font-semibold text-lg">⚠️ Price Increase Coming Saturday, July 19</span>
          <div className="text-sm mt-1">
            All tutoring plans will increase by $100–$300. 
            Sign up now to lock in current rates — 8- and 24-hour plans include full access to the upcoming LSAT strategy library.
          </div>
        </div>
        <div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleViewPlans}
            className="border-white text-white hover:bg-white hover:text-black"
          >
            View Plans
          </Button>
        </div>
      </div>
    </div>
  );
}