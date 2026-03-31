import { Hero } from '@/components/landing/hero';
import { HowItWorks } from '@/components/landing/how-it-works';
import { ThemeShowcase } from '@/components/landing/theme-showcase';
import { Features } from '@/components/landing/features';
import { Footer } from '@/components/landing/footer';
import { UserMenu } from '@/components/layout/user-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col selection:bg-[#5B4FC4]/20">
      <header className="absolute top-0 w-full p-4 flex justify-between items-center z-50">
        <Link href="/" className="text-xl font-bold text-[#1A1A1A] tracking-tighter">
          Resume<span className="text-[#5B4FC4]">Verse</span>
        </Link>
        <UserMenu />
      </header>

      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <ThemeShowcase />
        <Features />

        {/* Final CTA Banner */}
        <section className="py-24 bg-[#FAFAF8] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#5B4FC4]/5 blur-[120px] rounded-full" />
          </div>
          <div className="container mx-auto px-4 max-w-3xl text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
              Ready to stand out?
            </h2>
            <p className="text-[#6B6560] text-lg mb-8 max-w-xl mx-auto">
              Join thousands of professionals who have transformed their resumes into interactive experiences. It only takes 30 seconds.
            </p>
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 text-base bg-[#5B4FC4] hover:bg-[#4A3FB0] text-white">
                Get Started — It&apos;s Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
