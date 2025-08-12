TRAVELLY – AI TRIP & OUTING PLANNER
 
Click on the Link to Preview - https://travelly1-seven.vercel.app/

Comprehensive Technical Documentation

Prepared by: Atharva Yadav
Department: Information Technology
Academic Year: 2024–2025


0. TABLE OF CONTENTS
- 1. Executive Summary
- 2. Problem Statement & Goals
- 3. System Overview
- 4. User Stories & Use Cases
- 5. Functional Requirements
- 6. Non‑Functional Requirements
- 7. Information Architecture & Data Flow
- 8. System Architecture & Technology Choices
- 9. Environment & Configuration
- 10. Frontend Application (React + Vite)
- 11. Core Logic: AI Generation & Parsing
- 12. Persistence: Supabase
- 13. UI/UX Specification
- 14. Error Handling & Notifications
- 15. Security, Privacy & Secrets
- 16. Performance & Accessibility
- 17. Testing Strategy
- 18. Build, Run, Deploy
- 19. Exporting (PDF/DOCX) & Sharing
- 20. Troubleshooting Guide
- 21. Maintenance & Operations
- 22. Roadmap & Future Enhancements
- 23. Glossary
- 24. References
- APPENDICES (A–H): Config, Schema, Prompts, Pseudocode, Sample Data, Screens, Acceptance Criteria, License


1. EXECUTIVE SUMMARY
Travelly is a web application that generates realistic, structured itineraries for trips and outings. The interface is fast, clean, and mobile‑friendly, offering day‑wise organization (Morning/Afternoon/Evening), copy/share utilities, cost summaries, and export options. The app uses a modern stack (React + Vite) with Supabase for persistence and leverages Lottie + Framer Motion for a polished user experience.


2. PROBLEM STATEMENT & GOALS
- Planning requires sifting through multiple sources; schedules are hard to structure; budgets are often unclear.
- Goals:
  - Convert basic inputs (destination, dates, preferences) into a day‑wise plan.
  - Keep output realistic, concise, and non‑hallucinatory.
  - Provide copy, save, and export options.
  - Deliver a delightful UI that works across devices.


3. SYSTEM OVERVIEW
- Client‑side React SPA built with Vite.
- Local caching (localStorage) for input payload.
- AI generation flow prepares a strict prompt and parses textual output into sections.
- Optional Supabase persistence for saving final plan text and metadata.
- Export paths: Copy to clipboard (stable), PDF (in progress), DOCX (recommended roadmap).


4. USER STORIES & USE CASES
- US1: As a user, I enter destination and dates to get a structured itinerary.
- US2: As a user, I can copy the entire plan in one click.
- US3: As a user, I can save the plan to the cloud to access later.
- US4: As a user, I can export the itinerary as PDF/DOCX for sharing/printing.
- US5: As a user, I can quickly jump back to the top after scrolling (FAB).


5. FUNCTIONAL REQUIREMENTS
- FR1: Accept input (destination, start/end date, preferences) and retain in localStorage.
- FR2: Generate a plan with N days (1 ≤ N ≤ 7) and Morning/Afternoon/Evening slots.
- FR3: Parse AI output into days and optional Cost Summary; render as cards.
- FR4: Enable “Copy Plan” with clear success/error notifications.
- FR5: Persist plan to Supabase (requires configured env vars and table).
- FR6: Expose export options (PDF button present; DOCX planned).


6. NON‑FUNCTIONAL REQUIREMENTS
- Performance: Render ≤7 days quickly; animations <600ms each; responsive design.
- Reliability: Avoid freezes; loaders during long operations.
- Usability: Clear headings, icons, spacing; accessible color contrast.
- Security: Secrets only via environment variables; HTTPS in production.
- Maintainability: Modular components, clear responsibilities.


7. INFORMATION ARCHITECTURE & DATA FLOW
- Input form (separate screen) stores payload in localStorage under `currentItinerary`.
- `Result` component reads payload → builds prompt → invokes AI path → parses text → renders lists.
- Optional: Save plan to Supabase (title, plan_text, meta JSON).
- Export/Share: Copy to clipboard; PDF/DOCX.


8. SYSTEM ARCHITECTURE & TECHNOLOGY CHOICES
- Frontend: React 18, Vite bundler.
- UI/Animation: Framer Motion for reveal/slide‑in; Lottie for loader.
- State: React hooks inside `Result`.
- Persistence: Supabase JS client (Postgres). Env vars via Vite (`VITE_*`).
- Styling: Tailwind or custom classes (glassmorphism cards, indigo/green accents, light/dark).


