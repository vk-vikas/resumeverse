-- RPC to fetch detailed view records for the analytics page (bypasses PostgREST cache)
CREATE OR REPLACE FUNCTION get_resume_view_records(p_resume_id UUID, p_since TIMESTAMPTZ DEFAULT now() - interval '30 days')
RETURNS TABLE (
  id UUID,
  resume_id UUID,
  created_at TIMESTAMPTZ,
  referrer TEXT,
  user_agent TEXT,
  viewer_ip_hash TEXT,
  country TEXT,
  city TEXT,
  duration_seconds INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
    SELECT rv.id, rv.resume_id, rv.created_at, rv.referrer, rv.user_agent, rv.viewer_ip_hash, rv.country, rv.city, rv.duration_seconds
    FROM public.resume_views rv
    WHERE rv.resume_id = p_resume_id
    AND rv.created_at >= p_since
    ORDER BY rv.created_at ASC;
END;
$$;
