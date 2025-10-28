import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Trips from "@/pages/Trips";
import TripDetails from "@/pages/TripDetails";
import Itinerary from "@/pages/Itinerary";
import NewTrip from "@/pages/NewTrip";
import Profile from "@/pages/Profile";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show Landing for unauthenticated users at root, but all other routes are accessible
  // and will handle their own authentication requirements
  return (
    <Switch>
      {/* Root route changes based on auth state */}
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <Route path="/" component={Home} />
      )}
      
      {/* All other routes are always registered - pages handle auth internally */}
      <Route path="/explore" component={Explore} />
      <Route path="/trips" component={Trips} />
      <Route path="/trips/new" component={NewTrip} />
      <Route path="/trips/:id" component={TripDetails} />
      <Route path="/trips/:id/itinerary" component={Itinerary} />
      <Route path="/profile" component={Profile} />
      
      {/* 404 fallback */}
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
