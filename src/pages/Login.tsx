import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from 'framer-motion'; // Added Framer Motion
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import SocialLogins from '@/components/SocialLogins';

const indexImages = [
  '/index1.jpg',
  '/index10-1.jpeg',
  '/index10-2.jpeg',
  '/index10-3.jpeg',
  '/index10-4.jpeg',
  '/index10-6.jpeg',
  '/index11.jpeg',
  '/index12.jpeg',
  '/index13.jpeg',
  '/index3.jpg',
  '/index6.jpeg',
  '/index8-1.jpeg',
  '/index8-10.jpeg',
  '/index8-11.jpeg',
  '/index8-2.jpeg',
  '/index8-6.jpeg',
  '/index8-9.jpeg',
  '/index9.jpeg'
];

const Login = () => {
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * indexImages.length);
    setBackgroundImage(indexImages[randomIndex]);
  }, []);
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
    console.log('Starting sign-in process with email:', email);

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

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.time('LoginProcess');

    try {
      const { error: signInError, user } = await signIn(email, password);

      if (signInError) {
        console.error('Login: AuthContext.signIn reported an error:', signInError);
        toast({
          title: "Login failed",
          description: signInError.message || "An unexpected error occurred. Please check your credentials or try again.",
          variant: "destructive",
        });
      } else if (user) {
        console.log('Login: AuthContext.signIn successful for user ID:', user.id);
        toast({
          title: "Sign in successful",
          description: "Welcome back to Lyra! Redirecting...",
        });
      } else {
        console.warn('Login: AuthContext.signIn completed without error but no user object returned.');
        toast({
          title: "Login issue",
          description: "Authentication seemed to succeed but user data was not fully loaded. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) { 
      console.error('Login: Unexpected error during sign-in attempt:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      console.timeEnd('LoginProcess');
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none' }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <motion.div 
        className="glass-card p-8 rounded-2xl w-full max-w-md space-y-6 relative overflow-hidden z-10 bg-slate-800/70 backdrop-blur-md shadow-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <>
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">Lyra</h2>
            <h1 className="text-2xl font-semibold text-slate-100">
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
              <div>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 placeholder-slate-400 text-white"
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
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 placeholder-slate-400 text-white pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
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

          {/* Social Logins Separator (Optional) */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-600"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-800/70 px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            transition={{ duration: 0.5, delay: 0.4}} // Delay social logins slightly
          >
            <SocialLogins handleAuth={async (provider) => {
              setIsLoading(true);
              try {
                // Placeholder for actual social auth logic if it was removed or needs to be re-added
                // await handleSocialAuth(provider); 
                console.log('Social login with:', provider);
                toast({ title: 'Social Login', description: `${provider} login initiated.`});
              } catch (error) {
                console.error(`Login page: ${provider} auth error caught`, error);
                 toast({ title: 'Social Login Error', description: `Failed to login with ${provider}.`, variant: 'destructive'});
              }
              setIsLoading(false);
            }} isLoading={isLoading} gridCols="grid-cols-3" />
          </motion.div>

          <div className="mt-8 text-center text-sm">
            <p className="text-slate-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-purple-400 hover:text-purple-300 hover:underline">
                Sign up for Lyra
              </Link>
            </p>
          </div>
        </>
      </motion.div> {/* Closes the glass-card motion.div */}
    </div>
  );
};

export default Login;