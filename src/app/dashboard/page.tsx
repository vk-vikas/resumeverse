import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { UserMenu } from '@/components/layout/user-menu';
import { ResumeCard } from '@/components/dashboard/resume-card';
import { FileText, Plus, Eye, Share2, Globe } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    // Middleware handles redirect but strict type checking ensures session.user is safe
    return null; 
  }

  const { data: resumes, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching resumes:', error);
  }

  const typedResumes = resumes || [];

  // Fetch telemetry via RPC (bypasses PostgREST schema cache)
  const analyticsPromises = typedResumes.map(async (resume: any) => {
    const { data: analytics, error: rpcError } = await supabase.rpc('get_resume_analytics', {
      p_resume_id: resume.id
    });
    
    // Debug: log what we get from the RPC
    console.log('[Dashboard] Analytics for', resume.id, ':', JSON.stringify(analytics), 'error:', rpcError?.message);
    
    return {
      ...resume,
      telemetry: (analytics && !rpcError) ? {
        uniqueVisitors: analytics.unique_visitors || 0,
        avgDurationSecs: analytics.avg_duration || 0,
        topLocation: analytics.top_country || 'N/A',
        downloads: analytics.download_clicks || 0
      } : { uniqueVisitors: 0, avgDurationSecs: 0, topLocation: 'N/A', downloads: 0 }
    };
  });

  const resumesWithTelemetry = await Promise.all(analyticsPromises);

  const webResumes = resumesWithTelemetry.filter((r: any) => r.theme !== 'raw_pdf');
  const pdfResumes = resumesWithTelemetry.filter((r: any) => r.theme === 'raw_pdf');

  // Aggregate stats globally
  const totalResumes = typedResumes.length;
  const totalViews = typedResumes.reduce((acc: number, curr: any) => acc + (curr.views || 0), 0);
  const activeShares = typedResumes.filter((r: any) => r.is_public).length;

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <header className="border-b border-[#E8E5DF] bg-white/80 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-bold text-[#1A1A1A] hover:opacity-80 transition-opacity">
              Resume<span className="text-[#5B4FC4]">Verse</span>
            </Link>
            <span className="text-[#E8E5DF] px-2 hidden sm:inline">/</span>
            <span className="text-[#6B6560] font-medium hidden sm:inline">Dashboard</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/upload" 
              className="hidden sm:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5B4FC4] disabled:pointer-events-none disabled:opacity-50 bg-[#5B4FC4] hover:bg-[#4A3FB0] text-white shadow-sm h-8 px-3"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Resume
            </Link>
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">Your Resumes</h2>
            <p className="text-[#6B6560] text-sm">Manage, edit, and share your interactive resumes.</p>
          </div>
          
          {/* Quick Stats */}
          {totalResumes > 0 && (
            <div className="flex gap-4 bg-white border border-[#E8E5DF] rounded-lg p-3 w-full md:w-auto overflow-x-auto shadow-sm">
              <div className="flex items-center gap-3 px-3">
                <div className="p-2 bg-[#F0EDFA] rounded-md">
                  <FileText className="h-4 w-4 text-[#5B4FC4]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#9C9590] uppercase font-semibold">Total Resumes</p>
                  <p className="text-lg font-bold text-[#1A1A1A] leading-none mt-1">{totalResumes}</p>
                </div>
              </div>
              <div className="w-px bg-[#E8E5DF]" />
              <div className="flex items-center gap-3 px-3">
                <div className="p-2 bg-[#EDF7F1] rounded-md">
                  <Eye className="h-4 w-4 text-[#3A8D5C]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#9C9590] uppercase font-semibold">Total Views</p>
                  <p className="text-lg font-bold text-[#1A1A1A] leading-none mt-1">{totalViews}</p>
                </div>
              </div>
              <div className="w-px bg-[#E8E5DF]" />
              <div className="flex items-center gap-3 px-3">
                <div className="p-2 bg-[#F5F0FF] rounded-md">
                  <Share2 className="h-4 w-4 text-[#8B5CF6]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#9C9590] uppercase font-semibold">Active Shares</p>
                  <p className="text-lg font-bold text-[#1A1A1A] leading-none mt-1">{activeShares}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Grid */}
        {totalResumes === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 mt-12 text-center border border-[#E8E5DF] border-dashed rounded-2xl bg-white">
            <div className="w-16 h-16 bg-[#F0EDFA] rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-[#5B4FC4]" />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">No resumes yet</h3>
            <p className="text-[#6B6560] max-w-sm mb-6">
              You haven&apos;t created any resumes. Upload an existing PDF/DOCX or start from scratch using our interactive editor.
            </p>
            <Link 
              href="/upload" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5B4FC4] disabled:pointer-events-none disabled:opacity-50 bg-[#5B4FC4] text-white hover:bg-[#4A3FB0] shadow-sm h-10 px-8"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create First Resume
            </Link>
          </div>
        ) : (
          <div className="space-y-12 mb-12">
            
            {/* 📄 Hosted Documents Section */}
            <section>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#8B5CF6]" />
                  Hosted Documents
                </h2>
                <p className="text-sm text-[#6B6560] mt-1">Raw, unparsed PDF resumes</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {pdfResumes.map((resume: any) => (
                  <ResumeCard key={resume.id} resume={resume} />
                ))}

                {/* Create New Card */}
                <Link 
                  href="/upload"
                  className="flex flex-col items-center justify-center min-h-[220px] rounded-xl border-2 border-dashed border-[#E8E5DF] bg-white hover:bg-[#F5F3EF] hover:border-[#9C9590] transition-colors group"
                >
                  <div className="h-12 w-12 rounded-full bg-[#F5F3EF] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="h-6 w-6 text-[#9C9590] group-hover:text-[#1A1A1A] transition-colors" />
                  </div>
                  <span className="font-medium text-[#9C9590] group-hover:text-[#1A1A1A] transition-colors">Host New Document</span>
                </Link>
              </div>
            </section>

            {/* 🌐 Web Portfolios Section */}
            <section className="pt-6 border-t border-[#E8E5DF]">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[#5B4FC4]" />
                  Web Portfolios
                </h2>
                <p className="text-sm text-[#6B6560] mt-1">AI-parsed interactive resumes</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {webResumes.map((resume: any) => (
                  <ResumeCard key={resume.id} resume={resume} />
                ))}
                
                {/* Create New Card (Empty/Action state within grid) */}
                <Link 
                  href="/upload"
                  className="flex flex-col items-center justify-center min-h-[220px] rounded-xl border-2 border-dashed border-[#E8E5DF] bg-white hover:bg-[#F5F3EF] hover:border-[#9C9590] transition-colors group"
                >
                  <div className="h-12 w-12 rounded-full bg-[#F5F3EF] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="h-6 w-6 text-[#9C9590] group-hover:text-[#1A1A1A] transition-colors" />
                  </div>
                  <span className="font-medium text-[#9C9590] group-hover:text-[#1A1A1A] transition-colors">Create New Portfolio</span>
                </Link>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
