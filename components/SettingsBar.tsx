import React from 'react';
import { ImageSize } from '../types';
import { Settings2, Monitor } from 'lucide-react';

interface Props {
  size: ImageSize;
  onChangeSize: (size: ImageSize) => void;
  disabled: boolean;
}

export const SettingsBar: React.FC<Props> = ({ size, onChangeSize, disabled }) => {
  return (
    <div className="flex items-center gap-6 bg-zinc-900/50 border border-zinc-800 rounded-xl p-2 px-4 w-fit mx-auto backdrop-blur-sm">
      <div className="flex items-center gap-2 text-zinc-400">
        <Settings2 className="w-4 h-4" />
        <span className="text-sm font-medium">Generation Settings</span>
      </div>

      <div className="h-4 w-px bg-zinc-800" />

      <div className="flex items-center gap-2">
        <Monitor className="w-4 h-4 text-zinc-500" />
        <span className="text-sm text-zinc-500 mr-2">Resolution:</span>
        <div className="flex bg-zinc-950 rounded-lg p-1 border border-zinc-800">
          {(['1K', '2K', '4K'] as ImageSize[]).map((s) => (
            <button
              key={s}
              onClick={() => onChangeSize(s)}
              disabled={disabled}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                size === s
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              } disabled:opacity-50`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};