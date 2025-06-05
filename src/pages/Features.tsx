import React from 'react';
import { Music, Users, Star, Radio, MapPin, Headphones, ShieldCheck, Settings, BarChart3, MessageCircle, ListMusic, GitMerge } from 'lucide-react'; // Example icons

interface FeatureInfo {
  id: string;
  title: string;
  brandAlignment: string;
  experience: string;
  icon?: React.ReactNode;
}

const featuresData: FeatureInfo[] = [
  {
    id: 'registration',
    title: 'User Registration & Profile Creation',
    brandAlignment: 'Emphasizes authenticity from the start. The process is streamlined but encourages users to express their true selves, especially regarding their musical identity, and potentially their astrological sign or birth chart details (optional, for later integration), setting the stage for meaningful, aligned connections.',
    experience: 'Easy onboarding, clear steps, focus on expressing personality and musical taste, and discovering one\'s cosmic blueprint.',
    icon: <Users size={40} className="text-accent-1" /> // Bright Coral/Salmon
  },
  {
    id: 'musicPrefs',
    title: 'Music Preference Input (Spotify/Apple Music Integration & Manual)',
    brandAlignment: 'This is the core differentiator and embodies discovery and passion. It allows for seamless integration of existing musical identities while providing options for manual input, ensuring inclusivity for all music lovers. This directly feeds the Harmony Score, which can be enhanced by astrological data.',
    experience: 'Intuitive connection process, flexible manual input, a sense of excitement about sharing one\'s musical soul, and finding kindred spirits whose musical and cosmic energies resonate.',
    icon: <Music size={40} className="text-accent-1" />
  },
  {
    id: 'harmonyScore',
    title: 'Harmony Score',
    brandAlignment: 'The embodiment of harmony and intelligence. It provides a tangible metric for musical compatibility, significantly enhanced by astrological alignment and planetary positions, giving users confidence in their matches and reinforcing the idea of a deeper, cosmically-guided connection beyond superficial traits.',
    experience: 'Clear, understandable score, presented prominently on match cards and profiles, fostering trust in the matching process, and a sense that the universe is guiding connections.',
    icon: <BarChart3 size={40} className="text-accent-1" />
  },
  {
    id: 'matchPage',
    title: 'Match Page (Swipeable Cards)',
    brandAlignment: 'While familiar, this feature is elevated by the immediate display of the Harmony Score and key music tags, along with subtle astrological compatibility cues (e.g., \"High Cosmic Alignment\"), reinforcing deeper connection and discovery. It transforms a simple swipe into an informed decision, guided by both sound and stars.',
    experience: 'Engaging, visually appealing, provides quick insights into musical and cosmic compatibility, feels more purposeful and destined than generic dating apps.',
    icon: <Users size={40} className="text-accent-1" /> // Using Users again, can be more specific
  },
  {
    id: 'chatMusicShare',
    title: 'Chat Interface with Music Sharing',
    brandAlignment: 'Fosters connection and discovery by making music an integral part of communication. Sharing a track isn\'t just sending a link; it\'s sharing a piece of oneself, a conversation starter, and a way to explore shared tastes, deepening the bond as if sharing a celestial journey.',
    experience: 'Seamless, intuitive chat, integrated music sharing that feels natural and enhances conversation, allowing connections to orbit around shared interests.',
    icon: <MessageCircle size={40} className="text-accent-1" />
  },
  {
    id: 'journeyTimeline',
    title: 'Musical Journey Timeline',
    brandAlignment: 'Celebrates authenticity and passion. It\'s a personalized narrative of a user\'s musical evolution, providing unique insights and conversation starters that deepen understanding between matches, like charting one\'s own musical constellation through time.',
    experience: 'Visually appealing, easy to navigate, provides a sense of nostalgia and personal history, encourages sharing, and offers a unique perspective on one\'s evolving musical universe.',
    icon: <ListMusic size={40} className="text-accent-1" />
  },
  {
    id: 'collabPlaylists',
    title: 'Collaborative Playlists',
    brandAlignment: 'The ultimate expression of harmony and connection. This feature allows users to actively build something together, reflecting their evolving relationship through shared musical curation, like forming a new sonic constellation. It\'s a digital artifact of their bond.',
    experience: 'Interactive, fun, a tangible way to build shared experiences, reinforces the idea of growing together, and creating a shared musical universe.',
    icon: <GitMerge size={40} className="text-accent-1" />
  },
  {
    id: 'soundscape',
    title: 'Soundscape (2D Map)',
    brandAlignment: 'Bridges the digital and physical worlds, promoting discovery and connection within local communities. It encourages real-world interaction and shared experiences by highlighting local musical hotspots and shared playlists, like finding points of light in a shared urban constellation.',
    experience: 'Engaging, visually intuitive map, fosters a sense of local community, encourages exploration, and reveals where musical energies converge.',
    icon: <MapPin size={40} className="text-accent-1" />
  },
  {
    id: 'realtimeListening',
    title: 'Real-time Listening Partner',
    brandAlignment: 'The pinnacle of intimate connection and harmony. It simulates the experience of listening to music together, creating shared moments and deepening emotional bonds in real-time, as if sharing the same cosmic frequency.',
    experience: 'Immersive, synchronized, feels like being physically together, enhances the sense of shared experience, and creates a unique shared temporal orbit.',
    icon: <Headphones size={40} className="text-accent-1" />
  },
  {
    id: 'concertBuddy',
    title: 'Concert Buddy & Local Scene',
    brandAlignment: 'Drives real-world connection and discovery. This feature directly facilitates meetups based on shared interests, turning online matches into tangible experiences and fostering a vibrant community, where stars align for live music experiences.',
    experience: 'Practical, exciting, easy to find like-minded concert-goers, encourages spontaneous meetups, and helps users find their tribe in the local music universe.',
    icon: <Radio size={40} className="text-accent-1" />
  },
  {
    id: 'uiUxPolish',
    title: 'UI/UX Polish & Accessibility',
    brandAlignment: 'Reflects our commitment to vibrancy, sophistication, and inclusivity. A beautiful, intuitive, and accessible app ensures a delightful experience for all users, reinforcing trust and professionalism, and making the cosmic journey accessible to everyone.',
    experience: 'Smooth, responsive, aesthetically pleasing, easy to navigate for everyone.',
    icon: <Settings size={40} className="text-accent-1" />
  },
  {
    id: 'performanceSecurity',
    title: 'Performance & Security',
    brandAlignment: 'Underpins authenticity and trust. A fast, reliable, and secure platform ensures user data is protected and the experience is seamless, building confidence in the brand, and ensuring a stable orbit for all users.',
    experience: 'Fast loading times, no crashes, peace of mind regarding personal data.',
    icon: <ShieldCheck size={40} className="text-accent-1" />
  }
];

