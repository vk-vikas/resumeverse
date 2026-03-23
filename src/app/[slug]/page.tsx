import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import type { ResumeData, ThemeType } from '@/types/resume';
import { ResumeRenderer } from '@/components/editor/resume-renderer';
import { ViewTracker } from '@/components/analytics/view-tracker';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getResume(slug: string) {
  const supabase = await createClient();

  const { data: resume, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('slug', slug)
    .eq('is_public', true)
    .single();

  if (error || !resume) return null;

  return resume as {
    id: string;
    slug: string;
    theme: ThemeType;
    data: ResumeData;
    views: number;
    original_file?: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resume = await getResume(slug);

  if (!resume) {
    return { title: 'Resume Not Found' };
  }

  const { data } = resume;
  const description = data.summary
    ? data.summary.slice(0, 160)
    : `${data.name} — ${data.title}`;

  return {
    title: `${data.name} — ${data.title}`,
    description,
    openGraph: {
      title: `${data.name} — ${data.title}`,
      description,
      type: 'profile',
      images: [`/api/og/${slug}`],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data.name} — ${data.title}`,
      description,
      images: [`/api/og/${slug}`],
    },
  };
}

export default async function ShareableResumePage({ params }: PageProps) {
  const { slug } = await params;
  const resume = await getResume(slug);

  if (!resume) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      {/* Universal analytics tracker — works for ALL themes */}
      <ViewTracker resumeId={resume.id} />
      <ResumeRenderer 
        data={resume.data} 
        theme={resume.theme} 
        originalFile={resume.original_file}
        resumeId={resume.id}
      />
    </main>
  );
}
