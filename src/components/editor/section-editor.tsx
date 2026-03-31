'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SectionEditorProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function SectionEditor({ title, defaultOpen = false, children }: SectionEditorProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="bg-white border-[#E8E5DF]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-[#F5F3EF]/50 transition-colors rounded-t-lg"
      >
        <span className="text-sm font-semibold text-[#1A1A1A]">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-[#9C9590]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[#9C9590]" />
        )}
      </button>
      {isOpen && (
        <CardContent className="px-4 pb-4 pt-0 space-y-3">
          {children}
        </CardContent>
      )}
    </Card>
  );
}
