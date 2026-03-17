import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface EnhanceOptions {
  bullet: string;
  company?: string;
  role?: string;
}

export async function enhanceBulletPoint({ bullet, company, role }: EnhanceOptions): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  // We use the flash model for speed on single text transformation tasks
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
You are an expert resume writer and career coach. Your task is to take a weak or standard resume bullet point and rewrite it into a powerful accomplishment statement using the STAR method (Situation, Task, Action, Result).

Guidelines:
1. Start with a strong action verb.
2. Quantify results with metrics/numbers where plausible, but keep it realistic.
3. Make it concise—strictly ONE sentence, maximum 2 lines long.
4. Focus on the impact and value delivered.
5. Do NOT include markdown formatting, bullet symbols (like -, *, •), or quotation marks in the output. Return ONLY the raw text.
6. Do not fabricate wild lies, but intelligently assume standard industry metrics if the input is too vague.

Context:
- Company context (optional): ${company || 'Unknown'}
- Role context (optional): ${role || 'Unknown'}

Original Bullet Point:
"${bullet}"

Enhanced Bullet Point:`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Clean up any accidental markdown or quotes the AI might still inject despite instructions
    let enhancedText = response.text().trim();
    enhancedText = enhancedText.replace(/^[-*•\s]+/, ''); // Remove leading list markers
    enhancedText = enhancedText.replace(/^["']|["']$/g, ''); // Remove wrapping quotes
    
    return enhancedText;
  } catch (error) {
    console.error('Failed to enhance bullet point with AI:', error);
    throw new Error('Failed to reach AI service for enhancement');
  }
}
