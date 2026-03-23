import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * POST: Record an interaction event (click, heatmap coord, scroll milestone)
 * Body: { viewId, eventType, payload? }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { viewId, eventType, payload = {} } = body;

    if (!viewId || !eventType) {
      return NextResponse.json({ error: 'Missing viewId or eventType' }, { status: 400 });
    }

    const { data, error } = await supabase.rpc('record_event', {
      p_view_id: viewId,
      p_event_type: eventType,
      p_payload: payload
    });

    if (error) {
      console.error('[track-event] RPC error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ eventId: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PATCH: Update session metadata on page unload
 * Body: { viewId, action: 'bounce' | 'scroll_depth', pct? }
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { viewId, action, pct } = body;

    if (!viewId || !action) {
      return NextResponse.json({ error: 'Missing viewId or action' }, { status: 400 });
    }

    if (action === 'bounce') {
      const { error } = await supabase.rpc('mark_bounce', { p_view_id: viewId });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    } else if (action === 'scroll_depth' && typeof pct === 'number') {
      const { error } = await supabase.rpc('set_scroll_depth', {
        p_view_id: viewId,
        p_pct: Math.min(100, Math.max(0, Math.round(pct)))
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
