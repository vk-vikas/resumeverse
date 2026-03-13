import { z } from 'zod/v4';
import type { ResumeData } from '@/types/resume';

// --- Sub-schemas ---

const contactSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  portfolio: z.string().optional(),
  location: z.string().optional(),
});

const experienceItemSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  location: z.string().optional(),
  bullets: z.array(z.string()).min(1, 'At least one bullet point is required'),
  skillsUsed: z.array(z.string()).optional(),
});

const educationItemSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().optional(),
  year: z.string().min(1, 'Year is required'),
  gpa: z.string().optional(),
});

const projectItemSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Project description is required'),
  tech: z.array(z.string()),
  link: z.string().optional(),
});

const skillsSchema = z
  .object({
    languages: z.array(z.string()),
    frameworks: z.array(z.string()),
    tools: z.array(z.string()),
    soft: z.array(z.string()).optional(),
  })
  .refine(
    (skills) =>
      skills.languages.length > 0 ||
      skills.frameworks.length > 0 ||
      skills.tools.length > 0,
    { message: 'At least one skill category must have entries' }
  );

// --- Main resume schema ---

export const resumeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  summary: z.string().min(1, 'Summary is required'),
  contact: contactSchema,
  experience: z.array(experienceItemSchema),
  education: z.array(educationItemSchema),
  skills: skillsSchema,
  projects: z.array(projectItemSchema).optional().default([]),
  certifications: z.array(z.string()).optional().default([]),
  highlights: z.array(z.string()).optional().default([]),
});

// --- Validation helper ---

export function validateResumeData(
  input: unknown
): { success: true; data: ResumeData } | { success: false; errors: string[] } {
  const result = resumeSchema.safeParse(input);

  if (result.success) {
    return { success: true, data: result.data as ResumeData };
  }

  const errors = result.error.issues.map((issue) => {
    const path = issue.path.join('.');
    return path ? `${path}: ${issue.message}` : issue.message;
  });

  return { success: false, errors };
}
