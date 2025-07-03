import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Methodology from "@/pages/Methodology";
import Programs from "@/pages/Programs";
import Results from "@/pages/Results";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/methodology" component={Methodology} />
      <Route path="/programs" component={Programs} />
      <Route path="/results" component={Results} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
