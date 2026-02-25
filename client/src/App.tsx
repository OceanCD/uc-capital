import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Advisors from "./pages/Advisors";
import Analysis from "./pages/Analysis";
import Pricing from "./pages/Pricing";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import Navbar from "./components/Navbar";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/portfolio"} component={Portfolio} />
      <Route path={"/advisors"} component={Advisors} />
      <Route path={"/analysis"} component={Analysis} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path={"/subscription/success"} component={SubscriptionSuccess} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <div className="min-h-screen bg-background">
            {/* Top gold accent line */}
            <div className="gold-line fixed top-0 left-0 right-0 z-[60]" />
            <Navbar />
            <Router />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
