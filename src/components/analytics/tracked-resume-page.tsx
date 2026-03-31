'use client';

import { useState } from 'react';
import { ViewTracker } from '@/components/analytics/view-tracker';
import { ResumeRenderer } from '@/components/editor/resume-renderer';
import type { ResumeData, ThemeType } from '@/types/resume';

interface TrackedResumePageProps {
  resumeId: string;
  data: ResumeData;
  theme: ThemeType;
  originalFile?: string;
}

/**
 * Client wrapper that:
 * 1. Renders ViewTracker (which fires the POST and gets a viewId)
 * 2. Passes the viewId down to ResumeRenderer so raw_pdf heatmaps can tag their events
 */
export function TrackedResumePage({ resumeId, data, theme, originalFile }: TrackedResumePageProps) {
  const [viewId, setViewId] = useState<string | null>(null);

  return (
    <>
      <ViewTracker resumeId={resumeId} onViewCreated={setViewId} themeType={theme} />
      <ResumeRenderer
        data={data}
        theme={theme}
        originalFile={originalFile}
        resumeId={resumeId}
        viewId={viewId}
      />
    </>
  );
}