const FeatureCard: React.FC<FeatureInfo> = ({ title, brandAlignment, experience, icon }) => {
  return (
    <div className="bg-slate-900/50 backdrop-blur-md p-8 rounded-xl shadow-2xl mb-10 border border-slate-700 hover:border-secondary transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center mb-4">
        {icon && <div className="mr-4 p-3 bg-primary rounded-lg">{icon}</div>}
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent-2">{title}</h2>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-accent-1 mb-2">Brand Alignment</h3>
          <p className="text-slate-300 text-left leading-relaxed">{brandAlignment}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-accent-1 mb-2">User Experience</h3>
          <p className="text-slate-300 text-left leading-relaxed">{experience}</p>
        </div>
      </div>
    </div>
  );
};

const FeaturesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary text-neutral-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-secondary via-accent-1 to-accent-2 leading-tight">
            Discover the Lyra Universe
          </h1>
          <p className="mt-6 text-xl text-slate-300 max-w-3xl mx-auto">
            Findinglyra is more than just an app; it\'s a journey to deeper connections, powered by the universal language of music and the subtle harmony of the cosmos. Explore the features designed to help you find your rhythm and your person.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {featuresData.map((feature) => (
            <FeatureCard
              key={feature.id}
              id={feature.id}
              title={feature.title}
              brandAlignment={feature.brandAlignment}
              experience={feature.experience}
              icon={feature.icon}
            />
          ))}
        </div>

        <footer className="text-center mt-20 py-10 border-t border-slate-700">
          <p className="text-slate-400">&copy; {new Date().getFullYear()} Findinglyra. All rights reserved.</p>
          <p className="text-sm text-slate-500 mt-2">Where your playlist meets your person. And the stars align.</p>
        </footer>
      </div>
    </div>
  );
};

export default FeaturesPage;

