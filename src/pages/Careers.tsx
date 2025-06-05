// src/pages/Careers.tsx
import React from 'react';

const Careers: React.FC = () => {
  return (
    <div className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center min-h-screen bg-slate-900 text-white">
      <div className="bg-slate-800 p-8 md:p-12 rounded-xl shadow-2xl max-w-2xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-purple-400">Join Our Team</h1>
        <p className="text-xl md:text-2xl text-slate-300 mb-4">
          We're looking for passionate individuals to help shape the future of music and connection.
        </p>
        <p className="text-lg text-slate-400">
          Our careers page is currently under development. Please check back soon for exciting opportunities at Lyra!
        </p>
      </div>
    </div>
  );
};

export default Careers;
