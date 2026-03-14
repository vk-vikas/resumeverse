'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { EditorProvider } from '@/components/editor/editor-context';
import { ResumeEditor } from '@/components/editor/resume-editor';
import { LivePreview } from '@/components/editor/live-preview';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import type { ResumeData } from '@/types/resume';

function EditorContent() {
  const searchParams = useSearchParams();
  const [initialData, setInitialData] = useState<ResumeData | undefined>(undefined);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Load data from sessionStorage (set by landing page after parsing)
    const stored = sessionStorage.getItem('resumeverse-parsed-data');
    if (stored) {
      try {
        setInitialData(JSON.parse(stored));
      } catch {
        console.warn('Failed to parse stored resume data');
      }
    }
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-neutral-500 text-sm">Loading editor...</div>
      </div>
    );
  }

  return (
    <EditorProvider initialData={initialData}>
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        {/* Top bar */}
        <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-neutral-400 hover:text-white"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-sm font-semibold text-white">
                Resume<span className="text-blue-500">Verse</span>{' '}
                <span className="text-neutral-500 font-normal">Editor</span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => toast.info('Save & publish coming in the next task!')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-3.5 w-3.5 mr-1.5" />
                Save & Publish
              </Button>
            </div>
          </div>
        </header>

        {/* Split panel layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Editor form */}
          <div className="w-1/2 border-r border-neutral-800 overflow-y-auto p-4">
            <ResumeEditor />
          </div>

          {/* Right: Live preview */}
          <div className="w-1/2 overflow-y-auto p-4 bg-neutral-950">
            <LivePreview />
          </div>
        </div>
      </div>
    </EditorProvider>
  );
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-neutral-500 text-sm">Loading editor...</div>
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  );
}
