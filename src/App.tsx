// src/App.tsx
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
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
import NotFound from "./pages/NotFound";
import Interest from "./pages/Interest";

const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Layout showNav={false}>
                      <Index />
                    </Layout>
                  }
                />
                {/* Authentication Routes */}
                <Route
                  path="/auth"
                  element={
                    <Layout showNav={false}>
                      <Auth />
                    </Layout>
                  }
                />
                <Route
                  path="/auth/callback"
                  element={
                    <Layout showNav={false}>
                      <Auth />
                    </Layout>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <Layout showNav={false}>
                      <Login />
                    </Layout>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <Layout showNav={false}>
                      <Signup />
                    </Layout>
                  }
                />
                <Route
                  path="/reset-password"
                  element={
                    <Layout showNav={false}>
                      <ResetPassword />
                    </Layout>
                  }
                />
                <Route
                  path="/interest"
                  element={
                    <Layout showNav={false}>
                      <Interest />
                    </Layout>
                  }
                />
                <Route
                  path="/create-profile"
                  element={
                    <Layout>
                      <CreateProfile />
                    </Layout>
                  }
                />
                <Route
                  path="/match"
                  element={
                    <Layout>
                      <Match />
                    </Layout>
                  }
                />
                <Route
                  path="/chat"
                  element={
                    <Layout>
                      <Chat />
                    </Layout>
                  }
                />
                <Route
                  path="/music"
                  element={
                    <Layout>
                      <Music />
                    </Layout>
                  }
                />
                <Route
                  path="/community"
                  element={
                    <Layout>
                      <Community />
                    </Layout>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <Layout>
                      <Settings />
                    </Layout>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;