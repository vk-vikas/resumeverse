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
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-[#9C9590] text-sm">Loading editor...</div>
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
    if (!data.name?.trim() || !data.title?.trim()) {
      toast.error('Please fill in at least Name and Title before publishing.');
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
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
      {/* Top bar */}
      <header className="border-b border-[#E8E5DF] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-[#9C9590] hover:text-[#1A1A1A]"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-sm font-semibold text-[#1A1A1A]">
              Resume<span className="text-[#5B4FC4]">Verse</span>{' '}
              <span className="text-[#9C9590] font-normal">Editor</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <UserMenu />
            <Button
              size="sm"
              onClick={handlePublish}
              disabled={isPublishing}
              className="bg-[#5B4FC4] hover:bg-[#4A3FB0] text-white"
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
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-[#E8E5DF] overflow-y-auto p-4 sm:p-6 lg:p-8 shrink-0 lg:shrink-1 h-[50vh] lg:h-auto">
          <ResumeEditor />
        </div>
        <div className="w-full lg:w-1/2 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F5F3EF]">
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
