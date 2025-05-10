import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Key, Eye, EyeOff, Music, Star, MoonStar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { forceSignIn, fixAuthState } from "@/utils/authUtils";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const navigate = useNavigate();
  const { signIn, resetPassword } = useAuth();
  const { toast } = useToast();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Starting sign-in with email:', email);
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    
    if (resetMode) {
      setIsLoading(true);
      try {
        await resetPassword(email);
        toast({
          title: "Password reset email sent",
          description: "Please check your email to reset your password",
        });
        setResetMode(false);
      } catch (error: any) {
        toast({
          title: "Password reset failed",
          description: error.message || "An unexpected error occurred",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    setIsLoading(true);
    console.time('LoginProcess');
    
    // Global timeout to prevent infinite loading
    const loginTimeout = setTimeout(() => {
      console.error('Login: Sign-in timed out after 15 seconds');
      setIsLoading(false);
      toast({
        title: "Sign-in timed out",
        description: "Please try again. If this persists, clear your browser data.",
        variant: "destructive"
      });
    }, 15000);
    
    try {
      // Step 1: Clear any existing auth state
      console.log('Login: Clearing existing auth state');
      await supabase.auth.signOut();
      
      // Clear cookies that might interfere with auth
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=');
        if (name.includes('sb-') || name.includes('supabase') || name.includes('auth')) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });
      
      // Brief delay to ensure session clearing takes effect
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 2: Authenticate directly against auth.users table
      console.log('Login: Authenticating with auth.users table');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login: Authentication error:', error);
        throw error;
      }
      
      if (!data.user || !data.session) {
        console.error('Login: Missing user or session data');
        throw new Error('Authentication successful but user data is missing');
      }
      
      console.log('Login: Successfully authenticated user ID:', data.user.id);
      
      // Step 3: Verify the auth user record explicitly
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        console.error('Login: Failed to verify user record:', userError);
        throw new Error('Failed to verify user in auth.users table');
      }
      
      // Step 4: Check if user has a profile with timeout protection
      console.log('Login: Checking if user has a profile');
      let hasProfile = false;
      
      try {
        const profileCheckPromise = (async () => {
          try {
            // Dynamic imports to reduce initial load time
            const { getProfile } = await import('@/services/profile');
            const { getUserProfile } = await import('@/services/user-profile');
            
            // Check both profile tables in parallel
            const musicProfilePromise = getProfile(data.user.id).catch(() => null);
            const userProfilePromise = getUserProfile(data.user.id).catch(() => null);
            const [musicProfile, userProfile] = await Promise.all([musicProfilePromise, userProfilePromise]);
            
            // User must have both profile types and essential fields
            const hasComplete = Boolean(musicProfile) && 
              Boolean(userProfile?.full_name) && 
              Boolean(userProfile?.birth_date);
            
            console.log('Login: Profile check complete - musicProfile:', !!musicProfile, 
                       'userProfile:', !!userProfile, 'hasComplete:', hasComplete);
            return hasComplete;
          } catch (error) {
            console.error('Login: Error checking profile:', error);
            return false;
          }
        })();
        
        // Set a timeout to prevent hanging
        const timeoutPromise = new Promise<boolean>((_, reject) => {
          setTimeout(() => reject(new Error('Profile check timed out')), 5000);
        });
        
        // Race the profile check against the timeout
        hasProfile = await Promise.race([profileCheckPromise, timeoutPromise]);
      } catch (profileError) {
        console.warn('Login: Profile check timed out or failed:', profileError);
        // Continue with login but default to create-profile path
        hasProfile = false;
      }
      
      // Success! Clear timeout and show success message
      clearTimeout(loginTimeout);
      toast({
        title: "Sign in successful",
        description: "Welcome back to Lyra!",
      });
      
      // Navigate based on profile status
      console.log('Login: Redirecting based on profile status:', hasProfile ? '/match' : '/create-profile');
      navigate(hasProfile ? '/match' : '/create-profile');
      
    } catch (error: any) {
      clearTimeout(loginTimeout);
      console.error('Login: Error during sign-in:', error);
      
      toast({
        title: "Login failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      
      // Try to fix auth state after error
      await fixAuthState().catch(e => 
        console.error('Login: Error fixing auth state:', e)
      );
    } finally {
      clearTimeout(loginTimeout);
      console.timeEnd('LoginProcess');
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'spotify' | 'apple' | 'github') => {
    try {
      setIsLoading(true);
      
      // Clear existing sessions before attempting OAuth
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      toast({
        title: "Authentication failed",
        description: error.message || `Could not authenticate with ${provider}`,
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="stellar-bg min-h-screen flex flex-col items-center justify-center p-4">
      <div className="glass-card p-8 rounded-2xl w-full max-w-md space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500"></div>
        
        <div className="text-center space-y-2">
          <div className="flex justify-center gap-3 items-center">
            <Music className="w-6 h-6 text-[hsl(var(--harmony-gold))]" />
            <h2 className="text-2xl font-bold">Lyra</h2>
            <MoonStar className="w-6 h-6 text-[hsl(var(--music-teal))]" />
          </div>
          <h1 className="text-2xl font-bold">
            {resetMode ? "Reset Your Password" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {resetMode 
              ? "Enter your email to receive a reset link" 
              : "Continue your stellar musical journey"}
          </p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {!resetMode && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <button
                  type="button"
                  onClick={() => setResetMode(true)}
                  className="text-xs text-blue-500 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[hsl(var(--harmony-gold))] to-[hsl(var(--music-red))]"
            disabled={isLoading}
          >
            {isLoading 
              ? resetMode ? "Sending reset link..." : "Signing in..." 
              : resetMode ? "Send Reset Link" : "Sign In"}
          </Button>

          {resetMode && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setResetMode(false)}
            >
              Back to login
            </Button>
          )}
        </form>

        {!resetMode && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => handleOAuthLogin('google')}
                className="hover:bg-white/10"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </Button>
              
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => handleOAuthLogin('spotify')}
                className="hover:bg-white/10"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.5 16.5C16.3 16.7 16 16.8 15.7 16.8C15.4 16.8 15.1 16.7 14.9 16.5C13.8 15.4 12.4 14.8 10.8 14.8C9.2 14.8 7.7 15.4 6.6 16.5C6.4 16.7 6.1 16.8 5.8 16.8C5.5 16.8 5.2 16.7 5 16.5C4.6 16.1 4.6 15.5 5 15.1C6.4 13.7 8.3 12.9 10.4 12.9C12.5 12.9 14.4 13.7 15.8 15.1C16.2 15.5 16.2 16.1 15.8 16.5H16.5ZM17.7 13.3C17.5 13.5 17.2 13.6 16.9 13.6C16.6 13.6 16.3 13.5 16.1 13.3C14.7 11.9 12.9 11.1 10.9 11.1C8.9 11.1 7.1 11.9 5.7 13.3C5.5 13.5 5.2 13.6 4.9 13.6C4.6 13.6 4.3 13.5 4.1 13.3C3.7 12.9 3.7 12.3 4.1 11.9C5.9 10.1 8.3 9.1 10.9 9.1C13.5 9.1 15.9 10.1 17.7 11.9C18.1 12.3 18.1 12.9 17.7 13.3ZM19.2 9.9C19 10.1 18.7 10.2 18.4 10.2C18.1 10.2 17.8 10.1 17.6 9.9C15.8 8.1 13.1 7.1 10.2 7.1C7.3 7.1 4.6 8.1 2.8 9.9C2.6 10.1 2.3 10.2 2 10.2C1.7 10.2 1.4 10.1 1.2 9.9C0.8 9.5 0.8 8.9 1.2 8.5C3.4 6.3 6.6 5.1 10.1 5.1C13.6 5.1 16.8 6.3 19 8.5C19.4 8.9 19.4 9.5 19 9.9H19.2Z"
                    fill="#1DB954"
                  />
                </svg>
              </Button>
              
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => handleOAuthLogin('github')}
                className="hover:bg-white/10"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                </svg>
              </Button>
            </div>
          </>
        )}

        <div className="text-center text-sm">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;