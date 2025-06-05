// src/pages/Blog.tsx
import React from 'react';

const Blog: React.FC = () => {
  return (
    <div className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Lyra Blog</h1>
      <p className="text-xl md:text-2xl text-slate-300">
        Our blog is launching soon. Stay tuned for updates and articles!
      </p>
    </div>
  );
};

export default Blog;
