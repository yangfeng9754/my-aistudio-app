import { GoogleGenAI, Type } from "@google/genai";
import { ImageSize, ScriptAnalysisResponse } from "../types";

// Helper to ensure we get a fresh instance with the potentially updated key
const getGenAI = async (): Promise<GoogleGenAI> => {
  // Check if we need to force key selection for Pro models
  if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
          // We rely on the UI to trigger openSelectKey, but here we just ensure 
          // we don't proceed without a valid environment if possible.
          // However, for the initial process.env read, we assume it's injected.
      }
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const checkApiKey = async (): Promise<boolean> => {
  if (window.aistudio) {
    return await window.aistudio.hasSelectedApiKey();
  }
  // Fallback if not running in the specific environment that supports this global
  return !!process.env.API_KEY;
};

export const promptApiKeySelection = async (): Promise<void> => {
  if (window.aistudio) {
    await window.aistudio.openSelectKey();
  }
};

export const analyzeScript = async (scriptText: string): Promise<ScriptAnalysisResponse> => {
  const ai = await getGenAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Analyze the following movie script or text. Break it down into key visual scenes for a storyboard. 
    For each scene, provide:
    1. A detailed "visualDescription" optimized for an image generation model (include lighting, camera angle, subject details, background).
    2. A "caption" describing the plot point.
    3. A "shotType" (e.g., Close-up, Wide shot, Over-the-shoulder).
    
    Return the result as a JSON object with a "scenes" array.
    
    Script:
    ${scriptText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scenes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                visualDescription: { type: Type.STRING },
                caption: { type: Type.STRING },
                shotType: { type: Type.STRING },
              },
              required: ["visualDescription", "caption", "shotType"],
            },
          },
        },
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as ScriptAnalysisResponse;
};

export const generateSceneImage = async (
  prompt: string, 
  size: ImageSize
): Promise<string> => {
  const ai = await getGenAI();
  
  // Gemini 3 Pro Image Preview requires specific handling
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: size, 
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("No image generated");
};

export const createChatSession = async () => {
    const ai = await getGenAI();
    return ai.chats.create({
        model: "gemini-3-pro-preview",
        config: {
            systemInstruction: "You are a specialized creative assistant for a storyboard artist. Help the user refine their script, suggest visual improvements for scenes, and discuss cinematography. Keep responses concise and helpful."
        }
    });
};
