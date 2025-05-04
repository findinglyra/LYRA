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
  const [resetMode, setResetMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signup");
  const [passwordError, setPasswordError] = useState("");
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPasswordError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      await signUp(email, password);
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account."
      });
      setActiveTab("login");
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: "Account creation failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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
        // After sign-in, checkAndRedirect will handle directing the user
        // to the create-profile page if they don't have a profile yet,
        // or to the match page if they already have one
        toast({
          title: "Sign in successful",
          description: "Welcome back to Lyra!"
        });
        await checkAndRedirect();
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication failed",
        description: error.message || "Invalid email or password",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="cosmic-bg min-h-screen flex flex-col items-center justify-center p-4">
      {/* Cosmic stars */}
      <div className="cosmic-stars"></div>
      
      {/* Constellation effects */}
      <div className="lyra-constellation top-20 right-20"></div>
      <div className="lyra-constellation bottom-40 left-10"></div>
      
      <div className="w-full max-w-md space-y-8 solid-overlay-card p-8 relative z-10 rounded-2xl">
        <Button
          variant="ghost"
          className="mb-4 hover:bg-[hsla(var(--pale-yellow),0.1)] text-white"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="flex justify-center mb-4">
          <MoonStar className="h-8 w-8 text-[hsl(var(--pale-yellow))]" />
        </div>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 bg-[rgba(5,10,30,0.4)]">
            <TabsTrigger 
              value="signup" 
              className="flex items-center gap-2 data-[state=active]:bg-[hsla(var(--primary),0.2)] data-[state=active]:text-white"
            >
              <UserPlus className="h-4 w-4" />
              Create Account
            </TabsTrigger>
            <TabsTrigger 
              value="login" 
              className="flex items-center gap-2 data-[state=active]:bg-[hsla(var(--primary),0.2)] data-[state=active]:text-white"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </TabsTrigger>
          </TabsList>
          
          {/* Sign Up Form */}
          <TabsContent value="signup" className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white">Join the constellation</h2>
              <p className="text-white/80">Begin your stellar journey with Lyra</p>
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
                    className="cosmic-input h-12 pl-10"
                    required
                  />
                </div>
                
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="cosmic-input h-12 pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-white/70"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="cosmic-input h-12 pl-10"
                    required
                  />
                </div>
                
                {passwordError && (
                  <p className="text-sm text-red-400 mt-1">{passwordError}</p>
                )}
              </div>

              <Button 
                className="w-full h-12 sleek-button" 
                size="lg" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <Star className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Begin Journey
                    <Star className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
              
              <div className="text-center text-sm">
                <div className="text-white/80">
                  Already have an account?{" "}
                  <button
                    type="button" 
                    className="text-[hsl(var(--primary))] hover:underline"
                    onClick={() => setActiveTab("login")}
                  >
                    Sign in
                  </button>
                </div>
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
                  onClick={() => {/* Auth providers will be added here */}}
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
              <h2 className="text-2xl font-bold text-white">Welcome back, explorer</h2>
              <p className="text-white/80">Continue your stellar adventure</p>
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
                      className="cosmic-input h-12 pl-10"
                      required
                    />
                  </div>
                </div>

                <Button 
                  className="w-full h-12 sleek-button" 
                  size="lg" 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <Star className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
                
                <div className="text-center mt-4">
                  <button
                    type="button"
                    className="text-[hsl(var(--primary))] hover:underline text-sm"
                    onClick={() => setResetMode(false)}
                  >
                    Back to sign in
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
                      className="cosmic-input h-12 pl-10"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="cosmic-input h-12 pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-white/70"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button 
                  className="w-full h-12 sleek-button" 
                  size="lg" 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <Star className="mr-2 h-4 w-4 animate-spin" />
                      Traveling...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Continue Journey
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
                
                <div className="flex justify-between text-sm">
                  <button
                    type="button"
                    className="text-[hsl(var(--primary))] hover:underline"
                    onClick={() => setResetMode(true)}
                  >
                    Lost your starmap?
                  </button>
                  
                  <button
                    type="button"
                    className="text-[hsl(var(--primary))] hover:underline"
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
                      onClick={() => {/* Auth providers will be added here */}}
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