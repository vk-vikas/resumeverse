'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, LayoutPanelLeft, Zap, Palette, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const floatingBadges = [
  { label: '3 Themes', icon: <Palette className="h-3 w-3" />, x: -80, y: 20, delay: 0.6 },
  { label: 'AI-Powered', icon: <Zap className="h-3 w-3" />, x: 80, y: -10, delay: 0.7 },
  { label: 'Analytics', icon: <BarChart3 className="h-3 w-3" />, x: 60, y: 50, delay: 0.8 },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-15 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#5B4FC4]/20 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Secondary accent glow */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tl from-[#D89040]/20 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0EDFA] border border-[#E8E5DF] text-sm text-[#5B4FC4] mb-8 font-medium"
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
          Powered by Google Gemini 1.5
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-[#1A1A1A] mb-6"
        >
          Turn Your Resume Into A<br className="hidden md:block" />
          <span className="bg-gradient-to-r from-[#5B4FC4] via-[#7B6FD4] to-[#9B8FE4] bg-clip-text text-transparent">
            Stunning Interactive Website
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-[#6B6560] mb-10 max-w-2xl mx-auto"
        >
          Upload your standard PDF or DOCX. Our AI extracts the content, writes
          metric-driven STAR bullets, and deploys it as a breathtaking interactive portfolio in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/login">
            <Button size="lg" className="h-12 px-8 text-base bg-[#5B4FC4] hover:bg-[#4A3FB0] text-white w-full sm:w-auto">
              Get Started for Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="h-12 px-8 text-base border-[#E8E5DF] bg-white text-[#1A1A1A] hover:bg-[#F5F3EF] w-full sm:w-auto">
              <LayoutPanelLeft className="ml-2 h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
          </Link>
        </motion.div>

        {/* Demo visual mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative mt-16 md:mt-20 mx-auto max-w-3xl"
        >
          {/* Floating badges */}
          {floatingBadges.map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: badge.delay, duration: 0.4 }}
              className="absolute hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E8E5DF] text-xs text-[#1A1A1A] z-20 shadow-sm font-medium"
              style={{
                left: badge.x > 0 ? `calc(100% + ${badge.x - 60}px)` : `${badge.x + 20}px`,
                top: `${badge.y + 40}%`,
              }}
            >
              {badge.icon}
              {badge.label}
            </motion.div>
          ))}

          {/* Browser chrome frame */}
          <div className="rounded-xl border border-[#E8E5DF] overflow-hidden bg-white shadow-xl shadow-black/5">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#E8E5DF] bg-[#FAFAF8]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                <div className="w-3 h-3 rounded-full bg-green-400/70" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-[#F5F3EF] text-xs text-[#9C9590] font-mono">
                  resumeverse.com/john-doe-x7k2
                </div>
              </div>
            </div>

            {/* Mockup content — a bento grid preview */}
            <div className="p-6 bg-[#FAFAF8]">
              <div className="grid grid-cols-4 gap-3">
                {/* Hero card */}
                <div className="col-span-2 row-span-2 rounded-lg bg-white border border-[#E8E5DF] p-4 shadow-sm">
                  <div className="h-3 w-24 rounded bg-[#5B4FC4]/20 mb-2" />
                  <div className="h-2 w-32 rounded bg-[#E8E5DF] mb-3" />
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full rounded bg-[#F5F3EF]" />
                    <div className="h-1.5 w-5/6 rounded bg-[#F5F3EF]" />
                    <div className="h-1.5 w-4/6 rounded bg-[#F5F3EF]" />
                  </div>
                </div>
                {/* Skills */}
                <div className="rounded-lg bg-white border border-[#E8E5DF] p-3 shadow-sm">
                  <div className="h-2 w-12 rounded bg-[#8B5CF6]/20 mb-2" />
                  <div className="flex flex-wrap gap-1">
                    <div className="h-3 w-8 rounded-full bg-[#F5F3EF]" />
                    <div className="h-3 w-10 rounded-full bg-[#F5F3EF]" />
                    <div className="h-3 w-6 rounded-full bg-[#F5F3EF]" />
                  </div>
                </div>
                {/* Contact */}
                <div className="rounded-lg bg-white border border-[#E8E5DF] p-3 shadow-sm">
                  <div className="h-2 w-14 rounded bg-[#3A8D5C]/20 mb-2" />
                  <div className="space-y-1">
                    <div className="h-1.5 w-full rounded bg-[#F5F3EF]" />
                    <div className="h-1.5 w-3/4 rounded bg-[#F5F3EF]" />
                  </div>
                </div>
                {/* Experience */}
                <div className="col-span-2 rounded-lg bg-white border border-[#E8E5DF] p-3 shadow-sm">
                  <div className="h-2 w-16 rounded bg-[#D89040]/20 mb-2" />
                  <div className="space-y-1">
                    <div className="h-1.5 w-full rounded bg-[#F5F3EF]" />
                    <div className="h-1.5 w-4/5 rounded bg-[#F5F3EF]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Glow under the frame */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-[#5B4FC4]/5 blur-3xl rounded-full pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
