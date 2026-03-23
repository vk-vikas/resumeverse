'use client';

import { motion } from 'framer-motion';
import { FolderOpen, ExternalLink } from 'lucide-react';
import type { ThemeProps } from '../types';

export function ProjectsCard({ data }: ThemeProps) {
  if (!data.projects || data.projects.length === 0) return null;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="col-span-1 border border-neutral-800/50 bg-[#111] rounded-2xl p-6 relative group overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10" />

      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
          <FolderOpen className="h-4 w-4" />
        </div>
        <h2 className="text-lg font-semibold text-white">Projects</h2>
      </div>

      <div className="space-y-6">
        {data.projects.map((proj, i) => (
          <div key={i} className="flex flex-col group/proj">
            <div className="flex items-baseline justify-between mb-1">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                {proj.name}
                {proj.link && (
                  <a 
                    href={proj.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-blue-400 opacity-0 group-hover/proj:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </h3>
            </div>
            
            {(proj.bullets && proj.bullets.length > 0) ? (
              <ul className="text-sm text-neutral-400 leading-relaxed mb-3 list-disc pl-4 space-y-1">
                {proj.bullets.map((b, bIdx) => <li key={bIdx}>{b}</li>)}
              </ul>
            ) : (
              <p className="text-sm text-neutral-400 leading-relaxed mb-3">
                {proj.description}
              </p>
            )}

            {proj.tech && proj.tech.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {proj.tech.map((t, j) => (
                  <span 
                    key={j} 
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-800/80 text-neutral-400 border border-neutral-700/50"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
