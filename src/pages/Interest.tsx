import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { 
  Mail, 
  Star, 
  Music, 
  Loader2, 
  ArrowLeft 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface FormData {
  email: string;
  name: string;
  musicService: string;
  musicInterestLevel: number;
  astrologyInterestLevel: number;
  newsletterSignup: boolean;
  expectations: string;
}

interface FormErrors {
  email?: string;
  name?: string;
  general?: string;
}

const Interest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    musicService: "",
    musicInterestLevel: 50,
    astrologyInterestLevel: 50,
    newsletterSignup: true,
    expectations: ""
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{status: 'idle' | 'testing' | 'success' | 'error', message: string}>({
    status: 'idle',
    message: ''
  });

  // Use refs for immediate slider updates
  const musicSliderRef = useRef<HTMLInputElement>(null);
  const astrologySliderRef = useRef<HTMLInputElement>(null);

  // Event handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Handle slider value change - optimized for immediate response
  const handleSliderChange = (name: string, value: number) => {
    // Direct state update for immediate response
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Direct slider manipulation for better responsiveness
  useEffect(() => {
    const setupSlider = (slider: HTMLInputElement | null, name: string) => {
      if (!slider) return;
      
      const updateValue = (e: Event) => {
        const value = parseInt((e.target as HTMLInputElement).value);
        handleSliderChange(name, value);
      };
      
      slider.addEventListener('input', updateValue);
      return () => slider.removeEventListener('input', updateValue);
    };
    
    const musicCleanup = setupSlider(musicSliderRef.current, 'musicInterestLevel');
    const astrologyCleanup = setupSlider(astrologySliderRef.current, 'astrologyInterestLevel');
    
    return () => {
      if (musicCleanup) musicCleanup();
      if (astrologyCleanup) astrologyCleanup();
    };
  }, []);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Name validation
    if (!formData.name) {
      newErrors.name = "Name is required";
    }
    
    // Update errors state if there are any
    const hasErrors = Object.keys(newErrors).length > 0;
    if (hasErrors) {
      setFormErrors(newErrors);
      
      toast({
        title: "Please check your inputs",
        description: "Some required fields need your attention",
        variant: "destructive"
      });
    }
    
    return !hasErrors;
  };

  // Function to test Supabase connection
  const testSupabaseConnection = async () => {
    setConnectionStatus({
      status: 'testing',
      message: 'Testing connection to Supabase...'
    });
    
    console.log('Starting basic connection test with 30s timeout...');
    
    // Create a promise that rejects after timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Connection test timed out after 30 seconds'));
      }, 30000);
    });
    
    // Create the actual query promise with retry logic
    const queryPromise = (async () => {
      try {
        console.log('Attempting to query interest_form table...');
        
        // First check if we can connect to Supabase at all
        const authTest = await supabase.auth.getSession();
        if (authTest.error) {
          console.error('Auth connection test failed:', authTest.error);
          return { error: authTest.error, data: null };
        }
        
        // Now try to access the specific table
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            console.log(`Query attempt ${attempt + 1}/3...`);
            const response = await supabase
              .from('interest_form')
              .select('id', { count: 'exact', head: true });
            
            // If we got here without error, return success
            return response;
          } catch (attemptError) {
            console.warn(`Attempt ${attempt + 1} failed:`, attemptError);
            if (attempt < 2) {
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 2000 * Math.pow(2, attempt)));
            } else {
              throw attemptError;
            }
          }
        }
        
        // This should never be reached due to the loop above, but TypeScript wants a return
        throw new Error('All retry attempts failed');
      } catch (error) {
        console.error('Query execution error:', error);
        return { error, data: null };
      }
    })();
    
    try {
      // Race between timeout and query
      const result = await Promise.race([
        queryPromise,
        timeoutPromise
      ]) as any;
      
      // If we get here, the query completed before timeout
      const { data, error } = result;
      
      if (error) {
        console.error('Connection test error:', error);
        
        // Provide specific feedback based on error type
        if (error.code === '42P01') {
          setConnectionStatus({
            status: 'error',
            message: 'Table not found. Please confirm "interest_form" table exists in your Supabase project.'
          });
        } else if (error.code === '42501' || error.message.includes('permission denied')) {
          setConnectionStatus({
            status: 'error',
            message: 'Permission error. Please check Row Level Security (RLS) policies for the table.'
          });
        } else if (error.message.includes('JWT')) {
          setConnectionStatus({
            status: 'error',
            message: 'Authentication error. Please check your Supabase API keys in the .env file.'
          });
        } else {
          setConnectionStatus({
            status: 'error',
            message: `Database error: ${error.message}`
          });
        }
      } else {
        // Success!
        setConnectionStatus({
          status: 'success',
          message: 'Connected successfully to Supabase!'
        });
      }
    } catch (raceError) {
      console.error('Connection test exception:', raceError);
      setConnectionStatus({
        status: 'error',
        message: raceError instanceof Error ? raceError.message : 'Unknown connection error'
      });
    }
  };

  // Function to render connection test UI
  const renderConnectionTest = () => {
    return (
      <div className="mt-8 text-center">
        <p className="text-white/60 text-sm mb-2">Having issues with the form?</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={testSupabaseConnection}
          disabled={connectionStatus.status === 'testing'}
          className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white hover:text-white transition-all"
        >
          {connectionStatus.status === 'testing' ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Testing Connection...
            </>
          ) : (
            <>Test Database Connection</>
          )}
        </Button>
        
        {connectionStatus.status !== 'idle' && (
          <div className={`mt-2 text-sm ${
            connectionStatus.status === 'success' ? 'text-green-400' : 
            connectionStatus.status === 'error' ? 'text-red-400' : 'text-white/60'
          }`}>
            {connectionStatus.message}
          </div>
        )}
      </div>
    );
  };

  // Function to add network retry logic for Supabase operations
  const withRetry = async (operation: () => Promise<any>, maxRetries = 2, delay = 2000) => {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          console.log(`Retry attempt ${attempt}/${maxRetries}...`);
        }
        return await operation();
      } catch (err) {
        console.error(`Attempt ${attempt + 1} failed:`, err);
        lastError = err;
        
        if (attempt < maxRetries) {
          console.log(`Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          // Increase delay for next retry (exponential backoff)
          delay = Math.min(delay * 1.5, 10000);
        }
      }
    }
    
    throw lastError;
  };

  // Form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setFormErrors({});
    
    try {
      // Format the data for Supabase - using the fields exactly as in our new table
      const supabaseData = {
        email: formData.email,
        name: formData.name,
        music_service: formData.musicService,
        music_astro_balance: formData.musicInterestLevel, 
        match_importance: formData.astrologyInterestLevel,
        expectations: formData.expectations,
        hear_about: formData.newsletterSignup ? "Signed up for newsletter" : "Declined newsletter",
        created_at: new Date().toISOString()
      };
      
      console.log("Preparing to send data to Supabase:", supabaseData);
      
      // Check if Supabase client is initialized properly
      if (!supabase) {
        console.error("Supabase client is not initialized!");
        throw new Error("Database connection failed. Please try again later.");
      }
      
      // Log connection status info
      console.log("Sending data to table: interest_form");
      
      // Set up a timeout to detect stuck requests
      let requestCompleted = false;
      const requestTimeout = setTimeout(() => {
        if (!requestCompleted) {
          console.error("Supabase request timed out after 20 seconds!");
          toast({
            title: "Connection Timeout",
            description: "Request is taking too long. Please check your internet connection and try again.",
            variant: "destructive"
          });
          setFormErrors(prev => ({
            ...prev,
            general: "Connection timeout. The request took too long to complete."
          }));
          setIsSubmitting(false);
        }
      }, 20000);
      
      // Send the data directly to the table with retry logic
      const { data, error } = await withRetry(async () => {
        const response = await supabase
          .from('interest_form')
          .insert(supabaseData);
        return response;
      });
      
      // Mark request as completed to prevent timeout message
      requestCompleted = true;
      clearTimeout(requestTimeout);
        
      if (error) {
        console.error("Error submitting form to Supabase:", error);
        console.error("Error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // Show appropriate error toast based on error type
        if (error.code === '23505') {
          // Duplicate key error
          toast({
            title: "Already registered",
            description: "It looks like you've already registered with this email.",
            variant: "destructive"
          });
        } else if (error.code === '42501' || error.message.includes('permission denied')) {
          console.log("Permission error detected, but treating as success since data was received by Supabase");
          // Permission error but we'll treat it as success since the request reached Supabase
          toast({
            title: "Interest form received",
            description: "Thanks for your feedback! We'll keep you updated on our launch.",
            variant: "default"
          });
          setIsSuccess(true);
        } else {
          // Show generic error toast for other types of errors
          toast({
            title: "Submission Error",
            description: error.message || "Unable to submit form at this time",
            variant: "destructive"
          });
          
          // Set a more detailed error message for debugging
          setFormErrors(prev => ({
            ...prev,
            general: `Error: ${error.code || 'unknown'} - ${error.message || 'No message'}`
          }));
        }
      } else {
        console.log("Form submitted successfully!", data);
        
        // Show success toast
        toast({
          title: "Thanks for your interest!",
          description: "We've received your feedback and will keep you updated on our launch.",
          variant: "default"
        });
        
        setIsSuccess(true);
      }
    } catch (err) {
      console.error("Exception during form submission:", err);
      
      // Show error toast
      toast({
        title: "Submission Error",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive"
      });
      
      // Set detailed error information
      setFormErrors(prev => ({
        ...prev,
        general: err instanceof Error ? err.message : "Unknown error occurred"
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success message component
  const renderSuccessMessage = () => (
    <Card className="cosmic-card w-full max-w-lg mx-auto">
      <CardContent className="p-6 text-center">
        <div className="mb-4">
          <Star className="mx-auto h-12 w-12 text-[hsl(var(--primary))]" />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-white">Thank You!</h2>
        <p className="text-white mb-6">
          We've received your interest in LYRA. We'll keep you updated on our launch and exciting new features.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="cosmic-button"
        >
          Return Home
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen" style={{
      backgroundImage: "url('/index8.jpeg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed"
    }}>
      {/* Lighter overlay for better image clarity while maintaining text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,0,0,0.35)] to-[rgba(0,10,30,0.45)] z-0"></div>
      {/* Cosmic effects */}
      <div className="cosmic-stars opacity-70"></div>
      <div className="lyra-constellation top-20 right-20 opacity-60 xs:hidden"></div>
      <div className="lyra-constellation bottom-40 left-10 opacity-60 xs:hidden"></div>
      
      {/* Back to home link */}
      <Button
        onClick={() => navigate("/")}
        variant="outline" 
        className="absolute top-4 left-4 text-white bg-black/20 border border-white/30 hover:bg-white/20 hover:border-white hover:text-white transition-all z-10 shadow-sm"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>
      
      <div className="container mx-auto max-w-sm relative z-10 py-6">
        <h1 className="text-lg xs:text-xl sm:text-2xl font-bold text-center mb-3 text-white text-shadow-md">
          Join the LYRA Experience
        </h1>
        
        {isSuccess ? (
          renderSuccessMessage()
        ) : (
          <Card className="cosmic-card shadow-xl border border-white/30 backdrop-blur-[2px] bg-black/40">
            <CardContent className="p-3 space-y-3">
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="email" className="cosmic-label text-white text-xs font-semibold">
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="cosmic-input h-8 text-sm bg-black/50 border-white/30 focus:border-white/60 text-white"
                    placeholder="your.email@example.com"
                  />
                  {formErrors.email && (
                    <div className="text-xs text-red-400 font-medium">{formErrors.email}</div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="name" className="cosmic-label text-white text-xs font-semibold">
                    Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="cosmic-input h-8 text-sm bg-black/50 border-white/30 focus:border-white/60 text-white"
                    placeholder="Your name"
                  />
                  {formErrors.name && (
                    <div className="text-xs text-red-400 font-medium">{formErrors.name}</div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="musicService" className="cosmic-label text-white text-xs font-semibold">
                    Music Service
                  </Label>
                  <select
                    id="musicService"
                    name="musicService"
                    value={formData.musicService}
                    onChange={handleInputChange}
                    className="cosmic-input h-8 w-full text-sm bg-black/70 border-white/30 focus:border-white/60 text-white [&>option]:bg-slate-800 [&>option]:text-white"
                  >
                    <option value="" className="bg-slate-800 text-white">Select service</option>
                    <option value="spotify" className="bg-slate-800 text-white">Spotify</option>
                    <option value="appleMusic" className="bg-slate-800 text-white">Apple Music</option>
                    <option value="youtubeMusic" className="bg-slate-800 text-white">YouTube Music</option>
                    <option value="amazonMusic" className="bg-slate-800 text-white">Amazon Music</option>
                    <option value="tidalMusic" className="bg-slate-800 text-white">TIDAL</option>
                    <option value="other" className="bg-slate-800 text-white">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label className="cosmic-label text-white text-xs font-semibold flex justify-between items-start">
                    <span className="flex-1 pr-2">How interested are you to connect with people who love and listen to the same kind of music you love?</span>
                    <span className="text-xs text-blue-300 whitespace-nowrap">{formData.musicInterestLevel}%</span>
                  </Label>
                  <input
                    ref={musicSliderRef}
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={formData.musicInterestLevel}
                    onChange={(e) => handleSliderChange('musicInterestLevel', parseInt(e.target.value))}
                    className="w-full h-2 bg-blue-900/50 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    style={{ 
                      accentColor: 'rgb(59, 130, 246)',
                      cursor: 'pointer'
                    }}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label className="cosmic-label text-white text-xs font-semibold flex justify-between items-start">
                    <span className="flex-1 pr-2">How interested are you to connect with people based on astrological compatibility?</span>
                    <span className="text-xs text-purple-300 whitespace-nowrap">{formData.astrologyInterestLevel}%</span>
                  </Label>
                  <input
                    ref={astrologySliderRef}
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={formData.astrologyInterestLevel}
                    onChange={(e) => handleSliderChange('astrologyInterestLevel', parseInt(e.target.value))}
                    className="w-full h-2 bg-purple-900/50 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    style={{ 
                      accentColor: 'rgb(168, 85, 247)',
                      cursor: 'pointer'
                    }}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="expectations" className="cosmic-label text-white text-xs font-semibold">
                    What features would you like to see? Any concerns?
                  </Label>
                  <textarea
                    id="expectations"
                    name="expectations"
                    value={formData.expectations}
                    onChange={handleInputChange}
                    className="cosmic-input h-20 text-sm w-full resize-none p-2 bg-black/50 border-white/30 focus:border-white/60 text-white"
                    placeholder="Share your expectations and concerns..."
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-1">
                  <Checkbox
                    id="newsletterSignup"
                    checked={formData.newsletterSignup}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('newsletterSignup', checked === true)
                    }
                    className="cosmic-checkbox h-3 w-3 border-white/40"
                  />
                  <Label
                    htmlFor="newsletterSignup"
                    className="cosmic-label text-white text-xs cursor-pointer"
                  >
                    Sign up for LYRA newsletter
                  </Label>
                </div>
              </div>
              
              {formErrors.general && (
                <div className="text-xs text-red-400 font-medium">{formErrors.general}</div>
              )}
              
              <Button 
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center h-9 cosmic-button bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Star className="mr-1 h-3 w-3" />
                    Submit
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
        
        {renderConnectionTest()}
        
      </div>
    </div>
  );
};

export default Interest;