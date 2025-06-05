// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User, Provider } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

// --- BEGIN Persisted Session Logic ---
const SESSION_STORAGE_KEY = 'lyra-session-cache';

const persistSession = (session: Session | null, user: User | null) => {
  if (session && user) {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ session, user, timestamp: Date.now() }));
    console.log('AuthContext: Session persisted to localStorage.');
  } else {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    console.log('AuthContext: Session removed from localStorage.');
  }
};

const loadPersistedSession = (): { session: Session; user: User; timestamp: number } | null => {
  const data = localStorage.getItem(SESSION_STORAGE_KEY);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      // Basic validation of the parsed structure
      if (parsed && parsed.session && parsed.user && typeof parsed.timestamp === 'number') {
        console.log('AuthContext: Session loaded from localStorage.');
        return parsed;
      }
      console.warn('AuthContext: Invalid session data found in localStorage.');
      localStorage.removeItem(SESSION_STORAGE_KEY); // Clean up invalid data
    } catch (error) {
      console.error('AuthContext: Error parsing session data from localStorage:', error);
      localStorage.removeItem(SESSION_STORAGE_KEY); // Clean up corrupted data
    }
  }
  console.log('AuthContext: No session found in localStorage.');
  return null;
};
// --- END Persisted Session Logic ---

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  completionCheckLoading: boolean;
  hasCoreProfile: boolean;
  hasRequiredMusicPreferences: boolean;
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
  handleSocialAuth: (provider: Provider, options?: { redirectTo?: string }) => Promise<void>;
  invalidateProfileCache: (userId: string) => Promise<void>;
  clearAllProfileCache: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const userCompletionStatusCache = {
  get: (userId: string): { hasCoreProfile: boolean; hasRequiredMusicPreferences: boolean } | undefined => {
    const item = localStorage.getItem(`lyra_completion_status_${userId}`);
    return item ? JSON.parse(item) : undefined;
  },
  set: (userId: string, status: { hasCoreProfile: boolean; hasRequiredMusicPreferences: boolean }) => {
    localStorage.setItem(`lyra_completion_status_${userId}`, JSON.stringify(status));
  },
  clear: (userId?: string) => {
    if (userId) {
      localStorage.removeItem(`lyra_completion_status_${userId}`);
    } else {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('lyra_completion_status_')) {
          localStorage.removeItem(key);
        }
      });
    }
  }
};

interface UserProfileData {
  id: string;
  full_name: string | null;
  birth_date: string | null;
  image_url: string | null;
  bio: string | null;
  constellation?: string | null;
  interests?: string[] | null;
  favorite_decade?: string | null;
  preferred_listening_time?: string | null;
  setup_complete?: boolean | null;
}

interface MusicPreferencesTableData {
  user_id: string;
  genres: string[] | null;
  artists: string[] | null;
  listening_moods: string[] | null;
}

const CORE_PROFILE_FIELDS_FOR_ROUTING: (keyof UserProfileData)[] = [
  'full_name',
  'birth_date',
  'bio'
];

