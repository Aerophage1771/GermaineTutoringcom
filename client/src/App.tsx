import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./lib/auth";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import MethodologyResults from "@/pages/MethodologyResults";
import Programs from "@/pages/Programs";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Sessions from "@/pages/Sessions";
import LearningLibrary from "@/pages/LearningLibrary";
import AdminBlog from "@/pages/AdminBlog";
import AdminDashboard from "@/pages/AdminDashboard";

const isStudentPortal = import.meta.env.VITE_APP_MODE === "dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={isStudentPortal ? () => <Redirect to="/login" /> : Home} />
      <Route path="/home" component={Home} />
      <Route path="/methodology" component={MethodologyResults} />
      <Route path="/results" component={MethodologyResults} />
      <Route path="/programs" component={Programs} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/sessions" component={Sessions} />
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
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-primary focus:font-bold focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Skip to Main Content
          </a>
          <ScrollToTop />
          <Toaster />
          <Router />
          <ScrollToTopButton />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
