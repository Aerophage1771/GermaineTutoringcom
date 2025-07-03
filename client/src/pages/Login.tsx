import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Login functionality would go here
    console.log("Login attempt:", { email, password });
  };

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
                  Access your personalized study materials and progress tracking
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
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
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Sign In
                  </Button>
                </form>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4 pt-0">
                <div className="text-center">
                  <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
                    Forgot your password?
                  </button>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-foreground text-sm mb-3">
                    Not a current student?
                  </p>
                  <Link href="/programs">
                    <Button 
                      variant="outline" 
                      className="border-primary text-primary hover:bg-primary hover:text-white font-semibold transition-colors"
                    >
                      Check out my tutoring programs to get started
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
            
            <div className="mt-8 text-center">
              <p className="text-foreground/70 text-sm">
                Need help? Contact{" "}
                <a 
                  href="mailto:support@germainetutoring.com" 
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  support@germainetutoring.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;