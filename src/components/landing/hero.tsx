'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, LayoutPanelLeft, Palette, Zap, BarChart3, Presentation } from 'lucide-react';
import { Button } from '@/components/ui/button';

const floatingBadges = [
  { label: '3 Themes', icon: <Palette className="h-3.5 w-3.5" />, x: -100, y: 15, delay: 0.6, color: 'border-[#8B5CF6]/30 bg-[#F5F0FF] text-[#8B5CF6]' },
  { label: 'AI-Powered', icon: <Zap className="h-3.5 w-3.5" />, x: 60, y: -10, delay: 0.7, color: 'border-[#D89040]/30 bg-[#FDF5EC] text-[#D89040]' },
  { label: 'Analytics', icon: <BarChart3 className="h-3.5 w-3.5" />, x: 70, y: 55, delay: 0.8, color: 'border-[#D84040]/30 bg-[#FDF0F0] text-[#D84040]' },
  { label: 'SEO Ready', icon: <Presentation className="h-3.5 w-3.5" />, x: -80, y: 70, delay: 0.9, color: 'border-[#3A8D5C]/30 bg-[#EDF7F1] text-[#3A8D5C]' },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Background glow — multi-color */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-15 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#5B4FC4]/20 to-transparent blur-3xl rounded-full" />
      </div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tl from-[#D89040]/20 to-transparent blur-3xl rounded-full" />
      </div>
      <div className="absolute top-20 left-0 w-[300px] h-[300px] opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3A8D5C]/20 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Floating decorative SVG shapes */}
      <motion.svg
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-24 left-[8%] w-16 h-16 text-[#D89040] pointer-events-none"
        viewBox="0 0 64 64" fill="none"
      >
        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="3" strokeDasharray="8 6" />
      </motion.svg>

      <motion.svg
        initial={{ opacity: 0, rotate: -20 }}
        animate={{ opacity: 0.12, rotate: 0 }}
        transition={{ duration: 1.2, delay: 0.7 }}
        className="absolute top-40 right-[10%] w-20 h-20 text-[#3A8D5C] pointer-events-none"
        viewBox="0 0 80 80" fill="none"
      >
        <rect x="10" y="10" width="60" height="60" rx="16" stroke="currentColor" strokeWidth="3" />
        <rect x="24" y="24" width="32" height="32" rx="8" fill="currentColor" fillOpacity="0.1" />
      </motion.svg>

      <motion.svg
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.1, y: 0 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="absolute bottom-32 left-[12%] w-14 h-14 text-[#8B5CF6] pointer-events-none"
        viewBox="0 0 56 56" fill="none"
      >
        <polygon points="28,4 52,44 4,44" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.08" />
      </motion.svg>

      <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ duration: 1.5, delay: 1.1 }}
        className="absolute bottom-20 right-[15%] w-24 h-6 text-[#D84040] pointer-events-none"
        viewBox="0 0 96 24" fill="none"
      >
        <path d="M0 12 Q24 0 48 12 Q72 24 96 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </motion.svg>

      <motion.svg
        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
        animate={{ opacity: 0.15, scale: 1, rotate: 0 }}
        transition={{ duration: 1.2, delay: 0.6 }}
        className="absolute top-64 right-[25%] w-10 h-10 text-[#5B4FC4] pointer-events-none"
        viewBox="0 0 48 48" fill="none"
      >
        <path d="M24 4V44M4 24H44" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </motion.svg>
      
      <motion.svg
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-48 left-[20%] w-12 h-12 text-[#D89040] pointer-events-none"
        viewBox="0 0 64 64" fill="none"
      >
        <path d="M32 4L38 22H58L42 34L48 54L32 42L16 54L22 34L6 22H26L32 4Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" strokeLinejoin="round" />
      </motion.svg>

      {/* Small floating dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.3 }}
        className="absolute top-36 left-[22%] w-3 h-3 rounded-full bg-[#D89040]/20 pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute top-52 right-[25%] w-2 h-2 rounded-full bg-[#3A8D5C]/25 pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.7 }}
        className="absolute bottom-40 right-[30%] w-2.5 h-2.5 rounded-full bg-[#8B5CF6]/20 pointer-events-none"
      />

      <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">


        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold tracking-tight text-[#1A1A1A] mb-6"
        >
          Your Resume.<br className="hidden md:block" />
          <span className="bg-gradient-to-r from-[#5B4FC4] via-[#8B5CF6] to-[#D89040] bg-clip-text text-transparent">
            Two Powerful Tools.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-[#6B6560] mb-10 max-w-3xl mx-auto px-4"
        >
          Generate an interactive portfolio website from your resume or share your PDF with a
          smart link and see exactly how recruiters engage — with heatmaps, view counts, and detailed analytics.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/login">
            <Button size="lg" className="h-12 px-8 text-base bg-gradient-to-r from-[#5B4FC4] to-[#7B6FD4] hover:from-[#4A3FB0] hover:to-[#6B5FC4] text-white w-full sm:w-auto shadow-lg shadow-[#5B4FC4]/20">
              Get Started for Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="h-12 px-8 text-base border-[#DCD8D0] bg-white text-[#1A1A1A] hover:bg-[#F5F3EF] w-full sm:w-auto">
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
          {/* Animated feature pop-ups around the mockup */}
          {floatingBadges.map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
              transition={{ 
                opacity: { delay: badge.delay, duration: 0.4 },
                scale: { delay: badge.delay, duration: 0.4, type: 'spring', bounce: 0.5 },
                y: { repeat: Infinity, duration: 4, ease: "easeInOut", delay: badge.delay + 0.4 }
              }}
              className={`absolute hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full border shadow-sm text-xs font-semibold z-20 ${badge.color}`}
              style={{
                left: badge.x > 0 ? `calc(100% + ${badge.x - 70}px)` : `${badge.x + 30}px`,
                top: `${badge.y}%`,
              }}
            >
              {badge.icon}
              {badge.label}
            </motion.div>
          ))}

          {/* Browser chrome frame */}
          <div className="rounded-xl border border-[#DCD8D0] overflow-hidden bg-white shadow-xl shadow-black/5 relative z-10">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#E8E5DF] bg-[#FAFAF8]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#D84040]/60" />
                <div className="w-3 h-3 rounded-full bg-[#D89040]/60" />
                <div className="w-3 h-3 rounded-full bg-[#3A8D5C]/60" />
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
                    <div className="h-3 w-8 rounded-full bg-[#F0EDFA]" />
                    <div className="h-3 w-10 rounded-full bg-[#EDF7F1]" />
                    <div className="h-3 w-6 rounded-full bg-[#FDF5EC]" />
                  </div>
                </div>
                {/* Contact */}
                <div className="rounded-lg bg-white border border-[#E8E5DF] p-3 shadow-sm">
                  <div className="h-2 w-14 rounded bg-[#3A8D5C]/20 mb-2" />
                  <div className="space-y-1">
                    <div className="h-1.5 w-full rounded bg-[#EDF7F1]" />
                    <div className="h-1.5 w-3/4 rounded bg-[#EDF7F1]" />
                  </div>
                </div>
                {/* Experience */}
                <div className="col-span-2 rounded-lg bg-white border border-[#E8E5DF] p-3 shadow-sm">
                  <div className="h-2 w-16 rounded bg-[#D89040]/20 mb-2" />
                  <div className="space-y-1">
                    <div className="h-1.5 w-full rounded bg-[#FDF5EC]" />
                    <div className="h-1.5 w-4/5 rounded bg-[#FDF5EC]" />
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
