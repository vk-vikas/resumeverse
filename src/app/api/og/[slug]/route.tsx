import { ImageResponse } from 'next/og';
import { createClient } from '@/lib/supabase/server';
import type { ResumeData } from '@/types/resume';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Create Supabase client in the Edge runtime
    const supabase = await createClient();

    // Fetch resume data
    const { data: resume, error } = await supabase
      .from('resumes')
      .select('data')
      .eq('slug', slug)
      .eq('is_public', true)
      .single();

    if (error || !resume) {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#0a0a0a',
              backgroundImage: 'linear-gradient(to bottom right, #0a0a0a, #1a1a1a)',
              color: 'white',
              fontFamily: 'sans-serif',
            }}
          >
            <h1 style={{ fontSize: 60, fontWeight: 900, marginBottom: 10, letterSpacing: '-0.02em' }}>
              Resume<span style={{ color: '#3b82f6' }}>Verse</span>
            </h1>
            <p style={{ fontSize: 24, color: '#a3a3a3' }}>Interactive Developer Portfolios</p>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    const { data } = resume as { data: ResumeData };
    
    // Fallbacks
    const name = data.name || 'Anonymous Developer';
    const title = data.title || 'Interactive Resume';
    
    // Grab top 4 skills from anywhere available
    const rawSkills = [
      ...(data.skills?.languages || []),
      ...(data.skills?.frameworks || []),
      ...(data.skills?.tools || [])
    ];
    // Remove duplicates and take top 4
    const topSkills = Array.from(new Set(rawSkills)).slice(0, 4);

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#0a0a0a',
            backgroundImage: 'linear-gradient(to bottom right, #0a0a0a, #111111)',
            color: 'white',
            fontFamily: 'sans-serif',
            padding: '80px 100px',
            position: 'relative',
          }}
        >
          {/* Decorative Grid Lines / Orbs */}
          <div style={{ position: 'absolute', top: -200, left: -200, width: 600, height: 600, background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: -200, right: -100, width: 800, height: 800, background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }} />

          {/* Main Content Area */}
          <div style={{ display: 'flex', flexDirection: 'column', zIndex: 10 }}>
            {/* Logo Watermark Top Right */}
            <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', alignItems: 'center', fontSize: 24, fontWeight: 'bold', color: '#525252' }}>
              Resume<span style={{ color: '#3b82f6' }}>Verse</span>
            </div>

            <h1 style={{ 
              fontSize: 84, 
              fontWeight: 900, 
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: 20,
              maxWidth: 900,
              display: 'flex',
              flexWrap: 'wrap'
            }}>
              {name}
            </h1>
            
            <h2 style={{ 
              fontSize: 42, 
              fontWeight: 400, 
              color: '#3b82f6', // blue-500
              margin: 0,
              marginBottom: 60,
              letterSpacing: '-0.01em'
            }}>
              {title}
            </h2>

            {/* Skills Row */}
            {topSkills.length > 0 && (
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {topSkills.map((skill, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      padding: '12px 24px', 
                      backgroundColor: '#1f2937', // gray-800
                      borderRadius: '100px',
                      fontSize: 24,
                      fontWeight: 500,
                      color: '#f3f4f6', // gray-100
                      border: '1px solid #374151', // gray-700
                      display: 'flex',
                    }}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Footer CTA */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderTop: '1px solid #262626', // neutral-800
            paddingTop: '40px',
            zIndex: 10
          }}>
            <div style={{ fontSize: 28, color: '#a3a3a3', display: 'flex', alignItems: 'center' }}>
              View interactive resumé
              <span style={{ marginLeft: 12, color: '#3b82f6' }}>→</span>
            </div>
            <div style={{ fontSize: 28, color: '#525252', fontFamily: 'monospace' }}>
              resumeverse.com/{slug}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error('Error generating OG image:', e);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
