import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Key, Eye, EyeOff, Music, Star, MoonStar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import SocialLogins from '@/components/SocialLogins';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const { signUp, handleSocialAuth } = useAuth();
  const { toast } = useToast();

  const handleEmailSignup = async (e: React.FormEvent) => {
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
        title: "Verification email sent",
        description: "Please check your email to verify your account",
      });
      navigate("/login");
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Signup failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
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
          <h1 className="text-2xl font-bold">Create Your Account</h1>
          <p className="text-muted-foreground text-sm">
            Begin your stellar musical journey
          </p>
        </div>

        <form onSubmit={handleEmailSignup} className="space-y-4">
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

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
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

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[hsl(var(--harmony-gold))] to-[hsl(var(--music-red))]"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        {/* Social Logins Section */}
        <div className="relative pt-4">
          <div className="absolute inset-x-0 top-4 flex items-center">
            <div className="w-full border-t border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="mt-4">
          <SocialLogins handleAuth={async (provider) => {
            setIsLoading(true);
            try {
              await handleSocialAuth(provider);
              // Supabase handles redirection, no client-side navigation needed here for success
            } catch (error) {
              // Error is already toasted by handleSocialAuth in context
              console.error(`Signup page: ${provider} auth error caught`, error);
            }
            setIsLoading(false);
          }} isLoading={isLoading} gridCols="grid-cols-3" />
        </div>

        <div className="text-center text-sm">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;