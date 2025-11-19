import React, { useCallback, useState } from 'react';
import { LoadingState } from '../types';

interface ControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  loadingState: LoadingState;
  hasImage: boolean;
}

const SUGGESTIONS = [
  "Remove the background",
  "Make it look like a retro photo",
  "Turn this into a pencil sketch",
  "Add a sunset in the background",
  "Remove the object on the left",
  "Enhance lighting and contrast"
];

export const Controls: React.FC<ControlsProps> = ({ 
  prompt, 
  setPrompt, 
  onGenerate, 
  loadingState,
  hasImage
}) => {
  const isGenerating = loadingState === LoadingState.GENERATING;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && hasImage && prompt.trim()) {
      e.preventDefault();
      onGenerate();
    }
  };

  const handleSuggestionClick = (s: string) => {
    setPrompt(s);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto">
      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 justify-center">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => handleSuggestionClick(s)}
            disabled={isGenerating}
            className="px-3 py-1.5 text-xs rounded-full bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-primary-500 hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-50 transition duration-500 blur"></div>
        <div className="relative flex items-center bg-gray-900 rounded-xl overflow-hidden p-2 border border-gray-700 shadow-2xl">
          <div className="flex-shrink-0 pl-3 pr-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary-500 animate-pulse">
              <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM15 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0115 1.5z" clipRule="evenodd" />
            </svg>
          </div>
          
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe how to change the image (e.g., 'Remove the person on the left')"
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 px-2 py-3 text-base"
            disabled={isGenerating}
          />

          <button
            onClick={onGenerate}
            disabled={!hasImage || !prompt.trim() || isGenerating}
            className={`
              px-6 py-3 rounded-lg font-semibold text-sm transition-all flex items-center gap-2
              ${(!hasImage || !prompt.trim() || isGenerating)
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg shadow-white/10'}
            `}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-600 border-t-gray-900 rounded-full animate-spin"></div>
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <span>Generate</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
      
      {!hasImage && (
        <p className="text-center text-red-400 text-xs animate-pulse">
          * Please upload an image first
        </p>
      )}
    </div>
  );
};