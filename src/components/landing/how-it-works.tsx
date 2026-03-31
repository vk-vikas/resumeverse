'use client';

import { motion } from 'framer-motion';
import { Upload, Cpu, Share2 } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: <Upload className="h-6 w-6" />,
    title: 'Upload Your Resume',
    description: 'Drop your existing PDF or DOCX file. We support every standard resume format.',
    color: 'from-[#5B4FC4] to-[#7B6FD4]',
    bgTint: 'bg-[#F0EDFA]',
  },
  {
    number: '02',
    icon: <Cpu className="h-6 w-6" />,
    title: 'AI Transforms It',
    description: 'Google Gemini instantly parses, structures, and enhances your content with STAR-format bullets.',
    color: 'from-[#D89040] to-[#E8A050]',
    bgTint: 'bg-[#FDF5EC]',
  },
  {
    number: '03',
    icon: <Share2 className="h-6 w-6" />,
    title: 'Share Everywhere',
    description: 'Get a unique link with QR code, OG previews, and real-time analytics built in.',
    color: 'from-[#3A8D5C] to-[#4A9D6C]',
    bgTint: 'bg-[#EDF7F1]',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export function HowItWorks() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg className="relative block w-full h-[40px]" viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path d="M0,20 C150,40 350,0 600,20 C850,40 1050,0 1200,20 L1200,0 L0,0 Z" fill="#FAFAF8" />
        </svg>
      </div>

      {/* Subtle grid bg */}
      <div className="absolute inset-0 opacity-[0.4]" style={{
        backgroundImage: 'radial-gradient(circle, #E8E5DF 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      {/* Decorative floating shapes */}
      <svg className="absolute top-16 right-[8%] w-10 h-10 text-[#D89040] opacity-10 pointer-events-none" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="2.5" />
      </svg>
      <svg className="absolute bottom-24 left-[6%] w-8 h-8 text-[#3A8D5C] opacity-10 pointer-events-none" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="4" width="24" height="24" rx="6" stroke="currentColor" strokeWidth="2.5" />
      </svg>

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-[#5B4FC4] uppercase tracking-widest mb-3"
          >
            How it works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-[#1A1A1A]"
          >
            Three steps. Zero effort.
          </motion.h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid md:grid-cols-3 gap-8"
        >
          {steps.map((step, i) => (
            <motion.div key={i} variants={itemVariants} className="relative group">
              <div className="rounded-2xl border border-[#DCD8D0] bg-white p-8 h-full transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5">
                {/* Number badge */}
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${step.bgTint} mb-6`}>
                  <span className={`bg-gradient-to-br ${step.color} bg-clip-text text-transparent font-bold text-lg`}>
                    {step.number}
                  </span>
                </div>

                {/* Icon */}
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-5`}>
                  {step.icon}
                </div>

                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">{step.title}</h3>
                <p className="text-[#6B6560] leading-relaxed text-sm">{step.description}</p>
              </div>

              {/* Connector arrow — color-matched */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke={i === 0 ? '#5B4FC4' : i === 1 ? '#D89040' : '#3A8D5C'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
