import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import LandingPage from "@/pages/landing";
import HomePage from "@/pages/home";
import AboutPage from "@/pages/about";
import ReleasesPage from "@/pages/releases";
import ProjectsPage from "@/pages/projects";
import DemosPage from "@/pages/demos";
import ServicesPage from "@/pages/services";
import PodcastsPage from "@/pages/podcasts";
import EventsPage from "@/pages/events";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import NotFound from "@/pages/not-found";


function Router() {
  const [location] = useLocation();
  const [hasEnteredSite, setHasEnteredSite] = useState(false);

  useEffect(() => {
    if (location !== "/") {
      setHasEnteredSite(true);
    }
  }, [location]);

  const showNavAndFooter = hasEnteredSite && location !== "/";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showNavAndFooter && <Navigation />}
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/home" component={HomePage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/releases" component={ReleasesPage} />
        <Route path="/projects" component={ProjectsPage} />
        <Route path="/demos" component={DemosPage} />
        <Route path="/services" component={ServicesPage} />
        <Route path="/events" component={EventsPage} />
        <Route path="/podcasts" component={PodcastsPage} />
        <Route component={NotFound} />
      </Switch>
      {showNavAndFooter && <Footer />}
    </div>
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
