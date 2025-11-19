import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { Controls } from './components/Controls';
import { AppState, LoadingState, UploadedImage, GenerationResult } from './types';
import { editImageWithGemini } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    originalImage: null,
    generatedImage: null,
    prompt: '',
    loadingState: LoadingState.IDLE,
    errorMessage: null
  });

  const [showComparisonOriginal, setShowComparisonOriginal] = useState(false);

  const handleImageUpload = (image: UploadedImage) => {
    setState(prev => ({
      ...prev,
      originalImage: image,
      generatedImage: null, // Reset generated image on new upload
      loadingState: LoadingState.IDLE,
      errorMessage: null
    }));
    setShowComparisonOriginal(false);
  };

  const setPrompt = (prompt: string) => {
    setState(prev => ({ ...prev, prompt }));
  };

  const handleGenerate = async () => {
    if (!state.originalImage || !state.prompt) return;

    setState(prev => ({ 
      ...prev, 
      loadingState: LoadingState.GENERATING,
      errorMessage: null 
    }));
    setShowComparisonOriginal(false);

    try {
      const generatedBase64 = await editImageWithGemini(state.originalImage, state.prompt);
      
      setState(prev => ({
        ...prev,
        generatedImage: {
          imageUrl: generatedBase64,
          timestamp: Date.now()
        },
        loadingState: LoadingState.SUCCESS
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loadingState: LoadingState.ERROR,
        errorMessage: error.message || 'An unknown error occurred'
      }));
    }
  };

  const downloadImage = () => {
    if (!state.generatedImage) return;
    const link = document.createElement('a');
    link.href = state.generatedImage.imageUrl;
    link.download = `pixelperfect-edit-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a]">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        
        {/* Error Toast */}
        {state.errorMessage && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-bounce-in">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
            </svg>
            {state.errorMessage}
          </div>
        )}

        {/* Controls Section */}
        <div className="flex flex-col items-center justify-center gap-6 py-4">
           <h2 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            How should we transform your image?
           </h2>
           <Controls 
             prompt={state.prompt}
             setPrompt={setPrompt}
             onGenerate={handleGenerate}
             loadingState={state.loadingState}
             hasImage={!!state.originalImage}
           />
        </div>

        {/* Workspace Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
          
          {/* Left: Original / Upload */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Input Image</h3>
              {state.originalImage && (
                 <button 
                   onClick={() => setState(prev => ({...prev, originalImage: null, generatedImage: null}))}
                   className="text-xs text-red-400 hover:text-red-300 transition-colors"
                 >
                   Clear All
                 </button>
              )}
            </div>
            <div className="h-[500px] rounded-2xl bg-gray-800/50 border border-gray-700 overflow-hidden shadow-xl backdrop-blur-sm">
              <ImageUploader 
                onImageUpload={handleImageUpload}
                currentImage={state.originalImage}
              />
            </div>
          </div>

          {/* Right: Result */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1 h-8">
              <div className="flex items-center gap-4">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Generated Result</h3>
                {state.generatedImage && (
                  <div className="flex bg-gray-800/80 rounded-lg p-0.5 border border-gray-700">
                    <button
                      onClick={() => setShowComparisonOriginal(true)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                        showComparisonOriginal 
                          ? 'bg-gray-600 text-white shadow-sm' 
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      Original
                    </button>
                    <button
                      onClick={() => setShowComparisonOriginal(false)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                        !showComparisonOriginal 
                          ? 'bg-primary-600 text-white shadow-sm' 
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      Edited
                    </button>
                  </div>
                )}
              </div>
              
              {state.generatedImage && (
                <button 
                  onClick={downloadImage}
                  className="text-xs flex items-center gap-1 text-primary-400 hover:text-primary-300 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                  </svg>
                  Download
                </button>
              )}
            </div>
            
            <div className="relative h-[500px] rounded-2xl bg-gray-800/50 border border-gray-700 overflow-hidden shadow-xl backdrop-blur-sm flex items-center justify-center group">
              {state.loadingState === LoadingState.GENERATING ? (
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                     <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
                     <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
                  </div>
                  <p className="text-primary-300 animate-pulse font-medium">Processing with Nano Banana...</p>
                  <p className="text-xs text-gray-500 mt-2">This might take a few seconds</p>
                </div>
              ) : state.generatedImage ? (
                <div className="relative w-full h-full">
                  <img 
                    src={showComparisonOriginal ? state.originalImage?.previewUrl : state.generatedImage.imageUrl} 
                    alt={showComparisonOriginal ? "Original Image" : "Generated Result"}
                    className="w-full h-full object-contain transition-opacity duration-300"
                  />
                  
                  {/* Badge for Generated/Original */}
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-md text-xs text-white font-medium shadow-lg transition-colors z-10 ${
                    showComparisonOriginal 
                      ? 'bg-black/60 backdrop-blur-md' 
                      : 'bg-gradient-to-r from-primary-600 to-purple-600'
                  }`}>
                     {showComparisonOriginal ? 'Original Input' : 'Gemini Edit'}
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 opacity-30">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                   <p className="font-light">No result yet. Upload an image and enter a prompt.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;