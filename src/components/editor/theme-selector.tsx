'use client';

import { Card } from '@/components/ui/card';
import { Check, LayoutGrid, ScrollText, Terminal, BarChartHorizontalBig } from 'lucide-react';
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
    id: 'journey',
    name: 'Journey',
    description: 'Scroll-driven storytelling with parallax',
    icon: <ScrollText className="h-5 w-5" />,
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
    icon: <BarChartHorizontalBig className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />,
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
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-600'
              }`}
          >
            {isSelected && (
              <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
            <div className={`mb-2 ${isSelected ? 'text-blue-400' : 'text-neutral-500'}`}>
              {theme.icon}
            </div>
            <p className="text-xs font-medium text-neutral-200">{theme.name}</p>
            <p className="text-[10px] text-neutral-500 mt-0.5 leading-tight">
              {theme.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
