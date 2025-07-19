import { useState } from "react";
import { useLocation } from "wouter";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MainNavigation } from "@/components/MainNavigation";
import { 
  TestTube, 
  Clock, 
  Target, 
  BookOpen, 
  Play, 
  Flag,
  CheckCircle
} from "lucide-react";

interface PrepTest {
  id: number;
  test_number: number;
  sections: number;
  total_questions: number;
  time_limit: number; // in minutes
  available: boolean;
}

export default function SimulateTests() {
  const { user, isLoading } = useAuthRedirect();
  const [, setLocation] = useLocation();

  // Generate PT 101-158 data
  const prepTests: PrepTest[] = Array.from({ length: 58 }, (_, i) => ({
    id: i + 101,
    test_number: i + 101,
    sections: 4,
    total_questions: 100 + Math.floor(Math.random() * 5), // 100-104 questions
    time_limit: 175, // 2 hours 55 minutes
    available: true
  }));

  const startSimulation = (testNumber: number) => {
    setLocation(`/simulate-test/${testNumber}`);
  };

  // Show loading spinner while checking authentication
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <MainNavigation showBackButton />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Simulate Tests, Realistic Test Mode</h1>
            <p className="text-gray-600 text-lg">
              Full-length LSAT practice tests with LawHub-style interface including timed sections, 
              question flagging, and comprehensive review features.
            </p>
          </div>

          <div className="space-y-6">
            {/* Practice Tests Grid */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Practice Tests (PT 101-158)
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Choose from 58 official LSAT practice tests with realistic testing conditions.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {prepTests.map((test) => (
                    <Card key={test.id} className="border-2 hover:border-blue-300 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-lg">PT {test.test_number}</h3>
                            <p className="text-sm text-gray-600">Practice Test {test.test_number}</p>
                          </div>
                          <Badge variant={test.available ? "default" : "secondary"}>
                            {test.available ? "Available" : "Coming Soon"}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Target className="h-4 w-4 text-gray-500" />
                            <span>{test.total_questions} questions</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>{Math.floor(test.time_limit / 60)}h {test.time_limit % 60}m</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <BookOpen className="h-4 w-4 text-gray-500" />
                            <span>{test.sections} sections</span>
                          </div>
                        </div>

                        <Button 
                          className="w-full"
                          onClick={() => startSimulation(test.test_number)}
                          disabled={!test.available}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Test
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Test Features */}
            <Card>
              <CardHeader>
                <CardTitle>LawHub-Style Test Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                    <Clock className="h-8 w-8 text-blue-600" />
                    <div>
                      <h4 className="font-semibold">Timed Interface</h4>
                      <p className="text-sm text-gray-600">Full section timing with alerts</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                    <Flag className="h-8 w-8 text-green-600" />
                    <div>
                      <h4 className="font-semibold">Question Flagging</h4>
                      <p className="text-sm text-gray-600">Mark questions for review</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                    <Target className="h-8 w-8 text-purple-600" />
                    <div>
                      <h4 className="font-semibold">Section Navigation</h4>
                      <p className="text-sm text-gray-600">Jump between questions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-orange-600" />
                    <div>
                      <h4 className="font-semibold">Review Mode</h4>
                      <p className="text-sm text-gray-600">Detailed answer explanations</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}