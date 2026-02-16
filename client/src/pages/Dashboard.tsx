import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, BookOpen, Calendar, Archive, MessageCircle, FileText } from "lucide-react";

// Calendly widget interface
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

// Types
interface Session {
  id: number;
  user_id: number;
  date: string;
  duration: number;
  topic: string;
  notes?: string;
}

const CALENDLY_2_HOUR_URL = "https://calendly.com/germaine-washington-tutoring/2-hours-lsat-tutoring";
const TUTOR_EMAIL = "germaine@germainetutoring.com";

export default function Dashboard() {
  const { user, isLoading } = useAuthRedirect();
  const { logout } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();

  // Data queries
  const { data: sessions = [] } = useQuery<Session[]>({
    queryKey: ["/api/dashboard/sessions"],
    enabled: !!user
  });

  // Show loading spinner while checking authentication
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

  const handleContactTutor = async () => {
    if (!user?.id) {
      toast({
        title: "Message failed",
        description: "You must be logged in to contact your tutor.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("messages").insert({
      user_id: user.id,
      subject: "Dashboard Contact Request",
      content: "Student requested tutor contact from the dashboard.",
    });

    if (error) {
      console.error("Failed to insert dashboard contact message", error);
      const { error: loggingError } = await supabase.from("messages").insert({
        user_id: user.id,
        subject: "Dashboard Contact Request Error",
        content: `Dashboard contact request failed to send. Error: ${error.message}`,
      });
      if (loggingError) {
        console.error("Failed to log dashboard contact error message", loggingError);
      }
      toast({
        title: "Message not delivered",
        description: (
          <>
            We couldn&apos;t deliver your tutor message. Please{" "}
            <a
              href={`mailto:${TUTOR_EMAIL}?subject=Student%20Message&body=I%20tried%20to%20contact%20my%20tutor%20from%20the%20dashboard%20but%20it%20did%20not%20send.`}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              email your tutor
            </a>{" "}
            as a backup.
          </>
        ),
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message sent",
      description: "Your tutor has been notified and will follow up soon.",
    });
  };

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
                <Button 
                  size="lg" 
                  className="h-20 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 rounded-xl shadow-lg"
                  disabled={!canSchedule}
                  onClick={() => openCalendlyWidget(CALENDLY_2_HOUR_URL)}
                >
                  <Calendar className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div>Book Session</div>
                    <div className="text-sm font-normal opacity-80">Schedule a new tutoring session</div>
                  </div>
                </Button>

                {/* Session Summaries */}
                <Button 
                  size="lg" 
                  variant="outline"
                  className="h-20 text-lg font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 rounded-xl"
                  onClick={() => setLocation("/sessions")}
                >
                  <FileText className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div>Session Summaries</div>
                    <div className="text-sm font-normal opacity-70">View session details and notes</div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                {/* Contact Tutor */}
                <Button 
                  size="lg" 
                  variant="outline"
                  className="h-20 text-lg font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 rounded-xl"
                  onClick={() => {
                    void handleContactTutor();
                  }}
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
      </div>
    </div>
  );
}
