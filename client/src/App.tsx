import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Diagnose from "@/pages/diagnose";
import Devices from "@/pages/devices";
import Technicians from "@/pages/technicians";
import BookTechnician from "@/pages/book-technician";
import Bookings from "@/pages/bookings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/diagnose" component={Diagnose} />
      <Route path="/devices" component={Devices} />
      <Route path="/technicians" component={Technicians} />
      <Route path="/book/:id" component={BookTechnician} />
      <Route path="/bookings" component={Bookings} />
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
