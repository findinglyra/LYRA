// src/pages/About.tsx
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">About Lyra</h1>
      <p className="text-xl md:text-2xl text-slate-300">
        More information about Finding Lyra is coming soon!
      </p>
    </div>
  );
};

export default About;
