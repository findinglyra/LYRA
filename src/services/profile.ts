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
    id: userId,
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
  try {
    console.log('Saving music preferences for user:', userId);
    
    // Transform data from app format to database format
    const dbData = transformProfileToDb(preferences, userId);
    console.log('Transformed data:', dbData);
    
    // First check if a record already exists
    const { data: existingData, error: fetchError } = await supabase
      .from('music_preferences')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows returned
      console.error('Error checking existing profile:', fetchError);
      throw new Error(`Failed to check existing profile: ${fetchError.message}`);
    }
    
    let result;
    
    if (existingData) {
      // Update existing record
      console.log('Updating existing music preferences record');
      const { data, error } = await supabase
        .from('music_preferences')
        .update(dbData)
        .eq('id', userId)
        .select();
      
      if (error) {
        console.error('Error updating profile:', error);
        throw new Error(`Failed to update profile: ${error.message}`);
      }
      
      result = data;
    } else {
      // Insert new record
      console.log('Creating new music preferences record');
      const { data, error } = await supabase
        .from('music_preferences')
        .insert(dbData)
        .select();
      
      if (error) {
        console.error('Error inserting profile:', error);
        throw new Error(`Failed to insert profile: ${error.message}`);
      }
      
      result = data;
    }
    
    console.log('Profile saved successfully:', result);
    return result;
  } catch (error) {
    console.error('Unexpected error in saveProfile:', error);
    throw error instanceof Error ? error : new Error('Unknown error occurred while saving profile');
  }
}

export async function getProfile(userId: string): Promise<MusicPreferences | null> {
  const { data, error } = await supabase
    .from('music_preferences')
    .select('*')
    .eq('id', userId)
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