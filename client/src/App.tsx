import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./lib/auth";
import { ScrollToTop } from "@/components/ScrollToTop";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import MethodologyResults from "@/pages/MethodologyResults";
import Programs from "@/pages/Programs";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import LearningLibrary from "@/pages/LearningLibrary";
import AdminBlog from "@/pages/AdminBlog";
import AdminDashboard from "@/pages/AdminDashboard";

const isStudentPortal = import.meta.env.VITE_APP_MODE === "dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={isStudentPortal ? Login : Home} />
      <Route path="/methodology" component={MethodologyResults} />
      <Route path="/results" component={MethodologyResults} />
      <Route path="/programs" component={Programs} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/learning-library" component={LearningLibrary} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/blog" component={AdminBlog} />
      <Route path="/admin/blog/new" component={AdminBlog} />
      <Route path="/admin/blog/edit/:id" component={AdminBlog} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <ScrollToTop />
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
