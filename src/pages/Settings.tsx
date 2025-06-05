import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  Globe,
  Lock,
  Music,
  UserCircle,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    
    try {
      setIsLoggingOut(true);
      
      // Call the signOut method from AuthContext
      // AuthContext.signOut handles localStorage clearing, state reset, toast, and navigation
      await signOut();
      
      // The navigate call below can be redundant if AuthContext.signOut already navigates.
      // However, ensuring navigation from the Settings page context might be desired.
      // If AuthContext.signOut reliably navigates to '/', this might not be strictly needed.
      // For now, let's keep it as a local confirmation of navigation action.
      if (window.location.pathname !== '/') { // Only navigate if not already on home page (AuthContext might have already navigated)
         navigate('/', { replace: true });
      }
      
    } catch (error) {
      console.error("Logout error in Settings.tsx:", error);
      // AuthContext.signOut also has its own error toast. 
      // This toast is specific to an error caught during the Settings page's attempt to call signOut.
      toast({
        title: "Error during logout process",
        description: "There was a problem initiating logout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto py-8 px-4 space-y-8">
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Settings</h2>
        
        <div className="space-y-4">
          {settingSections.map((section) => (
            <div key={section.title} className="space-y-2">
              <h3 className="text-sm font-medium text-slate-600">
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-3 rounded-lg bg-white shadow-sm border border-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.type === "toggle" ? (
                      <Switch />
                    ) : (
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* User Info */}
        {user && (
          <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 mb-4">
            <p className="text-sm text-slate-600">Logged in as:</p>
            <p className="font-medium truncate">{user.email}</p>
          </div>
        )}

        {/* Logout Section */}
        <div className="pt-6">
          <Button 
            variant="destructive" 
            className="w-full flex items-center justify-center gap-2"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="h-4 w-4" />
            <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
          </Button>
        </div>
      </section>
    </div>
  );
};

const settingSections = [
  {
    title: "Account",
    items: [
      {
        icon: UserCircle,
        label: "Profile Settings",
        type: "link",
      },
      {
        icon: Lock,
        label: "Privacy",
        type: "link",
      },
    ],
  },
  {
    title: "Preferences",
    items: [
      {
        icon: Bell,
        label: "Notifications",
        type: "toggle",
      },
      {
        icon: Music,
        label: "Music Sharing",
        type: "toggle",
      },
      {
        icon: Globe,
        label: "Language",
        type: "link",
      },
    ],
  },
];

export default Settings;