const REQUIRED_MUSIC_PREFS_FIELDS: (keyof MusicPreferencesTableData)[] = [
  'genres',
  'artists',
  'listening_moods'
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [completionCheckLoading, setCompletionCheckLoading] = useState<boolean>(true);
  const [hasCoreProfile, setHasCoreProfile] = useState<boolean>(false);
  const [hasRequiredMusicPreferences, setHasRequiredMusicPreferences] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [initialRedirectToMatchDone, setInitialRedirectToMatchDone] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const checkUserCompletionStatus = useCallback(async (userId: string): Promise<{ coreProfileComplete: boolean; musicPrefsComplete: boolean }> => {
    const timerLabel = `AuthContext:checkUserCompletionStatus_FOR_${userId.substring(0, 8)}_${Date.now()}`;
    console.time(timerLabel);
    setCompletionCheckLoading(true);

    const cachedStatus = userCompletionStatusCache.get(userId);
    if (cachedStatus !== undefined) {
      console.log(`AuthContext: Using cached completion status for ${userId}: CoreProfile: ${cachedStatus.hasCoreProfile}, MusicPrefs: ${cachedStatus.hasRequiredMusicPreferences}`);
      setHasCoreProfile(cachedStatus.hasCoreProfile);
      setHasRequiredMusicPreferences(cachedStatus.hasRequiredMusicPreferences);
      setCompletionCheckLoading(false);
      console.timeEnd(timerLabel);
      return { coreProfileComplete: cachedStatus.hasCoreProfile, musicPrefsComplete: cachedStatus.hasRequiredMusicPreferences };
    }

    let isCoreProfileComplete = false;
    let areMusicPrefsComplete = false;

    try {
      // Step 1: Check Core Profile in 'profiles' table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, birth_date, bio')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('AuthContext: Error checking user core profile:', profileError);
        // Don't return yet, proceed to check music prefs, cache combined result later
      } else if (profileData) {
        isCoreProfileComplete = true;
        for (const field of CORE_PROFILE_FIELDS_FOR_ROUTING) {
          const value = profileData[field as keyof Pick<UserProfileData, 'full_name' | 'birth_date' | 'bio'>];

          // Refactored conditional logic for robust type checking
          if (value === null || value === undefined) {
            isCoreProfileComplete = false;
            console.log(`AuthContext: Core profile for ${userId} incomplete. Missing field: ${field} (is null or undefined).`);
            break;
          } else if (typeof value === 'string') {
            if (value.trim() === '') {
              isCoreProfileComplete = false;
              console.log(`AuthContext: Core profile for ${userId} incomplete. Empty string for field: ${field}.`);
              break;
            }
          } else if (typeof value === 'number') {
            // Handles numeric fields like 'age'.
            // If specific numeric conditions for incompleteness exist (e.g., age <= 0),
            // they would be checked here. For now, any non-null/undefined number is complete.
            // No action needed to keep isCoreProfileComplete = true for this case.
          } else if (Array.isArray(value)) {
            // This case should not be hit for 'full_name', 'birth_date', 'bio' as they are not arrays.
            // Adding for completeness if UserProfileData or CORE_PROFILE_FIELDS_FOR_ROUTING changes.
            // Cast value to unknown[] to satisfy TypeScript when accessing .length in this currently unreachable block.
            const arrayValue = value as unknown[];
            if (arrayValue.length === 0) {
              isCoreProfileComplete = false;
              console.log(`AuthContext: Core profile for ${userId} incomplete. Empty array for field: ${field}.`);
              break;
            }
          }
          // If value is a number (e.g., 'age'), it's considered complete if not null/undefined.
          // No specific check for 0 or negative unless required by business logic.
        }
      } else {
        console.log(`AuthContext: No core profile data found for user ${userId}.`);
      }

      // Step 2: Check Music Preferences in 'music_preferences' table
      // This assumes 'music_preferences' table has a 'user_id' column matching auth.users.id
      const { data: musicPrefsData, error: musicPrefsError } = await supabase
        .from('music_preferences')
        .select('genres, artists, listening_moods')
        .eq('user_id', userId)
        .single();

      if (musicPrefsError && musicPrefsError.code !== 'PGRST116') {
        console.error('AuthContext: Error checking user music preferences:', musicPrefsError);
      } else if (musicPrefsData) {
        areMusicPrefsComplete = true;
        for (const field of REQUIRED_MUSIC_PREFS_FIELDS) {
          const value = musicPrefsData[field as keyof Pick<MusicPreferencesTableData, 'genres' | 'artists' | 'listening_moods'>];
          // Simplified check for array types to avoid .trim() error. Value is string[] | null.
          if (value === null || (Array.isArray(value) && value.length === 0)) {
            areMusicPrefsComplete = false;
            console.log(`AuthContext: Music preferences for ${userId} incomplete in 'music_preferences' table. Missing/empty field: ${field}`);
            break;
          }
        }
      } else {
        console.log(`AuthContext: No music preferences data found for user ${userId} in 'music_preferences' table.`);
      }

      console.log(`AuthContext: User ${userId} - Core Profile Complete: ${isCoreProfileComplete}, Music Prefs Complete: ${areMusicPrefsComplete}`);
      userCompletionStatusCache.set(userId, { hasCoreProfile: isCoreProfileComplete, hasRequiredMusicPreferences: areMusicPrefsComplete });
      setHasCoreProfile(isCoreProfileComplete);
      setHasRequiredMusicPreferences(areMusicPrefsComplete);
      return { coreProfileComplete: isCoreProfileComplete, musicPrefsComplete: areMusicPrefsComplete };
    } catch (err) {
      console.error('AuthContext: Exception during multi-table completion status check for user', userId, err);
      // Cache as incomplete if any unexpected error occurs during the process
      userCompletionStatusCache.set(userId, { hasCoreProfile: isCoreProfileComplete, hasRequiredMusicPreferences: areMusicPrefsComplete }); // Cache whatever was determined before exception
      setHasCoreProfile(isCoreProfileComplete); // Set state based on what was determined
      setHasRequiredMusicPreferences(areMusicPrefsComplete);
      return { coreProfileComplete: isCoreProfileComplete, musicPrefsComplete: areMusicPrefsComplete };
    } finally {
      setCompletionCheckLoading(false);
      console.timeEnd(timerLabel);
    }
  }, [supabase]);

  const validateSession = useCallback(async (): Promise<boolean> => {
    const { data: { session: currentSupabaseSession }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('AuthContext: validateSession - Error getting session from Supabase:', error);
      setUser(null); setSession(null); persistSession(null, null); setIsAuthenticated(false);
      setHasCoreProfile(false); setHasRequiredMusicPreferences(false); setCompletionCheckLoading(false);
      return false;
    }
    if (!currentSupabaseSession) {
      if (session) { // Local session exists, but Supabase has no session
        console.log('AuthContext: validateSession - Local session exists, but Supabase has no session. Invalidating.');
        setUser(null); setSession(null); persistSession(null, null); setIsAuthenticated(false);
        setHasCoreProfile(false); setHasRequiredMusicPreferences(false); setCompletionCheckLoading(false);
      }
      return false;
    }
    // If local session's access token differs from Supabase's, update local session
    if (session?.access_token !== currentSupabaseSession.access_token) {
      console.log('AuthContext: validateSession - Local session token mismatch with Supabase. Updating local session.');
      setSession(currentSupabaseSession);
      setUser(currentSupabaseSession.user);
      persistSession(currentSupabaseSession, currentSupabaseSession.user);
      setIsAuthenticated(true);
      if (currentSupabaseSession.user) {
        await checkUserCompletionStatus(currentSupabaseSession.user.id);
      }
    } else if (!isAuthenticated && currentSupabaseSession) { // If context not authenticated but Supabase has session
      console.log('AuthContext: validateSession - Context not authenticated but Supabase has session. Syncing.');
      setSession(currentSupabaseSession);
      setUser(currentSupabaseSession.user);
      persistSession(currentSupabaseSession, currentSupabaseSession.user);
      setIsAuthenticated(true);
      if (currentSupabaseSession.user) {
        await checkUserCompletionStatus(currentSupabaseSession.user.id);
      }
    }
    return true;
  }, [session, isAuthenticated, supabase, checkUserCompletionStatus]);

  const validateSessionRef = useRef(validateSession);
  useEffect(() => {
    validateSessionRef.current = validateSession;
  }, [validateSession]);

  useEffect(() => {
    console.log('AuthContext: Initializing and setting up auth listener.');
    setLoading(true);
    setCompletionCheckLoading(true);

    const initializeAuthFlow = async () => {
      const persisted = loadPersistedSession();
      if (persisted) {
        console.log('AuthContext: initializeAuthFlow - Found persisted session.');
        setSession(persisted.session);
        setUser(persisted.user);
        setIsAuthenticated(true);
        const isValid = await validateSessionRef.current(); // Call through the ref
        if (isValid && persisted.user) {
          // checkUserCompletionStatus is called within validateSessionRef.current if needed
        } else if (!isValid) {
          setUser(null);
          setSession(null);
          persistSession(null, null);
          setIsAuthenticated(false);
          setHasCoreProfile(false);
          setHasRequiredMusicPreferences(false);
          userCompletionStatusCache.clear();
        }
      } else {
        console.log('AuthContext: initializeAuthFlow - No persisted session found.');
        const { data: { session: currentSupabaseSession } } = await supabase.auth.getSession();
        if (!currentSupabaseSession) {
          setCompletionCheckLoading(false);
        }
      }
      setLoading(false);
    };

    initializeAuthFlow();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, changedSession) => {
        const eventTime = Date.now();
        console.log(`[${eventTime}] AuthContext: onAuthStateChange - Event: ${_event}. Session ${changedSession ? 'PRESENT' : 'NULL'}.`);

        if (changedSession) {
          // Check if the session is genuinely new or different to avoid redundant updates
          if (session?.access_token !== changedSession.access_token || user?.id !== changedSession.user.id) {
            setSession(changedSession);
            setUser(changedSession.user);
            persistSession(changedSession, changedSession.user);
            setIsAuthenticated(true); // Redundant if session is already set?
            await checkUserCompletionStatus(changedSession.user.id);
          } else if (!isAuthenticated) {
            // Session matches, but context thought it wasn't authenticated. Correct it.
            setIsAuthenticated(true);
          }
          setLoading(false); // Potentially move this to be more conditional
          console.log(`[${Date.now()}] AuthContext: onAuthStateChange - User ${changedSession.user.id} completion check initiated/done. Event processing time: ${Date.now() - eventTime}ms.`);
        } else {
          console.log(`[${Date.now()}] AuthContext: onAuthStateChange - SIGNED_OUT or NULL session. Event: ${_event}.`);
          setUser(null);
          setSession(null);
          persistSession(null, null);
          setIsAuthenticated(false);
          setHasCoreProfile(false);
          setHasRequiredMusicPreferences(false);
          setCompletionCheckLoading(false);
          setLoading(false);
          userCompletionStatusCache.clear();
          setInitialRedirectToMatchDone(false);
          console.log(`[${Date.now()}] AuthContext: onAuthStateChange - States reset for signed-out. Total time: ${Date.now() - eventTime}ms.`);
        }
      }
    );

    console.log('AuthContext: Auth state change listener registered');

    return () => {
      console.log('AuthContext: Unsubscribing from auth state changes');
      subscription.unsubscribe();
    };
  }, [checkUserCompletionStatus, supabase]); // validateSession removed from dependencies

  const signUp = useCallback(async (email: string, password: string) => {
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  }, [supabase, toast, navigate]);

  const signIn = useCallback(async (email: string, password: string) => {
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
  }, [supabase]);

  const signOut = useCallback(async () => {
    const signOutProcessStartTime = Date.now();
    console.log(`[${signOutProcessStartTime}] AuthContext: signOut - Process started.`);
    try {
      console.log(`[${Date.now()}] AuthContext: signOut - Clearing local storage and completion cache.`);
      localStorage.removeItem(SESSION_STORAGE_KEY);
      userCompletionStatusCache.clear();

      console.log(`[${Date.now()}] AuthContext: signOut - Calling supabase.auth.signOut().`);
      const { error } = await supabase.auth.signOut();
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
      setHasCoreProfile(false);
      setHasRequiredMusicPreferences(false);
      setCompletionCheckLoading(false);
      setLoading(false);
      localStorage.removeItem(SESSION_STORAGE_KEY);
      userCompletionStatusCache.clear();
      setInitialRedirectToMatchDone(false);
      toast({
        title: 'Sign out failed',
        description: error.message || 'An unexpected error occurred. Please check your connection.',
        variant: 'destructive'
      });
      console.log(`[${Date.now()}] AuthContext: signOut - Process failed. Total time: ${Date.now() - signOutProcessStartTime}ms.`);
    }
  }, [supabase, navigate, toast]);

  const resetPassword = useCallback(async (email: string) => {
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
  }, [supabase, toast]);

  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: 'Password updated successfully' });
    } catch (error: any) {
      console.error('AuthContext: Update password error:', error);
      toast({ title: 'Error updating password', description: error.message, variant: 'destructive' });
    }
  }, [supabase, toast]);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    console.log('AuthContext: refreshSession - Attempting to refresh session.');
    const { error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('AuthContext: refreshSession - Error refreshing session:', error);
      // Potentially handle sign-out or specific error UI based on 'error.message'
      // For now, just log and return false, assuming onAuthStateChange might handle broader implications
      return false;
    }
    console.log('AuthContext: refreshSession - Successful. New session will be handled by onAuthStateChange.');
    return true;
  }, [supabase]);

  const enforceAuthRouting = useCallback(async (currentPathname: string): Promise<boolean> => {
    console.log(`AuthContext: enforceAuthRouting - Path: ${currentPathname}, AuthLoading: ${loading}, CompletionLoading: ${completionCheckLoading}, IsAuth: ${isAuthenticated}, HasCoreProfile: ${hasCoreProfile}, HasMusicPrefs: ${hasRequiredMusicPreferences}`);

    if (loading || completionCheckLoading) {
      console.log('AuthContext: enforceAuthRouting - Waiting for loading states to resolve.');
      return true;
    }

    const GUEST_ACCESSIBLE_ROUTES = ['/', '/login', '/signup', '/reset-password', '/auth/callback', '/interest'];
    const PROFILE_CREATION_PATH = '/create-profile';
    const MUSIC_PREFERENCES_PATH = '/music-preferences';
    const DEFAULT_AUTHENTICATED_PATH = '/match';

    const navigateIfNotAlreadyThere = (target: string, options?: { replace?: boolean; state?: any }) => {
      if (location.pathname !== target) {
        console.log(`AuthContext: Navigating from ${location.pathname} to ${target} with replace: ${!!options?.replace}`);
        navigate(target, { replace: true, ...options });
        return false;
      }
      return true;
    };

    if (!isAuthenticated) {
      if (!GUEST_ACCESSIBLE_ROUTES.some(route => currentPathname.startsWith(route))) {
        console.log(`AuthContext: enforceAuthRouting - Unauthenticated user accessing protected route ${currentPathname}. Redirecting to /login.`);
        return navigateIfNotAlreadyThere('/login');
      }
    } else {
      if (!hasCoreProfile) {
        console.log(`AuthContext: enforceAuthRouting - Authenticated user missing core profile. Path: ${currentPathname}`);
        return navigateIfNotAlreadyThere(PROFILE_CREATION_PATH);
      } else if (!hasRequiredMusicPreferences) {
        console.log(`AuthContext: enforceAuthRouting - Authenticated user missing music preferences. Path: ${currentPathname}`);
        return navigateIfNotAlreadyThere(MUSIC_PREFERENCES_PATH);
      } else {
        setInitialRedirectToMatchDone(true);
        console.log(`AuthContext: enforceAuthRouting - Authenticated user with complete setup. Path: ${currentPathname}`);
        if (currentPathname === PROFILE_CREATION_PATH || currentPathname === MUSIC_PREFERENCES_PATH || GUEST_ACCESSIBLE_ROUTES.some(route => currentPathname.startsWith(route) && route !== '/')) {
          console.log(`AuthContext: enforceAuthRouting - User on setup/guest page ${currentPathname} after completing profile. Redirecting to ${DEFAULT_AUTHENTICATED_PATH}.`);
          return navigateIfNotAlreadyThere(DEFAULT_AUTHENTICATED_PATH);
        }
      }
    }
    console.log(`AuthContext: enforceAuthRouting - No navigation needed for ${currentPathname}.`);
    return true;
  }, [loading, completionCheckLoading, isAuthenticated, hasCoreProfile, hasRequiredMusicPreferences, navigate, location.pathname]);

  const handleSocialAuth = useCallback(async (provider: Provider, options?: { redirectTo?: string }) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: options?.redirectTo || `${window.location.origin}/`,
        },
      });
      if (error) {
        toast({ title: 'Social Sign-In Error', description: error.message, variant: 'destructive' });
        console.error('AuthContext: Social sign-in error', error);
      }
    } catch (error: any) {
      toast({ title: 'Social Sign-In Failed', description: error.message || 'An unexpected error occurred.', variant: 'destructive' });
      console.error('AuthContext: Social sign-in exception', error);
    }
  }, [supabase, toast]);

  const invalidateProfileCache: AuthContextType['invalidateProfileCache'] = useCallback(async (userId: string) => {
    userCompletionStatusCache.clear(userId);
    console.log(`AuthContext: Cleared completion status cache for user ${userId}. Triggering immediate re-check.`);
    await checkUserCompletionStatus(userId); // Re-check and update context state
    console.log(`AuthContext: Completion status re-checked and context updated for user ${userId}.`);
  }, [checkUserCompletionStatus]);

  const clearAllProfileCache = useCallback(() => {
    console.log('AuthContext: Clearing all completion status cache.');
    userCompletionStatusCache.clear();
  }, []);

  const contextValue = useMemo(() => ({
    user,
    session,
    loading,
    completionCheckLoading,
    hasCoreProfile,
    hasRequiredMusicPreferences,
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
    handleSocialAuth,
    invalidateProfileCache,
    clearAllProfileCache
  }), [
    user, session, loading, completionCheckLoading, hasCoreProfile, hasRequiredMusicPreferences, isAuthenticated, initialRedirectToMatchDone,
    signUp, signIn, signOut, resetPassword, updatePassword, validateSession, refreshSession, enforceAuthRouting, handleSocialAuth, invalidateProfileCache, clearAllProfileCache
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
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