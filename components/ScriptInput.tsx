import React, { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface Props {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

export const ScriptInput: React.FC<Props> = ({ onAnalyze, isAnalyzing }) => {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setText(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = () => {
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="relative group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your script here, or upload a file..."
          className="w-full h-64 bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-zinc-300 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none font-mono text-sm leading-relaxed transition-all"
        />
        
        {text && (
          <button 
            onClick={() => setText('')}
            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload File
          </button>
          <input
            type="file"
            accept=".txt,.md,.fountain"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!text.trim() || isAnalyzing}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            text.trim() && !isAnalyzing
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Analyzing Script...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              Analyze Script
            </>
          )}
        </button>
      </div>
    </div>
  );
};