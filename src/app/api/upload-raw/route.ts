import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateSlug } from '@/lib/utils/slug';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    
    // Ensure the user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 1. Upload the raw file to Supabase Storage
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    const fileName = `${session.user.id}/${crypto.randomUUID()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('raw_resumes')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Storage error: ${uploadError.message}`);
    }

    // 2. Safely extract the public URL of the uploaded blob
    const { data: { publicUrl } } = supabase
      .storage
      .from('raw_resumes')
      .getPublicUrl(fileName);

    // 3. Generate a unique slug and insert the shortcut document into the `resumes` database
    const rawName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, ' ');
    const fallbackName = rawName || 'My Resume';
    const slug = generateSlug(fallbackName);

    const { data: dbData, error: dbError } = await supabase
      .from('resumes')
      .insert({
        user_id: session.user.id,
        slug: slug,
        theme: 'raw_pdf',
        data: { name: fallbackName, contact: {}, experience: [], education: [], skills: { languages: [], frameworks: [], tools: [] }, projects: [], summary: '', title: 'Tracked PDF' },
        original_file: publicUrl,
        is_public: true
      })
      .select('id, slug')
      .single();

    if (dbError) {
      throw new Error(`Database routing error: ${dbError.message}`);
    }

    // Successfully onboarded the fast-track PDF
    return NextResponse.json({ 
      success: true, 
      resumeId: dbData.id,
      slug: dbData.slug 
    });

  } catch (error: any) {
    console.error('Fast-Track Upload Failed:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
