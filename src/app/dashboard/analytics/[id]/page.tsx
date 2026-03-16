import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AnalyticsCharts } from './analytics-charts';
import { ArrowLeft, Users, MousePointerClick, Calendar } from 'lucide-react';
import Link from 'next/link';
import { format, subDays } from 'date-fns';

export default async function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Verify Authentication & Ownership
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    redirect('/api/auth/login');
  }

  const { data: resume, error: resumeError } = await supabase
    .from('resumes')
    .select('id, name, title, slug, views, user_id')
    .eq('id', id)
    .single();

  if (resumeError || !resume) {
    notFound();
  }

  if (resume.user_id !== session.user.id) {
    return (
      <div className="p-8 text-center text-red-500">
        You do not have permission to view analytics for this resume.
      </div>
    );
  }

  // 2. Fetch View Records
  // We fetch all records for the dashboard right now. For massive scale we'd limit/paginate.
  const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
  
  const { data: views, error: viewsError } = await supabase
    .from('resume_views')
    .select('id, resume_id, viewed_at, referrer, user_agent')
    .eq('resume_id', id)
    .gte('viewed_at', thirtyDaysAgo)
    .order('viewed_at', { ascending: true });

  const safeViews = views || [];
  
  // 3. Simple aggregate stats
  const totalViews = resume.views || 0;
  
  const sevenDaysAgo = subDays(new Date(), 7);
  const weeklyViews = safeViews.filter(v => new Date(v.viewed_at) >= sevenDaysAgo).length;
  
  const today = new Date();
  today.setHours(0,0,0,0);
  const todayViews = safeViews.filter(v => new Date(v.viewed_at) >= today).length;

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link 
              href="/dashboard"
              className="text-neutral-400 hover:text-white transition-colors p-1 -ml-1 rounded-md hover:bg-neutral-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h2 className="text-3xl font-bold tracking-tight text-white">Analytics</h2>
          </div>
          <p className="text-muted-foreground flex items-center gap-2 text-neutral-400">
            Overview for 
            <Link href={`/${resume.slug}`} target="_blank" className="font-medium text-blue-400 hover:underline">
              {resume.name}
            </Link>
          </p>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-neutral-300">All-Time Views</h3>
            <Users className="h-4 w-4 text-neutral-500" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-3xl font-bold text-white">{totalViews}</div>
            <p className="text-xs text-neutral-500 mt-1">Lifetime unique hits</p>
          </div>
        </div>
        
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-neutral-300">Views this Week</h3>
            <Calendar className="h-4 w-4 text-neutral-500" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-3xl font-bold text-white">{weeklyViews}</div>
            <p className="text-xs text-neutral-500 mt-1">Last 7 rolling days</p>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900 text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-neutral-300">Views Today</h3>
            <MousePointerClick className="h-4 w-4 text-neutral-500" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-3xl font-bold text-white">{todayViews}</div>
            <p className="text-xs text-neutral-500 mt-1">Since midnight</p>
          </div>
        </div>
      </div>

      {/* Recharts Container */}
      <AnalyticsCharts views={safeViews} />
    </div>
  );
}
