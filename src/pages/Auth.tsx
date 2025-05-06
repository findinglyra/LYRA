import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Mail, 
  Key, 
  Music, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Star, 
  MoonStar, 
  User, 
  LogIn, 
  UserPlus,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false); // Overall form loading state
  const [activeTab, setActiveTab] = useState("signup");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, signIn, resetPassword, user, checkAndRedirect } = useAuth();
  const { toast } = useToast();

  const musicServices = [
    { name: "Spotify", color: "bg-[#1DB954]", icon: Music },
    { name: "Apple Music", color: "bg-[#FC3C44]", icon: Music },
    { name: "YouTube Music", color: "bg-[#FF0000]", icon: Music },
    { name: "Deezer", color: "bg-[#00C7F2]", icon: Music },
    { name: "Audiomack", color: "bg-[#FFA200]", icon: Music },
  ];

  useEffect(() => {
    // Check for mode parameter in the URL
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    
    if (mode === 'signin') {
      setActiveTab("login");
    } else if (location.pathname === "/signup") {
      setActiveTab("signup");
    } else if (location.pathname === "/login") {
      setActiveTab("login");
    }
  }, [location.pathname, location.search]);

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormLoading(true);
    setPasswordError("");
    setEmailError("");

    // Validate email format
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      setIsLoading(false);
      setFormLoading(false);
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      setIsLoading(false);
      setFormLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      setIsLoading(false);
      setFormLoading(false);
      return;
    }

    try {
      await signUp(email, password);
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account."
      });
      setActiveTab("login");
    } catch (error: unknown) {
      console.error('Authentication error:', error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast({
        title: "Account creation failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setFormLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormLoading(true);
    setEmailError("");

    // Validate email format if not in reset mode
    if (!resetMode && !validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      setIsLoading(false);
      setFormLoading(false);
      return;
    }

    try {
      if (resetMode) {
        await resetPassword(email);
        toast({
          title: "Reset link sent",
          description: "Check your email for password reset instructions"
        });
        setResetMode(false);
      } else {
        await signIn(email, password);
        toast({
          title: "Sign in successful",
          description: "Welcome back to Lyra!"
        });
        try {
          await checkAndRedirect();
        } catch (redirectError) {
          // Fallback if redirect fails
          console.error("Redirect failed:", redirectError);
          navigate('/');
        }
      }
    } catch (error: unknown) {
      console.error('Authentication error:', error);
      const errorMessage = error instanceof Error ? error.message : "Invalid email or password";
      toast({
        title: "Authentication failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setFormLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Handle social authentication
  const handleSocialAuth = (provider: string) => {
    toast({
      title: "Coming soon",
      description: `${provider} authentication will be available soon!`,
    });
    // When ready to implement:
    // supabase.auth.signInWithOAuth({ provider: provider.toLowerCase() });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative" style={{
      backgroundImage: "url('/index3.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      boxShadow: "inset 0 0 150px rgba(0,0,0,0.5)"
    }}>
      {/* Dark overlay with adjusted opacity for better contrast - no blur */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,20,40,0.5)] to-[rgba(5,15,35,0.6)] z-0"></div>
      
      <div className="w-full max-w-md space-y-8 bg-black/20 p-8 relative z-10 rounded-2xl border border-white/20">
        <Button
          variant="ghost"
          className="mb-4 hover:bg-white/10 text-white transition-colors"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="flex justify-center mb-4">
          <MoonStar className="h-8 w-8 text-primary" />
        </div>

        {formLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-2xl z-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-primary border-r-2 border-white/20 mb-2"></div>
              <p className="text-white text-sm">Processing...</p>
            </div>
          </div>
        )}

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 bg-black/30 border border-white/10">
            <TabsTrigger 
              value="signup" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(var(--primary))] data-[state=active]:to-[hsl(var(--accent))] data-[state=active]:text-white text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              Create Account
            </TabsTrigger>
            <TabsTrigger 
              value="login" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(var(--primary))] data-[state=active]:to-[hsl(var(--accent))] data-[state=active]:text-white text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </TabsTrigger>
          </TabsList>
          
          {/* Sign Up Form */}
          <TabsContent value="signup" className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white text-shadow-sm">Join the constellation</h2>
              <p className="text-white/80 text-shadow-sm">Begin your stellar journey with Lyra</p>
            </div>
            
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 pl-10 bg-black/30 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-0"
                    required
                  />
                  {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
                </div>
                
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-10 bg-black/30 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-0"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 pl-10 bg-black/30 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-0"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70 hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                  {passwordError && <p className="text-red-400 text-sm mt-1">{passwordError}</p>}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-white font-medium hover:shadow-glow transition-all"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
                <UserPlus className="ml-2 h-4 w-4" />
              </Button>
              
              <div className="text-center text-sm">
                <p className="text-white/70">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-primary hover:text-accent transition-colors font-medium"
                    onClick={() => setActiveTab("login")}
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>
            
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[hsla(var(--pale-yellow),0.2)]"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[hsla(var(--dark-blue),0.4)] px-2 text-white/70">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid gap-2">
              {musicServices.map((service) => (
                <Button
                  key={service.name}
                  variant="outline"
                  className="h-12 glass-card border-[hsla(var(--pale-yellow),0.2)] hover:border-[hsla(var(--pale-yellow),0.4)] text-white"
                  type="button"
                  onClick={() => handleSocialAuth(service.name)}
                >
                  <service.icon className="mr-2 h-4 w-4" />
                  Continue with {service.name}
                </Button>
              ))}
            </div>
          </TabsContent>
          
          {/* Login Form */}
          <TabsContent value="login" className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white text-shadow-sm">Welcome Back</h2>
              <p className="text-white/80 text-shadow-sm">Continue your cosmic journey</p>
            </div>
            
            {resetMode ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 pl-10 bg-black/30 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-0"
                      required
                    />
                    {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-white font-medium hover:shadow-glow transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
                  <Mail className="ml-2 h-4 w-4" />
                </Button>
                
                <div className="text-center mt-4">
                  <button
                    type="button"
                    className="text-primary hover:text-accent transition-colors font-medium"
                    onClick={() => setResetMode(false)}
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 pl-10 bg-black/30 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-0"
                      required
                    />
                    {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
                  </div>
                  
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pl-10 bg-black/30 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-0"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-white font-medium hover:shadow-glow transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                  <LogIn className="ml-2 h-4 w-4" />
                </Button>
                
                <div className="flex justify-between text-sm">
                  <button
                    type="button"
                    className="text-primary hover:text-accent transition-colors font-medium"
                    onClick={() => setResetMode(true)}
                  >
                    Forgot password?
                  </button>
                  <button
                    type="button"
                    className="text-primary hover:text-accent transition-colors font-medium"
                    onClick={() => setActiveTab("signup")}
                  >
                    Create account
                  </button>
                </div>
              </form>
            )}
            
            {!resetMode && (
              <>
                <div className="relative mt-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[hsla(var(--pale-yellow),0.2)]"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[hsla(var(--dark-blue),0.4)] px-2 text-white/70">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid gap-2">
                  {musicServices.map((service) => (
                    <Button
                      key={service.name}
                      variant="outline"
                      className="h-12 glass-card border-[hsla(var(--pale-yellow),0.2)] hover:border-[hsla(var(--pale-yellow),0.4)] text-white"
                      type="button"
                      onClick={() => handleSocialAuth(service.name)}
                    >
                      <service.icon className="mr-2 h-4 w-4" />
                      Continue with {service.name}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;