import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; 
import { 
  Mail, 
  Key,
  User, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus,
  Loader2, 
  Music 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; 
import { IconGoogle, IconSpotify } from "@/components/icons";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [formLoading, setFormLoading] = useState(false); 
  const [activeTab, setActiveTab] = useState("signup");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    user, 
    signIn, 
    signUp, 
    enforceAuthRouting, 
    resetPassword: requestPasswordReset
  } = useAuth(); 
  const { toast } = useToast();

  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    const tab = params.get('tab');

    if (mode === 'signin' || tab === 'login' || location.pathname === "/login") {
      setActiveTab("login");
    } else if (mode === 'signup' || tab === 'signup' || location.pathname === "/signup") {
      setActiveTab("signup");
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (user) {
      enforceAuthRouting(location.pathname);
    }
  }, [user, enforceAuthRouting, location.pathname]);

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePasswords = (pass: string, confirmPass?: string) => {
    if (pass.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return false;
    }
    if (confirmPass !== undefined && pass !== confirmPass) {
      setPasswordError("Passwords don't match.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email) || !validatePasswords(password, confirmPassword)) return;

    setIsLoading(true);
    try {
      await signUp(email, password);
      toast({
        title: "Verification Email Sent!",
        description: "Please check your email to verify your Lyra account.",
      });
      setActiveTab("login"); 
      setEmail(""); 
      setPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred during sign up.";
      toast({ title: "Sign Up Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email) || !validatePasswords(password)) return;

    setIsLoading(true);
    try {
      await signIn(email, password);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Invalid email or password.";
      toast({ title: "Sign In Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordResetRequest = async () => {
    if (!validateEmail(email)) return;
    setIsLoading(true);
    try {
      await requestPasswordReset(email);
      toast({
        title: "Password Reset Email Sent",
        description: "If an account exists for this email, you'll receive reset instructions.",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send reset email.";
      toast({ title: "Reset Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSocialAuth = async (provider: 'google' | 'spotify') => {
    setFormLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({ title: "Authentication Failed", description: error.message || `Could not sign in with ${provider}.`, variant: "destructive" });
      setFormLoading(false);
    }
  };

  const renderFormFields = (isSignUp: boolean) => (
    <>
      <div className="relative space-y-1">
        <label htmlFor={isSignUp ? "signup-email" : "login-email"} className="text-sm font-medium text-muted-foreground">Email</label>
        <Mail className="absolute left-3 top-1/2 transform -translate-y-0.5 h-5 w-5 text-muted-foreground" />
        <Input 
          id={isSignUp ? "signup-email" : "login-email"} 
          type="email" 
          placeholder="astronaut@galaxy.com" 
          value={email} 
          onChange={(e) => { setEmail(e.target.value); setEmailError(''); }} 
          className={`pl-10 sleek-input ${emailError ? 'border-destructive' : ''}`} 
          required 
        />
        {emailError && <p className="text-xs text-destructive pt-1">{emailError}</p>}
      </div>
      <div className="relative space-y-1">
        <label htmlFor={isSignUp ? "signup-password" : "login-password"} className="text-sm font-medium text-muted-foreground">Password</label>
        <Key className="absolute left-3 top-1/2 transform -translate-y-0.5 h-5 w-5 text-muted-foreground" />
        <Input 
          id={isSignUp ? "signup-password" : "login-password"} 
          type={showPassword ? "text" : "password"} 
          placeholder="Your Secret Starmap" 
          value={password} 
          onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }} 
          className={`pl-10 sleek-input ${passwordError && !isSignUp ? 'border-destructive' : ''}`} 
          required 
        />
        <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 transform -translate-y-0.5 h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </Button>
        {passwordError && !isSignUp && <p className="text-xs text-destructive pt-1">{passwordError}</p>}
      </div>
      {isSignUp && (
        <div className="relative space-y-1">
          <label htmlFor="confirm-password" className="text-sm font-medium text-muted-foreground">Confirm Password</label>
          <Key className="absolute left-3 top-1/2 transform -translate-y-0.5 h-5 w-5 text-muted-foreground" />
          <Input 
            id="confirm-password" 
            type={showConfirmPassword ? "text" : "password"} 
            placeholder="Confirm Your Starmap" 
            value={confirmPassword} 
            onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(''); }} 
            className={`pl-10 sleek-input ${passwordError && isSignUp ? 'border-destructive' : ''}`} 
            required 
          />
          <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 transform -translate-y-0.5 h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
          {passwordError && isSignUp && <p className="text-xs text-destructive pt-1">{passwordError}</p>}
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 cosmic-bg">
      <Card className="w-full max-w-md bg-card/70 backdrop-blur-md border-[hsl(var(--border)/0.2)] shadow-2xl shadow-[hsl(var(--primary)/0.1)] animate-fadeIn">
        <CardHeader className="text-center">
          <Link to="/" className="inline-block mb-4">
            <h1 className="lyra-logo text-6xl">
              <Music size={48} className="inline-block mr-2 drop-shadow-lg" />Lyra
            </h1>
          </Link>
          <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">Welcome to the Cosmos</CardTitle>
          <CardDescription className="text-muted-foreground">
            {activeTab === "signup" ? "Chart your course among the stars." : "Log in to continue your stellar journey."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/40 border border-[hsl(var(--border)/0.1)]">
              <TabsTrigger value="signup" className="data-[state=active]:bg-[hsl(var(--primary)/0.9)] data-[state=active]:text-primary-foreground data-[state=active]:shadow-md py-2.5 rounded-md">
                <UserPlus className="mr-2 h-4 w-4" /> Sign Up
              </TabsTrigger>
              <TabsTrigger value="login" className="data-[state=active]:bg-[hsl(var(--primary)/0.9)] data-[state=active]:text-primary-foreground data-[state=active]:shadow-md py-2.5 rounded-md">
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </TabsTrigger>
            </TabsList>
            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                {renderFormFields(true)}
                <Button type="submit" className="w-full sleek-button font-semibold py-3" disabled={isLoading || formLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />} Create Account
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="login" className="mt-6">
              <form onSubmit={handleSignIn} className="space-y-4">
                {renderFormFields(false)}
                <Button type="submit" className="w-full sleek-button font-semibold py-3" disabled={isLoading || formLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />} Sign In
                </Button>
                <div className="text-center mt-2">
                  <Button type="button" variant="link" className="text-sm text-[hsl(var(--accent))] hover:text-[hsl(var(--primary))] px-0" onClick={handlePasswordResetRequest} disabled={isLoading || formLoading || !email || emailError !== ''}>
                    Forgot Starmap? (Reset Password)
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex-col pt-6">
          <div className="relative w-full my-3">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[hsl(var(--border)/0.2)]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card/0 px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-3">
            <Button variant="outline" className="w-full border-[hsl(var(--border)/0.3)] hover:bg-muted/50 text-muted-foreground hover:text-foreground" onClick={() => handleSocialAuth('google')} disabled={formLoading || isLoading}>
              {formLoading && 'google' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <IconGoogle className="mr-2 h-5 w-5" />} Google
            </Button>
            <Button variant="outline" className="w-full border-[hsl(var(--border)/0.3)] hover:bg-muted/50 text-muted-foreground hover:text-foreground" onClick={() => handleSocialAuth('spotify')} disabled={formLoading || isLoading}>
              {formLoading && 'spotify' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <IconSpotify className="mr-2 h-5 w-5" />} Spotify
            </Button>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {activeTab === 'signup' ? 'Already have a cosmic pass? ' : 'New to the Lyra constellation? '}
            <button 
              onClick={() => setActiveTab(activeTab === 'signup' ? 'login' : 'signup')} 
              className="font-semibold text-[hsl(var(--accent))] hover:text-[hsl(var(--primary))] underline-offset-4 hover:underline"
            >
              {activeTab === 'signup' ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </CardFooter>
      </Card>
      {isDevelopment && (
        <div className="mt-8 p-4 bg-slate-800/50 rounded-lg text-xs text-slate-400 max-w-md w-full">
          <h3 className="font-semibold text-slate-300 mb-2">Dev Quick Auth:</h3>
          <p>Use <code className="bg-slate-700 px-1 rounded">test@example.com</code> / <code className="bg-slate-700 px-1 rounded">password</code> for quick login/signup.</p>
          {user && <p className="mt-1">Logged in as: {user.email}</p>}
        </div>
      )}
    </div>
  );
};

export default Auth;