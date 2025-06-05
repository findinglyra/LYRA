import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { createUserProfile, updateUserProfile, getUserProfile, Profile, setUserBirthDate } from "@/services/user-profile";
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
import { parseISO } from 'date-fns'; // Added for robust date parsing
import { useTheme } from "next-themes"; // Added import

const CreateProfile = () => {
  const { user, hasCoreProfile: hasProfile, loading: authLoading, completionCheckLoading, isAuthenticated, invalidateProfileCache } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Define months array for manual date selection
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

  // Existing form states (ensure these match yours)
  const [currentStep, setCurrentStep] = useState(1);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [age, setAge] = useState<number | null>(null);
  const [zodiacSign, setZodiacSign] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null); // For displaying existing or uploaded image
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [favoriteDecade, setFavoriteDecade] = useState<string>('');
  const [location, setLocation] = useState(''); // Added location state
  const [preferredListeningTime, setPreferredListeningTime] = useState<string>('');
  const [showConstellationModal, setShowConstellationModal] = useState(false);
  const [selectedConstellation, setSelectedConstellation] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    spotify: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    github: '',
    website: '',
  });
  const [validSocialLinks, setValidSocialLinks] = useState<Record<keyof typeof socialLinks, boolean>>({
    instagram: false,
    spotify: false,
    twitter: false,
    facebook: false,
    linkedin: false,
    github: false,
    website: false,
  });
  const [socialInputMode, setSocialInputMode] = useState<'username' | 'url'>('username'); // Or 'url' as default
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>(''); // Added state for selected year
  const [selectedDay, setSelectedDay] = useState<string>(""); // Added selectedDay state
  const [profileDataAppliedToFormForUserId, setProfileDataAppliedToFormForUserId] = useState<string | null>(null);

  // New states to manage profile loading for the form
  const [isLoadingProfileForForm, setIsLoadingProfileForForm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setTheme } = useTheme();

  const combinedLoading = authLoading || completionCheckLoading || isLoadingProfileForForm;

  // Effect to load existing profile data into the form
  useEffect(() => {
    const loadAndPrefillForm = async () => {
      if (!user) { // User logged out or not yet available
        setProfileDataAppliedToFormForUserId(null); // Reset tracker
        // Reset form fields to empty/default state
        setUsername('');
        setFullName('');
        setBio('');
        setImageUrl(null);
        setDate(undefined);
        setInterests([]);
        setFavoriteDecade('');
        setPreferredListeningTime('');
        setSelectedConstellation(null);
        // Reset other form states as needed
        setIsLoadingProfileForForm(false); // Ensure loading is off
        return;
      }

      // If profile data for THIS user.id has already been applied, or if we're already loading it, do nothing.
      if (profileDataAppliedToFormForUserId === user.id || isLoadingProfileForForm) {
        return;
      }

      setIsLoadingProfileForForm(true);

      try {
        if (hasProfile) { // AuthContext indicates a core profile exists. Attempt to fetch and prefill.
          console.log(`CreateProfile: User ${user.id} has core profile. Fetching details.`);
          const existingProfile = await getUserProfile(user.id); // THE API CALL

          if (existingProfile) {
            console.log(`CreateProfile: Prefilling form for ${user.id} with existing profile data.`);
            setUsername(existingProfile.username || (user.email ? user.email.split('@')[0] : ''));
            setFullName(existingProfile.full_name || ''); // Assuming UserProfileData has full_name
            setBio(existingProfile.bio || '');
            setImageUrl(existingProfile.avatar_url || null);
            if (existingProfile.birth_date) {
              try {
                const parsedDate = parseISO(existingProfile.birth_date);
                if (!isNaN(parsedDate.getTime())) {
                  setDate(parsedDate);
                } else {
                  console.warn("CreateProfile: Failed to parse birth_date from profile:", existingProfile.birth_date);
                  setDate(undefined);
                }
              } catch (e) {
                console.error("CreateProfile: Error parsing birth_date:", e);
                setDate(undefined);
              }
            }
            // Assuming UserProfileData might have these fields from your state list
            setInterests((existingProfile as any).interests || []); 
            setFavoriteDecade((existingProfile as any).favorite_decade || '');
            setPreferredListeningTime((existingProfile as any).preferred_listening_time || '');
            setSelectedConstellation((existingProfile as any).constellation || null);
            // Set other form fields from 'existingProfile' as needed

            setProfileDataAppliedToFormForUserId(user.id); // Mark that data for this user.id has been applied.
          } else {
            console.warn(`CreateProfile: Core profile indicated for ${user.id}, but no profile data found. Setting defaults.`);
            setUsername(user.email ? user.email.split('@')[0] : '');
            setFullName(''); setBio(''); setImageUrl(null); setDate(undefined);
            setInterests([]); setFavoriteDecade(''); setPreferredListeningTime(''); setSelectedConstellation(null);
          }
        } else { // AuthContext indicates no core profile. Set defaults for new profile creation.
          console.log(`CreateProfile: No core profile for ${user.id}. Setting defaults for new profile.`);
          setUsername(user.email ? user.email.split('@')[0] : '');
          setFullName(''); setBio(''); setImageUrl(null); setDate(undefined);
          setInterests([]); setFavoriteDecade(''); setPreferredListeningTime(''); setSelectedConstellation(null);
        }
      } catch (error) {
        console.error("CreateProfile: Error in loadAndPrefillForm:", error);
        toast({
          title: "Error Loading Profile",
          description: "There was an issue loading your profile data. You may need to enter details manually or refresh.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProfileForForm(false);
      }
    };

    loadAndPrefillForm();
  }, [user, hasProfile, toast, navigate]);

  // Update age and zodiac sign when date changes

  const handleSaveAndContinue = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save your profile.",
        variant: "destructive",
      });
      return;
    }

    // --- Basic Client-Side Validation (Expand as needed) ---
    if (!fullName.trim()) {
      toast({ title: "Full Name Required", description: "Please enter your full name.", variant: "destructive" });
      return;
    }
    if (!username.trim()) {
      toast({ title: "Username Required", description: "Please enter a username.", variant: "destructive" });
      return;
    }
    if (!date) {
      toast({ title: "Birth Date Required", description: "Please select your birth date.", variant: "destructive" });
      return;
    }
    if (age !== null && age < 18) {
      toast({ title: "Age Restriction", description: "You must be at least 18 years old to use Findinglyra.", variant: "destructive" });
      return;
    }
    if (!location.trim()) {
      toast({ title: "Location Required", description: "Please enter your location.", variant: "destructive" });
      return;
    }
    if (!bio.trim()) {
      toast({ title: "Bio Required", description: "Please tell us a bit about yourself.", variant: "destructive" });
      return;
    }
    // Add more validation for other required fields if necessary

    setIsSubmitting(true);

    try {
      const profileData: Partial<Profile> = {
        id: user.id, // Ensure id is included for updates
        username: username.trim(),
        full_name: fullName.trim(),
        bio: bio.trim(),
        birth_date: date ? format(date, "yyyy-MM-dd") : null, // Format date for Supabase
        avatar_url: imageUrl, // This should be the URL from Supabase Storage after upload
        // location: location.trim(), // Temporarily removed to align with profiles table schema and fix type error
        zodiac_sign: selectedConstellation, // Map to zodiac_sign column
        // location: location.trim(), // Temporarily removed, pending schema/service function review
        // interests: interests, // Temporarily removed, pending schema/service function review
        // favorite_decade: favoriteDecade, // Temporarily removed, pending schema/service function review
        // preferred_listening_time: preferredListeningTime, // Temporarily removed, pending schema/service function review
        // If your 'profiles' table has an 'is_profile_complete' boolean flag, you might set it here:
        // is_profile_complete: true,
      };

      let success = false;
      if (hasProfile) {
        console.log(`CreateProfile: Updating existing profile for user ${user.id}`);
        await updateUserProfile(profileData, user.id); 
        success = true;
      } else {
        console.log(`CreateProfile: Creating new profile for user ${user.id}`);
        await createUserProfile(profileData); 
        success = true;
      }

      if (success) {
        // If social links are managed separately and have been modified, save them
        // This depends on your exact logic for social links.
        // Example: if (Object.values(socialLinks).some(link => link.trim() !== '')) {
        //   await updateSocialMediaLinks(user.id, socialLinks);
        // }

        await invalidateProfileCache(user.id); // Crucial: Invalidate cache so AuthContext re-fetches completion status
        
        toast({
          title: "Profile Saved!",
          description: "Your core profile information has been saved.",
        });
        
        // Navigation to /music-preferences will be handled by AuthContext's enforceAuthRouting
        // once the hasCoreProfile state is updated and detected.
        console.log("CreateProfile: Profile saved. AuthContext will handle redirection.");
      }

    } catch (error: any) {
      console.error("CreateProfile: Error saving profile:", error);
      toast({
        title: "Save Failed",
        description: error.message || "Could not save your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  // Sync calendar date selection to manual dropdowns
  useEffect(() => {
    if (date) {
      const newDay = String(date.getDate());
      const newMonth = String(date.getMonth()); // 0-indexed
      const newYear = String(date.getFullYear());

      if (selectedDay !== newDay) setSelectedDay(newDay);
      if (selectedMonth !== newMonth) setSelectedMonth(newMonth);
      if (selectedYear !== newYear) setSelectedYear(newYear);
    } else {
      // If date is cleared, clear dropdowns too, unless they are already clear
      if (selectedDay !== "") setSelectedDay("");
      if (selectedMonth !== "") setSelectedMonth("");
      if (selectedYear !== "") setSelectedYear("");
    }
  }, [date]); // Removed selectedDay, selectedMonth, selectedYear from deps to avoid loops
  
  // Set date from manual selection (called by useEffect below)
  const updateDateFromSelections = () => {
    if (selectedYear && selectedMonth && selectedDay) {
      const year = parseInt(selectedYear);
      const month = parseInt(selectedMonth); // This is 0-indexed as per state
      const day = parseInt(selectedDay);
      
      // Validate date parts
      if (isNaN(year) || isNaN(month) || isNaN(day) || month < 0 || month > 11 || day < 1 || day > 31) {
        // Optionally, provide feedback for invalid partial input, or just don't update
        return;
      }

      const newDate = new Date(year, month, day);
      
      // Further validation: ensure the date created is valid (e.g., not Feb 30)
      // and also that the month and day correspond to what was set (Date object can auto-correct)
      if (!isNaN(newDate.getTime()) && 
          newDate.getFullYear() === year && 
          newDate.getMonth() === month && 
          newDate.getDate() === day) {
        // Only update if the newDate is different from the current date state
        if (!date || newDate.getTime() !== date.getTime()) {
          setDate(newDate);
        }
      }
    }
  };

  // Sync manual dropdown selections to calendar date
  useEffect(() => {
    updateDateFromSelections();
  }, [selectedDay, selectedMonth, selectedYear]);
  
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
      
      setImageFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle removing the selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImageUrl(null);
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
      },
      facebook: (value: string) => {
        if (!value) return true;
        if (socialInputMode === "username") {
          return /^@?[\w\.]+$/.test(value) && !value.includes("http"); // Basic username check
        } else {
          return /^https?:\/\/(www\.)?facebook\.com\/[\w\.]+\/?$/.test(value);
        }
      },
      linkedin: (value: string) => {
        if (!value) return true;
        if (socialInputMode === "username") {
          // LinkedIn usernames can be more complex, often not directly used in URLs like other platforms
          // For simplicity, we'll allow a general username format or a URL part
          return /^@?[\w\.\-]+$/.test(value) && !value.includes("http"); 
        } else {
          return /^https?:\/\/(www\.)?linkedin\.com\/(in\/[\w\.\-]+|company\/[\w\.\-]+)\/?$/.test(value);
        }
      },
      github: (value: string) => {
        if (!value) return true;
        if (socialInputMode === "username") {
          return /^@?[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/.test(value) && !value.includes("http"); // GitHub username regex
        } else {
          return /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*\/?$/.test(value);
        }
      },
      website: (value: string) => {
        if (!value) return true; // Empty is considered valid (optional field)
        // Basic URL validation: checks for http:// or https:// followed by non-space characters.
        return /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(value);
      }
    };

    // Validate each link
    const newValidState = Object.entries(socialLinks).reduce((acc, [key, value]) => {
      const platform = key as keyof typeof socialLinks;
      const validator = validators[platform];
      acc[platform] = validator(value);
      return acc;
    }, {} as Record<keyof typeof socialLinks, boolean>);

    setValidSocialLinks(newValidState);
    return Object.values(newValidState).every(Boolean);
  };

  // Format social media links for database storage
  const formatSocialLinks = () => {
    const formatted: Record<string, string> = {};
    
    Object.entries(socialLinks).forEach(([platform, value]) => {
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
      let finalImageUrl = imageUrl; // Use the state variable 'imageUrl' as initial value
      if (imageFile) {
        try {
          finalImageUrl = await uploadProfileImage(imageFile); // Update local variable
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
        avatar_url: finalImageUrl || null, // Use the corrected local variable
        // Remove age property as it's derived from birth_date
        // Remove social_links field until migration is run
      }, user.id);
      
      // If profile exists, update it instead
      if (!profile) {
        console.log("Profile already exists, updating instead");
        profile = await updateUserProfile({
          full_name: sanitizedFullName,
          bio: bioWithSocialLinks, // Include social links in bio for now
          username: sanitizedUsername,
          avatar_url: finalImageUrl || null, // Use the corrected local variable
          // Remove age property as it's derived from birth_date
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
      {(combinedLoading || isSubmitting) ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Loader className="h-12 w-12 animate-spin text-white" />
        </div>
      ) : (
        <></>
      )}
      {combinedLoading ? (
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
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      captionLayout="dropdown-buttons"
                      fromYear={new Date().getFullYear() - 100} // Allow selection up to 100 years ago
                      toYear={new Date().getFullYear() - 18}   // Allow selection up to 18 years ago
                      defaultMonth={date || new Date(new Date().getFullYear() - 25, 0)} // Default to 25 years ago, Jan
                      disabled={(d) => { // Renamed 'date' parameter to 'd' to avoid conflict
                        // Must be at least 18 years old and not more than 100 years old.
                        const now = new Date();
                        const minBirthDate = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
                        const maxBirthDate = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
                        return d > maxBirthDate || d < minBirthDate;
                      }}
                      initialFocus
                      className="border rounded-md bg-white shadow-md p-2" // Added padding for aesthetics
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
                      <SelectContent className="z-50 bg-background max-h-[200px] overflow-y-auto">
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
                      <SelectContent className="z-50 bg-background max-h-[200px] overflow-y-auto">
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
                      <SelectContent className="z-50 bg-background max-h-[200px] overflow-y-auto">
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
              {imageUrl ? (
                <div className="relative h-40 w-40 rounded-full overflow-hidden border border-border">
                  <img 
                    src={imageUrl} 
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
                  value={imageUrl || ''}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImageFile(null); // Clear file if URL is typed
                  }}
                  disabled={!!imageFile} // Disable if a file is selected
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
                  value={socialLinks.instagram}
                  onChange={(e) => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-20 text-sm">Spotify:</span>
                <Input
                  placeholder="Username or profile URL"
                  value={socialLinks.spotify}
                  onChange={(e) => setSocialLinks(prev => ({ ...prev, spotify: e.target.value }))}
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-20 text-sm">Twitter:</span>
                <Input
                  placeholder="@username"
                  value={socialLinks.twitter}
                  onChange={(e) => setSocialLinks(prev => ({ ...prev, twitter: e.target.value }))}
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-20 text-sm">Facebook:</span>
                <Input
                  placeholder="Profile URL or username"
                  value={socialLinks.facebook}
                  onChange={(e) => setSocialLinks(prev => ({ ...prev, facebook: e.target.value }))}
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-20 text-sm">LinkedIn:</span>
                <Input
                  placeholder="Profile URL"
                  value={socialLinks.linkedin}
                  onChange={(e) => setSocialLinks(prev => ({ ...prev, linkedin: e.target.value }))}
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-20 text-sm">GitHub:</span>
                <Input
                  placeholder="@username"
                  value={socialLinks.github}
                  onChange={(e) => setSocialLinks(prev => ({ ...prev, github: e.target.value }))}
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-20 text-sm">Website:</span>
                <Input
                  placeholder="https://example.com"
                  value={socialLinks.website}
                  onChange={(e) => setSocialLinks(prev => ({ ...prev, website: e.target.value }))}
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
          <Button type="submit" disabled={combinedLoading || isSubmitting}>
            {combinedLoading || isSubmitting ? "Saving..." : "Continue to Music Preferences"}
          </Button>
        </div>
      </form>
        </>
      )}
    </div>
  );
};

export default CreateProfile;
