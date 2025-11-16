import React from 'react';

const WatsonJeopardyImage: React.FC = () => {
  return (
    <figure className="my-10 animate-fade-in not-prose">
      <div className="bg-slate-900/50 p-2 rounded-lg shadow-xl ring-1 ring-slate-700/50">
        <img 
          // NOTE: This is a placeholder representing the AI-generated image.
          // In a real application, this would be a static asset.
          src="https://storage.googleapis.com/aistudio-hosting/generative-ai/assets/ibm-watson-jeopardy.png" 
          alt="The IBM Watson computer system on the Jeopardy! stage, with its iconic glowing blue orb avatar."
          className="rounded-md w-full h-auto object-cover"
        />
      </div>
      <figcaption className="text-center text-sm text-slate-400 mt-3 italic">
        Watson's iconic avatar on the set of Jeopardy! in 2011, a defining moment in AI history.
      </figcaption>
    </figure>
  );
};

export default WatsonJeopardyImage;
