'use client';

import { motion } from 'framer-motion';
import type { ThemeProps } from '../types';

export function HeroCard({ data }: ThemeProps) {
  if (!data.name && !data.title && !data.summary) return null;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="relative col-span-1 md:col-span-2 rounded-2xl border border-neutral-800/50 bg-[#111] p-8 overflow-hidden group"
    >
      {/* Subtle top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-70 group-hover:opacity-100 transition-opacity" />
      
      {/* Background glow on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl rounded-2xl -z-10" />

      <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
        {data.name || 'Your Name'}
      </h1>
      
      {data.title && (
        <p className="text-xl md:text-2xl font-medium text-neutral-400 mb-6">
          {data.title}
        </p>
      )}
      
      {data.summary && (
        <p className="text-base text-neutral-300 leading-relaxed max-w-3xl">
          {data.summary}
        </p>
      )}
    </motion.div>
  );
}
