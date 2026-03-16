'use client';

import { useRef, useState, useEffect } from 'react';
import type { ResumeData } from '@/types/resume';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ParallaxHeroProps {
  data: ResumeData;
}

export function ParallaxHero({ data }: ParallaxHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(() => {
    if (!mounted) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

    // Parallax background (moves slower/down)
    tl.to(bgRef.current, {
      y: '30%',
      ease: 'none'
    }, 0);

    // Text fades and moves up
    tl.to(textRef.current, {
      y: '-20%',
      opacity: 0,
      ease: 'none'
    }, 0);

    // Initial load animation
    gsap.fromTo(
      textRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: 'power3.out', delay: 0.2 }
    );

    // Bouncing arrow
    gsap.to(arrowRef.current, {
      y: 10,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: 'sine.inOut'
    });

  }, { scope: containerRef, dependencies: [mounted] });

  // Hide the hero initially if not mounted to prevent flash of unstyled content
  if (!mounted) {
    return <section className="h-screen w-full bg-[#f8f9fa] dark:bg-[#0a0a0a]" />;
  }

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#f8f9fa] text-[#1a1a1a] dark:bg-[#0a0a0a] dark:text-[#f8f9fa]"
    >
      {/* Background Graphic */}
      <div 
        ref={bgRef}
        className="absolute inset-0 z-0 opacity-10 dark:opacity-20 pointer-events-none flex items-center justify-center"
      >
        <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full border-[1px] border-current" />
        <div className="absolute w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full border-[1px] border-current opacity-50" />
      </div>

      <div ref={textRef} className="z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 uppercase">
          {data.name || 'Your Name'}
        </h1>
        <h2 className="text-xl md:text-3xl font-light tracking-wide text-neutral-600 dark:text-neutral-400 mb-8 uppercase">
          {data.title || 'Your Title'}
        </h2>
        {data.summary && (
          <p className="text-base md:text-lg lg:text-xl font-medium leading-relaxed max-w-2xl mx-auto opacity-80">
            {data.summary}
          </p>
        )}
      </div>

      <div 
        ref={arrowRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-current opacity-50 flex flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-[0.2em] font-medium">Scroll</span>
        <ChevronDown className="w-6 h-6" />
      </div>
    </section>
  );
}
