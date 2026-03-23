'use client';

import { Download, Eye } from 'lucide-react';
import type { ResumeData } from '@/types/resume';
import { Button } from '@/components/ui/button';

interface RawPdfThemeProps {
  data: ResumeData;
  originalFile?: string;
  resumeId?: string;
}

export function RawPdfTheme({ data, originalFile }: RawPdfThemeProps) {
  // Tracking is now handled by the universal ViewTracker in [slug]/page.tsx

  if (!originalFile) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0a] text-white">
        <p className="text-neutral-500">Error: No raw document payload found for this resume.</p>
      </div>
    );
  }

  const handleDownload = () => {
    window.open(originalFile, '_blank');
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#0a0a0a] text-white overflow-hidden">
      <header className="h-14 shrink-0 border-b border-neutral-800 bg-[#111] px-4 sm:px-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            <Eye className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-neutral-200">{data.name}</h1>
            <p className="text-xs text-neutral-500">Resume Document Viewer</p>
          </div>
        </div>

        <Button 
          onClick={handleDownload}
          variant="outline" 
          size="sm"
          className="bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:text-white text-neutral-300 gap-2 h-8 text-xs"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Save PDF</span>
        </Button>
      </header>

      <div className="flex-1 w-full bg-[#050505] p-2 sm:p-4 overflow-hidden flex justify-center shadow-inner relative">
        <iframe 
          src={`${originalFile}#toolbar=0&navpanes=0&scrollbar=1`}
          className="w-full max-w-[50in] h-full rounded shadow-2xl bg-white/5 border border-neutral-800/50"
          title="Resume Viewer"
        />
        
        <div className="absolute bottom-6 right-6 pointer-events-none opacity-20">
          <p className="text-[10px] font-medium tracking-widest text-white uppercase origin-bottom-right drop-shadow-lg">
            Hosted via ResumeVerse
          </p>
        </div>
      </div>
    </div>
  );
}
