import React, { useState, useEffect, useRef } from 'react';
import type { CapabilityVideo } from '../types';
import { generateSingleVideo, generateSpeech } from '../services/geminiService';

const initialCapabilities: CapabilityVideo[] = [
  {
    id: 'nlp',
    title: 'Natural Language Processing',
    description: 'Unlocking the meaning within human language, from sentiment analysis to text summarization.',
    videoPrompt: 'A cinematic, abstract animation of text morphing into meaningful data visualizations, representing natural language processing. Show glowing lines of code and data streams. Modern, sleek, sophisticated tech aesthetic.',
    narrationPrompt: 'Say with a confident and clear tone: Natural Language Processing. Unlocking the meaning within human language, from sentiment analysis to text summarization.',
    videoUrl: null, audioData: null, status: 'idle'
  },
  {
    id: 'ml',
    title: 'Machine Learning',
    description: 'Empowering systems to learn from data, identify patterns, and make decisions with minimal human intervention.',
    videoPrompt: 'An animation of a neural network learning and adapting. Show glowing nodes and connections evolving, processing data icons (charts, images, numbers), and becoming more complex and intelligent. Futurist, high-tech style.',
    narrationPrompt: 'Say with a confident and clear tone: Machine Learning. Empowering systems to learn from data, identify patterns, and make decisions with minimal human intervention.',
    videoUrl: null, audioData: null, status: 'idle'
  },
  {
    id: 'vision',
    title: 'Automated Visual Recognition',
    description: 'Giving machines the power to see, interpreting and understanding the visual world through images and video.',
    videoPrompt: 'A fast-paced sequence showing a computer identifying objects in images and videos. Highlight objects with glowing bounding boxes and labels like "car", "tree", "person". A sleek, heads-up display (HUD) style.',
    narrationPrompt: 'Say with a confident and clear tone: Automated Visual Recognition. Giving machines the power to see, interpreting and understanding the visual world through images and video.',
    videoUrl: null, audioData: null, status: 'idle'
  },
  {
    id: 'tone',
    title: 'Tone Analysis',
    description: 'Understanding the nuances of emotion and intent in written text, from customer feedback to social media.',
    videoPrompt: 'An abstract visualization of a sentence being analyzed for emotion. Show text changing color based on tone (e.g., blue for sadness, yellow for joy, red for anger). Particles and waves of color should emanate from the words. Ethereal and artistic.',
    narrationPrompt: 'Say with a confident and clear tone: Tone Analysis. Understanding the nuances of emotion and intent in written text, from customer feedback to social media.',
    videoUrl: null, audioData: null, status: 'idle'
  },
   {
    id: 'xai',
    title: 'Explainable AI',
    description: 'Building trust and transparency by making the decisions of complex AI models understandable and auditable.',
    videoPrompt: "An animation that demystifies a complex AI 'black box'. Show the box opening up to reveal a clear, understandable decision-making process with glowing flowcharts and simple icons. Focus on clarity, transparency, and trust. Clean and minimalist style.",
    narrationPrompt: 'Say with a confident and clear tone: Explainable AI. Building trust and transparency by making the decisions of complex AI models understandable and auditable.',
    videoUrl: null, audioData: null, status: 'idle'
  },
];

const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" /></svg>
);

