import Link from 'next/link';
import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#E8E5DF] bg-[#F5F3EF] py-16 relative overflow-hidden">
      {/* Top wave from white section */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg className="relative block w-full h-[30px]" viewBox="0 0 1200 30" preserveAspectRatio="none">
          <path d="M0,10 C200,25 400,0 600,15 C800,30 1000,5 1200,15 L1200,0 L0,0 Z" fill="white" />
        </svg>
      </div>
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
          {/* Branding */}
          <div>
            <Link href="/" className="text-xl font-bold text-[#1A1A1A] tracking-tighter hover:opacity-80 transition-opacity">
              Resume<span className="text-[#5B4FC4]">Verse</span>
            </Link>
            <p className="text-sm text-[#9C9590] mt-2 max-w-xs">
              AI-powered interactive resume generator. Upload, transform, share.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 text-sm">
            <div className="space-y-3">
              <p className="font-semibold text-[#1A1A1A] text-xs uppercase tracking-wider">Product</p>
              <Link href="/login" className="block text-[#6B6560] hover:text-[#1A1A1A] transition-colors">Sign In</Link>
              <Link href="/dashboard" className="block text-[#6B6560] hover:text-[#1A1A1A] transition-colors">Dashboard</Link>
              <Link href="/upload" className="block text-[#6B6560] hover:text-[#1A1A1A] transition-colors">Upload Resume</Link>
            </div>
            <div className="space-y-3">
              <p className="font-semibold text-[#1A1A1A] text-xs uppercase tracking-wider">Stack</p>
              <p className="text-[#6B6560]">Next.js 14</p>
              <p className="text-[#6B6560]">Supabase</p>
              <p className="text-[#6B6560]">Google Gemini</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-[#E8E5DF]">
          <p className="text-xs text-[#9C9590]">
            © {new Date().getFullYear()} ResumeVerse. Built by Vikas Kumar.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#9C9590] hover:text-[#1A1A1A] transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <p className="text-xs text-[#9C9590]">
              Next.js · TypeScript · Tailwind · Supabase · Gemini AI
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
