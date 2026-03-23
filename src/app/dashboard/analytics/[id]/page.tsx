import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AnalyticsCharts } from './analytics-charts';
import { ArrowLeft, Users, MousePointerClick, Calendar, Clock, Globe } from 'lucide-react';
import Link from 'next/link';
import { subDays } from 'date-fns';

export const dynamic = 'force-dynamic';

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
    .select('id, slug, views, user_id, data')
    .eq('id', id)
    .single();

  if (resumeError || !resume) {
    notFound();
  }

  const resumeData = resume.data as { name?: string; title?: string };
  const displayName = resumeData?.name || 'Untitled Resume';

  if (resume.user_id !== session.user.id) {
    return (
      <div className="p-8 text-center text-red-500">
        You do not have permission to view analytics for this resume.
      </div>
    );
  }

  // 2. Fetch view records via RPC (bypasses PostgREST cache)
  const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
  
  const { data: views, error: viewsError } = await supabase.rpc('get_resume_view_records', {
    p_resume_id: id,
    p_since: thirtyDaysAgo
  });

  if (viewsError) {
    console.error('[Analytics] RPC error:', viewsError.message);
  }

  const safeViews = views || [];

  // 3. Fetch aggregated stats via RPC
  const { data: analytics } = await supabase.rpc('get_resume_analytics', { p_resume_id: id });
  
  const totalViews = analytics?.total_views || resume.views || 0;
  const uniqueVisitors = analytics?.unique_visitors || 0;
  const avgDuration = analytics?.avg_duration || 0;
  const topCountry = analytics?.top_country || 'N/A';
  
  const sevenDaysAgo = subDays(new Date(), 7);
  const weeklyViews = safeViews.filter((v: any) => new Date(v.created_at) >= sevenDaysAgo).length;
  
  const today = new Date();
  today.setHours(0,0,0,0);
  const todayViews = safeViews.filter((v: any) => new Date(v.created_at) >= today).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="flex-1 space-y-8 p-8 pt-6 max-w-7xl mx-auto">
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
                {displayName}
              </Link>
            </p>
          </div>
        </div>
        
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-neutral-300">All-Time Views</h3>
              <Users className="h-4 w-4 text-neutral-500" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-3xl font-bold text-white">{totalViews}</div>
              <p className="text-xs text-neutral-500 mt-1">Lifetime hits</p>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900 shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-neutral-300">Unique Visitors</h3>
              <Users className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-3xl font-bold text-emerald-400">{uniqueVisitors}</div>
              <p className="text-xs text-neutral-500 mt-1">Distinct IPs</p>
            </div>
          </div>
          
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-neutral-300">Avg. Read Time</h3>
              <Clock className="h-4 w-4 text-blue-500" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-3xl font-bold text-blue-400">{avgDuration}s</div>
              <p className="text-xs text-neutral-500 mt-1">Time on page</p>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900 shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-neutral-300">Top Location</h3>
              <Globe className="h-4 w-4 text-purple-500" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-3xl font-bold text-purple-400">{topCountry}</div>
              <p className="text-xs text-neutral-500 mt-1">Most visitors from</p>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900 shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-neutral-300">This Week</h3>
              <Calendar className="h-4 w-4 text-neutral-500" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-3xl font-bold text-white">{weeklyViews}</div>
              <p className="text-xs text-neutral-500 mt-1">Last 7 days</p>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900 shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-neutral-300">Today</h3>
              <MousePointerClick className="h-4 w-4 text-neutral-500" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-3xl font-bold text-white">{todayViews}</div>
              <p className="text-xs text-neutral-500 mt-1">Since midnight</p>
            </div>
          </div>
        </div>

        {/* Recharts */}
        <AnalyticsCharts views={safeViews} />
      </div>
    </div>
  );
}
