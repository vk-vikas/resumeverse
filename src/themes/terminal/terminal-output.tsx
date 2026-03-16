'use client';

import type { ResumeData } from '@/types/resume';
import { TypingEffect } from './typing-effect';

export interface CommandLog {
  id: string;
  command: string;
  time: Date;
}

interface TerminalOutputProps {
  cmd: string;
  data: ResumeData;
  isRecent?: boolean; // If recent, animate typing
}

export function TerminalOutput({ cmd, data, isRecent = false }: TerminalOutputProps) {
  const input = cmd.trim().toLowerCase();
  
  // Format dates helper
  const formatDate = (dateString?: string) => dateString || 'Present';

  // 1. Help Command
  if (input === 'help') {
    return (
      <div className="text-neutral-300 space-y-1 my-2">
        <p className="text-[#00ff41] font-bold mb-2">Available commands:</p>
        <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
          <span className="text-[#00ff41]">about</span><span>Show name, title, summary (also 'whoami')</span>
          <span className="text-[#00ff41]">experience</span><span>List work experience</span>
          <span className="text-[#00ff41]">skills</span><span>Display capabilities table</span>
          <span className="text-[#00ff41]">education</span><span>Show academic history</span>
          <span className="text-[#00ff41]">projects</span><span>List open-source/personal projects</span>
          <span className="text-[#00ff41]">contact</span><span>Show clickable links and details</span>
          <span className="text-[#00ff41]">neofetch</span><span>Display system summary</span>
          <span className="text-[#00ff41]">clear</span><span>Clear the terminal screen</span>
        </div>
      </div>
    );
  }

  // 2. About / Whoami
  if (input === 'about' || input === 'whoami') {
    return (
      <div className="my-2 space-y-2">
        <p className="text-[#00ff41] font-bold text-lg">{data.name}</p>
        <p className="text-neutral-400">{data.title}</p>
        {isRecent ? (
          <TypingEffect text={data.summary || 'No summary available.'} className="text-neutral-300 block mt-2" speed={15} />
        ) : (
          <p className="text-neutral-300 mt-2">{data.summary || 'No summary available.'}</p>
        )}
      </div>
    );
  }

  // 3. Experience
  if (input === 'experience' || input === 'ls experience') {
    if (!data.experience || data.experience.length === 0) {
      return <p className="text-neutral-400 my-2">No experience records found.</p>;
    }
    return (
      <div className="my-2 text-sm">
        <p className="text-[#00ff41] font-bold mb-2">Work History:</p>
        <div className="border border-[#00ff41]/30 rounded p-2 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#00ff41]/30">
                <th className="py-1 pr-4 text-[#00ff41]">Company</th>
                <th className="py-1 pr-4 text-[#00ff41]">Role</th>
                <th className="py-1">Duration</th>
              </tr>
            </thead>
            <tbody>
              {data.experience.map((exp: any, i: number) => (
                <tr key={i} className="border-b border-neutral-800/50 last:border-0 hover:bg-[#00ff41]/5 transition-colors">
                  <td className="py-2 pr-4 font-semibold text-white">{exp.company}</td>
                  <td className="py-2 pr-4 text-neutral-300">{exp.role}</td>
                  <td className="py-2 text-neutral-400 whitespace-nowrap">
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-neutral-500 mt-2 italic text-xs">Run <span className="text-[#00ff41]">experience [company]</span> (soon) to view details.</p>
      </div>
    );
  }

  // 4. Skills
  if (input === 'skills') {
    const allSkills = [
      { category: 'Languages', items: data.skills?.languages || [] },
      { category: 'Frameworks', items: data.skills?.frameworks || [] },
      { category: 'Tools', items: data.skills?.tools || [] },
    ].filter(g => g.items.length > 0);

    if (allSkills.length === 0) {
      return <p className="text-neutral-400 my-2">No skills indexed.</p>;
    }

    return (
      <div className="my-2 space-y-3">
        {allSkills.map((group, i) => (
          <div key={i}>
            <span className="text-[#00ff41] font-bold mr-2">[{group.category}]</span>
            <span className="text-neutral-300">{group.items.join(', ')}</span>
          </div>
        ))}
      </div>
    );
  }

  // 5. Education
  if (input === 'education') {
    if (!data.education || data.education.length === 0) {
      return <p className="text-neutral-400 my-2">No education records found.</p>;
    }
    return (
      <div className="my-2 space-y-4">
        {data.education.map((edu: any, i: number) => (
          <div key={i}>
            <p className="text-white font-semibold">
              <span className="text-[#00ff41] mr-2">➜</span>
              {edu.degree} {edu.field ? `in ${edu.field}` : ''}
            </p>
            <p className="text-neutral-400 pl-5">
              {edu.institution} | {edu.year}
            </p>
          </div>
        ))}
      </div>
    );
  }

  // 6. Projects
  if (input === 'projects') {
    if (!data.projects || data.projects.length === 0) {
      return <p className="text-neutral-400 my-2">No public projects documented.</p>;
    }
    return (
      <div className="my-2 space-y-4">
        {data.projects.map((proj: any, i: number) => (
          <div key={i} className="pl-3 border-l-2 border-[#00ff41]/50">
            <div className="flex items-center gap-2">
              <span className="text-[#00ff41] font-bold">{proj.name}</span>
              {proj.link && (
                <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">
                  [Link]
                </a>
              )}
            </div>
            <p className="text-neutral-300 my-1 text-sm">{proj.description}</p>
            {proj.tech && proj.tech.length > 0 && (
              <p className="text-xs text-neutral-500">
                Tech: {proj.tech.join(' • ')}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  // 7. Contact
  if (input === 'contact') {
    const contact = data.contact;
    if (!contact || Object.keys(contact).length === 0) {
      return <p className="text-neutral-400 my-2">No contact information provided.</p>;
    }

    return (
      <div className="my-2 border border-[#00ff41]/30 p-4 rounded bg-[#0d1117]/50 max-w-md shadow-[0_0_15px_rgba(0,255,65,0.05)]">
        <p className="text-[#00ff41] font-bold mb-3 border-b border-[#00ff41]/30 pb-1">COMMUNICATION LINKS</p>
        <div className="space-y-2 text-sm">
          {contact.email && (
            <div className="grid grid-cols-[80px_1fr]">
              <span className="text-neutral-500">Email:</span>
              <a href={`mailto:${contact.email}`} className="text-blue-400 hover:text-blue-300 hover:underline">{contact.email}</a>
            </div>
          )}
          {contact.phone && (
            <div className="grid grid-cols-[80px_1fr]">
              <span className="text-neutral-500">Phone:</span>
              <span className="text-white">{contact.phone}</span>
            </div>
          )}
          {contact.location && (
            <div className="grid grid-cols-[80px_1fr]">
              <span className="text-neutral-500">Location:</span>
              <span className="text-white">{contact.location}</span>
            </div>
          )}
          {contact.linkedin && (
            <div className="grid grid-cols-[80px_1fr]">
              <span className="text-neutral-500">LinkedIn:</span>
              <a href={contact.linkedin.startsWith('http') ? contact.linkedin : `https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline">
                Profile ↗
              </a>
            </div>
          )}
          {contact.github && (
            <div className="grid grid-cols-[80px_1fr]">
              <span className="text-neutral-500">GitHub:</span>
              <a href={contact.github.startsWith('http') ? contact.github : `https://${contact.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline">
                Profile ↗
              </a>
            </div>
          )}
          {contact.portfolio && (
            <div className="grid grid-cols-[80px_1fr]">
              <span className="text-neutral-500">Website:</span>
              <a href={contact.portfolio.startsWith('http') ? contact.portfolio : `https://${contact.portfolio}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline">
                {contact.portfolio} ↗
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 8. Neofetch / Easter Egg
  if (input === 'neofetch') {
    const OS = typeof window !== 'undefined' ? navigator.platform : 'Unknown';
    const numExp = data.experience?.length || 0;
    const numProj = data.projects?.length || 0;
    
    let totalSkills = 0;
    if (data.skills) {
      totalSkills += (data.skills.languages?.length || 0);
      totalSkills += (data.skills.frameworks?.length || 0);
      totalSkills += (data.skills.tools?.length || 0);
    }

    return (
      <div className="my-3 flex flex-col md:flex-row gap-6 items-start">
        <div className="text-[#00ff41] font-mono text-xs leading-none hidden sm:block opacity-80 select-none">
          {`
   .---.
  /     \\
  \\.@-@./
  /  -  \\
 |       |
 \\_______/
          `}
        </div>
        <div className="text-sm">
          <p className="text-[#00ff41] font-bold mb-1">{data.name?.toLowerCase().replace(/\s+/g, '')}@resumeverse</p>
          <p className="text-neutral-500 mb-2">-------------------</p>
          <div className="grid grid-cols-[100px_1fr] gap-y-1">
            <span className="text-[#00ff41]">OS:</span><span className="text-white">ResumeVerse OS x86_64</span>
            <span className="text-[#00ff41]">Host:</span><span className="text-white">{OS}</span>
            <span className="text-[#00ff41]">Uptime:</span><span className="text-white">Lifetime learner</span>
            <span className="text-[#00ff41]">Packages:</span><span className="text-white">{totalSkills} (skills)</span>
            <span className="text-[#00ff41]">Shell:</span><span className="text-white">zsh 5.8 </span>
            <span className="text-[#00ff41]">Resolution:</span><span className="text-white">100% ambition</span>
            <span className="text-[#00ff41]">Experience:</span><span className="text-white">{numExp} roles</span>
            <span className="text-[#00ff41]">Projects:</span><span className="text-white">{numProj} shipped</span>
          </div>
          <div className="mt-3 flex gap-1">
            <div className="h-4 w-4 bg-black"></div>
            <div className="h-4 w-4 bg-red-500"></div>
            <div className="h-4 w-4 bg-green-500"></div>
            <div className="h-4 w-4 bg-yellow-500"></div>
            <div className="h-4 w-4 bg-blue-500"></div>
            <div className="h-4 w-4 bg-purple-500"></div>
            <div className="h-4 w-4 bg-cyan-500"></div>
            <div className="h-4 w-4 bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  // 9. Unknown command but trying to execute specific history (bonus logic handler)
  if (input.startsWith('experience ') || input.startsWith('cat experience/')) {
    const rawTarget = input.replace('cat experience/', '').replace('experience ', '').replace('.txt', '');
    return <p className="text-neutral-400 my-2 text-sm italic">Showing specific experience details for "{rawTarget}" is under construction. Please use <span className="text-[#00ff41]">experience</span>.</p>;
  }

  // Handle empty input
  if (!input) {
    return null;
  }

  // Unknown Command
  return (
    <p className="text-red-400 my-2">
      bash: {input}: command not found. Type <span className="text-white font-bold">help</span> for available commands.
    </p>
  );
}
