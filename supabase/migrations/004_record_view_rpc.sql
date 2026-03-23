-- Fix: Create an RPC function to insert views, bypassing PostgREST schema cache entirely

CREATE OR REPLACE FUNCTION record_view(
  p_resume_id TEXT,
  p_viewer_ip_hash TEXT,
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
  
  -- Also increment the simple views counter on the resumes table
  UPDATE public.resumes SET views = COALESCE(views, 0) + 1 WHERE id = p_resume_id;
  
  RETURN new_id;
END;
$$;
