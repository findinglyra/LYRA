
import { create } from 'zustand';

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

interface ProfileStore {
  profile: MusicPreferences | null;
  setProfile: (profile: MusicPreferences) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
}));
