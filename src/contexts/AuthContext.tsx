// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

const SESSION_STORAGE_KEY = 'lyra_session_data';
const PROFILE_CHECK_CACHE_KEY_PREFIX = 'lyra_profile_check_';
const RATE_LIMIT_STORAGE_KEY = 'lyra_rate_limit';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profileCheckLoading: boolean;
  hasProfile: boolean;
  isAuthenticated: boolean;
  initialRedirectToMatchDone: boolean;
  signUp: (email: string, password: string) => Promise<{ user: User | null; session: Session | null; error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ user: User | null; session: Session | null; error: any | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  validateSession: () => Promise<boolean>;
  refreshSession: () => Promise<boolean>;
  enforceAuthRouting: (pathname: string) => Promise<boolean>;
  invalidateProfileCache: (userId: string) => void;
  clearAllProfileCache: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const profileCheckCache = {
  get: (userId: string): boolean | undefined => {
    const item = localStorage.getItem(`${PROFILE_CHECK_CACHE_KEY_PREFIX}${userId}`);
    return item ? JSON.parse(item) : undefined;
  },
  set: (userId: string, hasProfile: boolean) => {
    localStorage.setItem(`${PROFILE_CHECK_CACHE_KEY_PREFIX}${userId}`, JSON.stringify(hasProfile));
  },
  clear: (userId?: string) => {
    if (userId) {
      localStorage.removeItem(`${PROFILE_CHECK_CACHE_KEY_PREFIX}${userId}`);
    } else {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(PROFILE_CHECK_CACHE_KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    }
  }
};

const persistSession = (session: Session | null, user: User | null) => {
  if (session && user) {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ session, user, timestamp: Date.now() }));
  } else {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
};

