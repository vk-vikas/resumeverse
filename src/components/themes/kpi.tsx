'use client';

import { motion } from 'framer-motion';
import type { ResumeData } from '@/types/resume';
import { extractKPIs, type KPIMetric } from '@/lib/utils/extract-kpis';
import { useEffect, useState } from 'react';
import { Briefcase, GraduationCap, Code } from 'lucide-react';

// A simple animated counter using framer motion text scaling
function AnimatedCounter({ value }: { value: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
      className="inline-block"
    >
      {value}
    </motion.span>
  );
}

export function KPITheme({ data }: { data: ResumeData }) {
  const [kpis, setKpis] = useState<KPIMetric[]>([]);

  useEffect(() => {
    setKpis(extractKPIs(data));
  }, [data]);

  return (
    <div className="min-h-full w-full bg-[#030712] text-slate-300 font-mono p-4 sm:p-8 flex-1">
      {/* Header Panel */}
      <header className="mb-12 border-b border-slate-800 pb-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-2 uppercase selection:bg-emerald-500/30">
              {data.name || 'ANALYTICS DASHBOARD'}
            </h1>
            <p className="text-emerald-400 text-lg uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse hidden sm:inline-block"></span>
              {data.title || 'UNKNOWN ROLE'}
            </p>
          </div>
          {data.contact && (
            <div className="text-right text-xs text-slate-500 space-y-1 hidden sm:block">
              {data.contact.email && <div>{data.contact.email}</div>}
              {data.contact.phone && <div>{data.contact.phone}</div>}
              {data.contact.location && <div>{data.contact.location}</div>}
            </div>
          )}
        </div>

        {data.summary && (
          <p className="text-sm font-sans text-slate-400 max-w-3xl leading-relaxed border-l-2 border-slate-800 pl-4 py-1">
            {data.summary}
          </p>
        )}
      </header>

      {/* The Data Room KPI Grid */}
      <section className="mb-12">
        <h2 className="text-xs uppercase tracking-widest text-slate-500 mb-4 font-semibold pb-2 border-b border-slate-800/50 flex items-center gap-2">
           Executive Summary / KPIs
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 sm:p-6 relative overflow-hidden group hover:border-emerald-500/50 hover:bg-slate-900 transition-colors"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tighter">
                <AnimatedCounter value={kpi.value} />
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-sans leading-tight uppercase tracking-wider">
                {kpi.context}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Experience & Projects) */}
        <div className="lg:col-span-2 space-y-12">
          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500 mb-6 font-semibold pb-2 border-b border-slate-800/50">
                <Briefcase className="w-4 h-4 text-emerald-500" /> Operational History
              </div>
              <div className="space-y-8">
                {data.experience.map((exp, i) => (
                  <div key={i} className="relative pl-6 border-l border-slate-800">
                    <div className="absolute w-2 h-2 rounded-full bg-slate-700 -left-[5px] top-1.5 ring-4 ring-[#030712]"></div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                      <h3 className="text-lg font-semibold text-slate-200">{exp.role}</h3>
                      <span className="text-emerald-500/80 text-xs font-semibold">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <div className="text-sm text-cyan-500/90 mb-4">{exp.company}</div>
                    
                    <ul className="space-y-3 font-sans text-sm text-slate-400">
                      {exp.bullets?.map((b, j) => {
                        // Highlight numbers directly in React output
                        const parts = b.split(/(\$?\d+(?:,\d{3})*(?:\.\d+)?[kKmMbB]?\+?%?|\d+[xX])/g);
                        
                        return (
                          <li key={j} className="flex gap-3 leading-relaxed">
                            <span className="text-slate-600 mt-0.5">»</span>
                            <span>
                              {parts.map((part, pid) => {
                                // If it's the parsed match, wrap it
                                if (part.match(/^(\$?\d+(?:,\d{3})*(?:\.\d+)?[kKmMbB]?\+?%?|\d+[xX])$/)) {
                                  return (
                                    <span key={pid} className="text-white font-mono bg-emerald-500/10 text-emerald-300/90 px-1 py-0.5 mx-0.5 rounded text-xs">
                                      {part}
                                    </span>
                                  );
                                }
                                return <span key={pid}>{part}</span>;
                              })}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500 mb-6 font-semibold pb-2 border-b border-slate-800/50">
                <Code className="w-4 h-4 text-cyan-500" /> Technical Deployments
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {data.projects.map((proj, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg p-5 hover:border-slate-700 transition-colors flex flex-col h-full">
                    <h3 className="text-white font-semibold mb-2">{proj.name}</h3>
                    <p className="text-sm font-sans text-slate-400 mb-4 flex-1">{proj.description}</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {proj.tech?.map((t, j) => (
                        <span key={j} className="text-[10px] px-2 py-1 bg-slate-950 border border-slate-800 text-cyan-400 rounded uppercase">
                          {t}
                        </span>
                      ))}
                    </div>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="inline-block mt-4 text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                        View Deployment [↗]
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column (Skills & Ed) */}
        <div className="space-y-8">
          {data.skills && (data.skills.languages?.length > 0 || data.skills.frameworks?.length > 0 || data.skills.tools?.length > 0) && (
            <section className="bg-slate-900/30 border border-slate-800 p-6 rounded-lg">
              <h2 className="text-xs uppercase tracking-widest text-slate-500 mb-6 font-semibold pb-2 border-b border-slate-800/50">
                System Capabilities
              </h2>
              
              <div className="space-y-6">
                {data.skills.languages?.length > 0 && (
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">Languages</div>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.languages.map((s, i) => (
                        <span key={i} className="text-xs text-slate-300 py-1 px-2 bg-slate-800/50 rounded">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {data.skills.frameworks?.length > 0 && (
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">Frameworks</div>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.frameworks.map((s, i) => (
                        <span key={i} className="text-xs text-slate-300 py-1 px-2 bg-slate-800/50 rounded">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {data.skills.tools?.length > 0 && (
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">Infrastructure</div>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.tools.map((s, i) => (
                        <span key={i} className="text-xs text-slate-300 py-1 px-2 bg-slate-800/50 rounded">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {data.education && data.education.length > 0 && (
            <section className="bg-slate-900/30 border border-slate-800 p-6 rounded-lg">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500 mb-6 font-semibold pb-2 border-b border-slate-800/50">
                <GraduationCap className="w-4 h-4 text-emerald-500" /> Knowledge Base
              </div>
              <div className="space-y-4">
                {data.education.map((ed, i) => (
                  <div key={i}>
                    <div className="text-sm font-semibold text-slate-200">{ed.degree}</div>
                    <div className="text-xs text-cyan-500/90 mt-1">{ed.institution}</div>
                    <div className="text-[10px] text-slate-500 mt-1">{ed.year}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
