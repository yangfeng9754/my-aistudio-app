import React, { useEffect, useState } from 'react';
import { checkApiKey, promptApiKeySelection } from '../services/geminiService';
import { Key, AlertTriangle } from 'lucide-react';

interface Props {
  onReady: () => void;
}

export const ApiKeyChecker: React.FC<Props> = ({ onReady }) => {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const verifyKey = async () => {
    setLoading(true);
    try {
      const selected = await checkApiKey();
      setHasKey(selected);
      if (selected) {
        onReady();
      }
    } catch (e) {
      console.error("Error checking API key", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectKey = async () => {
    try {
      await promptApiKeySelection();
      // Re-verify after selection attempt
      await verifyKey();
    } catch (e) {
      console.error("Failed to select key", e);
    }
  };

  if (loading) {
    return <div className="p-4 text-center text-zinc-400 animate-pulse">Checking permissions...</div>;
  }

  if (hasKey) {
    return null; // Invisible if key is present
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
        <div className="bg-indigo-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <Key className="w-8 h-8 text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Access Required</h2>
        <p className="text-zinc-400 mb-6">
          To use the professional grade Gemini models (Veo & Image 3 Pro), you must connect a paid API key.
        </p>
        
        <button
          onClick={handleSelectKey}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Key className="w-4 h-4" />
          Select API Key
        </button>

        <div className="mt-6 pt-6 border-t border-zinc-800 text-xs text-zinc-500 flex items-start justify-center gap-2">
           <AlertTriangle className="w-4 h-4 shrink-0" />
           <p>
             You need a billing-enabled Google Cloud Project. 
             <a 
               href="https://ai.google.dev/gemini-api/docs/billing" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-indigo-400 hover:underline ml-1"
             >
               Learn more
             </a>
           </p>
        </div>
      </div>
    </div>
  );
};