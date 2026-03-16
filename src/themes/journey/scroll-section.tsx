'use client';

import { ReactNode } from 'react';

interface ScrollSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function ScrollSection({ children, className = '', id }: ScrollSectionProps) {
  return (
    <section 
      id={id}
      className={`relative min-h-screen py-24 flex flex-col justify-center px-6 md:px-12 lg:px-24 ${className}`}
    >
      <div className="max-w-6xl mx-auto w-full">
        {children}
      </div>
    </section>
  );
}
