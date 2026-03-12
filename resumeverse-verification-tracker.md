# ✅ ResumeVerse — Verification & Progress Tracker

> Check off each item as you complete it. This is your single source of truth for project progress.
>
> **How to use:** After each task, go through its checklist. Mark items with `[x]` when done. Don't move to the next task until all items are checked.

---

## 📊 Overall Progress

| Task | Status | Date Completed | Notes |
|------|--------|----------------|-------|
| Task 1: Project Setup | ⬜ Not Started | | |
| Task 2: Types & Schemas | ⬜ Not Started | | |
| Task 3: Supabase Setup | ⬜ Not Started | | |
| Task 4: File Upload | ⬜ Not Started | | |
| Task 5: AI Parsing | ⬜ Not Started | | |
| Task 6: Resume Editor | ⬜ Not Started | | |
| Task 7: Publish & Share | ⬜ Not Started | | |
| Task 8: Bento Theme | ⬜ Not Started | | |
| Task 9: Authentication | ⬜ Not Started | | |
| Task 10: Dashboard | ⬜ Not Started | | |
| Task 11: Journey Theme | ⬜ Not Started | | |
| Task 12: Terminal Theme | ⬜ Not Started | | |
| Task 13: OG Images | ⬜ Not Started | | |
| Task 14: Analytics | ⬜ Not Started | | |
| Task 15: AI Enhancer | ⬜ Not Started | | |
| Task 16: Docker | ⬜ Not Started | | |
| Task 17: Tests | ⬜ Not Started | | |
| Task 18: Landing Page | ⬜ Not Started | | |
| Deployment | ⬜ Not Started | | |

**Status options:** ⬜ Not Started · 🟡 In Progress · ✅ Complete · ❌ Blocked

---

## 🔑 External Setup Tracker

These are things you must do **outside of code** — API keys, dashboard configs, OAuth, etc.

### Supabase (needed before Task 3)
- [ ] Created Supabase project at https://supabase.com
- [ ] Copied Project URL → `.env.local` as `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Copied Anon Key → `.env.local` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Ran SQL migration in Supabase SQL Editor
- [ ] Verified `resumes` table exists in Table Editor
- [ ] Verified `resume_views` table exists in Table Editor
- [ ] Verified RLS is enabled on both tables (lock icon)
- [ ] Created `resumes` Storage bucket (NOT public)

### Google Gemini API (needed before Task 5)
- [ ] Got API key from https://aistudio.google.com/app/apikey
- [ ] Added to `.env.local` as `GEMINI_API_KEY`
- [ ] Restarted dev server after adding key

### Google OAuth (needed before Task 9)
- [ ] Created project in Google Cloud Console
- [ ] Created OAuth 2.0 Client ID (Web Application)
- [ ] Added redirect URI: `https://<SUPABASE_URL>.supabase.co/auth/v1/callback`
- [ ] Copied Client ID + Secret → Supabase Dashboard → Auth → Providers → Google
- [ ] Enabled Google provider in Supabase

### GitHub OAuth (needed before Task 9)
- [ ] Created OAuth App at https://github.com/settings/developers
- [ ] Set Homepage URL: `http://localhost:3000`
- [ ] Set Callback URL: `https://<SUPABASE_URL>.supabase.co/auth/v1/callback`
- [ ] Copied Client ID + Secret → Supabase Dashboard → Auth → Providers → GitHub
- [ ] Enabled GitHub provider in Supabase

### Docker Desktop (needed before Task 16)
- [ ] Docker Desktop installed and running

### Vercel (needed for deployment)
- [ ] Pushed code to GitHub
- [ ] Imported project in Vercel
- [ ] Added env var: `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Added env var: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Added env var: `GEMINI_API_KEY`
- [ ] Added env var: `NEXT_PUBLIC_APP_URL` (set to Vercel URL)
- [ ] First deploy successful
- [ ] Updated OAuth redirect URIs to include Vercel domain

### `.env.local` file status
- [ ] `NEXT_PUBLIC_SUPABASE_URL` — added
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` — added
- [ ] `GEMINI_API_KEY` — added
- [ ] `NEXT_PUBLIC_APP_URL` — added (set to `http://localhost:3000`)

---

