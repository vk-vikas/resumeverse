'use client';

import { motion, type Variants } from 'framer-motion';
import type { ThemeProps } from '../types';
import { HeroCard } from './hero-card';
import { ContactCard } from './contact-card';
import { ExperienceCard } from './experience-card';
import { EducationCard } from './education-card';
import { SkillsCard } from './skills-card';
import { ProjectsCard } from './projects-card';

// Stagger parent variant
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 0.1s delay between each card animating in
    },
  },
};

// Item variant for each card within the stagger
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export function BentoTheme({ data }: ThemeProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-8 md:p-12 lg:p-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-[1200px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min"
      >
        {/* Wrap each component in a staggering motion div */}
        <motion.div variants={itemVariants} className="md:col-span-2">
          <HeroCard data={data} />
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-1">
          <ContactCard data={data} />
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-2">
          <ExperienceCard data={data} />
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-1">
          <EducationCard data={data} />
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-2 space-y-6">
          <SkillsCard data={data} />
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-1">
          <ProjectsCard data={data} />
        </motion.div>
      </motion.div>

      {/* Footer */}
      <footer className="mt-16 text-center">
        <p className="text-xs text-neutral-600">
          Built with <a href="/" className="text-blue-400 hover:text-blue-300 transition-colors">ResumeVerse</a>
        </p>
      </footer>
    </div>
  );
}
