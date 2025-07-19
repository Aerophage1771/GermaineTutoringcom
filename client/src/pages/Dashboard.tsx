import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
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
import { Clock, Plus, Play, BookOpen, Target, Calendar, Archive, BarChart3, Trash2, Brain, FileText, MessageCircle } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";

// Types
interface Session {
  id: number;
  user_id: number;
  date: string;
  duration: number;
  topic: string;
  notes?: string;
}

interface ProblemLog {
  id: number;
  user_id: number;
  prep_test: number;
  section_number: number;
  question_number: number;
  question_type: string;
  difficulty: number;
  correct: boolean;
  time_spent: number;
  notes?: string;
  created_at: string;
}

export default function Dashboard() {
  const { user, isLoading } = useAuthRedirect();
  const { logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Dialog states - moved before early return to fix hooks order
  const [isBookSessionOpen, setIsBookSessionOpen] = useState(false);
  const [isAddProblemOpen, setIsAddProblemOpen] = useState(false);

  // Problem log form state
  const [problemForm, setProblemForm] = useState({
    prep_test: "",
    section_number: "",
    question_number: "",
    question_type: "",
    difficulty: "",
    correct: "false",
    time_spent: "",
    notes: ""
  });

  // Data queries - must be called before any early returns
  const { data: sessions = [] } = useQuery<Session[]>({
    queryKey: ["/api/dashboard/sessions"],
    enabled: !!user
  });

  const { data: problemLog = [] } = useQuery<ProblemLog[]>({
    queryKey: ["/api/dashboard/problem-log"],
    enabled: !!user
  });

  // Mutations - must be called before any early returns
  const addProblemMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/dashboard/problem-log", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/problem-log"] });
      setIsAddProblemOpen(false);
      setProblemForm({
        prep_test: "",
        section_number: "",
        question_number: "",
        question_type: "",
        difficulty: "",
        correct: "false",
        time_spent: "",
        notes: ""
      });
      toast({ title: "Problem added successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error adding problem", description: error.message, variant: "destructive" });
    }
  });

  const deleteProblemMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/dashboard/problem-log/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/problem-log"] });
      toast({ title: "Problem deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting problem", description: error.message, variant: "destructive" });
    }
  });

  // Show loading spinner while checking authentication - moved after all hooks
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Calculations
  const timeRemaining = user ? user.time_remaining / 60 : 0; // Convert minutes to hours
  const bonusTestTime = user ? user.bonus_test_review_time / 60 : 0;
  const sessionHistory = sessions.slice(0, 5);
  
  const getTimeRemainingColor = (time: number) => {
    if (time > 5) return "text-green-600";
    if (time > 2) return "text-yellow-600";
    return "text-red-600";
  };
  
  const timeRemainingColor = getTimeRemainingColor(timeRemaining);
  const canSchedule = timeRemaining > 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Calendly functions
  const openCalendlyWidget = (url: string) => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url });
    }
  };

  // Declare Calendly interface
  declare global {
    interface Window {
      Calendly?: {
        initPopupWidget: (options: { url: string }) => void;
      };
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-normal text-gray-800 mb-2">Student Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.username.charAt(0).toUpperCase() + user.username.slice(1)}!</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <Button variant="outline" size="sm" onClick={() => logout()}>
              Logout
            </Button>
          </div>
        </div>

        {/* Layout: Smaller left column + centered right content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Compact */}
          <div className="lg:col-span-1 space-y-4">
            {/* Tabbed Account Info */}
            <Card className="shadow-lg bg-white border-0">
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="summary">Account</TabsTrigger>
                  <TabsTrigger value="sessions">Sessions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary" className="p-4">
                  <div className="space-y-3">
                    <h3 className="font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      Summary
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-600">{user.sessions_held}</div>
                        <div className="text-xs text-gray-600">Sessions</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className={`text-xl font-bold ${timeRemainingColor}`}>
                          {timeRemaining.toFixed(1)}h
                        </div>
                        <div className="text-xs text-gray-600">Time Left</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-emerald-600">
                          {bonusTestTime.toFixed(1)}h
                        </div>
                        <div className="text-xs text-gray-600">Bonus</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="sessions" className="p-4 max-h-64 overflow-y-auto">
                  <div className="space-y-3">
                    <h3 className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      Recent Sessions
                    </h3>
                    {sessionHistory.length > 0 ? (
                      <div className="space-y-2">
                        {sessionHistory.slice(0, 3).map((session) => (
                          <div key={session.id} className="border-l-3 border-blue-400 pl-3 py-2 bg-gray-50 rounded-r-lg">
                            <div className="text-sm font-medium">
                              {session.topic || "Session"}
                            </div>
                            <div className="text-xs text-gray-600">
                              {formatDate(session.date)} • {session.duration}h
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-3">
                        No sessions yet
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Right Column - Centered Action Buttons */}
          <div className="lg:col-span-3 space-y-8 max-w-4xl mx-auto">
            {/* Sessions & Tracking Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Sessions & Tracking
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Book Session */}
                <Dialog open={isBookSessionOpen} onOpenChange={setIsBookSessionOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="lg" 
                      className="h-20 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 rounded-xl shadow-lg"
                      disabled={!canSchedule}
                    >
                      <Calendar className="h-6 w-6 mr-3" />
                      <div className="text-left">
                        <div>Book Session</div>
                        <div className="text-sm font-normal opacity-80">Schedule a new tutoring session</div>
                      </div>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Choose Session Length</DialogTitle>
                      <DialogDescription>
                        Select the duration for your tutoring session
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <Button 
                        className="h-16 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 rounded-xl shadow-lg"
                        onClick={() => {
                          openCalendlyWidget('https://calendly.com/germaine-washington-tutoring/1-hour-lsat-tutoring?hide_gdpr_banner=1');
                          setIsBookSessionOpen(false);
                        }}
                      >
                        <Clock className="h-5 w-5 mr-3" />
                        <div className="text-left">
                          <div>60 Minutes</div>
                          <div className="text-sm font-normal opacity-80">Standard session</div>
                        </div>
                      </Button>
                      
                      <Button 
                        className="h-16 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 transform hover:scale-105 rounded-xl shadow-lg"
                        onClick={() => {
                          openCalendlyWidget('https://calendly.com/germaine-washington-tutoring/90-min-lsat-tutoring');
                          setIsBookSessionOpen(false);
                        }}
                      >
                        <Clock className="h-5 w-5 mr-3" />
                        <div className="text-left">
                          <div>90 Minutes</div>
                          <div className="text-sm font-normal opacity-80">Extended session</div>
                        </div>
                      </Button>
                      
                      <Button 
                        className="h-16 text-lg font-semibold bg-purple-600 hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 rounded-xl shadow-lg"
                        onClick={() => {
                          openCalendlyWidget('https://calendly.com/germaine-washington-tutoring/2-hours-lsat-tutoring');
                          setIsBookSessionOpen(false);
                        }}
                      >
                        <Clock className="h-5 w-5 mr-3" />
                        <div className="text-left">
                          <div>120 Minutes</div>
                          <div className="text-sm font-normal opacity-80">Deep dive session</div>
                        </div>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Session Analytics */}
                <Button 
                  size="lg" 
                  variant="outline"
                  className="h-20 text-lg font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 rounded-xl"
                  onClick={() => setLocation("/analytics")}
                >
                  <BarChart3 className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div>View Analytics</div>
                    <div className="text-sm font-normal opacity-70">Track your progress</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Session Summaries Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Session Summaries
              </h2>
              <div className="space-y-4">
                {sessionHistory.length > 0 ? (
                  <div className="grid gap-4">
                    {sessionHistory.slice(0, 5).map((session) => (
                      <Card key={session.id} className="border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Clock className="h-4 w-4 text-blue-600" />
                                <h3 className="font-semibold text-gray-900">
                                  {session.topic || `Session ${session.id}`}
                                </h3>
                                <Badge variant="outline" className="text-xs">
                                  {session.duration}h
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600 mb-2">
                                {formatDate(session.date)}
                              </div>
                              {session.notes && (
                                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                  {session.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border-dashed border-2 border-gray-300">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">No Session Summaries Yet</h3>
                      <p className="text-sm text-gray-500 text-center max-w-md">
                        Your session summaries will appear here after you complete tutoring sessions. 
                        Each summary will include key topics covered and your progress.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Practice & Review Section - Simplified */}
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-emerald-500" />
                Practice & Review
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Practice - Combined */}
                <Button 
                  size="lg" 
                  className="h-20 text-lg font-semibold bg-green-600 hover:bg-green-700 transition-all duration-200 transform hover:scale-105 rounded-xl shadow-lg"
                  onClick={() => setLocation("/train-me")}
                >
                  <Play className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div>Practice</div>
                    <div className="text-sm font-normal opacity-80">Smart drills and question practice</div>
                  </div>
                </Button>

                {/* Learning Library */}
                <Button 
                  size="lg"
                  onClick={() => setLocation("/learning-library")}
                  className="h-20 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105 rounded-xl shadow-lg"
                >
                  <BookOpen className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div>Learning Library</div>
                    <div className="text-sm font-normal opacity-80">Study materials and concepts</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Resources & Tools Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                <Archive className="h-5 w-5 text-orange-500" />
                Resources & Tools
              </h2>
              <div className="grid grid-cols-1 gap-4">


                {/* Contact Tutor */}
                <Button 
                  size="lg" 
                  variant="outline"
                  className="h-20 text-lg font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 rounded-xl"
                  onClick={() => window.open('mailto:germaine@germainetutoring.com', '_blank')}
                >
                  <MessageCircle className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div>Contact Tutor</div>
                    <div className="text-sm font-normal opacity-70">Get help and support</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Problem Log Table */}
        {problemLog.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Recent Problem Log</h2>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {problemLog.slice(0, 10).map((problem) => (
                    <TableRow key={problem.id}>
                      <TableCell>PT {problem.prep_test}</TableCell>
                      <TableCell>S{problem.section_number}</TableCell>
                      <TableCell>Q{problem.question_number}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{problem.question_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={problem.difficulty >= 4 ? "destructive" : problem.difficulty >= 3 ? "default" : "secondary"}>
                          {problem.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={problem.correct ? "default" : "destructive"}>
                          {problem.correct ? "✓" : "✗"}
                        </Badge>
                      </TableCell>
                      <TableCell>{problem.time_spent}s</TableCell>
                      <TableCell className="max-w-xs truncate">{problem.notes}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteProblemMutation.mutate(problem.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}