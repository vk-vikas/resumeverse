export interface ContactInfo {
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  location?: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  startDate: string; // "YYYY-MM" format
  endDate: string; // "YYYY-MM" or "present"
  location?: string;
  bullets: string[];
  skillsUsed?: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  field?: string;
  year: string; // "2020" or "2018-2022"
  gpa?: string;
}

export interface ProjectItem {
  name: string;
  description: string;
  bullets?: string[];
  tech: string[];
  link?: string;
}

export interface SkillsData {
  languages: string[];
  frameworks: string[];
  tools: string[];
  soft?: string[];
}

export interface ResumeData {
  name: string;
  title: string;
  summary: string;
  contact: ContactInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillsData;
  projects: ProjectItem[];
  certifications?: string[];
  highlights?: string[];
}

export type ThemeType = 'bento' | 'journey' | 'terminal' | 'kpi' | 'faang';

export interface SavedResume {
  id: string;
  userId: string;
  slug: string;
  theme: ThemeType;
  data: ResumeData;
  originalFile?: string;
  isPublic: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}
