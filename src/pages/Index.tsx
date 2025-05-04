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
  User,
  Clock,
  Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen flex flex-col">
      {/* Cosmic effects only in the main hero section */}
      <div className="cosmic-bg relative">
        <div className="cosmic-stars opacity-70"></div>
        <div className="lyra-constellation top-20 right-20 opacity-60"></div>
        <div className="lyra-constellation bottom-40 left-10 opacity-60"></div>
        
        {/* Header section */}
        <header className="w-full px-4 sm:px-8 py-4 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2">
            <span className="lyra-logo text-2xl bg-black/20 px-3 py-1 rounded-lg backdrop-blur-md">Lyra</span>
          </div>
          
          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-white font-medium">
            <a href="#mission" className="hover:text-[hsl(var(--primary))] transition-colors px-3 py-1 rounded-lg backdrop-blur-sm bg-black/10 border border-white/10 text-sm flex items-center">
              <Star className="mr-1.5 h-3.5 w-3.5" />
              Mission
            </a>
            <a href="#features" className="hover:text-[hsl(var(--primary))] transition-colors px-3 py-1 rounded-lg backdrop-blur-sm bg-black/10 border border-white/10 text-sm flex items-center">
              <Music className="mr-1.5 h-3.5 w-3.5" />
              Features
            </a>
            <a href="#support" className="hover:text-[hsl(var(--primary))] transition-colors px-3 py-1 rounded-lg backdrop-blur-sm bg-black/10 border border-white/10 text-sm flex items-center">
              <Mail className="mr-1.5 h-3.5 w-3.5" />
              Support
            </a>
            <a href="#safety" className="hover:text-[hsl(var(--primary))] transition-colors px-3 py-1 rounded-lg backdrop-blur-sm bg-black/10 border border-white/10 text-sm flex items-center">
              <Shield className="mr-1.5 h-3.5 w-3.5" />
              Safety
            </a>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-[hsl(var(--primary))] bg-black/20 backdrop-blur-md rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Auth buttons */}
          <div className="hidden md:flex gap-2">
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
                className="sleek-button text-sm md:text-base px-4 md:px-6 py-1 md:py-2 h-auto rounded-lg shadow-md text-white"
              >
                <span className="hidden sm:inline">Sign In / Sign Up</span>
                <span className="sm:hidden">Sign In</span>
                <User className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </header>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-black/90 backdrop-blur-lg z-50 border-b border-white/10">
            <div className="p-4 flex flex-col gap-2">
              <a 
                href="#mission" 
                className="text-white hover:text-[hsl(var(--primary))] py-2 px-4 rounded-lg flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Star className="mr-2 h-4 w-4" />
                Mission
              </a>
              <a 
                href="#features" 
                className="text-white hover:text-[hsl(var(--primary))] py-2 px-4 rounded-lg flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Music className="mr-2 h-4 w-4" />
                Features
              </a>
              <a 
                href="#support" 
                className="text-white hover:text-[hsl(var(--primary))] py-2 px-4 rounded-lg flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Mail className="mr-2 h-4 w-4" />
                Support
              </a>
              <a 
                href="#safety" 
                className="text-white hover:text-[hsl(var(--primary))] py-2 px-4 rounded-lg flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield className="mr-2 h-4 w-4" />
                Safety
              </a>
              {user ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    supabase.auth.signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-white hover:text-[hsl(var(--primary))] bg-black/20 backdrop-blur-md rounded-lg text-sm px-4 py-2 mt-2"
                >
                  Sign Out
                </Button>
              ) : (
                <Button
                  size="default"
                  onClick={() => {
                    navigate("/auth");
                    setMobileMenuOpen(false);
                  }}
                  className="sleek-button text-sm px-4 py-2 rounded-lg shadow-md text-white mt-2"
                >
                  Sign In / Sign Up
                  <User className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
        
        {/* Main hero content area */}
        <main className="flex-1 flex flex-col items-center justify-center text-center py-16 sm:py-24 px-4 relative z-10">
          <div className="w-full max-w-3xl mx-auto solid-overlay-card p-4 sm:p-6 md:p-8 rounded-2xl glow-card">
            {/* Hero section with logo and tagline */}
            <div className="flex flex-col items-center">
              <div className="mb-4 md:mb-6">
                <h1 className="lyra-logo text-4xl sm:text-5xl mb-2 md:mb-4">Lyra</h1>
              </div>
              
              {/* Main headline with theme color */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 md:mb-6 text-white sleek-heading">
                Where <span className="text-[hsl(var(--primary))]">Music</span> and the
                <span className="text-[hsl(var(--accent))]"> Stars</span> Connect
              </h2>
                          
              {/* Orpheus AI description */}
              <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-6 md:mb-8 text-white/90 sleek-text">
              OrpheusAI powered by your music preference and real-time satellite data.
              </p>

              {/* Call to action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center w-full px-2">
                <Button
                  size="default"
                  onClick={() => navigate("/interest")}
                  className="sleek-button text-sm md:text-base px-4 md:px-6 py-1 md:py-2 h-auto rounded-lg shadow-md text-white w-full sm:w-auto"
                >
                  Join Waitlist
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
                
                {!user && (
                  <Button
                    size="default"
                    onClick={() => navigate("/auth")}
                    className="sleek-button text-sm md:text-base px-4 md:px-6 py-1 md:py-2 h-auto rounded-lg shadow-md text-white w-full sm:w-auto"
                  >
                    <span className="hidden sm:inline">Sign In / Sign Up</span>
                    <span className="sm:hidden">Sign In</span>
                    <User className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mission section */}
      <section id="mission" className="w-full py-16 sm:py-24 relative" style={{
        backgroundImage: "url('/lyra\\ image.png')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(5,10,30,0.85)] to-[rgba(10,15,40,0.9)] z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 sleek-heading text-white">Our Mission</h2>
            
            <p className="text-base text-white/90 mb-8 leading-relaxed">
              At Lyra, we believe the universe speaks to us through music. Our mission is to harness the cosmic 
              connection between music preferences and astrological influences to create the most resonant and 
              meaningful connections between people.
            </p>
            
            <p className="text-base text-white/90 mb-8 leading-relaxed">
              Through our advanced OrpheusAI technology, we analyze patterns in music taste, astrological data, 
              and personality traits to recommend connections that truly resonate on both human and cosmic levels.
            </p>
          </div>
        </div>
      </section>

      {/* Features section with different background */}
      <section id="features" className="w-full py-16 sm:py-24 relative" style={{
        backgroundImage: "url('/image1.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,20,40,0.8)] to-[rgba(5,15,35,0.9)] z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 sleek-heading text-white">How Lyra Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Music,
                title: "Music Matching",
                description: "Our AI model Orpheus analyzes your music tastes to find matches with compatible listening habits.",
              },
              {
                icon: Star,
                title: "Stellar Aligning",
                description: "With real time planetary positional data, Orpheus aligns your music preferences with the stars for the most resonant connections.",
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

      {/* Countdown section with different background */}
      <section className="w-full py-16 sm:py-24 relative" style={{
        backgroundImage: "url('/stars-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(15,25,50,0.8)] to-[rgba(10,20,45,0.9)] z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 sleek-heading text-white">Launching In</h2>
            
            <CountdownTimer launchDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)} />
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mt-12">
              <Button
                size="default"
                onClick={() => navigate("/interest")}
                className="sleek-button text-sm md:text-base px-4 md:px-6 py-1 md:py-2 h-auto rounded-lg shadow-md text-white w-full sm:w-auto"
              >
                Join Waitlist
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Support section */}
      <section id="support" className="w-full py-16 sm:py-24 relative bg-gradient-to-br from-[rgba(20,30,60,1)] to-[rgba(40,50,80,1)]">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 sleek-heading text-white">Support</h2>
            
            <p className="text-base text-white/90 mb-8 leading-relaxed">
              We're here to help you throughout your cosmic journey. Whether you have questions about 
              how our matching algorithm works or need assistance with your account, our support team 
              is ready to provide guidance.
            </p>
            
            <Button
              size="default"
              onClick={() => window.location.href = "mailto:support@lyra-app.com"}
              className="sleek-button text-sm md:text-base px-4 md:px-6 py-1 md:py-2 h-auto rounded-lg shadow-md text-white"
            >
              Contact Support
              <Mail className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Safety section */}
      <section id="safety" className="w-full py-16 sm:py-24 relative" style={{
        backgroundImage: "url('/gettyimages-678545430-2048x2048.png')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,10,20,0.9)] to-[rgba(5,15,25,0.95)] z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 sleek-heading text-white">Safety</h2>
            
            <p className="text-base text-white/90 mb-8 leading-relaxed">
              Your safety and privacy are our highest priorities. Lyra implements industry-leading security 
              measures to protect your data and ensure a safe environment for making connections.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-black/20 backdrop-blur-md p-6 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold mb-3 text-white">Data Protection</h3>
                <p className="text-sm text-white/80">
                  We use end-to-end encryption and follow strict data protection protocols 
                  to safeguard your personal information and music preferences.
                </p>
              </div>
              
              <div className="bg-black/20 backdrop-blur-md p-6 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold mb-3 text-white">Community Guidelines</h3>
                <p className="text-sm text-white/80">
                  Our community is built on respect and authenticity. We have zero tolerance 
                  for harassment or inappropriate behavior.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer section */}
      <footer className="w-full py-8 bg-black/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/60 text-sm"> 2025 Lyra. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Countdown Timer Component
const CountdownTimer = ({ launchDate }: { launchDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = launchDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    // Calculate immediately
    calculateTimeLeft();
    
    // Then update every second
    const timer = setInterval(calculateTimeLeft, 1000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [launchDate]);

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full max-w-md">
        {/* Days */}
        <div className="flex flex-col items-center">
          <div className="bg-black/30 backdrop-blur-md rounded-lg p-2 sm:p-4 w-full text-center border border-white/10">
            <span className="text-2xl sm:text-4xl font-bold text-white">{timeLeft.days}</span>
          </div>
          <span className="text-xs sm:text-sm mt-1 text-white/80">Days</span>
        </div>
        
        {/* Hours */}
        <div className="flex flex-col items-center">
          <div className="bg-black/30 backdrop-blur-md rounded-lg p-2 sm:p-4 w-full text-center border border-white/10">
            <span className="text-2xl sm:text-4xl font-bold text-white">{timeLeft.hours}</span>
          </div>
          <span className="text-xs sm:text-sm mt-1 text-white/80">Hours</span>
        </div>
        
        {/* Minutes */}
        <div className="flex flex-col items-center">
          <div className="bg-black/30 backdrop-blur-md rounded-lg p-2 sm:p-4 w-full text-center border border-white/10">
            <span className="text-2xl sm:text-4xl font-bold text-white">{timeLeft.minutes}</span>
          </div>
          <span className="text-xs sm:text-sm mt-1 text-white/80">Minutes</span>
        </div>
        
        {/* Seconds */}
        <div className="flex flex-col items-center">
          <div className="bg-black/30 backdrop-blur-md rounded-lg p-2 sm:p-4 w-full text-center border border-white/10">
            <span className="text-2xl sm:text-4xl font-bold text-white">{timeLeft.seconds}</span>
          </div>
          <span className="text-xs sm:text-sm mt-1 text-white/80">Seconds</span>
        </div>
      </div>
      
      <div className="flex items-center mt-4 mb-2">
        <Clock className="h-4 w-4 mr-2 text-[hsl(var(--primary))]" />
        <span className="text-xs sm:text-sm text-white/80">Until Official Launch</span>
      </div>
    </div>
  );
};

export default Index;
