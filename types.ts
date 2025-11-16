export interface Section {
  id: string;
  title: string;
  prompt: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface CapabilityVideo {
  id: string;
  title: string;
  description: string;
  videoPrompt: string;
  narrationPrompt: string;
  videoUrl: string | null;
  audioData: string | null;
  status: 'idle' | 'generating' | 'done' | 'error';
}
