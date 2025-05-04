
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Users, Settings, Home, Music } from "lucide-react";

export const Navigation = () => {
  const [active, setActive] = useState("home");

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Heart, label: "Match", path: "/match" },
    { icon: MessageSquare, label: "Chat", path: "/chat" },
    { icon: Music, label: "Music", path: "/music" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t z-50">
      <div className="max-w-md mx-auto px-4 py-2 flex justify-around items-center">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={label}
            to={path}
            className="flex flex-col items-center gap-1"
            onClick={() => setActive(label.toLowerCase())}
          >
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${
                active === label.toLowerCase()
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
            </Button>
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
