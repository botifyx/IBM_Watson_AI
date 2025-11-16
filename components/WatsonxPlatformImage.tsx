import React from 'react';

const WatsonxPlatformImage: React.FC = () => {
  return (
    <figure className="my-10 animate-fade-in not-prose">
      <div className="bg-slate-900/50 p-2 rounded-lg shadow-xl ring-1 ring-slate-700/50">
        <img 
          // NOTE: This is a placeholder representing the AI-generated image.
          src="https://storage.googleapis.com/aistudio-hosting/generative-ai/assets/ibm-watsonx-platform.png" 
          alt="An abstract representation of the IBM Watsonx platform, showing three interconnected modules for AI, data, and governance, with a modern, glowing aesthetic."
          className="rounded-md w-full h-auto object-cover"
        />
      </div>
      <figcaption className="text-center text-sm text-slate-400 mt-3 italic">
        The Watsonx platform, unifying AI, data, and governance for the enterprise.
      </figcaption>
    </figure>
  );
};

export default WatsonxPlatformImage;
