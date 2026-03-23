'use client';

import { motion } from 'framer-motion';
import type { ResumeData } from '@/types/resume';
import { extractKPIs, type KPIMetric } from '@/lib/utils/extract-kpis';
import { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TerminalSquare, 
  MapPin, 
  Mail, 
  Github, 
  Linkedin,
  Activity,
  Box,
  LayoutDashboard,
  Search,
  Bell,
  MoreHorizontal
} from 'lucide-react';

export function KPITheme({ data }: { data: ResumeData }) {
  const [kpis, setKpis] = useState<KPIMetric[]>([]);

  useEffect(() => {
    setKpis(extractKPIs(data));
  }, [data]);

  // Generate random percentages for skills to make them look like real dashboard charts
  const getSkillStrength = (index: number) => {
    const strengths = [95, 88, 76, 92, 85, 78, 90, 82];
    return strengths[index % strengths.length];
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-slate-300 font-sans flex flex-col md:flex-row overflow-hidden border border-slate-800 rounded-lg">
      
      {/* LEFT SIDEBAR (The Navigation Menu) */}
      <aside className="w-full md:w-64 bg-[#111111] border-r border-slate-800 flex flex-col hidden md:flex shrink-0 h-full min-h-screen sticky top-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-semibold">
            <LayoutDashboard className="w-5 h-5 text-emerald-500" />
            <span>Profile_Dash</span>
          </div>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto hidden-scrollbar">
          {/* User Profile Widget */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-2xl font-bold text-white mb-4 shadow-xl">
              {data.name?.charAt(0) || 'U'}
            </div>
            <h2 className="text-white font-medium">{data.name}</h2>
            <p className="text-xs text-slate-500 mt-1">{data.title}</p>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-3">System Access</div>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-3 py-2 px-3 rounded-md bg-slate-800/50 text-white font-medium border border-slate-700/50">
                  <BarChart3 className="w-4 h-4 text-emerald-400" /> Executive Overview
                </li>
                <li className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-slate-800/30 transition-colors cursor-pointer">
                  <Activity className="w-4 h-4" /> Operational Feed
                </li>
                <li className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-slate-800/30 transition-colors cursor-pointer">
                  <Box className="w-4 h-4" /> Project Inventory
                </li>
              </ul>
            </div>

            {/* Contact Information as "Metadata" */}
            <div>
              <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-3">Properties</div>
              <ul className="space-y-3 text-xs text-slate-400">
                {data.contact?.location && (
                  <li className="flex items-center gap-3">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> {data.contact.location}
                  </li>
                )}
                {data.contact?.email && (
                  <li className="flex items-center gap-3">
                    <Mail className="w-3.5 h-3.5 text-slate-500" /> {data.contact.email}
                  </li>
                )}
                {data.contact?.github && (
                  <li className="flex items-center gap-3">
                    <Github className="w-3.5 h-3.5 text-slate-500" /> <a href={data.contact.github} className="hover:text-emerald-400 underline decoration-slate-700 underline-offset-2">github.com</a>
                  </li>
                )}
                {data.contact?.linkedin && (
                  <li className="flex items-center gap-3">
                    <Linkedin className="w-3.5 h-3.5 text-slate-500" /> <a href={data.contact.linkedin} className="hover:text-emerald-400 underline decoration-slate-700 underline-offset-2">linkedin.com</a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN DASHBOARD PANEL */}
      <main className="flex-1 bg-[#0a0a0a] flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 bg-[#111111]/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-2 md:hidden">
             <LayoutDashboard className="w-5 h-5 text-emerald-500" />
             <span className="text-white font-semibold text-sm">Dash</span>
          </div>
          <div className="hidden md:flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-md px-3 py-1.5 w-64 text-sm text-slate-500">
            <Search className="w-4 h-4" /> Search metrics...
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-white relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#111111]"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 hidden md:block"></div>
          </div>
        </header>

        {/* Dashboard Content Scroller */}
        <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto">
          
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-white">Executive Overview</h1>
            <p className="text-sm text-slate-400 mt-1">Real-time telemetry and operational metrics.</p>
          </div>

          {/* WIDGET ROW 1: The Number Counters (Extracted KPIs) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {kpis.map((kpi, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                key={i} 
                className="bg-[#111111] border border-slate-800 rounded-lg p-5 flex flex-col relative overflow-hidden group"
              >
                {/* Simulated Sparkline Background */}
                <svg className="absolute bottom-0 inset-x-0 h-16 w-full opacity-10 group-hover:opacity-20 transition-opacity" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,100 L0,50 Q25,20 50,60 T100,30 L100,100 Z" fill="currentColor" className="text-emerald-500"></path>
                </svg>

                <div className="flex justify-between items-start mb-2 relative z-10">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{kpi.context}</span>
                  <BarChart3 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-3xl font-bold text-white relative z-10">{kpi.value}</div>
                <div className="text-[10px] text-emerald-500 font-mono mt-2 relative z-10 flex items-center gap-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Active Trajectory
                </div>
              </motion.div>
            ))}
            
            {/* Fill empty spots if less than 4 KPIs were extracted */}
            {Array.from({ length: Math.max(0, 4 - kpis.length) }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-[#111111] border border-slate-800 rounded-lg p-5 flex flex-col justify-center items-center text-slate-700 opacity-50">
                 <Activity className="w-6 h-6 mb-2" />
                 <span className="text-xs">Awaiting Telemetry</span>
              </div>
            ))}
          </div>

          {/* WIDGET ROW 2: Bar Charts (Skills) & Education Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Bar Chart Widget (Languages/Frameworks) */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-[#111111] border border-slate-800 rounded-lg flex flex-col">
              <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-white">Stack Proficiency Distribution</h3>
                <MoreHorizontal className="w-4 h-4 text-slate-500" />
              </div>
              <div className="p-6 flex-1">
                {(!data.skills?.languages?.length && !data.skills?.frameworks?.length) && (
                  <div className="h-full flex items-center justify-center text-sm text-slate-600">No skill data available.</div>
                )}
                <div className="space-y-4">
                  {[...(data.skills?.languages || []), ...(data.skills?.frameworks || [])].map((skill, idx) => {
                    const strength = getSkillStrength(idx);
                    return (
                      <div key={idx} className="group">
                        <div className="flex justify-between mb-1 text-xs">
                          <span className="text-slate-300 font-medium">{skill}</span>
                          <span className="text-slate-500 font-mono">{strength}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} whileInView={{ width: `${strength}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: idx * 0.1 }}
                            className="bg-emerald-500 h-1.5 rounded-full"
                          ></motion.div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Education/Summary Panel */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-[#111111] border border-slate-800 rounded-lg flex flex-col">
              <div className="px-6 py-4 border-b border-slate-800">
                <h3 className="text-sm font-semibold text-white">Academic History</h3>
              </div>
              <div className="p-6 flex-1">
                {data.education && data.education.length > 0 ? (
                  <div className="space-y-6">
                    {data.education.map((ed, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-emerald-500">
                           <Box className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white leading-tight">{ed.degree}</div>
                          <div className="text-xs text-slate-400 mt-1">{ed.institution}</div>
                          <div className="text-[10px] text-emerald-400 font-mono mt-1 px-1.5 py-0.5 bg-emerald-500/10 inline-block rounded">{ed.year}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                   <div className="text-sm text-slate-600">No academic data tracked.</div>
                )}
              </div>
            </motion.div>

          </div>

          {/* WIDGET ROW 3: Data Table (Projects) */}
          {data.projects && data.projects.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-[#111111] border border-slate-800 rounded-lg mb-6 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-[#111111]">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <TerminalSquare className="w-4 h-4 text-emerald-500" /> Project Configurations
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#0a0a0a] border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500">
                      <th className="p-4 font-medium">Deployment Name</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Tech Stack</th>
                      <th className="p-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-slate-300">
                    {data.projects.map((proj, i) => (
                      <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                        <td className="p-4 font-medium text-white flex flex-col gap-1">
                           <div className="flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full bg-cyan-500"></div> {proj.name}
                           </div>
                           {(proj.bullets && proj.bullets.length > 0) ? (
                             <ul className="pl-5 list-disc text-xs text-slate-400 font-normal mt-1 space-y-0.5">
                               {proj.bullets.map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                             </ul>
                           ) : (
                             <div className="pl-5 text-xs text-slate-400 font-normal mt-1">{proj.description}</div>
                           )}
                        </td>
                        <td className="p-4">
                           <span className="px-2 py-1 text-[10px] uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-mono">
                             Live Build
                           </span>
                        </td>
                        <td className="p-4">
                           <div className="flex items-center gap-1 flex-wrap">
                             {proj.tech?.slice(0, 3).map((t, j) => (
                               <span key={j} className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">{t}</span>
                             ))}
                             {(proj.tech?.length || 0) > 3 && <span className="text-[10px] text-slate-500">+{proj.tech!.length - 3}</span>}
                           </div>
                        </td>
                        <td className="p-4 text-right">
                           {proj.link ? (
                             <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300">View Demo</a>
                           ) : (
                             <span className="text-xs text-slate-600">-</span>
                           )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* WIDGET ROW 4: Activity Log (Experience Timeline) */}
          {data.experience && data.experience.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="bg-[#111111] border border-slate-800 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" /> Operational Activity Log
              </h3>
              
              <div className="space-y-8 pl-2">
                {data.experience.map((exp, i) => (
                  <div key={i} className="relative pl-6 border-l border-slate-800 last:border-transparent">
                    {/* Timeline Node */}
                    <div className="absolute w-3 h-3 rounded-full bg-slate-900 border-2 border-emerald-500 -left-[6.5px] top-1"></div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                      <h4 className="text-sm font-bold text-white">{exp.role} <span className="text-slate-500 font-normal mx-1">at</span> <span className="text-blue-400">{exp.company}</span></h4>
                      <span className="text-[10px] font-mono text-slate-500 border border-slate-800 px-2 py-0.5 rounded-full mt-2 sm:mt-0 bg-slate-900">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      {exp.bullets?.map((bull, j) => {
                         // Stylize the text like terminal log output
                         const highlighted = bull.replace(/(\$?\d+(?:,\d{3})*(?:\.\d+)?[kKmMbB]?\+?%?|\d+[xX])/g, '<span class="text-emerald-400 font-mono">$1</span>');
                         return (
                           <div key={j} className="flex gap-3 text-xs text-slate-400 leading-relaxed font-mono">
                             <span className="text-slate-600 select-none">❯</span>
                             <span dangerouslySetInnerHTML={{ __html: highlighted }} />
                           </div>
                         )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </main>

    </div>
  );
}
