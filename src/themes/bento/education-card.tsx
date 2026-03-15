'use client';

import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import type { ThemeProps } from '../types';

export function EducationCard({ data }: ThemeProps) {
  if (!data.education || data.education.length === 0) return null;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="col-span-1 border border-neutral-800/50 bg-[#111] rounded-2xl p-6 relative group overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10" />

      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
          <GraduationCap className="h-4 w-4" />
        </div>
        <h2 className="text-lg font-semibold text-white">Education</h2>
      </div>

      <div className="space-y-5">
        {data.education.map((edu, i) => (
          <div key={i} className="flex flex-col border-l-2 border-neutral-800 pl-4 py-1">
            <h3 className="text-base font-semibold text-white">
              {edu.degree}
              {edu.field ? <span className="text-neutral-400 font-normal"> in {edu.field}</span> : ''}
            </h3>
            <p className="text-sm text-neutral-500 mt-1">
              {edu.institution}
            </p>
            <p className="text-xs text-neutral-600 font-medium mt-1">
              {edu.year}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
