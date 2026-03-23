'use client';

import { useEffect, useRef } from 'react';

/**
 * Universal View Tracker
 * Tracks: views, duration, bounce rate (A1), contact clicks (B1), download clicks (B2)
 * Scroll depth and heatmap coords are handled separately in PdfViewer (Phase 3)
 */
export function ViewTracker({ 
  resumeId, 
  onViewCreated 
}: { 
  resumeId: string;
  onViewCreated?: (viewId: string) => void;
}) {
  const viewIdRef = useRef<string | null>(null);
  const startedRef = useRef(false);
  const startTimeRef = useRef<number>(Date.now());
  const BOUNCE_THRESHOLD_MS = 5000; // < 5 seconds = bounce

  // ─── 1. Record initial page view ───────────────────────────────────────────
  useEffect(() => {
    if (!resumeId || startedRef.current) return;
    startedRef.current = true;
    startTimeRef.current = Date.now();

    async function recordView() {
      try {
        console.log('[ViewTracker] Firing POST for resumeId:', resumeId);
        const res = await fetch('/api/track-view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeId, referrer: document.referrer || null })
        });
        const json = await res.json();
        console.log('[ViewTracker] Response:', json);
        if (json.viewId) {
          viewIdRef.current = json.viewId;
          onViewCreated?.(json.viewId);
        }
      } catch (err) {
        console.error('[ViewTracker] Failed to record view:', err);
      }
    }

    recordView();
  }, [resumeId]);

  // ─── 2. Duration heartbeat (every 10s) ─────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      if (!viewIdRef.current || document.hidden) return;
      fetch('/api/track-view', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ viewId: viewIdRef.current, seconds: 10 })
      }).catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // ─── 3. Bounce detection — fires on tab close / navigation away ─────────────
  useEffect(() => {
    function handleUnload() {
      const viewId = viewIdRef.current;
      if (!viewId) return;
      const elapsed = Date.now() - startTimeRef.current;

      if (elapsed < BOUNCE_THRESHOLD_MS) {
        // Use sendBeacon for reliable fire-and-forget on page unload
        navigator.sendBeacon(
          '/api/track-event',
          JSON.stringify({ viewId, action: 'bounce' })
        );
      }
    }

    // visibilitychange catches tab switch + mobile background
    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') handleUnload();
    }

    window.addEventListener('pagehide', handleUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pagehide', handleUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // ─── 4. Contact link & download click tracking ──────────────────────────────
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const viewId = viewIdRef.current;
      if (!viewId) return;

      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      const button = target.closest('button, [data-track]');

      // B2: Download button
      if (button && (button as HTMLElement).dataset.track === 'download') {
        fetch('/api/track-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ viewId, eventType: 'click_download', payload: {} })
        }).catch(() => {});
        return;
      }

      // B1: Contact links (email, LinkedIn, GitHub, phone)
      if (anchor) {
        const href = anchor.href || '';
        const isContact =
          href.startsWith('mailto:') ||
          href.startsWith('tel:') ||
          href.includes('linkedin.com') ||
          href.includes('github.com') ||
          href.includes('twitter.com') ||
          href.includes('x.com');

        if (isContact) {
          fetch('/api/track-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              viewId,
              eventType: 'click_contact',
              payload: { href }
            })
          }).catch(() => {});
        }
      }
    }

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, []);

  return null;
}
