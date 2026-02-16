import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // New Local State: Tracks if the form is currently being sent
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Global Auth State: Tracks if the app is checking your session
  const { login, isLoading: isAuthLoading, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      setLocation(user.role === "admin" ? "/admin/dashboard" : "/dashboard");
    }
  }, [isAuthenticated, user, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true); // Disable button
      await login(email, password);
      toast({
        title: "Login Successful",
        description: "Welcome to your dashboard!",
      });
      // No need to setSubmitting(false) because we redirect
    } catch (error: any) {
      setIsSubmitting(false); // Re-enable button on error
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  // If the app is checking if you are already logged in, show a simple loading state
  // instead of a confusing disabled form.
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="font-heading text-2xl text-primary">Student Portal</CardTitle>
                <CardDescription>
                  Access your personalized study materials and question explanations
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-foreground font-medium">Email or Username</Label>
                    <Input
                      id="email"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting} // Only disabled when YOU click it
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    {isSubmitting ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
              
              {/* Footer Links (Forgot password, etc) */}
              <CardFooter className="flex flex-col space-y-4 pt-0">
                <div className="text-center">
                  <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
                    Forgot your password?
                  </button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
