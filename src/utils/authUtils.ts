// src/utils/authUtils.ts
import { supabase } from '@/lib/supabase';

/**
 * Constants for local storage keys
 */
export const AUTH_STORAGE_KEYS = {
  SESSION: 'lyra_session_data',
  SUPABASE_TOKEN: 'supabase.auth.token',
  SUPABASE_AUTH: 'lyra-auth',
};

/**
 * Check if a user is currently authenticated
 * @returns Promise<boolean> - True if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    console.log('AuthUtils: Checking if user is authenticated');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('AuthUtils: Error getting session:', error);
      return false;
    }
    
    const hasSession = !!data.session;
    console.log(`AuthUtils: User is ${hasSession ? 'authenticated' : 'not authenticated'}`);
    return hasSession;
  } catch (error) {
    console.error('AuthUtils: Exception during auth check:', error);
    return false;
  }
}

/**
 * Force sign-out regardless of current state by clearing browser storage
 * and calling the sign-out API endpoint directly. This is a more aggressive
 * approach to signing out when the normal sign-out flow fails.
 * 
 * @returns Promise resolving to true if successful
 */
export async function forceSignOut(): Promise<boolean> {
  console.time('forceSignOut');
  try {
    console.log('AuthUtils: Force sign-out starting');
    
    // Check if there's a current session first
    try {
      console.time('checkSessionBeforeSignOut');
      const { data: sessionData } = await supabase.auth.getSession();
      console.timeEnd('checkSessionBeforeSignOut');
      console.log('AuthUtils: Current session before sign-out:', 
                sessionData?.session ? 'Session exists' : 'No session');
      if (sessionData?.session) {
        console.log('AuthUtils: Session info before sign-out:', {
          user: sessionData.session.user.id,
          expires_at: new Date(sessionData.session.expires_at! * 1000).toISOString(),
          provider: sessionData.session.user.app_metadata.provider,
          // Use optional chaining for potentially missing properties
          session_id: (sessionData.session as any).id?.substring(0, 8) || 'unknown'
        });
      }
    } catch (sessionCheckError) {
      console.error('AuthUtils: Error checking session before sign-out:', sessionCheckError);
    }
    
    // Log current storage state before clearing
    const allLocalStorageKeys = Object.keys(localStorage);
    const authRelatedKeys = allLocalStorageKeys.filter(key => 
      key.includes('supabase') || 
      key.includes('sb-') || 
      key.includes('lyra') || 
      key.includes('auth')
    );
    
    console.log('AuthUtils: All localStorage keys before sign-out:', allLocalStorageKeys);
    console.log('AuthUtils: Auth-related localStorage keys before sign-out:', authRelatedKeys);
    
    // Clear Supabase-specific storage items
    const keysToRemove = [
      'sb-auth-token',
      'supabase.auth.token',
      'lyra_session_data',
      'sb-bjmtrfsqrhypnnffdkts-auth-token', // Handle dynamic project reference
    ];
    
    // Remove each auth-related key individually and log the result
    for (const key of keysToRemove) {
      const hadKey = localStorage.getItem(key) !== null;
      localStorage.removeItem(key);
      console.log(`AuthUtils: Removed key '${key}' from localStorage, existed: ${hadKey}`);
    }
    
    // Additionally, remove any keys that match auth patterns
    for (const key of authRelatedKeys) {
      if (!keysToRemove.includes(key)) { // Skip if already removed above
        localStorage.removeItem(key);
        console.log(`AuthUtils: Removed additional auth key '${key}' from localStorage`);
      }
    }
    
    // Call the Supabase sign-out endpoint
    console.log('AuthUtils: Calling Supabase auth.signOut() with global scope');
    console.time('supabaseSignOut');
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    console.timeEnd('supabaseSignOut');
    
    if (error) {
      console.error('AuthUtils: Supabase signOut returned error:', error);
      // Continue even with error, we'll try to clean up anyway
    } else {
      console.log('AuthUtils: Supabase signOut API call successful');
    }
    
    // Verify the sign-out worked by checking session again
    try {
      console.time('verifySignOut');
      const { data: verifyData } = await supabase.auth.getSession();
      console.timeEnd('verifySignOut');
      console.log('AuthUtils: Session after sign-out:', 
                verifyData?.session ? 'Still exists (problem!)' : 'Successfully cleared');
      
      if (verifyData?.session) {
        console.warn('AuthUtils: WARNING! Session still exists after sign-out!');
      }
    } catch (verifyError) {
      console.error('AuthUtils: Error verifying sign-out:', verifyError);
    }
    
    // Log the final storage state
    console.log('AuthUtils: localStorage keys after sign-out:', Object.keys(localStorage));
    
    console.timeEnd('forceSignOut');
    // Return success
    console.log('AuthUtils: Force sign out completed successfully');
    return true;
  } catch (error) {
    console.error('AuthUtils: Error during force sign out:', error);
    return false;
  }
}

