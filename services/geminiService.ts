
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import type { EditedImageResponse } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash-image-preview';

export async function editImage(base64ImageData: string, mimeType: string, prompt: string): Promise<EditedImageResponse> {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    const result: EditedImageResponse = { imageUrl: null, text: null };

    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          result.text = part.text;
        } else if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          result.imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
      }
    }

    if (!result.imageUrl) {
        throw new Error("API did not return an image. It might have refused the request.");
    }
    
    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to edit image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI.");
  }
}
