'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import type { ResumeData } from '@/types/resume';
import { TerminalOutput, type CommandLog } from './terminal-output';
import { TypingEffect } from './typing-effect';

interface CommandLineProps {
  data: ResumeData;
  onClear: () => void;
  history: CommandLog[];
  onCommand: (cmd: string) => void;
}

export function CommandLine({ data, onClear, history, onCommand }: CommandLineProps) {
  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Prompt formatting
  const promptUser = 'visitor';
  const promptHost = data.name ? data.name.toLowerCase().replace(/\s+/g, '') : 'resume';
  const promptString = `${promptUser}@${promptHost}:~$ `;

  // Keep input focused
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    document.addEventListener('click', focusInput);
    focusInput(); // Initial focus
    
    return () => {
      document.removeEventListener('click', focusInput);
    };
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmedText = input.trim();
      if (trimmedText) {
        if (trimmedText.toLowerCase() === 'clear') {
          onClear();
        } else {
          onCommand(trimmedText);
        }
      } else {
        // Empty enter press just adds a prompt
        onCommand('');
      }
      setInput('');
      setHistoryIndex(-1);
      
      // Auto-scroll to bottom of the window
      setTimeout(() => {
        window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: 'smooth' });
      }, 50);
      
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIndex = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        // Search backwards (latest log is last in array)
        if (nextIndex >= 0) {
          const revHistory = [...history].reverse();
          const cmd = revHistory[nextIndex]?.command || '';
          // Only show actual commands, not empty lines
          if (cmd) {
             setInput(cmd);
             setHistoryIndex(nextIndex);
          }
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        const revHistory = [...history].reverse();
        const cmd = revHistory[nextIndex]?.command || '';
        setInput(cmd);
        setHistoryIndex(nextIndex);
      } else if (historyIndex === 0) {
        setInput('');
        setHistoryIndex(-1);
      }
    }
  };

  return (
    <div className="w-full text-sm md:text-base font-mono">
      {/* Scrollable history above the current input */}
      <div className="flex flex-col gap-1 w-full mb-1">
        {history.map((log) => (
          <div key={log.id} className="w-full flex justify-start flex-col items-start animate-in fade-in duration-300">
            {/* The prompt and the echoed command */}
            <div className="flex w-full items-start break-all">
              <span className="text-[#00ff41] mr-2 whitespace-nowrap select-none">{promptString}</span>
              <span className="text-white">{log.command}</span>
            </div>
            {/* Output */}
            <TerminalOutput cmd={log.command} data={data} isRecent={log.id === history[history.length - 1]?.id} />
          </div>
        ))}
      </div>

      {/* Active Input Line */}
      <div className="flex w-full items-center">
        <span className="text-[#00ff41] mr-2 whitespace-nowrap select-none">{promptString}</span>
        <div className="relative flex-1">
           {/* Invisible input capturing commands but allowing default browser text handling/selection */}
           <input
             ref={inputRef}
             type="text"
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyDown={handleKeyDown}
             className="w-full bg-transparent border-none outline-none text-white font-mono z-10 relative opacity-100 caret-transparent"
             autoComplete="off"
             autoCorrect="off"
             autoCapitalize="off"
             spellCheck="false"
             aria-label="Terminal Input"
           />
           {/* Custom cursor overlay */}
           <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex items-center text-white font-mono break-all whitespace-pre-wrap">
             <span>{input}</span>
             <span className="inline-block w-[0.6em] h-[1em] bg-white translate-y-[1px] animate-[pulse_1s_steps(2,start)_infinite]"></span>
           </div>
        </div>
      </div>
    </div>
  );
}