9. ENVIRONMENT & CONFIGURATION
- `.env` in `Outing/`:
  - VITE_SUPABASE_URL=...
  - VITE_SUPABASE_ANON_KEY=...
- Missing values cause runtime errors in `src/supabase.js`.


10. FRONTEND APPLICATION (REACT + VITE)
- Entry: `Outing/index.html` loads root and `src/main.jsx`.
- Key screen: `Outing/src/Result.jsx`.
  - State: `formattedResponse`, `costSummary`, `loading`, `aiResponse`, `savedData`, `notification`, `showFab`.
  - Effects: On mount, read `currentItinerary`; listen to scroll for FAB.
  - Actions: `generateAI(data)`, `formatAIResponse(text)`, `handleCopyPlan()`, `savePlanToSupabase(planText)`.
  - UI: Loader (Lottie) while generating; day cards with icons; cost summary card; notification toasts; FAB.


11. CORE LOGIC: AI GENERATION & PARSING
- Generation
  - Compute `totalDays` from date range; cap to 7 for performance.
  - Build strict prompt with constraints against hallucinations; allow "Not enough information".
  - Request plaintext with “Day N” sections and optional “Cost Summary:”.
- Parsing
  - Split on /Cost Summary:/i → main itinerary vs costs.
  - Days: split on /Day\s*\d/i, trim bullets/emoji, filter short/noisy lines.
  - Costs: retain lines with `₹` and sufficient length.


12. PERSISTENCE: SUPABASE
- Table suggestion: `itineraries(id uuid pk, created_at timestamptz, title text, plan_text text, meta jsonb)`.
- Insert flow: On success of generation, compile `plan_text` and insert; notify on error.
- Security: Use RLS and policies with auth if multi‑user.


13. UI/UX SPECIFICATION
- Typography: Manrope.
- Layout: Glass cards with soft borders and shadows.
- Colors: Indigo accent; green highlight for cost summary; light/dark support.
- Icons: ☀️/🌞/🌙 for day parts; 🍳/🍽️ for meals; 💸/💰 for costs.
- Accessibility: Headings per day, adequate contrast, keyboard reachability.


14. ERROR HANDLING & NOTIFICATIONS
- Clipboard failures: try/catch with user feedback.
- Missing itinerary: friendly message and early exit to avoid empty renders.
- Supabase errors: show concise error message; log details to console for debugging.
- Long operations: keep loader visible; consider timeouts if remote calls added.


15. SECURITY, PRIVACY & SECRETS
- Never commit `.env`.
- Use Vite `VITE_` prefix for publicly exposed URL/anon key.
- No sensitive PII stored by default; plans are generic text.
- Production: force HTTPS; enable RLS; configure CORS for APIs if added.


16. PERFORMANCE & ACCESSIBILITY
- Cap content length (≤7 days). Avoid heavy CSS during export.
- Use `whileInView` with modest durations; avoid animating large lists at once.
- Accessibility checklist: Contrast, focus outlines, aria labels for buttons if needed.


17. TESTING STRATEGY
- Unit: `formatAIResponse` day/cost splitting; copy handler edge cases.
- Integration: Load → generate → parse → render → copy; Supabase insert success/failure.
- Manual: Light/dark themes; small/large screens; scroll/FAB behavior; export flows.


18. BUILD, RUN, DEPLOY
- Install: `npm install` (in `Outing/`).
- Dev: `npm run dev`.
- Build: `npm run build`; Preview: `npm run preview`.
- Deploy: Host `dist/` on Netlify/Vercel; configure env vars in platform dashboard.


19. EXPORTING (PDF/DOCX) & SHARING
- Copy to clipboard: stable, default fallback.
- PDF: Known freeze risks with html2canvas/html2pdf on complex DOM/CSS; mitigate by exporting a simpler node or using a CDN fallback; consider server/worker.
- DOCX: Use `html-to-docx` to export itinerary container; add a "Download as Word" button near PDF.


20. TROUBLESHOOTING GUIDE
- Blank page/500: Ensure `.env` has valid Supabase URL/anon key.
- Clipboard denied: Requires user gesture; ensure triggered from click.
- PDF blank/freeze: Reduce DOM scope for export; remove backdrop‑blur; try CDN html2canvas/html2pdf.
- Supabase insert error: Verify table exists and anon key has insert rights; inspect network/console logs.


