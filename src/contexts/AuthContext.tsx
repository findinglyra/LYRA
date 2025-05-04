// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { getProfile } from '@/services/profile';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  hasProfile: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  checkAndRedirect: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user has a profile and update state
  const checkUserProfile = async (userId: string) => {
    try {
      const profile = await getProfile(userId);
      setHasProfile(!!profile);
      return !!profile;
    } catch (error) {
      console.error('Error checking profile:', error);
      return false;
    }
  };

  // Check profile and redirect to appropriate page
  const checkAndRedirect = async () => {
    if (!user) return;
    
    const hasExistingProfile = await checkUserProfile(user.id);
    
    if (!hasExistingProfile) {
      navigate('/create-profile');
    } else {
      navigate('/match');
    }
  };

  useEffect(() => {
    // Set up initial session
    const setupSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      if (data.session?.user) {
        setUser(data.session.user);
        await checkUserProfile(data.session.user.id);
      }
      setLoading(false);
    };

    setupSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        setUser(session.user);
        await checkUserProfile(session.user.id);
      } else {
        setUser(null);
        setHasProfile(false);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      toast({
        title: "Verification email sent",
        description: "Please check your email to verify your account",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error signing up",
          description: error.message,
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Check if user has profile and redirect accordingly
      if (data.user) {
        const hasExistingProfile = await checkUserProfile(data.user.id);
        navigate(hasExistingProfile ? '/match' : '/create-profile');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error signing in",
          description: error.message,
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setHasProfile(false);
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      toast({
        title: "Password reset email sent",
        description: "Check your email for the password reset link",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error resetting password",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully",
      });
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error updating password",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      hasProfile,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updatePassword,
      checkAndRedirect
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};