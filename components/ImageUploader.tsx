import React, { useCallback, useState } from 'react';
import { UploadedImage } from '../types';

interface ImageUploaderProps {
  onImageUpload: (image: UploadedImage) => void;
  currentImage: UploadedImage | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, currentImage }) => {
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Extract base64 data part (remove "data:image/xxx;base64," prefix)
      const base64Data = result.split(',')[1];
      
      onImageUpload({
        base64: base64Data,
        mimeType: file.type,
        previewUrl: result,
      });
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  return (
    <div className="relative w-full h-full min-h-[300px] flex flex-col">
      {currentImage ? (
        <div className="relative group w-full h-full flex items-center justify-center bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
           {/* Image Display */}
          <img 
            src={currentImage.previewUrl} 
            alt="Original Upload" 
            className="max-w-full max-h-[500px] object-contain"
          />
          
          {/* Hover Overlay for replacing */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <label className="cursor-pointer px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30 rounded-lg text-white font-medium transition-all">
               Replace Image
               <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleChange}
              />
             </label>
          </div>
          
          <div className="absolute top-3 left-3 px-3 py-1 bg-black/50 backdrop-blur rounded-md text-xs text-white font-mono">
            Original
          </div>
        </div>
      ) : (
        <label
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`
            flex-1 flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed transition-all cursor-pointer
            ${isDragging 
              ? 'border-primary-500 bg-primary-500/10' 
              : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/50'}
          `}
        >
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleChange}
          />
          <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Upload an image</h3>
          <p className="text-sm text-gray-400 text-center max-w-xs">
            Drag and drop your photo here, or click to browse files
          </p>
          <p className="text-xs text-gray-500 mt-4">
            Supports JPG, PNG, WebP
          </p>
        </label>
      )}
    </div>
  );
};