import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Pages
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import PatientDashboard from "./pages/PatientDashboard";
import QuizPage from "./pages/QuizPage";
import HistoryPage from "./pages/HistoryPage";
import ExercisesPage from "./pages/ExercisesPage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />

      {/* Patient routes */}
      <Route path="/dashboard" component={PatientDashboard} />
      <Route path="/quiz" component={QuizPage} />
      <Route path="/history" component={HistoryPage} />
      <Route path="/exercises" component={ExercisesPage} />

      {/* Admin routes */}
      <Route path="/admin" component={AdminDashboard} />

      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
