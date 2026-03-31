'use client';

import { FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

export function FilePreview({ file, onRemove }: FilePreviewProps) {
  const isPDF = file.type === 'application/pdf' || file.name.endsWith('.pdf');
  const sizeKB = (file.size / 1024).toFixed(0);
  const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
  const displaySize = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`;

  return (
    <div className="flex items-center gap-4 rounded-lg bg-[#F5F3EF] border border-[#E8E5DF] p-4 w-full">
      {/* File icon */}
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
          isPDF ? 'bg-[#FDF0F0] text-[#D84040]' : 'bg-[#F0EDFA] text-[#5B4FC4]'
        }`}
      >
        <FileText className="h-6 w-6" />
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#1A1A1A] truncate">
          {file.name}
        </p>
        <p className="text-xs text-[#9C9590] mt-0.5">
          {isPDF ? 'PDF' : 'DOCX'} · {displaySize}
        </p>
      </div>

      {/* Remove button */}
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 h-8 w-8 text-[#9C9590] hover:text-[#D84040]"
        onClick={onRemove}
        aria-label="Remove file"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