/**
 * Refreshes the current session if it exists
 * @returns Promise<boolean> - True if successful refresh, false otherwise
 */
export async function refreshCurrentSession(): Promise<boolean> {
  try {
    console.log('AuthUtils: Attempting to refresh current session');
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('AuthUtils: Error refreshing session:', error);
      return false;
    }
    
    const refreshed = !!data.session;
    console.log(`AuthUtils: Session refresh ${refreshed ? 'successful' : 'failed'}`);
    return refreshed;
  } catch (error) {
    console.error('AuthUtils: Exception during session refresh:', error);
    return false;
  }
}

/**
 * Fix authentication state - use this when UI and auth state are inconsistent
 * This function checks auth state and clears it if inconsistent
 * @returns Promise<boolean> - True if auth state is valid, false if it was reset
 */
export async function fixAuthState(): Promise<boolean> {
  try {
    console.log('AuthUtils: Checking and fixing auth state');
    
    // First check if Supabase has a valid session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('AuthUtils: Error getting session:', error);
      // If there's an error, clear all auth data
      await forceSignOut();
      return false;
    }
    
    if (!data.session) {
      console.log('AuthUtils: No valid session found, clearing any stale auth data');
      // If no session exists but we have local storage items, clear them
      await forceSignOut();
      return false;
    }
    
    // If we have a valid session, try to refresh it to ensure it's fresh
    const refreshed = await refreshCurrentSession();
    return refreshed;
  } catch (error) {
    console.error('AuthUtils: Exception during auth state fix:', error);
    await forceSignOut();
    return false;
  }
}

/**
 * Force a sign-in with email and password, clearing any existing sessions first
 * to prevent conflicts. Use this when normal sign-in gets stuck.
 * Ensures authentication is done against the auth.users table.
 * 
 * @param email - User's email
 * @param password - User's password
 * @returns Promise with sign-in result and hasProfile flag
 */
