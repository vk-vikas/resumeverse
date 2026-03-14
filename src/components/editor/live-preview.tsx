'use client';

import { useEditor } from './editor-context';
import { Badge } from '@/components/ui/badge';
import {
  Mail, Phone, Linkedin, Github, Globe, MapPin,
  Briefcase, GraduationCap, Code2, FolderOpen
} from 'lucide-react';

/**
 * Live preview that renders the resume data in a simplified format.
 * This will be replaced by actual theme renderers in Task 8.
 */
export function LivePreview() {
  const { data, theme } = useEditor();

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 min-h-full overflow-y-auto">
      {/* Theme label */}
      <div className="mb-6 flex items-center gap-2">
        <Badge variant="outline" className="text-[10px] border-neutral-700 text-neutral-500">
          Preview: {theme.charAt(0).toUpperCase() + theme.slice(1)} Theme
        </Badge>
      </div>

      {/* Header */}
      {data.name && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">{data.name}</h1>
          {data.title && <p className="text-blue-400 text-sm mt-1">{data.title}</p>}
          {data.summary && (
            <p className="text-neutral-400 text-sm mt-3 leading-relaxed">{data.summary}</p>
          )}
        </div>
      )}

      {/* Contact */}
      {Object.values(data.contact).some(Boolean) && (
        <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b border-neutral-800">
          {data.contact.email && <ContactPill icon={<Mail className="h-3 w-3" />} value={data.contact.email} />}
          {data.contact.phone && <ContactPill icon={<Phone className="h-3 w-3" />} value={data.contact.phone} />}
          {data.contact.linkedin && <ContactPill icon={<Linkedin className="h-3 w-3" />} value={data.contact.linkedin} />}
          {data.contact.github && <ContactPill icon={<Github className="h-3 w-3" />} value={data.contact.github} />}
          {data.contact.portfolio && <ContactPill icon={<Globe className="h-3 w-3" />} value={data.contact.portfolio} />}
          {data.contact.location && <ContactPill icon={<MapPin className="h-3 w-3" />} value={data.contact.location} />}
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <PreviewSection icon={<Briefcase className="h-4 w-4" />} title="Experience">
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-4 last:mb-0">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-medium text-white">{exp.role || 'Role'}</span>
                  <span className="text-neutral-500 text-sm ml-2">{exp.company || 'Company'}</span>
                </div>
                <span className="text-xs text-neutral-600">
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1.5 space-y-0.5">
                  {exp.bullets.filter(Boolean).map((b, j) => (
                    <li key={j} className="text-xs text-neutral-400 flex gap-2">
                      <span className="text-neutral-600 shrink-0">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </PreviewSection>
      )}

      {/* Skills */}
      {(data.skills.languages.length > 0 || data.skills.frameworks.length > 0 || data.skills.tools.length > 0) && (
        <PreviewSection icon={<Code2 className="h-4 w-4" />} title="Skills">
          <div className="flex flex-wrap gap-1.5">
            {[...data.skills.languages, ...data.skills.frameworks, ...data.skills.tools].map(
              (skill, i) => (
                <Badge key={i} variant="secondary" className="text-[10px]">
                  {skill}
                </Badge>
              )
            )}
          </div>
        </PreviewSection>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <PreviewSection icon={<GraduationCap className="h-4 w-4" />} title="Education">
          {data.education.map((edu, i) => (
            <div key={i} className="mb-2 last:mb-0">
              <p className="text-sm text-white">
                {edu.degree || 'Degree'}
                {edu.field ? ` in ${edu.field}` : ''}
              </p>
              <p className="text-xs text-neutral-500">
                {edu.institution || 'Institution'} · {edu.year}
              </p>
            </div>
          ))}
        </PreviewSection>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <PreviewSection icon={<FolderOpen className="h-4 w-4" />} title="Projects">
          {data.projects.map((proj, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <p className="text-sm font-medium text-white">{proj.name || 'Project'}</p>
              {proj.description && (
                <p className="text-xs text-neutral-500 mt-0.5">{proj.description}</p>
              )}
              {proj.tech.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {proj.tech.map((t, j) => (
                    <Badge key={j} variant="secondary" className="text-[10px] px-1.5 py-0">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </PreviewSection>
      )}

      {/* Empty state */}
      {!data.name && !data.title && data.experience.length === 0 && (
        <div className="flex items-center justify-center h-64 text-neutral-600 text-sm">
          Start editing to see your resume preview
        </div>
      )}
    </div>
  );
}

function ContactPill({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-neutral-400">
      <span className="text-neutral-600">{icon}</span>
      {value}
    </span>
  );
}

function PreviewSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-blue-400">{icon}</span>
        <h2 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">{title}</h2>
      </div>
      {children}
    </div>
  );
}
