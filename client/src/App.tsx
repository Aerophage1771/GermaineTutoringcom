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
import PracticeTest from "@/pages/PracticeTest";
import PracticeRC from "@/pages/PracticeRC";
import QuestionPractice from "@/pages/QuestionPractice";
import QuestionSetCreator from "@/pages/QuestionSetCreator";
import ProblemLog from "@/pages/ProblemLog";
import LearningLibrary from "@/pages/LearningLibrary";
import TrainMe from "@/pages/TrainMe";
import ExploreSets from "@/pages/ExploreSets";
import Progress from "@/pages/Progress";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/methodology" component={MethodologyResults} />
      <Route path="/results" component={MethodologyResults} />
      <Route path="/programs" component={Programs} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/practice-test" component={PracticeTest} />
      <Route path="/practice-rc" component={PracticeRC} />
      <Route path="/question-practice" component={QuestionPractice} />
      <Route path="/create-set" component={QuestionSetCreator} />
      <Route path="/problem-log" component={ProblemLog} />
      <Route path="/learning-library" component={LearningLibrary} />
      <Route path="/train-me" component={TrainMe} />
      <Route path="/explore-sets" component={ExploreSets} />
      <Route path="/progress" component={Progress} />
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
