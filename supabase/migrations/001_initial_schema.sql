-- =============================================
-- ResumeVerse — Initial Database Schema
-- =============================================
-- Run this in Supabase SQL Editor:
-- Dashboard → SQL Editor → New Query → Paste → Run

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Resumes table
-- =============================================
CREATE TABLE public.resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  theme TEXT NOT NULL DEFAULT 'bento' CHECK (theme IN ('bento', 'journey', 'terminal', 'kpi', 'faang')),
  data JSONB NOT NULL,
  original_file TEXT,
  is_public BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for fast lookups
CREATE INDEX idx_resumes_slug ON public.resumes(slug);
CREATE INDEX idx_resumes_user_id ON public.resumes(user_id);

-- Row Level Security
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Anyone can view public resumes
CREATE POLICY "Public resumes are viewable by everyone"
  ON public.resumes FOR SELECT
  USING (is_public = true);

-- Authenticated users can view their own resumes (even private ones)
CREATE POLICY "Users can view own resumes"
  ON public.resumes FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own resumes
CREATE POLICY "Users can create own resumes"
  ON public.resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own resumes
CREATE POLICY "Users can update own resumes"
  ON public.resumes FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own resumes
CREATE POLICY "Users can delete own resumes"
  ON public.resumes FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- View analytics table
-- =============================================
CREATE TABLE public.resume_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE NOT NULL,
  viewed_at TIMESTAMPTZ DEFAULT now(),
  referrer TEXT,
  user_agent TEXT,
  country TEXT
);

CREATE INDEX idx_resume_views_resume_id ON public.resume_views(resume_id);

ALTER TABLE public.resume_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert views (anonymous tracking)
CREATE POLICY "Anyone can log a view"
  ON public.resume_views FOR INSERT
  WITH CHECK (true);

-- Only resume owner can read their analytics
CREATE POLICY "Resume owners can view analytics"
  ON public.resume_views FOR SELECT
  USING (
    resume_id IN (
      SELECT id FROM public.resumes WHERE user_id = auth.uid()
    )
  );

-- =============================================
-- Auto-update updated_at trigger
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER resumes_updated_at
  BEFORE UPDATE ON public.resumes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- NOTE: You also need to create a 'resumes' storage bucket
-- in Supabase Dashboard → Storage → New Bucket
-- Set it to NOT public (private bucket)
-- =============================================
