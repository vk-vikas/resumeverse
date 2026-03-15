'use client';

import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import type { ThemeProps } from '../types';

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export function SkillsCard({ data }: ThemeProps) {
  const { languages, frameworks, tools } = data.skills;
  const hasSkills = languages.length > 0 || frameworks.length > 0 || tools.length > 0;

  if (!hasSkills) return null;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="col-span-1 border border-neutral-800/50 bg-[#111] rounded-2xl p-6 relative group overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10" />

      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
          <Code2 className="h-4 w-4" />
        </div>
        <h2 className="text-lg font-semibold text-white">Skills</h2>
      </div>

      <div className="space-y-6">
        {languages.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
              Languages
            </h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((skill, i) => (
                <motion.span
                  key={i}
                  variants={badgeVariants}
                  className="px-2.5 py-1 rounded-md bg-neutral-800/50 border border-neutral-700/50 text-sm text-neutral-300"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {frameworks.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
              Frameworks & Libraries
            </h3>
            <div className="flex flex-wrap gap-2">
              {frameworks.map((skill, i) => (
                <motion.span
                  key={i}
                  variants={badgeVariants}
                  className="px-2.5 py-1 rounded-md bg-neutral-800/50 border border-neutral-700/50 text-sm text-neutral-300"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {tools.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
              Tools & Platforms
            </h3>
            <div className="flex flex-wrap gap-2">
              {tools.map((skill, i) => (
                <motion.span
                  key={i}
                  variants={badgeVariants}
                  className="px-2.5 py-1 rounded-md bg-neutral-800/50 border border-neutral-700/50 text-sm text-neutral-300"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
