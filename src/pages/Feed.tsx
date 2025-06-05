import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Music, Users, MessageSquare, Rss, Sparkles, Compass, ThumbsUp, ThumbsDown, Zap, Star, ListMusic, Users2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Types & Interfaces ---
interface FeedItem {
  id: string;
  type: 'reddit' | 'twitter' | 'music_discovery' | 'community_highlight' | 'potential_harmony';
  title: string;
  contentSnippet: React.ReactNode;
  source?: string;
  imageUrl?: string;
  link?: string; // External link or internal app path
  userReaction?: 'like' | 'dislike' | null;
  author?: string; // For community posts or match names
  tags?: string[]; // e.g., genres, topics
}

// --- Mock Data (Replace with actual API calls) ---
const mockFeedItems: FeedItem[] = [
  {
    id: 'match1',
    type: 'potential_harmony',
    title: 'Potential Harmony: Meet Elara ✨',
    author: 'Elara',
    contentSnippet: 'Elara also loves Dream Pop and recently added tracks by Beach House to their profile. Harmony Score: 88%',
    imageUrl: '/placeholder.jpg', // Placeholder
    link: '/profile/elara', // Example internal link
    tags: ['Dream Pop', 'Beach House', 'Stargazing']
  },
  {
    id: 'music1',
    type: 'music_discovery',
    title: 'New Echoes: Ambient Soundscapes for Focus',
    contentSnippet: 'Discover "Nebula Dreams" by Astral Voyager - perfect for deep work or meditation.',
    imageUrl: '/placeholder.jpg', // Placeholder
    link: '#', // Link to music platform or internal player
    tags: ['Ambient', 'Focus', 'Instrumental']
  },
  {
    id: 'reddit1',
    type: 'reddit',
    title: 'Trending Resonance: What\'s your \"comfort album\"?',
    contentSnippet: 'A lively discussion on r/Music about albums that feel like a warm hug. Share yours!',
    source: 'Reddit r/Music',
    link: '#', // Link to actual Reddit thread
    tags: ['Discussion', 'Comfort Music']
  },
  {
    id: 'twitter1',
    type: 'twitter',
    title: 'Cosmic Note from @StarSounds:',
    contentSnippet: '"Music is the shorthand of emotion." - Leo Tolstoy. What song perfectly captures how you feel today? #MusicQuotes',
    source: 'X @StarSounds',
    link: '#',
    tags: ['Quotes', 'Emotion']
  },
  {
    id: 'community1',
    type: 'community_highlight',
    title: 'Community Chorus: New Collaborative Playlist!',
    author: 'LyraBot',
    contentSnippet: 'Join \"Cosmic Indie Vibes\" - a playlist curated by your fellow Lyra members. Add your favorite tracks!',
    imageUrl: '/placeholder.jpg', // Placeholder
    link: '/community/playlists/cosmic-indie-vibes',
    tags: ['Playlist', 'Indie', 'Collaboration']
  },
];