## 📦 TASK 1: Project Setup

### Standard checks (run after every task)
- [ ] `npm run build` — passes without errors
- [ ] `npm run dev` — starts without errors
- [ ] `npx tsc --noEmit` — no TypeScript errors

### Task-specific checks
- [ ] `http://localhost:3000` shows placeholder page
- [ ] Browser console has no errors
- [ ] All folders created (`src/app`, `src/components`, `src/themes`, `src/lib`, `src/types`, `src/test`)
- [ ] shadcn/ui components import without errors (test: `import { Button } from "@/components/ui/button"`)
- [ ] `vitest.config.ts` exists and `npm test` runs (0 tests OK)
- [ ] Tailwind works (test: add `className="bg-red-500"` to a div, should be red)

### Manual setup needed
- ❌ None

### Git commit
- [ ] Committed: `git commit -m "feat: initial project setup with all dependencies and folder structure"`

---

## 📐 TASK 2: Types & Schemas

### Standard checks
- [ ] `npm run build` — passes
- [ ] `npx tsc --noEmit` — no TypeScript errors

### Task-specific checks
- [ ] `src/types/resume.ts` exists with all interfaces (ResumeData, ExperienceItem, etc.)
- [ ] `src/lib/utils/schema.ts` exists with Zod schemas
- [ ] `src/lib/utils/slug.ts` exists with `generateSlug()` function
- [ ] Quick test: `generateSlug("John Doe")` returns `"john-doe-xxxx"` format
- [ ] Quick test: `generateSlug("José García")` returns `"jose-garcia-xxxx"` format
- [ ] Zod schema validates a correct resume object (returns `success: true`)
- [ ] Zod schema rejects an object without a name (returns `success: false`)

### Manual setup needed
- ❌ None

### Git commit
- [ ] Committed: `git commit -m "feat: add TypeScript types, Zod schemas, and slug utility"`

---

## 🗄️ TASK 3: Supabase Setup