const loadPersistedSession = (): { session: Session; user: User; timestamp: number } | null => {
  const data = localStorage.getItem(SESSION_STORAGE_KEY);
  if (data) {
    const parsed = JSON.parse(data);
    return parsed;
  }
  return null;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profileCheckLoading, setProfileCheckLoading] = useState<boolean>(true);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [initialRedirectToMatchDone, setInitialRedirectToMatchDone] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const checkUserProfile = useCallback(async (userId: string): Promise<boolean> => {
    const timerLabel = `AuthContext:checkUserProfile_FOR_${userId.substring(0, 8)}_${Date.now()}`;
    console.time(timerLabel);
    setProfileCheckLoading(true);

    const cachedStatus = profileCheckCache.get(userId);
    if (cachedStatus !== undefined) {
      console.log(`AuthContext: Using cached profile status for ${userId}: ${cachedStatus}`);
      setHasProfile(cachedStatus);
      setProfileCheckLoading(false);
      console.timeEnd(timerLabel);
      return cachedStatus;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, setup_complete')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('AuthContext: Error checking user profile:', error);
        profileCheckCache.set(userId, false);
        setHasProfile(false);
        return false;
      }
      
      const profileExistsAndSetupComplete = !!data && !!data.setup_complete;
      console.log(`AuthContext: Profile for ${userId} - Exists: ${!!data}, Setup Complete: ${data?.setup_complete}`);
      profileCheckCache.set(userId, profileExistsAndSetupComplete);
      setHasProfile(profileExistsAndSetupComplete);
      return profileExistsAndSetupComplete;
    } catch (err) {
      console.error('AuthContext: Exception during profile check for user', userId, err);
      profileCheckCache.set(userId, false);
      setHasProfile(false);
      return false;
    } finally {
      setProfileCheckLoading(false);
      console.timeEnd(timerLabel);
    }
  }, []);

  useEffect(() => {
    console.log('AuthContext: Initializing and setting up auth listener.');
    setLoading(true);
    setProfileCheckLoading(true);

    const initializeAuthFlow = async () => {
      const persisted = loadPersistedSession();
      if (persisted) {
        console.log('AuthContext: initializeAuthFlow - Found persisted session.');
        setSession(persisted.session);
        setUser(persisted.user);
        setIsAuthenticated(true);
        await checkUserProfile(persisted.user.id);
      } else {
        console.log('AuthContext: initializeAuthFlow - No persisted session found.');
        setProfileCheckLoading(false);
      }
      const { data: currentSupabaseSessionData } = await supabase.auth.getSession();
      if (!currentSupabaseSessionData.session && persisted) {
        console.log('AuthContext: initializeAuthFlow - Persisted session invalid according to Supabase. Clearing.');
        setUser(null);
        setSession(null);
        persistSession(null, null);
        setIsAuthenticated(false);
        setHasProfile(false);
        setProfileCheckLoading(false);
      }
      setLoading(false);
    };

    initializeAuthFlow();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, changedSession) => {
        const eventTime = Date.now();
        console.log(`[${eventTime}] AuthContext: onAuthStateChange - Event received: ${_event}. Session is ${changedSession ? 'PRESENT' : 'NULL'}.`);

        if (changedSession) {
          setUser(changedSession.user);
          setSession(changedSession);
          persistSession(changedSession, changedSession.user);
          setIsAuthenticated(true);
          setLoading(false);
          await checkUserProfile(changedSession.user.id);
          console.log(`[${Date.now()}] AuthContext: onAuthStateChange - User ${changedSession.user.id} profile check complete after event. Event processing time: ${Date.now() - eventTime}ms.`);
        } else { 
          console.log(`[${Date.now()}] AuthContext: onAuthStateChange - Handling SIGNED_OUT or NULL session. Event: ${_event}.`);
          setUser(null);
          setSession(null);
          persistSession(null, null);
          setIsAuthenticated(false);
          setHasProfile(false);
          setProfileCheckLoading(false);
          setLoading(false);             
          profileCheckCache.clear();
          setInitialRedirectToMatchDone(false);
          console.log(`[${Date.now()}] AuthContext: onAuthStateChange - States have been set to signed-out values.`);
          console.log(`[${Date.now()}] AuthContext: onAuthStateChange - SIGNED_OUT processing finished. Total time for this event: ${Date.now() - eventTime}ms.`);
        }
      }
    );

    console.log('AuthContext: Auth state change listener registered');
      
    return () => {
      console.log('AuthContext: Unsubscribing from auth state changes');
      subscription.unsubscribe();
    };
  }, [checkUserProfile]);

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      return { user: data.user, session: data.session, error: null };
    } catch (error: any) {
      console.error('AuthContext: Sign up error:', error);
      return { user: null, session: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { user: data.user, session: data.session, error: null };
    } catch (error: any) {
      console.error('AuthContext: Sign in error:', error);
      return { user: null, session: null, error };
    }
  };

  const signOut = async () => {
    const signOutProcessStartTime = Date.now();
    console.log(`[${signOutProcessStartTime}] AuthContext: signOut - Process started.`);
    try {
      console.log(`[${Date.now()}] AuthContext: signOut - Clearing local storage (SESSION_STORAGE_KEY) and profileCheckCache.`);
      localStorage.removeItem(SESSION_STORAGE_KEY); 
      profileCheckCache.clear();

      console.log(`[${Date.now()}] AuthContext: signOut - Calling supabase.auth.signOut().`);
      const supabaseCallStartTime = Date.now();
      const { error } = await supabase.auth.signOut();
      const supabaseCallDuration = Date.now() - supabaseCallStartTime;
      console.log(`[${Date.now()}] AuthContext: signOut - supabase.auth.signOut() completed in ${supabaseCallDuration}ms.`);

      if (error) {
        console.error(`[${Date.now()}] AuthContext: signOut - supabase.auth.signOut() returned an error:`, error);
        throw error; 
      }
      console.log(`[${Date.now()}] AuthContext: signOut - supabase.auth.signOut() was successful. Navigating to '/'. Expect onAuthStateChange to handle state reset.`);
      navigate('/');
      toast({
        title: 'Signed out successfully',
        description: 'Your session has been ended.',
        variant: 'default'
      });
      console.log(`[${Date.now()}] AuthContext: signOut - Process finished successfully. Total time: ${Date.now() - signOutProcessStartTime}ms.`);
    } catch (error: any) {
      const errorTime = Date.now();
      console.error(`[${errorTime}] AuthContext: signOut - ERROR during sign-out process:`, error);
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      setHasProfile(false);
      setProfileCheckLoading(false); 
      setLoading(false);             
      localStorage.removeItem(SESSION_STORAGE_KEY); 
      profileCheckCache.clear();
      setInitialRedirectToMatchDone(false);
      toast({
        title: 'Sign out failed',
        description: error.message || 'An unexpected error occurred. Please check your connection.',
        variant: 'destructive'
      });
      console.log(`[${Date.now()}] AuthContext: signOut - Process failed. Total time: ${Date.now() - signOutProcessStartTime}ms.`);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast({ title: 'Password reset email sent', description: 'Check your email for instructions.' });
    } catch (error: any) {
      console.error('AuthContext: Reset password error:', error);
      toast({ title: 'Error sending reset email', description: error.message, variant: 'destructive' });
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: 'Password updated successfully' });
    } catch (error: any) {
      console.error('AuthContext: Update password error:', error);
      toast({ title: 'Error updating password', description: error.message, variant: 'destructive' });
    }
  };

  const validateSession = useCallback(async (): Promise<boolean> => {
    const { data: { session: currentSupabaseSession }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('AuthContext: validateSession - Error getting session from Supabase:', error);
      return false;
    }
    if (!currentSupabaseSession) {
      if (session) { 
        console.log('AuthContext: validateSession - Local session exists, but Supabase has no session. Invalidating.');
        setUser(null); setSession(null); persistSession(null, null); setIsAuthenticated(false); setHasProfile(false); setProfileCheckLoading(false);
      }
      return false;
    }
    if (session?.access_token !== currentSupabaseSession.access_token) {
      console.log('AuthContext: validateSession - Local session mismatch with Supabase. Updating local session.');
      setSession(currentSupabaseSession);
      setUser(currentSupabaseSession.user);
      persistSession(currentSupabaseSession, currentSupabaseSession.user);
      setIsAuthenticated(true);
    }
    return true;
  }, [session]);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    console.log('AuthContext: refreshSession - Attempting to refresh session.');
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('AuthContext: refreshSession - Error:', error);
      return false;
    }
    if (!data.session) {
      console.log('AuthContext: refreshSession - No session data returned from refresh.');
      return false;
    }
    console.log('AuthContext: refreshSession - Successful. New session will be handled by onAuthStateChange.');
    return true;
  }, []);

  const enforceAuthRouting = useCallback(async (currentPathname: string): Promise<boolean> => {
    console.log(`AuthContext: enforceAuthRouting - Path: ${currentPathname}, AuthLoading: ${loading}, ProfileLoading: ${profileCheckLoading}, IsAuth: ${isAuthenticated}, HasProfile: ${hasProfile}`);
    
    const AUTH_ROUTES = ['/auth', '/login', '/signup', '/register'];
    const PROFILE_CREATION_ROUTES = ['/create-profile', '/music-preferences', '/interests'];
    const GUEST_ACCESSIBLE_ROUTES = ['/', '/about', '/contact', '/verify-email', '/reset-password', '/auth/callback']; 
    const REDIRECT_AFTER_LOGIN = '/match';
    const REDIRECT_IF_NO_PROFILE = '/create-profile';
    const REDIRECT_IF_LOGGED_OUT = '/auth';

    const navigateIfNotAlreadyThere = (target: string, options?: { replace?: boolean; state?: any }) => {
      if (location.pathname !== target) {
        console.log(`AuthContext: Navigating from ${location.pathname} to ${target}`);
        navigate(target, options);
        return false; // Indicates navigation occurred
      }
      console.log(`AuthContext: Already at target ${target}. No navigation needed.`);
      return true; // No navigation occurred
    };

    if (loading) {
      console.log('AuthContext: enforceAuthRouting - Initial auth state loading, deferring routing.');
      return true;
    }

    if (isAuthenticated) {
      if (profileCheckLoading) {
        console.log('AuthContext: enforceAuthRouting - Authenticated, but profile check is loading.');
        if (AUTH_ROUTES.some(route => currentPathname.startsWith(route))) {
          console.log('AuthContext: enforceAuthRouting - Authenticated, profile loading, on auth page.');
          return navigateIfNotAlreadyThere('/');
        }
        return true; 
      }

      // Profile status is known (profileCheckLoading is false)
      if (!hasProfile) {
        if (!PROFILE_CREATION_ROUTES.some(route => currentPathname.startsWith(route))) {
          console.log('AuthContext: enforceAuthRouting - Authenticated, NO profile, NOT on profile creation page.');
          setInitialRedirectToMatchDone(false); // Reset if they need to create a profile
          return navigateIfNotAlreadyThere(REDIRECT_IF_NO_PROFILE);
        }
      } else { // hasProfile is true (and profileCheckLoading is false)
        if (!initialRedirectToMatchDone && currentPathname !== REDIRECT_AFTER_LOGIN) {
          console.log(`AuthContext: Authenticated, HAS profile. First redirect to ${REDIRECT_AFTER_LOGIN} from ${currentPathname}.`);
          setInitialRedirectToMatchDone(true); // Set the flag so we don't do this again
          return navigateIfNotAlreadyThere(REDIRECT_AFTER_LOGIN);
        }
        // Still redirect from auth/profile creation pages even if initial redirect is done
        if ((AUTH_ROUTES.some(route => currentPathname.startsWith(route)) || 
            PROFILE_CREATION_ROUTES.some(route => currentPathname.startsWith(route))) && 
            currentPathname !== REDIRECT_AFTER_LOGIN ) { // Avoid self-redirect from /match if it's an auth/profile route
          console.log(`AuthContext: Authenticated, HAS profile. On auth/profile page (${currentPathname}) that is not ${REDIRECT_AFTER_LOGIN}. Redirecting to ${REDIRECT_AFTER_LOGIN}.`);
          return navigateIfNotAlreadyThere(REDIRECT_AFTER_LOGIN);
        }
      }
    } else { 
      // Not Authenticated
      setInitialRedirectToMatchDone(false); // Reset if they become unauthenticated
      const isGuestAccessible = GUEST_ACCESSIBLE_ROUTES.some(route => currentPathname.startsWith(route));
      const isAuthRoute = AUTH_ROUTES.some(route => currentPathname.startsWith(route));
      
      if (!isGuestAccessible && !isAuthRoute) {
        console.log('AuthContext: enforceAuthRouting - Not authenticated, on protected page.');
        return navigateIfNotAlreadyThere(REDIRECT_IF_LOGGED_OUT, { state: { from: currentPathname } });
      }
    }
    console.log('AuthContext: enforceAuthRouting - All checks passed, no redirect needed for', currentPathname);
    return true;
  }, [loading, profileCheckLoading, isAuthenticated, hasProfile, navigate, location.pathname, initialRedirectToMatchDone]);

  useEffect(() => {
    enforceAuthRouting(location.pathname);
  }, [location.pathname, isAuthenticated, hasProfile, loading, profileCheckLoading, enforceAuthRouting]);

  const invalidateProfileCache = (userId: string) => {
    profileCheckCache.clear(userId);
  };

  const clearAllProfileCache = () => {
    profileCheckCache.clear();
  };

  const value = {
    user,
    session,
    loading,
    profileCheckLoading,
    hasProfile,
    isAuthenticated,
    initialRedirectToMatchDone,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    validateSession,
    refreshSession,
    enforceAuthRouting,
    invalidateProfileCache,
    clearAllProfileCache,
  };

  return (
    <AuthContext.Provider value={value}>
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