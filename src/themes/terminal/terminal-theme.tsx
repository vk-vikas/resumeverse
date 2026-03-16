'use client';

import { useState, useCallback, useEffect } from 'react';
import type { ResumeData } from '@/types/resume';
import { CommandLine } from './command-line';
import type { CommandLog } from './terminal-output';
import { TypingEffect } from './typing-effect';

interface TerminalThemeProps {
  data: ResumeData;
}

export function TerminalTheme({ data }: TerminalThemeProps) {
  const [history, setHistory] = useState<CommandLog[]>([]);
  const [isBooting, setIsBooting] = useState(true);

  // Boot sequence effect
  useEffect(() => {
    // Prevent scrolling during boot so user focuses on the intro typing.
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => {
      document.body.style.overflow = '';
      setIsBooting(false);
    }, 4500); // Wait for the summary to finish auto-typing

    return () => {
      document.body.style.overflow = '';
      clearTimeout(timer);
    };
  }, []);

  const handleCommand = useCallback((cmd: string) => {
    setHistory((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        command: cmd,
        time: new Date(),
      },
    ]);
  }, []);

  const handleClear = useCallback(() => {
    setHistory([]);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0d1117] text-white font-mono p-4 sm:p-6 md:p-8 lg:p-12 selection:bg-[#00ff41]/30 selection:text-white relative pb-32">
      {/* Scanline overlay effect */}
      <div className="pointer-events-none absolute inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] opacity-20"></div>
      
      {/* Subtle screen glow */}
      <div className="pointer-events-none absolute inset-0 z-40 shadow-[inset_0_0_100px_rgba(0,255,65,0.03)] mix-blend-overlay"></div>

      <main className="max-w-4xl mx-auto w-full relative z-10 flex flex-col items-start min-h-[80vh]">
        {/* Boot Sequence / Header */}
        <div className="mb-6 w-full text-sm md:text-base">
          <div className="text-[#00ff41] font-bold mb-4 opacity-90 select-none">
            {`
  ___                   _   _  __                
 | _ \\___ ____  _ _ __ | | | |/ /_ _ ___ ______  
 |   / -_|_-< || | '  \\| |_| | ' <| '_/ -_)_-<   
 |_|_\\___/__/\\_,_|_|_|_|\\___/|_|\\_\\_| \\___//__/  
            `}
          </div>
          
          <div className="text-neutral-400 space-y-1 mb-6">
            <p>Welcome to ResumeVerse OS v1.0.0 (tty1)</p>
            <p className="text-xs">Copyright (c) 1999-{new Date().getFullYear()} The Hackers Cooperative. All rights reserved.</p>
          </div>

          <div className="flex w-full items-start">
            <span className="text-[#00ff41] mr-2 whitespace-nowrap select-none">system@boot:~$ </span>
            <TypingEffect text="cat summary.txt" speed={40} cursor={false} />
          </div>
          
          {/* Initial automated summary output */}
          <div className="my-2 min-h-[80px]">
            <TypingEffect 
              text={data.summary || `Guest session initiated for ${data.name || 'Anonymous'}.`} 
              speed={15} 
              delay={800} 
              className="text-neutral-300"
              cursor={false}
            />
          </div>

          <div className="mt-6 text-neutral-500 animate-pulse">
            <TypingEffect text="Type 'help' for a list of available commands." speed={20} delay={3000} />
          </div>
        </div>

        {/* Interactive Shell */}
        {/* Only mount the prompt fully active after boot to prevent typing interruptions */}
        <div className={`w-full transition-opacity duration-1000 ${isBooting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <CommandLine 
            data={data}
            history={history}
            onCommand={handleCommand}
            onClear={handleClear}
          />
        </div>
      </main>
    </div>
  );
}
