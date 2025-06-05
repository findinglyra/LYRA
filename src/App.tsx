// src/App.tsx
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import Match from "./pages/Match";
import Chat from "./pages/Chat";
import Music from "./pages/Music";
import Community from "./pages/Community";
import Settings from "./pages/Settings";
import CreateProfile from "./pages/CreateProfile";
import MusicPreferences from "./pages/MusicPreferences";
import Feed from "./pages/Feed"; // Added import for Feed component
import NotFound from "./pages/NotFound";
import Interest from "./pages/Interest";
import AuthCallback from "./pages/AuthCallback";
import FeaturesPage from "./pages/Features";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import { Loader2 } from 'lucide-react';

const queryClient = new QueryClient();

// Wrapper components for layout with navigation variations
const MainLayout = () => <Layout><Outlet /></Layout>;
const NoNavLayout = () => <Layout showNav={false}><Outlet /></Layout>;

const AppContent = () => {
  const { enforceAuthRouting, loading: authLoading, completionCheckLoading } = useAuth();
  const location = useLocation();

  // Enforce auth routing on every route change, but only after auth and completion checks are initialized
  React.useEffect(() => {
    if (!authLoading && !completionCheckLoading) {
      enforceAuthRouting(location.pathname);
    }
  }, [location.pathname, authLoading, completionCheckLoading, enforceAuthRouting]);

  if (authLoading || completionCheckLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <Loader2 className="h-16 w-16 animate-spin text-white" />
        {/* <p className="text-white text-xl ml-4">Loading Stellar Alignments...</p> */}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Routes>
        {/* Routes without navigation */}
        <Route element={<NoNavLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/interest" element={<Interest />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/press" element={<Press />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Route>

        {/* Routes with navigation */}
        <Route element={<MainLayout />}>
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/music-preferences" element={<MusicPreferences />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/match" element={<Match />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/music" element={<Music />} />
          <Route path="/community" element={<Community />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Not found route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  );
};

const App = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;