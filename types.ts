export interface Scene {
  id: string;
  sceneNumber: number;
  visualDescription: string;
  caption: string;
  shotType: string;
  imageUrl?: string;
  isGenerating?: boolean;
  error?: string;
}

export type ImageSize = '1K' | '2K' | '4K';

export interface ScriptAnalysisResponse {
  scenes: {
    visualDescription: string;
    caption: string;
    shotType: string;
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

// Global window extension for aistudio
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}