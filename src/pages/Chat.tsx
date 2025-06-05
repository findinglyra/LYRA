
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

const Chat = () => {
  const [message, setMessage] = useState("");

  const messages = [
    {
      id: 1,
      content: "Hey! I noticed we both love jazz. Who's your favorite artist?",
      sender: "them",
      time: "2:30 PM"
    },
    {
      id: 2,
      content: "I'm a huge fan of Miles Davis! What about you?",
      sender: "me",
      time: "2:32 PM"
    }
  ];

  return (
    <div className="container max-w-md mx-auto h-[calc(100vh-5rem)]">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${ 
                  msg.sender === "me"
                    ? "bg-indigo-600 text-white"
                    : "glass-morphism text-slate-700"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <span className="text-xs text-slate-500 opacity-70 mt-1 block">
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t bg-background/80 backdrop-blur-lg">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setMessage("");
            }}
            className="flex gap-2"
          >
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="rounded-full"
            />
            <Button type="submit" size="icon" className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
