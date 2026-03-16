'use client';

import { useEffect, useState, useLayoutEffect } from 'react';
import type { ResumeData } from '@/types/resume';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ParallaxHero } from './parallax-hero';
import { Timeline } from './timeline';
import { SkillBars } from './skill-bars';
import { ContactSection } from './contact-section';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface JourneyThemeProps {
  data: ResumeData;
}

export function JourneyTheme({ data }: JourneyThemeProps) {
  const [mounted, setMounted] = useState(false);

  // Initialize smooth scrolling and mount
  useLayoutEffect(() => {
    setMounted(true);
    
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    // Keep GSAP in sync with Lenis tick
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a]">
        <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-[#1a1a1a] dark:border-white animate-spin" />
      </div>
    );
  }

  // Force ScrollTrigger to recalculate metrics after the page completely mounts
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);

  return (
    <div className="flex flex-col min-h-screen w-full font-sans antialiased text-[#1a1a1a] bg-[#f8f9fa] dark:text-[#f8f9fa] dark:bg-[#0a0a0a] overflow-x-hidden selection:bg-blue-500/30">
      <ParallaxHero data={data} />
      <Timeline data={data} />
      <SkillBars data={data} />
      <ContactSection data={data} />
      
      {/* Small subtle footer credit */}
      <footer className="py-8 text-center text-sm font-medium tracking-wide text-neutral-400 dark:text-neutral-600 bg-white dark:bg-[#111]">
        Made in Resume<span className="text-blue-500">Verse</span>
      </footer>
    </div>
  );
}
