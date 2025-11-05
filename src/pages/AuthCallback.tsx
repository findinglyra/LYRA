import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { validateSession, enforceAuthRouting } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the auth code from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        // Check for errors first
        const errorDescription = hashParams.get("error_description") || 
                                queryParams.get("error_description") || 
                                hashParams.get("error") || 
                                queryParams.get("error");
        
        if (errorDescription) {
          console.error("Auth callback error:", errorDescription);
          setError(errorDescription);
          // Redirect to login after a delay
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        // Process the OAuth response
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error.message);
          setError(error.message);
          setTimeout(() => navigate("/login"), 3000);
          return;
        }
        
        if (data.session) {
          // Validate the session
          const isValid = await validateSession();
          
          if (isValid) {
            console.log("Auth successful, redirecting...");
            toast({
              title: "Email Confirmed! 🎉",
              description: "Welcome to LYRA! Let's complete your profile.",
            });
            // Check for existing profile and redirect accordingly
            await enforceAuthRouting(window.location.pathname);
          } else {
            console.error("Invalid session after OAuth");
            setError("Authentication failed. Please try again.");
            setTimeout(() => navigate("/login"), 3000);
          }
        } else {
          // If there's no session, but also no error, this is unusual
          console.warn("No session or error in callback");
          setError("No session obtained. Please try signing in again.");
          setTimeout(() => navigate("/login"), 3000);
        }
      } catch (err) {
        console.error("Unexpected error in auth callback:", err);
        setError(typeof err === 'object' && err !== null && 'message' in err 
          ? String(err.message) 
          : "An unexpected error occurred");
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, validateSession, enforceAuthRouting, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-4 text-center">
        {error ? (
          <>
            <h2 className="text-xl font-semibold text-red-500">Authentication Error</h2>
            <p className="text-gray-400">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </>
        ) : (
          <>
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <h2 className="text-xl font-semibold">Completing authentication...</h2>
            <p className="text-gray-400">Please wait while we sign you in</p>
          </>
        )}
      </div>
    </div>
  );
}
