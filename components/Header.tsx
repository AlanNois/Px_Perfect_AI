import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-gray-800 bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
              <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436h.004c-1.733 1.337-3.748 2.283-5.908 2.683l-1.534 2.848a.75.75 0 01-1.318 0l-1.534-2.848a13.556 13.556 0 01-5.908-2.683 12.46 12.46 0 01-.124-.109C-2.448 9.012 2.063 1.5 2.063 1.5a.75.75 0 01.75.75c0 5.056 2.383 9.555 6.084 12.436l.418-.778v.004a11.946 11.946 0 002.683-5.908c.295-1.64.453-3.338.453-5.084h-2.636c-1.746 0-3.444.158-5.084.453-.66.118-1.312.258-1.954.418z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">PixelPerfect AI</h1>
            <p className="text-xs text-gray-400">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-medium text-gray-300">
            v1.0.0
          </span>
        </div>
      </div>
    </header>
  );
};