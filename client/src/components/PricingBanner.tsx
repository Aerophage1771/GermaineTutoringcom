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
          <div className="font-semibold text-lg mb-1">Legacy Pricing Ends Saturday, July 19</div>
          <div className="text-sm opacity-90">
            Tutoring rates are increasing by $100–$300 as new course content rolls out. 
            Enroll now to lock in legacy pricing — 8 and 24-hour plans include full access to the LSAT strategy library.
          </div>
        </div>
        <div>
          <Button 
            size="sm"
            onClick={handleViewPlans}
            className="bg-white text-black border border-white hover:bg-gray-100"
          >
            View Plans
          </Button>
        </div>
      </div>
    </div>
  );
}