const VideoShowcase: React.FC = () => {
  const [capabilities, setCapabilities] = useState<CapabilityVideo[]>(initialCapabilities);
  const [apiKeySelected, setApiKeySelected] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setApiKeySelected(hasKey);
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    // Assume success and update UI immediately to avoid race conditions
    setApiKeySelected(true);
  };
  
  const playNarration = (audioData: string | null) => {
    if (audioData && audioRef.current) {
        audioRef.current.src = `data:audio/webm;base64,${audioData}`;
        audioRef.current.play().catch(e => console.error("Audio playback failed", e));
    }
  };

  const generateShowcase = async () => {
    setIsGenerating(true);
    setGlobalError(null);
    setCapabilities(prev => prev.map(c => ({ ...c, status: 'generating' })));

    try {
        await Promise.all(capabilities.map(async (cap) => {
            try {
                const [videoUrl, audioData] = await Promise.all([
                    generateSingleVideo(cap.videoPrompt),
                    generateSpeech(cap.narrationPrompt),
                ]);

                setCapabilities(prev => prev.map(c => 
                    c.id === cap.id ? { ...c, status: 'done', videoUrl, audioData } : c
                ));
            } catch (err: any) {
                console.error(`Failed to generate content for ${cap.title}:`, err);
                if (err.message.includes("Requested entity was not found")) {
                     setGlobalError("Your API Key is invalid. Please select a valid key.");
                     setApiKeySelected(false);
                }
                setCapabilities(prev => prev.map(c => 
                    c.id === cap.id ? { ...c, status: 'error' } : c
                ));
            }
        }));
    } catch (e) {
        setGlobalError("An unexpected error occurred during generation.");
    } finally {
        setIsGenerating(false);
    }
  };

  if (!apiKeySelected) {
    return (
      <div className="my-12 text-center p-8 bg-slate-900/50 rounded-lg ring-1 ring-slate-700/50">
        <h3 className="text-xl font-bold text-white mb-2">Video Showcase requires an API Key</h3>
        <p className="text-slate-300 mb-4">To generate videos with the Veo model, please select your Google AI API key.</p>
        <p className="text-xs text-slate-400 mb-6">For more information, see the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline">billing documentation</a>.</p>
        <button 
            onClick={handleSelectKey} 
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
            aria-label="Select your Google AI API key to proceed"
        >
          Select API Key
        </button>
         {globalError && <p className="text-red-400 mt-4" role="alert">{globalError}</p>}
      </div>
    );
  }

  return (
    <div className="my-12 not-prose">
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <h3 className="text-xl md:text-2xl font-bold text-white">Watson Capabilities in Motion</h3>
        <p className="text-slate-300 mt-2 max-w-2xl">Click below to generate a unique, AI-powered video showcase demonstrating each key capability. This process may take several minutes.</p>
        <button 
            onClick={generateShowcase} 
            disabled={isGenerating} 
            className="mt-6 bg-blue-600 text-white font-semibold px-8 py-3 rounded-md hover:bg-blue-500 transition-transform duration-200 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
            aria-label={isGenerating ? 'Video showcase generation is in progress' : 'Generate video showcase for all capabilities'}
            aria-live="polite"
        >
          {isGenerating ? 'Generating Showcase...' : '✨ Generate Video Showcase'}
        </button>
        {globalError && <p className="text-red-400 mt-4" role="alert">{globalError}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {capabilities.map(cap => (
          <div key={cap.id} className="bg-slate-800/60 rounded-lg ring-1 ring-slate-700/50 p-4 flex flex-col justify-between shadow-lg">
            <div>
              <div className="aspect-video bg-slate-900 rounded-md mb-4 flex items-center justify-center overflow-hidden relative group">
                {cap.status === 'idle' && <span role="status" className="text-slate-500 text-sm">Ready to generate</span>}
                {cap.status === 'generating' && (
                  <div role="status" className="flex flex-col items-center text-slate-400">
                      <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" aria-label="Generating video"></div>
                      <span className="text-xs mt-2">Generating...</span>
                  </div>
                )}
                 {cap.status === 'error' && <span role="status" className="text-red-400 text-sm">Generation Failed</span>}
                 {cap.status === 'done' && cap.videoUrl && (
                   <>
                    <video src={cap.videoUrl} muted loop playsInline autoPlay className="w-full h-full object-cover" title={`${cap.title} capability demonstration video`}></video>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                            onClick={() => playNarration(cap.audioData)} 
                            className="text-white bg-blue-600/80 rounded-full p-4 hover:bg-blue-500/80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
                            aria-label={`Play narration for ${cap.title}`}
                        >
                            <PlayIcon className="w-8 h-8" aria-hidden="true" />
                        </button>
                    </div>
                   </>
                 )}
              </div>
              <h4 className="font-bold text-blue-300">{cap.title}</h4>
              <p className="text-sm text-slate-300 mt-1">{cap.description}</p>
            </div>
          </div>
        ))}
      </div>
      <audio ref={audioRef} className="hidden" />
    </div>
  );
};

export default VideoShowcase;