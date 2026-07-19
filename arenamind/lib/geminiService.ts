import { GoogleGenAI } from '@google/genai';

const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_KEY || '';

// Initialize the official Google Gen AI Client
const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

export async function generateGeminiResponse(
  prompt: string,
  systemInstruction?: string
): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: prompt,
    config: {
      temperature: 0.1, // Strict determinism to minimize hallucinations
      maxOutputTokens: 800,
      systemInstruction: systemInstruction,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('Gemini returned an empty response');
  }

  return text;
}
