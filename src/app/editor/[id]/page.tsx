'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { EditorProvider, useEditor } from '@/components/editor/editor-context';
import { ResumeEditor } from '@/components/editor/resume-editor';
import { LivePreview } from '@/components/editor/live-preview';
import { PublishDialog } from '@/components/editor/publish-dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { validateResumeData } from '@/lib/utils/schema';
import { generateSlug } from '@/lib/utils/slug';
import type { ResumeData } from '@/types/resume';
import { UserMenu } from '@/components/layout/user-menu';

function EditorContent() {
  const searchParams = useSearchParams();
  const [initialData, setInitialData] = useState<ResumeData | undefined>(undefined);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
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
      <EditorLayout />
    </EditorProvider>
  );
}

function EditorLayout() {
  const { data, theme } = useEditor();
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [showPublishDialog, setShowPublishDialog] = useState(false);

  const handlePublish = async () => {
    // Basic checks first for the most common requirement
    if (!data.name?.trim() || !data.title?.trim() || !data.summary?.trim()) {
      toast.error('Please fill in at least Name, Title, and Summary before publishing.');
      return;
    }

    // Validate remaining data structure against schema
    const validation = validateResumeData(data);
    if (!validation.success) {
      // Show the first descriptive error from the schema
      toast.error(`Validation Error: ${validation.errors[0]}`);
      return;
    }

    setIsPublishing(true);

    try {
      const supabase = createClient();

      // Generate a unique slug
      let slug = generateSlug(data.name);

      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('You must be logged in to publish.');
      }

      // Check if slug is taken, regenerate if needed
      const { data: existing } = await supabase
        .from('resumes')
        .select('id')
        .eq('slug', slug)
        .single();

      if (existing) {
        slug = generateSlug(data.name); // Regenerate with different random suffix
      }

      // Insert resume into Supabase
      const { error } = await supabase.from('resumes').insert({
        slug,
        theme,
        data: data as unknown as Record<string, unknown>,
        is_public: true,
        views: 0,
        user_id: session.user.id,
      });

      if (error) {
        // If RLS blocks, offer workaround
        if (error.code === '42501' || error.message.includes('policy')) {
          throw new Error(
            'Permission denied. Please ensure Row Level Security policies are configured correctly in Supabase.'
          );
        }
        throw new Error(error.message);
      }

      setPublishedSlug(slug);
      setShowPublishDialog(true);
      toast.success('Resume published!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to publish';
      toast.error(message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
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
          <div className="flex items-center gap-4">
            <UserMenu />
            <Button
              size="sm"
              onClick={handlePublish}
              disabled={isPublishing}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  Save & Publish
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Split panel layout */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r border-neutral-800 overflow-y-auto p-4">
          <ResumeEditor />
        </div>
        <div className="w-1/2 overflow-y-auto p-4 bg-neutral-950">
          <LivePreview />
        </div>
      </div>

      {/* Publish success dialog */}
      {publishedSlug && (
        <PublishDialog
          open={showPublishDialog}
          onOpenChange={(isOpen) => {
            setShowPublishDialog(isOpen);
            if (!isOpen) {
              router.push('/dashboard');
              router.refresh(); // Refresh dashboard data to show the new resume
            }
          }}
          slug={publishedSlug}
        />
      )}
    </div>
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
