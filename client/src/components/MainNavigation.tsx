import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Zap, BookOpen, TestTube, BarChart3, ArrowLeft, Menu, X } from "lucide-react";

interface MainNavigationProps {
  showBackButton?: boolean;
  backPath?: string;
}

export function MainNavigation({ showBackButton = false, backPath = "/dashboard" }: MainNavigationProps) {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const navItems = [
    {
      id: 'train-me',
      label: 'Train Me',
      icon: Zap,
      path: '/train-me',
      description: 'Smart practice mode'
    },
    {
      id: 'explore-tests',
      label: 'Explore Tests',
      icon: BookOpen,
      path: '/explore-tests',
      description: 'Browse sets & simulate tests'
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
    if (path === '/explore-tests') {
      return location.startsWith('/explore-tests') || location.startsWith('/simulate-test');
    }
    return location.startsWith(path);
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {/* Sidebar Toggle */}
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Menu className="h-4 w-4" />
                    <span>Practice Menu</span>
                  </Button>
                </SheetTrigger>
                
                <SheetContent side="left" className="w-96 p-0 shadow-2xl">
                  <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">Practice Menu</h2>
                          <p className="text-sm text-gray-600 mt-1">Choose your practice mode</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSidebarOpen(false)}
                          className="hover:bg-white/50"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Navigation Items */}
                    <div className="flex-1 p-6">
                      <nav className="space-y-3">
                        {navItems.map((item) => {
                          const Icon = item.icon;
                          const active = isActive(item.path);
                          
                          return (
                            <Button
                              key={item.id}
                              variant="ghost"
                              className={`w-full justify-start h-auto p-5 transition-all rounded-xl ${
                                active
                                  ? 'bg-blue-100 text-blue-800 border-2 border-blue-300 shadow-sm'
                                  : 'hover:bg-gray-50 hover:text-gray-900 border-2 border-transparent hover:border-gray-200'
                              }`}
                              onClick={() => {
                                setLocation(item.path);
                              }}
                            >
                              <div className="flex items-start space-x-4 w-full">
                                <div className={`p-2 rounded-lg ${active ? 'bg-blue-200' : 'bg-gray-100'}`}>
                                  <Icon className={`h-6 w-6 ${active ? 'text-blue-700' : 'text-gray-600'}`} />
                                </div>
                                <div className="flex-1 text-left">
                                  <div className="font-semibold text-base">{item.label}</div>
                                  <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                                </div>
                              </div>
                            </Button>
                          );
                        })}
                      </nav>
                    </div>
                    
                    {/* Sidebar Footer */}
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                      <div className="text-sm text-gray-600">
                        <div className="font-medium mb-2">Practice Modes</div>
                        <div className="text-xs">
                          Navigate between different practice modes using the menu above. Each mode offers unique features to enhance your LSAT preparation.
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              
              {showBackButton && (
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                  onClick={() => setLocation(backPath)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Dashboard</span>
                </Button>
              )}
            </div>
            
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
}