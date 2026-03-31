'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dropzone } from '@/components/upload/dropzone';
import { Sparkles, Upload, Share2, CheckCircle2, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { toast } from 'sonner';
import type { ResumeData } from '@/types/resume';
import { UserMenu } from '@/components/layout/user-menu';
import { useAuth } from '@/hooks/use-auth';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ResumeData | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const handleFileSelect = (file: File) => {
    setStagedFile(file);
    setParsedData(null);
  };

  const processAIParsing = async (file: File) => {
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

  const processRawUpload = async (file: File) => {
    if (!isAuthenticated) {
      toast.info('Please sign in to host a tracked PDF');
      router.push('/login?next=/upload');
      return;
    }
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/upload-raw', { method: 'POST', body: formData });
      const json = await res.json();
      
      if (!res.ok) throw new Error(json.error || 'Failed to upload document');
      
      toast.success('PDF Hosted Successfully!');
      router.push('/dashboard');
    } catch(err: any) {
      toast.error(err.message || 'Something went wrong');
      setIsLoading(false);
    }
  };

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
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
          <h1 className="text-5xl font-bold tracking-tight text-[#1A1A1A] sm:text-6xl">
            Resume<span className="text-[#5B4FC4]">Verse</span>
          </h1>
          <p className="text-lg text-[#6B6560] leading-relaxed">
            Transform your PDF/DOCX resume into a beautiful, interactive,
            shareable website — powered by AI.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Card className="bg-white border-[#E8E5DF]">
              <CardContent className="flex items-center gap-2 px-4 py-2 text-sm text-[#6B6560]">
                <Upload className="h-4 w-4 text-[#5B4FC4]" />
                Upload Resume
              </CardContent>
            </Card>
            <Card className="bg-white border-[#E8E5DF]">
              <CardContent className="flex items-center gap-2 px-4 py-2 text-sm text-[#6B6560]">
                <Sparkles className="h-4 w-4 text-[#8B5CF6]" />
                AI Transforms
              </CardContent>
            </Card>
            <Card className="bg-white border-[#E8E5DF]">
              <CardContent className="flex items-center gap-2 px-4 py-2 text-sm text-[#6B6560]">
                <Share2 className="h-4 w-4 text-[#3A8D5C]" />
                Share Everywhere
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upload Section */}
        {(!stagedFile || parsedData) && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-[#9C9590] uppercase tracking-wider">
                Upload Your Resume
              </h2>
              <Dropzone onFileSelect={handleFileSelect} isLoading={isLoading} />
            </div>
          
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 border-t border-[#E8E5DF]"></div>
            <span className="text-xs text-[#9C9590] font-medium uppercase tracking-widest">OR</span>
            <div className="flex-1 border-t border-[#E8E5DF]"></div>
          </div>
          
          <Button 
            variant="outline" 
            size="lg"
            className="w-full border-[#E8E5DF] text-[#6B6560] hover:text-[#1A1A1A] hover:bg-[#F5F3EF]"
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
        )}

        {/* Branching Options: AI vs Raw PDF */}
        {stagedFile && !isLoading && !parsedData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h2 className="text-xl font-bold text-[#1A1A1A] text-center">How would you like to build your portfolio?</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card 
                  className="bg-white border-[#5B4FC4]/30 cursor-pointer hover:bg-[#F0EDFA] transition-colors" 
                  onClick={() => processAIParsing(stagedFile)}
                >
                  <CardContent className="p-6 text-center space-y-3">
                     <Sparkles className="h-8 w-8 text-[#5B4FC4] mx-auto" />
                     <h3 className="font-semibold text-[#1A1A1A]">Extract & Build (AI)</h3>
                     <p className="text-xs text-[#6B6560]">Parse your document into an interactive, customizable web dashboard.</p>
                  </CardContent>
                </Card>

                <Card 
                  className="bg-white border-[#3A8D5C]/30 cursor-pointer hover:bg-[#EDF7F1] transition-colors" 
                  onClick={() => processRawUpload(stagedFile)}
                >
                  <CardContent className="p-6 text-center space-y-3">
                     <Eye className="h-8 w-8 text-[#3A8D5C] mx-auto" />
                     <h3 className="font-semibold text-[#1A1A1A]">Host Tracked PDF</h3>
                     <p className="text-xs text-[#6B6560]">Bypass AI entirely. Host your raw PDF natively to get an instant view-tracking link.</p>
                  </CardContent>
                </Card>
             </div>
             <Button variant="ghost" className="w-full text-[#9C9590] hover:text-[#1A1A1A]" onClick={() => setStagedFile(null)}>
               Cancel and select a different file
             </Button>
          </div>
        )}

        {/* Parsed Result */}
        {parsedData && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#3A8D5C]" />
              <h2 className="text-lg font-semibold text-[#1A1A1A]">
                Parsed Successfully
              </h2>
            </div>

            {/* Name & Title */}
            <Card className="bg-white border-[#E8E5DF]">
              <CardContent className="p-5 space-y-1">
                <h3 className="text-xl font-bold text-[#1A1A1A]">{parsedData.name}</h3>
                <p className="text-[#6B6560]">{parsedData.title}</p>
                {parsedData.summary && (
                  <p className="text-sm text-[#9C9590] pt-2 leading-relaxed">{parsedData.summary}</p>
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
                  <div key={i} className="py-3 border-b border-[#E8E5DF] last:border-0">
                    <p className="text-sm font-medium text-[#1A1A1A]">{exp.role}</p>
                    <p className="text-xs text-[#6B6560]">{exp.company} · {exp.startDate} – {exp.endDate}</p>
                    <ul className="mt-2 space-y-1">
                      {exp.bullets.map((b, j) => (
                        <li key={j} className="text-xs text-[#9C9590] flex gap-2">
                          <span className="text-[#9C9590] shrink-0">•</span>
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
                    <p className="text-sm font-medium text-[#1A1A1A]">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                    <p className="text-xs text-[#6B6560]">{edu.institution} · {edu.year}</p>
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
                    <p className="text-sm font-medium text-[#1A1A1A]">{proj.name}</p>
                    {(proj.bullets && proj.bullets.length > 0) ? (
                      <ul className="text-xs text-[#9C9590] list-disc pl-4 space-y-0.5 mt-0.5">
                        {proj.bullets.map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                      </ul>
                    ) : (
                      <p className="text-xs text-[#9C9590]">{proj.description}</p>
                    )}
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
        <p className="text-center text-sm text-[#9C9590] pt-4">
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
    <Card className="bg-white border-[#E8E5DF]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <span className="text-sm font-medium text-[#1A1A1A]">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-[#9C9590]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[#9C9590]" />
        )}
      </button>
      {isOpen && <CardContent className="px-4 pb-4 pt-0">{children}</CardContent>}
    </Card>
  );
}

function SkillGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-medium text-[#6B6560] mb-1">{label}</p>
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
