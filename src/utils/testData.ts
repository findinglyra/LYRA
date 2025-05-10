// src/utils/testData.ts
import { MusicPreferences } from '@/services/profile';

/**
 * Generates a random item from an array
 */
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generates a random subset of items from an array
 */
function getRandomSubset<T>(array: T[], maxItems: number): T[] {
  const numItems = Math.floor(Math.random() * maxItems) + 1; // At least 1 item
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numItems);
}

/**
 * Generates random test data for music preferences
 */
export function generateRandomMusicPreferences(): MusicPreferences {
  // Arrays of sample data
  const genres = [
    "Pop", "Rock", "Hip-Hop", "Jazz", "R&B", "Classical", "Indie", "EDM",
    "Country", "Folk", "Metal", "Blues", "Reggae", "Soul", "Electronic"
  ];
  
  const artists = [
    "Taylor Swift", "The Weeknd", "Beyoncé", "Drake", "Adele",
    "Bad Bunny", "BTS", "Billie Eilish", "Harry Styles", "Ariana Grande",
    "Post Malone", "Dua Lipa", "Ed Sheeran", "Kendrick Lamar", "Rihanna"
  ];
  
  const songs = [
    "Blinding Lights", "Shape of You", "Dance Monkey", "Someone Like You",
    "Despacito", "Uptown Funk", "Old Town Road", "Watermelon Sugar",
    "Bad Guy", "Levitating", "Stay", "As It Was", "Dynamite", "Easy On Me"
  ];
  
  const listeningFrequencies = [
    "Less than 1 hour",
    "1-2 hours",
    "2-4 hours",
    "4-6 hours",
    "More than 6 hours"
  ];
  
  const discoveryMethods = [
    "Streaming Recommendations",
    "Friends & Social Media",
    "Music Blogs & Reviews",
    "Radio",
    "Music Charts",
    "Live Events & Concerts"
  ];
  
  const moods = [
    "Energetic & Upbeat",
    "Chill & Relaxing",
    "Focused & Productive",
    "Emotional & Reflective",
    "Party & Social",
    "Workout & Motivational"
  ];
  
  const playlistThemes = [
    "Workout/Fitness",
    "Study/Work Focus",
    "Party/Social",
    "Relaxation/Meditation",
    "Travel/Adventure",
    "Seasonal/Holiday"
  ];
  
  const concertFrequencies = [
    "Never",
    "Rarely (Once a year)",
    "Occasionally (2-3 times a year)",
    "Regularly (Monthly)",
    "Frequently (Multiple times a month)"
  ];
  
  const concertExperiences = [
    "Glastonbury Festival 2023",
    "Coachella Valley Music Festival",
    "Tomorrowland",
    "Ultra Music Festival",
    "Rolling Loud",
    "Lollapalooza",
    "EDC Las Vegas",
    "Primavera Sound"
  ];
  
  const musicalMilestones = [
    "First live concert",
    "Learning to play an instrument",
    "Discovering a favorite artist",
    "Creating my first playlist",
    "Going to my first music festival",
    "Meeting a musician I admire"
  ];
  
  // Generate random preference values
  return {
    genres: getRandomSubset(genres, 5),
    artists: getRandomSubset(artists, 5),
    songs: getRandomSubset(songs, 5),
    listeningFrequency: getRandomItem(listeningFrequencies),
    discoveryMethods: getRandomSubset(discoveryMethods, 3),
    listeningMoods: getRandomSubset(moods, 3),
    createsPlaylists: Math.random() > 0.5,
    playlistThemes: getRandomSubset(playlistThemes, 3),
    concertFrequency: getRandomItem(concertFrequencies),
    bestConcertExperience: getRandomItem(concertExperiences),
    musicalMilestones: getRandomItem(musicalMilestones),
    tempoPreference: Math.floor(Math.random() * 100),
    energyLevel: Math.floor(Math.random() * 100),
    danceability: Math.floor(Math.random() * 100),
  };
}

/**
 * Generates sample test profiles with predefined data
 */
export function getSampleProfiles(): { name: string; data: MusicPreferences }[] {
  return [
    {
      name: "Rock Enthusiast",
      data: {
        genres: ["Rock", "Metal", "Indie", "Alternative", "Folk"],
        artists: ["Queen", "Foo Fighters", "Metallica", "Red Hot Chili Peppers", "AC/DC"],
        songs: ["Bohemian Rhapsody", "Enter Sandman", "Under the Bridge", "Everlong", "Back in Black"],
        listeningFrequency: "4-6 hours",
        discoveryMethods: ["Music Blogs & Reviews", "Friends & Social Media"],
        listeningMoods: ["Energetic & Upbeat", "Emotional & Reflective"],
        createsPlaylists: true,
        playlistThemes: ["Workout/Fitness", "Party/Social"],
        concertFrequency: "Occasionally (2-3 times a year)",
        bestConcertExperience: "Download Festival 2022",
        musicalMilestones: "Learning to play guitar when I was 15",
        tempoPreference: 75,
        energyLevel: 85,
        danceability: 60,
      }
    },
    {
      name: "Pop Music Fan",
      data: {
        genres: ["Pop", "R&B", "Dance", "Electronic", "Hip-Hop"],
        artists: ["Taylor Swift", "Ariana Grande", "Dua Lipa", "The Weeknd", "Harry Styles"],
        songs: ["Shake It Off", "Thank U, Next", "Levitating", "Blinding Lights", "Watermelon Sugar"],
        listeningFrequency: "2-4 hours",
        discoveryMethods: ["Streaming Recommendations", "Music Charts", "Radio"],
        listeningMoods: ["Party & Social", "Chill & Relaxing"],
        createsPlaylists: true,
        playlistThemes: ["Party/Social", "Workout/Fitness", "Seasonal/Holiday"],
        concertFrequency: "Regularly (Monthly)",
        bestConcertExperience: "Taylor Swift Eras Tour",
        musicalMilestones: "First concert with friends at age 16",
        tempoPreference: 65,
        energyLevel: 70,
        danceability: 90,
      }
    },
    {
      name: "Classical Aficionado",
      data: {
        genres: ["Classical", "Jazz", "Opera", "Instrumental", "Ambient"],
        artists: ["Ludwig van Beethoven", "Mozart", "Bach", "Yo-Yo Ma", "John Williams"],
        songs: ["Moonlight Sonata", "The Four Seasons", "Claire de Lune", "Symphony No. 9", "Canon in D"],
        listeningFrequency: "1-2 hours",
        discoveryMethods: ["Music Blogs & Reviews", "Live Events & Concerts"],
        listeningMoods: ["Focused & Productive", "Emotional & Reflective"],
        createsPlaylists: false,
        playlistThemes: ["Study/Work Focus", "Relaxation/Meditation"],
        concertFrequency: "Occasionally (2-3 times a year)",
        bestConcertExperience: "London Symphony Orchestra at Royal Albert Hall",
        musicalMilestones: "Learning to play piano at age 7",
        tempoPreference: 40,
        energyLevel: 30,
        danceability: 20,
      }
    }
  ];
}
