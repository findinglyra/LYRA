import { supabase } from '@/lib/supabase';

export interface MusicPreferences {
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

// Transform from app format to database format
function transformProfileToDb(preferences: MusicPreferences, userId: string) {
  return {
    user_id: userId,
    genres: preferences.genres,
    artists: preferences.artists,
    songs: preferences.songs,
    listening_frequency: preferences.listeningFrequency,
    discovery_methods: preferences.discoveryMethods,
    listening_moods: preferences.listeningMoods,
    creates_playlists: preferences.createsPlaylists,
    playlist_themes: preferences.playlistThemes,
    concert_frequency: preferences.concertFrequency,
    best_concert_experience: preferences.bestConcertExperience,
    musical_milestones: preferences.musicalMilestones,
    tempo_preference: preferences.tempoPreference,
    energy_level: preferences.energyLevel,
    danceability: preferences.danceability,
    updated_at: new Date().toISOString(),
  };
}

// Transform from database format to app format
function transformProfileFromDb(dbProfile: any): MusicPreferences {
  return {
    genres: dbProfile.genres || [],
    artists: dbProfile.artists || [],
    songs: dbProfile.songs || [],
    listeningFrequency: dbProfile.listening_frequency || '',
    discoveryMethods: dbProfile.discovery_methods || [],
    listeningMoods: dbProfile.listening_moods || [],
    createsPlaylists: dbProfile.creates_playlists || false,
    playlistThemes: dbProfile.playlist_themes || [],
    concertFrequency: dbProfile.concert_frequency || '',
    bestConcertExperience: dbProfile.best_concert_experience || '',
    musicalMilestones: dbProfile.musical_milestones || '',
    tempoPreference: dbProfile.tempo_preference || 50,
    energyLevel: dbProfile.energy_level || 50,
    danceability: dbProfile.danceability || 50,
  };
}

export async function saveProfile(userId: string, preferences: MusicPreferences) {
  const dbData = transformProfileToDb(preferences, userId);
  
  const { data, error } = await supabase
    .from('music_preferences')
    .upsert(dbData, {
      onConflict: 'user_id'
    })
    .select();

  if (error) {
    console.error('Error saving profile:', error);
    throw error;
  }

  return data;
}

export async function getProfile(userId: string): Promise<MusicPreferences | null> {
  const { data, error } = await supabase
    .from('music_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // No rows returned
      return null;
    }
    console.error('Error fetching profile:', error);
    throw error;
  }

  return data ? transformProfileFromDb(data) : null;
}