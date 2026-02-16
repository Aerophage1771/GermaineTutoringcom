import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, BookOpen, Calendar, Archive, MessageCircle, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Calendly widget interface
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

export default function Dashboard() {
  const { user, isLoading } = useAuthRedirect();
  const { logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Dialog states
  const [isBookSessionOpen, setIsBookSessionOpen] = useState(false);
  const [isContactTutorOpen, setIsContactTutorOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

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
  
  const getTimeRemainingColor = (time: number) => {
    if (time > 5) return "text-green-600";
    if (time > 2) return "text-yellow-600";
    return "text-red-600";
  };
  
  const timeRemainingColor = getTimeRemainingColor(timeRemaining);
  const canSchedule = timeRemaining > 0;

  // Calendly functions
  const openCalendlyWidget = (url: string) => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url });
    }
  };

  const handleContactTutor = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a subject and message.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingMessage(true);
    const { error } = await supabase.from("messages").insert({
      user_id: user.id,
      subject: subject.trim(),
      content: message.trim(),
    });
    setIsSendingMessage(false);

    if (error) {
      toast({
        title: "Message Failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message Sent",
      description: "Your tutor has received your message.",
    });
    setSubject("");
    setMessage("");
    setIsContactTutorOpen(false);
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
            {/* Account Info */}
            <Card className="shadow-lg bg-white border-0">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Summary
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">{user.sessions_held}</div>
                      <div className="text-xs text-gray-600">Completed Sessions</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className={`text-xl font-bold ${timeRemainingColor}`}>
                        {timeRemaining.toFixed(1)}h
                      </div>
                      <div className="text-xs text-gray-600">Time Left</div>
                    </div>
                    {user.bonus_test_review_time > 0 ? (
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-emerald-600">
                          {bonusTestTime.toFixed(1)}h
                        </div>
                        <div className="text-xs text-gray-600">Bonus</div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </CardContent>
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
                <Dialog open={isContactTutorOpen} onOpenChange={setIsContactTutorOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="h-20 text-lg font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 rounded-xl"
                    >
                      <MessageCircle className="h-6 w-6 mr-3" />
                      <div className="text-left">
                        <div>Contact Tutor</div>
                        <div className="text-sm font-normal opacity-70">Get help and support</div>
                      </div>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Contact Tutor</DialogTitle>
                      <DialogDescription>
                        Send a message directly to your tutor.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleContactTutor} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact-subject">Subject</Label>
                        <Input
                          id="contact-subject"
                          value={subject}
                          onChange={(event) => setSubject(event.target.value)}
                          placeholder="What do you need help with?"
                          maxLength={200}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-message">Message</Label>
                        <Textarea
                          id="contact-message"
                          value={message}
                          onChange={(event) => setMessage(event.target.value)}
                          placeholder="Write your message..."
                          rows={5}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isSendingMessage}>
                        {isSendingMessage ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
