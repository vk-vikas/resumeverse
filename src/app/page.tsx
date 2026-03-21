import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { Footer } from '@/components/landing/footer';
import { UserMenu } from '@/components/layout/user-menu';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col selection:bg-blue-500/30">
      <header className="absolute top-0 w-full p-4 flex justify-between items-center z-50">
        <Link href="/" className="text-xl font-bold text-white tracking-tighter">
          ResumeVerse
        </Link>
        <UserMenu />
      </header>

      <main className="flex-1">
        <Hero />
        <Features />
      </main>

      <Footer />
    </div>
  );
}
