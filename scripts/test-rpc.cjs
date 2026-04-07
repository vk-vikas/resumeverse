const { createClient } = require('./node_modules/@supabase/supabase-js');
const supabase = createClient(
  'https://kxngtkwhqznftmulxptd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4bmd0a3docXpuZnRtdWx4cHRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MDUzNDEsImV4cCI6MjA4ODk4MTM0MX0.xGBmj1ZVZqJQg6_yWdASuheWQHhrShXIpj1OihjDx78'
);

async function test() {
  var resumes = await supabase.from('resumes').select('id').limit(1);
  console.log('Resume:', JSON.stringify(resumes.data));
  if (!resumes.data || !resumes.data.length) return;
  var rid = resumes.data[0].id;

  // Test record_view
  var rv = await supabase.rpc('record_view', {
    p_resume_id: rid,
    p_viewer_ip_hash: 'test-hash-abc',
    p_user_agent: 'DebugScript',
    p_referrer: 'curl-test',
    p_country: 'India',
    p_city: 'Mumbai'
  });
  console.log('record_view:', JSON.stringify(rv.data), 'err:', rv.error ? rv.error.message : 'none');

  // Test get_resume_analytics
  var an = await supabase.rpc('get_resume_analytics', { p_resume_id: rid });
  console.log('analytics:', JSON.stringify(an.data), 'err:', an.error ? an.error.message : 'none');
}
test();
