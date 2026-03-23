import type { ResumeData } from '@/types/resume';

export function FaangTheme({ data }: { data: ResumeData }) {
  return (
    <div className="bg-slate-200/50 min-h-screen w-full flex justify-center py-8 sm:py-12 px-4 overflow-x-auto print:bg-white print:p-0 print:m-0">
      {/* 8.5 x 11 exact replica container (816px by 1056px at 96dpi) */}
      <div 
        className="w-[8.5in] min-h-[11in] shrink-0 bg-white text-black shadow-2xl ring-1 ring-slate-900/5 print:shadow-none print:ring-0 mx-auto box-border"
        style={{ padding: '0.75in', fontFamily: '"Times New Roman", Times, serif' }}
      >
        
        {/* HEADER */}
        <header className="text-center mb-6">
          <h1 className="text-[24pt] font-normal leading-tight mb-1">{data.name}</h1>
          <div className="text-[10pt] flex justify-center flex-wrap gap-x-2 gap-y-1">
            {data.contact?.phone && <span>{data.contact.phone}</span>}
            {data.contact?.phone && (data.contact?.email || data.contact?.linkedin || data.contact?.github) && <span>|</span>}
            
            {data.contact?.email && <a href={`mailto:${data.contact.email}`} className="text-blue-600 underline hover:text-blue-800">{data.contact.email}</a>}
            {data.contact?.email && (data.contact?.linkedin || data.contact?.github) && <span>|</span>}
            
            {data.contact?.linkedin && <a href={data.contact.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 underline hover:text-blue-800">{data.contact.linkedin.replace('https://www.', '').replace('https://', '').replace(/\/$/, '')}</a>}
            {data.contact?.linkedin && data.contact?.github && <span>|</span>}
            
            {data.contact?.github && <a href={data.contact.github} target="_blank" rel="noreferrer" className="text-blue-600 underline hover:text-blue-800">{data.contact.github.replace('https://www.', '').replace('https://', '').replace(/\/$/, '')}</a>}
          </div>
        </header>

        {/* EDUCATION */}
        {data.education && data.education.length > 0 && (
          <section className="mb-3">
            <h2 className="text-[12pt] font-semibold border-b border-black uppercase pb-0.5 mb-2">Education</h2>
            {data.education.map((ed, i) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between items-baseline font-semibold">
                  <h3>{ed.institution}</h3>
                  <span className="font-normal">{ed.year}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <div className="italic">{ed.degree}</div>
                  {ed.gpa && <span>GPA: {ed.gpa}</span>}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* EXPERIENCE */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-3">
            <h2 className="text-[12pt] font-semibold border-b border-black uppercase pb-0.5 mb-2">Experience</h2>
            {data.experience.map((exp, i) => (
              <div key={i} className="mb-3 pl-1">
                <div className="flex justify-between items-baseline font-semibold">
                  <h3>{exp.role}</h3>
                  <span className="font-normal">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="italic mb-1">{exp.company}</div>
                <ul className="list-disc list-outside ml-5 space-y-1 mt-1">
                  {exp.bullets?.map((bullet, j) => (
                    <li key={j} className="pl-1 leading-snug text-[10.5pt]">
                      {/* Bold numbers for ATS buzzwords natively */}
                      {(() => {
                        const parts = bullet.split(/(\$?\d+(?:,\d{3})*(?:\.\d+)?[kKmMbB]?\+?%?|\d+[xX])/g);
                        return parts.map((part, pid) => (
                          part.match(/^(\$?\d+(?:,\d{3})*(?:\.\d+)?[kKmMbB]?\+?%?|\d+[xX])$/) 
                            ? <strong key={pid}>{part}</strong> 
                            : <span key={pid}>{part}</span>
                        ));
                      })()}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* PROJECTS */}
        {data.projects && data.projects.length > 0 && (
          <section className="mb-3">
            <h2 className="text-[12pt] font-semibold border-b border-black uppercase pb-0.5 mb-2">Projects</h2>
            {data.projects.map((proj, i) => (
              <div key={i} className="mb-2 pl-1">
                <div className="flex items-baseline gap-2 font-semibold">
                  <h3>{proj.name}</h3>
                  <span className="font-normal">|</span>
                  <span className="italic font-normal">{proj.tech?.join(', ')}</span>
                  {proj.link && (
                    <>
                      <span className="font-normal">|</span>
                      <a href={proj.link} target="_blank" rel="noreferrer" className="font-normal text-blue-600 underline hover:text-blue-800 text-[10pt]">Link</a>
                    </>
                  )}
                </div>
                {(proj.bullets && proj.bullets.length > 0) ? (
                  <ul className="list-disc list-outside ml-5 space-y-1 mt-1">
                    {proj.bullets.map((bullet, j) => (
                      <li key={j} className="pl-1 leading-snug text-[10.5pt]">{bullet}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-0.5 leading-snug text-[10.5pt]">
                     {proj.description}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* SKILLS */}
        {data.skills && (data.skills.languages?.length > 0 || data.skills.frameworks?.length > 0 || data.skills.tools?.length > 0) && (
          <section>
            <h2 className="text-[12pt] font-semibold border-b border-black uppercase pb-0.5 mb-2">Technical Skills</h2>
            <div className="pl-1 space-y-1">
              {data.skills.languages?.length > 0 && (
                <div><strong className="w-24 inline-block">Languages:</strong> {data.skills.languages.join(', ')}</div>
              )}
              {data.skills.frameworks?.length > 0 && (
                <div><strong className="w-24 inline-block">Frameworks:</strong> {data.skills.frameworks.join(', ')}</div>
              )}
              {data.skills.tools?.length > 0 && (
                <div><strong className="w-24 inline-block">Developer Tools:</strong> {data.skills.tools.join(', ')}</div>
              )}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
