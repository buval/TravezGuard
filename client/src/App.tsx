import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/AuthPage";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Borders from "@/pages/Borders";
import Flights from "@/pages/Flights";
import Trips from "@/pages/Trips";
import TripDetails from "@/pages/TripDetails";
import Itinerary from "@/pages/Itinerary";
import NewTrip from "@/pages/NewTrip";
import Profile from "@/pages/Profile";

function Router() {
  return (
    <Switch>
      {/* Auth page for login/register */}
      <Route path="/auth" component={AuthPage} />
      
      {/* Root route - Landing handles auth redirect */}
      <Route path="/" component={Landing} />
      
      {/* All other routes - pages handle auth internally */}
      <Route path="/home" component={Home} />
      <Route path="/explore" component={Explore} />
      <Route path="/borders" component={Borders} />
      <Route path="/flights" component={Flights} />
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
