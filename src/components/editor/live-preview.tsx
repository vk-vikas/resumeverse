'use client';

import { useEditor } from './editor-context';
import { Badge } from '@/components/ui/badge';
import { ResumeRenderer } from './resume-renderer';

/**
 * Live preview that renders the resume data using the selected theme.
 * Note: The inner container keeps a dark bg since the actual resume themes (bento/terminal/kpi)
 * are designed with their own dark palettes. Only the preview chrome is restyled.
 */
export function LivePreview() {
  const { data, theme } = useEditor();

  return (
    <div className="rounded-xl border border-[#E8E5DF] bg-[#F5F3EF] p-6 min-h-full overflow-y-auto">
      {/* Theme label */}
      <div className="mb-6 flex items-center justify-between">
        <Badge variant="outline" className="text-[10px] border-[#E8E5DF] text-[#9C9590]">
          Preview: {theme.charAt(0).toUpperCase() + theme.slice(1)} Theme
        </Badge>
      </div>

      <div className="bg-[#0a0a0a] rounded-xl overflow-hidden border border-[#E8E5DF] shadow-xl relative">
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
