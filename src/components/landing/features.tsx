'use client';

import { motion } from 'framer-motion';
import { FileSearch, Sparkles, LayoutTemplate, Share2, BarChart3, Lock } from 'lucide-react';

const features = [
  {
    icon: <FileSearch className="h-6 w-6 text-blue-400" />,
    title: 'AI Document Parsing',
    description: 'Upload any standard PDF or DOCX. Gemini instantly extracts and structures your entire work history.',
  },
  {
    icon: <Sparkles className="h-6 w-6 text-amber-500" />,
    title: 'Generative Enhancements',
    description: 'Stuck on what to write? Our AI career coach rewrites weak bullets into metric-driven STAR formats instantly.',
  },
  {
    icon: <LayoutTemplate className="h-6 w-6 text-purple-400" />,
    title: '3D Interactive Themes',
    description: 'Choose between a polished Bento Grid, a scroll-driven Parallax Journey, or a retro Hacker CLI Terminal.',
  },
  {
    icon: <Share2 className="h-6 w-6 text-green-400" />,
    title: 'Dynamic OpenGraph SEO',
    description: 'Sharing your custom resumeverse.com link automatically renders a beautiful preview card on LinkedIn and Twitter.',
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-pink-400" />,
    title: 'View Analytics',
    description: 'Track how many recruiters look at your resume. See exactly what browser and device they used to view your profile.',
  },
  {
    icon: <Lock className="h-6 w-6 text-neutral-400" />,
    title: 'Private & Secure',
    description: 'Your data belongs to you. We do not train models on your resume, and you can delete your profile at any time.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Features() {
  return (
    <section className="py-24 bg-neutral-950">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Everything you need to stand out.
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            ResumeVerse isnt just another PDF builder. Its a comprehensive toolkit designed to get you past automated tracking systems and impress human recruiters.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 transition-colors"
            >
              <div className="h-12 w-12 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-neutral-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
