'use client';

import { useEditor } from './editor-context';
import { Badge } from '@/components/ui/badge';
import { ResumeRenderer } from './resume-renderer';

/**
 * Live preview that renders the resume data using the selected theme.
 */
export function LivePreview() {
  const { data, theme } = useEditor();

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 min-h-full overflow-y-auto">
      {/* Theme label */}
      <div className="mb-6 flex items-center justify-between">
        <Badge variant="outline" className="text-[10px] border-neutral-700 text-neutral-500">
          Preview: {theme.charAt(0).toUpperCase() + theme.slice(1)} Theme
        </Badge>
      </div>

      <div className="bg-[#0a0a0a] rounded-xl overflow-hidden border border-neutral-800/50 shadow-2xl relative">
        {(!data.name && !data.title && data.experience.length === 0) ? (
          <div className="flex items-center justify-center h-64 text-neutral-600 text-sm">
            Start editing to see your resume preview
          </div>
        ) : (
          <div className="transform origin-top scale-[0.85] w-[117%] -ml-[8.5%] -mb-[8.5%] pointer-events-none">
            <ResumeRenderer data={data} theme={theme} />
          </div>
        )}
      </div>
    </div>
  );
}
