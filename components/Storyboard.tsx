import React from 'react';
import { Scene, ImageSize } from '../types';
import { Image, Video, Wand2, AlertCircle, Loader2, Download } from 'lucide-react';

interface Props {
  scenes: Scene[];
  imageSize: ImageSize;
  onGenerateImage: (sceneId: string) => void;
  onGenerateAll: () => void;
  isGeneratingAny: boolean;
}

export const Storyboard: React.FC<Props> = ({
  scenes,
  imageSize,
  onGenerateImage,
  onGenerateAll,
  isGeneratingAny,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-md py-4 border-b border-zinc-800">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Video className="w-5 h-5 text-indigo-500" />
          Storyboard Scenes
          <span className="text-zinc-500 text-sm font-normal ml-2">
            ({scenes.length} frames)
          </span>
        </h2>
        
        <button
          onClick={onGenerateAll}
          disabled={isGeneratingAny}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isGeneratingAny ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
          Generate All Images ({imageSize})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
        {scenes.map((scene) => (
          <div
            key={scene.id}
            className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors flex flex-col"
          >
            {/* Image Area */}
            <div className="aspect-video bg-zinc-950 relative overflow-hidden">
              {scene.imageUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={scene.imageUrl}
                    alt={scene.caption}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-4">
                      <a 
                        href={scene.imageUrl} 
                        download={`storyboard-scene-${scene.sceneNumber}.png`}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-sm transition-colors"
                        title="Download"
                      >
                          <Download className="w-4 h-4" />
                      </a>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  {scene.isGenerating ? (
                    <div className="space-y-3">
                        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-xs text-indigo-400 animate-pulse">Rendering {imageSize}...</p>
                    </div>
                  ) : scene.error ? (
                    <div className="text-red-400 space-y-2">
                        <AlertCircle className="w-8 h-8 mx-auto opacity-50" />
                        <p className="text-xs">{scene.error}</p>
                        <button 
                            onClick={() => onGenerateImage(scene.id)}
                            className="text-xs underline hover:text-red-300"
                        >
                            Retry
                        </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-zinc-700 group-hover:text-zinc-500 transition-colors">
                            <Image className="w-6 h-6" />
                        </div>
                        <button
                            onClick={() => onGenerateImage(scene.id)}
                            className="text-xs font-medium text-zinc-500 border border-zinc-700 px-3 py-1.5 rounded-full hover:border-indigo-500 hover:text-indigo-400 transition-all"
                        >
                            Generate Frame
                        </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Scene Number Badge */}
              <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-xs font-mono text-zinc-300 border border-white/10">
                SCENE {scene.sceneNumber}
              </div>
              
              {/* Shot Type Badge */}
              <div className="absolute top-3 right-3 bg-indigo-500/80 backdrop-blur-md px-2 py-1 rounded text-xs font-semibold text-white shadow-lg">
                {scene.shotType.toUpperCase()}
              </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex-1 flex flex-col gap-3">
              <p className="font-medium text-zinc-100 line-clamp-2" title={scene.caption}>
                {scene.caption}
              </p>
              
              <div className="flex-1 bg-zinc-950/50 rounded-lg p-3 border border-zinc-800/50">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1 font-semibold">Visual Prompt</p>
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-4 hover:line-clamp-none transition-all">
                  {scene.visualDescription}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};