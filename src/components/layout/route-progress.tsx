'use client';

import { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Slim animated top-bar that shows during client-side route transitions.
 * Inspired by YouTube / GitHub progress indicators.
 */
function RouteProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevUrl = useRef('');

  const start = useCallback(() => {
    setTimeout(() => {
      setVisible(true);
      setProgress(15);
      timerRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 90) return p;
          // Slow down as it approaches 90
          return p + (90 - p) * 0.08;
        });
      }, 200);
    }, 0);
  }, []);

  const finish = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setProgress(100);
    setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
  }, []);

  useEffect(() => {
    const url = pathname + searchParams.toString();
    if (prevUrl.current && prevUrl.current !== url) {
      finish();
    }
    prevUrl.current = url;
  }, [pathname, searchParams, finish]);

  // Intercept link clicks and form submissions to start the bar
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        anchor.target === '_blank' ||
        e.metaKey ||
        e.ctrlKey
      ) {
        return;
      }

      // Only trigger for internal navigations
      start();
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, [start]);

  // Also intercept programmatic navigations via Next.js router.push
  // by patching history.pushState
  useEffect(() => {
    const originalPushState = history.pushState.bind(history);
    const originalReplaceState = history.replaceState.bind(history);

    history.pushState = (...args) => {
      start();
      return originalPushState(...args);
    };

    history.replaceState = (...args) => {
      start();
      return originalReplaceState(...args);
    };

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [start]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease' }}
    >
      <div
        className="h-full bg-gradient-to-r from-[#5B4FC4] via-[#8B5CF6] to-[#5B4FC4] shadow-[0_0_8px_rgba(91,79,196,0.4)]"
        style={{
          width: `${progress}%`,
          transition: progress === 0 ? 'none' : 'width 0.3s ease',
        }}
      />
    </div>
  );
}

export function RouteProgress() {
  return (
    <Suspense fallback={null}>
      <RouteProgressInner />
    </Suspense>
  );
}
