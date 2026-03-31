'use client';

import { Card } from '@/components/ui/card';
import { Check, LayoutGrid, ScrollText, Terminal, BarChartHorizontalBig, FileText } from 'lucide-react';
import type { ThemeType } from '@/types/resume';

interface ThemeSelectorProps {
  selected: ThemeType;
  onSelect: (theme: ThemeType) => void;
}

const themes: { id: ThemeType; name: string; description: string; icon: React.ReactNode }[] = [
  {
    id: 'bento',
    name: 'Bento Grid',
    description: 'Modern dark bento layout with animated cards',
    icon: <LayoutGrid className="h-5 w-5" />,
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Interactive CLI experience',
    icon: <Terminal className="h-5 w-5" />,
  },
  {
    id: 'kpi',
    name: 'Data Room',
    description: 'Executive dashboard driven by numerical KPIs',
    icon: <BarChartHorizontalBig className="h-5 w-5 text-[#3A8D5C]" />,
  },
];

export function ThemeSelector({ selected, onSelect }: ThemeSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {themes.map((theme) => {
        const isSelected = selected === theme.id;
        return (
          <button
            key={theme.id}
            onClick={() => onSelect(theme.id)}
            aria-selected={isSelected}
            className={`relative text-left rounded-xl border-2 p-3 transition-all duration-200 ${isSelected
                ? 'border-[#5B4FC4] bg-[#F0EDFA]'
                : 'border-[#E8E5DF] bg-white hover:border-[#9C9590]'
              }`}
          >
            {isSelected && (
              <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-[#5B4FC4] flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
            <div className={`mb-2 ${isSelected ? 'text-[#5B4FC4]' : 'text-[#9C9590]'}`}>
              {theme.icon}
            </div>
            <p className="text-xs font-medium text-[#1A1A1A]">{theme.name}</p>
            <p className="text-[10px] text-[#9C9590] mt-0.5 leading-tight">
              {theme.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
