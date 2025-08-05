import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Map from "@/pages/map";
import Search from "@/pages/search";
import Activity from "@/pages/activity";
import Profile from "@/pages/profile";
import TrailDetail from "@/pages/trail-detail";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/map" component={Map} />
      <Route path="/search" component={Search} />
      <Route path="/activity" component={Activity} />
      <Route path="/profile" component={Profile} />
      <Route path="/trail/:id" component={TrailDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="max-w-sm mx-auto bg-white shadow-2xl min-h-screen relative">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
