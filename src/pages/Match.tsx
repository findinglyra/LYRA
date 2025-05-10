import { Button } from "@/components/ui/button";
import { Heart, X, Music2, Headphones, Users, Star, SparklesIcon, Loader2 } from "lucide-react";
import { useProfileStore } from "@/utils/profileStorage";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface PotentialMatch {
  id: string;
  name: string;
  age: number;
  image: string;
  topGenres: string[];
  topArtists: string[];
  listeningStyle: string;
  compatibility: number;
  constellation?: string;
}

const Match = () => {
  const profile = useProfileStore((state) => state.profile);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, hasProfile, isAuthenticated, enforceAuthRouting } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Mock potential matches based on user's profile
  const [matches] = useState<PotentialMatch[]>([
    {
      id: "1",
      name: "Celeste",
      age: 25,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      topGenres: profile?.genres.slice(0, 3) || ["Ambient", "Electronic", "Classical"],
      topArtists: profile?.artists.slice(0, 2) || ["Tycho", "Stars of the Lid"],
      listeningStyle: profile?.listeningMoods[0] || "Celestial & Atmospheric",
      compatibility: 92,
      constellation: "Virgo"
    },
    // Add more mock matches as needed
  ]);

  const [currentMatch, setCurrentMatch] = useState<PotentialMatch | null>(
    matches[0] || null
  );

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue your stellar journey",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    if (!hasProfile && isAuthenticated) {
      enforceAuthRouting(location.pathname);
    }
  }, [user, hasProfile, isAuthenticated, navigate, toast, enforceAuthRouting, location.pathname]);

  useEffect(() => {
    if (!hasProfile) {
      navigate('/create-profile');
    } else {
      // Simulate loading match data
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [hasProfile]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    );
  }

  const handleSwipe = (liked: boolean) => {
    toast({
      title: liked ? "Stellar Connection! ⭐" : "Stars not aligned",
      description: liked 
        ? "Your stellar energies are in harmony!" 
        : "Keep exploring the stars for your perfect match",
    });
    // Here you would typically fetch the next match
    // For now, we'll just remove the current match
    setCurrentMatch(null);
  };

  if (!profile || !currentMatch) return null;

  return (
    <div className="subtle-starry-bg min-h-screen py-8 px-4">
      <div className="container max-w-md mx-auto relative z-10">
        <div className="lyra-constellation top-10 right-10 opacity-30"></div>
        
        <div className="rounded-3xl overflow-hidden glass-card aspect-[3/4] relative animate-fadeIn shadow-[0_0_20px_rgba(100,100,255,0.1)]">
          <img
            src={currentMatch.image}
            alt={currentMatch.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent">
            <div className="absolute top-4 right-4">
              <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[hsl(var(--vibrant-yellow))] to-[hsl(var(--primary))] text-white text-sm font-medium">
                <SparklesIcon className="inline-block w-3 h-3 mr-1" />
                {currentMatch.compatibility}% Harmony
              </span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
            <div className="flex items-center mb-2">
              <h3 className="text-2xl font-semibold">
                {currentMatch.name}, {currentMatch.age}
              </h3>
              <span className="ml-2 text-[hsl(var(--pale-yellow))] text-sm">
                {currentMatch.constellation}
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Music2 className="h-4 w-4 text-[hsl(var(--vibrant-yellow))]" />
                <p className="text-sm opacity-90">
                  Top genres: {currentMatch.topGenres.join(", ")}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Headphones className="h-4 w-4 text-[hsl(var(--vibrant-yellow))]" />
                <p className="text-sm opacity-90">
                  Resonates with: {currentMatch.topArtists.join(", ")}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-[hsl(var(--vibrant-yellow))]" />
                <p className="text-sm opacity-90">
                  Astral energy: {currentMatch.listeningStyle}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                {currentMatch.topGenres.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-[hsla(var(--pale-yellow),0.15)] text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button
            size="icon"
            variant="outline"
            className="h-16 w-16 rounded-full hover:bg-destructive/10 hover:text-destructive glass-card border-[hsla(var(--primary),0.2)]"
            onClick={() => handleSwipe(false)}
          >
            <X className="h-8 w-8" />
          </Button>
          <Button
            size="icon"
            className="h-16 w-16 rounded-full star-button bg-gradient-to-r from-[hsl(var(--vibrant-yellow))] to-[hsl(var(--primary))]"
            onClick={() => handleSwipe(true)}
          >
            <Heart className="h-8 w-8" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Match;
