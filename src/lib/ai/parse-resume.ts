import { getGeminiModel } from './gemini';
import { validateResumeData } from '@/lib/utils/schema';
import type { ResumeData } from '@/types/resume';

const SYSTEM_PROMPT = `You are an expert professional resume parser. Your job is to take raw text extracted from a resume document and convert it into a structured JSON object.

You MUST return ONLY valid JSON — no markdown fences, no explanations, no extra text.

Return a JSON object matching this exact structure:

{
  "name": "Full Name",
  "title": "Professional Title / Headline",
  "summary": "Professional summary or objective statement",
  "contact": {
    "email": "email@example.com",
    "phone": "+1-234-567-8900",
    "linkedin": "linkedin.com/in/username",
    "github": "github.com/username",
    "portfolio": "portfolio-url.com",
    "location": "City, State/Country"
  },
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or present",
      "location": "City, State",
      "bullets": ["Achievement or responsibility 1", "Achievement 2"],
      "skillsUsed": ["Skill1", "Skill2"]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Degree Type (e.g., Bachelor of Science)",
      "field": "Field of Study",
      "year": "YYYY or YYYY-YYYY",
      "gpa": "3.8/4.0"
    }
  ],
  "skills": {
    "languages": ["JavaScript", "Python"],
    "frameworks": ["React", "Node.js"],
    "tools": ["Git", "Docker"],
    "soft": ["Leadership", "Communication"]
  },
  "projects": [
    {
      "name": "Project Name",
      "description": "Brief description of the project",
      "tech": ["React", "TypeScript"],
      "link": "https://project-url.com"
    }
  ],
  "certifications": ["Certification Name (Year)"],
  "highlights": ["Notable achievement or award"]
}

Rules:
- Extract ALL information from the resume text
- If a section is not present in the resume, use an empty array [] or empty string ""
- For dates, convert to "YYYY-MM" format. If only year is given, use "YYYY-01"
- If currently employed, use "present" as endDate
- Each experience entry MUST have at least one bullet point
- For skills, categorize them as best you can into languages, frameworks, tools, and soft skills
- If the title/headline is not explicitly stated, infer it from the most recent role
- Do NOT fabricate information — only extract what is in the resume
- Return ONLY the JSON object, nothing else`;

/**
 * Parse raw resume text into structured ResumeData using Gemini AI.
 */
export async function parseResumeText(rawText: string): Promise<ResumeData> {
  const model = getGeminiModel();

  const result = await model.generateContent([
    { text: SYSTEM_PROMPT },
    { text: `Here is the resume text to parse:\n\n${rawText}` },
  ]);

  const response = result.response;
  const responseText = response.text();

  const parsed = parseAIResponse(responseText);
  const validation = validateResumeData(parsed);

  if (validation.success) {
    return validation.data;
  }

  // If validation fails, return with defaults filled in
  console.warn('Resume validation had issues:', validation.errors);
  return fillDefaults(parsed);
}

/**
 * Extract JSON from various AI response formats.
 * Handles: raw JSON, markdown-fenced JSON (```json ... ```)
 */
export function parseAIResponse(rawResponse: string): Record<string, unknown> {
  let cleaned = rawResponse.trim();

  // Strip markdown code fences if present
  if (cleaned.startsWith('```')) {
    // Remove opening fence (```json or ```)
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '');
    // Remove closing fence
    cleaned = cleaned.replace(/\n?```\s*$/, '');
    cleaned = cleaned.trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    // Try to find JSON object in the response
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        throw new Error('Failed to parse AI response as JSON');
      }
    }
    throw new Error('No valid JSON found in AI response');
  }
}

/**
 * Fill in defaults for a partially parsed resume object.
 */
function fillDefaults(parsed: Record<string, unknown>): ResumeData {
  return {
    name: (parsed.name as string) || 'Unknown',
    title: (parsed.title as string) || 'Professional',
    summary: (parsed.summary as string) || '',
    contact: (parsed.contact as ResumeData['contact']) || {},
    experience: (parsed.experience as ResumeData['experience']) || [],
    education: (parsed.education as ResumeData['education']) || [],
    skills: (parsed.skills as ResumeData['skills']) || {
      languages: [],
      frameworks: [],
      tools: [],
    },
    projects: (parsed.projects as ResumeData['projects']) || [],
    certifications: (parsed.certifications as string[]) || [],
    highlights: (parsed.highlights as string[]) || [],
  };
}
