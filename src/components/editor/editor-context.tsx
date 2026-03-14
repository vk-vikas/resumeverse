'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { ResumeData, ThemeType } from '@/types/resume';

interface EditorContextType {
  data: ResumeData;
  theme: ThemeType;
  setData: (data: ResumeData) => void;
  updateField: <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => void;
  setTheme: (theme: ThemeType) => void;
}

const EditorContext = createContext<EditorContextType | null>(null);

const defaultResumeData: ResumeData = {
  name: '',
  title: '',
  summary: '',
  contact: {},
  experience: [],
  education: [],
  skills: { languages: [], frameworks: [], tools: [] },
  projects: [],
  certifications: [],
  highlights: [],
};

export function EditorProvider({
  initialData,
  children,
}: {
  initialData?: ResumeData;
  children: ReactNode;
}) {
  const [data, setData] = useState<ResumeData>(initialData || defaultResumeData);
  const [theme, setTheme] = useState<ThemeType>('bento');

  const updateField = useCallback(
    <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
      setData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return (
    <EditorContext.Provider value={{ data, theme, setData, updateField, setTheme }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
