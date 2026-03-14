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
    <Card className="bg-neutral-900/50 border-neutral-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-800/30 transition-colors rounded-t-lg"
      >
        <span className="text-sm font-semibold text-neutral-200">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-neutral-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-neutral-500" />
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
