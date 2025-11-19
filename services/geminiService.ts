import { GoogleGenAI, Modality } from "@google/genai";
import { UploadedImage } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Edits an image using the Gemini 2.5 Flash Image model based on a text prompt.
 * 
 * @param image - The source image object containing base64 data and mimeType
 * @param prompt - The text instruction for editing (e.g., "Remove background")
 * @returns A promise resolving to the base64 data URL of the generated image
 */
export const editImageWithGemini = async (
  image: UploadedImage, 
  prompt: string
): Promise<string> => {
  try {
    const modelId = 'gemini-2.5-flash-image';
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              data: image.base64,
              mimeType: image.mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        // Critical for image generation tasks
        responseModalities: [Modality.IMAGE],
      },
    });

    // Parse the response to get the image data
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content?.parts;
      if (parts) {
        // Look for the part containing inlineData (the image)
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const base64ImageBytes = part.inlineData.data;
            // Construct a usable data URL
            // Note: The model typically returns PNG for edits, but we check logic if needed.
            // Usually safe to assume PNG or JPEG based on input, but let's assume png for generated output usually.
            return `data:image/png;base64,${base64ImageBytes}`; 
          }
        }
      }
    }

    throw new Error("No image data found in the response.");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate image");
  }
};