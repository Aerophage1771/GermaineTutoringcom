import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Zap, BookOpen, TestTube, BarChart3 } from "lucide-react";

export function MainNavigation() {
  const [location, setLocation] = useLocation();
  
  const navItems = [
    {
      id: 'train-me',
      label: 'Train Me',
      icon: Zap,
      path: '/train-me',
      description: 'Smart practice mode'
    },
    {
      id: 'explore-sets',
      label: 'Explore Sets',
      icon: BookOpen,
      path: '/explore-sets',
      description: 'Manual search & builder'
    },
    {
      id: 'simulate-test',
      label: 'Simulate Test',
      icon: TestTube,
      path: '/practice-test',
      description: 'Realistic test mode'
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: BarChart3,
      path: '/progress',
      description: 'Analytics & review'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/practice-test') {
      return location.startsWith('/practice-test') || location.startsWith('/practice-rc');
    }
    return location.startsWith(path);
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`h-16 px-6 rounded-none border-b-2 transition-all ${
                  active
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-transparent hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setLocation(item.path)}
              >
                <div className="flex flex-col items-center space-y-1">
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs opacity-70">{item.description}</span>
                </div>
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}