// src/App.tsx
import React, { useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { fixAuthState } from "@/utils/authUtils";
import { supabase } from "@/lib/supabase";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
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
import NotFound from "./pages/NotFound";
import Interest from "./pages/Interest";
import AuthCallback from "./pages/AuthCallback";
import { Loader2 } from 'lucide-react';

const queryClient = new QueryClient();

// Wrapper components for layout with navigation variations
const MainLayout = () => <Layout><Outlet /></Layout>;
const NoNavLayout = () => <Layout showNav={false}><Outlet /></Layout>;

const AppContent = () => {
  const { enforceAuthRouting, loading: authLoading } = useAuth();
  const location = useLocation();

  // Enforce auth routing on every route change, but only after auth is initialized
  useEffect(() => {
    if (!authLoading) {
      enforceAuthRouting(location.pathname);
    }
  }, [location.pathname, authLoading, enforceAuthRouting]);

  if (authLoading) {
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
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/interest" element={<Interest />} />
        </Route>

        {/* Routes with navigation */}
        <Route element={<MainLayout />}>
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/music-preferences" element={<MusicPreferences />} />
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
  const authInitializedRef = useRef(false); // Ref to track initialization

  // Initialize and fix auth state on app startup
  useEffect(() => {
    const initializeAuthCoreLogic = async () => {
      try {
        console.log('App: Initializing auth state (core logic)');
        const authStateValid = await fixAuthState();
        console.log(`App: Auth state initialization (core logic) ${authStateValid ? 'successful' : 'reset auth state'}`); 
      } catch (error) {
        console.error('App: Error during core auth initialization:', error);
      }
    };
    
    if (!authInitializedRef.current) {
      authInitializedRef.current = true;
      initializeAuthCoreLogic();
    }

    // Setup the onAuthStateChange listener. This part is safe to run multiple times
    // as long as it's correctly unsubscribed.
    console.log('App: Setting up onAuthStateChange listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('App: Auth state change event:', event);
      console.log('App: Session exists:', !!session);
    });
    
    return () => {
      console.log('App: Cleaning up auth effect - unsubscribing listener');
      subscription.unsubscribe();
      // Note: We don't reset authInitializedRef.current here because we want the core logic
      // to run only once for the lifetime of the App component instance.
      // If App unmounts and a new instance is created, authInitializedRef will be new and false.
    };
  }, []);
  
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