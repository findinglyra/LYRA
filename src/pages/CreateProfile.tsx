import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { updateUserProfile, setUserBirthDate, createUserProfile, getUserProfile, updateSocialMediaLinks } from "@/services/user-profile";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, X, Image as ImageIcon, Instagram, Twitter, Music, Loader } from "lucide-react";
import { format, differenceInYears, isValid, parse, isBefore, isAfter } from "date-fns";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CreateProfile = () => {
  const { user, hasProfile, invalidateProfileCache } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date>();
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Social media links with expanded functionality
  const [socialMediaLinks, setSocialMediaLinks] = useState({
    instagram: "",
    spotify: "",
    twitter: "",
    soundcloud: "",
    tiktok: ""
  });
  
  // Track which social platforms are valid
  const [validSocialLinks, setValidSocialLinks] = useState({
    instagram: true,
    spotify: true,
    twitter: true,
    soundcloud: true,
    tiktok: true
  });
  
  // Social media input mode (URL or username)
  const [socialInputMode, setSocialInputMode] = useState("username");
  
  // Calculate age and zodiac sign based on selected date
  const [age, setAge] = useState<number | null>(null);
  const [zodiacSign, setZodiacSign] = useState<string | null>(null);
  
  // Month options for manual date entry
  const months = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];
  
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  // Check for existing profile on component mount
  useEffect(() => {
    if (!user) return; // Only proceed if user is logged in
    
    // Get URL params to prevent redirect loops
    const searchParams = new URLSearchParams(window.location.search);
    const preventRedirectLoop = searchParams.get('noRedirect') === 'true';
    const source = searchParams.get('source') || '';
    
    // If we're coming from a specific source with the noRedirect flag, don't check profile
    if (preventRedirectLoop) {
      console.log(`CreateProfile: Redirect prevention active (source: ${source}), skipping profile check`);
      return;
    }

    setIsLoading(true);
    
    const checkExistingProfile = async () => {
      try {
        console.log("CreateProfile: Checking existing profile for user:", user?.id);
        
        // Check if AuthContext already knows the user has a complete profile
        if (hasProfile) {
          console.log("CreateProfile: User already has a complete profile according to AuthContext");
          toast({
            title: "Profile Already Complete",
            description: "You already have a complete profile. Redirecting to match page.",
          });
          setTimeout(() => navigate('/match'), 1500);
          return;
        }
        
        // If no cached result, get fresh data (reduces Supabase requests)
        const profile = await getUserProfile(user.id);
        
        // Check music preferences only if we have a valid profile
        let hasMusicPreferences = false;
        if (profile && profile.full_name && profile.birth_date) {
          try {
            const { getProfile } = await import('@/services/profile');
            const musicPrefs = await getProfile(user.id);
            hasMusicPreferences = !!musicPrefs;
          } catch (err) {
            console.error("CreateProfile: Error checking music preferences:", err);
            // Continue with profile check even if music prefs check fails
          }
        }
        
        // Check profile completeness
        if (profile && profile.full_name && profile.birth_date) {
          if (hasMusicPreferences) {
            // Complete profile with music preferences exists, redirect to match
            toast({
              title: "Profile Already Exists",
              description: "You have a complete profile. Redirecting to match page.",
            });
            
            // Add a slight delay before redirecting to ensure toast is visible
            setTimeout(() => {
              navigate('/match');
            }, 1500);
            return;
          } else {
            // Profile exists but no music preferences, redirect to music preferences
            toast({
              title: "Profile Exists",
              description: "Please complete your music preferences.",
            });
            
            // Add source and noRedirect params to prevent loops
            navigate('/music-preferences?source=create-profile&noRedirect=true');
            return;
          }
        } else if (profile) {
          // Profile exists but is incomplete, populate the form with existing data
          setFullName(profile.full_name || '');
          setUsername(profile.username || '');
          setBio(profile.bio || '');
          
          // Set birth date if available
          if (profile.birth_date) {
            const birthDate = new Date(profile.birth_date);
            setDate(birthDate);
            
            // Set manual date selections too
            setSelectedYear(birthDate.getFullYear().toString());
            setSelectedMonth(birthDate.getMonth().toString());
            setSelectedDay(birthDate.getDate().toString());
          }
          
          // Set profile image if available
          if (profile.avatar_url) {
            setProfileImageUrl(profile.avatar_url);
            setImagePreview(profile.avatar_url);
          }
          
          // Handle social media links if available
          if (profile.social_links) {
            const links = profile.social_links as Record<string, string>;
            setSocialMediaLinks({
              instagram: links.instagram || '',
              spotify: links.spotify || '',
              twitter: links.twitter || '',
              soundcloud: links.soundcloud || '',
              tiktok: links.tiktok || ''
            });
          }
          
          toast({
            title: "Incomplete Profile Found",
            description: "We've loaded your existing information. Please fill in the remaining details.",
          });
        } else {
          // No profile found, set default username from email
          if (user?.email) {
            const defaultUsername = user.email.split('@')[0];
            setUsername(defaultUsername);
          }
        }
      } catch (error) {
        console.error("Error checking for existing profile:", error);
        toast({
          title: "Error",
          description: "There was a problem checking your profile. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkExistingProfile();
  }, [user, navigate, toast]);
  
  // Update age and zodiac sign when date changes
  useEffect(() => {
    if (date) {
      // Calculate age
      const today = new Date();
      const calculatedAge = differenceInYears(today, date);
      setAge(calculatedAge);
      
      // Calculate zodiac sign
      const month = date.getMonth() + 1; // JavaScript months are 0-indexed
      const day = date.getDate();
      
      let sign = "";
      if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) sign = "Aquarius";
      else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) sign = "Pisces";
      else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) sign = "Aries";
      else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) sign = "Taurus";
      else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) sign = "Gemini";
      else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) sign = "Cancer";
      else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) sign = "Leo";
      else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) sign = "Virgo";
      else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) sign = "Libra";
      else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) sign = "Scorpio";
      else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) sign = "Sagittarius";
      else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) sign = "Capricorn";
      
      setZodiacSign(sign);
    } else {
      setAge(null);
      setZodiacSign(null);
    }
  }, [date]);
  
  // Handle file selection for profile image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      
      setProfileImageFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle removing the selected image
  const handleRemoveImage = () => {
    setProfileImageFile(null);
    setImagePreview(null);
    setProfileImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Validate social media links
  const validateSocialLinks = () => {
    const validators = {
      instagram: (value: string) => {
        if (!value) return true;
        if (socialInputMode === "username") {
          return /^@?[\w\.]+$/.test(value) && !value.includes("http");
        } else {
          return /^https?:\/\/(www\.)?instagram\.com\/[\w\.]+\/?$/.test(value);
        }
      },
      twitter: (value: string) => {
        if (!value) return true;
        if (socialInputMode === "username") {
          return /^@?[\w\.]+$/.test(value) && !value.includes("http");
        } else {
          return /^https?:\/\/(www\.)?(twitter|x)\.com\/[\w\.]+\/?$/.test(value);
        }
      },
      spotify: (value: string) => {
        if (!value) return true;
        if (socialInputMode === "username") {
          return /^[\w\.]+$/.test(value) && !value.includes("http");
        } else {
          return /^https?:\/\/(www\.|open\.)?spotify\.com\/(user|artist)\/[\w\.]+\/?$/.test(value);
        }
      },
      soundcloud: (value: string) => {
        if (!value) return true;
        if (socialInputMode === "username") {
          return /^[\w\.\-]+$/.test(value) && !value.includes("http");
        } else {
          return /^https?:\/\/(www\.)?soundcloud\.com\/[\w\.\-]+\/?$/.test(value);
        }
      },
      tiktok: (value: string) => {
        if (!value) return true;
        if (socialInputMode === "username") {
          return /^@?[\w\.]+$/.test(value) && !value.includes("http");
        } else {
          return /^https?:\/\/(www\.)?tiktok\.com\/@[\w\.]+\/?$/.test(value);
        }
      }
    };

    // Validate each link
    const newValidState = Object.entries(socialMediaLinks).reduce((acc, [key, value]) => {
      const platform = key as keyof typeof socialMediaLinks;
      const validator = validators[platform];
      acc[platform] = validator(value);
      return acc;
    }, {} as Record<keyof typeof socialMediaLinks, boolean>);

    setValidSocialLinks(newValidState);
    return Object.values(newValidState).every(Boolean);
  };

  // Format social media links for database storage
  const formatSocialLinks = () => {
    const formatted: Record<string, string> = {};
    
    Object.entries(socialMediaLinks).forEach(([platform, value]) => {
      if (!value) return;
      
      // Skip invalid links
      if (!validSocialLinks[platform as keyof typeof validSocialLinks]) return;
      
      // If username mode, convert to standard URL format
      if (socialInputMode === "username" && value) {
        const username = value.startsWith("@") ? value.substring(1) : value;
        
        switch (platform) {
          case "instagram":
            formatted[platform] = `https://instagram.com/${username}`;
            break;
          case "twitter":
            formatted[platform] = `https://twitter.com/${username}`;
            break;
          case "spotify":
            formatted[platform] = `https://open.spotify.com/user/${username}`;
            break;
          case "soundcloud":
            formatted[platform] = `https://soundcloud.com/${username}`;
            break;
          case "tiktok":
            formatted[platform] = `https://tiktok.com/@${username}`;
            break;
        }
      } else if (value) {
        // URL mode - store as is
        formatted[platform] = value;
      }
    });
    
    return formatted;
  };

  // Function to upload image to Supabase Storage
  const uploadProfileImage = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      
      // Create a unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("user-content")
        .upload(filePath, file);
      
      if (uploadError) {
        throw new Error(`Error uploading image: ${uploadError.message}`);
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from("user-content")
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  // Set date from manual selection
  const updateDateFromSelections = () => {
    if (selectedYear && selectedMonth && selectedDay) {
      const year = parseInt(selectedYear);
      const month = parseInt(selectedMonth);
      const day = parseInt(selectedDay);
      
      // Validate date
      const newDate = new Date(year, month, day);
      if (!isNaN(newDate.getTime())) {
        setDate(newDate);
      }
    }
  };
  
  // Generate days array based on selected month and year
  const getDaysInMonth = (): number => {
    if (!selectedMonth || !selectedYear) return 31;
    
    const year = parseInt(selectedYear);
    const month = parseInt(selectedMonth);
    
    return new Date(year, month + 1, 0).getDate();
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please log in to create your profile",
        variant: "destructive"
      });
      navigate("/login");
    }
  }, [user, navigate, toast]);

  // Input sanitization functions
  const sanitizeText = (text: string): string => {
    // Remove any HTML tags and trim whitespace
    return text.replace(/<[^>]*>/g, '').trim();
  };

  const sanitizeUsername = (text: string): string => {
    // Replace spaces with underscores and remove special characters
    return text.replace(/\s+/g, '_').replace(/[^\w]/g, '').toLowerCase().trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitize inputs
    try {
      setIsSubmitting(true);
      
      if (!user) {
        toast({
          title: "Not authenticated",
          description: "Please sign in to continue",
          variant: "destructive",
        });
        return;
      }
      
      if (!date) {
        toast({
          title: "Birth date required",
          description: "Please enter your birth date",
          variant: "destructive",
        });
        return;
      }
      
      // Check if user is at least 18 years old
      const today = new Date();
      const userAge = differenceInYears(today, date);
      if (userAge < 18) {
        toast({
          title: "Age restriction",
          description: "You must be at least 18 years old to use this platform",
          variant: "destructive",
        });
        return;
      }
      
      // Basic input validation
      if (!fullName.trim() || !username.trim() || !bio.trim()) {
        toast({
          title: "Missing required fields",
          description: "Please fill out all required fields",
          variant: "destructive",
        });
        return;
      }
      
      // Validate social media links
      if (!validateSocialLinks()) {
        toast({
          title: "Invalid social media links",
          description: "Please correct the highlighted social media links",
          variant: "destructive",
        });
        return;
      }
      
      // Format social media links for storage
      const formattedSocialLinks = formatSocialLinks();
      
      // Handle profile image upload if a file was selected
      let imageUrl = profileImageUrl; // Start with URL if provided
      if (profileImageFile) {
        try {
          imageUrl = await uploadProfileImage(profileImageFile);
        } catch (error) {
          console.error("Error uploading profile image:", error);
          toast({
            title: "Image upload failed",
            description: "Failed to upload profile image. Please try again or use an image URL instead.",
            variant: "destructive",
          });
          return;
        }
      }
      
      // Format birth date for database
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      // Sanitize inputs to prevent XSS attacks
      const sanitizedFullName = fullName.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const sanitizedBio = bio.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const sanitizedUsername = username.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const sanitizedLocation = location.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
      
      // Format bio to include location - now we separate location from bio
      // as we have proper social media storage
      const formattedBio = sanitizedLocation ? `${sanitizedBio}\n\nLocation: ${sanitizedLocation}` : sanitizedBio;
      
      // Format bio to include social links temporarily (until migration is run)
      let socialLinksText = '';
      if (Object.keys(formattedSocialLinks).length > 0) {
        socialLinksText = '\n\nSocial Links:\n';
        Object.entries(formattedSocialLinks).forEach(([platform, url]) => {
          if (url) {
            socialLinksText += `${platform}: ${url}\n`;
          }
        });
      }

      // Add social links to bio temporarily until database schema is updated
      const bioWithSocialLinks = formattedBio + socialLinksText;
      
      // Try to create a new profile (in case trigger didn't work)
      let profile = await createUserProfile({
        full_name: sanitizedFullName,
        bio: bioWithSocialLinks, // Include social links in bio for now
        username: sanitizedUsername,
        avatar_url: imageUrl || null,
        // Remove social_links field until migration is run
      }, user.id);
      
      // If profile exists, update it instead
      if (!profile) {
        console.log("Profile already exists, updating instead");
        profile = await updateUserProfile({
          full_name: sanitizedFullName,
          bio: bioWithSocialLinks, // Include social links in bio for now
          username: sanitizedUsername,
          avatar_url: imageUrl || null,
          // Remove social_links field until migration is run
        }, user.id);
      }
      
      // Set birth date (this also sets zodiac sign)
      if (profile) {
        await setUserBirthDate(formattedDate, user.id);
        
        // NOTE: Social links functionality commented out until database migration is run
        /* 
        // Update social links separately to ensure they're saved
        if (Object.keys(formattedSocialLinks).length > 0) {
          await updateSocialMediaLinks(formattedSocialLinks);
        }
        */
      } else {
        throw new Error("Failed to create or update profile");
      }
      
      // Invalidate cache after successful profile update
      if (user?.id) {
        invalidateProfileCache(user.id);
      }
      
      toast({
        title: "Profile Created Successfully",
        description: "You'll now be redirected to set up your music preferences.",
        duration: 3000, // Show for 3 seconds to ensure user sees it
      });
      
      // Navigate to the music preferences page
      navigate("/music-preferences");
      
    } catch (error) {
      console.error("Error creating profile:", error);
      toast({
        title: "Error creating profile",
        description: typeof error === 'object' && error !== null && 'message' in error
          ? String(error.message)
          : "There was a problem saving your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fadeIn">
      {isLoading || isSubmitting ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Loader className="h-12 w-12 animate-spin text-white" />
        </div>
      ) : (
        <></>
      )}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
          <h3 className="text-xl font-medium">Checking profile status...</h3>
          <p className="text-muted-foreground">Please wait while we retrieve your information</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Create Your Profile</h1>
              <p className="text-muted-foreground">
                Tell us about yourself to help find your perfect musical match
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center">
              Full Name <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="fullName"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              maxLength={50}
              required
              aria-required="true"
            />
            <p className="text-xs text-muted-foreground">Required. Maximum 50 characters.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username" className="flex items-center">
              Username <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="username"
              placeholder="Choose a unique username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={3}
              maxLength={30}
              pattern="[a-zA-Z0-9_]+"
              required
              aria-required="true"
            />
            <p className="text-sm text-muted-foreground">Required. 3-30 characters, letters, numbers and underscores only. Will be visible to others.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="City, Country"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">Help find matches in your area.</p>
          </div>
          
          <div className="space-y-4">
            <Label className="flex items-center">
              Birth Date <span className="text-red-500 ml-1">*</span>
            </Label>
            
            {/* Two options for date entry - calendar or manual */}
            <div className="space-y-4">
              {/* Calendar picker */}
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="birthdate"
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${!date ? 'text-muted-foreground' : ''}`}
                      aria-required="true"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date from calendar</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4 z-50" align="start">
                    {/* Year selection first for better usability */}
                    <div className="mb-3 space-y-1.5">
                      <Label>Birth Year</Label>
                      <Select 
                        value={selectedYear || new Date().getFullYear() - 25 + ''}
                        onValueChange={(value) => {
                          setSelectedYear(value);
                          
                          // Create a date object using the selected year but keep other parts
                          if (date) {
                            const newDate = new Date(date);
                            newDate.setFullYear(parseInt(value));
                            if (isValid(newDate)) {
                              setDate(newDate);
                            }
                          } else {
                            // Default to January 1st of selected year if no date set
                            const newDate = new Date(parseInt(value), 0, 1);
                            setDate(newDate);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[var(--radix-select-content-available-height)] overflow-y-auto">
                          <div className="flex justify-between px-2 py-1.5 text-sm font-medium">
                            <span>Common Birth Years</span>
                          </div>
                          {/* Show most common birth years for users (21-40 years old) */}
                          {Array.from(
                            { length: 20 }, 
                            (_, i) => new Date().getFullYear() - 21 - i
                          ).map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year} ({new Date().getFullYear() - year} years old)
                            </SelectItem>
                          ))}
                          
                          <div className="flex justify-between px-2 py-1.5 text-sm font-medium border-t">
                            <span>Other Years</span>
                          </div>
                          {/* Show older years in groups for better navigation */}
                          {Array.from(
                            { length: 8 }, 
                            (_, i) => {
                              const startYear = Math.floor((new Date().getFullYear() - 18) / 10) * 10 - i * 10;
                              return (
                                <div key={startYear} className="px-2 py-1.5">
                                  <div className="text-xs text-muted-foreground mb-1">{startYear} - {startYear - 4}</div>
                                  {Array.from({ length: 5 }, (_, j) => startYear - j).map(year => (
                                    <SelectItem key={year} value={year.toString()} className="py-1">
                                      {year} ({new Date().getFullYear() - year} years old)
                                    </SelectItem>
                                  ))}
                                </div>
                              );
                            }
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      defaultMonth={date || new Date(parseInt(selectedYear || (new Date().getFullYear() - 25).toString()), 0)}
                      disabled={(date) => {
                        // Must be at least 18 years old and not in the future
                        const now = new Date();
                        const minDate = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
                        const maxDate = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
                        return date > maxDate || date < minDate;
                      }}
                      initialFocus
                      className="border rounded-md bg-white shadow-md"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Manual date entry */}
              <div className="mt-4 border-t pt-4">
                <div className="text-sm mb-2 font-medium">Or enter date manually:</div>
                <div className="grid grid-cols-3 gap-3">
                  {/* Year selector - now first for better UX */}
                  <div>
                    <Label htmlFor="year-select" className="text-xs mb-1 block">Year</Label>
                    <Select
                      value={selectedYear}
                      onValueChange={(value) => {
                        setSelectedYear(value);
                        
                        // Set calendar date to match when year changes
                        if (date) {
                          const newDate = new Date(date);
                          newDate.setFullYear(parseInt(value));
                          if (isValid(newDate)) {
                            setDate(newDate);
                          }
                        }
                        
                        setTimeout(updateDateFromSelections, 0);
                      }}
                    >
                      <SelectTrigger id="year-select" className="w-full">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[var(--radix-select-content-available-height)] overflow-y-auto">
                        {/* Group years by decades for easy navigation */}
                        {Array.from({ length: 9 }, (_, i) => {
                          const decadeStart = Math.floor((new Date().getFullYear() - 18) / 10) * 10 - i * 10;
                          return (
                            <div key={decadeStart} className="py-1">
                              <div className="text-xs text-muted-foreground mb-1 px-2">{decadeStart}s</div>
                              {Array.from({ length: 10 }, (_, j) => decadeStart + 9 - j).map(year => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </div>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Month selector */}
                  <div>
                    <Label htmlFor="month-select" className="text-xs mb-1 block">Month</Label>
                    <Select 
                      value={selectedMonth}
                      onValueChange={(value) => {
                        setSelectedMonth(value);
                        
                        // Update calendar when month changes
                        if (date && selectedYear) {
                          const newDate = new Date(date);
                          newDate.setMonth(parseInt(value));
                          if (isValid(newDate)) {
                            setDate(newDate);
                          }
                        }
                        
                        setTimeout(updateDateFromSelections, 0);
                      }}
                    >
                      <SelectTrigger id="month-select" className="w-full">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Day selector */}
                  <div>
                    <Label htmlFor="day-select" className="text-xs mb-1 block">Day</Label>
                    <Select
                      value={selectedDay}
                      onValueChange={(value) => {
                        setSelectedDay(value);
                        
                        // Update calendar when day changes
                        if (date && selectedMonth && selectedYear) {
                          const newDate = new Date(date);
                          newDate.setDate(parseInt(value));
                          if (isValid(newDate)) {
                            setDate(newDate);
                          }
                        }
                        
                        setTimeout(updateDateFromSelections, 0);
                      }}
                      disabled={!selectedMonth || !selectedYear}
                    >
                      <SelectTrigger id="day-select" className="w-full">
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: getDaysInMonth() }, (_, i) => i + 1).map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Birth date summary and zodiac sign */}
            <div className="mt-2">
              {date && (
                <div className="bg-muted p-3 rounded-md">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Age:</span>
                    <span className="text-sm">{age} years old</span>
                  </div>
                  {zodiacSign && (
                    <div className="flex justify-between mt-1">
                      <span className="text-sm font-medium">Zodiac Sign:</span>
                      <span className="text-sm">{zodiacSign}</span>
                    </div>
                  )}
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-2">Required. You must be at least 18 years old.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <Label htmlFor="profile-image" className="block">Profile Picture</Label>
            
            <div className="flex flex-col items-center space-y-4">
              {/* Image preview */}
              {imagePreview ? (
                <div className="relative h-40 w-40 rounded-full overflow-hidden border border-border">
                  <img 
                    src={imagePreview} 
                    alt="Profile preview" 
                    className="h-full w-full object-cover" 
                  />
                  <button 
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-0 right-0 bg-destructive text-destructive-foreground p-1 rounded-full"
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="h-40 w-40 rounded-full bg-muted flex items-center justify-center border border-border">
                  <ImageIcon className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
              
              {/* Upload button and input */}
              <div className="w-full flex flex-col space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2"
                  disabled={isUploading}
                >
                  <Upload size={16} />
                  {isUploading ? "Uploading..." : "Upload Profile Picture"}
                </Button>
                
                <input
                  ref={fileInputRef}
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <p className="text-xs text-center text-muted-foreground">
                  Recommended: JPG, PNG. Max 5MB.
                </p>
              </div>
              
              {/* Alternative URL input */}
              <div className="w-full">
                <div className="flex items-center my-2">
                  <div className="flex-grow h-px bg-border"></div>
                  <p className="px-3 text-xs text-muted-foreground">OR</p>
                  <div className="flex-grow h-px bg-border"></div>
                </div>
                
                <Input
                  id="profileImageUrl"
                  placeholder="Enter image URL instead"
                  value={profileImageUrl}
                  onChange={(e) => {
                    setProfileImageUrl(e.target.value);
                    setProfileImageFile(null);
                    setImagePreview(null);
                  }}
                  disabled={!!imagePreview}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Social Media Links</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="w-20 text-sm">Instagram:</span>
                <Input
                  placeholder="@username"
                  value={socialMediaLinks.instagram}
                  onChange={(e) => setSocialMediaLinks(prev => ({ ...prev, instagram: e.target.value }))}
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-20 text-sm">Spotify:</span>
                <Input
                  placeholder="Username or profile URL"
                  value={socialMediaLinks.spotify}
                  onChange={(e) => setSocialMediaLinks(prev => ({ ...prev, spotify: e.target.value }))}
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-20 text-sm">Twitter:</span>
                <Input
                  placeholder="@username"
                  value={socialMediaLinks.twitter}
                  onChange={(e) => setSocialMediaLinks(prev => ({ ...prev, twitter: e.target.value }))}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio" className="flex items-center">
              About You <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell us a bit about yourself and your musical journey"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="min-h-24"
              maxLength={500}
              required
              aria-required="true"
            />
            <div className="flex justify-between">
              <p className="text-sm text-muted-foreground">Required. Maximum 500 characters.</p>
              <p className="text-xs text-muted-foreground">{bio.length}/500</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button 
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Button type="submit" disabled={isLoading || isSubmitting}>
            {isLoading || isSubmitting ? "Saving..." : "Continue to Music Preferences"}
          </Button>
        </div>
      </form>
        </>
      )}
    </div>
  );
};

export default CreateProfile;
