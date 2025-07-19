import { useState, useEffect } from "react";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Circle, User } from "lucide-react";

interface PrepTest {
  id: number;
  test_number: number;
  title: string;
  progress: number; // 0-4 sections completed
  status: 'not_started' | 'in_progress' | 'completed';
}

export default function PracticeTests() {
  const { user, isLoading } = useAuthRedirect();
  
  // Generate PT 101-158 data matching the LawHub interface
  const prepTests: PrepTest[] = Array.from({ length: 58 }, (_, i) => {
    const testNumber = i + 101;
    const progress = Math.floor(Math.random() * 5); // 0-4 sections
    return {
      id: testNumber,
      test_number: testNumber,
      title: `The Official LSAT PrepTest ${testNumber}`,
      progress: progress,
      status: progress === 0 ? 'not_started' : progress === 4 ? 'completed' : 'in_progress'
    };
  });

  const startTest = (testNumber: number) => {
    window.location.href = `/test/${testNumber}`;
  };

  const resumeTest = (testNumber: number) => {
    window.location.href = `/test/${testNumber}`;
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => window.history.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Full Tests
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>Welcome, {user.username}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Test List */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-3">
          {prepTests.map((test) => (
            <Card key={test.id} className="border border-gray-200 hover:border-gray-300 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Test Icon */}
                    <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center">
                      <Circle className="h-3 w-3 fill-current text-gray-400" />
                    </div>
                    
                    {/* Test Title */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {test.title}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {/* Progress Dots */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 4 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < test.progress ? 'bg-gray-400' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-500 ml-2">
                        {test.progress}/4
                      </span>
                    </div>
                    
                    {/* Resume/Start Button */}
                    <Button
                      onClick={() => test.status === 'not_started' ? startTest(test.test_number) : resumeTest(test.test_number)}
                      className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-md font-medium"
                    >
                      {test.status === 'not_started' ? 'START' : 'RESUME'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}