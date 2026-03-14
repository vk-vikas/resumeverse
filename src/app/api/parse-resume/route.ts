import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF } from '@/lib/parsers/pdf-parser';
import { extractTextFromDOCX } from '@/lib/parsers/docx-parser';
import { parseResumeText } from '@/lib/ai/parse-resume';

// Simple in-memory rate limiter
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60_000 }); // 1 minute window
    return true;
  }

  if (entry.count >= 5) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit check
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    // Check for Gemini API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service is not configured. Please set GEMINI_API_KEY.' },
        { status: 500 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided. Please upload a PDF or DOCX file.' },
        { status: 400 }
      );
    }

    // Validate file type
    const fileName = file.name.toLowerCase();
    const isPDF = fileName.endsWith('.pdf') || file.type === 'application/pdf';
    const isDOCX =
      fileName.endsWith('.docx') ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    if (!isPDF && !isDOCX) {
      return NextResponse.json(
        { error: 'Only PDF and DOCX files are accepted.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be under 5MB.' },
        { status: 400 }
      );
    }

    // Extract text from the file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let rawText: string;
    if (isPDF) {
      rawText = await extractTextFromPDF(buffer);
    } else {
      rawText = await extractTextFromDOCX(buffer);
    }

    if (!rawText || rawText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Could not extract enough text from the file. The file may be image-based or corrupted.' },
        { status: 400 }
      );
    }

    // Parse with AI
    const resumeData = await parseResumeText(rawText);

    return NextResponse.json({ data: resumeData });
  } catch (error) {
    console.error('Resume parsing error:', error);
    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { error: `Failed to parse resume: ${message}` },
      { status: 500 }
    );
  }
}
