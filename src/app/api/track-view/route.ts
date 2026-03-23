import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Use service role key to bypass RLS for RPC calls
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Creates a privacy-respecting hash of an IP address
 */
function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip + process.env.NEXT_PUBLIC_SUPABASE_URL).digest('hex');
}

/**
 * POST: Initial Page Load (Creates the View Record via RPC — bypasses PostgREST schema cache)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { resumeId, referrer } = body;

    if (!resumeId) {
      return NextResponse.json({ error: 'Missing resumeId' }, { status: 400 });
    }

    // Extract headers (Vercel provides these automatically in production)
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Unknown';
    const country = req.headers.get('x-vercel-ip-country') || 'Unknown';
    const city = req.headers.get('x-vercel-ip-city') || 'Unknown';

    const viewerIpHash = hashIp(ip.split(',')[0]);

    // Use the RPC function to insert — this bypasses PostgREST's schema cache entirely
    const { data, error } = await supabase.rpc('record_view', {
      p_resume_id: resumeId,
      p_viewer_ip_hash: viewerIpHash,
      p_user_agent: userAgent,
      p_referrer: referrer || null,
      p_country: country,
      p_city: city
    });

    if (error) {
      console.error('Error recording view:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // RPC returns the new view UUID
    return NextResponse.json({ viewId: data });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PATCH: Heartbeat Ping (Increments the duration via RPC)
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { viewId, seconds = 10 } = body;

    if (!viewId) {
      return NextResponse.json({ error: 'Missing viewId' }, { status: 400 });
    }

    const { error } = await supabase.rpc('increment_view_duration', {
      view_id: viewId,
      seconds_to_add: seconds
    });

    if (error) {
      console.error('Error incrementing view duration:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
