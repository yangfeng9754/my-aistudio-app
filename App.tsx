import React, { useState } from 'react';
import { Film, Sparkles } from 'lucide-react';
import { Scene, ImageSize } from './types';
import { analyzeScript, generateSceneImage } from './services/geminiService';
import { ApiKeyChecker } from './components/ApiKeyChecker';
import { ScriptInput } from './components/ScriptInput';
import { Storyboard } from './components/Storyboard';
import { SettingsBar } from './components/SettingsBar';
import { ChatBot } from './components/ChatBot';

function App() {
  const [isKeyReady, setIsKeyReady] = useState(false);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [isGeneratingAny, setIsGeneratingAny] = useState(false);

  const handleScriptAnalysis = async (scriptText: string) => {
    setIsAnalyzing(true);
    setScenes([]); // Clear previous
    try {
      const result = await analyzeScript(scriptText);
      const newScenes: Scene[] = result.scenes.map((s, index) => ({
        ...s,
        id: crypto.randomUUID(),
        sceneNumber: index + 1,
      }));
      setScenes(newScenes);
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Failed to analyze script. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateImage = async (sceneId: string) => {
    setScenes(prev => prev.map(s => 
      s.id === sceneId ? { ...s, isGenerating: true, error: undefined } : s
    ));

    const scene = scenes.find(s => s.id === sceneId);
    if (!scene) return;

    try {
      // Create a rich prompt by combining description and style info
      const fullPrompt = `${scene.visualDescription}. Shot type: ${scene.shotType}. Cinematic lighting, photorealistic, 8k, highly detailed.`;
      
      const imageUrl = await generateSceneImage(fullPrompt, imageSize);
      
      setScenes(prev => prev.map(s => 
        s.id === sceneId ? { ...s, imageUrl, isGenerating: false } : s
      ));
    } catch (error) {
      console.error(`Failed to generate image for scene ${sceneId}`, error);
      setScenes(prev => prev.map(s => 
        s.id === sceneId ? { 
          ...s, 
          isGenerating: false, 
          error: "Generation failed. Try again." 
        } : s
      ));
    }
  };

  const handleGenerateAll = async () => {
    setIsGeneratingAny(true);
    // Process sequentially to be nice to rate limits, or in small batches
    // For simpler UX, we'll trigger them all but the browser might queue them.
    // Let's do a simple loop for better control.
    
    for (const scene of scenes) {
      if (!scene.imageUrl) {
        await handleGenerateImage(scene.id);
      }
    }
    setIsGeneratingAny(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <ApiKeyChecker onReady={() => setIsKeyReady(true)} />

      {/* Hero Header */}
      <header className="py-8 px-6 text-center border-b border-zinc-900 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
              <Film className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">StoryBoard AI</h1>
          </div>
          <p className="text-zinc-400 max-w-lg mx-auto text-sm">
            Transform your script into a cinematic visual storyboard using Google's Gemini 3 Pro models. 
            Analyze scenes and generate <span className="text-indigo-400 font-medium">1K, 2K, or 4K</span> assets instantly.
          </p>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full space-y-12">
        {!isKeyReady ? (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
            <Sparkles className="w-10 h-10 mb-4 opacity-20" />
            <p>Waiting for API Key authorization...</p>
          </div>
        ) : (
          <>
            {/* Input Section */}
            <section className="space-y-6">
               <SettingsBar 
                 size={imageSize} 
                 onChangeSize={setImageSize} 
                 disabled={isGeneratingAny || scenes.some(s => s.isGenerating)} 
               />
               <ScriptInput onAnalyze={handleScriptAnalysis} isAnalyzing={isAnalyzing} />
            </section>

            {/* Results Section */}
            {scenes.length > 0 && (
              <Storyboard
                scenes={scenes}
                imageSize={imageSize}
                onGenerateImage={handleGenerateImage}
                onGenerateAll={handleGenerateAll}
                isGeneratingAny={isGeneratingAny}
              />
            )}
          </>
        )}
      </main>

      <ChatBot />

      <footer className="py-6 text-center text-zinc-600 text-xs border-t border-zinc-900">
        Powered by Gemini 3 Pro & Gemini 3 Pro Image Preview
      </footer>
    </div>
  );
}

export default App;