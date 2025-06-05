// src/pages/Terms.tsx
import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="flex-grow container mx-auto px-4 py-12 flex flex-col items-start justify-center min-h-screen bg-slate-900 text-white">
      <div className="bg-slate-800 p-8 md:p-12 rounded-xl shadow-2xl max-w-3xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-purple-400">Terms of Service</h1>
        <div className="space-y-6 text-slate-300 text-left">
          <p className="text-lg">
            Welcome to Lyra! Our Terms of Service govern your use of our platform and services. The full document outlining these terms will be published here very soon.
          </p>
          <p>
            By accessing or using Lyra, you will be agreeing to these terms. It's important to understand your rights and obligations. Key aspects will include:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4 text-slate-400">
            <li>User Conduct and Responsibilities</li>
            <li>Account Registration and Security</li>
            <li>Content Ownership and Licenses</li>
            <li>Prohibited Activities</li>
            <li>Disclaimers and Limitation of Liability</li>
            <li>Termination of Service</li>
            <li>Governing Law</li>
          </ul>
          <p className="mt-6 text-slate-400">
            We encourage you to review the full Terms of Service once available. Thank you for being a part of the Lyra community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
