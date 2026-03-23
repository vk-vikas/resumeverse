'use client';

import { useEffect, useRef } from 'react';

/**
 * Universal View Tracker — invisible component that runs on EVERY theme.
 * On mount: POSTs to /api/track-view to record the visit.
 * Every 10s: PATCHes to increment duration (pauses when tab is hidden).
 */
export function ViewTracker({ resumeId }: { resumeId: string }) {
  const viewIdRef = useRef<string | null>(null);
  const startedRef = useRef(false);

  // 1. Record initial page view
  useEffect(() => {
    if (!resumeId || startedRef.current) return;
    startedRef.current = true;

    async function recordView() {
      try {
        console.log('[ViewTracker] Firing POST for resumeId:', resumeId);
        const res = await fetch('/api/track-view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resumeId,
            referrer: document.referrer || null
          })
        });
        const json = await res.json();
        console.log('[ViewTracker] Response:', json);
        if (json.viewId) {
          viewIdRef.current = json.viewId;
        }
      } catch (err) {
        console.error('ViewTracker: failed to record initial view', err);
      }
    }

    recordView();
  }, [resumeId]);

  // 2. Heartbeat every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!viewIdRef.current || document.hidden) return;

      fetch('/api/track-view', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          viewId: viewIdRef.current,
          seconds: 10
        })
      }).catch(() => {});
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Renders nothing — pure side-effect component
  return null;
}
