
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  Globe,
  Lock,
  Music,
  UserCircle,
  ChevronRight,
} from "lucide-react";

const Settings = () => {
  return (
    <div className="container max-w-md mx-auto py-8 px-4 space-y-8">
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Settings</h2>
        
        <div className="space-y-4">
          {settingSections.map((section) => (
            <div key={section.title} className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-3 rounded-lg glass-morphism"
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
