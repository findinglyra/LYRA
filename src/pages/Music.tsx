import { Button } from "@/components/ui/button";
import { PlayCircle, Star, MoonStar, Sparkles } from "lucide-react";
import { useProfileStore } from "@/utils/profileStorage";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Music = () => {
  const profile = useProfileStore((state) => state.profile);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, hasCoreProfile, hasRequiredMusicPreferences, enforceAuthRouting } = useAuth();

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
    
    // Check if both core profile and music preferences are complete
    if (!(hasCoreProfile && hasRequiredMusicPreferences)) {
      // If not complete, enforce routing rules which might redirect the user
      enforceAuthRouting(location.pathname);
    }
  }, [user, hasCoreProfile, hasRequiredMusicPreferences, navigate, toast, enforceAuthRouting, location.pathname]);

  if (!profile) return null;

  const topArtists = profile.artists.slice(0, 4).map((artist, index) => ({
    name: artist,
    genre: profile.genres[index % profile.genres.length] || "Stellar",
    image: "https://images.unsplash.com/photo-1618973361585-d066bb75909f",
    constellation: ["Lyra", "Orion", "Cassiopeia", "Andromeda"][index % 4]
  }));

  const recentTracks = profile.songs.slice(0, 3).map((song, index) => ({
    title: song,
    artist: profile.artists[index % profile.artists.length] || "Stellar Artist",
    duration: "3:00",
    intensity: ["Nebular", "Stellar", "Galactic"][index % 3]
  }));

  return (
    <div className="min-h-screen container max-w-md mx-auto py-8 px-4 space-y-8">
      
      <section className="space-y-4 relative z-10">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-indigo-600" />
          <h2 className="text-2xl font-semibold text-slate-800">Stellar Artists</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {topArtists.map((artist) => (
            <div
              key={artist.name}
              className="group relative rounded-xl overflow-hidden aspect-square glass-card shadow-[0_0_15px_rgba(100,100,255,0.05)]"
            >
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                <div className="text-white">
                  <h3 className="font-medium">{artist.name}</h3>
                  <div className="flex items-center">
                    <p className="text-sm opacity-75">{artist.genre}</p>
                    <span className="mx-1 text-[hsl(var(--pale-yellow))]">•</span>
                    <p className="text-xs text-[hsl(var(--pale-yellow))]">{artist.constellation}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 relative z-10">
        <div className="flex items-center gap-2">
          <MoonStar className="h-5 w-5 text-indigo-600" />
          <h2 className="text-2xl font-semibold text-slate-800">Stellar Tracks</h2>
        </div>
        <div className="space-y-3">
          {recentTracks.map((track) => (
            <div
              key={track.title}
              className="flex items-center gap-3 p-3 rounded-xl glass-card hover:shadow-[0_0_15px_rgba(100,100,255,0.1)] transition-all"
            >
              <Button size="icon" variant="ghost" className="shrink-0 text-indigo-600">
                <PlayCircle className="h-6 w-6" />
              </Button>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium truncate text-slate-700">{track.title}</h3>
                <div className="flex items-center">
                  <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                  <span className="mx-1 text-slate-500">•</span>
                  <div className="text-xs flex items-center">
                    <Sparkles className="h-3 w-3 mr-1 text-indigo-600" />
                    <span>{track.intensity}</span>
                  </div>
                </div>
              </div>
              <span className="text-sm text-muted-foreground shrink-0">
                {track.duration}
              </span>
            </div>
          ))}
        </div>
      </section>
      
      <section className="mt-8 relative z-10">
        <div className="glass-card p-6 rounded-xl space-y-4 shadow-[0_0_15px_rgba(100,100,255,0.05)]">
          <h3 className="text-lg font-semibold flex items-center text-slate-800">
            <Star className="h-4 w-4 mr-2 text-indigo-600" />
            Stellar Harmony
          </h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Resonance</p>
              <div className="bg-slate-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] h-2.5 rounded-full" 
                  style={{ width: `${profile.energyLevel}%` }}
                ></div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Astral Flow</p>
              <div className="bg-slate-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] h-2.5 rounded-full" 
                  style={{ width: `${profile.tempoPreference}%` }}
                ></div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Stellar Dance</p>
              <div className="bg-slate-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] h-2.5 rounded-full" 
                  style={{ width: `${profile.danceability}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Music;
