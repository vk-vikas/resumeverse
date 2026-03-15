'use client';

import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import type { ThemeProps } from '../types';

export function ExperienceCard({ data }: ThemeProps) {
  if (!data.experience || data.experience.length === 0) return null;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="col-span-1 border border-neutral-800/50 bg-[#111] rounded-2xl p-6 relative group overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10" />

      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
          <Briefcase className="h-4 w-4" />
        </div>
        <h2 className="text-lg font-semibold text-white">Experience</h2>
      </div>

      <div className="space-y-6">
        {data.experience.map((exp, i) => (
          <div key={i} className="relative pl-4">
            {/* Timeline line */}
            {i !== data.experience.length - 1 && (
              <div className="absolute left-[7px] top-6 bottom-[-24px] w-[2px] bg-neutral-800/50" />
            )}
            {/* Timeline dot */}
            <div className="absolute left-0 top-2 h-4 w-4 rounded-full border-4 border-[#111] bg-neutral-700 group-hover:bg-blue-500 transition-colors" />

            <div className="mb-1 flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="text-base font-semibold text-white">
                {exp.role} <span className="text-neutral-500 font-normal">at {exp.company}</span>
              </h3>
              <span className="text-xs text-neutral-500 font-medium whitespace-nowrap mt-1 sm:mt-0">
                {exp.startDate} – {exp.endDate}
              </span>
            </div>

            {exp.bullets && exp.bullets.filter(Boolean).length > 0 && (
              <ul className="mt-2 space-y-2">
                {exp.bullets.filter(Boolean).map((bullet, j) => (
                  <li key={j} className="text-sm text-neutral-400 leading-relaxed pl-1 relative">
                    <span className="absolute left-[-12px] top-[6px] h-1 w-1 rounded-full bg-neutral-600" />
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