### ⚠️ Pre-task setup
- [ ] Supabase project created (see External Setup Tracker above)
- [ ] `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] SQL migration executed in Supabase SQL Editor
- [ ] Storage bucket `resumes` created

### Standard checks
- [ ] `npm run build` — passes
- [ ] `npm run dev` — starts without errors

### Task-specific checks
- [ ] `src/lib/supabase/client.ts` exists (browser client)
- [ ] `src/lib/supabase/server.ts` exists (server client)
- [ ] `src/lib/supabase/middleware.ts` exists
- [ ] `src/middleware.ts` exists (Next.js middleware)
- [ ] No Supabase connection errors in browser console
- [ ] No Supabase connection errors in terminal/server logs
- [ ] Supabase Dashboard → Table Editor: `resumes` table exists with correct columns
- [ ] Supabase Dashboard → Table Editor: `resume_views` table exists
- [ ] RLS enabled on both tables (lock icon visible)

### Sanity test (optional)
- [ ] Temporarily add a test query in a page: `supabase.from('resumes').select('*')` → returns `{ data: [], error: null }`

### Manual setup needed
- ✅ See External Setup Tracker → Supabase section

### Git commit
- [ ] Committed: `git commit -m "feat: add Supabase client, server, middleware, and database schema"`

---

## 📤 TASK 4: File Upload Component

### Standard checks
- [ ] `npm run build` — passes
- [ ] `npm run dev` — starts without errors

### Task-specific checks
- [ ] Dropzone component renders on page with upload instructions
- [ ] Drag a **PDF file** → file is accepted, preview shows file name/size
- [ ] Drag a **DOCX file** → file is accepted
- [ ] Drag a **PNG file** → error: "Only PDF and DOCX files are accepted"
- [ ] Drag a **file >5MB** → error about file size
- [ ] Click the dropzone → file browser opens
- [ ] Loading state works (shows spinner/skeleton when `isLoading` is true)
- [ ] PDF parser: extracts text from a test PDF
- [ ] DOCX parser: extracts text from a test DOCX

### Manual setup needed
- ❌ None

### Git commit
- [ ] Committed: `git commit -m "feat: add file upload dropzone with PDF and DOCX parsing"`

---

## 🤖 TASK 5: AI Resume Parsing

### ⚠️ Pre-task setup
- [ ] Gemini API key added to `.env.local` (see External Setup Tracker)
- [ ] Dev server restarted after adding key

### Standard checks
- [ ] `npm run build` — passes
- [ ] `npm run dev` — starts without errors

### Task-specific checks
- [ ] Upload a **real PDF resume** → loading state shows → parsed JSON appears
- [ ] Parsed data has correct: name, title, summary
- [ ] Parsed data has experience entries with: company, role, dates, bullets
- [ ] Parsed data has skills populated
- [ ] Upload a **second different resume** → parses correctly
- [ ] Upload a **DOCX resume** → parses correctly
- [ ] Error test: temporarily set `GEMINI_API_KEY=invalid` → restart → upload → shows error message (not crash)
- [ ] Browser console: no unhandled errors during parsing
- [ ] Server terminal: no unhandled errors during parsing

### Common issues to watch for
- [ ] ⚠️ If AI returns markdown-fenced JSON → `parseAIResponse` strips fences correctly
- [ ] ⚠️ If parsed data is missing fields → Zod schema fills defaults, doesn't crash
- [ ] ⚠️ If API returns 429 (rate limit) → user sees a friendly error

### Manual setup needed
- ✅ See External Setup Tracker → Gemini API section

### Git commit
- [ ] Committed: `git commit -m "feat: add AI resume parsing with Gemini API"`

---

## ✏️ TASK 6: Resume Editor

### Standard checks
- [ ] `npm run build` — passes
- [ ] `npm run dev` — starts without errors

### Task-specific checks
- [ ] Upload resume → redirects to editor page
- [ ] **Left panel (editor):**
  - [ ] Name field is populated and editable
  - [ ] Title field is populated and editable
  - [ ] Summary textarea is populated and editable
  - [ ] Experience entries are listed with all fields
  - [ ] Can add a new experience entry
  - [ ] Can remove an experience entry
  - [ ] Can add/remove bullet points within an experience
  - [ ] Skills show as tags, can add/remove
  - [ ] Education entries are editable
  - [ ] Projects entries are editable
- [ ] **Right panel (live preview):**
  - [ ] Shows resume data rendered with the selected theme
  - [ ] Updates in real-time as left panel is edited
- [ ] **Theme selector:**
  - [ ] Shows all 3 theme options
  - [ ] Clicking a theme changes the preview
  - [ ] Data is NOT lost when switching themes
- [ ] **Responsive:**
  - [ ] Desktop: side-by-side layout works
  - [ ] Mobile (375px): switches to tabbed view (editor tab / preview tab)

### Manual setup needed
- ❌ None

### Git commit
- [ ] Committed: `git commit -m "feat: add resume editor with live preview and theme selector"`

---

## 🔗 TASK 7: Publish & Share

### Standard checks
- [ ] `npm run build` — passes
- [ ] `npm run dev` — starts without errors

### Task-specific checks
- [ ] Click "Publish" in editor → success dialog appears
- [ ] Dialog shows: shareable URL, QR code, copy button, social share buttons
- [ ] Copy button works → URL copied to clipboard → "Copied!" toast
- [ ] **Critical: open the shareable URL in incognito window** → resume page renders
- [ ] Resume shows the correct theme
- [ ] Resume shows all the correct data
- [ ] QR code is scannable (test with phone camera)
- [ ] Visit a non-existent slug → 404 page
- [ ] "Share on LinkedIn" button → opens LinkedIn share dialog
- [ ] "Share on Twitter" button → opens Twitter compose
- [ ] Supabase → Table Editor → `resumes` → new row exists with correct data
- [ ] View counter: refresh the shareable page → views column increments

### ⚠️ Auth note
- [ ] If auth (Task 9) is not done yet: temporarily disable RLS for testing
  ```sql
  ALTER TABLE public.resumes DISABLE ROW LEVEL SECURITY;
  ```
- [ ] Remember to re-enable after Task 9!

### Manual setup needed
- ❌ None (Supabase already configured)

### Git commit
- [ ] Committed: `git commit -m "feat: add publish flow with shareable links and QR codes"`

---

## 🎨 TASK 8: Bento Theme

### Standard checks
- [ ] `npm run build` — passes
- [ ] `npm run dev` — starts without errors

### Task-specific checks
- [ ] Publish a resume with **Bento theme** → visit shareable link
- [ ] **Visual quality:**
  - [ ] Dark background, clean grid layout
  - [ ] Cards have rounded corners and subtle borders
  - [ ] Typography is clean and readable
  - [ ] Overall looks professional (would you show this to a recruiter?)
- [ ] **Animations:**
  - [ ] Cards stagger-animate in on page load
  - [ ] Cards have subtle hover effects (lift/glow)
- [ ] **Data completeness:**
  - [ ] Name and title visible
  - [ ] Summary visible
  - [ ] All experience entries visible with bullets
  - [ ] Education visible
  - [ ] Skills visible (as tags/badges)
  - [ ] Projects visible
  - [ ] Contact links visible and clickable
- [ ] **Responsive:**
  - [ ] Desktop (1440px): multi-column grid
  - [ ] Tablet (768px): 2 columns
  - [ ] Phone (375px): single column
  - [ ] No horizontal scroll on ANY screen size

### Manual setup needed
- ❌ None

### Git commit
- [ ] Committed: `git commit -m "feat: add Bento grid theme with animations"`

---

## 🔐 TASK 9: Authentication

### ⚠️ Pre-task setup
- [ ] Google OAuth configured (see External Setup Tracker)
- [ ] GitHub OAuth configured (see External Setup Tracker)

### Standard checks
- [ ] `npm run build` — passes
- [ ] `npm run dev` — starts without errors

### Task-specific checks
- [ ] Visit `/login` → Google and GitHub buttons render
- [ ] **Google login:** click → Google consent → redirect back → logged in
- [ ] **GitHub login:** click → GitHub authorize → redirect back → logged in
- [ ] User avatar/name shows in header when logged in
- [ ] **Sign out:** click → redirected to landing page → no longer logged in
- [ ] **Route protection:** while logged out:
  - [ ] Visit `/editor/new` → redirected to `/login`
  - [ ] Visit `/dashboard` → redirected to `/login`
  - [ ] Visit `/some-resume-slug` → works (NO redirect, public page)
- [ ] Supabase Dashboard → Authentication → Users → your account appears
- [ ] **Re-enable RLS** if it was disabled in Task 7:
  ```sql
  ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
  ```
- [ ] After re-enabling RLS: publish a resume while logged in → still works

### Common issues
- [ ] ⚠️ "redirect_uri_mismatch" → check redirect URI in Google/GitHub matches Supabase callback exactly
- [ ] ⚠️ Redirect loop → clear cookies, check callback route
- [ ] ⚠️ Can't publish after enabling RLS → ensure `user_id` is set to `auth.uid()` on insert

### Manual setup needed
- ✅ See External Setup Tracker → Google OAuth + GitHub OAuth sections

### Git commit
- [ ] Committed: `git commit -m "feat: add Google and GitHub OAuth authentication"`

---

## 📊 TASK 10: Dashboard

### Standard checks
- [ ] `npm run build` — passes
- [ ] `npm run dev` — starts without errors

### Task-specific checks
- [ ] Login → visit `/dashboard`
- [ ] **Empty state** (if no resumes): friendly message + "Create" CTA
- [ ] **With resumes:** grid/list of resume cards
- [ ] Each card shows: name, theme badge, created date, view count, public/private status
- [ ] **Open link:** click → opens shareable page in new tab
- [ ] **Edit:** click → navigates to editor with existing data loaded correctly
- [ ] **Delete:** click → confirmation dialog → confirm → resume removed from list
- [ ] **Delete verification:** check Supabase Table Editor → row deleted
- [ ] **Toggle visibility:** click → status changes (public ↔ private)
- [ ] **Toggle verification:** set to private → open shareable link in incognito → should show 404 or "private" message

### Manual setup needed
- ❌ None

### Git commit
- [ ] Committed: `git commit -m "feat: add user dashboard with resume management"`

---

## 🌊 TASK 11: Journey Theme

### Standard checks
- [ ] `npm run build` — passes
- [ ] `npm run dev` — starts without errors

### Task-specific checks
- [ ] Publish a resume with **Journey theme** → visit shareable link
- [ ] **Smooth scrolling:** page scrolls smoothly (Lenis, not default browser scroll)
- [ ] **Hero section:** fills viewport, name in large text, scroll indicator at bottom
- [ ] **Parallax:** background element moves at different speed than text on scroll
- [ ] **Experience timeline:** vertical line draws/reveals on scroll
- [ ] **Experience items:** animate in (fade/slide) as you scroll to them
- [ ] **Skills section:** bars fill from 0% or tags pop in on scroll
- [ ] **Education + Projects:** animate in on scroll
- [ ] **Contact section:** visible at bottom with clickable links
- [ ] **Data completeness:** all resume data is displayed (same as Bento check)
- [ ] **Responsive (375px):** animations simplified, no layout breaks, no horizontal scroll
- [ ] **Performance:** no scroll jank or stuttering
- [ ] **Memory:** no console errors about GSAP cleanup on navigate away and back

### Manual setup needed
- ❌ None

### Git commit
- [ ] Committed: `git commit -m "feat: add Journey scroll-driven theme with GSAP animations"`

---

## 💻 TASK 12: Terminal Theme

### Standard checks
- [ ] `npm run build` — passes
- [ ] `npm run dev` — starts without errors

### Task-specific checks
- [ ] Publish a resume with **Terminal theme** → visit shareable link
- [ ] **Boot:** terminal shows welcome message with typing animation
- [ ] **Auto-type:** summary auto-types on page load
- [ ] **Commands (test each one):**
  - [ ] `help` → lists all commands
  - [ ] `about` / `whoami` → shows name, title, summary
  - [ ] `experience` → lists all jobs
  - [ ] `skills` → shows skills grouped by category
  - [ ] `education` → shows education
  - [ ] `projects` → shows projects
  - [ ] `contact` → shows contact info with clickable links
  - [ ] `neofetch` → shows styled stats
  - [ ] `clear` → clears terminal
  - [ ] `randomgarbage` → "command not found" message
- [ ] **Command history:** press ↑ (up arrow) → previous command appears
- [ ] **Links:** URLs in `contact` output are clickable
- [ ] **Visual:** green/amber on dark, monospace font, blinking cursor
- [ ] **Mobile:** input works, text is readable at 375px

### Manual setup needed
- ❌ None

### Git commit
- [ ] Committed: `git commit -m "feat: add Terminal interactive CLI theme"`

---

## 🖼️ TASK 13: OG Images & QR Code

### Standard checks
- [ ] `npm run build` — passes
- [ ] `npm run dev` — starts without errors

### Task-specific checks
- [ ] Visit `http://localhost:3000/api/og/YOUR-SLUG` → PNG image loads in browser
- [ ] Image shows: person's name, title, skills, branding
- [ ] Image looks professional (dark gradient, clean text)
- [ ] Image dimensions are 1200x630
- [ ] Shareable page has correct `og:image` meta tag (inspect page source or devtools)
- [ ] QR code in publish dialog still works and is scannable

