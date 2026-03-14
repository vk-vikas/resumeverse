import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Get the Gemini generative model instance.
 * Uses gemini-1.5-flash for fast, free-tier inference.
 */
export function getGeminiModel() {
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
}
