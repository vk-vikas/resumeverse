import { describe, it, expect } from 'vitest';
import { validateResumeData } from '../schema';
import type { ResumeData } from '@/types/resume';

describe('schema utility validation', () => {
  const validResume: ResumeData = {
    name: 'Jane Doe',
    title: 'Software Engineer',
    summary: 'A great engineer.',
    contact: { email: 'jane@example.com' },
    experience: [
      {
        company: 'Tech Corp',
        role: 'Developer',
        startDate: '2020-01',
        endDate: '2023-01',
        bullets: ['Wrote code', 'Fixed bugs'],
      },
    ],
    education: [
      {
        institution: 'State Uni',
        degree: 'BS',
        year: '2019',
      },
    ],
    skills: {
      languages: ['TypeScript'],
      frameworks: ['React'],
      tools: ['Git'],
    },
    projects: [],
    certifications: [],
    highlights: [],
  };

  it('validates a correct, complete resume object', () => {
    const result = validateResumeData(validResume);
    expect(result.success).toBe(true);
  });

  it('rejects resume without a name', () => {
    const invalidResume = { ...validResume, name: '' } as unknown as ResumeData;
    const result = validateResumeData(invalidResume);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });

  it('rejects experience with empty bullets array', () => {
    const invalidResume = {
      ...validResume,
      experience: [
        {
          ...validResume.experience[0],
          bullets: [],
        },
      ],
    } as unknown as ResumeData;
    const result = validateResumeData(invalidResume);
    expect(result.success).toBe(false);
  });
});
