'use client';

import { motion } from 'framer-motion';
import { Upload, Sparkles, Activity, FileText, Globe } from 'lucide-react';

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

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
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
            Two ways to stand out.
          </motion.h2>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 lg:gap-4 relative">
          
          {/* Node 1: Upload (Left on Desktop, Top on Mobile) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/3 flex flex-col justify-center"
          >
            <div className="bg-white border border-[#DCD8D0] rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-center items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#F0EDFA] flex items-center justify-center mb-6">
                <Upload className="h-7 w-7 text-[#5B4FC4]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3">1. Upload Resume</h3>
              <p className="text-[#6B6560] leading-relaxed text-sm">
                Drop your standard PDF or DOCX file into the dashboard. Our engine parses your history securely in milliseconds.
              </p>
            </div>
          </motion.div>

          {/* Desktop Branching SVG Arrows */}
          <div className="hidden lg:flex w-24 items-center justify-center relative flex-shrink-0">
            <svg viewBox="0 0 100 200" className="w-full h-full text-[#DCD8D0]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 6">
              {/* Top arrow path to Path A */}
              <path d="M10,100 C 40,100 40,50 90,50" />
              <polyline points="80,40 90,50 80,60" fill="none" strokeDasharray="none" />
              
              {/* Bottom arrow path to Path B */}
              <path d="M10,100 C 40,100 40,150 90,150" />
              <polyline points="80,140 90,150 80,160" fill="none" strokeDasharray="none" />
            </svg>
          </div>

          {/* Mobile Downward Arrow */}
          <div className="flex lg:hidden justify-center items-center text-[#DCD8D0] py-2">
            <svg width="24" height="40" viewBox="0 0 24 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4">
              <path d="M12,0 L12,35" />
              <polyline points="4,27 12,35 20,27" fill="none" strokeDasharray="none" />
            </svg>
          </div>

          {/* Node 2: Divergent Paths Stack (Right on Desktop, Bottom on Mobile) */}
          <div className="w-full lg:w-7/12 flex flex-col gap-6">
            
            {/* Path A */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-full bg-white border border-[#DCD8D0] border-l-4 border-l-[#5B4FC4] rounded-2xl p-8 shadow-sm hover:-translate-y-1 transition-transform relative"
            >
              <div className="absolute top-0 right-6 -translate-y-1/2 px-3 py-1 bg-[#F0EDFA] border border-[#DCD8D0] text-xs font-bold text-[#5B4FC4] rounded-full uppercase tracking-widest">
                Path A
              </div>
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5B4FC4] to-[#7B6FD4] flex items-center justify-center text-white flex-shrink-0">
                  <Sparkles className="w-6 h-6"/>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-1">Interactive Web Portfolio</h3>
                  <p className="text-[#6B6560] text-sm leading-relaxed">
                    Let Google Gemini automatically enhance your bullet points into impactful STAR formats. Choose from stunning interactive themes like Bento Grid or Terminal CLI to deploy a live website.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Path B */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="w-full bg-white border border-[#DCD8D0] border-l-4 border-l-[#D89040] rounded-2xl p-8 shadow-sm hover:-translate-y-1 transition-transform relative"
            >
              <div className="absolute top-0 right-6 -translate-y-1/2 px-3 py-1 bg-[#FDF5EC] border border-[#DCD8D0] text-xs font-bold text-[#D89040] rounded-full uppercase tracking-widest">
                Path B
              </div>
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D89040] to-[#E8A050] flex items-center justify-center text-white flex-shrink-0">
                  <Activity className="w-6 h-6"/>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-1">PDF Tracking & Heatmaps</h3>
                  <p className="text-[#6B6560] text-sm leading-relaxed">
                    Keep your original PDF styling perfectly intact. We host it behind a trackable link so you can see exactly where recruiters scroll, pause to read, and click via interactive heatmaps.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
