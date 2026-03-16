'use client';

import { useRef, useState, useEffect } from 'react';
import type { ResumeData } from '@/types/resume';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSection } from './scroll-section';
import { Briefcase } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface TimelineProps {
  data: ResumeData;
}

export function Timeline({ data }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(() => {
    if (!mounted || !data.experience || data.experience.length === 0) return;

    // Line drawing animation
    gsap.fromTo(
      lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
        }
      }
    );

    // Items animation
    itemsRef.current.forEach((item, index) => {
      if (!item) return;
      const isEven = index % 2 === 0;

      gsap.fromTo(
        item,
        { 
          opacity: 0, 
          x: isEven ? 50 : -50,
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });
  }, { scope: containerRef, dependencies: [mounted, data.experience] });

  if (!data.experience || data.experience.length === 0) {
    return null;
  }

  return (
    <ScrollSection id="experience" className="bg-white text-[#1a1a1a] dark:bg-[#111] dark:text-[#f8f9fa]">
      <div className="mb-16 md:mb-24 flex items-center justify-center gap-4 text-center">
        <Briefcase className="w-8 h-8 opacity-80" />
        <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight">The Journey</h2>
      </div>

      <div ref={containerRef} className="relative w-full max-w-4xl mx-auto">
        {/* The central timeline line */}
        <div 
          ref={lineRef}
          className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-neutral-300 dark:bg-neutral-800 origin-top -translate-x-1/2 will-change-transform"
        />

        <div className="space-y-12 md:space-y-24">
          {data.experience.map((exp, idx) => (
            <div 
              key={`${exp.company}-${idx}`}
              ref={(el) => {
                if (el) itemsRef.current[idx] = el;
              }}
              className={`relative flex flex-col md:flex-row items-start md:items-center ${
                idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } gap-8 group`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-blue-500 border-4 border-white dark:border-[#111] -translate-x-1/2 z-10 shadow-sm" />

              {/* Content Panel */}
              <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${idx % 2 === 0 ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                <div className="inline-block px-3 py-1 bg-neutral-100 dark:bg-neutral-900 text-sm font-semibold rounded-full mb-3 tracking-wide">
                  {exp.startDate} – {exp.endDate}
                </div>
                <h3 className="text-2xl font-bold mb-1">{exp.role || 'Software Engineer'}</h3>
                <div className="text-lg font-medium text-neutral-500 dark:text-neutral-400 mb-4">
                  {exp.company || 'Company'} {exp.location && `• ${exp.location}`}
                </div>

                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className={`text-neutral-600 dark:text-neutral-300 space-y-2 text-sm md:text-base leading-relaxed ${idx % 2 === 0 ? 'md:list-none' : 'list-disc pl-5'}`}>
                    {exp.bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollSection>
  );
}