21. MAINTENANCE & OPERATIONS
- Version control: Commit only source code; exclude `.env`.
- Monitoring: Add basic logging for generation time and insert success in future.
- Backups: Supabase provides backups; confirm retention according to plan.


22. ROADMAP & FUTURE ENHANCEMENTS
- Multi‑destination routing; transit time blocks; map overlays.
- Budget sliders and live price lookups with disclaimers.
- Auth + personal library of itineraries; shareable links.
- PWA: offline viewing, installable app.
- Robust, accessible DOCX/PDF export.


23. GLOSSARY
- FAB: Floating Action Button.
- RLS: Row Level Security (Postgres/Supabase feature).
- SPA: Single‑Page Application.
- Lottie: JSON‑based animations library.


24. REFERENCES
- React, Vite documentation
- Supabase docs
- Framer Motion docs
- Lottie/Bodymovin docs
- html2pdf.js, html2canvas docs
- html-to-docx


APPENDIX A: CONFIGURATION CHECKLIST
- `Outing/.env` with VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
- Verify `src/supabase.js` reads the above without throwing

APPENDIX B: TABLE SCHEMA EXAMPLE (POSTGRES)
CREATE TABLE IF NOT EXISTS public.itineraries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  title text,
  plan_text text NOT NULL,
  meta jsonb
);
CREATE INDEX IF NOT EXISTS idx_itineraries_created_at ON public.itineraries (created_at DESC);

APPENDIX C: PROMPT SKELETON
- Strict constraints against hallucinations
- Day templates repeated N times
- Allow "Not enough information" where unsure

APPENDIX D: PSEUDOCODE (CORE)
- generateAI(data): compute totalDays; build prompt; call model; parse; set state
- formatAIResponse(text): split costs; split days; clean lines; return {days, costSummary}

APPENDIX E: SAMPLE DATA SNIPPET
- Input: destination=Goa, 2025‑01‑01 to 2025‑01‑03
- Output (condensed): Day 1: Morning beach walk; Afternoon Fort Aguada; Evening Baga dinner; Cost Summary with ₹ items

APPENDIX F: SCREEN REFERENCE
- Result screen: loader → day cards → cost summary → copy/export → FAB

APPENDIX G: ACCEPTANCE CRITERIA (SAMPLE)
- Given valid dates, then an itinerary for ≤7 days renders with Morning/Afternoon/Evening slots
- Copy Plan puts the compiled text in clipboard
- Supabase insert works given valid env and table

APPENDIX H: LICENSE & CREDITS
- Uses React, Vite, Framer Motion, Lottie React, Supabase JS; respect their licenses

End of Document
 
APPENDIX I: ADVANCED ARCHITECTURE NARRATIVE
- Layers
  - Presentation: React components with animation (Framer Motion) and Lottie loader.
  - Orchestration: `Result.jsx` coordinates load → generate → parse → render → persist.
  - Persistence: Supabase client and table `itineraries` for plan storage.
  - Utilities: Clipboard API, optional export handlers (PDF/DOCX).
- Data Flow (textual sequence)
  1) User completes form → payload in `localStorage.currentItinerary`.
  2) `Result` mounts → reads payload → `generateAI()`.
  3) AI returns plaintext → `formatAIResponse()` → normalized lists.
  4) UI renders cards → user actions: copy/save/export.
  5) Save → Supabase insert; Export → PDF/DOCX paths.

APPENDIX J: PARSING RULES & REGEX EXAMPLES
- Cost split: `/Cost Summary:/i` → `[main, costs]`.
- Day split: `/Day\s*\d/i` → filter empty → map to sections.
- Line cleanup pipeline:
  - Remove leading bullets: `/^[-•*🌟]+/` → "".
  - Trim whitespace → filter len in [5, 300].
- Example
  Input: "- Morning: Walk to Fort Aguada"
  Output item: "Morning: Walk to Fort Aguada"

APPENDIX K: SUPABASE POLICIES (RLS) EXAMPLES
-- Enable RLS
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
-- Open insert for anon (demo only; lock down for production)
CREATE POLICY anon_insert ON public.itineraries
  FOR INSERT TO anon USING (true) WITH CHECK (true);
-- Read all (demo)
CREATE POLICY anon_select ON public.itineraries
  FOR SELECT TO anon USING (true);
-- Production note: replace with authenticated policies tied to `auth.uid()`.

