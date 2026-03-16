'use client';

import { useRef, useState, useEffect } from 'react';
import type { ResumeData } from '@/types/resume';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSection } from './scroll-section';
import { Mail, MapPin, Globe, Phone, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ContactSectionProps {
  data: ResumeData;
}

export function ContactSection({ data }: ContactSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(() => {
    if (!mounted) return;

    gsap.fromTo(
      itemsRef.current,
      { opacity: 0, scale: 0.9, y: 30 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        }
      }
    );

  }, { scope: containerRef, dependencies: [mounted, data.contact] });

  if (!data.contact) return null;

  const contactItems = [
    { icon: <Mail className="w-5 h-5" />, value: data.contact.email, href: `mailto:${data.contact.email}` },
    { icon: <Globe className="w-5 h-5" />, value: data.contact.portfolio, href: data.contact.portfolio },
    { icon: <Phone className="w-5 h-5" />, value: data.contact.phone, href: `tel:${data.contact.phone}` },
    { icon: <MapPin className="w-5 h-5" />, value: data.contact.location },
  ].filter(item => Boolean(item.value));

  return (
    <ScrollSection id="contact" className="min-h-[70vh] bg-white text-[#1a1a1a] dark:bg-[#111] dark:text-[#f8f9fa] border-t border-neutral-200 dark:border-neutral-900">
      <div className="mb-12 md:mb-16 flex flex-col items-center justify-center text-center">
        <UserCircle2 className="w-10 h-10 mb-4 opacity-80" />
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Let's Connect</h2>
        <p className="mt-4 text-lg text-neutral-500 dark:text-neutral-400 font-medium">Get in touch to collaborate or discuss opportunities.</p>
      </div>

      <div ref={containerRef} className="max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactItems.map((item, idx) => (
            <div 
              key={idx}
              ref={(el) => { if (el) itemsRef.current[idx] = el; }}
              className="flex flex-col items-center justify-center p-8 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 flex items-center justify-center mb-4 text-blue-500 shadow-sm">
                {item.icon}
              </div>
              
              {item.href ? (
                <a 
                  href={item.href} 
                  target={item.href.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="text-center text-sm md:text-base font-medium truncate w-full hover:text-blue-500 transition-colors"
                >
                  {item.value}
                </a>
              ) : (
                <span className="text-center text-sm md:text-base font-medium truncate w-full">
                  {item.value}
                </span>
              )}
            </div>
          ))}
        </div>
        
        {data.contact.email && (
          <div className="mt-16 flex justify-center">
             {/* Simple button mimicking Shadcn style directly avoiding compilation overlap if missing */}
             <a 
               href={`mailto:${data.contact.email}`}
               className="inline-flex items-center justify-center px-8 py-4 bg-[#1a1a1a] text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200 rounded-lg text-lg font-bold tracking-wide uppercase transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
             >
                <Mail className="mr-3 h-5 w-5" />
                Drope me a line
             </a>
          </div>
        )}
      </div>
    </ScrollSection>
  );
}
