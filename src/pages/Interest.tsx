import { useState } from "react";
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
  birthLocation: string;
  musicPlatform: string;
  genrePreference: string[];
  tempoPreference: string;
  listeningMood: string[];
  zodiacSign: string;
  musicAstroBalance: number;
  pastPartnerSigns: string[];
  pastPartnerMusicTaste: string;
  meetingFrequency: string;
  matchImportance: number;
  expectations: string;
  hearAbout: string;
  customBirthLocation: string;
}

interface FormErrors {
  email?: string;
  name?: string;
  age?: string;
  birthDate?: string;
  birthLocation?: string;
  musicPlatform?: string;
  genrePreference?: string;
  listeningMood?: string;
  zodiacSign?: string;
  general?: string;
}

const Interest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Component state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    age: "",
    birthDate: "",
    birthLocation: "",
    musicPlatform: "",
    genrePreference: [],
    tempoPreference: "moderate",
    listeningMood: [],
    zodiacSign: "",
    musicAstroBalance: 50,
    pastPartnerSigns: [],
    pastPartnerMusicTaste: "",
    meetingFrequency: "",
    matchImportance: 50,
    expectations: "",
    hearAbout: "",
    customBirthLocation: ""
  });

  // Constants
  const musicGenres = [
    "Pop", "Rock", "Jazz", 
    "Classical", "Electronic", "Hip-Hop",
    "Folk", "Metal", "R&B", 
    "Country", "Reggae", "Blues",
    "Soul", "Indie", "EDM"
  ];

  const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];

  const listeningMoods = [
    "Energetic", "Calm", "Melancholic", "Uplifting", 
    "Introspective", "Romantic", "Focused", "Nostalgic"
  ];

  // Event handlers
  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = () => {
    if (!validateCurrentStep()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitSuccess(true);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenreToggle = (genre: string) => {
    setFormData((prev) => {
      if (prev.genrePreference.includes(genre)) {
        return {
          ...prev,
          genrePreference: prev.genrePreference.filter((g) => g !== genre)
        };
      } else {
        return {
          ...prev,
          genrePreference: [...prev.genrePreference, genre]
        };
      }
    });
  };

  const handleMoodToggle = (mood: string) => {
    setFormData((prev) => {
      if (prev.listeningMood.includes(mood)) {
        return {
          ...prev,
          listeningMood: prev.listeningMood.filter((m) => m !== mood)
        };
      } else {
        return {
          ...prev,
          listeningMood: [...prev.listeningMood, mood]
        };
      }
    });
  };

  const handleZodiacToggle = (sign: string) => {
    setFormData((prev) => {
      if (prev.pastPartnerSigns.includes(sign)) {
        return {
          ...prev,
          pastPartnerSigns: prev.pastPartnerSigns.filter((s) => s !== sign)
        };
      } else {
        return {
          ...prev,
          pastPartnerSigns: [...prev.pastPartnerSigns, sign]
        };
      }
    });
  };

  // Validation
  const validateCurrentStep = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Step-specific validation
    if (currentStep === 1) {
      // Personal info validation
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.age) newErrors.age = "Age is required";
    } 
    else if (currentStep === 2) {
      // Music preferences validation
      if (!formData.musicPlatform) newErrors.musicPlatform = "Please select a music platform";
      if (formData.genrePreference.length === 0) newErrors.genrePreference = "Please select at least one genre";
    }
    else if (currentStep === 3) {
      // Astrological details validation
      if (!formData.birthDate) newErrors.birthDate = "Birth date is required";
      if (!formData.zodiacSign) newErrors.zodiacSign = "Please select your zodiac sign";
      if (!formData.birthLocation) newErrors.birthLocation = "Birth location is required";
    }
    
    // Update errors state if there are any
    const hasErrors = Object.keys(newErrors).length > 0;
    if (hasErrors) {
      setErrors(newErrors);
      
      toast({
        title: "Please check your inputs",
        description: "Some required fields need your attention",
        variant: "destructive"
      });
    }
    
    return !hasErrors;
  };

  // Render functions
  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="cosmic-label text-sm sm:text-base">
          <Mail className="h-4 w-4 inline mr-2" />
          Email Address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your.email@example.com"
          className={`cosmic-input ${errors.email ? "border-red-500" : ""}`}
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        {errors.email && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name" className="cosmic-label text-sm sm:text-base">
          <User className="h-4 w-4 inline mr-2" />
          Full Name
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Your name"
          className={`cosmic-input ${errors.name ? "border-red-500" : ""}`}
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        {errors.name && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="age" className="cosmic-label text-sm sm:text-base">
          <Calendar className="h-4 w-4 inline mr-2" />
          Age
        </Label>
        <Input
          id="age"
          name="age"
          type="number"
          min="18"
          max="120"
          placeholder="25"
          className={`cosmic-input ${errors.age ? "border-red-500" : ""}`}
          value={formData.age}
          onChange={handleInputChange}
          required
        />
        {errors.age && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.age}</p>
        )}
      </div>
    </div>
  );

  const renderMusicPreferences = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="musicPlatform" className="cosmic-label text-sm sm:text-base">
          <Music className="h-4 w-4 inline mr-2" />
          Preferred Music Platform
        </Label>
        <Select 
          onValueChange={(value) => handleSelectChange("musicPlatform", value)}
          value={formData.musicPlatform}
        >
          <SelectTrigger className={`cosmic-select-trigger ${errors.musicPlatform ? "border-red-500" : ""}`}>
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
        {errors.musicPlatform && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.musicPlatform}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label className="cosmic-label text-sm sm:text-base">
          <Music className="h-4 w-4 inline mr-2" />
          Favorite Music Genres
        </Label>
        <p className="text-xs sm:text-sm text-white/70">
          Choose genres that define your cosmic vibration
        </p>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
          {musicGenres.map((genre) => (
            <Button
              key={genre}
              type="button"
              variant={formData.genrePreference.includes(genre) ? "default" : "outline"}
              onClick={() => handleGenreToggle(genre)}
              className={`justify-start text-xs sm:text-sm ${formData.genrePreference.includes(genre) ? "bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))]" : "hover:bg-[hsla(var(--primary),0.1)] border-[rgba(255,255,255,0.2)] rounded-lg"}`}
              size="sm"
            >
              <Music className="mr-1 sm:mr-2 h-3 w-3" />
              {genre}
            </Button>
          ))}
        </div>
        {errors.genrePreference && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.genrePreference}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label className="cosmic-label text-sm sm:text-base">
          <Sparkles className="h-4 w-4 inline mr-2" />
          When do you usually listen to music?
        </Label>
        <p className="text-xs sm:text-sm text-white/70">
          Select all that apply
        </p>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 mt-2">
          {listeningMoods.map((mood) => (
            <Button
              key={mood}
              type="button"
              variant={formData.listeningMood.includes(mood) ? "default" : "outline"}
              onClick={() => handleMoodToggle(mood)}
              className={`justify-start text-xs sm:text-sm ${formData.listeningMood.includes(mood) ? "bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))]" : "hover:bg-[hsla(var(--primary),0.1)] border-[rgba(255,255,255,0.2)] rounded-lg"}`}
              size="sm"
            >
              <Sparkles className="mr-1 sm:mr-2 h-3 w-3" />
              {mood}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAstroDetails = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="birthDate" className="cosmic-label text-sm sm:text-base">
          <Calendar className="h-4 w-4 inline mr-2" />
          Birth Date
        </Label>
        <Input 
          id="birthDate" 
          name="birthDate" 
          type="date" 
          value={formData.birthDate}
          onChange={handleInputChange}
          required
          className={`cosmic-input ${errors.birthDate ? "border-red-500" : ""}`}
        />
        {errors.birthDate && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.birthDate}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="birthLocation" className="cosmic-label text-sm sm:text-base">
          <Globe className="h-4 w-4 inline mr-2" />
          Birth Location (Country)
        </Label>
        <Select 
          onValueChange={(value) => handleSelectChange("birthLocation", value)}
          value={formData.birthLocation || ""}
        >
          <SelectTrigger className={`cosmic-select-trigger ${errors.birthLocation ? "border-red-500" : ""}`}>
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent className="max-h-60 sm:max-h-80 cosmic-select-content">
            <SelectGroup>
              <SelectLabel>Africa</SelectLabel>
              <SelectItem value="Algeria">Algeria</SelectItem>
              <SelectItem value="Egypt">Egypt</SelectItem>
              <SelectItem value="Nigeria">Nigeria</SelectItem>
              <SelectItem value="South Africa">South Africa</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Americas</SelectLabel>
              <SelectItem value="Brazil">Brazil</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="Mexico">Mexico</SelectItem>
              <SelectItem value="United States">United States</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Asia</SelectLabel>
              <SelectItem value="China">China</SelectItem>
              <SelectItem value="India">India</SelectItem>
              <SelectItem value="Japan">Japan</SelectItem>
              <SelectItem value="South Korea">South Korea</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Europe</SelectLabel>
              <SelectItem value="France">France</SelectItem>
              <SelectItem value="Germany">Germany</SelectItem>
              <SelectItem value="Italy">Italy</SelectItem>
              <SelectItem value="United Kingdom">United Kingdom</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Oceania</SelectLabel>
              <SelectItem value="Australia">Australia</SelectItem>
              <SelectItem value="New Zealand">New Zealand</SelectItem>
            </SelectGroup>
            <SelectItem value="other">Other Country</SelectItem>
          </SelectContent>
        </Select>
        {errors.birthLocation && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.birthLocation}</p>
        )}
      </div>
      
      {formData.birthLocation === "other" && (
        <div className="mt-2">
          <Input 
            id="customBirthLocation" 
            name="customBirthLocation"
            placeholder="Enter your birth location"
            value={formData.customBirthLocation || ""}
            className={`cosmic-input ${errors.birthLocation ? "border-red-500" : ""}`}
            onChange={handleInputChange}
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="zodiacSign" className="cosmic-label text-sm sm:text-base">
          <Star className="h-4 w-4 inline mr-2" />
          Zodiac Sign
        </Label>
        <Select 
          onValueChange={(value) => handleSelectChange("zodiacSign", value)}
          value={formData.zodiacSign}
        >
          <SelectTrigger className={`cosmic-select-trigger ${errors.zodiacSign ? "border-red-500" : ""}`}>
            <SelectValue placeholder="Select your zodiac sign" />
          </SelectTrigger>
          <SelectContent className="cosmic-select-content">
            {zodiacSigns.map((sign) => (
              <SelectItem key={sign} value={sign.toLowerCase()}>{sign}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.zodiacSign && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.zodiacSign}</p>
        )}
      </div>
    </div>
  );

  const renderFinalForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="cosmic-label text-sm sm:text-base">
          <Star className="h-4 w-4 inline mr-2" />
          Past Partners' Zodiac Signs (if known)
        </Label>
        <p className="text-xs sm:text-sm text-white/70">
          Select any that apply
        </p>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {zodiacSigns.map((sign) => (
            <Button
              key={sign}
              type="button"
              variant={formData.pastPartnerSigns.includes(sign.toLowerCase()) ? "default" : "outline"}
              onClick={() => handleZodiacToggle(sign.toLowerCase())}
              className={`justify-start text-xs sm:text-sm ${formData.pastPartnerSigns.includes(sign.toLowerCase()) ? "bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))]" : "hover:bg-[hsla(var(--primary),0.1)] border-[rgba(255,255,255,0.2)] rounded-lg"}`}
              size="sm"
            >
              <Star className="mr-1 sm:mr-2 h-3 w-3" />
              {sign}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFormActions = () => (
    <div className="flex justify-between mt-6">
      {currentStep > 1 && (
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          className="sleek-button bg-black/20 text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      )}
      
      {currentStep < 4 ? (
        <Button
          type="button"
          onClick={handleNext}
          className="sleek-button ml-auto"
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          onClick={handleSubmit}
          className="sleek-button ml-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit
              <Star className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderMusicPreferences();
      case 3:
        return renderAstroDetails();
      case 4:
        return renderFinalForm();
      default:
        return renderPersonalInfo();
    }
  };

  const renderSuccessMessage = () => (
    <Card className="cosmic-card overflow-hidden">
      <CardContent className="p-6 sm:p-8 flex flex-col items-center justify-center text-center">
        <div className="mb-6">
          <CheckCircle className="text-green-500 h-16 w-16 mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Your Cosmic Journey Begins!</h2>
          <p className="text-white/80 text-sm sm:text-base">
            Thank you for sharing your musical and astrological preferences. We'll be in touch soon with your cosmic matches.
          </p>
        </div>
        
        <Button
          onClick={() => navigate("/")}
          className="sleek-button bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))] text-white w-full sm:w-auto"
        >
          Return to Homepage
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="cosmic-bg min-h-screen py-6 sm:py-10 px-3 sm:px-6">
      {/* Cosmic effects */}
      <div className="cosmic-stars opacity-70"></div>
      <div className="lyra-constellation top-20 right-20 opacity-60"></div>
      <div className="lyra-constellation bottom-40 left-10 opacity-60"></div>
      
      {/* Back to home link */}
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 text-white/80 hover:text-white hover:bg-white/10 p-2 h-auto rounded-full"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="sr-only">Back to home</span>
      </Button>

      {/* Main content */}
      <div className="container mx-auto max-w-md sm:max-w-lg md:max-w-xl">
        {isSubmitSuccess ? (
          // Success screen
          renderSuccessMessage()
        ) : (
          // Form card
          <Card className="cosmic-card overflow-hidden">
            <CardHeader className="pb-0 sm:pb-2 pt-6 px-6 sm:pt-8 sm:px-8">
              <CardTitle className="text-xl sm:text-2xl text-white flex items-center gap-2">
                <Star className="h-5 w-5 text-[hsl(var(--primary))]" />
                <span>Join Lyra Waitlist</span>
              </CardTitle>
              <CardDescription className="text-white/70 text-sm sm:text-base mt-1">
                Step {currentStep} of 4: {
                  currentStep === 1 ? "Personal Information" :
                  currentStep === 2 ? "Music Preferences" :
                  currentStep === 3 ? "Astrological Details" :
                  "Finishing Up"
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6 sm:p-8 pt-4 sm:pt-6">
              {/* Progress bar */}
              <div className="w-full bg-white/10 h-1 rounded-full mb-6">
                <div
                  className="bg-[hsl(var(--primary))] h-1 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                ></div>
              </div>
              
              {/* Form content */}
              <form onSubmit={(e) => e.preventDefault()}>
                {currentStep === 1 && renderPersonalInfo()}
                {currentStep === 2 && renderMusicPreferences()}
                {currentStep === 3 && renderAstroDetails()}
                {currentStep === 4 && renderFinalForm()}
                
                {renderFormActions()}
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Interest;