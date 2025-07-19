import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, TrendingUp, TrendingDown, Clock, Target, BookOpen, 
  RotateCcw, Edit, Check, X, Flag, AlertTriangle, Calendar 
} from "lucide-react";
import { MainNavigation } from "@/components/MainNavigation";

interface MissedQuestion {
  id: number;
  question_id: string;
  prep_test_number: number;
  section: string;
  question_type: string;
  user_answer: string;
  correct_answer: string;
  time_taken: number;
  date_attempted: string;
  notes?: string;
  understood: boolean;
  error_type?: string;
}

export default function Progress() {
  const { user, isLoading } = useAuthRedirect();
  const [activeTab, setActiveTab] = useState("snapshot");
  const [selectedQuestion, setSelectedQuestion] = useState<MissedQuestion | null>(null);
  const [newNote, setNewNote] = useState("");

  // Show loading spinner while checking authentication
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Mock data - in production this would come from analytics APIs
  const performanceData = {
    overallAccuracy: 73,
    lrAccuracy: 75,
    rcAccuracy: 69,
    avgTimePerQuestion: 87,
    scaledScoreEstimate: { score: 162, range: "158-166" },
    recentTrend: "improving"
  };

  const weakestAreas = [
    { name: "Flaw", accuracy: 58, timeSpent: 95, questions: 42, priority: "high" },
    { name: "Strengthen", accuracy: 64, timeSpent: 89, questions: 38, priority: "medium" },
    { name: "Inference", accuracy: 67, timeSpent: 78, questions: 51, priority: "medium" }
  ];

  const { data: missedQuestions = [] } = useQuery<MissedQuestion[]>({
    queryKey: ['/api/progress/missed-questions'],
    queryFn: async () => {
      // Mock data for missed questions
      return [
        {
          id: 1,
          question_id: "PT101-S1-Q15",
          prep_test_number: 101,
          section: "LR",
          question_type: "Flaw",
          user_answer: "B",
          correct_answer: "D",
          time_taken: 120,
          date_attempted: "2025-01-15",
          understood: false,
          error_type: "rushed_read"
        },
        {
          id: 2,
          question_id: "PT102-S2-Q8",
          prep_test_number: 102,
          section: "RC",
          question_type: "Main Idea",
          user_answer: "A",
          correct_answer: "C",
          time_taken: 95,
          date_attempted: "2025-01-14",
          understood: false
        }
      ];
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-2">
            <BarChart3 className="h-8 w-8 text-green-500" />
            <h1 className="text-2xl font-bold text-gray-900">Progress</h1>
          </div>
          <p className="text-gray-600">Analytics, review, and reflection hub - what's working? What's not?</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="snapshot">Performance Snapshot</TabsTrigger>
            <TabsTrigger value="weakest">Weakest Areas</TabsTrigger>
            <TabsTrigger value="missed">Missed Question Journal</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          {/* Performance Snapshot */}
          <TabsContent value="snapshot" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Target className="h-5 w-5 mr-2 text-blue-500" />
                    Overall Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{performanceData.overallAccuracy}%</div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">Improving</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>LR: {performanceData.lrAccuracy}%</span>
                      <span>RC: {performanceData.rcAccuracy}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-purple-500" />
                    Pacing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{performanceData.avgTimePerQuestion}s</div>
                  <div className="text-sm text-gray-600 mt-1">Average per question</div>
                  <div className="mt-4">
                    <div className="text-sm text-gray-600">Slowest: Flaw (95s)</div>
                    <div className="text-sm text-gray-600">Fastest: Main Point (68s)</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
                    Score Estimate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{performanceData.scaledScoreEstimate.score}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Range: {performanceData.scaledScoreEstimate.range}
                  </div>
                  <div className="mt-4">
                    <div className="text-sm text-gray-600">Based on latest practice tests</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Weakest Areas */}
          <TabsContent value="weakest" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top 3 Underperforming Areas</CardTitle>
                <CardDescription>Focus your practice on these question types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weakestAreas.map((area, index) => (
                    <div key={area.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                          area.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold">{area.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{area.accuracy}% accuracy</span>
                            <span>{area.timeSpent}s avg</span>
                            <span>{area.questions} questions</span>
                          </div>
                        </div>
                      </div>
                      <Button>
                        Practice Again
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Missed Question Journal */}
          <TabsContent value="missed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Missed Question Journal</CardTitle>
                <CardDescription>
                  A dedicated home for every question you got wrong
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Your Answer</TableHead>
                      <TableHead>Correct</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {missedQuestions.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell className="font-mono text-sm">
                          {question.question_id}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{question.question_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">{question.user_answer}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">{question.correct_answer}</Badge>
                        </TableCell>
                        <TableCell>{question.time_taken}s</TableCell>
                        <TableCell>{question.date_attempted}</TableCell>
                        <TableCell>
                          {question.understood ? (
                            <Badge className="bg-green-100 text-green-800">
                              <Check className="h-3 w-3 mr-1" />
                              Understood
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Review Needed
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <RotateCcw className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Flag className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Log */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Track your practice sessions, tests, and review activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: 'drill', name: 'Smart Practice - Flaw Questions', date: '2025-01-15', score: '7/10' },
                    { type: 'test', name: 'PrepTest 101 - Full Test', date: '2025-01-14', score: '158' },
                    { type: 'review', name: 'Missed Question Review', date: '2025-01-13', score: '5 reviewed' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === 'drill' ? 'bg-blue-100 text-blue-600' :
                          activity.type === 'test' ? 'bg-green-100 text-green-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {activity.type === 'drill' ? <Target className="h-5 w-5" /> :
                           activity.type === 'test' ? <BarChart3 className="h-5 w-5" /> :
                           <BookOpen className="h-5 w-5" />}
                        </div>
                        <div>
                          <h3 className="font-semibold">{activity.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>{activity.date}</span>
                            <span>•</span>
                            <span>{activity.score}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}