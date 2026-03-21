'use client';

import { useEditor } from './editor-context';
import { SectionEditor } from './section-editor';
import { ThemeSelector } from './theme-selector';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, X, Sparkles, Loader2, RotateCcw } from 'lucide-react';
import type { ExperienceItem, EducationItem, ProjectItem } from '@/types/resume';
import { useState } from 'react';
import { toast } from 'sonner';

export function ResumeEditor() {
  const { data, theme, updateField, setTheme } = useEditor();
  const [isEnhancingAll, setIsEnhancingAll] = useState(false);

  const handleEnhanceAll = async () => {
    setIsEnhancingAll(true);
    let enhancedCount = 0;
    try {
      // Create a deep copy to mutate
      const newExperiences = JSON.parse(JSON.stringify(data.experience)) as ExperienceItem[];

      for (let i = 0; i < newExperiences.length; i++) {
        const exp = newExperiences[i];
        for (let j = 0; j < exp.bullets.length; j++) {
          const rawBullet = exp.bullets[j];
          if (!rawBullet.trim()) continue;

          const res = await fetch('/api/enhance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bullet: rawBullet, company: exp.company, role: exp.role }),
          });
          const result = await res.json();
          if (!res.ok) throw new Error(result.error);

          exp.bullets[j] = result.enhanced;
          enhancedCount++;

          updateField('experience', [...newExperiences]);

          await new Promise(r => setTimeout(r, 300));
        }
      }
      if (enhancedCount > 0) toast.success(`Enhanced ${enhancedCount} bullets!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Batch enhancement halted');
    } finally {
      setIsEnhancingAll(false);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Theme Selector */}
      <SectionEditor title="Theme" defaultOpen={true}>
        <ThemeSelector selected={theme} onSelect={setTheme} />
      </SectionEditor>

      {/* Personal Info */}
      <SectionEditor title="Personal Info" defaultOpen={true}>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-neutral-400">Full Name</Label>
            <Input
              value={data.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="John Doe"
              className="bg-neutral-800/50 border-neutral-700 text-white"
            />
          </div>
          <div>
            <Label className="text-xs text-neutral-400">Title / Headline</Label>
            <Input
              value={data.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Senior Software Engineer"
              className="bg-neutral-800/50 border-neutral-700 text-white"
            />
          </div>
          <div>
            <Label className="text-xs text-neutral-400">Summary</Label>
            <Textarea
              value={data.summary}
              onChange={(e) => updateField('summary', e.target.value)}
              placeholder="Brief professional summary..."
              rows={3}
              className="bg-neutral-800/50 border-neutral-700 text-white resize-none"
            />
          </div>
        </div>
      </SectionEditor>

      {/* Contact */}
      <SectionEditor title="Contact">
        <div className="grid grid-cols-2 gap-3">
          {(['email', 'phone', 'linkedin', 'github', 'portfolio', 'location'] as const).map(
            (field) => (
              <div key={field}>
                <Label className="text-xs text-neutral-400 capitalize">{field}</Label>
                <Input
                  value={data.contact[field] || ''}
                  onChange={(e) =>
                    updateField('contact', { ...data.contact, [field]: e.target.value })
                  }
                  placeholder={field === 'email' ? 'email@example.com' : field}
                  className="bg-neutral-800/50 border-neutral-700 text-white text-sm"
                />
              </div>
            )
          )}
        </div>
      </SectionEditor>

      {/* Experience */}
      <SectionEditor title={`Experience (${data.experience.length})`}>
        {data.experience.length > 0 && (
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEnhanceAll}
              disabled={isEnhancingAll}
              className="border-neutral-700 bg-neutral-900/50 text-amber-500 hover:text-amber-400 hover:bg-neutral-800 transition-colors gap-2"
            >
              {isEnhancingAll ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              {isEnhancingAll ? 'Enhancing...' : 'Enhance All'}
            </Button>
          </div>
        )}
        <div className="space-y-4">
          {data.experience.map((exp, i) => (
            <ExperienceEditor
              key={i}
              item={exp}
              onChange={(updated) => {
                const newExp = [...data.experience];
                newExp[i] = updated;
                updateField('experience', newExp);
              }}
              onRemove={() => {
                updateField(
                  'experience',
                  data.experience.filter((_, idx) => idx !== i)
                );
              }}
            />
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateField('experience', [
                ...data.experience,
                { company: '', role: '', startDate: '', endDate: '', bullets: [''] },
              ])
            }
            className="w-full border-dashed border-neutral-700 text-neutral-400 hover:text-white"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Experience
          </Button>
        </div>
      </SectionEditor>

      {/* Education */}
      <SectionEditor title={`Education (${data.education.length})`}>
        <div className="space-y-4">
          {data.education.map((edu, i) => (
            <EducationEditor
              key={i}
              item={edu}
              onChange={(updated) => {
                const newEdu = [...data.education];
                newEdu[i] = updated;
                updateField('education', newEdu);
              }}
              onRemove={() => {
                updateField(
                  'education',
                  data.education.filter((_, idx) => idx !== i)
                );
              }}
            />
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateField('education', [
                ...data.education,
                { institution: '', degree: '', year: '' },
              ])
            }
            className="w-full border-dashed border-neutral-700 text-neutral-400 hover:text-white"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Education
          </Button>
        </div>
      </SectionEditor>

      {/* Skills */}
      <SectionEditor title="Skills">
        <div className="space-y-3">
          <SkillsGroup
            label="Languages"
            items={data.skills.languages}
            onChange={(items) => updateField('skills', { ...data.skills, languages: items })}
          />
          <SkillsGroup
            label="Frameworks"
            items={data.skills.frameworks}
            onChange={(items) => updateField('skills', { ...data.skills, frameworks: items })}
          />
          <SkillsGroup
            label="Tools"
            items={data.skills.tools}
            onChange={(items) => updateField('skills', { ...data.skills, tools: items })}
          />
        </div>
      </SectionEditor>

      {/* Projects */}
      <SectionEditor title={`Projects (${data.projects.length})`}>
        <div className="space-y-4">
          {data.projects.map((proj, i) => (
            <ProjectEditor
              key={i}
              item={proj}
              onChange={(updated) => {
                const newProj = [...data.projects];
                newProj[i] = updated;
                updateField('projects', newProj);
              }}
              onRemove={() => {
                updateField(
                  'projects',
                  data.projects.filter((_, idx) => idx !== i)
                );
              }}
            />
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateField('projects', [
                ...data.projects,
                { name: '', description: '', tech: [] },
              ])
            }
            className="w-full border-dashed border-neutral-700 text-neutral-400 hover:text-white"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Project
          </Button>
        </div>
      </SectionEditor>
    </div>
  );
}

// --- Sub-editors ---

function ExperienceEditor({
  item,
  onChange,
  onRemove,
}: {
  item: ExperienceItem;
  onChange: (item: ExperienceItem) => void;
  onRemove: () => void;
}) {
  const [enhancingIndex, setEnhancingIndex] = useState<number | null>(null);
  const [originalBullets, setOriginalBullets] = useState<Record<number, string>>({});

  const enhanceBullet = async (index: number) => {
    const rawBullet = item.bullets[index];
    if (!rawBullet.trim()) return;

    setEnhancingIndex(index);
    try {
      const res = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bullet: rawBullet, company: item.company, role: item.role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to enhance bullet point');

      // Save original for undo
      setOriginalBullets(prev => ({ ...prev, [index]: rawBullet }));

      const newBullets = [...item.bullets];
      newBullets[index] = data.enhanced;
      onChange({ ...item, bullets: newBullets });
      toast.success('Bullet enhanced!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to reach AI service');
    } finally {
      setEnhancingIndex(null);
    }
  };

  const undoEnhancement = (index: number) => {
    if (originalBullets[index]) {
      const newBullets = [...item.bullets];
      newBullets[index] = originalBullets[index];
      onChange({ ...item, bullets: newBullets });

      const newOriginals = { ...originalBullets };
      delete newOriginals[index];
      setOriginalBullets(newOriginals);
    }
  };

  return (
    <div className="rounded-lg border border-neutral-800 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-400">
          {item.company || 'New Experience'}
        </span>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-neutral-500 hover:text-red-400" onClick={onRemove}>
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input
          value={item.company}
          onChange={(e) => onChange({ ...item, company: e.target.value })}
          placeholder="Company"
          className="bg-neutral-800/50 border-neutral-700 text-white text-sm"
        />
        <Input
          value={item.role}
          onChange={(e) => onChange({ ...item, role: e.target.value })}
          placeholder="Role"
          className="bg-neutral-800/50 border-neutral-700 text-white text-sm"
        />
        <Input
          value={item.startDate}
          onChange={(e) => onChange({ ...item, startDate: e.target.value })}
          placeholder="Start (YYYY-MM)"
          className="bg-neutral-800/50 border-neutral-700 text-white text-sm"
        />
        <Input
          value={item.endDate}
          onChange={(e) => onChange({ ...item, endDate: e.target.value })}
          placeholder="End (YYYY-MM or present)"
          className="bg-neutral-800/50 border-neutral-700 text-white text-sm"
        />
      </div>
      {/* Bullets */}
      <div className="space-y-1">
        <Label className="text-xs text-neutral-500">Bullet Points</Label>
        {item.bullets.map((bullet, j) => (
          <div key={j} className="flex gap-1">
            <Input
              value={bullet}
              onChange={(e) => {
                const newBullets = [...item.bullets];
                newBullets[j] = e.target.value;
                onChange({ ...item, bullets: newBullets });
              }}
              placeholder="Achievement or responsibility..."
              className="bg-neutral-800/50 border-neutral-700 text-white text-sm flex-1"
            />

            {/* AI Enhance / Undo Controls */}
            {enhancingIndex === j ? (
              <Button disabled variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-neutral-400">
                <Loader2 className="h-3 w-3 animate-spin" />
              </Button>
            ) : originalBullets[j] ? (
              <Button
                variant="ghost"
                size="icon"
                title="Undo AI enhancement"
                className="h-9 w-9 shrink-0 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                onClick={() => undoEnhancement(j)}
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                title="Enhance with AI"
                className="h-9 w-9 shrink-0 text-amber-500 hover:text-amber-400 hover:bg-amber-500/10"
                onClick={() => enhanceBullet(j)}
                disabled={!bullet.trim()}
              >
                <Sparkles className="h-3 w-3" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 text-neutral-600 hover:text-red-400"
              onClick={() => {
                if (item.bullets.length > 1) {
                  onChange({ ...item, bullets: item.bullets.filter((_, idx) => idx !== j) });

                  // Clean up original undo cache on delete
                  if (originalBullets[j]) {
                    const newOriginals = { ...originalBullets };
                    delete newOriginals[j];
                    setOriginalBullets(newOriginals);
                  }
                }
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange({ ...item, bullets: [...item.bullets, ''] })}
          className="text-xs text-neutral-500 hover:text-white"
        >
          <Plus className="h-3 w-3 mr-1" /> Add bullet
        </Button>
      </div>
    </div>
  );
}

function EducationEditor({
  item,
  onChange,
  onRemove,
}: {
  item: EducationItem;
  onChange: (item: EducationItem) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-lg border border-neutral-800 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-400">
          {item.institution || 'New Education'}
        </span>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-neutral-500 hover:text-red-400" onClick={onRemove}>
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input
          value={item.institution}
          onChange={(e) => onChange({ ...item, institution: e.target.value })}
          placeholder="Institution"
          className="bg-neutral-800/50 border-neutral-700 text-white text-sm"
        />
        <Input
          value={item.degree}
          onChange={(e) => onChange({ ...item, degree: e.target.value })}
          placeholder="Degree"
          className="bg-neutral-800/50 border-neutral-700 text-white text-sm"
        />
        <Input
          value={item.field || ''}
          onChange={(e) => onChange({ ...item, field: e.target.value })}
          placeholder="Field of Study"
          className="bg-neutral-800/50 border-neutral-700 text-white text-sm"
        />
        <Input
          value={item.year}
          onChange={(e) => onChange({ ...item, year: e.target.value })}
          placeholder="Year (e.g. 2020)"
          className="bg-neutral-800/50 border-neutral-700 text-white text-sm"
        />
      </div>
    </div>
  );
}

function ProjectEditor({
  item,
  onChange,
  onRemove,
}: {
  item: ProjectItem;
  onChange: (item: ProjectItem) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-lg border border-neutral-800 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-400">
          {item.name || 'New Project'}
        </span>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-neutral-500 hover:text-red-400" onClick={onRemove}>
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
      <Input
        value={item.name}
        onChange={(e) => onChange({ ...item, name: e.target.value })}
        placeholder="Project Name"
        className="bg-neutral-800/50 border-neutral-700 text-white text-sm"
      />
      <Textarea
        value={item.description}
        onChange={(e) => onChange({ ...item, description: e.target.value })}
        placeholder="Brief description..."
        rows={2}
        className="bg-neutral-800/50 border-neutral-700 text-white text-sm resize-none"
      />
      <SkillsGroup
        label="Tech Stack"
        items={item.tech}
        onChange={(tech) => onChange({ ...item, tech })}
      />
      <Input
        value={item.link || ''}
        onChange={(e) => onChange({ ...item, link: e.target.value })}
        placeholder="Project URL (optional)"
        className="bg-neutral-800/50 border-neutral-700 text-white text-sm"
      />
    </div>
  );
}

function SkillsGroup({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const [input, setInput] = useState('');

  const addSkill = () => {
    const trimmed = input.trim();
    if (trimmed && !items.includes(trimmed)) {
      onChange([...items, trimmed]);
      setInput('');
    }
  };

  return (
    <div>
      <Label className="text-xs text-neutral-400">{label}</Label>
      <div className="flex flex-wrap gap-1.5 mt-1 mb-2">
        {items.map((skill, i) => (
          <Badge
            key={i}
            variant="secondary"
            className="text-xs cursor-pointer hover:bg-red-500/20 hover:text-red-300 transition-colors"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
          >
            {skill} <X className="h-2.5 w-2.5 ml-1" />
          </Badge>
        ))}
      </div>
      <div className="flex gap-1">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addSkill();
            }
          }}
          placeholder={`Add ${label.toLowerCase()}...`}
          className="bg-neutral-800/50 border-neutral-700 text-white text-sm flex-1"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={addSkill}
          className="border-neutral-700 text-neutral-400"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
