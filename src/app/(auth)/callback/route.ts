import { NextResponse } from 'next/server';

export async function GET() {
  // Placeholder: OAuth callback handler (Task 9)
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
}
