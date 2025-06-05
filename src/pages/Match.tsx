import React, { useEffect, useState, useMemo, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import { Button } from "@/components/ui/button";
import { Heart, X, RotateCcw, Music2, Headphones, Users, Star, SparklesIcon, Loader2, Info, AlignLeft, CalendarDays, Clock } from "lucide-react"; 
import { useProfileStore } from "@/utils/profileStorage";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase'; 

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
  bio?: string;
  interests?: string[];
  favoriteDecade?: string; 
  preferredListeningTime?: string; 
}

const MatchPage = () => {
  const profile = useProfileStore((state) => state.profile);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, hasCoreProfile, isAuthenticated, enforceAuthRouting, session } = useAuth(); 
  const [isLoading, setIsLoading] = useState(true);

  const [displayableMatches, setDisplayableMatches] = useState<PotentialMatch[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState<string | undefined>();
  const currentIndexRef = useRef(currentIndex);
  const fetchInProgressRef = useRef(false); // Added to track fetch status

  const childRefs = useMemo(
    () =>
      Array(displayableMatches.length)
        .fill(0)
        .map((_) => React.createRef<any>()),
    [displayableMatches.length]
  );

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < displayableMatches.length - 1;
  const canSwipe = currentIndex >= 0 && currentIndex < displayableMatches.length;

  const swiped = async (direction: string, swipedUserId: string, index: number) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
    toast({
      title: `Swiped ${direction} on ${displayableMatches[index]?.name || 'user'}`,
      description: direction === 'right' ? "Let's see if it's a cosmic connection!" : "Exploring other constellations...",
    });

    // TODO: Implement backend logic for recording swipes and checking for matches
    // This likely involves a call to a Supabase Edge Function or a backend service
    if (user) {
      try {
        // Placeholder: Assume a function exists to record the swipe
        // await recordSwipe(user.id, swipedUserId, direction);
        console.log(`TODO: Record swipe in DB: User ${user.id} swiped ${direction} on ${swipedUserId}`);

        if (direction === 'right') {
          // Placeholder: Assume a function exists to check for a mutual match
          // const isMutualMatch = await checkMutualMatch(user.id, swipedUserId);
          // if (isMutualMatch) {
          //   toast({
          //     title: "It's a Match!",
          //     description: `You and ${displayableMatches[index]?.name || 'user'} have connected! ✨`,
          //     variant: "success", // Assuming you have a success variant
          //   });
          //   // TODO: Navigate to chat or update UI to reflect the match
          // }
          console.log(`TODO: Check for mutual match between ${user.id} and ${swipedUserId}`);
        }
      } catch (error) {
        console.error("Error recording swipe or checking match:", error);
        toast({
          title: "Swipe Error",
          description: "Could not process your swipe. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const outOfFrame = (userId: string, idx: number) => {
    console.log(`User ${userId} (${idx}) left the screen! Current index: ${currentIndexRef.current}`);
    // Consider removing from displayableMatches or marking as seen to prevent re-fetch without new logic
  };

  const triggerSwipe = async (dir: 'left' | 'right') => {
    if (canSwipe && childRefs[currentIndex] && childRefs[currentIndex].current) {
      await childRefs[currentIndex].current.swipe(dir);
    }
  };

  const goBackHandler = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    if (childRefs[newIndex] && childRefs[newIndex].current) {
      updateCurrentIndex(newIndex);
      await childRefs[newIndex].current.restoreCard();
      setLastDirection(undefined);
    } else {
      console.warn(`Cannot go back: childRef for index ${newIndex} is not available.`);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) { 
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue your stellar journey",
        variant: "destructive",
      });
      navigate("/login"); 
      return;
    }

    if (isAuthenticated && !hasCoreProfile) { 
      enforceAuthRouting(location.pathname); 
      // Ensure loading state is managed if we return early
      // However, the primary loading state is for fetching matches, 
      // which shouldn't happen if core profile is missing.
      // Consider setting setIsLoading(false) if it was true from a previous state.
      return;
    }

    const fetchMatches = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      if (fetchInProgressRef.current) {
        return; // Already fetching, prevent concurrent calls
      }

      fetchInProgressRef.current = true;
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            id,
            full_name,
            birth_date,
            image_url,
            zodiac_sign, /* Corrected: profiles table has zodiac_sign */
            music_preferences (
              genres,
              artists,
              listening_moods
            ),
            bio,
            interests,
            favorite_decade,
            preferred_listening_time
          `)
          .neq('id', user.id); 

        if (error) throw error;

        if (data) {
          const matches: PotentialMatch[] = data.map((profileData: any) => {
            const calculateAge = (birthDateString: string | null): number => {
              if (!birthDateString) return 0;
              try {
                const birthDate = new Date(birthDateString);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                  age--;
                }
                return age;
              } catch (e) {
                console.error("Error calculating age:", e);
                return 0;
              }
            };

            return {
              id: profileData.id,
              name: profileData.full_name || 'Music Lover', 
              age: calculateAge(profileData.birth_date), 
              image: profileData.image_url || 'https://via.placeholder.com/400x600.png?text=No+Image',
              topGenres: profileData.music_preferences?.genres || [], 
              topArtists: profileData.music_preferences?.artists || [], 
              listeningStyle: profileData.music_preferences?.listening_moods?.[0] || 'Varied', 
              compatibility: Math.floor(Math.random() * (100 - 70 + 1)) + 70, 
              constellation: profileData.zodiac_sign, 
              bio: profileData.bio,
              interests: profileData.interests,
              favoriteDecade: profileData.favorite_decade,
              preferredListeningTime: profileData.preferred_listening_time
            }; // Closes the object returned by the map callback
          }); // Closes the data.map() call
          setDisplayableMatches(matches);
          setCurrentIndex(matches.length - 1);
          currentIndexRef.current = matches.length - 1;
        }
      } catch (err: any) {
        console.error("Error fetching matches: ", err);
        toast({
          title: "Failed to Fetch Matches",
          description: (err as Error).message || "Please try again later.",
          variant: "destructive",
        });
        setDisplayableMatches([]); // Clear matches on error
      } finally {
        setIsLoading(false);
        fetchInProgressRef.current = false; // Reset fetch status
      }
    };

    // Ensure all conditions are met before attempting to fetch
    if (user && hasCoreProfile && isAuthenticated) {
        fetchMatches();
    } else if (!user && isAuthenticated) {
        // User object is null but authenticated (e.g., during initial load or after logout before redirect)
        setIsLoading(false); // Not loading matches if user data isn't fully available
        setDisplayableMatches([]); // Clear any stale matches
    } else {
        // Default to not loading if crucial conditions like isAuthenticated are false
        setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, hasCoreProfile, isAuthenticated, toast]); // Simplified and more stable dependencies

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    );
  }

  // If not loading and no matches, or some other empty state, you might want a specific UI here.
  // For now, it will proceed to the main match UI which handles empty displayableMatches.

  return (
    <div className="flex flex-col items-center min-h-screen p-4 pt-10 sm:pt-12">
      <div className="flex flex-col items-center w-full flex-grow overflow-y-auto pb-4"> 
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-8 sm:mb-10 sleek-heading lyra-logo text-center">Find Your Constellation</h1>
        
        <div className="relative w-full max-w-md sm:max-w-lg max-h-[700px] sm:max-h-[800px] flex-grow flex flex-col"> 
          {displayableMatches.length > 0 ? (
            displayableMatches.map((match, index) => (
              <TinderCard
                ref={childRefs[index]}
                key={match.id}
                className="absolute swipe-card shadow-xl rounded-2xl bg-slate-800/70 overflow-hidden glass-card"
                onSwipe={(dir) => swiped(dir, match.id, index)}
                onCardLeftScreen={() => outOfFrame(match.id, index)}
                preventSwipe={['up', 'down']}
              >
                <div className="flex flex-col w-full"> 
                  <div className="w-full h-3/5 sm:h-1/2 flex-shrink-0"> 
                    <img 
                      src={match.image} 
                      alt={match.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  <div className="relative p-4 sm:p-5 space-y-2 text-slate-700 z-10"> 
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800">
                        {match.name}
                      </h3>
                      <span className="text-xl sm:text-2xl font-light text-slate-600">{match.age}</span>
                      {match.constellation && (
                        <span className="ml-auto text-sm sm:text-base text-[hsl(var(--pale-yellow))] font-medium flex items-center">
                          <SparklesIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-[hsl(var(--vibrant-yellow))]" /> 
                          {match.constellation}
                        </span>
                      )}
                    </div>

                    {match.bio && (
                      <div className="flex items-start gap-2 text-sm sm:text-base">
                        <AlignLeft className="w-4 h-4 sm:w-5 sm:h-5 mt-1 text-[hsl(var(--vibrant-teal))] flex-shrink-0" />
                        <p className="text-slate-500 leading-relaxed hyphens-auto">
                          {match.bio}
                        </p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-2 text-xs sm:text-sm">
                      {match.topGenres && match.topGenres.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Music2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[hsl(var(--vibrant-purple))]" />
                          <span className="text-slate-600 truncate" title={match.topGenres.join(', ')}>{match.topGenres.join(', ')}</span>
                        </div>
                      )}
                      {match.topArtists && match.topArtists.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Headphones className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[hsl(var(--vibrant-pink))]" />
                          <span className="text-slate-600 truncate" title={match.topArtists.join(', ')}>{match.topArtists.join(', ')}</span>
                        </div>
                      )}
                      {match.interests && match.interests.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[hsl(var(--vibrant-yellow))]" />
                          <span className="text-slate-600 truncate" title={match.interests.join(', ')}>{match.interests.join(', ')}</span>
                        </div>
                      )}
                      {match.favoriteDecade && (
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[hsl(var(--vibrant-orange))]" />
                          <span className="text-slate-600 truncate">{match.favoriteDecade}</span>
                        </div>
                      )}
                      {match.preferredListeningTime && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[hsl(var(--vibrant-blue))]" />
                          <span className="text-slate-600 truncate">{match.preferredListeningTime}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[hsl(var(--vibrant-green))]" />
                        <span className="text-slate-600">{match.compatibility}% Harmony</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TinderCard>
            ))
          ) : (
            !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center flex-grow"> 
                <Info className="w-16 h-16 text-slate-500 mb-4" />
                <h2 className="text-2xl font-semibold text-slate-700">No More Constellations</h2>
                <p className="text-slate-500">You've explored all available profiles for now. Check back later!</p>
              </div>
            )
          )}
        </div> 
      </div> 

      {displayableMatches.length > 0 && (
        <div className="w-full py-4 mt-auto flex-shrink-0"> 
          <div className="flex justify-center items-center space-x-5 sm:space-x-6">
            <Button
              variant="outline"
              size="icon"
              className="bg-slate-50 hover:bg-slate-200 border border-slate-300 text-red-600 hover:text-red-700 rounded-full h-18 w-18 sm:h-20 sm:w-20 shadow-inner transition-all hover:scale-105 active:scale-95"
              onClick={() => triggerSwipe('left')}
              disabled={!canSwipe}
            >
              <X className="h-9 w-9 sm:h-10 sm:w-10" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-slate-50 hover:bg-slate-200 border border-slate-300 text-slate-600 hover:text-slate-700 rounded-full h-14 w-14 shadow-inner transition-all hover:scale-105 active:scale-95"
              onClick={goBackHandler}
              disabled={!canGoBack}
            >
              <RotateCcw className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-slate-50 hover:bg-slate-200 border border-slate-300 text-green-600 hover:text-green-700 rounded-full h-18 w-18 sm:h-20 sm:w-20 shadow-inner transition-all hover:scale-105 active:scale-95"
              onClick={() => triggerSwipe('right')}
              disabled={!canSwipe}
            >
              <Heart className="h-9 w-9 sm:h-10 sm:w-10 fill-green-600" />
            </Button>
          </div>
        </div>
      )}

      {lastDirection && (
        <div
          key={lastDirection} 
          className={`fixed bottom-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg text-white font-semibold text-2xl shadow-2xl z-50 
                      ${lastDirection === 'left' ? 'bg-red-500/80' : 'bg-green-500/80'} 
                      animate-swipe-toast`}
        >
          {lastDirection === 'left' ? 'NOPE' : 'LIKED'}
        </div>
      )}
    </div>
  );
};

export default MatchPage;
