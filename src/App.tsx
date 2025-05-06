
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import LoadingScreen from "./pages/LoadingScreen";
import Index from "./pages/Index";
import Play from "./pages/Play";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading assets
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Show loading screen for 2.5 seconds

    return () => clearTimeout(loadingTimeout);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="chess-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          
          {isLoading ? (
            <LoadingScreen onComplete={() => setIsLoading(false)} />
          ) : (
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/play" element={<Play />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          )}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