APPENDIX L: ENV & VITE CONFIG NOTES
- Vite only exposes variables prefixed with `VITE_` to the client.
- `.env` sits at `Outing/.env`. Do not commit.
- Access via `import.meta.env.VITE_SUPABASE_URL` etc.

APPENDIX M: PERFORMANCE MEASUREMENT CHECKLIST
- Use Chrome Performance profiler while generating.
- Count rendered nodes: each day card ~N list items. Keep ≤7 days.
- Defer heavy visual effects during export.
- Image/media lazy-loading if you add images later.

APPENDIX N: ACCESSIBILITY (WCAG MAPPING)
- Perceivable: Color contrast for text/icons; support dark mode.
- Operable: Keyboard focus indicators; FAB reachable via Tab; skip repetitive animations.
- Understandable: Consistent headings (Day N), clear labels.
- Robust: Valid semantic HTML; avoid aria misuse.

APPENDIX O: DEPLOYMENT RECIPES
- Netlify
  - Build cmd: `npm run build` (base: Outing/)
  - Publish dir: `dist`
  - Env Vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Vercel
  - Framework: Vite
  - Build: `npm run build`
  - Output: `dist`
  - Env: same as above

APPENDIX P: CI/CD OUTLINE (GITHUB ACTIONS)
name: build
on: [push]
jobs:
  vite-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
        working-directory: Outing
      - run: npm run build
        working-directory: Outing

APPENDIX Q: LOGGING & ERROR CODES (SUGGESTED)
- E100: Missing itinerary payload
- E200: Clipboard write failed
- E300: Supabase insert failed
- E400: Export (PDF/DOCX) failed
- Strategy: user-facing notification + console.error with context

APPENDIX R: PDF EXPORT TROUBLESHOOTING (DEEP)
- Validate html2pdf availability: `console.log(window.html2pdf)` when using CDN fallback.
- Reduce export scope: target a minimal container `#itinerary`.
- Strip heavy CSS for export: backdrop-blur, fixed backgrounds, large shadows.
- Try CDN scripts to avoid ESM bundling issues.
- Use print CSS as alternative: `@media print { ... }` + `window.print()`.

APPENDIX S: SERVER/WORKER EXPORT ALTERNATIVES
- Server-side PDF with Puppeteer (Node): render a route and print to PDF.
- Off-main-thread with Web Worker: run html2canvas in worker (requires adaptation).

APPENDIX T: DOCX EXPORT SAMPLE (BROWSER)
// pseudocode
import htmlToDocx from 'html-to-docx'
const node = document.getElementById('itinerary')
const blob = await htmlToDocx(node.innerHTML, { margins: { top: 720, right: 720, bottom: 720, left: 720 } })
downloadBlob(blob, 'itinerary.docx')

APPENDIX U: SECURITY THREAT MODEL (STRIDE)
- Spoofing: use platform auth for saved itineraries; verify identities.
- Tampering: HTTPS; validate inputs; server-side checks for writes.
- Repudiation: timestamps/user ids for saved rows when auth exists.
- Info Disclosure: avoid storing PII; restrict table access.
- DoS: cap days; throttle AI calls if added server endpoints.
- Elevation: principle of least privilege for keys.

APPENDIX V: DATA RETENTION & BACKUP
- Plans are text; define retention period (e.g., 90 days) if needed.
- Supabase backups based on plan tier; verify recovery procedure.

APPENDIX W: MONITORING & SLOs (SUGGESTED)
- Metrics: generation time, insert success rate, export success rate.
- SLOs: 95% of generations under 3s; 99% insert success.
- Alerts: error spikes in console logs (future telemetry).

