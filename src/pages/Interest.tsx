import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue, 
  SelectGroup, 
  SelectLabel 
} from "@/components/ui/select";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Star, 
  Music, 
  Heart, 
  MoonStar, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Globe, 
  Sun, 
  PieChart, 
  Calendar,
  User,
  Mail,
  Loader2,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  email: string;
  name: string;
  age: string;
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  musicPlatform: string;
  genrePreference: string[];
  tempoPreference: string;
  listeningMood: string[];
  zodiacSign: string;
  musicAstroBalance: number; // 0-100 scale, 0 = all music, 100 = all astrology
  pastPartnerSigns: string[];
  pastPartnerMusicTaste: string;
  meetingFrequency: string;
  matchImportance: number;
  expectations: string;
  hearAbout: string;
  customBirthLocation: string;
}

const Interest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    age: "",
    birthDate: "",
    birthTime: "",
    birthLocation: "",
    musicPlatform: "",
    genrePreference: [],
    tempoPreference: "moderate",
    listeningMood: [],
    zodiacSign: "",
    musicAstroBalance: 50, // Default to equal preference
    pastPartnerSigns: [],
    pastPartnerMusicTaste: "",
    meetingFrequency: "",
    matchImportance: 50,
    expectations: "",
    hearAbout: "",
    customBirthLocation: ""
  });

  // Available music genres with cosmic names
  const musicGenres = [
    "Celestial Pop", "Cosmic Rock", "Nebula Jazz", 
    "Astral Classical", "Stellar Electronic", "Galactic Hip-Hop",
    "Interstellar Folk", "Planetary Metal", "Lunar Ambient"
  ];

  // Zodiac signs
  const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];

  // Music moods
  const listeningMoods = [
    "Energetic", "Calm", "Melancholic", "Uplifting", 
    "Introspective", "Romantic", "Focused", "Nostalgic"
  ];

  const handleGenreToggle = (genre: string) => {
    if (formData.genrePreference.includes(genre)) {
      setFormData({
        ...formData,
        genrePreference: formData.genrePreference.filter(g => g !== genre)
      });
    } else {
      setFormData({
        ...formData,
        genrePreference: [...formData.genrePreference, genre]
      });
    }
  };

  const handleMoodToggle = (mood: string) => {
    if (formData.listeningMood.includes(mood)) {
      setFormData({
        ...formData,
        listeningMood: formData.listeningMood.filter(m => m !== mood)
      });
    } else {
      setFormData({
        ...formData,
        listeningMood: [...formData.listeningMood, mood]
      });
    }
  };

  const handleZodiacToggle = (sign: string) => {
    if (formData.pastPartnerSigns.includes(sign)) {
      setFormData({
        ...formData,
        pastPartnerSigns: formData.pastPartnerSigns.filter(s => s !== sign)
      });
    } else {
      setFormData({
        ...formData,
        pastPartnerSigns: [...formData.pastPartnerSigns, sign]
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const validateStep = () => {
    if (currentStep === 1) {
      return formData.email && formData.name && formData.age;
    }
    if (currentStep === 2) {
      return formData.musicPlatform && formData.genrePreference.length > 0;
    }
    if (currentStep === 3) {
      return formData.birthDate && formData.zodiacSign;
    }
    return true;
  };

  const handleSubmit = async () => {
    console.log("Submit button clicked");
    setIsSubmitting(true);
    
    try {
      console.log("Starting form submission process");
      
      // Check for required fields based on database constraints
      if (!formData.age) {
        throw new Error("Age is required to register your interest");
      }
      
      // Prepare submission data ensuring required fields are included
      const submissionData = {
        email: formData.email,
        name: formData.name,
        age: parseInt(formData.age), // Age is required by the database
        created_at: new Date().toISOString(),
        // Include optional fields only if they have values
        ...(formData.birthDate && { birth_date: formData.birthDate }),
        ...(formData.birthTime && { birth_time: formData.birthTime }),
        ...(formData.birthLocation && { 
          birth_location: formData.birthLocation === "other" 
            ? formData.customBirthLocation 
            : formData.birthLocation 
        }),
        ...(formData.musicPlatform && { music_platform: formData.musicPlatform }),
        ...(formData.genrePreference?.length && { genre_preference: formData.genrePreference }),
        ...(formData.tempoPreference && { tempo_preference: formData.tempoPreference }),
        ...(formData.listeningMood && { listening_mood: formData.listeningMood }),
        ...(formData.zodiacSign && { zodiac_sign: formData.zodiacSign }),
        ...(formData.musicAstroBalance && { music_astro_balance: formData.musicAstroBalance }),
        ...(formData.pastPartnerSigns && { past_partner_signs: formData.pastPartnerSigns }),
        ...(formData.pastPartnerMusicTaste && { past_partner_music_taste: formData.pastPartnerMusicTaste }),
        ...(formData.meetingFrequency && { meeting_frequency: formData.meetingFrequency }),
        ...(formData.matchImportance && { match_importance: formData.matchImportance }),
        ...(formData.expectations && { expectations: formData.expectations }),
        ...(formData.hearAbout && { hear_about: formData.hearAbout })
      };
      
      console.log("Form data prepared:", submissionData);
      
      // WORKAROUND: Use fetch directly instead of Supabase client
      // This bypasses any issues with the Supabase client
      console.log("Attempting direct fetch to Supabase");
      
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase credentials");
      }
      
      // Manually construct the PostgREST request
      const response = await fetch(`${supabaseUrl}/rest/v1/interest_registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(submissionData)
      });
      
      console.log("Response received:", response);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
      
      console.log("Form data successfully submitted!");
      
      toast({
        title: "Registration Successful",
        description: "You've been added to our cosmic waitlist!",
      });
      
      setIsSubmitSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const testInsert = async () => {
    try {
      console.log("Testing minimal insert to Supabase...");
      
      // Create a test object with all required fields based on database constraints
      const testData = {
        email: "test@example.com",
        name: "Test User",
        age: 25, // Adding age since it's a required field
        created_at: new Date().toISOString()
      };
      
      // Log the actual request
      console.log("Sending test data:", testData);
      
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase credentials");
      }
      
      const response = await fetch(`${supabaseUrl}/rest/v1/interest_registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(testData)
      });
      
      console.log("Response received:", response);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
      
      console.log("✅ Test insert successful:", response);
      toast({
        title: "Database Test Successful",
        description: "Your database connection is working properly!",
      });
    } catch (err) {
      console.error("Unexpected error during test insert:", err);
      
      if (err instanceof Error) {
        toast({
          title: "Database Test Failed",
          description: err.message,
          variant: "destructive"
        });
      }
    }
  };

  useEffect(() => {
    // Test Supabase connection on component mount
    const testSupabase = async () => {
      try {
        console.log("Testing Supabase connection from Interest component...");
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
          throw new Error("Missing Supabase credentials");
        }
        
        const response = await fetch(`${supabaseUrl}/rest/v1/interest_registrations?select=count`, {
          method: 'GET',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          },
        });
        
        console.log("Response received:", response);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error:", response.status, errorText);
          throw new Error(`API Error: ${response.status} - ${errorText}`);
        }
        
        console.log(" Supabase connection successful!");
      } catch (err) {
        console.error(" Error testing Supabase:", err);
      }
    };
    
    testSupabase();
  }, []);

  return (
    <div className="cosmic-bg min-h-screen flex flex-col">
      {/* Cosmic stars */}
      <div className="cosmic-stars"></div>
      
      {/* Constellation effects */}
      <div className="lyra-constellation top-20 right-20"></div>
      <div className="lyra-constellation bottom-40 left-10"></div>
      
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        <div className="max-w-4xl mx-auto w-full">
          {/* Header with logo */}
          <header className="flex justify-center mb-8 pt-4">
            <div className="flex items-center gap-2">
              <span className="lyra-logo text-2xl px-3 py-1 rounded-lg backdrop-blur-md">Lyra</span>
            </div>
          </header>
          
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-white hover:text-[hsl(var(--primary))] bg-black/20 backdrop-blur-md rounded-lg mb-6 text-sm px-3 py-1 h-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          {isSubmitSuccess ? (
            // Success screen
            <Card className="solid-overlay-card w-full rounded-2xl">
              <CardHeader className="text-center">
                <div className="mx-auto rounded-full bg-[hsla(var(--primary),0.2)] w-16 h-16 flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-[hsl(var(--primary))]" />
                </div>
                <CardTitle className="text-3xl font-bold text-white">Cosmic Connection Initiated!</CardTitle>
                <CardDescription className="text-white/80 text-lg mt-2">
                  Your stellar profile has been registered
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white/90 mb-8">
                  Thank you for joining the Lyra waitlist. We'll analyze your music and astrological data 
                  to find your perfect match. Stay tuned for updates on your cosmic journey!
                </p>
                <Button 
                  className="sleek-button px-8 py-2 h-auto"
                  onClick={() => navigate("/")}
                >
                  Return to Orbit
                  <Star className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            // Form card
            <Card className="solid-overlay-card w-full rounded-2xl">
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    {currentStep === 1 && <User className="h-5 w-5 mr-2 text-[hsl(var(--primary))]" />}
                    {currentStep === 2 && <Music className="h-5 w-5 mr-2 text-[hsl(var(--primary))]" />}
                    {currentStep === 3 && <Star className="h-5 w-5 mr-2 text-[hsl(var(--primary))]" />}
                    {currentStep === 4 && <Heart className="h-5 w-5 mr-2 text-[hsl(var(--primary))]" />}
                    {currentStep === 5 && <MoonStar className="h-5 w-5 mr-2 text-[hsl(var(--primary))]" />}
                  </div>
                  <div className="text-sm text-white/70">
                    Step {currentStep} of 5
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-white">
                  {currentStep === 1 && "Personal Starchart"}
                  {currentStep === 2 && "Musical Constellation"}
                  {currentStep === 3 && "Astral Influences"}
                  {currentStep === 4 && "Cosmic Connections"}
                  {currentStep === 5 && "Final Alignment"}
                </CardTitle>
                <CardDescription className="text-white/80">
                  {currentStep === 1 && "Let's get to know your personal universe"}
                  {currentStep === 2 && "Tell us about your musical journey through the cosmos"}
                  {currentStep === 3 && "Share your astrological profile"}
                  {currentStep === 4 && "Your preferences for cosmic connections"}
                  {currentStep === 5 && "Final questions before we launch your profile"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="cosmic-label">
                        <Mail className="h-4 w-4 inline mr-2" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="cosmic-input"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name" className="cosmic-label">
                        <User className="h-4 w-4 inline mr-2" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        className="cosmic-input"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="age" className="cosmic-label">
                        <Calendar className="h-4 w-4 inline mr-2" />
                        Age
                      </Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        min="18"
                        max="100"
                        placeholder="25"
                        className="cosmic-input"
                        value={formData.age}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                )}
                
                {/* Step 2: Music Preferences */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="musicPlatform" className="cosmic-label">
                        <Music className="h-4 w-4 inline mr-2" />
                        Preferred Music Platform
                      </Label>
                      <Select 
                        onValueChange={(value) => handleSelectChange("musicPlatform", value)}
                        value={formData.musicPlatform}
                      >
                        <SelectTrigger className="cosmic-select-trigger">
                          <SelectValue placeholder="Select your music service" />
                        </SelectTrigger>
                        <SelectContent className="cosmic-select-content">
                          <SelectItem value="spotify">Spotify</SelectItem>
                          <SelectItem value="apple_music">Apple Music</SelectItem>
                          <SelectItem value="youtube_music">YouTube Music</SelectItem>
                          <SelectItem value="amazon_music">Amazon Music</SelectItem>
                          <SelectItem value="deezer">Deezer</SelectItem>
                          <SelectItem value="soundcloud">SoundCloud</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="cosmic-label">
                        <Music className="h-4 w-4 inline mr-2" />
                        Favorite Music Genres
                      </Label>
                      <p className="text-sm text-white/70">
                        Choose genres that define your cosmic vibration
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                        {musicGenres.map((genre) => (
                          <Button
                            key={genre}
                            type="button"
                            variant={formData.genrePreference.includes(genre) ? "default" : "outline"}
                            onClick={() => handleGenreToggle(genre)}
                            className={`justify-start ${formData.genrePreference.includes(genre) ? "bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))]" : "hover:bg-[hsla(var(--primary),0.1)] border-[rgba(255,255,255,0.2)] rounded-lg"}`}
                            size="sm"
                          >
                            <Music className="mr-2 h-3 w-3" />
                            {genre}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tempoPreference" className="cosmic-label">
                        <Music className="h-4 w-4 inline mr-2" />
                        Preferred Music Tempo
                      </Label>
                      <Select 
                        onValueChange={(value) => handleSelectChange("tempoPreference", value)}
                        value={formData.tempoPreference}
                      >
                        <SelectTrigger className="cosmic-select-trigger">
                          <SelectValue placeholder="Select your preferred tempo" />
                        </SelectTrigger>
                        <SelectContent className="cosmic-select-content">
                          <SelectItem value="slow">Slow & Chill</SelectItem>
                          <SelectItem value="moderate">Moderate & Rhythmic</SelectItem>
                          <SelectItem value="energetic">Energetic & Upbeat</SelectItem>
                          <SelectItem value="varied">Varied & Diverse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="cosmic-label">
                        <Sparkles className="h-4 w-4 inline mr-2" />
                        When do you usually listen to music?
                      </Label>
                      <p className="text-sm text-white/70">
                        Select all that apply
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {listeningMoods.map((mood) => (
                          <Button
                            key={mood}
                            type="button"
                            variant={formData.listeningMood.includes(mood) ? "default" : "outline"}
                            onClick={() => handleMoodToggle(mood)}
                            className={`justify-start ${formData.listeningMood.includes(mood) ? "bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))]" : "hover:bg-[hsla(var(--primary),0.1)] border-[rgba(255,255,255,0.2)] rounded-lg"}`}
                            size="sm"
                          >
                            <Sparkles className="mr-2 h-3 w-3" />
                            {mood}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 3: Astrological Details */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="birthDate" className="cosmic-label">
                        <Calendar className="h-4 w-4 inline mr-2" />
                        Birth Date
                      </Label>
                      <Input 
                        id="birthDate" 
                        name="birthDate" 
                        type="date" 
                        value={formData.birthDate}
                        onChange={handleChange}
                        required
                        className="cosmic-input"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="birthTime" className="cosmic-label">
                        <Clock className="h-4 w-4 inline mr-2" />
                        Birth Time (if known)
                      </Label>
                      <Input 
                        id="birthTime" 
                        name="birthTime" 
                        type="time" 
                        value={formData.birthTime}
                        onChange={handleChange}
                        className="cosmic-input"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="birthLocation" className="cosmic-label">
                        <Globe className="h-4 w-4 inline mr-2" />
                        Birth Location (City, Country)
                      </Label>
                      <Select 
                        onValueChange={(value) => handleSelectChange("birthLocation", value)}
                        value={formData.birthLocation || ""}
                      >
                        <SelectTrigger className="cosmic-select-trigger">
                          <SelectValue placeholder="Select your birth location" />
                        </SelectTrigger>
                        <SelectContent className="max-h-80 cosmic-select-content">
                          <SelectGroup>
                            <SelectLabel>United States</SelectLabel>
                            <SelectItem value="New York, USA">New York, USA</SelectItem>
                            <SelectItem value="Los Angeles, USA">Los Angeles, USA</SelectItem>
                            <SelectItem value="Chicago, USA">Chicago, USA</SelectItem>
                            <SelectItem value="Houston, USA">Houston, USA</SelectItem>
                            <SelectItem value="Miami, USA">Miami, USA</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Europe</SelectLabel>
                            <SelectItem value="London, UK">London, UK</SelectItem>
                            <SelectItem value="Paris, France">Paris, France</SelectItem>
                            <SelectItem value="Berlin, Germany">Berlin, Germany</SelectItem>
                            <SelectItem value="Rome, Italy">Rome, Italy</SelectItem>
                            <SelectItem value="Madrid, Spain">Madrid, Spain</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Asia</SelectLabel>
                            <SelectItem value="Tokyo, Japan">Tokyo, Japan</SelectItem>
                            <SelectItem value="Shanghai, China">Shanghai, China</SelectItem>
                            <SelectItem value="Mumbai, India">Mumbai, India</SelectItem>
                            <SelectItem value="Seoul, South Korea">Seoul, South Korea</SelectItem>
                            <SelectItem value="Bangkok, Thailand">Bangkok, Thailand</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Other Regions</SelectLabel>
                            <SelectItem value="Sydney, Australia">Sydney, Australia</SelectItem>
                            <SelectItem value="Cairo, Egypt">Cairo, Egypt</SelectItem>
                            <SelectItem value="Rio de Janeiro, Brazil">Rio de Janeiro, Brazil</SelectItem>
                            <SelectItem value="Mexico City, Mexico">Mexico City, Mexico</SelectItem>
                            <SelectItem value="Cape Town, South Africa">Cape Town, South Africa</SelectItem>
                          </SelectGroup>
                          <SelectItem value="other">Other Location</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {formData.birthLocation === "other" && (
                      <div className="mt-2">
                        <Input 
                          id="customBirthLocation" 
                          placeholder="Enter your birth location"
                          value={formData.customBirthLocation || ""}
                          className="focus:ring-[hsl(var(--primary))] focus:border-[hsl(var(--primary))] placeholder-[hsla(var(--foreground),0.5)] bg-transparent border-[rgba(255,255,255,0.2)] rounded-lg text-base"
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              customBirthLocation: value,
                              birthLocation: value // Also update the main field
                            }));
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="zodiacSign" className="cosmic-label">
                        <Star className="h-4 w-4 inline mr-2" />
                        Zodiac Sign
                      </Label>
                      <Select 
                        onValueChange={(value) => handleSelectChange("zodiacSign", value)}
                        value={formData.zodiacSign}
                      >
                        <SelectTrigger className="cosmic-select-trigger">
                          <SelectValue placeholder="Select your zodiac sign" />
                        </SelectTrigger>
                        <SelectContent className="cosmic-select-content">
                          {zodiacSigns.map((sign) => (
                            <SelectItem key={sign} value={sign.toLowerCase()}>{sign}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                
                {/* Step 4: Additional Details */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="cosmic-label">
                        <Star className="h-4 w-4 inline mr-2" />
                        Past Partners' Zodiac Signs (if known)
                      </Label>
                      <p className="text-sm text-white/70">
                        Select any that apply
                      </p>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {zodiacSigns.map((sign) => (
                          <Button
                            key={sign}
                            type="button"
                            variant={formData.pastPartnerSigns.includes(sign.toLowerCase()) ? "default" : "outline"}
                            onClick={() => handleZodiacToggle(sign.toLowerCase())}
                            className={`justify-start ${formData.pastPartnerSigns.includes(sign.toLowerCase()) ? "bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))]" : "hover:bg-[hsla(var(--primary),0.1)] border-[rgba(255,255,255,0.2)] rounded-lg"}`}
                            size="sm"
                          >
                            <Star className="mr-2 h-3 w-3" />
                            {sign}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pastPartnerMusicTaste" className="cosmic-label">
                        <Music className="h-4 w-4 inline mr-2" />
                        Past Partners' Music Taste
                      </Label>
                      <RadioGroup 
                        value={formData.pastPartnerMusicTaste}
                        onValueChange={(value) => handleSelectChange("pastPartnerMusicTaste", value)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="very_similar" id="very_similar" />
                          <Label htmlFor="very_similar">Very similar to mine</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="somewhat_similar" id="somewhat_similar" />
                          <Label htmlFor="somewhat_similar">Somewhat similar</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="very_different" id="very_different" />
                          <Label htmlFor="very_different">Very different</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="varied" id="varied" />
                          <Label htmlFor="varied">Varied across different partners</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="unknown" id="unknown" />
                          <Label htmlFor="unknown">Not sure/Can't remember</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="meetingFrequency" className="cosmic-label">
                        <Clock className="h-4 w-4 inline mr-2" />
                        How often would you like to discover new matches?
                      </Label>
                      <Select 
                        onValueChange={(value) => handleSelectChange("meetingFrequency", value)}
                        value={formData.meetingFrequency}
                      >
                        <SelectTrigger className="cosmic-select-trigger">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent className="cosmic-select-content">
                          <SelectItem value="daily">Daily (Eager Explorer)</SelectItem>
                          <SelectItem value="few_per_week">Few times a week (Cosmic Browser)</SelectItem>
                          <SelectItem value="weekly">Weekly (Steady Navigator)</SelectItem>
                          <SelectItem value="monthly">Monthly (Patient Observer)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="cosmic-label">
                        <Heart className="h-4 w-4 inline mr-2" />
                        How important is music taste in your potential matches?
                      </Label>
                      <div className="pt-5 pb-2">
                        <Slider
                          defaultValue={[50]}
                          min={0}
                          max={100}
                          step={10}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, matchImportance: value[0] }))}
                          className="[&>span]:bg-[hsl(var(--primary))] [&>span]:hover:bg-[hsl(var(--primary-hover))]"
                        />
                      </div>
                      <div className="flex justify-between text-sm text-white/70">
                        <span>Just a bonus</span>
                        <span>Nice to have</span>
                        <span>Essential</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="expectations" className="cosmic-label">
                        <Sparkles className="h-4 w-4 inline mr-2" />
                        What are you most excited about in Lyra?
                      </Label>
                      <Textarea 
                        id="expectations" 
                        name="expectations" 
                        placeholder="Tell us what you're looking forward to..."
                        value={formData.expectations}
                        onChange={handleChange}
                        rows={3}
                        maxLength={500}
                        className="cosmic-input"
                      />
                      <p className="text-xs text-white/70 text-right">{formData.expectations?.length || 0}/500</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hearAbout" className="cosmic-label">
                        <Music className="h-4 w-4 inline mr-2" />
                        How did you hear about us?
                      </Label>
                      <Textarea 
                        id="hearAbout" 
                        name="hearAbout" 
                        placeholder="Tell us how you found us..."
                        value={formData.hearAbout}
                        onChange={handleChange}
                        rows={2}
                        className="cosmic-input"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between pt-6">
                {currentStep > 1 && (
                  <Button 
                    className="sleek-button border-none text-white hover:bg-[hsla(var(--primary),0.8)]"
                    onClick={handleBack}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                )}
                
                {currentStep === 1 && (
                  <Button
                    type="button"
                    className="sleek-button border-none text-white hover:bg-[hsla(var(--primary),0.8)]"
                    onClick={testInsert}
                  >
                    Test Database
                    <Star className="ml-2 h-4 w-4" />
                  </Button>
                )}
                
                {currentStep < 5 ? (
                  <Button 
                    onClick={handleNext}
                    disabled={!validateStep()}
                    className={`sleek-button ml-auto ${!validateStep() ? 'opacity-50' : ''}`}
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    type="button"
                    onClick={() => {
                      console.log("Submit button clicked directly");
                      handleSubmit();
                    }}
                    disabled={isSubmitting || !validateStep()}
                    className={`sleek-button ml-auto ${(isSubmitting || !validateStep()) ? 'opacity-50' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting
                      </>
                    ) : (
                      <>
                        Submit
                        <Sparkles className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interest;