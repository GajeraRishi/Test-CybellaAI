
import { ToastProvider } from "@/components/ui/toast-system";
import { SonnerToaster } from "@/components/ui/toast-system";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import ConnectivityWarning from "@/components/ConnectivityWarning";
import Index from "./pages/Index";
import About from "./pages/About";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

// Create a client for React Query
const queryClient = new QueryClient();

/**
 * Main App component: Sets up providers and routing (multi-language removed)
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserPreferencesProvider>
      <TooltipProvider>
        <ToastProvider />
        <SonnerToaster />
        <ConnectivityWarning />
        <BrowserRouter basename="/Test-CybellaAI/">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/about" element={<About />} />
            <Route path="/face" element={<Index />} />
            <Route path="/emotions" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserPreferencesProvider>
  </QueryClientProvider>
);

export default App;
