
import { Button } from "@/components/ui/button";
import { Users, Music, MessageSquare } from "lucide-react";

const Community = () => {
  return (
    <div className="container max-w-md mx-auto py-8 px-4 space-y-8">
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-800">Music Communities</h2>
        <div className="grid gap-4">
          {communities.map((community) => (
            <div
              key={community.name}
              className="p-4 rounded-xl glass-morphism space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Music className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-700">{community.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{community.members} members</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {community.description}
              </p>
              <Button className="w-full bg-slate-50 hover:bg-slate-200 border border-slate-300 text-indigo-600 hover:text-indigo-700 shadow-inner">
                Join Community
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-800">Recent Discussions</h2>
        <div className="space-y-3">
          {discussions.map((discussion) => (
            <div
              key={discussion.title}
              className="p-4 rounded-xl glass-morphism space-y-2"
            >
              <h3 className="font-medium text-slate-700">{discussion.title}</h3>
              <p className="text-sm text-muted-foreground">
                {discussion.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{discussion.comments} comments</span>
                </div>
                <span>Posted by {discussion.author}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const communities = [
  {
    name: "Indie Rock Lovers",
    members: 2453,
    description:
      "A community for indie rock enthusiasts to share their favorite bands, discuss new releases, and organize meetups.",
  },
  {
    name: "Electronic Music Hub",
    members: 1872,
    description:
      "Connect with fellow electronic music fans, share tracks, and discover new artists in the electronic music scene.",
  },
];

const discussions = [
  {
    title: "Best concerts of 2024 so far?",
    excerpt: "Share your favorite live music experiences from this year...",
    comments: 45,
    author: "musiclover123",
  },
  {
    title: "Hidden Gems: Underrated Artists",
    excerpt: "Let's discover and share some amazing underrated musicians...",
    comments: 32,
    author: "melody_finder",
  },
];

export default Community;
