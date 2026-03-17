import { NextRequest, NextResponse } from 'next/server';
import { enhanceBulletPoint } from '@/lib/ai/enhance-bullets';

// Simple in-memory rate limiter to prevent API abuse
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  // 1 minute window
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60_000 }); 
    return true;
  }

  // Max 20 bullet point enhancements per IP per minute
  if (entry.count >= 20) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many enhancement requests. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    // 2. Validate API Key Setup
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service is not configured. Please set GEMINI_API_KEY.' },
        { status: 500 }
      );
    }

    // 3. Parse JSON Body payload
    const body = await request.json();
    const { bullet, company, role } = body;

    // 4. Validate Input
    if (!bullet || typeof bullet !== 'string' || bullet.trim().length === 0) {
      return NextResponse.json(
        { error: 'A valid bullet point string must be provided.' },
        { status: 400 }
      );
    }

    if (bullet.length > 500) {
       return NextResponse.json(
        { error: 'Bullet point is too long to enhance (max 500 chars).' },
        { status: 400 }
      );
    }

    // 5. Enhance using Gemini wrapper
    const enhancedBullet = await enhanceBulletPoint({
      bullet,
      company: typeof company === 'string' ? company : undefined,
      role: typeof role === 'string' ? role : undefined,
    });

    return NextResponse.json({ enhanced: enhancedBullet });

  } catch (error) {
    console.error('Enhancement route error:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { error: `Failed to enhance bullet: ${message}` },
      { status: 500 }
    );
  }
}