### Post-deployment check (do after Vercel deploy)
- [ ] Test with https://www.opengraph.xyz/ → paste deployed URL → preview card shows
- [ ] Test sharing URL in a private Slack/Discord/WhatsApp message → preview card shows

### Manual setup needed
- ❌ None

### Git commit
- [ ] Committed: `git commit -m "feat: add dynamic OG image generation and social previews"`

---

## 📈 TASK 14: View Analytics

### Standard checks
- [ ] `npm run build` — passes
- [ ] `npm run dev` — starts without errors

### Task-specific checks
- [ ] Visit a published resume page 3-4 times (use incognito to simulate different visitors)
- [ ] Login → dashboard → click "View Analytics" on that resume
- [ ] **Stats cards:** total views number is correct (matches your visits)
- [ ] **Line chart:** shows views over time (even if just today)
- [ ] **Referrer data:** shows up (might be "direct" for local testing)
- [ ] **Device data:** shows up
- [ ] Supabase → `resume_views` table → rows exist for each visit
- [ ] Supabase → `resumes` table → `views` column matches the count
- [ ] **RLS check:** login as a different user (or check in incognito) → cannot see another user's analytics

### Manual setup needed
- ❌ None

### Git commit
- [ ] Committed: `git commit -m "feat: add view analytics tracking and dashboard"`

