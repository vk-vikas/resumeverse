import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { UserMenu } from '@/components/layout/user-menu';
import { ResumeCard } from '@/components/dashboard/resume-card';
import { FileText, Plus, Eye, Share2 } from 'lucide-react';
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
  
  // Aggregate stats
  const totalResumes = typedResumes.length;
  const totalViews = typedResumes.reduce((acc: number, curr: any) => acc + (curr.views || 0), 0);
  const activeShares = typedResumes.filter((r: any) => r.is_public).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-950/50 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">
              Resume<span className="text-blue-500">Verse</span>
            </h1>
            <span className="text-neutral-600 px-2 hidden sm:inline">/</span>
            <span className="text-neutral-400 font-medium hidden sm:inline">Dashboard</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/upload" 
              className="hidden sm:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-8 px-3"
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
            <h2 className="text-3xl font-bold text-white mb-2">Your Resumes</h2>
            <p className="text-neutral-400 text-sm">Manage, edit, and share your interactive resumes.</p>
          </div>
          
          {/* Quick Stats */}
          {totalResumes > 0 && (
            <div className="flex gap-4 bg-neutral-900/50 border border-neutral-800 rounded-lg p-3 w-full md:w-auto overflow-x-auto">
              <div className="flex items-center gap-3 px-3">
                <div className="p-2 bg-blue-500/10 rounded-md">
                  <FileText className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-semibold">Total Resumes</p>
                  <p className="text-lg font-bold text-white leading-none mt-1">{totalResumes}</p>
                </div>
              </div>
              <div className="w-px bg-neutral-800" />
              <div className="flex items-center gap-3 px-3">
                <div className="p-2 bg-green-500/10 rounded-md">
                  <Eye className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-semibold">Total Views</p>
                  <p className="text-lg font-bold text-white leading-none mt-1">{totalViews}</p>
                </div>
              </div>
              <div className="w-px bg-neutral-800" />
              <div className="flex items-center gap-3 px-3">
                <div className="p-2 bg-purple-500/10 rounded-md">
                  <Share2 className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-semibold">Active Shares</p>
                  <p className="text-lg font-bold text-white leading-none mt-1">{activeShares}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Grid */}
        {totalResumes === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 mt-12 text-center border border-neutral-800 border-dashed rounded-2xl bg-neutral-900/30">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No resumes yet</h3>
            <p className="text-neutral-400 max-w-sm mb-6">
              You haven't created any resumes. Upload an existing PDF/DOCX or start from scratch using our interactive editor.
            </p>
            <Link 
              href="/upload" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50 bg-white text-black hover:bg-neutral-200 shadow-sm h-10 px-8"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create First Resume
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {typedResumes.map((resume: any) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
            
            {/* Create New Card (Empty/Action state within grid) */}
            <Link 
              href="/upload"
              className="flex flex-col items-center justify-center min-h-[220px] rounded-xl border-2 border-dashed border-neutral-800 bg-neutral-900/20 hover:bg-neutral-900/50 hover:border-neutral-700 transition-colors group"
            >
              <div className="w-12 h-12 bg-neutral-800 group-hover:bg-neutral-700 rounded-full flex items-center justify-center mb-3 transition-colors">
                <Plus className="h-6 w-6 text-neutral-400 group-hover:text-white" />
              </div>
              <p className="text-sm font-medium text-neutral-400 group-hover:text-neutral-300">
                Upload New Resume
              </p>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
