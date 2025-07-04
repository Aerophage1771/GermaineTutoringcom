import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Clock, Plus, Play, BookOpen, Target, TrendingUp, Calendar, Archive, BarChart3, Trash2, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  
  // State for modals and collapsible sections
  const [isBookSessionOpen, setIsBookSessionOpen] = useState(false);
  const [isProblemLogOpen, setIsProblemLogOpen] = useState(false);
  const [isSessionHistoryOpen, setIsSessionHistoryOpen] = useState(false);
  
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

  const deleteProblemLogMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/dashboard/problem-log/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/problem-log'] });
      toast({
        title: "Entry Deleted",
        description: "Problem log entry deleted successfully.",
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
      section: "1",
      question: "",
      correct_reasoning: "",
      student_flaw: "",
      rule_for_future: ""
    });
  };

  // Delete problem log entry
  const deleteProblemLogEntry = (id: number) => {
    deleteProblemLogMutation.mutate(id);
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

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Account Summary - Small Card */}
            <Card className="p-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Account Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-primary">{user.sessions_held}</div>
                    <div className="text-xs text-muted-foreground">Sessions</div>
                  </div>
                  <div>
                    <div className={`text-lg font-bold ${timeRemainingColor}`}>
                      {timeRemaining.toFixed(1)}h
                    </div>
                    <div className="text-xs text-muted-foreground">Time Left</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      {bonusTestTime.toFixed(1)}h
                    </div>
                    <div className="text-xs text-muted-foreground">Bonus</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session History - Collapsible */}
            <Card>
              <Collapsible 
                open={isSessionHistoryOpen} 
                onOpenChange={setIsSessionHistoryOpen}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 rounded-t-lg">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Session History
                      </div>
                      {isSessionHistoryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    {Array.isArray(sessions) && sessions.length > 0 ? (
                      <div className="space-y-2">
                        {sessions.map((session: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex-1">
                              <div className="font-medium text-sm">{session.date}</div>
                              <div className="text-xs text-muted-foreground truncate">{session.summary}</div>
                            </div>
                            {session.video_link && (
                              <Button size="sm" variant="outline" className="ml-2">
                                <Eye className="h-3 w-3" />
                                Watch
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No sessions yet</p>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>

          {/* Right Column - Large Action Buttons */}
          <div className="lg:col-span-2 space-y-4">
            {/* Book Session */}
            <Dialog open={isBookSessionOpen} onOpenChange={setIsBookSessionOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="w-full h-16 text-lg font-semibold"
                  disabled={!canSchedule}
                >
                  <Calendar className="h-6 w-6 mr-2" />
                  Book Session
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Book a Session</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Button 
                    onClick={() => {
                      handleScheduleSession('1');
                      setIsBookSessionOpen(false);
                    }}
                    className="w-full h-12"
                    disabled={!canSchedule}
                  >
                    1 Hour Session
                  </Button>
                  <Button 
                    onClick={() => {
                      handleScheduleSession('1.5');
                      setIsBookSessionOpen(false);
                    }}
                    className="w-full h-12"
                    variant="outline"
                    disabled={!canSchedule}
                  >
                    1.5 Hour Session
                  </Button>
                  <Button 
                    onClick={() => {
                      handleScheduleSession('2');
                      setIsBookSessionOpen(false);
                    }}
                    className="w-full h-12"
                    variant="outline"
                    disabled={!canSchedule}
                  >
                    2 Hour Session
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Problem Log */}
            <Dialog open={isProblemLogOpen} onOpenChange={setIsProblemLogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="w-full h-16 text-lg font-semibold"
                  variant="outline"
                >
                  <Target className="h-6 w-6 mr-2" />
                  Problem Log
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Problem Log</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Button onClick={addProblemLogEntry} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Entry
                  </Button>
                  {Array.isArray(problemLog) && problemLog.length > 0 ? (
                    <div className="space-y-4">
                      {problemLog.map((entry: any, index: number) => (
                        <Card key={index} className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div className="text-sm font-medium">Entry #{entry.id}</div>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => deleteProblemLogEntry(entry.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`prep-test-${entry.id}`} className="text-sm font-medium">
                                Prep Test
                              </Label>
                              <Input
                                id={`prep-test-${entry.id}`}
                                value={entry.prep_test}
                                onChange={(e) => handleProblemLogChange(entry.id, 'prep_test', e.target.value)}
                                placeholder="e.g., PT 101"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`section-${entry.id}`} className="text-sm font-medium">
                                Section (1-4)
                              </Label>
                              <Select 
                                value={entry.section} 
                                onValueChange={(value) => handleProblemLogChange(entry.id, 'section', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select section" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1</SelectItem>
                                  <SelectItem value="2">2</SelectItem>
                                  <SelectItem value="3">3</SelectItem>
                                  <SelectItem value="4">4</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Label htmlFor={`question-${entry.id}`} className="text-sm font-medium">
                              Question
                            </Label>
                            <Input
                              id={`question-${entry.id}`}
                              value={entry.question}
                              onChange={(e) => handleProblemLogChange(entry.id, 'question', e.target.value)}
                              placeholder="Question number or description"
                            />
                          </div>
                          <div className="mt-4 space-y-4">
                            <div>
                              <Label htmlFor={`reasoning-${entry.id}`} className="text-sm font-medium">
                                Correct Reasoning
                              </Label>
                              <Textarea
                                id={`reasoning-${entry.id}`}
                                value={entry.correct_reasoning}
                                onChange={(e) => handleProblemLogChange(entry.id, 'correct_reasoning', e.target.value)}
                                placeholder="Explain the correct approach..."
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`flaw-${entry.id}`} className="text-sm font-medium">
                                Student Flaw
                              </Label>
                              <Textarea
                                id={`flaw-${entry.id}`}
                                value={entry.student_flaw}
                                onChange={(e) => handleProblemLogChange(entry.id, 'student_flaw', e.target.value)}
                                placeholder="What went wrong in your reasoning..."
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`rule-${entry.id}`} className="text-sm font-medium">
                                Rule for Future
                              </Label>
                              <Textarea
                                id={`rule-${entry.id}`}
                                value={entry.rule_for_future}
                                onChange={(e) => handleProblemLogChange(entry.id, 'rule_for_future', e.target.value)}
                                placeholder="How to avoid this mistake..."
                                rows={3}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">No problem log entries yet</p>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Full-Length Test */}
            <Button 
              size="lg" 
              className="w-full h-16 text-lg font-semibold"
              variant="outline"
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Full-length test feature is under development",
                });
              }}
            >
              <Play className="h-6 w-6 mr-2" />
              Full-Length Test
            </Button>

            {/* Practice */}
            <Button 
              size="lg" 
              className="w-full h-16 text-lg font-semibold"
              variant="outline"
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Practice drill builder is under development",
                });
              }}
            >
              <BookOpen className="h-6 w-6 mr-2" />
              Practice
            </Button>

            {/* Learning Library */}
            <Button 
              size="lg" 
              className="w-full h-16 text-lg font-semibold"
              variant="outline"
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Learning Library is under development",
                });
              }}
            >
              <Archive className="h-6 w-6 mr-2" />
              Learning Library
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
