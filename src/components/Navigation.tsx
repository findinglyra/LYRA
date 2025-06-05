
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // Added for authentication status
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Users, Settings, Home, Music } from "lucide-react";

export const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isAuthenticated } = useAuth(); // Added for authentication status

  const navItems = [
    { icon: Home, label: "Feed", path: isAuthenticated ? "/feed" : "/" },
    { icon: Heart, label: "Match", path: "/match" },
    { icon: MessageSquare, label: "Chat", path: "/chat" },
    { icon: Music, label: "Music", path: "/music" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t z-50">
      <div className="max-w-md mx-auto px-4 py-2 flex justify-around items-center">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = path === "/" 
            ? currentPath === path 
            : currentPath.startsWith(path);
            
          return (
            <Link
              key={label}
              to={path}
              className="flex flex-col items-center gap-1"
            >
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
              </Button>
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
