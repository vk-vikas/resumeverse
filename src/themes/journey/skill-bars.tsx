'use client';

import { useRef, useState, useEffect } from 'react';
import type { ResumeData } from '@/types/resume';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSection } from './scroll-section';
import { Wrench } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SkillBarsProps {
  data: ResumeData;
}

export function SkillBars({ data }: SkillBarsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement[]>([]);
  const labelsRef = useRef<HTMLDivElement[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(() => {
    const allSkills = [
      ...(data.skills?.languages || []),
      ...(data.skills?.frameworks || []),
      ...(data.skills?.tools || []),
      ...(data.skills?.soft || [])
    ];
    
    if (!mounted || allSkills.length === 0) return;

    // Stagger animate internal bars expanding to designated widths
    gsap.fromTo(
      barsRef.current,
      { width: '0%' },
      {
        width: (i, target) => target.dataset.width || '100%',
        duration: 1.5,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      }
    );

    // Fade in text headers
    gsap.fromTo(
      labelsRef.current,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      }
    );

  }, { scope: containerRef, dependencies: [mounted, data.skills] });

  const allSkills = [
    ...(data.skills?.languages || []),
    ...(data.skills?.frameworks || []),
    ...(data.skills?.tools || []),
    ...(data.skills?.soft || [])
  ];

  // Safety fallback
  if (allSkills.length === 0) {
    return null;
  }

  // Parse skill items. Often skills arrive as strings without percentages. 
  // For visual effect, let's assign a pseudo-value if one isn't present, or stagger them randomly.
  const parsedSkills = allSkills.map((skill: string | { name?: string; level?: number }) => {
    // If it's just a string, give it a randomish width between 75% and 95% for demo purposes
    if (typeof skill === 'string') {
      const hash = skill.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const width = 75 + (hash % 20); // 75-95 range
      return { name: skill, width: `${width}%` };
    }
    // If it's already an object (future schema)
    return { name: skill.name || 'Skill', width: skill.level ? `${skill.level * 10}%` : '85%' };
  });

  return (
    <ScrollSection id="skills" className="bg-[#f8f9fa] text-[#1a1a1a] dark:bg-[#0a0a0a] dark:text-[#f8f9fa]">
      <div className="mb-16 md:mb-24 flex items-center justify-center gap-4 text-center">
        <Wrench className="w-8 h-8 opacity-80" />
        <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight">Capabilities</h2>
      </div>

      <div ref={containerRef} className="max-w-3xl mx-auto space-y-10">
        {parsedSkills.map((skill, idx) => (
          <div key={`${skill.name}-${idx}`} className="relative w-full">
            <div 
              ref={(el) => { if (el) labelsRef.current[idx] = el; }}
              className="flex justify-between font-medium mb-3 uppercase tracking-wider text-sm md:text-base opacity-0"
            >
              <span>{skill.name}</span>
            </div>
            
            <div className="h-3 md:h-4 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div 
                ref={(el) => { if (el) barsRef.current[idx] = el; }}
                data-width={skill.width}
                className="h-full bg-[#1a1a1a] dark:bg-white rounded-full will-change-transform"
                style={{ width: '0%' }}
              />
            </div>
          </div>
        ))}
      </div>
    </ScrollSection>
  );
}