---

## ✨ TASK 15: AI Bullet Point Enhancer

### Standard checks
- [ ] `npm run build` — passes
- [ ] `npm run dev` — starts without errors

### Task-specific checks
- [ ] Go to editor → hover over a bullet point → "✨ Enhance" button appears
- [ ] Click enhance → loading state shows → bullet is replaced with improved version
- [ ] **Quality check:** enhanced bullet is meaningfully better (more specific, has metrics, STAR format)
- [ ] **Undo:** can revert to original bullet
- [ ] **Enhance All:** button exists → click → all bullets update with progress indicator
- [ ] **Error handling:** if API fails → shows error toast, original bullet preserved
- [ ] **Rate limit:** rapid clicking doesn't crash the app

### Manual setup needed
- ❌ None (Gemini API already configured)

### Git commit
- [ ] Committed: `git commit -m "feat: add AI bullet point enhancement"`

---

## 🐳 TASK 16: Docker

### ⚠️ Pre-task setup
- [ ] Docker Desktop installed and running

### Standard checks
- [ ] `npm run build` — still passes (no regressions)

### Task-specific checks

**Build:**
- [ ] `docker build -t resumeverse .` → completes without errors
- [ ] `docker images resumeverse` → image size under 200MB

**Run:**
- [ ] `docker run -p 3000:3000 --env-file .env.local resumeverse` → app starts
- [ ] Visit `http://localhost:3000` → landing page loads
- [ ] Full flow works in Docker: upload → parse → edit → publish → view

