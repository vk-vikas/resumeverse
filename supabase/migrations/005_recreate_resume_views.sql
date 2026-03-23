-- NUCLEAR FIX: Drop and recreate resume_views to force PostgREST cache refresh
-- This also recreates all RPC functions cleanly

-- 1. Drop existing objects
DROP FUNCTION IF EXISTS record_view(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS increment_view_duration(UUID, INTEGER);
DROP TABLE IF EXISTS public.resume_views CASCADE;

-- 2. Recreate the table fresh
CREATE TABLE public.resume_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  viewer_ip_hash TEXT NOT NULL DEFAULT 'unknown',
  user_agent TEXT DEFAULT 'Unknown',
  referrer TEXT,
  country TEXT DEFAULT 'Unknown',
  city TEXT DEFAULT 'Unknown',
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE public.resume_views ENABLE ROW LEVEL SECURITY;

-- 4. Policies
CREATE POLICY "Allow public insert to resume_views"
  ON public.resume_views FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow users to read their own resume_views"
  ON public.resume_views FOR SELECT
  USING (
    resume_id IN (
      SELECT id FROM public.resumes WHERE user_id = auth.uid()
    )
  );

-- 5. RPC: Record a view (INSERT + increment views counter atomically)
CREATE OR REPLACE FUNCTION record_view(
  p_resume_id UUID,
  p_viewer_ip_hash TEXT DEFAULT 'unknown',
  p_user_agent TEXT DEFAULT 'Unknown',
  p_referrer TEXT DEFAULT NULL,
  p_country TEXT DEFAULT 'Unknown',
  p_city TEXT DEFAULT 'Unknown'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.resume_views (resume_id, viewer_ip_hash, user_agent, referrer, country, city, duration_seconds)
  VALUES (p_resume_id, p_viewer_ip_hash, p_user_agent, p_referrer, p_country, p_city, 0)
  RETURNING id INTO new_id;

  -- Also bump the simple views counter
  UPDATE public.resumes SET views = COALESCE(views, 0) + 1 WHERE id = p_resume_id;

  RETURN new_id;
END;
$$;

-- 6. RPC: Heartbeat duration increment
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

-- 7. RPC: Get analytics for a resume (bypasses PostgREST table access entirely)
CREATE OR REPLACE FUNCTION get_resume_analytics(p_resume_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_views', COUNT(*),
    'unique_visitors', COUNT(DISTINCT viewer_ip_hash),
    'avg_duration', COALESCE(ROUND(AVG(duration_seconds)), 0),
    'top_country', (
      SELECT country FROM public.resume_views
      WHERE resume_id = p_resume_id AND country IS NOT NULL AND country != 'Unknown'
      GROUP BY country ORDER BY COUNT(*) DESC LIMIT 1
    )
  )
  INTO result
  FROM public.resume_views
  WHERE resume_id = p_resume_id;

  RETURN result;
END;
$$;

-- 8. Force PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
