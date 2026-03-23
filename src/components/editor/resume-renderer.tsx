'use client';

import type { ResumeData, ThemeType } from '@/types/resume';
import { Badge } from '@/components/ui/badge';
import {
  Mail, Phone, Linkedin, Github, Globe, MapPin,
  Briefcase, GraduationCap, Code2, FolderOpen
} from 'lucide-react';
import { BentoTheme } from '@/themes/bento/bento-theme';
import { JourneyTheme } from '@/themes/journey/journey-theme';
import { TerminalTheme } from '@/themes/terminal/terminal-theme';
import { KPITheme } from '@/components/themes/kpi';
import { FaangTheme } from '@/components/themes/faang';

/**
 * Simple renderer that displays resume data.
 * Themes (Bento, Journey, Terminal) will be built in Tasks 8-10.
 * This acts as a fallback / default renderer.
 */
export function ResumeRenderer({
  data,
  theme,
}: {
  data: ResumeData;
  theme: ThemeType;
}) {
  if (theme === 'bento') {
    return <BentoTheme data={data} />;
  }
  
  if (theme === 'journey') {
    return <JourneyTheme data={data} />;
  }

  if (theme === 'terminal') {
    return <TerminalTheme data={data} />;
  }

  if (theme === 'kpi') {
    return <KPITheme data={data} />;
  }

  if (theme === 'faang') {
    return <FaangTheme data={data} />;
  }

  // Fallback / default renderer
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Header */}
        <header className="mb-8 pb-6 border-b border-neutral-800">
          <h1 className="text-3xl font-bold">{data.name}</h1>
          <p className="text-blue-400 mt-1">{data.title}</p>
          {data.summary && (
            <p className="text-neutral-400 text-sm mt-4 leading-relaxed max-w-2xl">
              {data.summary}
            </p>
          )}

          {/* Contact */}
          {Object.values(data.contact).some(Boolean) && (
            <div className="flex flex-wrap gap-4 mt-4">
              {data.contact.email && (
                <a href={`mailto:${data.contact.email}`} className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors">
                  <Mail className="h-3 w-3" /> {data.contact.email}
                </a>
              )}
              {data.contact.phone && (
                <span className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <Phone className="h-3 w-3" /> {data.contact.phone}
                </span>
              )}
              {data.contact.linkedin && (
                <a href={data.contact.linkedin.startsWith('http') ? data.contact.linkedin : `https://${data.contact.linkedin}`} target="_blank" rel="noopener" className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors">
                  <Linkedin className="h-3 w-3" /> LinkedIn
                </a>
              )}
              {data.contact.github && (
                <a href={data.contact.github.startsWith('http') ? data.contact.github : `https://${data.contact.github}`} target="_blank" rel="noopener" className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors">
                  <Github className="h-3 w-3" /> GitHub
                </a>
              )}
              {data.contact.portfolio && (
                <a href={data.contact.portfolio.startsWith('http') ? data.contact.portfolio : `https://${data.contact.portfolio}`} target="_blank" rel="noopener" className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors">
                  <Globe className="h-3 w-3" /> Portfolio
                </a>
              )}
              {data.contact.location && (
                <span className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <MapPin className="h-3 w-3" /> {data.contact.location}
                </span>
              )}
            </div>
          )}
        </header>

        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4">
              <Briefcase className="h-4 w-4 text-blue-400" /> Experience
            </h2>
            <div className="space-y-5">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-sm font-medium text-white">{exp.role}</span>
                      <span className="text-neutral-500 text-sm ml-2">@ {exp.company}</span>
                    </div>
                    <span className="text-xs text-neutral-600 shrink-0 ml-4">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  {exp.bullets.filter(Boolean).length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.bullets.filter(Boolean).map((b, j) => (
                        <li key={j} className="text-sm text-neutral-400 flex gap-2">
                          <span className="text-neutral-600 shrink-0">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {(data.skills.languages.length > 0 || data.skills.frameworks.length > 0 || data.skills.tools.length > 0) && (
          <section className="mb-8">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4">
              <Code2 className="h-4 w-4 text-blue-400" /> Skills
            </h2>
            <div className="space-y-3">
              {data.skills.languages.length > 0 && (
                <div>
                  <span className="text-xs text-neutral-500">Languages:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {data.skills.languages.map((s, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {data.skills.frameworks.length > 0 && (
                <div>
                  <span className="text-xs text-neutral-500">Frameworks:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {data.skills.frameworks.map((s, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {data.skills.tools.length > 0 && (
                <div>
                  <span className="text-xs text-neutral-500">Tools:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {data.skills.tools.map((s, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section className="mb-8">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4">
              <GraduationCap className="h-4 w-4 text-blue-400" /> Education
            </h2>
            {data.education.map((edu, i) => (
              <div key={i} className="mb-3">
                <p className="text-sm text-white">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                <p className="text-xs text-neutral-500">{edu.institution} · {edu.year}</p>
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section className="mb-8">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4">
              <FolderOpen className="h-4 w-4 text-blue-400" /> Projects
            </h2>
            {data.projects.map((proj, i) => (
              <div key={i} className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-white">{proj.name}</span>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noopener" className="text-xs text-blue-400 hover:underline">↗</a>
                  )}
                </div>
                {(proj.bullets && proj.bullets.length > 0) ? (
                  <ul className="mt-1 space-y-1">
                    {proj.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="text-sm text-neutral-400 flex gap-2">
                        <span className="text-neutral-600 shrink-0">•</span><span>{b}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-neutral-400 mt-0.5">{proj.description}</p>
                )}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {proj.tech.map((t, j) => (
                    <Badge key={j} variant="secondary" className="text-[10px] px-1.5 py-0">{t}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-neutral-800 text-center">
          <p className="text-xs text-neutral-600">
            Built with <a href="/" className="text-blue-400 hover:underline">ResumeVerse</a>
          </p>
        </footer>
      </div>
    </div>
  );
}
