// src/pages/Privacy.tsx
import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="flex-grow container mx-auto px-4 py-12 flex flex-col items-start justify-center min-h-screen bg-slate-900 text-white">
      <div className="bg-slate-800 p-8 md:p-12 rounded-xl shadow-2xl max-w-3xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-purple-400">Privacy Policy</h1>
        <div className="space-y-6 text-slate-300 text-left">
          <p className="text-lg">
            At Lyra, we are committed to protecting your privacy. Our full Privacy Policy, detailing how we collect, use, and safeguard your personal information, will be available here soon.
          </p>
          <p>
            We believe in transparency and want you to understand your rights and our responsibilities. Key areas our policy will cover include:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4 text-slate-400">
            <li>Information We Collect</li>
            <li>How We Use Your Information</li>
            <li>Information Sharing and Disclosure</li>
            <li>Data Security</li>
            <li>Your Choices and Rights</li>
            <li>Policy Updates</li>
          </ul>
          <p className="mt-6 text-slate-400">
            Please check back shortly for the complete document. If you have immediate questions, feel free to reach out via our contact page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
