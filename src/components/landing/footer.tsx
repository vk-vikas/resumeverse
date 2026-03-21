import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 py-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-lg font-semibold text-white mb-6">ResumeVerse</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-sm text-neutral-400 mb-8">
          <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
            GitHub Source
          </a>
        </div>
        <p className="text-xs text-neutral-600">
          Powered by Next.js 14, Supabase, and Google Gemini API.
        </p>
      </div>
    </footer>
  );
}