// --- Helper Components ---
const FeedCard: React.FC<{ item: FeedItem; onReact: (id: string, reaction: 'like' | 'dislike') => void }> = ({ item, onReact }) => {
  const navigate = useNavigate();
  const IconComponent = 
    item.type === 'potential_harmony' ? Star :
    item.type === 'music_discovery' ? ListMusic :
    item.type === 'community_highlight' ? Users2 :
    Zap; // Default for Reddit/Twitter

  return (
    <motion.div
      className="bg-white p-5 rounded-xl shadow-lg border border-slate-200 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, transition: {duration: 0.2} }}
    >
      <div className="flex items-start space-x-4 mb-3">
        {item.imageUrl && (
          <img src={item.imageUrl} alt={item.title} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
        )}
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <IconComponent size={18} className={`mr-2 ${ item.type === 'potential_harmony' ? 'text-indigo-500' : item.type === 'music_discovery' ? 'text-teal-500' : 'text-purple-500' }`} />
            <h3 className="text-lg font-semibold text-slate-800 leading-tight">{item.title}</h3>
          </div>
          {item.source && <p className="text-xs text-slate-500 mb-1">From: {item.source}</p>}
          {item.author && item.type !== 'potential_harmony' && <p className="text-xs text-slate-500 mb-1">By: {item.author}</p>}
          <div className="text-sm text-slate-700 mb-2 prose prose-sm max-w-none">
            {typeof item.contentSnippet === 'string' ? <p>{item.contentSnippet}</p> : item.contentSnippet}
          </div>
        </div>
      </div>

      {item.tags && item.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {item.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">{tag}</span>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center pt-3 border-t border-mediumGray/30">
        {item.link && (
          <Button 
            variant="link" 
            className="text-indigo-600 p-0 h-auto hover:text-indigo-800"
            onClick={() => item.link.startsWith('/') ? navigate(item.link) : window.open(item.link, '_blank')}
          >
            {item.type === 'potential_harmony' ? 'View Profile' : 'Learn More'}
          </Button>
        )}
        {(item.type === 'reddit' || item.type === 'twitter' || item.type === 'music_discovery') && (
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              className={`p-2 h-auto shadow-inner border-green-500 ${item.userReaction === 'like' ? 'bg-green-100 !text-green-700' : 'bg-slate-50 text-slate-500 hover:text-green-600 hover:bg-slate-200'}`} 
              onClick={() => onReact(item.id, 'like')}
            >
              <ThumbsUp size={16} />
            </Button>
            <Button
              size="sm"
              className={`p-2 h-auto shadow-inner border-red-500 ${item.userReaction === 'dislike' ? 'bg-red-100 !text-red-700' : 'bg-slate-50 text-slate-500 hover:text-red-600 hover:bg-slate-200'}`} 
              onClick={() => onReact(item.id, 'dislike')}
            >
              <ThumbsDown size={16} />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- Main Feed Component ---
const Feed: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [feedItems, setFeedItems] = React.useState<FeedItem[]>(mockFeedItems);

  const handleReaction = (itemId: string, reaction: 'like' | 'dislike') => {
    setFeedItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, userReaction: item.userReaction === reaction ? null : reaction } : item
      )
    );
    // In a real app, send this preference to your backend API
    console.log(`User ${reaction}d item ${itemId}. User ID: ${user?.id}`);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-deepIndigo">
        <Sparkles className="h-16 w-16 animate-pulse text-aurora-sky-blue" />
        <p className="ml-4 text-xl text-offWhite">Aligning Your Cosmos...</p>
      </div>
    );
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Stargazer';

  return (
    // The AnimatedCosmicBackground wrapper has been removed.
    // The background will now be inherited from Layout.tsx (bg-background).
    // The text color will default to text-foreground from Layout.tsx.
    <div className="min-h-screen p-4 md:p-6 lg:p-8 pt-20 md:pt-24">
      {/* Section 1: Cosmic Welcome */}
      <motion.section
        className="mb-10 md:mb-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-aurora-sky-blue to-aurora-green-1 animate-pulse-slowly">
            {userName}
          </span>!
        </h1>
        <p className="text-md sm:text-lg text-gray-700">The universe has new harmonies for you today.</p>
      </motion.section>

      {/* Section 3: Harmonic Feed (Activity Stream) */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 flex items-center text-slate-700">
          <Rss size={30} className="mr-3" />
          Your Harmonic Feed
        </h2>

        {feedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedItems.map((item) => (
              <FeedCard key={item.id} item={item} onReact={handleReaction} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-xl">
            <Zap size={48} className="mx-auto text-slate-500 mb-4" />
            <p className="text-xl text-slate-500">Your feed is currently quiet.</p>
            <p className="text-gray-500">Explore, connect, and share your vibes to see it come alive!</p>
          </div>
        )}
      </motion.section>
      </div>

  );
};

export default Feed;
