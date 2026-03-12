# 🚀 ResumeVerse — Master Execution Plan

> **What:** A web app where users upload their PDF/DOCX resume and AI transforms it into a beautiful, interactive, shareable website.
>
> **Stack:** Next.js 14 · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · GSAP · Lenis · D3-force · Recharts · Google Gemini AI · Supabase · Docker · Vitest · React Testing Library · Vercel
>
> **Cost:** $0 (all free tiers)

---

## How to Use This Plan

1. Open this file in Cursor
2. Switch to **Agent mode**
3. For each task, say: _"Execute Task X from master-plan.md"_
4. Review the output, test it, then commit
5. Move to the next task

Each task is **atomic** — it builds one feature end-to-end and results in a working state. Tasks are ordered by dependency.

---

## Pre-requisites

Before starting, make sure you have:
- Node.js 20+ installed
- npm or pnpm installed
- A Google Gemini API key (free from https://aistudio.google.com/app/apikey)
- A Supabase account (free from https://supabase.com)
- A GitHub account
- Docker Desktop installed (for Task 16)

---

## Task Dependency Graph

```
Task 1 (Project Setup)
  ├── Task 2 (TypeScript Types & Zod Schemas)
  │     ├── Task 3 (Supabase Setup)
  │     │     ├── Task 7 (Publish & Share Flow)
  │     │     ├── Task 9 (Auth)
  │     │     └── Task 10 (Dashboard)
  │     ├── Task 4 (File Upload Component)
  │     │     └── Task 5 (AI Parsing)
  │     │           └── Task 6 (Resume Editor)
  │     │                 └── Task 7 (Publish & Share)
  │     └── Task 8 (Bento Theme)
  │           ├── Task 11 (Journey Theme)
  │           └── Task 12 (Terminal Theme)
  │
  Task 7 → Task 13 (OG Images & QR Code)
  Task 10 → Task 14 (Analytics)
  Task 5 → Task 15 (AI Bullet Enhancer)
  All features → Task 16 (Docker)
  All features → Task 17 (Tests)
  All features → Task 18 (Landing Page & Polish)
```

---

## 📦 TASK 1: Project Setup & Configuration

### Goal
Initialize the Next.js project with all configurations, dependencies, and folder structure.

### What to do
1. Create a new Next.js 14 project with App Router, TypeScript, Tailwind CSS, ESLint, and src directory
2. Install ALL dependencies (see list below)
3. Initialize shadcn/ui and add required components
4. Set up the folder structure (empty files are fine — just create the directories)
5. Configure `next.config.js` with `output: 'standalone'`
6. Create `.env.local.example` with all required environment variable names
7. Create a `.gitignore` that covers everything
8. Create utility files: `src/lib/utils/cn.ts` (clsx + tailwind-merge helper)

### Dependencies to install

**Production:**
```
@google/generative-ai @supabase/supabase-js @supabase/ssr
pdf-parse mammoth
framer-motion gsap lenis
d3-force recharts
@tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
qrcode.react html-to-image
zod slugify date-fns lucide-react sonner clsx tailwind-merge
```

**Dev:**
```
@types/d3-force @types/pdf-parse
vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### shadcn/ui components to add
```
button card dialog input textarea tabs toast dropdown-menu skeleton badge separator avatar sheet scroll-area select label switch tooltip
```

### Folder structure to create
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (placeholder: "ResumeVerse - Coming Soon")
│   ├── globals.css
│   ├── (auth)/login/page.tsx (placeholder)
│   ├── (auth)/callback/route.ts (placeholder)
│   ├── dashboard/page.tsx (placeholder)
│   ├── editor/[id]/page.tsx (placeholder)
│   ├── [slug]/page.tsx (placeholder)
│   └── api/
│       ├── parse-resume/route.ts (placeholder)
│       ├── enhance/route.ts (placeholder)
│       └── og/[slug]/route.tsx (placeholder)
├── components/
│   ├── ui/ (shadcn components go here)
│   ├── upload/
│   ├── editor/
│   └── landing/
├── themes/
│   ├── bento/
│   ├── journey/
│   └── terminal/
├── lib/
│   ├── supabase/
│   ├── ai/
│   ├── parsers/
│   └── utils/
├── types/
└── test/
```

### .env.local.example
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Acceptance criteria
- [ ] `npm run dev` starts without errors
- [ ] Visiting `localhost:3000` shows the placeholder page
- [ ] All folders and placeholder files exist
- [ ] `vitest.config.ts` is set up and `npm test` runs (even if 0 tests)
- [ ] Tailwind CSS works (test with a colored div)
- [ ] shadcn/ui components are importable

### Agent prompt
> Set up a new Next.js 14 project called "resumeverse" in the current directory. Use App Router, TypeScript, Tailwind CSS, ESLint, and src directory. Install all the dependencies listed in Task 1 of master-plan.md. Initialize shadcn/ui with the "new-york" style and zinc base color, and add all the listed components. Create the complete folder structure with placeholder files. Set up vitest.config.ts for testing. Make sure `npm run dev` works.

---

## 📐 TASK 2: TypeScript Types & Zod Schemas

### Goal
Define the core data types and validation schemas that every other part of the app depends on.

### What to do
1. Create `src/types/resume.ts` — the core `ResumeData` TypeScript interface
2. Create `src/lib/utils/schema.ts` — Zod schemas that validate the same shape
3. Create `src/lib/utils/slug.ts` — slug generation utility function

### src/types/resume.ts
```typescript
export interface ContactInfo {
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  location?: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  startDate: string;       // "YYYY-MM" format
  endDate: string;          // "YYYY-MM" or "present"
  location?: string;
  bullets: string[];
  skillsUsed?: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  field?: string;
  year: string;             // "2020" or "2018-2022"
  gpa?: string;
}

export interface ProjectItem {
  name: string;
  description: string;
  tech: string[];
  link?: string;
}

export interface SkillsData {
  languages: string[];
  frameworks: string[];
  tools: string[];
  soft?: string[];
}

export interface ResumeData {
  name: string;
  title: string;
  summary: string;
  contact: ContactInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillsData;
  projects: ProjectItem[];
  certifications?: string[];
  highlights?: string[];
}

export type ThemeType = 'bento' | 'journey' | 'terminal';

export interface SavedResume {
  id: string;
  userId: string;
  slug: string;
  theme: ThemeType;
  data: ResumeData;
  originalFile?: string;
  isPublic: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}
```

### src/lib/utils/schema.ts
Create Zod schemas that mirror the types above. The `resumeSchema` should:
- Require `name` (min 1 char), `title` (min 1 char), `summary` (min 1 char)
- Require `experience` to be an array with at least 0 items (can be empty), but each item must have `company`, `role`, `startDate`, `endDate`, and `bullets` (min 1 bullet per experience)
- Require `skills` with at least one non-empty array
- Make `projects`, `certifications`, `highlights` optional
- Export a `validateResumeData` function that takes unknown input and returns `{ success: true, data: ResumeData } | { success: false, errors: string[] }`

### src/lib/utils/slug.ts
Create a `generateSlug` function that:
- Converts name to lowercase
- Replaces spaces with hyphens
- Removes special characters (apostrophes, periods, commas)
- Handles unicode (é → e, ñ → n)
- Trims whitespace
- Appends a 4-character random suffix to avoid collisions: `john-doe-x7k2`
- Export a `sanitizeSlug` function for custom slugs (user-chosen): validates it's URL-safe, lowercase, 3-50 chars

### Acceptance criteria
- [ ] Types are importable from `@/types/resume`
- [ ] Zod schema correctly validates a complete resume object
- [ ] Zod schema rejects invalid data with meaningful errors
- [ ] `generateSlug("John Doe")` returns something like `"john-doe-x7k2"`
- [ ] `generateSlug("José García")` returns something like `"jose-garcia-a3m1"`

### Agent prompt
> Execute Task 2 from master-plan.md. Create the TypeScript types in src/types/resume.ts, Zod validation schemas in src/lib/utils/schema.ts, and slug utility in src/lib/utils/slug.ts. Follow the exact interfaces and requirements specified in the task.

---

## 🗄️ TASK 3: Supabase Setup

### Goal
Set up Supabase client, database schema, auth configuration, and storage bucket.

### What to do
1. Create `src/lib/supabase/client.ts` — browser-side Supabase client (uses `createBrowserClient` from `@supabase/ssr`)
2. Create `src/lib/supabase/server.ts` — server-side Supabase client (uses `createServerClient` from `@supabase/ssr` with cookies)
3. Create `src/lib/supabase/middleware.ts` — middleware helper for refreshing auth tokens
4. Create `src/middleware.ts` (app root) — Next.js middleware that calls the Supabase middleware helper on every request to refresh sessions
5. Create `supabase/migrations/001_initial_schema.sql` — the SQL migration file with the full database schema

### Database schema (SQL)
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Resumes table
CREATE TABLE public.resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  theme TEXT NOT NULL DEFAULT 'bento' CHECK (theme IN ('bento', 'journey', 'terminal')),
  data JSONB NOT NULL,
  original_file TEXT,
  is_public BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast slug lookups
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

-- View analytics table
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

-- Updated_at trigger
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
```

### Storage bucket
- Create a note/comment in the code that the user needs to create a `resumes` storage bucket in Supabase dashboard with public access disabled

### Supabase client pattern
- Browser client: use `createBrowserClient(url, anonKey)` from `@supabase/ssr`
- Server client: use `createServerClient(url, anonKey, { cookies })` from `@supabase/ssr` with Next.js cookies()
- Middleware: refresh session tokens on every request

### Acceptance criteria
- [ ] Supabase clients are importable from `@/lib/supabase/client` and `@/lib/supabase/server`
- [ ] Middleware refreshes auth tokens on every request
- [ ] SQL migration file is ready to run in Supabase SQL editor
- [ ] RLS policies are correctly defined

### Agent prompt
> Execute Task 3 from master-plan.md. Create the Supabase browser client, server client, and middleware helper. Create the SQL migration file with the complete database schema including RLS policies. Follow the exact specifications in the task.

---

## 📤 TASK 4: File Upload Component

### Goal
Build the drag-and-drop file upload UI component with validation and preview.

### What to do
1. Create `src/components/upload/dropzone.tsx` — the main drag & drop upload component
2. Create `src/components/upload/file-preview.tsx` — shows uploaded file info (name, size, type, icon)
3. Create `src/lib/parsers/pdf-parser.ts` — extracts text from PDF using pdf-parse
4. Create `src/lib/parsers/docx-parser.ts` — extracts text from DOCX using mammoth

### Dropzone component specs
- Full-width drag & drop zone with dashed border
- Accepts only `.pdf` and `.docx` files
- Max file size: 5MB
- Shows upload icon and "Drag & drop your resume, or click to browse" text
- On hover/drag-over: border color changes, background highlights
- After file selected: shows FilePreview component with file info
- Shows error messages for invalid file types or sizes
- Has an `onFileSelect: (file: File) => void` callback prop
- Has a `isLoading: boolean` prop to show loading state (while AI parses)
- Uses Framer Motion for enter/exit animations
- Uses shadcn/ui Card as wrapper
- Accessible: proper aria labels, keyboard navigation, screen reader text
- The hidden file `<input>` should have `aria-label="Upload your resume"` for testing

### File parsers
- `pdf-parser.ts`: export `extractTextFromPDF(buffer: Buffer): Promise<string>` — uses pdf-parse to extract all text
- `docx-parser.ts`: export `extractTextFromDOCX(buffer: Buffer): Promise<string>` — uses mammoth to convert to plain text

### Acceptance criteria
- [ ] Dropzone renders with upload instructions
- [ ] Accepts PDF and DOCX files via click or drag & drop
- [ ] Rejects other file types with error message "Only PDF and DOCX files are accepted"
- [ ] Rejects files over 5MB with error message
- [ ] Shows file preview after selection
- [ ] Loading state shows skeleton/spinner
- [ ] PDF parser extracts text correctly
- [ ] DOCX parser extracts text correctly

### Agent prompt
> Execute Task 4 from master-plan.md. Build the Dropzone upload component in src/components/upload/dropzone.tsx and FilePreview in src/components/upload/file-preview.tsx. Also create the PDF and DOCX parser utilities. The Dropzone should support drag & drop, validate file types (PDF/DOCX only, max 5MB), show error messages, and use Framer Motion for animations. Follow the exact specs in the task.

---

## 🤖 TASK 5: AI Resume Parsing

### Goal
Build the API route and AI logic that takes raw resume text and returns structured JSON.

### What to do
1. Create `src/lib/ai/gemini.ts` — Gemini API client initialization
2. Create `src/lib/ai/parse-resume.ts` — the parsing prompt and response handling logic
3. Create `src/app/api/parse-resume/route.ts` — the API route that handles file upload, text extraction, and AI parsing
4. Update the landing page (`src/app/page.tsx`) to include the upload flow and show parsed results

### Gemini client (src/lib/ai/gemini.ts)
```typescript
// Initialize the Gemini client with the API key from env
// Export a function getGeminiModel() that returns the generative model
// Use 'gemini-1.5-flash' model
```

### Parse resume logic (src/lib/ai/parse-resume.ts)
- Export `parseResumeText(rawText: string): Promise<ResumeData>`
- The prompt should:
  - Tell the AI it's a professional resume parser
  - Provide the exact JSON schema it should output (matching ResumeData type)
  - Tell it to return ONLY valid JSON, no markdown fences, no explanation
  - Handle edge cases: missing sections should use empty arrays/strings, not null
  - If a section is ambiguous, make a best guess
- After getting the AI response:
  - Try to parse as JSON
  - If the response has markdown fences (```json ... ```), strip them first
  - Validate with Zod schema from Task 2
  - If validation fails, return a default structure with whatever was parsed
- Export a helper `parseAIResponse(rawResponse: string): Record<string, unknown>` that handles JSON extraction from various AI response formats (raw JSON, markdown-wrapped JSON, etc.)

### API route (src/app/api/parse-resume/route.ts)
- Accept POST with FormData containing a file
- Determine file type from the file's type/extension
- Call the appropriate parser (PDF or DOCX)
- Pass extracted text to `parseResumeText()`
- Return the structured ResumeData JSON
- Handle errors gracefully (return 400 for bad files, 500 for AI failures)
- Add a simple rate limit: if more than 5 requests from same IP in 1 minute, return 429

### Update landing page
- Import and use the Dropzone component
- On file select: upload to `/api/parse-resume`, show loading state
- On success: display the parsed JSON in a formatted preview (temporary — the editor will replace this later)
- On error: show error toast using sonner

### Acceptance criteria
- [ ] Uploading a PDF returns structured ResumeData JSON
- [ ] Uploading a DOCX returns structured ResumeData JSON
- [ ] The parsed data matches the ResumeData TypeScript type
- [ ] AI handles various resume formats (chronological, functional, etc.)
- [ ] Error handling works for invalid files and AI failures
- [ ] The landing page shows upload → loading → parsed result flow

### Agent prompt
> Execute Task 5 from master-plan.md. Create the Gemini AI client in src/lib/ai/gemini.ts, the resume parsing logic in src/lib/ai/parse-resume.ts, and the API route in src/app/api/parse-resume/route.ts. Also update the landing page to use the Dropzone component and display parsed results. The AI should parse raw resume text into structured JSON matching the ResumeData type, with Zod validation. Handle edge cases where AI returns markdown-wrapped JSON.

---

## ✏️ TASK 6: Resume Editor

### Goal
Build the side-by-side editor where users can review and modify their parsed resume data before publishing.

### What to do
1. Create `src/components/editor/resume-editor.tsx` — main editor container (left panel)
2. Create `src/components/editor/section-editor.tsx` — reusable section editor (for experience, education, etc.)
3. Create `src/components/editor/theme-selector.tsx` — theme picker with visual previews
4. Create `src/components/editor/live-preview.tsx` — right panel that renders the selected theme
5. Create `src/app/editor/[id]/page.tsx` — the editor page

### Resume editor component
- Two-column layout: left = form editor (scrollable), right = live preview (sticky)
- On mobile: tabs to switch between editor and preview
- Sections in the editor (each collapsible):
  - **Personal Info**: name, title, summary (textarea), contact fields
  - **Experience**: list of experience items, each with company, role, dates, bullets (add/remove/reorder)
  - **Education**: list of education items
  - **Skills**: three input groups (languages, frameworks, tools) — comma-separated or tag input
  - **Projects**: list of project items
- Each text field should be editable inline
- Add/remove buttons for list items (experience entries, bullets, skills)
- The editor should maintain state locally and pass changes up via `onChange: (data: ResumeData) => void`
- Use shadcn/ui components: Input, Textarea, Card, Button, Separator, Badge (for skills)

### Theme selector component
- Horizontal row of 3 theme cards
- Each card shows: theme name, short description, and a small visual preview/thumbnail (can be a static image or styled div)
- Selected theme has a highlighted border and checkmark
- `aria-selected` attribute on the selected theme button
- Props: `themes: ThemeType[]`, `selected: ThemeType`, `onSelect: (theme: ThemeType) => void`

### Live preview component
- Renders the selected theme component with current resume data
- Wraps in a scaled-down container (like a browser preview)
- Shows a fake browser chrome bar at top (optional but nice touch)
- Responsive: shows at 60% scale on the right panel
- Re-renders in real-time as the user edits

### Editor page (src/app/editor/[id]/page.tsx)
- For now, `id` can be "new" for a fresh resume
- Receives parsed data via URL state, localStorage, or a temporary store
- Layout: full-height, split-screen
- Top bar: "Back" button, auto-save indicator, "Publish" button (disabled for now — enabled in Task 7)
- Store the current editor state in a React context or zustand store

### Flow
```
User uploads resume (Task 5) → AI parses it → redirect to /editor/new with parsed data
→ User edits content in left panel → right panel updates live
→ User selects theme → preview switches to that theme
→ User clicks "Publish" (Task 7)
```

### Acceptance criteria
- [ ] Editor shows all parsed resume fields in editable form
- [ ] Changes in editor reflect immediately in the live preview
- [ ] Theme selector shows all 3 themes and switches preview
- [ ] Can add/remove experience entries and bullets
- [ ] Can add/remove skill tags
- [ ] Responsive: works on mobile with tabs (editor/preview toggle)
- [ ] Editor preserves data on theme switch (no data loss)

### Agent prompt
> Execute Task 6 from master-plan.md. Build the resume editor at src/components/editor/resume-editor.tsx with all sub-components (section-editor, theme-selector, live-preview). Create the editor page at src/app/editor/[id]/page.tsx. The editor should be a split-screen with form editing on the left and live theme preview on the right. Follow all the specs in the task including add/remove for list items, theme selection with aria-selected, and real-time preview updates.

---

## 🔗 TASK 7: Publish & Share Flow

### Goal
Enable users to save their resume to Supabase and get a shareable link.

### What to do
1. Create `src/app/[slug]/page.tsx` — the public shareable resume page
2. Add publish logic to the editor page — save to Supabase, generate slug, redirect
3. Create a publish success dialog that shows the shareable link and QR code
4. Add metadata generation for SEO and social sharing

### Shareable page (src/app/[slug]/page.tsx)
- This is a **Server Component**
- Fetches resume data from Supabase by slug using the server client
- If not found or not public → show 404 (use `notFound()` from next/navigation)
- Renders the appropriate theme based on `resume.theme`
- Increments the view counter (fire-and-forget, don't block rendering)
- Logs a view to `resume_views` table with referrer and user-agent
- Export `generateMetadata` function for dynamic SEO:
  - title: "{name} — {title}"
  - description: summary (first 160 chars)
  - openGraph image: `/api/og/${slug}` (placeholder for now — Task 13)

### Publish logic (in editor page)
- On "Publish" click:
  1. Validate the resume data with Zod schema
  2. If user is not authenticated → redirect to login (Task 9 will handle this, for now skip auth check)
  3. Generate a slug from the name using `generateSlug()`
  4. Check if slug is taken (query Supabase) → if so, regenerate with different suffix
  5. Upload original file to Supabase Storage (if available)
  6. Insert resume record into `resumes` table
  7. Show success dialog with shareable link

### Publish success dialog
- Modal dialog using shadcn/ui Dialog
- Shows:
  - ✅ "Your resume is live!" message
  - The shareable URL (with copy button)
  - QR code (using qrcode.react)
  - "Open in new tab" button
  - "Share on LinkedIn" and "Share on Twitter" buttons (simple URL-based sharing)
- Copy button: copies URL to clipboard, shows "Copied!" toast

### Acceptance criteria
- [ ] Clicking Publish saves resume data to Supabase
- [ ] A unique slug is generated and used for the URL
- [ ] Success dialog shows with shareable link and QR code
- [ ] Visiting the shareable link renders the resume with the correct theme
- [ ] 404 page shows for non-existent slugs
- [ ] View counter increments on each visit
- [ ] Social sharing buttons work (LinkedIn, Twitter)
- [ ] Meta tags are correctly set for social previews

### Agent prompt
> Execute Task 7 from master-plan.md. Build the shareable resume page at src/app/[slug]/page.tsx that fetches resume data from Supabase and renders the chosen theme. Add publish logic to the editor page that saves to Supabase and generates a unique slug. Create a publish success dialog showing the shareable link, QR code, and social sharing buttons. Add SEO metadata generation.

---

## 🎨 TASK 8: Bento Theme

### Goal
Build the first visual theme — a modern bento grid layout with animated cards.

### What to do
1. Create `src/themes/bento/bento-theme.tsx` — main theme container
2. Create `src/themes/bento/hero-card.tsx` — large hero card with name, title, summary
3. Create `src/themes/bento/experience-card.tsx` — experience item card
4. Create `src/themes/bento/skills-card.tsx` — visual skills display
5. Create `src/themes/bento/education-card.tsx` — education section
6. Create `src/themes/bento/projects-card.tsx` — projects section
7. Create `src/themes/bento/contact-card.tsx` — contact links with icons
8. Create `src/themes/types.ts` — shared theme prop types

### Design specs
- **Overall**: Dark background (#0a0a0a), grid layout with gap, max-width 1200px centered
- **Grid**: CSS Grid with auto-fit columns. Hero spans 2 cols, other cards 1 col. Responsive: single column on mobile
- **Cards**: Rounded-2xl, subtle border (#1a1a1a), background (#111), hover: slight lift + border glow
- **Typography**: Clean sans-serif (Inter), name in 3xl-4xl bold white, title in xl neutral-400, body in neutral-300
- **Animations** (Framer Motion):
  - Cards stagger-fade-in on page load (0.1s delay between each)
  - Cards have subtle hover: `y: -4, scale: 1.01` with spring transition
  - Skills tags animate in sequentially
- **Hero card**: Spans 2 columns. Shows name (large), title, summary. Optional: gradient accent line at top
- **Experience cards**: Company name bold, role + dates, bullet points. Timeline dot/line connecting entries
- **Skills card**: Tags/badges grouped by category (languages, frameworks, tools), each a styled badge
- **Education card**: Institution, degree, year in a clean layout
- **Projects card**: Project name, description, tech tags, optional link
- **Contact card**: Icons (mail, phone, linkedin, github, globe) with hover effects. Links are clickable

### All theme components receive `data: ResumeData` as prop
- Export from `src/themes/types.ts`:
```typescript
export interface ThemeProps {
  data: ResumeData;
}
```

### Acceptance criteria
- [ ] Bento theme renders all resume sections in a beautiful grid
- [ ] Layout is responsive (1 column mobile, 2-3 columns desktop)
- [ ] Cards animate in on page load with stagger effect
- [ ] Cards have hover effects
- [ ] All data from ResumeData is displayed
- [ ] Links in contact section are clickable
- [ ] Looks professional and modern
- [ ] No horizontal scroll on any screen size

### Agent prompt
> Execute Task 8 from master-plan.md. Build the Bento theme at src/themes/bento/ with all sub-components: hero-card, experience-card, skills-card, education-card, projects-card, contact-card. Use a dark (#0a0a0a) bento grid layout with rounded cards, Framer Motion stagger animations, and hover effects. The design should look like a premium, modern dashboard (Linear/Vercel aesthetic). Follow all design specs in the task.

---

## 🔐 TASK 9: Authentication

### Goal
Add Google and GitHub OAuth login so users can save and manage their resumes.

### What to do
1. Create `src/app/(auth)/login/page.tsx` — login page with OAuth buttons
2. Create `src/app/(auth)/callback/route.ts` — OAuth callback handler
3. Add auth state management — a provider or hook for checking auth state
4. Protect the editor and dashboard routes — redirect to login if not authenticated
5. Add user menu to the top navigation (avatar, name, logout)
6. Update the upload flow: if user is not logged in, prompt them to login after parsing (before going to editor)

### Login page
- Clean, centered layout
- "Sign in to ResumeVerse" heading
- "Continue with Google" button (with Google icon)
- "Continue with GitHub" button (with GitHub icon)
- Subtle branding/logo at top
- Uses Supabase Auth `signInWithOAuth({ provider: 'google' | 'github' })`
- Redirect URL: `/callback`

### Callback route
- Handles the OAuth callback
- Exchanges the code for a session
- Redirects to `/dashboard` (or back to where user was trying to go)

### Auth hook
- Create `src/hooks/use-auth.ts` or use Supabase's built-in listener
- Provides: `user`, `isLoading`, `isAuthenticated`, `signOut()`
- Updates in real-time when auth state changes

### Route protection
- Editor page (`/editor/[id]`): redirect to `/login` if not authenticated
- Dashboard page (`/dashboard`): redirect to `/login` if not authenticated
- Shareable pages (`/[slug]`): NO authentication required (public)

### Note
- The user needs to enable Google and GitHub providers in Supabase Dashboard → Authentication → Providers
- Add a note/comment about this in the login page or README

### Acceptance criteria
- [ ] Login page renders with Google and GitHub buttons
- [ ] OAuth flow works (login → callback → redirect to dashboard)
- [ ] Auth state is accessible throughout the app
- [ ] Protected routes redirect to login when not authenticated
- [ ] User can sign out
- [ ] Shareable resume pages remain public (no auth required)

### Agent prompt
> Execute Task 9 from master-plan.md. Build the authentication system with Google and GitHub OAuth using Supabase Auth. Create the login page at src/app/(auth)/login/page.tsx with OAuth buttons, the callback route, and an auth hook. Protect the editor and dashboard routes. Public resume pages ([slug]) should NOT require authentication.

---

## 📊 TASK 10: Dashboard

### Goal
Build the user dashboard where they can see and manage all their saved resumes.

### What to do
1. Create `src/app/dashboard/page.tsx` — dashboard page with resume list
2. Create `src/components/dashboard/resume-card.tsx` — card showing a saved resume with actions
3. Add ability to: view, edit, delete, toggle public/private for each resume
4. Show basic stats: total views across all resumes

### Dashboard page
- Header: "Your Resumes" + "Create New" button
- Grid of resume cards (or empty state if no resumes)
- Each card shows:
  - Resume name/title
  - Theme badge (bento/journey/terminal)
  - Created date
  - View count
  - Status badge (public/private)
  - Actions: Open link, Edit, Delete, Toggle visibility
- Empty state: friendly illustration/icon + "Upload your first resume" CTA
- Stats bar at top: "Total resumes: X | Total views: X"

### Actions
- **Open link**: opens `/slug` in new tab
- **Edit**: navigates to `/editor/[id]` with existing data
- **Delete**: confirmation dialog → deletes from Supabase
- **Toggle visibility**: toggles `is_public` in Supabase

### Acceptance criteria
- [ ] Dashboard shows all resumes for the logged-in user
- [ ] Each resume card shows name, theme, date, views, status
- [ ] Can open shareable link from dashboard
- [ ] Can navigate to editor to edit an existing resume
- [ ] Can delete a resume with confirmation
- [ ] Can toggle public/private
- [ ] Empty state shows when no resumes exist
- [ ] Only shows resumes owned by the current user (RLS)

### Agent prompt
> Execute Task 10 from master-plan.md. Build the user dashboard at src/app/dashboard/page.tsx with a grid of resume cards. Each card shows the resume name, theme, creation date, view count, and visibility status. Add actions for opening the shareable link, editing, deleting (with confirmation dialog), and toggling visibility. Include an empty state for new users.

---

## 🌊 TASK 11: Journey Theme (Scroll-Driven)

### Goal
Build the second theme — a full-page, scroll-driven storytelling experience.

### What to do
1. Create `src/themes/journey/journey-theme.tsx` — main theme container
2. Create `src/themes/journey/parallax-hero.tsx` — full-screen hero with parallax
3. Create `src/themes/journey/scroll-section.tsx` — reusable scroll-animated section wrapper
4. Create `src/themes/journey/timeline.tsx` — animated career timeline
5. Create `src/themes/journey/skill-bars.tsx` — animated skill bars that fill on scroll
6. Create `src/themes/journey/contact-section.tsx` — contact section

### Design specs
- **Overall**: Full-width, section-based layout. Each section is near full-viewport height. Light/cream background with dark text OR dark theme — pick one that looks best
- **Smooth scrolling**: Initialize Lenis for buttery smooth scroll
- **Hero section** (100vh):
  - Name in very large (5xl-7xl) text, centered
  - Title below in lighter weight
  - Summary text fades in after a short delay
  - Subtle parallax: background element moves slower than text
  - Scroll indicator arrow at bottom (animated bounce)
- **Experience timeline**:
  - Vertical timeline line that draws itself as user scrolls (SVG path with GSAP drawSVG or clip-path)
  - Each experience item appears from left/right alternating as user scrolls to it
  - Company name, role, dates, bullets all animate in with stagger
  - Use GSAP ScrollTrigger for all scroll animations
- **Skills section**:
  - Skill bars that fill from 0% to their value when scrolled into view
  - Or: skill tags that pop in sequentially
  - Grouped by category with section headers
- **Education section**: Simple, elegant cards that fade-slide in
- **Projects section**: Cards with hover effects, tech tags
- **Contact section**: Full-width footer with contact info and links. Centered, clean.

### GSAP + Lenis integration
- Initialize Lenis in the main theme component
- Create GSAP ScrollTrigger animations in useEffect/useLayoutEffect with proper cleanup
- Important: use `useGSAP` hook pattern or clean up on unmount to avoid memory leaks
- Use `ScrollTrigger.refresh()` after Lenis updates

### Acceptance criteria
- [ ] Page has smooth scrolling via Lenis
- [ ] Hero section fills viewport with parallax effect
- [ ] Career timeline draws/reveals on scroll
- [ ] Experience items animate in as user scrolls to them
- [ ] Skill bars/tags animate in on scroll
- [ ] All sections have scroll-triggered animations
- [ ] Works on mobile (simplified animations OK)
- [ ] No janky scroll or layout shifts
- [ ] All resume data is displayed

### Agent prompt
> Execute Task 11 from master-plan.md. Build the Journey scroll-driven theme at src/themes/journey/ using GSAP ScrollTrigger and Lenis for smooth scrolling. Create a full-page storytelling experience with a parallax hero, scroll-animated career timeline, skill bars that fill on scroll, and staggered content reveals. Follow the design specs in the task. Make sure to properly initialize and clean up GSAP animations.

---

## 💻 TASK 12: Terminal Theme

### Goal
Build the third theme — a terminal/hacker aesthetic where visitors explore the resume via commands.

### What to do
1. Create `src/themes/terminal/terminal-theme.tsx` — main theme container
2. Create `src/themes/terminal/command-line.tsx` — the interactive command input
3. Create `src/themes/terminal/terminal-output.tsx` — renders output for different commands
4. Create `src/themes/terminal/typing-effect.tsx` — reusable typewriter text animation

### Design specs
- **Overall**: Fullscreen dark terminal (background: #0d1117 or pure black). Monospace font (JetBrains Mono). Green or amber text (#00ff41 or #ffb700). Scanline CSS overlay effect (optional). CRT curvature effect (optional, subtle)
- **On page load**:
  - Terminal "boots up" with a brief ASCII art logo or welcome message
  - Auto-types: `$ cat summary.txt` → displays the user's summary with typewriter effect
  - Shows: `Type 'help' for available commands` hint
- **Command input**:
  - Blinking cursor at prompt: `visitor@{name}:~$ `
  - User can type commands and press Enter
  - Command history (up/down arrow keys)
- **Available commands**:
  - `help` — lists all available commands
  - `about` or `whoami` — shows name, title, summary
  - `experience` or `ls experience/` — lists all jobs (company, role, dates)
  - `experience [company]` or `cat experience/google.txt` — shows details of a specific job
  - `skills` — shows skills grouped by category, rendered as a table
  - `education` — shows education info
  - `projects` — lists projects
  - `contact` — shows contact info with clickable links
  - `clear` — clears the terminal
  - `neofetch` — fun: shows a styled system-info-like display with the person's stats (years of experience, total companies, top skills, etc.)
  - Unknown commands: `command not found: {input}. Type 'help' for available commands.`
- **Output formatting**:
  - Use colored text for emphasis (green for headers, white for content, gray for secondary)
  - Tables for structured data (skills, experience list)
  - ASCII borders/boxes for sections
- **Clickable links**: URLs in contact should be clickable even in terminal mode
- **Responsive**: Works on mobile — input is still functional, font size adjusts

### Acceptance criteria
- [ ] Terminal boots with welcome animation and auto-typed summary
- [ ] Users can type commands and get appropriate output
- [ ] All commands listed above work correctly
- [ ] Typing effect looks smooth and realistic
- [ ] Command history works with arrow keys
- [ ] Links in contact output are clickable
- [ ] `clear` command works
- [ ] Unknown commands show helpful error
- [ ] Works on mobile

### Agent prompt
> Execute Task 12 from master-plan.md. Build the Terminal theme at src/themes/terminal/ with an interactive command-line interface. Users explore the resume by typing commands (help, about, experience, skills, education, projects, contact, neofetch, clear). Include typing animations, a blinking cursor, command history with arrow keys, and green-on-dark terminal styling with JetBrains Mono font. Auto-type a summary on page load.

---

## 🖼️ TASK 13: OG Images & QR Code

### Goal
Generate dynamic social preview images and QR codes for each resume.

### What to do
1. Create `src/app/api/og/[slug]/route.tsx` — dynamic OG image generation using next/og (ImageResponse)
2. Update `src/app/[slug]/page.tsx` metadata to use the OG image endpoint
3. Ensure QR code is properly integrated in the publish success dialog (should be done in Task 7, verify/polish)

### OG image design
- Size: 1200x630 (standard OG image)
- Background: dark gradient (#0a0a0a to #1a1a1a)
- Content:
  - Person's name (large, bold, white)
  - Title (medium, neutral-400)
  - Top 3-5 skill badges
  - "View interactive resume →" text at bottom
  - ResumeVerse branding/logo in corner
  - Subtle decorative elements (gradient orbs, grid lines)
- Use `ImageResponse` from `next/og` — it renders JSX to PNG

### Acceptance criteria
- [ ] Visiting `/api/og/john-doe` returns a PNG image
- [ ] Image contains the person's name, title, and skills
- [ ] Image looks professional (dark theme, clean typography)
- [ ] The [slug] page metadata references this OG image
- [ ] Sharing the resume link on LinkedIn/Twitter shows the preview card correctly

### Agent prompt
> Execute Task 13 from master-plan.md. Create the dynamic OG image generation API route at src/app/api/og/[slug]/route.tsx using next/og ImageResponse. Design a 1200x630 image with the person's name, title, top skills, and ResumeVerse branding on a dark gradient background. Update the [slug] page metadata to reference this image for social sharing.

---

## 📈 TASK 14: View Analytics

### Goal
Track views on resume pages and show analytics to the resume owner.

### What to do
1. Update `src/app/[slug]/page.tsx` to log views to `resume_views` table
2. Create `src/app/dashboard/analytics/[id]/page.tsx` — analytics page for a specific resume
3. Add basic charts showing views over time, top referrers, device breakdown
4. Add a "View Analytics" button to the dashboard resume cards

### View logging
- On every visit to a [slug] page:
  - Insert into `resume_views`: resume_id, referrer (from headers), user_agent (from headers)
  - Increment `views` counter on the resume record
  - Do this fire-and-forget (don't block page render)
  - Don't log views from the resume owner (check auth, if available)

### Analytics page
- Header: resume name + slug link
- Stats cards: Total views, views this week, views today
- Line chart: views over the last 30 days (using Recharts)
- Bar chart: top referrers (direct, LinkedIn, Twitter, etc.)
- Pie chart: device breakdown (mobile vs desktop)
- Back to dashboard button

### Acceptance criteria
- [ ] Views are logged on every visit to a shareable resume page
- [ ] Analytics page shows total, weekly, daily view counts
- [ ] Line chart shows views over time
- [ ] Referrer and device data is captured and displayed
- [ ] Only the resume owner can see analytics (RLS)

### Agent prompt
> Execute Task 14 from master-plan.md. Add view tracking to the [slug] page that logs visits to the resume_views table. Build an analytics page at src/app/dashboard/analytics/[id]/page.tsx with view counts, a line chart (views over time), referrer bar chart, and device pie chart using Recharts. Only the resume owner should be able to view analytics.

---

## ✨ TASK 15: AI Bullet Point Enhancer

### Goal
Add the ability for users to enhance their resume bullet points using AI.

### What to do
1. Create `src/lib/ai/enhance-bullets.ts` — the enhancement prompt and logic
2. Create `src/app/api/enhance/route.ts` — API route for bullet enhancement
3. Add an "Enhance with AI ✨" button next to each bullet point in the editor
4. Add an "Enhance All" button that enhances all bullets at once
5. Show before/after comparison so users can accept or reject changes

### Enhancement logic
- The AI prompt should:
  - Take a weak bullet point as input
  - Rewrite it using the STAR format (Situation, Task, Action, Result)
  - Make it quantifiable where possible (add metrics/numbers)
  - Keep it concise (1-2 lines max)
  - Maintain truthfulness (enhance, don't fabricate)
  - Also accept the company name and role for context
- Example:
  - Input: "Managed a team of developers"
  - Output: "Led a cross-functional team of 8 engineers, delivering 3 major product features that increased user engagement by 40%"

### UI in editor
- Each bullet point has a small "✨" button on hover
- Clicking it: shows loading shimmer on that bullet → replaces with enhanced version
- Show the original as a subtle tooltip or "Undo" option
- "Enhance All" button at the top of experience section: enhances all bullets with a progress indicator
- Rate limiting note: show a toast if the user hits the free API limit

### API route
- POST `/api/enhance`
- Body: `{ bullet: string, company: string, role: string }`
- Returns: `{ enhanced: string }`
- Also support batch mode: `{ bullets: { bullet: string, company: string, role: string }[] }` → returns array

### Acceptance criteria
- [ ] Individual bullet enhance button works
- [ ] Enhanced bullet replaces the original with smooth animation
- [ ] User can undo/revert to original
- [ ] "Enhance All" button processes all bullets with progress indicator
- [ ] AI produces meaningful, improved bullet points
- [ ] Error handling for API failures and rate limits

### Agent prompt
> Execute Task 15 from master-plan.md. Build the AI bullet point enhancer. Create the enhancement logic in src/lib/ai/enhance-bullets.ts and the API route in src/app/api/enhance/route.ts. Add "✨ Enhance" buttons to each bullet point and an "Enhance All" button in the resume editor. Show before/after with undo capability. The AI should rewrite bullets using STAR format with quantifiable results.

---

## 🐳 TASK 16: Docker Setup

### Goal
Containerize the application with a production-ready Docker setup.

### What to do
1. Create `Dockerfile` — multi-stage build (deps → builder → runner)
2. Create `.dockerignore`
3. Create `docker-compose.yml` — for local development
4. Verify `next.config.js` has `output: 'standalone'`

### Dockerfile specs
- **Stage 1 (deps)**: `node:20-alpine`, install dependencies with `npm ci`
- **Stage 2 (builder)**: copy source, run `npm run build`
- **Stage 3 (runner)**: `node:20-alpine`, production only
  - Create non-root user (nodejs:nextjs)
  - Copy standalone output + static files + public folder
  - Set `NODE_ENV=production`
  - Expose port 3000
  - Run with `node server.js`
- Use `.dockerignore` to exclude: node_modules, .next, .git, .github, *.md, coverage, .env*.local

### docker-compose.yml
- Service: app
- Build from Dockerfile
- Port mapping: 3000:3000
- Environment: read from `.env.local` via `env_file`
- Volume mount for development (optional)

### Acceptance criteria
- [ ] `docker build -t resumeverse .` completes successfully
- [ ] `docker run -p 3000:3000 --env-file .env.local resumeverse` starts the app
- [ ] `docker compose up --build` works
- [ ] Final image is under 200MB
- [ ] App runs as non-root user inside container
- [ ] `.dockerignore` excludes unnecessary files

### Agent prompt
> Execute Task 16 from master-plan.md. Create the Dockerfile with a 3-stage multi-stage build (deps → builder → runner) using node:20-alpine. Create .dockerignore and docker-compose.yml. Ensure next.config.js has output: 'standalone'. The final image should run as a non-root user and be under 200MB.

---

## 🧪 TASK 17: Tests

### Goal
Add meaningful unit and component tests using Vitest and React Testing Library.

### What to do
1. Verify `vitest.config.ts` is set up correctly (from Task 1)
2. Verify `src/test/setup.ts` imports `@testing-library/jest-dom/vitest`
3. Create the following test files:

### Test files to create

**`src/lib/utils/__tests__/slug.test.ts`** (5 tests)
- Converts name to lowercase slug
- Handles multiple spaces
- Removes special characters (apostrophes, periods)
- Trims whitespace
- Handles unicode characters (é, ñ, ü → e, n, u)

**`src/lib/utils/__tests__/schema.test.ts`** (3 tests)
- Validates a correct, complete resume object
- Rejects resume without a name
- Rejects experience with empty bullets array

**`src/lib/ai/__tests__/parse-resume.test.ts`** (3 tests)
- Extracts JSON from markdown-fenced AI response
- Handles raw JSON response (no fences)
- Throws on completely invalid (non-JSON) response

**`src/components/upload/__tests__/dropzone.test.tsx`** (3 tests)
- Renders upload instructions text
- Calls onFileSelect when a PDF file is uploaded
- Shows error message when non-PDF/DOCX file is uploaded (rejects it)

**`src/components/editor/__tests__/theme-selector.test.tsx`** (3 tests)
- Renders all available theme options
- Highlights the currently selected theme (aria-selected)
- Calls onSelect callback when a different theme is clicked

**`src/components/editor/__tests__/resume-editor.test.tsx`** (2 tests)
- Renders resume data in editable input fields
- Calls onChange when user edits the name field

### Package.json scripts
Ensure these scripts exist:
```json
{
  "test": "vitest",
  "test:run": "vitest run",
  "test:coverage": "vitest run --coverage",
  "type-check": "tsc --noEmit"
}
```

### Acceptance criteria
- [ ] All 19 tests pass with `npm run test:run`
- [ ] Tests cover: utility functions, schema validation, AI response parsing, file upload, theme selector, editor
- [ ] No tests depend on external APIs or databases (all mocked)
- [ ] Tests run fast (under 5 seconds total)

### Agent prompt
> Execute Task 17 from master-plan.md. Create all 6 test files with 19 total tests using Vitest and React Testing Library. Test the slug utility, Zod schema validation, AI response parsing, Dropzone component, ThemeSelector component, and ResumeEditor component. All external dependencies should be mocked. Ensure all tests pass with `npm run test:run`.

---

## 🎯 TASK 18: Landing Page & Final Polish

### Goal
Build a beautiful landing page and polish the entire application.

### What to do
1. Create `src/components/landing/hero.tsx` — hero section with tagline, CTA, and demo visual
2. Create `src/components/landing/features.tsx` — feature highlights section
3. Create `src/components/landing/demo-preview.tsx` — animated preview of what the generated sites look like
4. Create `src/components/landing/footer.tsx` — footer with links
5. Update `src/app/page.tsx` — assemble the landing page (move upload to a separate section or page)
6. Add global loading states, error boundaries, and 404 page
7. Final responsive checks across all pages
8. Performance optimization: lazy load themes, optimize images

### Landing page sections
1. **Hero**: Big tagline "Turn Your Resume Into a Stunning Interactive Website". Subtitle explaining the value. "Get Started — It's Free" CTA button. Animated mockup/preview showing a resume transforming.
2. **How It Works**: 3-step visual (Upload → AI Transforms → Share). Each step has an icon and short description.
3. **Theme Showcase**: Preview cards/screenshots of the 3 themes. Animated or interactive previews if possible.
4. **Features**: Grid of features with icons (AI Parsing, Multiple Themes, Shareable Links, Analytics, QR Code, Export).
5. **Upload Section**: Embed the Dropzone here OR a big CTA button to go to upload page.
6. **Footer**: Built by [Your Name], GitHub link, tech stack credits.

### Design
- Modern, dark theme consistent with the app
- Smooth scroll animations (Framer Motion)
- Gradient text for headings
- Responsive at every breakpoint
- Fast: aim for 95+ Lighthouse performance score

### Polish checklist
- [ ] 404 page — custom, on-brand design
- [ ] Loading states — skeleton loaders for dashboard, editor preview
- [ ] Error boundaries — graceful error handling throughout
- [ ] Favicon and app metadata
- [ ] Mobile navigation (hamburger menu or sheet)
- [ ] All pages responsive down to 320px width
- [ ] Console clean (no warnings/errors)
- [ ] Performance: lazy load Three.js and GSAP-heavy themes
- [ ] Accessibility: keyboard navigation, focus styles, screen reader labels

### Acceptance criteria
- [ ] Landing page looks professional and modern
- [ ] All sections render correctly on mobile and desktop
- [ ] CTA button navigates to upload/login flow
- [ ] 404 page is custom-designed
- [ ] No console errors or warnings
- [ ] All pages work on mobile

### Agent prompt
> Execute Task 18 from master-plan.md. Build a beautiful landing page with hero section, how-it-works steps, theme showcase, features grid, and footer. Use a modern dark design with Framer Motion animations, gradient text, and responsive layout. Also add a custom 404 page, loading states, error boundaries, and make a final polish pass on all pages for responsiveness and accessibility.

---

## 🚀 POST-BUILD: Deployment Checklist

After all tasks are complete, do these manually:

### Supabase Setup
- [ ] Create a Supabase project at https://supabase.com
- [ ] Run the SQL migration (from Task 3) in the SQL Editor
- [ ] Enable Google OAuth provider (Authentication → Providers → Google)
- [ ] Enable GitHub OAuth provider (Authentication → Providers → GitHub)
- [ ] Create a `resumes` storage bucket (Storage → New Bucket)
- [ ] Copy the project URL and anon key to `.env.local`

### Google Gemini API
- [ ] Get an API key from https://aistudio.google.com/app/apikey
- [ ] Add it to `.env.local` as `GEMINI_API_KEY`

### Google OAuth
- [ ] Create OAuth credentials at https://console.cloud.google.com
- [ ] Add redirect URL: `https://your-supabase-url.supabase.co/auth/v1/callback`
- [ ] Add client ID and secret to Supabase Google provider settings

### GitHub OAuth
- [ ] Create an OAuth App at https://github.com/settings/developers
- [ ] Add redirect URL: `https://your-supabase-url.supabase.co/auth/v1/callback`
- [ ] Add client ID and secret to Supabase GitHub provider settings

### Vercel Deployment
- [ ] Push code to GitHub
- [ ] Import project in Vercel (https://vercel.com/new)
- [ ] Add environment variables in Vercel project settings:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `GEMINI_API_KEY`
  - `NEXT_PUBLIC_APP_URL` (your Vercel URL)
- [ ] Deploy
- [ ] Test the full flow: upload → parse → edit → publish → share

### Final Verification
- [ ] Test shareable link works when not logged in
- [ ] Test OG image shows on LinkedIn (use https://www.opengraph.xyz/)
- [ ] Test all 3 themes render correctly
- [ ] Test on mobile (real device if possible)
- [ ] Test Docker build still works with production env vars
- [ ] Run tests one final time: `npm run test:run`

---

## 📝 Resume Bullet Point (Copy This)

> **ResumeVerse** — AI-Powered Interactive Resume Generator  
> Built a full-stack web application that transforms PDF/DOCX resumes into shareable, interactive websites using AI. Users upload a resume, Google Gemini AI parses and structures the content, and the app generates a stunning interactive website with a unique shareable URL. Features 3 visual themes (bento grid, scroll-driven storytelling, terminal CLI), a live editor, AI-powered bullet point enhancement, dynamic OG image generation for social sharing, and view analytics.  
> **Tech:** Next.js 14 · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · GSAP · Google Gemini AI · Supabase (PostgreSQL + Auth + Storage) · Docker · Vitest · React Testing Library · Vercel

---

_Good luck! Build one task at a time. Review, test, commit. You've got this._ 🚀
