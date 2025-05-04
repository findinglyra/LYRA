import { useState, useEffect } from "react";
import { 
  Button, 
  buttonVariants 
} from "@/components/ui/button";
import { 
  ArrowRight, 
  BarChart3, 
  ChevronRight, 
  Loader2, 
  LucideMusic, 
  Mail, 
  Menu, 
  Music, 
  Sparkles, 
  Star, 
  User 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // Fetch user on component mount
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    
    checkUser();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    // Cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    // Main container with cosmic background
    <div className="cosmic-bg min-h-screen flex flex-col">
      {/* Cosmic stars */}
      <div className="cosmic-stars"></div>
      
      {/* Constellation effects */}
      <div className="lyra-constellation top-20 right-20"></div>
      <div className="lyra-constellation bottom-40 left-10"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        {/* Header section */}
        <header className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="lyra-logo text-2xl bg-black/20 px-3 py-1 rounded-lg backdrop-blur-md">Lyra</span>
          </div>
          
          {/* Navigation links */}
          <nav className="hidden md:flex gap-6 text-white font-medium">
            <a href="#features" className="hover:text-[hsl(var(--primary))] transition-colors px-3 py-1 rounded-lg backdrop-blur-sm bg-black/10 border border-white/10 text-sm">Features</a>
          </nav>
          
          {/* Auth buttons */}
          <div className="flex gap-2">
            {user ? (
              <Button
                variant="ghost"
                onClick={() => supabase.auth.signOut()}
                className="text-white hover:text-[hsl(var(--primary))] bg-black/20 backdrop-blur-md rounded-lg text-sm px-3 py-1 h-auto"
              >
                Sign Out
              </Button>
            ) : (
              <Button
                size="default"
                onClick={() => navigate("/auth")}
                className="sleek-button text-base px-6 py-2 h-auto rounded-lg shadow-md text-white"
              >
                Sign In / Sign Up
                <User className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 flex flex-col items-center justify-center text-center pb-12 pt-8">
          <div 
            className="max-w-3xl mx-auto solid-overlay-card p-8 rounded-2xl glow-card"
          >
            {/* Hero section with logo and tagline */}
            <div className="flex flex-col items-center">
              <div className="mb-6">
                <h1 className="lyra-logo text-5xl mb-4">Lyra</h1>
              </div>
              
              {/* Main headline with theme color */}
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6 text-white sleek-heading">
                Where <span className="text-[hsl(var(--primary))]">Music</span> and the
                <span className="text-[hsl(var(--accent))]"> Stars</span> Connect
              </h2>
                          
              {/* Orpheus AI description */}
              <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8 text-white/90 sleek-text">
                Let Orpheus, your matchmaking AI, find your perfect match powered by your music preferences 
                and real-time data creating the most resonant connections.
              </p>

              {/* Call to action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="default"
                  onClick={() => navigate("/interest")}
                  className="sleek-button text-base px-6 py-2 h-auto rounded-lg shadow-md text-white"
                >
                  Join Waitlist
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
                
                {!user && (
                  <Button
                    size="default"
                    onClick={() => navigate("/auth")}
                    className="sleek-button text-base px-6 py-2 h-auto rounded-lg shadow-md text-white"
                  >
                    Sign In / Sign Up
                    <User className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Features section */}
        <section id="features" className="py-12">
          <div className="max-w-3xl mx-auto solid-overlay-card p-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-center mb-10 sleek-heading text-white">How Lyra Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Music,
                  title: "Music Matching",
                  description: "Our AI model Orpheus analyzes your music tastes to find matches with compatible listening habits.",
                },
                {
                  icon: Star,
                  title: "Stellar Aligning",
                  description: "With real time planetary positional data, Orpheus align your music preferences with the stars for the most resonant connections.",
                },
                {
                  icon: BarChart3,
                  title: "Compatibility Analysis",
                  description: "Detailed insights about your compatibility with potential matches based on musical and astrological data.",
                },
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="solid-overlay-card p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-[rgba(255,255,255,0.15)] bg-black/10"
                >
                  <div className="mb-4 p-3 inline-block rounded-full bg-[rgba(120,180,255,0.15)]">
                    <feature.icon className="h-6 w-6 text-[hsl(var(--primary))]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 sleek-heading text-white">{feature.title}</h3>
                  <p className="text-sm text-white/90 sleek-text leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Get started section */}
        <section className="py-12">
          <div className="max-w-3xl mx-auto solid-overlay-card p-8 rounded-2xl glow-card">
            <h2 className="text-3xl font-bold text-center mb-10 sleek-heading text-white">Get Started</h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="default"
                onClick={() => navigate("/interest")}
                className="sleek-button text-base px-6 py-2 h-auto rounded-lg shadow-md text-white"
              >
                Join Waitlist
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 text-center text-white/70">
          <p className="text-sm"> 2025 Lyra. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
