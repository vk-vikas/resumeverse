'use client';

import { useState, useEffect } from 'react';

interface TypingEffectProps {
  text: string;
  speed?: number; // ms per character
  delay?: number; // ms before starting
  onComplete?: () => void;
  className?: string;
  cursor?: boolean;
}

export function TypingEffect({ 
  text, 
  speed = 30, 
  delay = 0, 
  onComplete,
  className = '',
  cursor = true 
}: TypingEffectProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Start delay
    if (!started) {
      timeoutId = setTimeout(() => {
        setStarted(true);
        setIsTyping(true);
      }, delay);
      return () => clearTimeout(timeoutId);
    }

    // Typing effect
    if (isTyping && displayedText.length < text.length) {
      timeoutId = setTimeout(() => {
        setDisplayedText(text.substring(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeoutId);
    } 
    
    // Completion
    if (isTyping && displayedText.length === text.length) {
      setIsTyping(false);
      if (onComplete) onComplete();
    }
  }, [displayedText, isTyping, started, text, speed, delay, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {cursor && isTyping && (
        <span className="inline-block w-2 bg-green-500 ml-0.5 animate-pulse">_</span>
      )}
    </span>
  );
}
