import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Zap, Brain, Target, RotateCcw, Settings, ChevronDown, Play, TrendingUp } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { MainNavigation } from "@/components/MainNavigation";

export default function TrainMe() {
  const { user, isLoading } = useAuthRedirect();
  const [location, setLocation] = useLocation();
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [difficulty, setDifficulty] = useState("mixed");
  const [questionCount, setQuestionCount] = useState(5);
  const [includeFlagged, setIncludeFlagged] = useState(false);

  // Show loading spinner while checking authentication
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Mock data for suggested topics - in production this would come from analytics
  const suggestedTopics = [
    { name: "Flaw", accuracy: 67, questions: 45, priority: "high" },
    { name: "Main Point", accuracy: 72, questions: 38, priority: "medium" },
    { name: "Strengthen", accuracy: 58, questions: 52, priority: "high" }
  ];

  const createSmartDrill = useMutation({
    mutationFn: async (params: any) => {
      return apiRequest('/api/practice/smart-drill', {
        method: 'POST',
        body: JSON.stringify(params)
      });
    },
    onSuccess: (data) => {
      setLocation(`/question-practice?set=${data.id}`);
    }
  });

  const handleSmartPractice = () => {
    createSmartDrill.mutate({
      type: 'smart',
      difficulty,
      questionCount,
      includeFlagged
    });
  };

  const handleTopicDrill = (topic: string) => {
    createSmartDrill.mutate({
      type: 'topic',
      topic,
      questionCount: 5,
      difficulty: 'mixed'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 mb-2">
            <Zap className="h-8 w-8 text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900">Train Me</h1>
          </div>
          <p className="text-gray-600">Smart practice mode - just help me improve, no decisions needed</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Smart Practice */}
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Brain className="h-6 w-6 text-orange-600" />
              <div>
                <CardTitle className="text-xl">Start Smart Practice</CardTitle>
                <CardDescription>
                  Auto-generated drill targeting your missed topics, timing issues, and weak recent performance
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              size="lg" 
              className="w-full h-14 text-lg bg-orange-600 hover:bg-orange-700"
              onClick={handleSmartPractice}
              disabled={createSmartDrill.isPending}
            >
              <Play className="h-5 w-5 mr-2" />
              {createSmartDrill.isPending ? 'Creating Drill...' : 'Start Smart Practice'}
            </Button>
            
            {/* Advanced Options */}
            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <CollapsibleTrigger className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
                <Settings className="h-4 w-4" />
                <span>Advanced Options</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4 p-4 bg-white rounded-lg border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="count">Question Count</Label>
                    <Select value={questionCount.toString()} onValueChange={(v) => setQuestionCount(parseInt(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 Questions</SelectItem>
                        <SelectItem value="10">10 Questions</SelectItem>
                        <SelectItem value="15">15 Questions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="flagged"
                      checked={includeFlagged}
                      onCheckedChange={setIncludeFlagged}
                    />
                    <Label htmlFor="flagged">Include flagged questions</Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {/* Quick Focus Drills */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Target className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle>Quick Focus Drills</CardTitle>
                <CardDescription>
                  Top 3 suggested topics based on your recent performance
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {suggestedTopics.map((topic, index) => (
                <Card key={topic.name} className={`border-2 ${
                  topic.priority === 'high' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{topic.name}</h3>
                      <Badge variant={topic.priority === 'high' ? 'destructive' : 'secondary'}>
                        {topic.accuracy}%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {topic.questions} questions attempted
                    </p>
                    <Button 
                      size="sm" 
                      className="w-full"
                      variant={topic.priority === 'high' ? 'default' : 'outline'}
                      onClick={() => handleTopicDrill(topic.name)}
                      disabled={createSmartDrill.isPending}
                    >
                      Start 5 Questions
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reinforce Missed Questions */}
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <RotateCcw className="h-6 w-6 text-purple-600" />
              <div>
                <CardTitle>Reinforce Missed Questions</CardTitle>
                <CardDescription>
                  Spaced repetition to revisit questions you've missed previously
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200">
              <div>
                <h3 className="font-semibold text-gray-900">Ready for Review</h3>
                <p className="text-sm text-gray-600">12 questions waiting for spaced repetition</p>
              </div>
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  createSmartDrill.mutate({
                    type: 'spaced-repetition',
                    questionCount: 12
                  });
                }}
                disabled={createSmartDrill.isPending}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Let's Make It Stick
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}