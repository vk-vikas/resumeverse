'use client';

import { motion } from 'framer-motion';
import { LayoutGrid, Terminal, BarChartHorizontalBig } from 'lucide-react';

const themes = [
  {
    name: 'Bento Grid',
    description: 'Modern dark bento layout with animated cards and staggered reveals.',
    icon: <LayoutGrid className="h-6 w-6" />,
    color: 'from-[#5B4FC4] to-[#7B6FD4]',
    preview: (
      <div className="grid grid-cols-3 gap-1.5 p-3">
        <div className="col-span-2 h-8 rounded-md bg-[#5B4FC4]/10 border border-[#5B4FC4]/10" />
        <div className="h-8 rounded-md bg-[#5B4FC4]/5 border border-[#5B4FC4]/10" />
        <div className="h-6 rounded-md bg-[#5B4FC4]/8 border border-[#5B4FC4]/10" />
        <div className="h-6 rounded-md bg-[#5B4FC4]/5 border border-[#5B4FC4]/10" />
        <div className="h-6 rounded-md bg-[#5B4FC4]/10 border border-[#5B4FC4]/10" />
        <div className="col-span-2 h-5 rounded-md bg-[#5B4FC4]/5 border border-[#5B4FC4]/10" />
        <div className="h-5 rounded-md bg-[#5B4FC4]/8 border border-[#5B4FC4]/10" />
      </div>
    ),
  },
  {
    name: 'Terminal CLI',
    description: 'Interactive hacker aesthetic where visitors explore via typed commands.',
    icon: <Terminal className="h-6 w-6" />,
    color: 'from-[#3A8D5C] to-[#4A9D6C]',
    preview: (
      <div className="p-3 font-mono text-[10px] leading-relaxed text-[#3A8D5C] space-y-1">
        <p><span className="text-[#3A8D5C] font-semibold">visitor@resume</span>:~$ whoami</p>
        <p className="text-[#9C9590]">→ Full-Stack Developer</p>
        <p><span className="text-[#3A8D5C] font-semibold">visitor@resume</span>:~$ skills</p>
        <p className="text-[#9C9590]">→ React, Node, Python...</p>
        <p><span className="text-[#3A8D5C] font-semibold">visitor@resume</span>:~$ <span className="animate-pulse">▌</span></p>
      </div>
    ),
  },
  {
    name: 'Data Room',
    description: 'Executive dashboard driven by numerical KPIs and animated counters.',
    icon: <BarChartHorizontalBig className="h-6 w-6" />,
    color: 'from-[#D89040] to-[#E8A050]',
    preview: (
      <div className="p-3 space-y-2">
        <div className="flex items-end gap-1.5 h-12">
          {[60, 80, 45, 90, 70, 55, 85].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-gradient-to-t from-[#D89040]/30 to-[#D89040]/10 border border-[#D89040]/10"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <div className="flex-1 h-4 rounded bg-[#D89040]/10 border border-[#D89040]/10" />
          <div className="flex-1 h-4 rounded bg-[#D89040]/5 border border-[#D89040]/10" />
        </div>
      </div>
    ),
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export function ThemeShowcase() {
  return (
    <section className="py-24 bg-[#F5F3EF] relative overflow-hidden">
      {/* Top wave from white section */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg className="relative block w-full h-[40px]" viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path d="M0,20 C300,0 600,40 900,15 C1050,5 1150,25 1200,20 L1200,0 L0,0 Z" fill="white" />
        </svg>
      </div>

      {/* Decorative shapes */}
      <svg className="absolute top-20 left-[5%] w-12 h-12 text-[#D89040] opacity-[0.08] pointer-events-none" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 4" />
      </svg>
      <svg className="absolute bottom-16 right-[7%] w-16 h-6 text-[#8B5CF6] opacity-[0.08] pointer-events-none" viewBox="0 0 64 24" fill="none">
        <path d="M0 12 Q16 0 32 12 Q48 24 64 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-[#5B4FC4] uppercase tracking-widest mb-3"
          >
            Choose Your Style
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-[#1A1A1A] mb-4"
          >
            Three stunning themes.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#6B6560] text-lg max-w-xl mx-auto"
          >
            Each theme is a completely unique experience. Pick the one that fits your personality.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid md:grid-cols-3 gap-6"
        >
          {themes.map((theme, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="group rounded-2xl border border-[#DCD8D0] bg-white overflow-hidden transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1"
            >
              {/* Preview area */}
              <div className="bg-[#FAFAF8] border-b border-[#E8E5DF] min-h-[140px] flex items-center justify-center">
                <div className="w-full">{theme.preview}</div>
              </div>

              {/* Info area */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${theme.color} flex items-center justify-center text-white`}>
                    {theme.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-[#1A1A1A]">{theme.name}</h3>
                </div>
                <p className="text-[#6B6560] text-sm leading-relaxed">{theme.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
