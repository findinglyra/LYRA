import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useProfileStore } from "@/utils/profileStorage";

interface MusicPreferences {
  genres: string[];
  artists: string[];
  songs: string[];
  listeningFrequency: string;
  discoveryMethods: string[];
  listeningMoods: string[];
  createsPlaylists: boolean;
  playlistThemes: string[];
  concertFrequency: string;
  bestConcertExperience: string;
  musicalMilestones: string;
  tempoPreference: number;
  energyLevel: number;
  danceability: number;
}

const CreateProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const setProfile = useProfileStore((state) => state.setProfile);
  const [preferences, setPreferences] = useState<MusicPreferences>({
    genres: [],
    artists: [],
    songs: [],
    listeningFrequency: "",
    discoveryMethods: [],
    listeningMoods: [],
    createsPlaylists: false,
    playlistThemes: [],
    concertFrequency: "",
    bestConcertExperience: "",
    musicalMilestones: "",
    tempoPreference: 50,
    energyLevel: 50,
    danceability: 50,
  });

  const genres = [
    "Pop", "Rock", "Hip-Hop", "Jazz", "R&B", "Classical", "Indie", "EDM",
    "Country", "Folk", "Metal", "Blues", "Reggae", "Soul", "Electronic",
  ];

  const listeningFrequencies = [
    "Less than 1 hour",
    "1-2 hours",
    "2-4 hours",
    "4-6 hours",
    "More than 6 hours",
  ];

  const discoveryMethods = [
    "Streaming Recommendations",
    "Friends & Social Media",
    "Music Blogs & Reviews",
    "Radio",
    "Music Charts",
    "Live Events & Concerts",
  ];

  const moods = [
    "Energetic & Upbeat",
    "Chill & Relaxing",
    "Focused & Productive",
    "Emotional & Reflective",
    "Party & Social",
    "Workout & Motivational",
  ];

  const playlistThemes = [
    "Workout/Fitness",
    "Study/Work Focus",
    "Party/Social",
    "Relaxation/Meditation",
    "Travel/Adventure",
    "Seasonal/Holiday",
  ];

  const concertFrequencies = [
    "Never",
    "Rarely (Once a year)",
    "Occasionally (2-3 times a year)",
    "Regularly (Monthly)",
    "Frequently (Multiple times a month)",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (preferences.genres.length === 0) {
      toast({
        title: "Please select at least one genre",
        variant: "destructive",
      });
      return;
    }

    // Save profile data to store
    setProfile(preferences);

    // Log the data
    console.log("Profile Data:", preferences);

    // Show success message
    toast({
      title: "Profile created successfully!",
      description: "Redirecting to matches...",
    });

    // Redirect to match page
    setTimeout(() => navigate("/match"), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fadeIn">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Create Your Music Profile</h1>
        <p className="text-muted-foreground">
          Tell us about your musical preferences to find your perfect harmony
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Favorite Music Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Favorite Music Details</h2>
          
          <div className="space-y-2">
            <Label>Favorite Genres (Select up to 5)</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {genres.map((genre) => (
                <div key={genre} className="flex items-center space-x-2">
                  <Checkbox
                    id={genre}
                    checked={preferences.genres.includes(genre)}
                    disabled={preferences.genres.length >= 5 && !preferences.genres.includes(genre)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPreferences(prev => ({
                          ...prev,
                          genres: [...prev.genres, genre].slice(0, 5)
                        }));
                      } else {
                        setPreferences(prev => ({
                          ...prev,
                          genres: prev.genres.filter(g => g !== genre)
                        }));
                      }
                    }}
                  />
                  <Label htmlFor={genre}>{genre}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Favorite Artists (Comma-separated, up to 5)</Label>
            <Input
              placeholder="e.g., Artist 1, Artist 2, Artist 3"
              value={preferences.artists.join(", ")}
              onChange={(e) => {
                const artists = e.target.value.split(",").map(a => a.trim()).filter(Boolean).slice(0, 5);
                setPreferences(prev => ({ ...prev, artists }));
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Favorite Songs (Comma-separated, up to 5)</Label>
            <Input
              placeholder="e.g., Song 1, Song 2, Song 3"
              value={preferences.songs.join(", ")}
              onChange={(e) => {
                const songs = e.target.value.split(",").map(s => s.trim()).filter(Boolean).slice(0, 5);
                setPreferences(prev => ({ ...prev, songs }));
              }}
            />
          </div>
        </div>

        {/* Listening Habits */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Listening Habits</h2>
          
          <div className="space-y-2">
            <Label>How often do you listen to music daily?</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {listeningFrequencies.map((frequency) => (
                <div key={frequency} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={frequency}
                    name="listeningFrequency"
                    value={frequency}
                    checked={preferences.listeningFrequency === frequency}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      listeningFrequency: e.target.value
                    }))}
                    className="text-primary"
                  />
                  <Label htmlFor={frequency}>{frequency}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>How do you discover new music?</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {discoveryMethods.map((method) => (
                <div key={method} className="flex items-center space-x-2">
                  <Checkbox
                    id={method}
                    checked={preferences.discoveryMethods.includes(method)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPreferences(prev => ({
                          ...prev,
                          discoveryMethods: [...prev.discoveryMethods, method]
                        }));
                      } else {
                        setPreferences(prev => ({
                          ...prev,
                          discoveryMethods: prev.discoveryMethods.filter(m => m !== method)
                        }));
                      }
                    }}
                  />
                  <Label htmlFor={method}>{method}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mood & Style */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Mood & Style Preferences</h2>
          
          <div className="space-y-2">
            <Label>What moods do you prefer?</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {moods.map((mood) => (
                <div key={mood} className="flex items-center space-x-2">
                  <Checkbox
                    id={mood}
                    checked={preferences.listeningMoods.includes(mood)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPreferences(prev => ({
                          ...prev,
                          listeningMoods: [...prev.listeningMoods, mood]
                        }));
                      } else {
                        setPreferences(prev => ({
                          ...prev,
                          listeningMoods: prev.listeningMoods.filter(m => m !== mood)
                        }));
                      }
                    }}
                  />
                  <Label htmlFor={mood}>{mood}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Playlist & Curation */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Playlist & Music Curation</h2>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="playlist-creation"
              checked={preferences.createsPlaylists}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, createsPlaylists: checked }))
              }
            />
            <Label htmlFor="playlist-creation">I create playlists</Label>
          </div>

          {preferences.createsPlaylists && (
            <div className="space-y-2">
              <Label>What types of playlists do you create?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {playlistThemes.map((theme) => (
                  <div key={theme} className="flex items-center space-x-2">
                    <Checkbox
                      id={theme}
                      checked={preferences.playlistThemes.includes(theme)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPreferences(prev => ({
                            ...prev,
                            playlistThemes: [...prev.playlistThemes, theme]
                          }));
                        } else {
                          setPreferences(prev => ({
                            ...prev,
                            playlistThemes: prev.playlistThemes.filter(t => t !== theme)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={theme}>{theme}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Concert & Live Events */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Concert & Live Events</h2>
          
          <div className="space-y-2">
            <Label>How often do you attend live music events?</Label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={preferences.concertFrequency}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                concertFrequency: e.target.value
              }))}
            >
              <option value="">Select frequency...</option>
              {concertFrequencies.map((frequency) => (
                <option key={frequency} value={frequency}>
                  {frequency}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Best concert/music event experience</Label>
            <Input
              placeholder="Share your favorite live music experience..."
              value={preferences.bestConcertExperience}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                bestConcertExperience: e.target.value
              }))}
            />
          </div>
        </div>

        {/* Musical Milestones */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Personal Musical Milestones</h2>
          
          <div className="space-y-2">
            <Label>Share your significant music-related moments</Label>
            <Textarea
              placeholder="Tell us about your musical journey..."
              value={preferences.musicalMilestones}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                musicalMilestones: e.target.value
              }))}
              className="min-h-[100px]"
            />
          </div>
        </div>

        {/* Acoustic Preferences */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Acoustic Preferences</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tempo Preference</Label>
              <Slider
                value={[preferences.tempoPreference]}
                onValueChange={([value]) => setPreferences(prev => ({
                  ...prev,
                  tempoPreference: value
                }))}
                max={100}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Slower</span>
                <span>Faster</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Energy Level</Label>
              <Slider
                value={[preferences.energyLevel]}
                onValueChange={([value]) => setPreferences(prev => ({
                  ...prev,
                  energyLevel: value
                }))}
                max={100}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Calm</span>
                <span>Energetic</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Danceability</Label>
              <Slider
                value={[preferences.danceability]}
                onValueChange={([value]) => setPreferences(prev => ({
                  ...prev,
                  danceability: value
                }))}
                max={100}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Less Danceable</span>
                <span>More Danceable</span>
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg">
          Save Profile
        </Button>
      </form>
    </div>
  );
};

export default CreateProfile;
