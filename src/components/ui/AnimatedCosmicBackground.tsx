import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCosmicBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

const AnimatedCosmicBackground: React.FC<AnimatedCosmicBackgroundProps> = ({ children, className }) => {
  // Define multiple stars with random properties for a natural look
  const numStars = 20; // Reduced star count for a more subtle effect
  const stars = Array.from({ length: numStars }).map((_, i) => ({
    id: i,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 0.5, // Star size between 0.5px and 2.5px
    opacity: Math.random() * 0.5 + 0.3, // Opacity between 0.3 and 0.8
    duration: Math.random() * 8 + 7, // Slower twinkle duration between 7s and 15s
  }));

  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: [
            'linear-gradient(170deg, #20124F 70%, rgba(137, 255, 119, 0.7) 95%)',
            'linear-gradient(170deg, #20124F 65%, rgba(137, 255, 119, 0.6) 90%)',
            'linear-gradient(170deg, #20124F 70%, rgba(137, 255, 119, 0.7) 95%)', // Loop back for smooth transition
          ],
        }}
        transition={{
          duration: 80, // Significantly slower duration for a subtle shift
          ease: 'linear',
          repeat: Infinity,
        }}
      />
      
      {/* Stars Layer */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        {stars.map(star => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              backgroundColor: 'rgba(255, 255, 255, 0.4)', // Fainter white stars
            }}
            animate={{
              opacity: [star.opacity * 0.7, star.opacity * 0.1, star.opacity * 0.7], // More subtle opacity shift
              scale: [1, 1.05, 1], // Even more subtle scale animation
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedCosmicBackground;
