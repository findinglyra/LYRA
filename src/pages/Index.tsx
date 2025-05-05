import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  Music, 
  BarChart3, 
  Mail,
  Sparkles,
  User,
  Menu,
  Shield,
  Heart,
  ScrollText,
  Clock,
  Download,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Copyright,
  ChevronRight,
  Linkedin
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get and set user information
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

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Function to scroll to section
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050E1D] text-white font-sans">
      {/* Professional Announcement Bar with Gradient Background */}
      <div className="w-full py-2 px-4 text-center text-white text-sm bg-gradient-to-r from-[#1a2a4a] via-[#2a3a6a] to-[#1a2a4a] border-b border-white/10">
        <div className="container mx-auto flex items-center justify-center">
          <Sparkles className="h-4 w-4 mr-2 text-[hsl(var(--primary))]" />
          <span>Launching Summer 2025 — <a href="/interest" className="underline hover:text-[hsl(var(--primary))] transition-colors">Join the waitlist</a> for early access</span>
        </div>
      </div>
      
      {/* Professional Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/30 border-b border-white/10 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="flex items-center">
                <h1 className="text-2xl font-bold text-white lyra-logo">Lyra</h1>
              </a>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <button 
                  onClick={() => scrollToSection('mission')} 
                  className="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Mission
                </button>
                <button 
                  onClick={() => scrollToSection('features')} 
                  className="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('support')} 
                  className="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Support
                </button>
                <button 
                  onClick={() => scrollToSection('safety')} 
                  className="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Safety
                </button>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex items-center">
              <Button 
                onClick={() => navigate('/interest')}
                className="mr-3 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-white px-4 py-2 rounded-md text-sm shadow-glow transition-all hover:shadow-glow-intense"
              >
                Join Waitlist
              </Button>
              
              {!user ? (
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md text-sm transition-colors"
                >
                  Sign In
                </Button>
              ) : (
                <Button 
                  onClick={() => supabase.auth.signOut()}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md text-sm transition-colors"
                >
                  Sign Out
                </Button>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="mobile-menu-button inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
          
          {/* Mobile Navigation - Hidden by default */}
          {mobileMenuOpen && (
            <div className="md:hidden mobile-menu">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <button 
                  onClick={() => {
                    scrollToSection('mission');
                    setMobileMenuOpen(false);
                  }} 
                  className="block text-white hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  Mission
                </button>
                <button 
                  onClick={() => {
                    scrollToSection('features');
                    setMobileMenuOpen(false);
                  }} 
                  className="block text-white hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  Features
                </button>
                <button 
                  onClick={() => {
                    scrollToSection('support');
                    setMobileMenuOpen(false);
                  }} 
                  className="block text-white hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  Support
                </button>
                <button 
                  onClick={() => {
                    scrollToSection('safety');
                    setMobileMenuOpen(false);
                  }} 
                  className="block text-white hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  Safety
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      
      {/* Main hero content area */}
      <main className="flex-1 flex flex-col items-center justify-center text-center py-12 sm:py-16 md:py-24 relative" style={{
        backgroundImage: "url('/index6.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "inset 0 0 150px rgba(0,0,0,0.5)"
      }}>
        {/* Lighter overlay without blur for clearer background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,15,40,0.5)] to-[rgba(5,10,30,0.6)] z-0"></div>
        
        <div className="w-full max-w-3xl mx-auto p-3 sm:p-6 rounded-xl sm:rounded-2xl relative z-10 bg-black/20 border border-white/20">
          {/* Hero section with logo and tagline */}
          <div className="flex flex-col items-center">
            <div className="mb-4 md:mb-6">
              <h1 className="lyra-logo text-4xl sm:text-5xl mb-2 md:mb-4">Lyra</h1>
            </div>
            
            {/* Main headline with enhanced contrast */}
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4 md:mb-6 text-white sleek-heading text-shadow-lg">
              Where <span className="text-primary">Music</span> and the
              <span className="text-accent"> Stars</span> Connect
            </h2>
                          
            {/* Orpheus AI description with improved contrast */}
            <p className="text-sm sm:text-base text-white mb-4 sm:mb-6 md:mb-8 sleek-text text-shadow-sm">
              OrpheusAI powered by your music preference and real-time satellite data.
            </p>

            {/* Call to action buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center w-full px-2">
              <Button
                size="default"
                onClick={() => navigate("/interest")}
                className="mobile-btn sm:sleek-button text-sm md:text-base px-3 sm:px-4 md:px-6 py-1 md:py-2 h-auto rounded-lg shadow-md text-white w-full sm:w-auto touch-target hover:bg-white/10"
              >
                Join Waitlist
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
              
              {!user && (
                <Button
                  size="default"
                  onClick={() => navigate("/auth")}
                  className="mobile-btn sm:sleek-button text-sm md:text-base px-3 sm:px-4 md:px-6 py-1 md:py-2 h-auto rounded-lg shadow-md text-white w-full sm:w-auto touch-target hover:bg-white/10"
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
      
      {/* Mission section */}
      <section id="mission" className="w-full py-12 sm:py-16 md:py-24 relative" style={{
        backgroundImage: "url('/index11.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "inset 0 0 150px rgba(0,0,0,0.5)"
      }}>
        {/* Lighter overlay for better image clarity */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(5,10,30,0.3)] to-[rgba(10,15,40,0.4)] z-0"></div>
        
        <div className="container mx-auto px-3 sm:px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center bg-black/15 p-8 rounded-xl border border-white/20">
            <h2 className="text-xl xs:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-8 sleek-heading text-white text-shadow-lg">Our Mission</h2>
            
            <p className="text-sm sm:text-base text-white mb-4 sm:mb-8 leading-relaxed text-shadow-sm">
              At Lyra, we believe the universe speaks to us through music. Our mission is to harness the cosmic 
              connection between music preferences and astrological influences to create the most resonant and 
              meaningful connections between people.
            </p>
            
            <p className="text-sm sm:text-base text-white mb-4 sm:mb-8 leading-relaxed text-shadow-sm">
              Through our advanced OrpheusAI technology, we analyze patterns in music taste, astrological data, 
              and personality traits to recommend connections that truly resonate on both human and cosmic levels.
            </p>
          </div>
        </div>
      </section>

      {/* Features section with different background */}
      <section id="features" className="w-full py-12 sm:py-16 md:py-24 relative overflow-hidden" style={{
        backgroundImage: "url('/index3.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "inset 0 0 150px rgba(0,0,0,0.5)"
      }}>
        {/* Lighter overlay without blur for clearer background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,20,40,0.5)] to-[rgba(5,15,35,0.6)] z-0"></div>
        
        <div className="container mx-auto px-3 sm:px-4 relative z-10">
          <div className="bg-black/15 p-6 rounded-xl border border-white/20 mb-8 sm:mb-12 max-w-3xl mx-auto">
            <h2 className="text-xl xs:text-2xl md:text-3xl font-bold text-center sleek-heading text-white text-shadow-lg">How Lyra Works</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 md:gap-8">
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
                className="solid-overlay-card p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-white/15 bg-black/15 hover:bg-black/20 hover:scale-[1.02] transform transition-all"
              >
                <div className="mb-4 p-3 inline-block rounded-full bg-[rgba(120,180,255,0.15)]">
                  <feature.icon className="h-6 w-6 text-[hsl(var(--primary))]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 sleek-heading text-white text-shadow-sm">{feature.title}</h3>
                <p className="text-sm text-white sleek-text leading-relaxed text-shadow-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countdown section with different background */}
      <section className="w-full py-12 sm:py-16 md:py-24 relative overflow-hidden" style={{
        backgroundImage: "url('/index10.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "inset 0 0 150px rgba(0,0,0,0.5)"
      }}>
        {/* Lighter overlay without blur for clearer background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(15,25,50,0.5)] to-[rgba(10,20,45,0.6)] z-0"></div>
        
        <div className="container mx-auto px-3 sm:px-4 relative z-10">
          <div className="max-w-3xl mx-auto bg-black/15 p-8 rounded-xl border border-white/20">
            <h2 className="text-xl xs:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-10 sleek-heading text-white text-shadow-lg">Launching In</h2>
            
            <CountdownTimer />
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center mt-8 sm:mt-12">
              <Button
                size="default"
                onClick={() => navigate("/interest")}
                className="mobile-btn sm:sleek-button text-sm md:text-base px-3 sm:px-4 md:px-6 py-1 md:py-2 h-auto rounded-lg shadow-md text-white w-full sm:w-auto touch-target hover:bg-white/10"
              >
                Join Waitlist
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Support section */}
      <section id="support" className="w-full py-12 sm:py-16 md:py-24 relative overflow-hidden" style={{
        backgroundImage: "url('/index1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
        backgroundAttachment: "fixed",
        boxShadow: "inset 0 0 150px rgba(0,0,0,0.5)"
      }}>
        {/* Lighter overlay without blur for clearer background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(20,30,60,0.5)] to-[rgba(40,50,80,0.6)] z-0"></div>
        
        <div className="container mx-auto px-3 sm:px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center bg-black/15 p-8 rounded-xl border border-white/20">
            <h2 className="text-xl xs:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-8 sleek-heading text-white text-shadow-lg">Support</h2>
            
            <p className="text-sm sm:text-base text-white mb-4 sm:mb-8 leading-relaxed text-shadow-sm">
              We're here to help you throughout your cosmic journey. Whether you have questions about 
              how our matching algorithm works or need assistance with your account, our support team 
              is ready to provide guidance.
            </p>
            
            <Button
              size="default"
              onClick={() => window.location.href = "mailto:support@lyra-app.com"}
              className="mobile-btn sm:sleek-button text-sm md:text-base px-3 sm:px-4 md:px-6 py-1 md:py-2 h-auto rounded-lg shadow-md text-white touch-target hover:bg-white/10"
            >
              Contact Support
              <Mail className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Safety section */}
      <section id="safety" className="w-full py-12 sm:py-16 md:py-24 relative overflow-hidden" style={{
        backgroundImage: "url('/index9.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        boxShadow: "inset 0 0 150px rgba(0,0,0,0.5)"
      }}>
        {/* Dark overlay with adjusted opacity for optimal contrast - no blur */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,10,20,0.5)] to-[rgba(5,15,25,0.6)] z-0"></div>
        
        <div className="container mx-auto px-3 sm:px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center bg-black/15 p-8 rounded-xl border border-white/20">
            <h2 className="text-xl xs:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-8 sleek-heading text-white text-shadow-lg">Safety</h2>
            
            <p className="text-sm sm:text-base text-white mb-4 sm:mb-8 leading-relaxed text-shadow-sm">
              Your safety and privacy are our highest priorities. Lyra implements industry-leading security 
              measures to protect your data and ensure a safe environment for making connections.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left">
              <div className="bg-black/20 p-4 sm:p-6 rounded-xl border border-white/10 hover:border-white/30 transition-all transform hover:translate-y-[-2px]">
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-white text-shadow-sm">Data Protection</h3>
                <p className="text-xs sm:text-sm text-white/90">
                  We use end-to-end encryption and follow strict data protection protocols 
                  to safeguard your personal information and music preferences.
                </p>
              </div>
              
              <div className="bg-black/20 p-4 sm:p-6 rounded-xl border border-white/10 hover:border-white/30 transition-all transform hover:translate-y-[-2px]">
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-white text-shadow-sm">Community Guidelines</h3>
                <p className="text-xs sm:text-sm text-white/90">
                  Our community is built on respect and authenticity. We have zero tolerance 
                  for harassment or inappropriate behavior.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Enhanced with multiple sections, links, and app store downloads */}
      <footer className="w-full text-white pt-6 pb-0 safe-area-padding border-t border-white/10 mb-0" style={{
        backgroundImage: "linear-gradient(to bottom, rgba(5, 14, 29, 0.7), rgba(10, 20, 38, 0.8)), url('/index3.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
        backgroundBlendMode: "overlay",
        boxShadow: "inset 0 0 150px rgba(0,0,0,0.7)",
        marginBottom: 0
      }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
            {/* Logo and description */}
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="lyra-logo text-2xl">Lyra</span>
              </div>
              <p className="text-sm text-white/70 max-w-xs">
                Connecting people through the cosmic harmony of music and astrology,
                powered by OrpheusAI technology.
              </p>
              
              {/* Social media links */}
              <div className="flex space-x-4 pt-2">
                <a href="https://instagram.com" className="text-white/70 hover:text-white transition-colors" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="https://twitter.com" className="text-white/70 hover:text-white transition-colors" aria-label="Twitter">
                  <Twitter size={20} />
                </a>
                <a href="https://facebook.com" className="text-white/70 hover:text-white transition-colors" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="https://linkedin.com" className="text-white/70 hover:text-white transition-colors" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
                <a href="https://youtube.com" className="text-white/70 hover:text-white transition-colors" aria-label="YouTube">
                  <Youtube size={20} />
                </a>
              </div>
            </div>
            
            {/* Site navigation */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Site</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#mission" className="text-white/70 hover:text-white transition-colors text-sm inline-flex items-center">
                    <ChevronRight size={14} className="mr-1" /> Mission
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-white/70 hover:text-white transition-colors text-sm inline-flex items-center">
                    <ChevronRight size={14} className="mr-1" /> Features
                  </a>
                </li>
                <li>
                  <a href="#support" className="text-white/70 hover:text-white transition-colors text-sm inline-flex items-center">
                    <ChevronRight size={14} className="mr-1" /> Support
                  </a>
                </li>
                <li>
                  <a href="#safety" className="text-white/70 hover:text-white transition-colors text-sm inline-flex items-center">
                    <ChevronRight size={14} className="mr-1" /> Safety
                  </a>
                </li>
                <li>
                  <a href="/interest" className="text-white/70 hover:text-white transition-colors text-sm inline-flex items-center">
                    <ChevronRight size={14} className="mr-1" /> Join Waitlist
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Legal and careers */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/about" className="text-white/70 hover:text-white transition-colors text-sm inline-flex items-center">
                    <ChevronRight size={14} className="mr-1" /> About Us
                  </a>
                </li>
                <li>
                  <a href="/careers" className="text-white/70 hover:text-white transition-colors text-sm inline-flex items-center">
                    <ChevronRight size={14} className="mr-1" /> Careers <span className="ml-1.5 text-xs bg-[hsl(var(--primary))] px-1.5 py-0.5 rounded-full">Hiring</span>
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-white/70 hover:text-white transition-colors text-sm inline-flex items-center">
                    <ChevronRight size={14} className="mr-1" /> Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-white/70 hover:text-white transition-colors text-sm inline-flex items-center">
                    <ChevronRight size={14} className="mr-1" /> Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-white/70 hover:text-white transition-colors text-sm inline-flex items-center">
                    <ChevronRight size={14} className="mr-1" /> Contact Us
                  </a>
                </li>
              </ul>
            </div>
            
            {/* App downloads */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Download App</h3>
              <p className="text-sm text-white/70 mb-4">
                Get the Lyra experience on your mobile device. Coming soon to iOS and Android.
              </p>
              
              <div className="space-y-3">
                <a 
                  href="#" 
                  className="flex items-center p-2 border border-white/20 rounded-lg bg-black/30 hover:bg-black/50 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    toast({
                      title: "Coming Soon",
                      description: "The Lyra app will be available for download soon!",
                      variant: "default"
                    });
                  }}
                >
                  <div className="mr-3">
                    <Download size={24} />
                  </div>
                  <div>
                    <p className="text-xs">Download on the</p>
                    <p className="text-sm font-semibold">App Store</p>
                  </div>
                </a>
                
                <a 
                  href="#" 
                  className="flex items-center p-2 border border-white/20 rounded-lg bg-black/30 hover:bg-black/50 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    toast({
                      title: "Coming Soon",
                      description: "The Lyra app will be available for download soon!",
                      variant: "default"
                    });
                  }}
                >
                  <div className="mr-3">
                    <Download size={24} />
                  </div>
                  <div>
                    <p className="text-xs">Get it on</p>
                    <p className="text-sm font-semibold">Google Play</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
          
          {/* Footer bottom with copyright */}
          <div className="pt-3 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-1 md:space-y-0 pb-0">
            <div className="flex items-center text-white/60 text-sm">
              <Copyright size={14} className="mr-1" /> {new Date().getFullYear()} Lyra. All rights reserved.
            </div>
            
            <div className="flex space-x-4 text-sm text-white/60">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <span>•</span>
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              <span>•</span>
              <a href="/cookies" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const CountdownTimer = () => {
  // Set launch date to exactly one month from today (June 5, 2025)
  const launchDate = new Date("2025-06-05T12:00:00+01:00");
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Get current time
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();
      
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
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full max-w-md">
        {/* Days */}
        <div className="flex flex-col items-center">
          <div className="bg-black/30 backdrop-blur-md rounded-lg p-2 sm:p-4 w-full text-center border border-blue-400/30 hover:border-blue-400/50 transition-colors">
            <span className="text-2xl sm:text-4xl font-bold text-white">{timeLeft.days}</span>
          </div>
          <span className="text-xs sm:text-sm mt-1 text-white/80">Days</span>
        </div>
        
        {/* Hours */}
        <div className="flex flex-col items-center">
          <div className="bg-black/30 backdrop-blur-md rounded-lg p-2 sm:p-4 w-full text-center border border-blue-400/30 hover:border-blue-400/50 transition-colors">
            <span className="text-2xl sm:text-4xl font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
          </div>
          <span className="text-xs sm:text-sm mt-1 text-white/80">Hours</span>
        </div>
        
        {/* Minutes */}
        <div className="flex flex-col items-center">
          <div className="bg-black/30 backdrop-blur-md rounded-lg p-2 sm:p-4 w-full text-center border border-blue-400/30 hover:border-blue-400/50 transition-colors">
            <span className="text-2xl sm:text-4xl font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
          </div>
          <span className="text-xs sm:text-sm mt-1 text-white/80">Minutes</span>
        </div>
        
        {/* Seconds */}
        <div className="flex flex-col items-center">
          <div className="bg-black/30 backdrop-blur-md rounded-lg p-2 sm:p-4 w-full text-center border border-blue-400/30 hover:border-blue-400/50 transition-colors">
            <span className="text-2xl sm:text-4xl font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
          <span className="text-xs sm:text-sm mt-1 text-white/80">Seconds</span>
        </div>
      </div>
      
      <div className="flex items-center mt-4 mb-2">
        <Clock className="h-4 w-4 mr-2 text-blue-400" />
        <span className="text-xs sm:text-sm text-white/80">Until Official Launch (London Time)</span>
      </div>
    </div>
  );
};

export default Index;
