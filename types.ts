export interface UploadedImage {
  base64: string; // Pure base64 data without the prefix
  mimeType: string;
  previewUrl: string; // Data URL for display
  width?: number;
  height?: number;
}

export interface GenerationResult {
  imageUrl: string;
  timestamp: number;
}

export enum LoadingState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export interface AppState {
  originalImage: UploadedImage | null;
  generatedImage: GenerationResult | null;
  prompt: string;
  loadingState: LoadingState;
  errorMessage: string | null;
}