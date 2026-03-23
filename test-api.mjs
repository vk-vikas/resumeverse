import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Fetching a valid resume ID from db...');
  const { data: resumes, error: dbErr } = await supabase.from('resumes').select('id').limit(1);
  if (dbErr || !resumes.length) {
    console.log('DB Error or no resumes:', dbErr);
    return;
  }
  
  const resumeId = resumes[0].id;
  console.log(`Found resume: ${resumeId}, testing POST /api/track-view...`);
  
  const res = await fetch('http://localhost:3000/api/track-view', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': 'Test' },
    body: JSON.stringify({ resumeId, referrer: 'test' })
  });
  
  const json = await res.json();
  console.log('POST Response:', json);
}
run();
