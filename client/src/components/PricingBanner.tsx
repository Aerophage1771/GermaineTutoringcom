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

  const handleScheduleNow = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ 
        url: 'https://calendly.com/germaine-washington-tutoring/2-hour-lsat-tutoring' 
      });
    }
  };

  const handleViewPlans = () => {
    setLocation('/programs');
  };

  return (
    <div className="bg-red-600 text-white py-3 px-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        <div className="flex-1 mb-3 md:mb-0">
          <span className="font-semibold text-lg">🔔 Tutoring Prices Go Up July 19th</span>
          <div className="text-sm mt-1">
            On Saturday, all tutoring plans will increase in price. 
            Book before then to lock in current rates — and if you choose an 8-hour or 24-hour plan, you'll also get access to the new LSAT content library included.
          </div>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={handleScheduleNow}
            className="bg-white text-red-600 hover:bg-gray-100"
          >
            Schedule Now
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleViewPlans}
            className="border-white text-white hover:bg-white hover:text-red-600"
          >
            View Plans
          </Button>
        </div>
      </div>
    </div>
  );
}