APPENDIX X: PRINT STYLES (ALTERNATIVE TO PDF)
@media print {
  body { background: #fff !important }
  .glass-card { box-shadow: none; background: #fff }
  /* Ensure itinerary fits page breaks */
  .itinerary-section { page-break-inside: avoid }
}

APPENDIX Y: SAMPLE ERROR MESSAGES (USER-FACING)
- "Nothing to copy yet." when copy attempted before data loads.
- "Plan copied to clipboard!" on success.
- "Failed to copy plan." on clipboard error.
- "Could not save plan right now." on Supabase error.

APPENDIX Z: DIAGRAMS TO ADD LATER
- System architecture (client, Supabase, export options).
- User flow (form → localStorage → Result → export/save).

End of Document
 
APPENDIX AA: COMPONENT INVENTORY & RESPONSIBILITIES
- `Outing/src/Result.jsx`
  - Orchestrates load → generate → parse → render → save → export utilities.
  - Renders: loader (Lottie), day cards (Framer Motion), cost summary card, notifications, FAB.
- `Outing/src/Notification.jsx`
  - Displays transient success/error/info messages triggered by actions (copy/save errors, etc.).
- `Outing/src/FAB.jsx`
  - Floating Action Button; appears after scrolling; scrolls to top smoothly.
- `Outing/src/supabase.js`
  - Exposes a configured Supabase client using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- `Outing/index.html`
  - App shell, meta tags, Open Graph tags, theme color, Manrope font preload.
- `Outing/src/main.jsx` (implied)
  - React entry point that mounts the app into `#root`.

APPENDIX AB: STATE MODEL (TEXTUAL)
States in `Result` component
- `loading`: true → showing Lottie while generating; false → render results or message.
- `aiResponse`: full raw text from AI; used as fallback for copy.
- `formattedResponse`: normalized day sections; array of `{ title, items[] }`.
- `costSummary`: array of price lines with currency markers.
- `savedData`: original payload from localStorage.
- `notification`: `{ type, message }` for user feedback.
- `showFab`: boolean; toggled by scroll listener.

Transitions
- mount → read localStorage → if present → `generateAI()` → parsing → set lists → `loading=false`.
- copy click → try clipboard → set notification.
- save click → insert into Supabase → set notification.
- scrolled >200px → `showFab=true`; else false.

APPENDIX AC: DATA CONTRACTS (TYPICAL SHAPES)
LocalStorage payload (example)
{
  "destination": "Goa",
  "startDate": "2025-01-01",
  "endDate": "2025-01-03",
  "preferences": ["beach", "local food"]
}

Formatted response (derived)
{
  "days": [
    { "title": "Day 1", "items": ["Morning: ...", "Afternoon: ...", "Evening: ..."] }
  ],
  "costSummary": ["Hotel: ₹...", "Transit: ₹..."]
}

APPENDIX AD: STYLING & THEME
- Typography: Manrope via Google Fonts.
- Glassmorphism cards: semi‑transparent backgrounds, subtle borders, blur (be mindful during export).
- Color system: Indigo primary; green accent for cost summary; dark mode variants.
- Icons: Unicode emoji mapped by keyword detection.
- Print styles: provide `@media print` to simplify export or fallback to `window.print()`.

APPENDIX AE: SEO & METADATA (FROM `index.html`)
- Title: "Travelly – AI Trip & Outing Planner".
- Meta description: "Plan beautiful, optimized itineraries with AI...".
- Theme color: `#6366f1`.
- Open Graph: title/description/type/image set for link previews.

APPENDIX AF: ERROR SCENARIOS & RECOVERY
- Missing `currentItinerary`: show friendly message; guide user back to input screen.
- Clipboard failure: retry prompt; suggest manual copy (select all).
- Supabase failure: log details, show concise toast; allow retry; offline-friendly behavior (keep local copy).
- Export failure: suggest DOCX or copy fallback; progressive enhancement.

APPENDIX AG: INTERNATIONALIZATION & LOCALE
- Currency detection currently looks for `₹`. For other locales, generalize detection; allow currency symbol from form input.
- Date formatting: show locale‑aware dates if rendering dates in UI.

APPENDIX AH: PRIVACY & COMPLIANCE NOTES
- Plans are non‑PII text. If user profiles are added, store minimal personal data.
- Provide clear terms about accuracy and advisory nature of itineraries; verify safety for activities.

APPENDIX AI: PERFORMANCE BUDGETS (NUMERIC)
- First meaningful paint target: < 1.5s on mid‑range device (development machines may be faster).
- Render budget: ≤ 500 list items total across cards for smooth 60fps.
- JS bundle (baseline): keep under ~300KB gz (without large maps/images).

APPENDIX AJ: OBSERVABILITY ROADMAP
- Add lightweight client logging for: generation time, parse duration, insert result.
- Future: send anonymized metrics to a monitoring endpoint; guard with user consent.

APPENDIX AK: ACCESS CONTROL (FUTURE WHEN AUTH ADDED)
- Users own itineraries → policies restrict rows to `auth.uid()`.
- Public share links: tokenized read‑only view; time‑bound tokens recommended.

APPENDIX AL: CODE QUALITY PRACTICES
- Linting/formatting via ESLint/Prettier.
- Commit hooks to prevent committing `.env` and large files.
- Small, focused components; descriptive names; JSDoc for core functions.

End of Document


