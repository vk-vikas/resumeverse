'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dropzone } from '@/components/upload/dropzone';
import { Sparkles, Upload, Share2, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import type { ResumeData } from '@/types/resume';
import { UserMenu } from '@/components/layout/user-menu';
import { useAuth } from '@/hooks/use-auth';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [parsedData, setParsedData] = useState<ResumeData | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setParsedData(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to parse resume');
      }

      setParsedData(result.data);
      // Store parsed data for the editor to pick up
      sessionStorage.setItem('resumeverse-parsed-data', JSON.stringify(result.data));
      toast.success('Resume parsed successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <header className="absolute top-0 w-full p-4 flex justify-end z-50">
        <UserMenu />
      </header>

      <div className="px-4 py-20 mx-auto max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="mb-2">
            <Sparkles className="mr-1 h-3 w-3" />
            AI-Powered
          </Badge>
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
            Resume<span className="text-blue-500">Verse</span>
          </h1>
          <p className="text-lg text-neutral-400 leading-relaxed">
            Transform your PDF/DOCX resume into a beautiful, interactive,
            shareable website — powered by AI.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Card className="bg-neutral-900/50 border-neutral-800">
              <CardContent className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-300">
                <Upload className="h-4 w-4 text-blue-400" />
                Upload Resume
              </CardContent>
            </Card>
            <Card className="bg-neutral-900/50 border-neutral-800">
              <CardContent className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-300">
                <Sparkles className="h-4 w-4 text-purple-400" />
                AI Transforms
              </CardContent>
            </Card>
            <Card className="bg-neutral-900/50 border-neutral-800">
              <CardContent className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-300">
                <Share2 className="h-4 w-4 text-green-400" />
                Share Everywhere
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upload Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
              Upload Your Resume
            </h2>
            <Dropzone onFileSelect={handleFileSelect} isLoading={isLoading} />
          </div>
          
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 border-t border-neutral-800"></div>
            <span className="text-xs text-neutral-500 font-medium uppercase tracking-widest">OR</span>
            <div className="flex-1 border-t border-neutral-800"></div>
          </div>
          
          <Button 
            variant="outline" 
            size="lg"
            className="w-full border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900"
            onClick={() => {
              if (isAuthenticated) {
                router.push('/editor/new');
              } else {
                toast.info('Please sign in to start creating your resume');
                router.push('/login?next=/editor/new');
              }
            }}
          >
            Start from scratch
          </Button>
        </div>

        {/* Parsed Result */}
        {parsedData && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <h2 className="text-lg font-semibold text-white">
                Parsed Successfully
              </h2>
            </div>

            {/* Name & Title */}
            <Card className="bg-neutral-900/50 border-neutral-800">
              <CardContent className="p-5 space-y-1">
                <h3 className="text-xl font-bold text-white">{parsedData.name}</h3>
                <p className="text-neutral-400">{parsedData.title}</p>
                {parsedData.summary && (
                  <p className="text-sm text-neutral-500 pt-2 leading-relaxed">{parsedData.summary}</p>
                )}
              </CardContent>
            </Card>

            {/* Sections */}
            {parsedData.experience.length > 0 && (
              <CollapsibleSection
                title={`Experience (${parsedData.experience.length})`}
                isOpen={expandedSections['experience']}
                onToggle={() => toggleSection('experience')}
              >
                {parsedData.experience.map((exp, i) => (
                  <div key={i} className="py-3 border-b border-neutral-800 last:border-0">
                    <p className="text-sm font-medium text-white">{exp.role}</p>
                    <p className="text-xs text-neutral-400">{exp.company} · {exp.startDate} – {exp.endDate}</p>
                    <ul className="mt-2 space-y-1">
                      {exp.bullets.map((b, j) => (
                        <li key={j} className="text-xs text-neutral-500 flex gap-2">
                          <span className="text-neutral-600 shrink-0">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CollapsibleSection>
            )}

            {(parsedData.skills.languages.length > 0 || parsedData.skills.frameworks.length > 0 || parsedData.skills.tools.length > 0) && (
              <CollapsibleSection
                title="Skills"
                isOpen={expandedSections['skills']}
                onToggle={() => toggleSection('skills')}
              >
                <div className="space-y-3">
                  {parsedData.skills.languages.length > 0 && (
                    <SkillGroup label="Languages" items={parsedData.skills.languages} />
                  )}
                  {parsedData.skills.frameworks.length > 0 && (
                    <SkillGroup label="Frameworks" items={parsedData.skills.frameworks} />
                  )}
                  {parsedData.skills.tools.length > 0 && (
                    <SkillGroup label="Tools" items={parsedData.skills.tools} />
                  )}
                </div>
              </CollapsibleSection>
            )}

            {parsedData.education.length > 0 && (
              <CollapsibleSection
                title={`Education (${parsedData.education.length})`}
                isOpen={expandedSections['education']}
                onToggle={() => toggleSection('education')}
              >
                {parsedData.education.map((edu, i) => (
                  <div key={i} className="py-2">
                    <p className="text-sm font-medium text-white">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                    <p className="text-xs text-neutral-400">{edu.institution} · {edu.year}</p>
                  </div>
                ))}
              </CollapsibleSection>
            )}

            {parsedData.projects.length > 0 && (
              <CollapsibleSection
                title={`Projects (${parsedData.projects.length})`}
                isOpen={expandedSections['projects']}
                onToggle={() => toggleSection('projects')}
              >
                {parsedData.projects.map((proj, i) => (
                  <div key={i} className="py-2">
                    <p className="text-sm font-medium text-white">{proj.name}</p>
                    <p className="text-xs text-neutral-500">{proj.description}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {proj.tech.map((t, j) => (
                        <Badge key={j} variant="secondary" className="text-[10px] px-1.5 py-0">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CollapsibleSection>
            )}

            {/* Action button */}
            <div className="pt-4">
              <Button
                size="lg"
                className="w-full text-base"
                onClick={() => {
                  if (isAuthenticated) {
                    router.push('/editor/new');
                  } else {
                    toast.info('Please sign in to continue editing your resume');
                    router.push('/login?next=/editor/new');
                  }
                }}
              >
                Continue to Editor →
              </Button>
            </div>
          </div>
        )}

        {/* Footer tagline */}
        <p className="text-center text-sm text-neutral-600 pt-4">
          3 stunning themes · Shareable links · View analytics · $0 cost
        </p>
      </div>
    </div>
  );
}

// --- Helper Components ---

function CollapsibleSection({
  title,
  isOpen = false,
  onToggle,
  children,
}: {
  title: string;
  isOpen?: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <span className="text-sm font-medium text-neutral-300">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-neutral-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-neutral-500" />
        )}
      </button>
      {isOpen && <CardContent className="px-4 pb-4 pt-0">{children}</CardContent>}
    </Card>
  );
}

function SkillGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-medium text-neutral-400 mb-1">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((skill, i) => (
          <Badge key={i} variant="secondary" className="text-xs">
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
}
