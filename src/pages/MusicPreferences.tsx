import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { saveProfile, getProfile } from "@/services/profile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from '@/lib/supabase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateRandomMusicPreferences } from "@/utils/testData";

// Music preferences interface
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

const MusicPreferences = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, invalidateProfileCache } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Music preferences state
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
  
  useEffect(() => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please log in to set your music preferences",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    const preventRedirectLoop = searchParams.get('noRedirect') === 'true';
    const source = searchParams.get('source') || '';
    const noProfileCheck = searchParams.get('noProfileCheck') === 'true';

    if (preventRedirectLoop) {
      console.log(`MusicPreferences: Redirect prevention active (source: ${source}), showing form.`);
    }
    
    if (noProfileCheck && !preventRedirectLoop) {
      console.log('MusicPreferences: Skipping profile data load as requested by noProfileCheck flag.');
      return; 
    }

    const loadUserPreferences = async () => {
      try {
        setIsLoading(true);
        const existingPrefs = await getProfile(user.id); 
        if (existingPrefs) {
          console.log("MusicPreferences: Populating form with existing music preferences.");
          setPreferences(existingPrefs);
        } else {
          console.log("MusicPreferences: No existing music preferences found for this user.");
        }
      } catch (error) {
        console.error("MusicPreferences: Error fetching existing music preferences:", error);
        toast({
          title: "Error Loading Data",
          description: "Could not load your music preferences. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserPreferences();

  }, [user, navigate, toast]); 
  
  // Available music genres
  const genres = [
    "Pop", "Rock", "Hip Hop", "R&B", "Jazz", "Classical", "Electronic", 
    "Country", "Folk", "Metal", "Indie", "Alternative", "Blues", 
    "Reggae", "Soul", "Funk", "Dance", "World", "Latin", "K-pop"
  ];
  
  // Music discovery methods
  const discoveryMethods = [
    "Streaming services", "Social media", "Friends", "Radio", 
    "Concerts", "Music blogs", "Music videos", "Algorithms", 
    "Playlists", "Music apps"
  ];
  
  // Listening moods
  const listeningMoods = [
    "Energetic", "Relaxed", "Focused", "Happy", "Sad", "Nostalgic", 
    "Romantic", "Excited", "Calm", "Angry", "Introspective", "Party"
  ];
  
  // Load random music preferences for testing
  const loadRandomPreferences = () => {
    const randomPrefs = generateRandomMusicPreferences();
    setPreferences(randomPrefs);
    
    toast({
      title: "Random preferences loaded",
      description: "Random music preferences have been generated",
    });
  };
  
  // Handle genre selection
  const handleGenreToggle = (genre: string) => {
    setPreferences(prev => {
      if (prev.genres.includes(genre)) {
        return {
          ...prev,
          genres: prev.genres.filter(g => g !== genre)
        };
      } else {
        return {
          ...prev,
          genres: [...prev.genres, genre]
        };
      }
    });
  };
  
  // Handle discovery method selection
  const handleDiscoveryToggle = (method: string) => {
    setPreferences(prev => {
      if (prev.discoveryMethods.includes(method)) {
        return {
          ...prev,
          discoveryMethods: prev.discoveryMethods.filter(m => m !== method)
        };
      } else {
        return {
          ...prev,
          discoveryMethods: [...prev.discoveryMethods, method]
        };
      }
    });
  };
  
  // Handle mood selection
  const handleMoodToggle = (mood: string) => {
    setPreferences(prev => {
      if (prev.listeningMoods.includes(mood)) {
        return {
          ...prev,
          listeningMoods: prev.listeningMoods.filter(m => m !== mood)
        };
      } else {
        return {
          ...prev,
          listeningMoods: [...prev.listeningMoods, mood]
        };
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (preferences.genres.length === 0) {
      toast({
        title: "Please select at least one genre",
        description: "Music genres are required to find your matches",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please log in to save your music preferences",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      
      console.log("Saving music preferences for user:", user.id);
      console.log("Preferences:", preferences);
      
      // Save music preferences to the music_preferences table
      const result = await saveProfile(user.id, preferences);
      
      if (!result) {
        throw new Error("Failed to save music preferences");
      }

      console.log("Music preferences saved. Now updating profile setup_complete status for user:", user.id);
      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({ setup_complete: true })
        .eq('id', user.id);

      if (updateProfileError) {
        console.error("MusicPreferences: Error updating profile setup_complete status:", updateProfileError);
      } else {
        console.log("Profile setup_complete status updated successfully for user:", user.id);
        if (invalidateProfileCache) {
          invalidateProfileCache(user.id);
          console.log("AuthContext profile cache invalidated for user:", user.id);
        }
      }
      
      // Verify music preferences were saved
      try {
        const { getProfile } = await import('@/services/profile');
        const savedPrefs = await getProfile(user.id);
        
        if (!savedPrefs) {
          console.warn("Music preferences not found after saving");
          throw new Error("Failed to verify music preferences were saved");
        }
        
        console.log("Music preferences verified successfully");
      } catch (verifyError) {
        console.error("Error verifying music preferences:", verifyError);
      }

      // Show success message
      toast({
        title: "Music preferences saved!",
        description: "Your profile is now complete",
      });

      // Redirect to match page
      console.log("Music preferences saved, redirecting to match page");
      navigate("/match");
    } catch (error) {
      console.error("Error saving music preferences:", error);
      toast({
        title: "Error saving preferences",
        description: typeof error === 'object' && error !== null && 'message' in error
          ? String(error.message)
          : "There was a problem saving your music preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fadeIn">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Your Music Preferences</h1>
        <p className="text-muted-foreground">
          Tell us about your musical tastes to find your perfect harmony
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Music Genres */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Music Genres</h2>
          <p className="text-sm text-muted-foreground">Select all genres you enjoy listening to</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {genres.map((genre) => (
              <div key={genre} className="flex items-center space-x-2">
                <Checkbox 
                  id={`genre-${genre}`} 
                  checked={preferences.genres.includes(genre)}
                  onCheckedChange={() => handleGenreToggle(genre)}
                />
                <label
                  htmlFor={`genre-${genre}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {genre}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Favorite Artists */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Favorite Artists</h2>
          <p className="text-sm text-muted-foreground">List your favorite music artists (comma-separated)</p>
          
          <Textarea
            placeholder="e.g. Taylor Swift, The Weeknd, Billie Eilish, BTS"
            value={preferences.artists.join(", ")}
            onChange={(e) => setPreferences(prev => ({
              ...prev,
              artists: e.target.value.split(",").map(a => a.trim()).filter(Boolean)
            }))}
          />
        </div>
        
        {/* Favorite Songs */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Favorite Songs</h2>
          <p className="text-sm text-muted-foreground">List some of your favorite songs (comma-separated)</p>
          
          <Textarea
            placeholder="e.g. Bohemian Rhapsody, Blinding Lights, Bad Guy"
            value={preferences.songs.join(", ")}
            onChange={(e) => setPreferences(prev => ({
              ...prev,
              songs: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
            }))}
          />
        </div>
        
        {/* Listening Frequency */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Listening Frequency</h2>
          <p className="text-sm text-muted-foreground">How often do you listen to music?</p>
          
          <Select
            value={preferences.listeningFrequency}
            onValueChange={(value) => setPreferences(prev => ({
              ...prev,
              listeningFrequency: value
            }))}
          >
            <SelectTrigger className="bg-background text-foreground">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent className="bg-popover text-popover-foreground">
              <SelectItem value="constantly">Throughout the day</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="several_times_week">Several times a week</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="occasionally">Occasionally</SelectItem>
              <SelectItem value="rarely">Rarely</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Music Discovery */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Music Discovery</h2>
          <p className="text-sm text-muted-foreground">How do you discover new music?</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {discoveryMethods.map((method) => (
              <div key={method} className="flex items-center space-x-2">
                <Checkbox 
                  id={`discovery-${method}`} 
                  checked={preferences.discoveryMethods.includes(method)}
                  onCheckedChange={() => handleDiscoveryToggle(method)}
                />
                <label
                  htmlFor={`discovery-${method}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {method}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Listening Moods */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Listening Moods</h2>
          <p className="text-sm text-muted-foreground">What moods do you associate with your music listening?</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {listeningMoods.map((mood) => (
              <div key={mood} className="flex items-center space-x-2">
                <Checkbox 
                  id={`mood-${mood}`} 
                  checked={preferences.listeningMoods.includes(mood)}
                  onCheckedChange={() => handleMoodToggle(mood)}
                />
                <label
                  htmlFor={`mood-${mood}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {mood}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Playlists */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Playlist Creation</h2>
          <p className="text-sm text-muted-foreground">Do you create your own playlists?</p>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="creates-playlists" 
              checked={preferences.createsPlaylists}
              onCheckedChange={(checked) => setPreferences(prev => ({
                ...prev,
                createsPlaylists: checked
              }))}
            />
            <label
              htmlFor="creates-playlists"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I create my own playlists
            </label>
          </div>
          
          {preferences.createsPlaylists && (
            <div className="space-y-2 mt-4">
              <Label htmlFor="playlist-themes">Playlist Themes (comma-separated)</Label>
              <Textarea
                id="playlist-themes"
                placeholder="e.g. Workout, Chill vibes, Study, Road trip, Party"
                value={preferences.playlistThemes.join(", ")}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  playlistThemes: e.target.value.split(",").map(t => t.trim()).filter(Boolean)
                }))}
              />
            </div>
          )}
        </div>
        
        {/* Concert Attendance */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Concert Attendance</h2>
          <p className="text-sm text-muted-foreground">How often do you attend concerts or live music events?</p>
          
          <Select
            value={preferences.concertFrequency}
            onValueChange={(value) => setPreferences(prev => ({
              ...prev,
              concertFrequency: value
            }))}
          >
            <SelectTrigger className="bg-background text-foreground">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent className="bg-popover text-popover-foreground">
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Every few months</SelectItem>
              <SelectItem value="yearly">A few times a year</SelectItem>
              <SelectItem value="rarely">Rarely</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="space-y-2 mt-4">
            <Label htmlFor="best-concert">Best Concert Experience</Label>
            <Textarea
              id="best-concert"
              placeholder="Share your favorite concert or live music experience"
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
          <h2 className="text-xl font-semibold">Musical Milestones</h2>
          <p className="text-sm text-muted-foreground">Share a song or album that was influential in your life</p>
          
          <Textarea
            placeholder="e.g. The first album I bought, the song that got me through a difficult time..."
            value={preferences.musicalMilestones}
            onChange={(e) => setPreferences(prev => ({
              ...prev,
              musicalMilestones: e.target.value
            }))}
          />
        </div>
        
        {/* Musical Characteristics */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Musical Characteristics</h2>
          <p className="text-sm text-muted-foreground">Adjust these sliders to match your music preferences</p>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="tempo-preference">Tempo Preference</Label>
                <span className="text-xs text-muted-foreground">{preferences.tempoPreference}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs">Slow</span>
                <Slider
                  id="tempo-preference"
                  min={0}
                  max={100}
                  step={1}
                  value={[preferences.tempoPreference]}
                  onValueChange={(value) => setPreferences(prev => ({
                    ...prev,
                    tempoPreference: value[0]
                  }))}
                  className="flex-1"
                />
                <span className="text-xs">Fast</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="energy-level">Energy Level</Label>
                <span className="text-xs text-muted-foreground">{preferences.energyLevel}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs">Calm</span>
                <Slider
                  id="energy-level"
                  min={0}
                  max={100}
                  step={1}
                  value={[preferences.energyLevel]}
                  onValueChange={(value) => setPreferences(prev => ({
                    ...prev,
                    energyLevel: value[0]
                  }))}
                  className="flex-1"
                />
                <span className="text-xs">Energetic</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="danceability">Danceability</Label>
                <span className="text-xs text-muted-foreground">{preferences.danceability}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs">Chill</span>
                <Slider
                  id="danceability"
                  min={0}
                  max={100}
                  step={1}
                  value={[preferences.danceability]}
                  onValueChange={(value) => setPreferences(prev => ({
                    ...prev,
                    danceability: value[0]
                  }))}
                  className="flex-1"
                />
                <span className="text-xs">Danceable</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Random Test Data Button */}
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={loadRandomPreferences}
            disabled={isLoading}
          >
            Generate Random
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Music Preferences"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MusicPreferences;