export async function forceSignIn(email: string, password: string) {
  console.time('forceSignIn');
  try {
    console.log('AuthUtils: Force sign-in starting for email:', email.substring(0, 3) + '***');
    console.log('AuthUtils: Current authentication state before sign-in:');
    console.log('AuthUtils: localStorage keys:', Object.keys(localStorage));
    console.log('AuthUtils: sessionStorage keys:', Object.keys(sessionStorage));
    
    // Check if there's already a session before we clear it
    try {
      console.time('initialSessionCheck');
      const { data: currentSession } = await supabase.auth.getSession();
      console.timeEnd('initialSessionCheck');
      console.log('AuthUtils: Current session before clearing:', 
                currentSession?.session ? 'Session exists' : 'No session');
    } catch (sessionError) {
      console.error('AuthUtils: Error checking initial session:', sessionError);
    }
    
    // Step 1: Clear any existing sessions forcefully
    console.time('forceSignOut');
    console.log('AuthUtils: Starting force sign-out');
    await forceSignOut();
    console.timeEnd('forceSignOut');
    console.log('AuthUtils: Force sign-out completed');
    
    // Step 2: Clear browser storage to prevent interference
    console.log('AuthUtils: Clearing localStorage and sessionStorage');
    const localStorageKeysBefore = Object.keys(localStorage);
    const sessionStorageKeysBefore = Object.keys(sessionStorage);
    
    // Clear all auth storage items
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cookies that might interfere with auth
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.trim().split('=');
      if (name.includes('sb-') || name.includes('supabase') || name.includes('auth') || name.includes('lyra')) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        console.log(`AuthUtils: Cleared cookie ${name}`);
      }
    });
    
    console.log('AuthUtils: Cleared storage. Before:', {
      localStorageKeys: localStorageKeysBefore,
      sessionStorageKeys: sessionStorageKeysBefore
    });
    console.log('AuthUtils: After clearing, localStorage keys:', Object.keys(localStorage));
    
    // Step 3: Small delay to ensure everything is cleared
    console.log('AuthUtils: Waiting for cleanup to complete');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('AuthUtils: Cleanup delay complete');
    
    // Step 4: Verify auth.users table connectivity via admin API
    console.log('AuthUtils: Verifying connection to auth.users table');
    try {
      // Direct sign-in to explicitly authenticate against auth.users
      console.time('directAuthSignIn');
      console.log('AuthUtils: Attempting direct auth.signInWithPassword call');
      
      // Use the existing Supabase client - simpler approach
      const { data: directAuthData, error: directAuthError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.timeEnd('directAuthSignIn');
      
      if (directAuthError) {
        console.error('AuthUtils: Direct auth sign-in failed:', directAuthError);
        throw directAuthError;
      }
      
      if (!directAuthData.session || !directAuthData.user) {
        console.error('AuthUtils: Direct auth sign-in did not return expected data');
        throw new Error('Authentication successful but invalid response data');
      }
      
      console.log('AuthUtils: Direct auth sign-in successful, user ID:', directAuthData.user.id);
      console.log('AuthUtils: Using direct auth session for remaining operations');
      
      // Use the direct auth session results
      const data = directAuthData;
      
      // Step 5: Verify we got a session
      if (!data.session) {
        console.error('AuthUtils: Force sign-in did not return a session');
        throw new Error('Authentication successful but no session returned');
      }
      
      console.log('AuthUtils: Sign-in successful, got session with user ID:', data.user?.id);
      console.log('AuthUtils: Session expires at:', new Date(data.session.expires_at! * 1000).toISOString());
      
      // Step 6: Check if user has a profile (to help with redirection)
      let hasProfile = false;
      if (data.user) {
        try {
          console.log('AuthUtils: Checking if user has profile');
          console.time('profileCheck');
          
          // Use a timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Profile check timed out after 5 seconds')), 5000);
          });
          
          const profileCheckPromise = (async () => {
            // First check auth.users record explicitly
            const { data: authUserData, error: authUserError } = await supabase.auth.getUser();
            
            if (authUserError || !authUserData.user) {
              console.error('AuthUtils: Error verifying auth.users record:', authUserError);
              throw new Error('Failed to verify auth.users record');
            }
            
            console.log('AuthUtils: Successfully verified auth.users record for user ID:', authUserData.user.id);
            
            // Check if user has music preferences
            const musicPromise = supabase
              .from('music_preferences')
              .select('id')
              .eq('user_id', data.user!.id)
              .maybeSingle();
            
            // Check if user has profile data in parallel
            const profilePromise = supabase
              .from('profiles')
              .select('id, full_name, birth_date')
              .eq('id', data.user!.id)
              .maybeSingle();
              
            // Wait for both queries to complete
            const [musicResult, profileResult] = await Promise.all([musicPromise, profilePromise]);
            
            return { musicResult, profileResult };
          })();
          
          // Use race to prevent hanging on profile check
          const { musicResult, profileResult } = await Promise.race([profileCheckPromise, timeoutPromise]) as any;
          console.timeEnd('profileCheck');
          
          const musicData = musicResult.data;
          const profileData = profileResult.data;
          
          // Log any errors from the profile queries
          if (musicResult.error) {
            console.error('AuthUtils: Error checking music profile:', musicResult.error);
          }
          if (profileResult.error) {
            console.error('AuthUtils: Error checking user profile:', profileResult.error);
          }
          
          // User has a complete profile if they have both music preferences
          // and their profile has full_name and birth_date
          hasProfile = Boolean(musicData) && 
            Boolean(profileData?.full_name) && 
            Boolean(profileData?.birth_date);
          
          console.log('AuthUtils: User has music profile:', Boolean(musicData));
          console.log('AuthUtils: User has user profile:', Boolean(profileData));
          console.log('AuthUtils: Profile data:', profileData);
          console.log('AuthUtils: User has complete profile:', hasProfile);
        } catch (profileError) {
          console.error('AuthUtils: Error checking profile:', profileError);
          hasProfile = false;
        }
      }
      
      // Verify session state after login
      try {
        console.time('finalSessionCheck');
        const { data: verifySession } = await supabase.auth.getSession();
        console.timeEnd('finalSessionCheck');
        console.log('AuthUtils: Verified session after sign-in:', verifySession.session ? 'Valid' : 'Missing');
      } catch (verifyError) {
        console.error('AuthUtils: Error verifying final session:', verifyError);
      }
      
      console.log('AuthUtils: Force sign-in completed successfully, hasProfile:', hasProfile);
      console.timeEnd('forceSignIn');
      return { ...data, hasProfile };
    } catch (authError) {
      console.error('AuthUtils: Auth verification failed:', authError);
      throw authError;
    }
  } catch (error) {
    console.error('AuthUtils: Force sign-in error:', error);
    console.timeEnd('forceSignIn');
    throw error;
  }
}
