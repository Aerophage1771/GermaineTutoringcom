import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Clock, Plus, Play, BookOpen, Target, TrendingUp } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Types
interface Session {
  id: number;
  date: string;
  summary: string;
  duration: string;
  video_link?: string;
}

interface ProblemLogEntry {
  id: number;
  prep_test: string;
  section: string;
  question: string;
  correct_reasoning?: string;
  student_flaw?: string;
  rule_for_future?: string;
}

interface PracticeActivity {
  id: number;
  activity_type: string;
  test_name?: string;
  section_type?: string;
  questions_attempted: number;
  questions_correct: number;
  time_spent: number;
  score_percentage?: string;
  completed_at: string;
}

// Time remaining color logic
const getTimeRemainingColor = (hours: number): string => {
  if (hours === 0) return "text-gray-400";
  if (hours >= 8) return "text-green-600";
  if (hours >= 2) {
    const ratio = (hours - 2) / 6; // Scale from 2-8 hours
    const red = Math.round(255 * (1 - ratio));
    const green = Math.round(255 * ratio);
    return `text-[rgb(${red},${green},0)]`;
  }
  return "text-red-600";
};

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, setLocation]);

  // Fetch dashboard data
  const { data: sessions = [] } = useQuery({
    queryKey: ['/api/dashboard/sessions'],
    enabled: isAuthenticated,
  });

  const { data: problemLog = [] } = useQuery({
    queryKey: ['/api/dashboard/problem-log'],
    enabled: isAuthenticated,
  });

  const { data: practiceActivities = [] } = useQuery({
    queryKey: ['/api/dashboard/practice-activities'],
    enabled: isAuthenticated,
  });

  // Problem log mutations for auto-save
  const updateProblemLogMutation = useMutation({
    mutationFn: async ({ id, field, value }: { id: number; field: string; value: string }) => {
      const response = await apiRequest("PUT", `/api/dashboard/problem-log/${id}`, { [field]: value });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/problem-log'] });
    },
    onError: (error) => {
      toast({
        title: "Save Failed",
        description: "Could not save changes. Please try again.",
        variant: "destructive",
      });
    }
  });

  const createProblemLogMutation = useMutation({
    mutationFn: async (entry: Omit<ProblemLogEntry, 'id'>) => {
      const response = await apiRequest("POST", "/api/dashboard/problem-log", entry);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/problem-log'] });
      toast({
        title: "Entry Added",
        description: "Problem log entry created successfully.",
      });
    }
  });

  // Auto-save handler for problem log
  const handleProblemLogChange = (id: number, field: string, value: string) => {
    updateProblemLogMutation.mutate({ id, field, value });
  };

  // Add new problem log entry
  const addProblemLogEntry = () => {
    createProblemLogMutation.mutate({
      prep_test: "",
      section: "",
      question: "",
      correct_reasoning: "",
      student_flaw: "",
      rule_for_future: ""
    });
  };

  // Schedule session handler
  const handleScheduleSession = (duration: string) => {
    // Placeholder for Calendly integration
    window.open(`https://calendly.com/placeholder-${duration}hour`, '_blank');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  // Handle undefined time_remaining with default of 8 hours
  const timeRemaining = user.time_remaining ?? 8;
  const bonusTestTime = user.bonus_test_review_time ?? 0;
  
  const timeRemainingColor = getTimeRemainingColor(timeRemaining);
  const canSchedule = timeRemaining > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.username}!</p>
        </div>

        {/* Time Counters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Account Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{user.sessions_held}</div>
                <div className="text-sm text-muted-foreground">Sessions Held</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${timeRemainingColor}`}>
                  {timeRemaining.toFixed(1)}h
                </div>
                <div className="text-sm text-muted-foreground">Time Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {bonusTestTime.toFixed(1)}h
                </div>
                <div className="text-sm text-muted-foreground">Bonus Test-Review Time</div>
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={() => handleScheduleSession('1')}
                  disabled={!canSchedule}
                  size="sm"
                  className="w-full"
                >
                  1 Hour Session
                </Button>
                <Button 
                  onClick={() => handleScheduleSession('1.5')}
                  disabled={!canSchedule}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  1.5 Hour Session
                </Button>
                <Button 
                  onClick={() => handleScheduleSession('2')}
                  disabled={!canSchedule}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  2 Hour Session
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session History */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Session History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No sessions yet. Schedule your first session above!</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Summary</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Video</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session: Session, index) => (
                    <TableRow key={session.id} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                      <TableCell>{new Date(session.date).toLocaleDateString()}</TableCell>
                      <TableCell>{session.summary}</TableCell>
                      <TableCell>{session.duration}h</TableCell>
                      <TableCell>
                        {session.video_link ? (
                          <Button 
                            variant="link" 
                            size="sm"
                            onClick={() => window.open(session.video_link, '_blank')}
                            className="p-0 h-auto"
                          >
                            Watch
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">Available soon</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="problem-log" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="problem-log" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Problem Log
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Practice & Test-Taking
            </TabsTrigger>
          </TabsList>

          {/* Problem Log Tab */}
          <TabsContent value="problem-log">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Problem Log</CardTitle>
                    <CardDescription>
                      Track problems and your reasoning. Changes save automatically.
                    </CardDescription>
                  </div>
                  <Button onClick={addProblemLogEntry} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Entry
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {problemLog.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No problem log entries yet. Click "Add Entry" to get started!
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">PrepTest</TableHead>
                          <TableHead className="w-[100px]">Section</TableHead>
                          <TableHead className="w-[100px]">Question</TableHead>
                          <TableHead className="min-w-[200px]">Correct Reasoning</TableHead>
                          <TableHead className="min-w-[200px]">Student Flaw</TableHead>
                          <TableHead className="min-w-[200px]">Rule for Future</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {problemLog.map((entry: ProblemLogEntry, index) => (
                          <TableRow key={entry.id} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                            <TableCell>
                              <Input
                                defaultValue={entry.prep_test}
                                onBlur={(e) => handleProblemLogChange(entry.id, 'prep_test', e.target.value)}
                                className="border-none bg-transparent p-1 h-8"
                                placeholder="PT #"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                defaultValue={entry.section}
                                onBlur={(e) => handleProblemLogChange(entry.id, 'section', e.target.value)}
                                className="border-none bg-transparent p-1 h-8"
                                placeholder="LR, RC, LG"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                defaultValue={entry.question}
                                onBlur={(e) => handleProblemLogChange(entry.id, 'question', e.target.value)}
                                className="border-none bg-transparent p-1 h-8"
                                placeholder="Q #"
                              />
                            </TableCell>
                            <TableCell>
                              <Textarea
                                defaultValue={entry.correct_reasoning || ""}
                                onBlur={(e) => handleProblemLogChange(entry.id, 'correct_reasoning', e.target.value)}
                                className="border-none bg-transparent p-1 min-h-[60px] resize-none"
                                placeholder="Explain the correct approach..."
                              />
                            </TableCell>
                            <TableCell>
                              <Textarea
                                defaultValue={entry.student_flaw || ""}
                                onBlur={(e) => handleProblemLogChange(entry.id, 'student_flaw', e.target.value)}
                                className="border-none bg-transparent p-1 min-h-[60px] resize-none"
                                placeholder="What went wrong..."
                              />
                            </TableCell>
                            <TableCell>
                              <Textarea
                                defaultValue={entry.rule_for_future || ""}
                                onBlur={(e) => handleProblemLogChange(entry.id, 'rule_for_future', e.target.value)}
                                className="border-none bg-transparent p-1 min-h-[60px] resize-none"
                                placeholder="Remember for next time..."
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Practice & Test-Taking Tab */}
          <TabsContent value="practice">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Full-Length Tests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Full-Length Tests
                  </CardTitle>
                  <CardDescription>
                    Complete practice tests with LawHub interface
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" size="lg">
                    Start New Practice Test
                  </Button>
                  <div className="space-y-2">
                    <h4 className="font-medium">Recent Test Results</h4>
                    {practiceActivities
                      .filter((activity: PracticeActivity) => activity.activity_type === 'full_test')
                      .slice(0, 3)
                      .map((activity: PracticeActivity) => (
                        <div key={activity.id} className="flex justify-between items-center p-2 bg-muted rounded">
                          <span className="text-sm">{activity.test_name}</span>
                          <Badge variant="outline">
                            {activity.questions_correct}/{activity.questions_attempted}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Question Practice */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Question Practice
                  </CardTitle>
                  <CardDescription>
                    Targeted practice by section and difficulty
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="w-full">
                      LR Practice
                    </Button>
                    <Button variant="outline" className="w-full">
                      RC Practice
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Filter Options</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Difficulty Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">★ Beginner</SelectItem>
                        <SelectItem value="2">★★ Easy</SelectItem>
                        <SelectItem value="3">★★★ Medium</SelectItem>
                        <SelectItem value="4">★★★★ Hard</SelectItem>
                        <SelectItem value="5">★★★★★ Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="PrepTest Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">PT 80-90 (Recent)</SelectItem>
                        <SelectItem value="modern">PT 60-79 (Modern)</SelectItem>
                        <SelectItem value="older">PT 1-59 (Older)</SelectItem>
                        <SelectItem value="all">All PrepTests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button className="w-full">
                    Start Filtered Practice
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Practice History */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Practice History</CardTitle>
              </CardHeader>
              <CardContent>
                {practiceActivities.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No practice activities yet. Start practicing above!
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {practiceActivities.slice(0, 10).map((activity: PracticeActivity, index) => (
                        <TableRow key={activity.id} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                          <TableCell>
                            {new Date(activity.completed_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="capitalize">
                            {activity.activity_type.replace('_', ' ')}
                          </TableCell>
                          <TableCell>{activity.section_type || 'Mixed'}</TableCell>
                          <TableCell>
                            {activity.questions_correct}/{activity.questions_attempted}
                            {activity.score_percentage && (
                              <span className="text-muted-foreground ml-2">
                                ({parseFloat(activity.score_percentage).toFixed(1)}%)
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{activity.time_spent} min</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;