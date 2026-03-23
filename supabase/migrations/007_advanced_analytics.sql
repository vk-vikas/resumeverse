-- ============================================================
-- Migration 007: Advanced Analytics DB Layer
-- Adds: event tracking table, bounce/scroll columns, 4 RPCs
-- All changes are purely ADDITIVE — zero breaking changes
-- ============================================================

-- 1. Add new columns to resume_views (additive only)
ALTER TABLE public.resume_views
  ADD COLUMN IF NOT EXISTS is_bounce BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS scroll_depth_pct INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS event_count INTEGER DEFAULT 0;

-- 2. Create the event tracking table
CREATE TABLE IF NOT EXISTS public.resume_view_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  view_id UUID NOT NULL REFERENCES public.resume_views(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  -- event_type values: 'click_contact' | 'click_download' | 'heatmap_click' | 'heatmap_scroll' | 'scroll_milestone'
  payload JSONB DEFAULT '{}',
  -- payload examples:
  --   click_contact:   { "href": "mailto:..." }
  --   click_download:  {}
  --   heatmap_click:   { "x_pct": 43.2, "y_pct": 71.8, "page": 1 }
  --   heatmap_scroll:  { "x_pct": 50.0, "y_pct": 55.0, "page": 1 }
  --   scroll_milestone:{ "pct": 75 }
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups by view_id
CREATE INDEX IF NOT EXISTS resume_view_events_view_id_idx
  ON public.resume_view_events(view_id);

-- Index for fast lookups by event_type
CREATE INDEX IF NOT EXISTS resume_view_events_type_idx
  ON public.resume_view_events(event_type);

-- 3. Enable RLS on the events table
ALTER TABLE public.resume_view_events ENABLE ROW LEVEL SECURITY;

-- Allow public insert (anonymous viewers tracking their interactions)
CREATE POLICY "Allow public insert to resume_view_events"
  ON public.resume_view_events FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow resume owners to read their events (via parent view ownership)
CREATE POLICY "Allow owners to read their resume_view_events"
  ON public.resume_view_events FOR SELECT
  USING (
    view_id IN (
      SELECT rv.id FROM public.resume_views rv
      JOIN public.resumes r ON r.id = rv.resume_id
      WHERE r.user_id = auth.uid()
    )
  );

-- ============================================================
-- RPC 1: record_event — insert a single interaction event
-- ============================================================
CREATE OR REPLACE FUNCTION record_event(
  p_view_id UUID,
  p_event_type TEXT,
  p_payload JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.resume_view_events (view_id, event_type, payload)
  VALUES (p_view_id, p_event_type, p_payload)
  RETURNING id INTO new_id;

  -- Also bump the event_count on the parent view for quick aggregation
  UPDATE public.resume_views
  SET event_count = event_count + 1
  WHERE id = p_view_id;

  RETURN new_id;
END;
$$;

-- ============================================================
-- RPC 2: mark_bounce — flag a view as a bounce (< 5s session)
-- ============================================================
CREATE OR REPLACE FUNCTION mark_bounce(p_view_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.resume_views
  SET is_bounce = true
  WHERE id = p_view_id;
END;
$$;

-- ============================================================
-- RPC 3: set_scroll_depth — update max scroll % (monotonic up)
-- ============================================================
CREATE OR REPLACE FUNCTION set_scroll_depth(p_view_id UUID, p_pct INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.resume_views
  SET scroll_depth_pct = GREATEST(scroll_depth_pct, p_pct)
  WHERE id = p_view_id;
END;
$$;

-- ============================================================
-- RPC 4: get_resume_heatmap_data — returns aggregated coords
-- for click and scroll heatmap rendering
-- ============================================================
CREATE OR REPLACE FUNCTION get_resume_heatmap_data(p_resume_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'clicks', (
      SELECT COALESCE(json_agg(rve.payload), '[]'::json)
      FROM public.resume_view_events rve
      JOIN public.resume_views rv ON rv.id = rve.view_id
      WHERE rv.resume_id = p_resume_id
        AND rve.event_type = 'heatmap_click'
    ),
    'scrolls', (
      SELECT COALESCE(json_agg(rve.payload), '[]'::json)
      FROM public.resume_view_events rve
      JOIN public.resume_views rv ON rv.id = rve.view_id
      WHERE rv.resume_id = p_resume_id
        AND rve.event_type = 'heatmap_scroll'
    ),
    'total_events', (
      SELECT COUNT(*)
      FROM public.resume_view_events rve
      JOIN public.resume_views rv ON rv.id = rve.view_id
      WHERE rv.resume_id = p_resume_id
    )
  ) INTO result;

  RETURN result;
END;
$$;

-- ============================================================
-- Update get_resume_analytics to include bounce_rate, deep_readers,
-- avg_scroll_depth, contact_clicks, download_clicks
-- ============================================================
CREATE OR REPLACE FUNCTION get_resume_analytics(p_resume_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    -- Existing metrics
    'total_views',      COUNT(*),
    'unique_visitors',  COUNT(DISTINCT viewer_ip_hash),
    'avg_duration',     COALESCE(ROUND(AVG(duration_seconds)), 0),
    'top_country', (
      SELECT country FROM public.resume_views
      WHERE resume_id = p_resume_id AND country IS NOT NULL AND country != 'Unknown'
      GROUP BY country ORDER BY COUNT(*) DESC LIMIT 1
    ),
    -- New metrics
    'bounce_rate', (
      CASE WHEN COUNT(*) = 0 THEN 0
        ELSE ROUND(100.0 * COUNT(*) FILTER (WHERE is_bounce = true) / COUNT(*))
      END
    ),
    'deep_reader_count',  COUNT(*) FILTER (WHERE duration_seconds > 60),
    'avg_scroll_depth',   COALESCE(ROUND(AVG(scroll_depth_pct)), 0),
    'contact_clicks', (
      SELECT COUNT(*) FROM public.resume_view_events rve
      JOIN public.resume_views rv ON rv.id = rve.view_id
      WHERE rv.resume_id = p_resume_id AND rve.event_type = 'click_contact'
    ),
    'download_clicks', (
      SELECT COUNT(*) FROM public.resume_view_events rve
      JOIN public.resume_views rv ON rv.id = rve.view_id
      WHERE rv.resume_id = p_resume_id AND rve.event_type = 'click_download'
    )
  )
  INTO result
  FROM public.resume_views
  WHERE resume_id = p_resume_id;

  RETURN result;
END;
$$;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
