-- Phase 1: Database & Storage Infrastructure for PDF Analytics

-- 1. Create the Storage Bucket for raw PDF hosting
-- Try to insert the bucket directly via SQL (requires the storage schema to exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('raw_resumes', 'raw_resumes', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Update the resumes table constraint to whitelist the new 'raw_pdf' engine
ALTER TABLE public.resumes DROP CONSTRAINT IF EXISTS resumes_theme_check;
ALTER TABLE public.resumes ADD CONSTRAINT resumes_theme_check 
  CHECK (theme IN ('bento', 'journey', 'terminal', 'kpi', 'faang', 'raw_pdf'));

-- 3. Create the granular telemetry tracking table
CREATE TABLE IF NOT EXISTS public.resume_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id TEXT NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  viewer_ip_hash TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  country TEXT,
  city TEXT,
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS so random users cannot delete analytics data
ALTER TABLE public.resume_views ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anonymous visitors) to INSERT a new view record
CREATE POLICY "Allow public insert to resume_views" 
  ON public.resume_views FOR INSERT 
  TO public 
  WITH CHECK (true);

-- Allow resume owners to READ their own telemetry data
CREATE POLICY "Allow users to read their own resume_views" 
  ON public.resume_views FOR SELECT 
  USING (
    resume_id IN (
      SELECT id FROM public.resumes WHERE user_id = auth.uid()
    )
  );

-- 4. Create an atomic RPC function for the JavaScript Heartbeat
-- This allows the frontend to send a "ping" every 10 seconds to increase the 'duration_seconds' cleanly
-- without granting the frontend direct UPDATE privileges.
CREATE OR REPLACE FUNCTION increment_view_duration(view_id UUID, seconds_to_add INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.resume_views
  SET duration_seconds = duration_seconds + seconds_to_add
  WHERE id = view_id;
END;
$$;
