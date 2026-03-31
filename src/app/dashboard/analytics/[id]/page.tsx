import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AnalyticsCharts } from './analytics-charts';
import { PdfHeatmap } from '@/components/analytics/pdf-heatmap';
import { 
  ArrowLeft, Users, MousePointerClick, Calendar, Clock, 
  Globe, TrendingDown, BookOpen, Mail, Download, Activity
} from 'lucide-react';
import Link from 'next/link';
import { subDays } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) redirect('/api/auth/login');

  const { data: resume, error: resumeError } = await supabase
    .from('resumes')
    .select('id, slug, views, user_id, data, theme, original_file')
    .eq('id', id)
    .single();

  if (resumeError || !resume) notFound();

  const resumeData = resume.data as { name?: string; title?: string };
  const displayName = resumeData?.name || 'Untitled Resume';

  if (resume.user_id !== session.user.id) {
    return <div className="p-8 text-center text-red-500">Access denied.</div>;
  }

  // Fetch view records via RPC
  const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
  const { data: views } = await supabase.rpc('get_resume_view_records', {
    p_resume_id: id,
    p_since: thirtyDaysAgo
  });
  const safeViews = views || [];

  // Fetch aggregated analytics (now includes bounce_rate, deep_reader_count, etc.)
  const { data: analytics } = await supabase.rpc('get_resume_analytics', { p_resume_id: id });

  // Fetch heatmap data (only used for raw_pdf theme)
  const { data: heatmapData } = resume.theme === 'raw_pdf' 
    ? await supabase.rpc('get_resume_heatmap_data', { p_resume_id: id })
    : { data: null };

  const totalViews    = analytics?.total_views     || resume.views || 0;
  const uniqueVisitors = analytics?.unique_visitors || 0;
  const avgDuration   = analytics?.avg_duration    || 0;
  const topCountry    = analytics?.top_country     || 'N/A';
  const bounceRate    = analytics?.bounce_rate     || 0;
  const deepReaders   = analytics?.deep_reader_count || 0;
  const contactClicks = analytics?.contact_clicks  || 0;
  const downloadClicks = analytics?.download_clicks || 0;
  const avgScroll     = analytics?.avg_scroll_depth || 0;

  const sevenDaysAgo = subDays(new Date(), 7);
  const weeklyViews = safeViews.filter((v: any) => new Date(v.created_at) >= sevenDaysAgo).length;
  const today = new Date(); today.setHours(0,0,0,0);
  const todayViews = safeViews.filter((v: any) => new Date(v.created_at) >= today).length;

  // Heatmap coords
  const heatClicks  = (heatmapData?.clicks  || []) as { x_pct: number; y_pct: number; page?: number }[];
  const heatScrolls = (heatmapData?.scrolls || []) as { x_pct: number; y_pct: number; page?: number }[];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto p-6 space-y-8">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/dashboard" className="text-neutral-400 hover:text-white transition-colors p-1 -ml-1 rounded-md hover:bg-neutral-800">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
          </div>
          <p className="text-neutral-500 text-sm ml-6">
            Overview for{' '}
            <Link href={`/${resume.slug}`} target="_blank" className="text-blue-400 hover:underline font-medium">
              {displayName}
            </Link>
          </p>
        </div>

        {resume.theme === 'raw_pdf' ? (
          <>
            {/* ── Row 1: View KPIs ── */}
            <section>
              <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">View Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard label="All-Time Views" value={totalViews} sub="Lifetime hits" icon={<Users className="h-4 w-4" />} />
                <KpiCard label="Unique Visitors" value={uniqueVisitors} sub="Distinct IPs" icon={<Activity className="h-4 w-4" />} color="emerald" />
                <KpiCard label="This Week" value={weeklyViews} sub="Last 7 days" icon={<Calendar className="h-4 w-4" />} />
                <KpiCard label="Today" value={todayViews} sub="Since midnight" icon={<MousePointerClick className="h-4 w-4" />} />
              </div>
            </section>

            {/* ── Row 2: Engagement KPIs ── */}
            <section>
              <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">Engagement</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard label="Avg Read Time" value={`${avgDuration}s`} sub="Time on page" icon={<Clock className="h-4 w-4" />} color="blue" />
                <KpiCard label="Deep Readers" value={deepReaders} sub="> 60s reading" icon={<BookOpen className="h-4 w-4" />} color="purple" />
                <KpiCard label="Bounce Rate" value={`${bounceRate}%`} sub="Left in < 5s" icon={<TrendingDown className="h-4 w-4" />} color={bounceRate > 50 ? 'red' : 'emerald'} />
                <KpiCard label="Avg Scroll Depth" value={`${avgScroll}%`} sub="How far they read" icon={<Globe className="h-4 w-4" />} color="yellow" />
              </div>
            </section>

            {/* ── Row 3: Interaction KPIs ── */}
            <section>
              <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">Interactions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard label="Contact Clicks" value={contactClicks} sub="Email / LinkedIn / GitHub" icon={<Mail className="h-4 w-4" />} color="blue" />
                <KpiCard label="PDF Downloads" value={downloadClicks} sub="Save PDF button" icon={<Download className="h-4 w-4" />} color="emerald" />
                <KpiCard label="Top Location" value={topCountry} sub="Most visitors from" icon={<Globe className="h-4 w-4" />} />
              </div>
            </section>
          </>
        ) : (
          <>
            {/* ── Row 1: Web Traffic KPIs ── */}
            <section>
              <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">Traffic & Demographics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard label="All-Time Views" value={totalViews} sub="Lifetime hits" icon={<Users className="h-4 w-4" />} />
                <KpiCard label="Unique Visitors" value={uniqueVisitors} sub="Distinct IPs" icon={<Activity className="h-4 w-4" />} color="emerald" />
                <KpiCard label="This Week" value={weeklyViews} sub="Last 7 days" icon={<Calendar className="h-4 w-4" />} />
                <KpiCard label="Top Location" value={topCountry} sub="Most visitors from" icon={<Globe className="h-4 w-4" />} />
              </div>
            </section>

            {/* ── Row 2: Audience Retention KPIs ── */}
            <section>
              <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">Audience Retention</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KpiCard label="Avg Read Time" value={`${avgDuration}s`} sub="Time on page" icon={<Clock className="h-4 w-4" />} color="blue" />
                <KpiCard label="Deep Readers" value={deepReaders} sub="> 60s reading" icon={<BookOpen className="h-4 w-4" />} color="purple" />
                <KpiCard label="Bounce Rate" value={`${bounceRate}%`} sub="Left in < 5s" icon={<TrendingDown className="h-4 w-4" />} color={bounceRate > 50 ? 'red' : 'emerald'} />
              </div>
            </section>
          </>
        )}

        {/* ── Heatmap (raw_pdf only) ── */}
        {resume.theme === 'raw_pdf' && resume.original_file && (
          <section>
            <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">Interaction Heatmap</h2>
            <PdfHeatmap
              fileUrl={resume.original_file}
              clicks={heatClicks}
              scrolls={heatScrolls}
            />
          </section>
        )}

        {/* ── Charts ── */}
        <section>
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">Trends</h2>
          <AnalyticsCharts views={safeViews} />
        </section>

      </div>
    </div>
  );
}

// ── Reusable KPI card ─────────────────────────────────────────────────────────
type Color = 'default' | 'emerald' | 'blue' | 'purple' | 'red' | 'yellow';

const colorMap: Record<Color, string> = {
  default:  'text-white',
  emerald:  'text-emerald-400',
  blue:     'text-blue-400',
  purple:   'text-purple-400',
  red:      'text-red-400',
  yellow:   'text-yellow-400',
};

function KpiCard({
  label, value, sub, icon, color = 'default'
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  color?: Color;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between text-neutral-500">
        <span className="text-xs font-medium text-neutral-400">{label}</span>
        {icon}
      </div>
      <div className={`text-2xl font-bold ${colorMap[color]}`}>{value}</div>
      <p className="text-xs text-neutral-600">{sub}</p>
    </div>
  );
}
