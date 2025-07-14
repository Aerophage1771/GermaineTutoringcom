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
          <span className="font-semibold text-lg">Legacy Pricing Through July 19</span>
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