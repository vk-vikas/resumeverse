'use client';

import { useEditor } from './editor-context';
import { SectionEditor } from './section-editor';
import { ThemeSelector } from './theme-selector';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, X } from 'lucide-react';
import type { ExperienceItem, EducationItem, ProjectItem } from '@/types/resume';
import { useState } from 'react';

export function ResumeEditor() {
  const { data, theme, updateField, setTheme } = useEditor();

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
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 text-neutral-600 hover:text-red-400"
              onClick={() => {
                if (item.bullets.length > 1) {
                  onChange({ ...item, bullets: item.bullets.filter((_, idx) => idx !== j) });
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
