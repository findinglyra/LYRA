import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Assuming you use React Router for navigation
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Download, Copyright, Clock, Instagram, Twitter, Facebook, Linkedin, Youtube, Rss } from 'lucide-react'; // Added more icons
import { toast } from '@/components/ui/use-toast'; // Assuming this is your toast component path

// Placeholder for a logo component or SVG
const Logo = () => (
  <svg height="32" viewBox="0 0 100 32" className="fill-current text-white">
    <text x="0" y="28" fontSize="30" fontWeight="bold">Lyra</text>
  </svg>
);

const backgroundImages = [
  '/index1.jpg',
  '/index6.jpeg',
  '/index9.jpeg',
  '/index11.jpeg',
  '/index13.jpeg',
  '/index8-1.jpeg'
];

interface BackgroundCarouselProps {
  images: string[];
}

const BackgroundCarousel: React.FC<BackgroundCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 7000); // Change image every 7 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
      <AnimatePresence initial={false} custom={currentIndex}>
        {images.map((image, index) => (
          index === currentIndex && (
            <motion.div
              key={index} // Use index as key for simplicity here, ensure images are stable if reordering
              className="absolute top-0 left-0 w-full h-full"
              custom={currentIndex}
              initial={{ opacity: 0, x: index > ((currentIndex -1 + images.length) % images.length) ? 300 : -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: index < ((currentIndex +1) % images.length) ? -300 : 300 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <img 
                src={image} 
                alt={`Background ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Overlay to ensure text readability */}
              <div className="absolute top-0 left-0 w-full h-full bg-black/60"></div>
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  );
};

const Index: React.FC = () => {
  // State for announcement bar visibility (example)
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  return (
    <div className="min-h-screen text-white flex flex-col relative isolate">
      <BackgroundCarousel images={backgroundImages} />
      {/* Announcement Bar - Example */} 
      {showAnnouncement && (
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-center p-2 text-sm relative">
          <span>✨ Our new platform is launching soon! Sign up for early access! ✨</span>
          <button 
            onClick={() => setShowAnnouncement(false)} 
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-xl font-bold"
            aria-label="Close announcement"
          >
            &times;
          </button>
        </div>
      )}

      {/* Header Navigation - Example Structure */}
      <header className="sticky top-0 z-50 bg-slate-900/10 backdrop-blur-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/features" className="hover:text-blue-400 transition-colors">Features</Link>
            <Link to="/about" className="hover:text-blue-400 transition-colors">About</Link>
            <Link to="/blog" className="hover:text-blue-400 transition-colors">Blog</Link>
            <Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="px-4 py-2 border border-blue-500 rounded-md hover:bg-blue-500 transition-colors text-sm">
              Login
            </Link>
            <Link to="/signup" className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors text-sm">
              Sign Up
            </Link>
          </div>
          {/* Mobile Menu Button - Placeholder */}
          <div className="md:hidden">
            <button aria-label="Open menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
                <path d="M4 6H20M4 12H20M4 18H20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area - This is where content from Homepage.tsx could be integrated */}
      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Finding Lyra
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Connect your universe. Discover meaningful connections through the power of music.
        </motion.p>
        
        <div className="mb-12 w-full max-w-2xl">
          <CountdownTimer />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-16" // Added margin bottom to separate from gallery
        >
          <Link 
            to="/interest"
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg"
          >
            Join the Waitlist <ChevronRight className="inline-block ml-2" />
          </Link>
        </motion.div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900/70 border-t border-slate-700 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-slate-400">
          {/* About Lyra */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Lyra</h3>
            <p className="text-sm mb-4">
              Finding Lyra is a new way to connect with people who share your musical soul. Discover, match, and vibe.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.tiktok.com/@findinglyra" className="hover:text-white transition-colors" aria-label="TikTok">
                <Rss size={20} /> {/* Placeholder for TikTok icon if not available */}
              </a>
              <a href="https://www.instagram.com/findlyra/" className="hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com/findlyra" className="hover:text-white transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
               <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="YouTube">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors inline-flex items-center"><ChevronRight size={14} className="mr-1" /> About Us</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors inline-flex items-center"><ChevronRight size={14} className="mr-1" /> Blog</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors inline-flex items-center"><ChevronRight size={14} className="mr-1" /> Careers</Link></li>
              <li><Link to="/press" className="hover:text-white transition-colors inline-flex items-center"><ChevronRight size={14} className="mr-1" /> Press</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors inline-flex items-center"><ChevronRight size={14} className="mr-1" /> Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors inline-flex items-center"><ChevronRight size={14} className="mr-1" /> Terms of Service</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors inline-flex items-center"><ChevronRight size={14} className="mr-1" /> Contact Us</Link></li>
            </ul>
          </div>
          
          {/* App downloads */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Download App</h3>
            <p className="text-sm text-slate-400 mb-4">
              Get the Lyra experience on your mobile device. Coming soon to iOS and Android.
            </p>
            <div className="space-y-3">
              <button 
                className="w-full flex items-center p-3 border border-slate-700 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                onClick={() => toast({ title: "Coming Soon", description: "The Lyra app for iOS will be available soon!"})}
              >
                <Download size={24} className="mr-3 text-purple-400" />
                <div>
                  <p className="text-xs text-slate-400">Download on the</p>
                  <p className="text-sm font-semibold text-white">App Store</p>
                </div>
              </button>
              <button 
                className="w-full flex items-center p-3 border border-slate-700 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                onClick={() => toast({ title: "Coming Soon", description: "The Lyra app for Android will be available soon!"})}
              >
                <Download size={24} className="mr-3 text-purple-400" />
                <div>
                  <p className="text-xs text-slate-400">Get it on</p>
                  <p className="text-sm font-semibold text-white">Google Play</p>
                </div>
              </button>
            </div>
          </div>

          {/* Newsletter/Stay Updated */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
            <p className="text-sm text-slate-400 mb-4">
              Subscribe to our newsletter for the latest updates and launch news.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-grow p-2 rounded-md bg-slate-800 border border-slate-700 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-purple-600 rounded-md hover:bg-purple-700 transition-colors text-sm font-semibold"
                onClick={(e) => { e.preventDefault(); toast({title: "Subscribed!", description: "Thanks for subscribing!"}); }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        {/* Footer bottom with copyright */}
        <div className="mt-10 pt-8 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <div className="flex items-center mb-2 md:mb-0">
            <Copyright size={14} className="mr-1.5" /> {new Date().getFullYear()} Lyra. All rights reserved.
          </div>
          <div className="flex space-x-3">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="select-none">•</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span className="select-none">•</span>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

const CountdownTimer = () => {
  const launchDate = new Date("2025-07-05T12:00:00+01:00"); // Adjusted launch date for example
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +launchDate - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full max-w-md">
        {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
          <div key={unit} className="flex flex-col items-center">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 sm:p-5 w-full text-center border border-purple-500/30 hover:border-purple-500/50 transition-colors shadow-lg">
              <span className="text-3xl sm:text-5xl font-bold text-white">
                {/* @ts-ignore */}
                {String(timeLeft[unit]).padStart(2, '0')}
              </span>
            </div>
            <span className="text-xs sm:text-sm mt-2 text-slate-400 capitalize">{unit}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center mt-4 mb-2 text-slate-400">
        <Clock className="h-4 w-4 mr-2 text-purple-400" />
        <span className="text-xs sm:text-sm">Until Official Launch (London Time)</span>
      </div>
    </div>
  );
};

export default Index;

