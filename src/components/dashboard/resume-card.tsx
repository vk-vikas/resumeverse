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
  Edit2,
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
  };
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isPublic, setIsPublic] = useState(resume.is_public);
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);
  const supabase = createClient();

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
      <Card className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-all duration-200 overflow-hidden group">
        <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 w-full" />
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white truncate max-w-[200px] mb-1" title={resumeName}>
                {resumeName}
              </h3>
              <p className="text-sm text-neutral-400 truncate max-w-[200px]" title={resumeRole}>
                {resumeRole}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-8 w-8 text-neutral-400 hover:text-white -mr-2">
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-neutral-900 border-neutral-800 text-neutral-200">
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-neutral-800 focus:bg-neutral-800"
                  onClick={() => window.open(`/${resume.slug}`, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Live
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-neutral-800 focus:bg-neutral-800"
                  onClick={() => router.push(`/editor/${resume.id}`)}
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Resume
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0">
                  <Link href={`/dashboard/analytics/${resume.id}`} className="cursor-pointer w-full flex items-center px-2 py-1.5 hover:bg-neutral-800 focus:bg-neutral-800 rounded outline-none w-[100%] min-w-full">
                    <LineChart className="mr-2 h-4 w-4" />
                    <span>Analytics</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-neutral-800" />
                <DropdownMenuItem
                  className="cursor-pointer text-red-500 hover:bg-neutral-800 focus:bg-neutral-800 focus:text-red-400"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary" className="bg-neutral-800 text-neutral-300 font-normal">
              Theme: <span className="capitalize ml-1 text-white">{resume.theme}</span>
            </Badge>
            <Badge variant={isPublic ? 'default' : 'outline'} className={isPublic ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'border-neutral-700 text-neutral-500'}>
              {isPublic ? 'Public' : 'Private'}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-500 pt-4 border-t border-neutral-800/50">
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
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-neutral-900 border-neutral-800">
          <DialogHeader>
            <DialogTitle className="text-white">Is it completely necessary to delete this?</DialogTitle>
            <DialogDescription className="text-neutral-400">
              This action cannot be undone. This will permanently delete your resume "{resumeName}" from our servers and it will no longer be accessible via the shareable link.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="bg-transparent border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white">Cancel</Button>
            <Button
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
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