**Compose:**
- [ ] `docker compose up --build` → app starts
- [ ] Visit `http://localhost:3000` → works

**Files created:**
- [ ] `Dockerfile` exists with 3-stage multi-stage build
- [ ] `.dockerignore` exists (excludes node_modules, .next, .git, etc.)
- [ ] `docker-compose.yml` exists
- [ ] `next.config.js` has `output: 'standalone'`
- [ ] Dockerfile uses non-root user (`nextjs`)

### Common issues
- [ ] ⚠️ Build fails at `npm run build` → check if build needs runtime env vars (it shouldn't for Next.js standalone)
- [ ] ⚠️ Image too large → ensure multi-stage build only copies standalone output, not entire node_modules

### Manual setup needed
- ✅ Docker Desktop must be installed

### Git commit
- [ ] Committed: `git commit -m "feat: add Docker multi-stage build and docker-compose"`

---

## 🧪 TASK 17: Tests

### Standard checks
- [ ] `npm run build` — passes
- [ ] `npm run dev` — starts without errors

### Task-specific checks

**Run tests:**
- [ ] `npm run test:run` → ALL tests pass

**Test file checklist:**
- [ ] `src/lib/utils/__tests__/slug.test.ts` — exists, 5 tests pass
- [ ] `src/lib/utils/__tests__/schema.test.ts` — exists, 3 tests pass
- [ ] `src/lib/ai/__tests__/parse-resume.test.ts` — exists, 3 tests pass
- [ ] `src/components/upload/__tests__/dropzone.test.tsx` — exists, 3 tests pass
- [ ] `src/components/editor/__tests__/theme-selector.test.tsx` — exists, 3 tests pass
- [ ] `src/components/editor/__tests__/resume-editor.test.tsx` — exists, 2 tests pass

**Quality:**
- [ ] Total: 19 tests pass
- [ ] 0 tests skipped
- [ ] 0 tests failing
- [ ] Total run time under 10 seconds
- [ ] No tests call real external APIs (all mocked)
- [ ] Tests don't depend on `.env.local` values

### Manual setup needed
- ❌ None

### Git commit
- [ ] Committed: `git commit -m "feat: add unit and component tests with Vitest and RTL"`

---

## 🎯 TASK 18: Landing Page & Final Polish

### Standard checks
- [ ] `npm run build` — passes with 0 warnings
- [ ] `npm run dev` — starts without errors
- [ ] `npm run test:run` — all 19 tests pass
- [ ] `npx tsc --noEmit` — no TypeScript errors

### Landing page checks
- [ ] Hero section renders with tagline and CTA
- [ ] "How it works" section shows 3 steps
- [ ] Theme showcase section shows previews of all 3 themes
- [ ] Features grid shows key features
- [ ] Footer renders with credits/links
- [ ] CTA button navigates to upload/login flow
- [ ] Landing page responsive at 375px — no breaks

### Polish checks
- [ ] **404 page:** visit `/nonexistent` → custom 404 page (not default Next.js)
- [ ] **Loading states:** skeleton loaders appear during data fetching
- [ ] **Error boundaries:** errors don't crash the whole app
- [ ] **Favicon:** custom favicon set (not default Next.js)
- [ ] **App metadata:** title, description set in root layout
- [ ] **Mobile nav:** hamburger menu or sheet on mobile
- [ ] **Console:** zero errors, zero warnings in browser console
- [ ] **Console:** zero errors in server terminal

### Responsive check (test every page at 375px width)
- [ ] Landing page — no horizontal scroll
- [ ] Login page — no horizontal scroll
- [ ] Dashboard — no horizontal scroll
- [ ] Editor — switches to tabbed view
- [ ] Bento theme page — single column
- [ ] Journey theme page — no jank
- [ ] Terminal theme page — input works

### Cross-browser (test in at least 2)
- [ ] Chrome — everything works
- [ ] Firefox — everything works
- [ ] Safari (if on Mac) — everything works

### Lighthouse (run in Chrome DevTools → Lighthouse tab)
- [ ] Performance: ___/100 (target: 90+)
- [ ] Accessibility: ___/100 (target: 90+)
- [ ] Best Practices: ___/100 (target: 90+)
- [ ] SEO: ___/100 (target: 90+)

### Manual setup needed
- ❌ None

### Git commit
- [ ] Committed: `git commit -m "feat: add landing page and final polish"`

---

## 🚀 DEPLOYMENT

### Pre-deployment
- [ ] All 18 tasks marked ✅ Complete in the progress table above
- [ ] `npm run build` passes
- [ ] `npm run test:run` — all 19 tests pass
- [ ] `docker build -t resumeverse .` succeeds
- [ ] All env vars documented

### Deploy to Vercel
- [ ] Code pushed to GitHub
- [ ] Project imported in Vercel
- [ ] All 4 env vars added in Vercel project settings
- [ ] Deploy triggered → build succeeds
- [ ] Visit live URL → landing page loads

### Post-deploy verification
- [ ] **Full flow on production:** upload → parse → edit → publish → view shareable link
- [ ] **Auth:** Google login works on production
- [ ] **Auth:** GitHub login works on production
- [ ] **All 3 themes:** publish and verify each one on production
- [ ] **OG image:** test with https://www.opengraph.xyz/ — shows preview card
- [ ] **Mobile:** test on actual phone — everything works
- [ ] **Share test:** share link on LinkedIn/Twitter → preview card shows
- [ ] **Docker:** `docker build` still works (no hardcoded localhost URLs)
- [ ] **Speed:** pages load in under 3 seconds

### Update OAuth redirect URIs for production
- [ ] Google OAuth: added `https://YOUR-VERCEL-URL` as authorized origin
- [ ] GitHub OAuth: updated Homepage URL to production URL
- [ ] Supabase: added production URL to allowed redirect URLs (Auth → URL Configuration)

---

## 📝 Final Resume Bullet (copy when done)

> **ResumeVerse** — AI-Powered Interactive Resume Generator
> Built a full-stack web application that transforms PDF/DOCX resumes into shareable, interactive websites using AI. Users upload a resume, Google Gemini AI parses and structures the content, and the app generates a stunning interactive website with a unique shareable URL. Features 3 visual themes (bento grid, scroll-driven storytelling, terminal CLI), a live editor, AI-powered bullet point enhancement, dynamic OG image generation for social sharing, and view analytics.
> **Tech:** Next.js 14 · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · GSAP · Google Gemini AI · Supabase (PostgreSQL + Auth + Storage) · Docker · Vitest · React Testing Library · Vercel

---

## 🐛 Issue Log

Track any bugs or issues you encounter here:

| # | Task | Issue | Status | Resolution |
|---|------|-------|--------|------------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |

---

_Last updated: ___________
