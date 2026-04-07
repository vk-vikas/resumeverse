'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  ExternalLink,
  Trash2,
  Eye,
  Calendar,
  MoreVertical,
  Loader2,
  LineChart
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ResumeCardProps {
  resume: {
    id: string;
    slug: string;
    theme: string;
    is_public: boolean;
    views: number;
    created_at: string;
    data: any;
    telemetry?: {
      uniqueVisitors: number;
      avgDurationSecs: number;
      topLocation: string;
      downloads?: number;
    };
  };
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isPublic, setIsPublic] = useState(resume.is_public);
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);
  const supabase = createClient();

  const themeStyles: Record<string, { border: string, bg: string, text: string }> = {
    'bento': { border: 'border-l-[#5B4FC4]', bg: 'bg-[#F0EDFA]', text: 'text-[#5B4FC4]' },
    'terminal': { border: 'border-l-[#3A8D5C]', bg: 'bg-[#EDF7F1]', text: 'text-[#3A8D5C]' },
    'kpi': { border: 'border-l-[#D89040]', bg: 'bg-[#FDF5EC]', text: 'text-[#D89040]' },
    'raw_pdf': { border: 'border-l-[#8B8580]', bg: 'bg-[#F3F0EC]', text: 'text-[#6B6560]' },
  };
  const style = themeStyles[resume.theme] || { border: 'border-l-[#8B5CF6]', bg: 'bg-[#F5F0FF]', text: 'text-[#8B5CF6]' };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(resume.created_at));

  const handleToggleVisibility = async () => {
    setIsUpdatingVisibility(true);
    const newStatus = !isPublic;

    try {
      const { error } = await supabase
        .from('resumes')
        .update({ is_public: newStatus })
        .eq('id', resume.id);

      if (error) throw error;

      setIsPublic(newStatus);
      toast.success(newStatus ? 'Resume is now public' : 'Resume is now private');
    } catch (error) {
      toast.error('Failed to update visibility');
      // Revert optimism if failed
    } finally {
      setIsUpdatingVisibility(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resume.id);

      if (error) throw error;

      toast.success('Resume deleted completely');
      router.refresh(); // Refresh the Server Component page
    } catch (error) {
      toast.error('Failed to delete resume');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const resumeName = resume.data?.name || 'Untitled Resume';
  const resumeRole = resume.data?.title || 'No role provided';

  return (
    <>
      <Card className={`relative bg-white border-[#DCD8D0] border-l-4 ${style.border} hover:border-[#9C9590] transition-all duration-300 overflow-hidden group shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 rounded-xl`}>
        {/* Subtle hover gradient flare */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-black/[0.02] to-transparent rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        <CardContent className="p-6 relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-[#1A1A1A] truncate max-w-[200px] mb-1" title={resumeName}>
                {resumeName}
              </h3>
              <p className="text-sm text-[#6B6560] truncate max-w-[200px]" title={resumeRole}>
                {resumeRole}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium hover:bg-[#F5F3EF] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-8 w-8 text-[#9C9590] hover:text-[#1A1A1A] -mr-2">
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white border-[#E8E5DF] text-[#1A1A1A]">
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-[#F5F3EF] focus:bg-[#F5F3EF]"
                  onClick={() => window.open(`/${resume.slug}`, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Live
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0">
                  <Link href={`/dashboard/analytics/${resume.id}`} className="cursor-pointer w-full flex items-center px-2 py-1.5 hover:bg-[#F5F3EF] focus:bg-[#F5F3EF] rounded outline-none w-[100%] min-w-full">
                    <LineChart className="mr-2 h-4 w-4" />
                    <span>Analytics</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#E8E5DF]" />
                <DropdownMenuItem
                  className="cursor-pointer text-[#D84040] hover:bg-[#FDF0F0] focus:bg-[#FDF0F0] focus:text-[#D84040]"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="secondary" className={`${style.bg} ${style.text} px-2.5 py-0.5 border-none font-medium capitalize shadow-none transition-colors`}>
              {resume.theme.replace('_', ' ')}
            </Badge>
            {isPublic ? (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3A8D5C] bg-[#EDF7F1] px-2.5 py-0.5 rounded-full border border-[#3A8D5C]/20 shadow-sm">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3A8D5C] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3A8D5C]"></span>
                </div>
                Live
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-medium text-[#9C9590] bg-[#FAFAF8] px-2.5 py-0.5 rounded-full border border-[#E8E5DF] shadow-sm">
                <div className="h-2 w-2 rounded-full bg-[#DCD8D0]"></div>
                Private
              </div>
            )}
          </div>

          {/* Micro Telemetry Dashboard */}
          {isPublic && (
            <div className="grid grid-cols-3 gap-2 py-3 mb-4 border-t border-b border-[#E8E5DF] bg-[#FAFAF8] px-3 -mx-6 text-center">
              <div>
                <p className="text-[10px] text-[#9C9590] uppercase tracking-wider font-semibold">Unique Viewers</p>
                <p className="text-sm font-bold text-[#3A8D5C] mt-0.5">{resume.telemetry?.uniqueVisitors || 0}</p>
              </div>
              <div className="border-l border-[#E8E5DF]">
                <p className="text-[10px] text-[#9C9590] uppercase tracking-wider font-semibold">Read Time</p>
                <p className="text-sm font-bold text-[#5B4FC4] mt-0.5">{resume.telemetry?.avgDurationSecs ? `${resume.telemetry.avgDurationSecs}s` : '0s'}</p>
              </div>
              {resume.theme === 'raw_pdf' ? (
                <div className="border-l border-[#E8E5DF]">
                  <p className="text-[10px] text-[#9C9590] uppercase tracking-wider font-semibold">Downloads</p>
                  <p className="text-sm font-bold text-[#D89040] mt-0.5 px-1">{resume.telemetry?.downloads || 0}</p>
                </div>
              ) : (
                <div className="border-l border-[#E8E5DF]">
                  <p className="text-[10px] text-[#9C9590] uppercase tracking-wider font-semibold">Top Location</p>
                  <p className="text-sm font-bold text-[#8B5CF6] mt-0.5 truncate px-1">{resume.telemetry?.topLocation || 'N/A'}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-[#9C9590] pt-4 border-t border-[#E8E5DF]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5" title="Views">
                <Eye className="h-3.5 w-3.5" />
                {resume.views}
              </div>
              <div className="flex items-center gap-1.5" title="Created on">
                <Calendar className="h-3.5 w-3.5" />
                {formattedDate}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-medium">Link</span>
              <Switch
                checked={isPublic}
                onCheckedChange={handleToggleVisibility}
                disabled={isUpdatingVisibility}
                className="data-[state=checked]:bg-[#5B4FC4]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-white border-[#E8E5DF]">
          <DialogHeader>
            <DialogTitle className="text-[#1A1A1A]">Is it completely necessary to delete this?</DialogTitle>
            <DialogDescription className="text-[#6B6560]">
              This action cannot be undone. This will permanently delete your resume "{resumeName}" from our servers and it will no longer be accessible via the shareable link.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="bg-transparent border-[#E8E5DF] text-[#6B6560] hover:bg-[#F5F3EF] hover:text-[#1A1A1A]">Cancel</Button>
            <Button
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-[#D84040] hover:bg-[#C03030] text-white"
            >
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
