'use client';

import { motion } from 'framer-motion';
import { FileSearch, Sparkles, LayoutTemplate, Share2, BarChart3, Lock } from 'lucide-react';

const features = [
  {
    icon: <FileSearch className="h-6 w-6 text-[#5B4FC4]" />,
    title: 'AI Document Parsing',
    description: 'Upload any standard PDF or DOCX. Gemini instantly extracts and structures your entire work history.',
    tint: 'bg-[#F0EDFA]',
    accent: 'border-l-[#5B4FC4]',
  },
  {
    icon: <Sparkles className="h-6 w-6 text-[#D89040]" />,
    title: 'Generative Enhancements',
    description: 'Stuck on what to write? Our AI career coach rewrites weak bullets into metric-driven STAR formats instantly.',
    tint: 'bg-[#FDF5EC]',
    accent: 'border-l-[#D89040]',
  },
  {
    icon: <LayoutTemplate className="h-6 w-6 text-[#8B5CF6]" />,
    title: '3 Interactive Themes',
    description: 'Choose between a polished Bento Grid, an interactive Terminal CLI, or an executive Data Room dashboard.',
    tint: 'bg-[#F5F0FF]',
    accent: 'border-l-[#8B5CF6]',
  },
  {
    icon: <Share2 className="h-6 w-6 text-[#3A8D5C]" />,
    title: 'Dynamic OpenGraph SEO',
    description: 'Sharing your custom resumeverse.com link automatically renders a beautiful preview card on LinkedIn and Twitter.',
    tint: 'bg-[#EDF7F1]',
    accent: 'border-l-[#3A8D5C]',
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-[#D84040]" />,
    title: 'View Analytics',
    description: 'Track how many recruiters look at your resume. See exactly what browser and device they used to view your profile.',
    tint: 'bg-[#FDF0F0]',
    accent: 'border-l-[#D84040]',
  },
  {
    icon: <Lock className="h-6 w-6 text-[#6B6560]" />,
    title: 'Private & Secure',
    description: 'Your data belongs to you. We do not train models on your resume, and you can delete your profile at any time.',
    tint: 'bg-[#F5F3EF]',
    accent: 'border-l-[#9C9590]',
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
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Top wave from tinted section */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg className="relative block w-full h-[40px]" viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path d="M0,15 C200,35 400,5 600,20 C800,35 1000,10 1200,25 L1200,0 L0,0 Z" fill="#F5F3EF" />
        </svg>
      </div>

      {/* Decorative shapes */}
      <svg className="absolute top-24 right-[6%] w-10 h-10 text-[#3A8D5C] opacity-[0.07] pointer-events-none" viewBox="0 0 40 40" fill="none">
        <polygon points="20,2 38,30 2,30" stroke="currentColor" strokeWidth="2.5" />
      </svg>
      <svg className="absolute bottom-20 left-[8%] w-14 h-14 text-[#D89040] opacity-[0.06] pointer-events-none" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="28" cy="28" r="10" fill="currentColor" fillOpacity="0.1" />
      </svg>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
            Everything you need to stand out.
          </h2>
          <p className="text-[#6B6560] text-lg max-w-2xl mx-auto">
            ResumeVerse isn&apos;t just another PDF builder. It&apos;s a comprehensive toolkit designed to get you past automated tracking systems and impress human recruiters.
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
              className={`p-6 rounded-2xl border border-[#DCD8D0] border-l-4 ${feature.accent} bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-300`}
            >
              <div className={`h-12 w-12 rounded-xl ${feature.tint} border border-[#E8E5DF] flex items-center justify-center mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">{feature.title}</h3>
              <p className="text-[#6B6560] leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
