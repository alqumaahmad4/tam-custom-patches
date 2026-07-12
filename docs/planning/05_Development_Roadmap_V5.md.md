const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, TabStopType, TabStopPosition,
  LevelFormat, CheckBox
} = require('docx');
const fs = require('fs');

const C = {
  ink:'0A0A0A', accent:'1A56DB', accentDk:'1E429F', gold:'B8860B',
  surface:'F8FAFC', border:'E2E8F0', muted:'64748B', white:'FFFFFF',
  dark:'1A1A2E', tagBg:'DBEAFE', sectionBg:'F1F5F9',
  success:'16A34A', successBg:'DCFCE7', error:'DC2626', errorBg:'FEE2E2',
  warn:'D97706', warnBg:'FEF3C7', purpleBg:'F5F3FF', purple:'7C3AED',
};
const brd={style:BorderStyle.SINGLE,size:1,color:C.border};
const borders={top:brd,bottom:brd,left:brd,right:brd};

const h1=t=>new Paragraph({heading:HeadingLevel.HEADING_1,children:[new TextRun({text:t,font:'Inter',bold:true,size:38,color:C.white})],shading:{fill:C.dark,type:ShadingType.CLEAR},spacing:{before:480,after:240},indent:{left:360,right:360}});
const h2=t=>new Paragraph({heading:HeadingLevel.HEADING_2,children:[new TextRun({text:t,font:'Inter',bold:true,size:28,color:C.accentDk})],spacing:{before:360,after:160},border:{bottom:{style:BorderStyle.SINGLE,size:4,color:C.accent,space:4}}});
const h3=t=>new Paragraph({heading:HeadingLevel.HEADING_3,children:[new TextRun({text:t,font:'Inter',bold:true,size:24,color:C.ink})],spacing:{before:280,after:120}});
const h4=t=>new Paragraph({heading:HeadingLevel.HEADING_4,children:[new TextRun({text:t,font:'Inter',bold:true,size:21,color:C.muted})],spacing:{before:200,after:80}});
const body=t=>new Paragraph({children:[new TextRun({text:t,font:'Inter',size:22,color:C.ink})],spacing:{after:120}});
const italic=t=>new Paragraph({children:[new TextRun({text:t,font:'Inter',size:22,italic:true,color:C.muted})],spacing:{after:120}});
const sLabel=t=>new Paragraph({children:[new TextRun({text:t.toUpperCase(),font:'Inter',bold:true,size:18,color:C.accent,characterSpacing:80})],spacing:{before:240,after:80}});
const bullet=(t,lv=0,bd=false)=>new Paragraph({numbering:{reference:'bullets',level:lv},children:[new TextRun({text:t,font:'Inter',size:22,bold:bd})],spacing:{after:80}});
const num=(t,lv=0)=>new Paragraph({numbering:{reference:'numbers',level:lv},children:[new TextRun({text:t,font:'Inter',size:22})],spacing:{after:80}});
const check=t=>new Paragraph({children:[new TextRun({text:`☐  ${t}`,font:'Inter',size:22,color:C.ink})],spacing:{after:80},indent:{left:360}});
const checked=t=>new Paragraph({children:[new TextRun({text:`☑  ${t}`,font:'Inter',size:22,color:C.success})],spacing:{after:80},indent:{left:360}});
const spacer=()=>new Paragraph({children:[],spacing:{after:120}});
const divider=()=>new Paragraph({children:[],border:{bottom:{style:BorderStyle.SINGLE,size:4,color:C.border,space:1}},spacing:{before:160,after:160}});
const pb=()=>new Paragraph({children:[new TextRun({break:1})],spacing:{after:0}});

const note=(bg,labelColor,label,t)=>new Paragraph({children:[new TextRun({text:`${label}  `,font:'Inter',bold:true,size:20,color:labelColor}),new TextRun({text:t,font:'Inter',size:20,color:labelColor})],shading:{fill:bg,type:ShadingType.CLEAR},indent:{left:360,right:360},spacing:{before:80,after:160}});
const info=(t)=>note(C.tagBg,C.accentDk,'INFO',t);
const warn=(t)=>note(C.warnBg,C.warn,'WARN',t);
const risk=(t)=>note(C.errorBg,C.error,'RISK',t);
const success=(t)=>note(C.successBg,C.success,'DONE',t);

const cell=(t,{w=2400,bg,bd:isBd,color,align}={})=>new TableCell({borders,width:{size:w,type:WidthType.DXA},shading:bg?{fill:bg,type:ShadingType.CLEAR}:undefined,margins:{top:100,bottom:100,left:140,right:140},verticalAlign:VerticalAlign.CENTER,children:[new Paragraph({alignment:align||AlignmentType.LEFT,children:[new TextRun({text:t,font:'Inter',size:20,bold:isBd||false,color:color||C.ink})]})]});
const hdr=(labels,ws)=>new TableRow({tableHeader:true,children:labels.map((l,i)=>new TableCell({borders,width:{size:ws[i],type:WidthType.DXA},shading:{fill:C.dark,type:ShadingType.CLEAR},margins:{top:100,bottom:100,left:140,right:140},children:[new Paragraph({children:[new TextRun({text:l,font:'Inter',size:20,bold:true,color:C.white})]})]}))}); 
const tbl=(headers,ws,rows)=>new Table({width:{size:ws.reduce((a,b)=>a+b,0),type:WidthType.DXA},columnWidths:ws,rows:[hdr(headers,ws),...rows.map(r=>new TableRow({children:r.map((c,i)=>cell(c,{w:ws[i]}))}))]});
const kvt=(pairs,w1=2600,w2=6760)=>new Table({width:{size:w1+w2,type:WidthType.DXA},columnWidths:[w1,w2],rows:pairs.map(([k,v])=>new TableRow({children:[cell(k,{w:w1,bd:true,bg:C.sectionBg}),cell(v,{w:w2})]}))});

/* ── milestone badge ─────────────────────────────────────────────────────── */
const mBadge=(num,title,weeks,complexity)=>new Paragraph({children:[
  new TextRun({text:`M${num}`,font:'Inter',bold:true,size:22,color:C.white}),
  new TextRun({text:`  ${title}`,font:'Inter',bold:true,size:22,color:C.white}),
  new TextRun({text:`  ·  Weeks ${weeks}  ·  ${complexity}`,font:'Inter',size:20,color:'AABBCC'}),
],shading:{fill:C.dark,type:ShadingType.CLEAR},spacing:{before:200,after:120},indent:{left:200,right:200}});

/* ── issue card ──────────────────────────────────────────────────────────── */
const issueCard=(id,title,priority,effort,labels)=>[
  new Paragraph({children:[
    new TextRun({text:`#${id}  `,font:'Inter',bold:true,size:22,color:C.accentDk}),
    new TextRun({text:title,font:'Inter',bold:true,size:22,color:C.ink}),
    new TextRun({text:`   [${priority}]  ${effort}  ${labels}`,font:'Inter',size:18,color:C.muted}),
  ],shading:{fill:C.surface,type:ShadingType.CLEAR},spacing:{before:120,after:40},indent:{left:200}}),
];

/* ── cover ─────────────────────────────────────────────────────────────────  */
const cover=()=>[
  new Paragraph({children:[new TextRun({text:'TAM CUSTOM PATCHES',font:'Inter',bold:true,size:72,color:C.white})],shading:{fill:C.dark,type:ShadingType.CLEAR},alignment:AlignmentType.CENTER,spacing:{before:0,after:0}}),
  new Paragraph({children:[new TextRun({text:'Master Development Roadmap & GitHub Project Plan',font:'Inter',size:34,color:C.accent})],shading:{fill:C.dark,type:ShadingType.CLEAR},alignment:AlignmentType.CENTER,spacing:{before:0,after:0}}),
  new Paragraph({children:[new TextRun({text:'Version 5.0  ·  Codex Implementation Roadmap  ·  Extends V1–V4',font:'Inter',size:22,color:C.muted})],shading:{fill:C.dark,type:ShadingType.CLEAR},alignment:AlignmentType.CENTER,spacing:{before:120,after:0}}),
  new Paragraph({children:[new TextRun({text:'20 Milestones  ·  ~200 GitHub Issues  ·  26 Sprints  ·  6 Months',font:'Inter',size:20,color:C.muted,italic:true})],shading:{fill:C.dark,type:ShadingType.CLEAR},alignment:AlignmentType.CENTER,spacing:{before:80,after:0}}),
  new Paragraph({children:[new TextRun({text:' ',size:48})],shading:{fill:C.dark,type:ShadingType.CLEAR}}),
  pb(),
];

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 1 — REPOSITORY SETUP
════════════════════════════════════════════════════════════════════════════ */
const s1=()=>[
  h1('01 · REPOSITORY SETUP'),
  sLabel('Standards for the GitHub Repository'),

  h2('1.1 Repository Structure'),
  kvt([
    ['Repository name','tam-website'],
    ['Visibility','Private — never public. Client IP is contained within this repo.'],
    ['Default branch','main'],
    ['Protected branches','main, staging'],
    ['Monorepo?','No. Single Next.js application. The admin dashboard shares the same repo under the /admin route group.'],
    ['README','A comprehensive README.md at root: project overview, local setup instructions, environment variables table, deployment process, links to V1–V5 specs.'],
    ['License','.github/LICENSE — Proprietary. All rights reserved.'],
  ]),
  spacer(),

  h2('1.2 Branch Strategy'),
  body('The project uses a simplified trunk-based development model. All development happens in short-lived feature branches that merge to main via Pull Request.'),
  spacer(),
  tbl(
    ['Branch','Pattern','Purpose','Merges Into'],
    [1800,2400,2800,2360],
    [
      ['main','main','Production-ready code. Deployed to Vercel production on merge.','N/A — this is the trunk'],
      ['staging','staging','Pre-production integration branch. Deployed to a staging Vercel environment.','main (via release PR)'],
      ['feature','feat/[issue#]-brief-slug','New features and enhancements. One issue = one branch.','staging or main (small fixes)'],
      ['fix','fix/[issue#]-brief-slug','Bug fixes.','main (hotfix) or staging'],
      ['chore','chore/[slug]','Dependency updates, config changes, non-functional.','main'],
      ['docs','docs/[slug]','Documentation updates only.','main'],
    ]
  ),
  spacer(),
  info('Branch naming example: feat/42-hero-slider-patch-cards  ·  fix/118-mobile-menu-focus-trap  ·  chore/update-next-15-1'),
  spacer(),

  h2('1.3 Environment Files'),
  tbl(
    ['File','Committed?','Purpose'],
    [2200,1200,5960],
    [
      ['.env.local','NEVER','Local development secrets. Listed in .gitignore. Each developer creates their own.'],
      ['.env.example','YES','Template showing all required env vars with placeholder values. Checked into Git. Developers copy to .env.local.'],
      ['.env.test','YES (no secrets)','Test environment variables — only non-sensitive values like TEST_BASE_URL=http://localhost:3000.'],
      ['Vercel Dashboard','N/A','Production and preview secrets stored in Vercel Environment Variables. Never in .env files committed to Git.'],
    ]
  ),
  spacer(),
  h3('Required Environment Variables (Full List)'),
  tbl(
    ['Variable','Required','Environment','Description'],
    [3000,1000,1400,4000],
    [
      ['NEXT_PUBLIC_SITE_URL','Yes','All','Full URL: https://tamcustompatches.com'],
      ['NEXT_PUBLIC_TURNSTILE_SITE_KEY','Yes','All','Cloudflare Turnstile public key'],
      ['TURNSTILE_SECRET_KEY','Yes','Server','Cloudflare Turnstile secret key'],
      ['CLOUDFLARE_R2_ACCOUNT_ID','Yes','Server','Cloudflare account ID'],
      ['CLOUDFLARE_R2_ACCESS_KEY_ID','Yes','Server','R2 access key'],
      ['CLOUDFLARE_R2_SECRET_ACCESS_KEY','Yes','Server','R2 secret'],
      ['CLOUDFLARE_R2_BUCKET_NAME','Yes','Server','R2 bucket name: tam-uploads'],
      ['CLOUDFLARE_R2_PUBLIC_URL','Yes','All','Public CDN URL for R2 assets'],
      ['RESEND_API_KEY','Yes','Server','Transactional email API key'],
      ['RESEND_FROM_EMAIL','Yes','Server','noreply@tamcustompatches.com'],
      ['RESEND_INTERNAL_EMAIL','Yes','Server','Internal team email for quote notifications'],
      ['REVALIDATE_SECRET','Yes','Server','Secret token for ISR revalidation webhook'],
      ['UPSTASH_REDIS_REST_URL','Yes','Server','Vercel KV / Upstash URL for rate limiting'],
      ['UPSTASH_REDIS_REST_TOKEN','Yes','Server','Upstash auth token'],
      ['NEXTAUTH_SECRET','Phase 2','Server','NextAuth.js JWT signing secret'],
      ['NEXTAUTH_URL','Phase 2','Server','https://tamcustompatches.com'],
      ['DATABASE_URL','Phase 2','Server','PostgreSQL connection string (Neon)'],
      ['SANITY_PROJECT_ID','Phase 2','All','Sanity CMS project ID'],
      ['SANITY_DATASET','Phase 2','All','production or development'],
      ['SANITY_API_TOKEN','Phase 2','Server','Sanity write token for revalidation'],
      ['STABILITY_AI_API_KEY','Phase 2','Server','Stability AI for AI Design Studio generation'],
      ['NEXT_PUBLIC_GTM_ID','Yes','All','Google Tag Manager container ID'],
      ['NEXT_PUBLIC_GA4_ID','Yes','All','GA4 Measurement ID (G-XXXXXXXXXX)'],
      ['ADMIN_ALLOWED_IPS','Phase 2','Server','Comma-separated admin IP allowlist'],
    ]
  ),
  spacer(),

  h2('1.4 Commit Message Convention'),
  body('Conventional Commits (conventionalcommits.org). Enforced by commitlint + husky pre-commit hook.'),
  spacer(),
  h3('Format'),
  kvt([
    ['Structure','<type>(<scope>): <subject>  [max 72 chars on first line]'],
    ['Body','Optional — wrap at 72 chars. Explain the WHY, not the WHAT.'],
    ['Footer','Optional — BREAKING CHANGE: or Closes #<issue-number>'],
  ]),
  spacer(),
  tbl(
    ['Type','When to Use','Example'],
    [1200,2400,5760],
    [
      ['feat','New feature or enhancement','feat(hero): add 3D patch card parallax on mouse move'],
      ['fix','Bug fix','fix(quote): prevent double submission on slow connection'],
      ['perf','Performance improvement','perf(images): add LQIP blur placeholders to gallery'],
      ['refactor','Code refactoring (no behavior change)','refactor(hero): extract PatchCard into separate component'],
      ['test','Adding or updating tests','test(quote): add E2E test for multi-product quote flow'],
      ['chore','Dependency updates, build config','chore: upgrade next.js to 15.2.1'],
      ['docs','Documentation only','docs: update README with new env variable'],
      ['style','Code style (no logic change)','style: apply prettier formatting to components/hero/'],
      ['ci','CI/CD changes','ci: add Lighthouse CI to PR workflow'],
      ['revert','Revert a previous commit','revert: feat(hero): add 3D patch card parallax'],
    ]
  ),
  spacer(),

  h2('1.5 GitHub Labels'),
  tbl(
    ['Label','Color','Description'],
    [2400,1200,5760],
    [
      ['type: feature','#1A56DB (blue)','New feature or functionality'],
      ['type: bug','#DC2626 (red)','Something is broken'],
      ['type: performance','#7C3AED (purple)','Performance improvement'],
      ['type: accessibility','#16A34A (green)','Accessibility improvement or fix'],
      ['type: seo','#0284C7 (sky)','SEO-related change'],
      ['type: security','#B45309 (amber)','Security-related change'],
      ['type: chore','#64748B (gray)','Maintenance, dependencies, config'],
      ['type: docs','#94A3B8 (light gray)','Documentation only'],
      ['priority: critical','#7F1D1D (dark red)','Blocks release. Must be resolved immediately.'],
      ['priority: high','#DC2626 (red)','Must be in current sprint.'],
      ['priority: medium','#D97706 (amber)','Should be in current sprint.'],
      ['priority: low','#64748B (gray)','Nice to have. Next sprint or later.'],
      ['effort: XS','#DCFCE7 (light green)','< 2 hours'],
      ['effort: S','#D1FAE5 (green)','2–4 hours'],
      ['effort: M','#FEF3C7 (yellow)','0.5–1 day'],
      ['effort: L','#FED7AA (orange)','1–2 days'],
      ['effort: XL','#FEE2E2 (light red)','3+ days. Consider breaking down.'],
      ['milestone: foundation','#1A1A2E (dark)','Milestone 1 — Foundation'],
      ['milestone: design-system','#1A56DB (blue)','Milestone 2'],
      ['milestone: homepage','#7C3AED (purple)','Milestone 4'],
      ['milestone: quote-system','#16A34A (green)','Milestone 7'],
      ['milestone: production','#B45309 (amber)','Milestone 20'],
      ['blocked','#DC2626 (red) — white text','Issue is blocked by another issue or external dependency'],
      ['needs-design','#F59E0B (yellow)','Requires design decision before implementation can start'],
      ['needs-review','#1A56DB (blue)','PR or design is ready for review'],
      ['good first issue','#16A34A (green)','Suitable for a new contributor'],
    ]
  ),
  spacer(),

  h2('1.6 Issue Templates (.github/ISSUE_TEMPLATE/)'),
  h3('Feature Request Template (feature.yml)'),
  kvt([
    ['Fields','Title, Description (what and why), Acceptance Criteria (checkbox list), Design Reference (link to V3 section), Dependencies (other issue numbers), Priority (dropdown), Effort Estimate (dropdown), Labels (auto-applied: type: feature)'],
    ['Required fields','Title, Description, Acceptance Criteria'],
  ]),
  spacer(),
  h3('Bug Report Template (bug.yml)'),
  kvt([
    ['Fields','Title, Current behavior, Expected behavior, Steps to reproduce, Environment (browser, OS, viewport), Screenshots, Priority, Labels (auto-applied: type: bug)'],
    ['Required fields','Title, Current behavior, Expected behavior, Steps to reproduce'],
  ]),
  spacer(),
  h3('Chore / Maintenance Template (chore.yml)'),
  kvt([
    ['Fields','Title, Description of change, Reason (why now?), Risk level (dropdown: none/low/medium/high), Labels (auto-applied: type: chore)'],
  ]),
  spacer(),

  h2('1.7 Pull Request Template (.github/PULL_REQUEST_TEMPLATE.md)'),
  body('Every PR must complete this template before it can be merged:'),
  bullet('Summary: What does this PR do? (2-3 sentences)'),
  bullet('Related issues: Closes #[issue number]'),
  bullet('Type: feat / fix / perf / refactor / test / chore / docs'),
  bullet('Milestone: Which milestone does this belong to?'),
  bullet('Screenshots: Required for any UI change (before/after)'),
  bullet('Testing: What was tested? How? (manual steps + automated tests added)'),
  bullet('Checklist: Code compiles without errors · TypeScript passes (tsc --noEmit) · Lint passes (eslint) · Tests pass (vitest + playwright) · Lighthouse score maintained · Accessibility checked (axe-core) · Design reviewed against V3 spec · responsive (375/768/1440 tested)'),
  spacer(),

  h2('1.8 Version Numbering'),
  kvt([
    ['Scheme','Semantic Versioning 2.0: MAJOR.MINOR.PATCH'],
    ['MAJOR','Breaking changes to public-facing functionality (URL restructure, major redesign)'],
    ['MINOR','New features or significant enhancements (new product page, new form step)'],
    ['PATCH','Bug fixes, small improvements, dependency patches'],
    ['Pre-release','0.1.0 (pre-launch development) → 1.0.0 (production launch) → 1.x.x (post-launch)'],
    ['Git tags','Every production deployment is tagged: git tag v1.2.3 -m "Release: v1.2.3"'],
    ['GitHub Releases','Created on every MINOR or MAJOR version change with a CHANGELOG.'],
  ]),
  pb(),

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 2 — GITHUB PROJECT BOARD
════════════════════════════════════════════════════════════════════════════ */
  h1('02 · GITHUB PROJECT BOARD'),
  sLabel('Project Board Structure & Workflow'),

  h2('2.1 Project Board Configuration'),
  kvt([
    ['Board type','GitHub Projects (v2) — Table view as primary, Board view for sprint tracking'],
    ['Project name','Tam Website — Master Project'],
    ['Views','(1) Sprint Board (Kanban), (2) Roadmap (timeline), (3) Milestone Tracker, (4) Backlog (table)'],
    ['Automation','Auto-move: PR opened → "In Progress". PR merged → "Done". Issue closed → "Done". PR review requested → "Code Review".'],
  ]),
  spacer(),

  h2('2.2 Kanban Columns'),
  tbl(
    ['Column','Purpose','WIP Limit','Entry Criteria','Exit Criteria'],
    [1600,2400,1200,2000,2200],
    [
      ['Backlog','All created issues not yet in a sprint','None','Issue created and labeled','Assigned to sprint, moved to Ready'],
      ['Ready','Issues fully defined and ready to start','8 per developer','Issue has: AC, design ref, effort estimate, no blockers','Developer picks it up, moves to In Progress'],
      ['In Progress','Active development work','2 per developer','Developer assigned, branch created','PR opened, all checks passing'],
      ['Code Review','PR open, awaiting review','4 total','PR passes all CI checks automatically','At least 1 approval from another developer'],
      ['Testing','Merged to staging, awaiting QA','6 total','PR merged to staging branch','All acceptance criteria verified by QA or developer'],
      ['Blocked','Work cannot proceed due to dependency or external issue','None (flag immediately)','Blocker identified and documented in issue comments','Blocker resolved, issue returns to previous column'],
      ['Done','Completed and verified','None','All AC met, definition of done satisfied','Milestone progress updated'],
      ['Future Ideas','Potential enhancements not in current roadmap','None','Idea documented','Converted to a proper issue with AC or dismissed'],
    ]
  ),
  spacer(),
  h3('Issue Lifecycle Flow'),
  body('Created (Backlog) → Refined (Ready) → Assigned (In Progress) → PR Opened (Code Review) → Merged to staging (Testing) → AC verified (Done)'),
  body('A blocked issue moves to Blocked from any column. It returns to its previous column when unblocked, not to Backlog.'),
  pb(),

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 3 — DEVELOPMENT MILESTONES (M1–M20)
════════════════════════════════════════════════════════════════════════════ */
  h1('03 · DEVELOPMENT MILESTONES'),
  sLabel('20 Milestones — 6-Month Build Plan'),

  body('Each milestone represents a coherent, shippable unit of work. Milestones are completed in sequence. Some milestones can be worked in parallel (noted in Dependencies).'),
  spacer(),
  tbl(
    ['#','Milestone','Weeks','Effort (days)','Complexity'],
    [400,2800,1200,1800,2200],
    [
      ['M1','Foundation & Repository Setup','1–2','5d','Low'],
      ['M2','Design System & Tokens','2–3','5d','Low'],
      ['M3','Global Layout (Header, Footer)','3–4','8d','Medium'],
      ['M4','Homepage Structure & Sections','4–6','10d','Medium'],
      ['M5','Hero Slider (3 Slides + 3D)','5–7','12d','High'],
      ['M6','Navigation (Mega Menu, Mobile)','6–7','6d','Medium'],
      ['M7','Quote System (Full 6-Step Wizard)','7–10','15d','High'],
      ['M8','Product Pages (All 20+)','9–12','14d','Medium'],
      ['M9','AI Design Studio','10–12','12d','High'],
      ['M10','Gallery & Lightbox','12–13','6d','Medium'],
      ['M11','Industry Landing Pages','13–14','6d','Low'],
      ['M12','Blog & Learning Center','14–15','6d','Medium'],
      ['M13','CMS Integration (Sanity)','15–17','10d','High'],
      ['M14','Admin Dashboard','17–19','14d','High'],
      ['M15','SEO Foundation','19–20','5d','Medium'],
      ['M16','Analytics & Tracking','20–21','4d','Low'],
      ['M17','Accessibility Audit & Fixes','21–22','5d','Medium'],
      ['M18','Performance Optimization','22–23','6d','Medium'],
      ['M19','Testing Suite','23–24','8d','Medium'],
      ['M20','Production Launch','25–26','4d','Low'],
    ]
  ),
  spacer(),

  // ── Milestone detail cards ───────────────────────────────────────────────

  mBadge(1,'Foundation & Repository Setup','1–2','Low complexity · 5 days'),
  kvt([
    ['Objectives','Set up the project foundation: repository, CI/CD, tooling, and environment configuration. No UI work in this milestone.'],
    ['Deliverables','GitHub repo created. Branch protection on main + staging. Commit lint + husky installed. ESLint + Prettier configured. TypeScript strict config. Tailwind 4 + shadcn/ui scaffolded. Vitest + Playwright installed. Vercel project connected. GitHub Actions CI workflow (type check, lint, test, Lighthouse CI). .env.example populated. README complete.'],
    ['Dependencies','None — this is the first milestone.'],
    ['Acceptance Criteria','git push to main triggers Vercel deployment. CI pipeline runs and passes on every PR. npm run dev starts without errors. npm run build completes without type errors.'],
    ['Definition of Done','All tooling installed, configured, and verified on a developer\'s local machine. CI pipeline green on an empty commit.'],
    ['Risks','Vercel account access. Cloudflare R2 bucket creation. Environment variable coordination between team members.'],
  ]),
  spacer(),

  mBadge(2,'Design System & Tokens','2–3','Low complexity · 5 days'),
  kvt([
    ['Objectives','Implement the complete design system from V3 Visual Design Bible. All CSS custom properties, Tailwind config, typography, spacing, shadows, radius system. No components yet — tokens only.'],
    ['Deliverables','styles/globals.css with all CSS custom properties (colors, shadows, radius, spacing). tailwind.config.ts with extended design tokens. Inter font loaded via next/font. lib/animations/ folder with all Framer Motion variants and spring configs (from V4 spec). Typography scale verified in a /style-guide route (dev only).'],
    ['Dependencies','M1 (Foundation)'],
    ['Acceptance Criteria','Every design token from V3 Section 12 is defined in globals.css. Inter renders correctly with no FOUT. A /style-guide page renders all type scales, colors, shadows, and spacing correctly. Tailwind CSS v4 JIT builds successfully.'],
    ['Definition of Done','Design system reviewed against V3 spec by a developer. All tokens match V3 values exactly.'],
    ['Risks','Tailwind CSS v4 breaking changes from v3. CSS custom properties and Tailwind interop edge cases.'],
  ]),
  spacer(),

  mBadge(3,'Global Layout (Header, Footer, Breadcrumbs)','3–4','Medium complexity · 8 days'),
  kvt([
    ['Objectives','Build the persistent layout elements that appear on every page: header (all variants), footer, announcement bar, breadcrumbs, and skip-to-main link.'],
    ['Deliverables','Header (transparent, solid, minimized variants). Sticky scroll behavior. Announcement bar (dismissible). Footer (5-column, responsive). CountrySelector component. Breadcrumbs with BreadcrumbList schema. Skip-to-main link. Root layout.tsx with proper metadata structure.'],
    ['Dependencies','M2 (Design System)'],
    ['Acceptance Criteria','Header transitions from transparent to solid at 80px scroll. Mobile hamburger opens/closes drawer. Footer renders correctly on all 3 breakpoints. Announcement bar is dismissible and state persists in sessionStorage. Breadcrumbs render on product/blog pages with correct schema.'],
    ['Definition of Done','Lighthouse Accessibility = 100 on header + footer in isolation. No layout shift on scroll.'],
    ['Risks','iOS Safari safe-area insets on mobile header. Focus trap in mobile menu drawer.'],
  ]),
  spacer(),

  mBadge(4,'Homepage Structure & Content Sections','4–6','Medium complexity · 10 days'),
  kvt([
    ['Objectives','Build all homepage sections except the hero (which is M5). Each section is a Server Component by default. Full responsive behavior required.'],
    ['Deliverables','Trust Bar (with counter animation). Featured Products 4-grid. How It Works (3 steps + connector animation). Industries chip section. Why Choose Us cards. Gallery preview (6 images, links to /gallery). Testimonials carousel. Client Logo marquee. FAQ accordion (6 items). Blog preview (3 cards). Final CTA banner. Homepage SEO metadata.'],
    ['Dependencies','M3 (Global Layout), M2 (Design System)'],
    ['Acceptance Criteria','All 12 sections render on mobile, tablet, desktop. Counter animation triggers on viewport entry. Gallery preview shows 6 images with greyscale-to-color hover. Testimonial carousel auto-scrolls. Logo marquee pauses on hover. FAQ accordion uses FAQPage schema JSON-LD.'],
    ['Definition of Done','Homepage matches V3 Section 2 art direction at all 3 breakpoints. Lighthouse Performance ≥ 90.'],
    ['Risks','Masonry layout implementation for gallery preview. Marquee infinite scroll cross-browser consistency.'],
  ]),
  spacer(),

  mBadge(5,'Hero Slider (3 Slides + 3D Scenes)','5–7','High complexity · 12 days'),
  kvt([
    ['Objectives','Build the 3-slide hero with all 3D visual scenes as specified in V4 Section 7. This is the highest-complexity single component in the project.'],
    ['Deliverables','HeroSlider (auto-advance, swipe, keyboard, dot nav). HeroSlide1 (PatchCardScene — 6 patch cards, mouse parallax, auto-drift, layered shadows, SVG textures). HeroSlide2 (ApparelDeckScene — fan interaction). HeroSlide3 (MartialArtsScene — gi photo, light sweep, gold accents). Loading animation sequence. Reduced motion fallback for all 3 slides.'],
    ['Dependencies','M4 (Homepage Structure — hero placeholder must already exist), M2 (Design System)'],
    ['Acceptance Criteria','All 15 acceptance criteria from V4 Section 7.6 must pass. Mouse parallax verified on desktop. Swipe navigation on mobile. Reduced motion: all cards static. Lighthouse Performance ≥ 90 with hero fully rendered. CLS = 0 during hero card animations.'],
    ['Definition of Done','Hero reviewed against V3 Section 3 art direction. V4 Section 7.6 acceptance criteria checklist signed off.'],
    ['Risks','CSS perspective/3D transform browser inconsistencies (especially Safari). GPU memory usage with will-change on 6 patch cards simultaneously. Framer Motion AnimatePresence + 3D transforms interaction bugs.'],
  ]),
  spacer(),

  mBadge(6,'Navigation (Mega Menu, Mobile Menu, Search)','6–7','Medium complexity · 6 days'),
  kvt([
    ['Objectives','Complete the navigation system: mega menu for all categories, mobile menu drawer, and search overlay.'],
    ['Deliverables','Mega menu (Custom Patches, Apparel, Martial Arts columns). Hover delay (150ms). Keyboard navigation (arrow keys, Escape). Mobile menu accordion drawer. Search overlay (Phase 1: static data). Keyboard shortcut (⌘K / Ctrl+K opens search).'],
    ['Dependencies','M3 (Global Layout — header shell must exist)'],
    ['Acceptance Criteria','Mega menu opens/closes correctly. Escape key closes. Tab navigation works through all menu items. Mobile accordion expands/collapses. Search overlay opens/closes. WCAG AA for all navigation elements.'],
    ['Definition of Done','Navigation tested on 375px, 768px, 1440px. All keyboard navigation paths verified. axe-core: 0 violations.'],
    ['Risks','Hover intent delay preventing accidental opens. Focus management when mega menu closes.'],
  ]),
  spacer(),

  mBadge(7,'Quote System (6-Step Wizard)','7–10','High complexity · 15 days'),
  kvt([
    ['Objectives','Build the complete multi-step quote wizard. The most important conversion surface on the site. Every interaction, validation, and error state must be production-ready.'],
    ['Deliverables','QuoteWizard state machine (Zustand). URL step sync. LocalStorage persistence. All 7 steps (Step 0: product select through Step 6: contact form). Order Summary sidebar (sticky desktop, drawer mobile). Artwork upload (R2 presign flow). Save & Continue Later. Quote form success page with animated checkmark. /api/quote/submit endpoint. /api/files/presign endpoint. /api/quote/save + /api/quote/restore endpoints. Email notifications via Resend. Cloudflare Turnstile integration.'],
    ['Dependencies','M2 (Design System), M3 (Global Layout), Cloudflare R2 bucket configured, Resend API key'],
    ['Acceptance Criteria','Quote wizard completes end-to-end: submission → success page → email delivered to test inbox. Artwork file uploads to R2 successfully. Save URL restores quote state. All validation error messages display correctly. Mobile: sticky bottom bar shows summary. Turnstile blocks bot submissions. Rate limiting returns 429 on excess requests.'],
    ['Definition of Done','All 10 E2E test scenarios from V4 Section 1.11 pass. No console errors in any quote step.'],
    ['Risks','R2 presign URL expiry edge cases. Mobile keyboard covering form inputs. File upload progress accuracy. Multi-product quote state complexity.'],
  ]),
  spacer(),

  mBadge(8,'Product Pages (All 20+ Pages)','9–12','Medium complexity · 14 days'),
  kvt([
    ['Objectives','Build all product pages using the universal product page template from V2 Section 7. Covers patches (7), apparel (9), martial arts (5), accessories (4).'],
    ['Deliverables','ProductPageTemplate RSC. Category hub pages (4). Individual product pages (25+). Product photography gallery with lightbox. Size guide component. Backing selector. Thread color chart. Manufacturing process section. Related products carousel. Review section (Phase 1: static JSON data). Product-specific FAQ. SEO metadata per page. JSON-LD Product schema.'],
    ['Dependencies','M3 (Global Layout), M2 (Design System), M7 (Quote CTA links to quote wizard)'],
    ['Acceptance Criteria','All product pages render at 3 breakpoints. Product schema validates in Google Rich Results Test. Related products carousel scrolls on mobile. Backing selector shows all 8 types with correct SVG icons. Quote CTA pre-fills the product type in the quote wizard URL.'],
    ['Definition of Done','All 25+ product pages generate statically at build time. Lighthouse SEO = 100 on 3 sampled product pages.'],
    ['Risks','Large number of pages — requires efficient content data structure. Photography assets may not all be ready at build time (use placeholder images with a clear TODO system).'],
  ]),
  spacer(),

  mBadge(9,'AI Design Studio','10–12','High complexity · 12 days'),
  kvt([
    ['Objectives','Build the AI Design Studio tool at /ai-designer. Phase 1 uses static placeholder previews. Phase 2 API integration placeholders are coded but not activated.'],
    ['Deliverables','AIDesigner split-panel layout. All control inputs (prompt, product type, shape, size, colors, border, backing, style keywords). AIPromptInput with floating label, character count, suggestion chips. AIPreviewPanel with Phase 1 static preview logic. Version history strip. Compare view (split-screen with draggable divider). Save design (localStorage). Share URL generation. "Get a Quote" → /quote with params pre-filled. Undo/redo (20-step history). /api/ai/generate endpoint (Phase 1: returns placeholder). Framer Motion generation loading animation.'],
    ['Dependencies','M2 (Design System), M3 (Global Layout), M7 (Quote form for "Get a Quote" CTA)'],
    ['Acceptance Criteria','Generate Preview shows a placeholder result. Regenerate changes the result. Undo/Redo reverses parameter changes. Compare view divider is draggable. Share URL encodes all current parameters and restores on load. Mobile tab navigation between Controls and Preview.'],
    ['Definition of Done','AI Design Studio reviewed against V2 Section 6 and V4 Section 7. All interactions work on mobile.'],
    ['Risks','LocalStorage size limits for saved designs with image URLs. Comparison view divider drag behavior on touch.'],
  ]),
  spacer(),

  mBadge(10,'Gallery & Lightbox','12–13','Medium complexity · 6 days'),
  kvt([
    ['Objectives','Build the /gallery page with masonry layout, greyscale-to-color hover effect, and full-screen lightbox.'],
    ['Deliverables','MasonryGallery component (CSS masonry or JS solution). GalleryCard with greyscale/color transition. Lightbox (full-screen, prev/next navigation, zoom to 2×, swipe on mobile). Gallery page with category filter chips. Empty state. Phase 1: static gallery data (JSON). Phase 2: CMS-connected.'],
    ['Dependencies','M2 (Design System), M3 (Global Layout)'],
    ['Acceptance Criteria','Gallery renders as masonry (variable height cards). Hover reveals color on desktop. Tap toggles color on mobile. Lightbox opens on click. Keyboard navigation in lightbox (arrow keys, Escape). Zoom to 2× on click/pinch. Empty state renders when no images.'],
    ['Definition of Done','Gallery Lighthouse Performance ≥ 90 with 18 images loaded. axe-core: 0 violations in lightbox.'],
    ['Risks','CSS masonry browser support (especially Firefox fallback). Lightbox animation and focus trap interaction.'],
  ]),
  spacer(),

  mBadge(11,'Industry Landing Pages','13–14','Low complexity · 6 days'),
  kvt([
    ['Objectives','Build the 10 industry landing pages using the industry page template.'],
    ['Deliverables','IndustryPageTemplate RSC. All 10 industry pages (/industries/[slug]). Industries hub page. Industry-specific CTAs linking to /quote with product pre-filled. Breadcrumbs. Industry schema JSON-LD.'],
    ['Dependencies','M8 (Product Pages — industry pages link to product pages), M3 (Global Layout)'],
    ['Acceptance Criteria','All 10 industry pages render. Links to product pages are correct. Quote CTA pre-fills the most relevant product type for each industry. Lighthouse SEO = 100.'],
    ['Definition of Done','10 industry pages live in production build. Each page has unique meta title and description.'],
    ['Risks','Content for all 10 industry pages must be written before build (coordinate with content team).'],
  ]),
  spacer(),

  mBadge(12,'Blog & Learning Center','14–15','Medium complexity · 6 days'),
  kvt([
    ['Objectives','Build the blog infrastructure with MDX support. Phase 1: static MDX files. Phase 2: CMS-connected.'],
    ['Deliverables','Blog index page (/blog) with pagination (6 articles per page). Blog article page template. BlogCard component. Category filtering. Author component. Reading time estimate. Related articles. Article schema JSON-LD. Phase 1: 5 seed articles in /content/blog/.'],
    ['Dependencies','M3 (Global Layout), M2 (Design System)'],
    ['Acceptance Criteria','5 blog articles render correctly. Pagination works. Category filter returns correct articles. Reading time is displayed. Article schema validates in Rich Results Test.'],
    ['Definition of Done','Blog index and 5 articles pass Lighthouse SEO = 100. All articles render correctly on mobile.'],
    ['Risks','MDX rendering edge cases. Missing photography for early articles (use placeholder system).'],
  ]),
  spacer(),

  mBadge(13,'CMS Integration (Sanity)','15–17','High complexity · 10 days'),
  kvt([
    ['Objectives','Migrate content from static files to Sanity CMS. Connect all CMS-editable content to the front-end.'],
    ['Deliverables','Sanity project created. All schemas defined (products, blog, FAQs, testimonials, gallery, homepage sections, industries). Content migrated from JSON/MDX to Sanity. Sanity Studio embedded at /admin/cms. ISR revalidation webhook configured. Content preview mode for staging.'],
    ['Dependencies','M8, M10, M11, M12 (all content-driven pages must exist before CMS migration)'],
    ['Acceptance Criteria','Editing a product description in Sanity Studio reflects on the product page within 1 hour (ISR). Publishing a new blog article makes it immediately available. Gallery item approval workflow works end-to-end.'],
    ['Definition of Done','All Phase 2 CMS collections live. Content team can update all CMS-editable content without developer involvement.'],
    ['Risks','Sanity GROQ query performance at scale. ISR revalidation reliability. CMS schema changes requiring data migration.'],
  ]),
  spacer(),

  mBadge(14,'Admin Dashboard','17–19','High complexity · 14 days'),
  kvt([
    ['Objectives','Build the internal admin dashboard for the Tam team to manage quotes, contacts, and analytics.'],
    ['Deliverables','Admin authentication (NextAuth.js + Credentials). Role system (Super Admin, Sales Manager, Sales Rep, Content Editor, Viewer). Quote list view (TanStack Table, filters, search). Quote detail drawer. Contact management. Activity log. Analytics dashboard (KPI cards + Recharts). Email template manager. Settings page. Admin navigation.'],
    ['Dependencies','M7 (Quote system — admin reads quote submissions), M13 (CMS — some admin functions overlap), PostgreSQL database (Neon) must be provisioned'],
    ['Acceptance Criteria','Admin login works. Quote list loads and filters. Quote detail drawer shows all info. Admin cannot access staging admin from the wrong IP. Activity log records all actions. Analytics KPI cards show correct data.'],
    ['Definition of Done','Admin demo with all roles tested. No PII exposed in browser DevTools network tab beyond what the logged-in role requires.'],
    ['Risks','Admin build complexity vs. timeline. IP allowlist causing access issues during development. TanStack Table performance with large quote datasets.'],
  ]),
  spacer(),

  mBadge(15,'SEO Foundation','19–20','Medium complexity · 5 days'),
  kvt([
    ['Objectives','Ensure all SEO technical requirements from V2 Section 8 are implemented and verified.'],
    ['Deliverables','next-sitemap configuration (XML sitemap + robots.txt). generateMetadata() for all routes. BreadcrumbList schema on all pages. Organization schema on homepage. FAQPage schema on all FAQ sections. Canonical tags. Hreflang (placeholder for Phase 2 i18n). Open Graph images for all major pages. Google Search Console verification. GSC sitemap submission.'],
    ['Dependencies','All page milestones (M4–M12) must be complete — you can only do SEO on existing pages.'],
    ['Acceptance Criteria','sitemap.xml generates with all page URLs. Robots.txt blocks /api/ and /admin/. Every page has a unique title and meta description. Google Rich Results Test: no errors on Product, FAQ, Article, Breadcrumb schemas. GSC sitemap accepted (no errors).'],
    ['Definition of Done','Lighthouse SEO = 100 on all sampled pages (homepage, 1 product page, 1 blog article).'],
    ['Risks','OG image generation (can use @vercel/og or static PNGs — decide early). Sitemap accuracy for dynamically generated product pages.'],
  ]),
  spacer(),

  mBadge(16,'Analytics & Tracking','20–21','Low complexity · 4 days'),
  kvt([
    ['Objectives','Implement all tracking events from V4 Section 4. Configure GTM, GA4, Clarity, and conversion tracking.'],
    ['Deliverables','GTM snippet in root layout. track() utility function. All 30+ custom events implemented at correct trigger points. GA4 conversions configured (quote_submitted, contact_form_submitted). GA4 funnel report for quote wizard steps. Microsoft Clarity script (via GTM). Meta Pixel (via GTM). LinkedIn Insight (via GTM). Google Ads conversion tag (via GTM).'],
    ['Dependencies','M7 (Quote system — events fire inside it), M4 (Homepage — hero CTA events)'],
    ['Acceptance Criteria','Submitting a test quote fires the quote_submitted event in GA4 DebugView. Quote funnel steps all register in GA4. Clarity session recording captures the homepage visit.'],
    ['Definition of Done','All events from V4 Section 4.2 verified in GA4 DebugView. GTM container published.'],
    ['Risks','GTM preview mode not firing events in Next.js SPA navigation. GA4 custom dimensions not configured before events fire.'],
  ]),
  spacer(),

  mBadge(17,'Accessibility Audit & Fixes','21–22','Medium complexity · 5 days'),
  kvt([
    ['Objectives','Run a comprehensive accessibility audit against WCAG 2.1 AA. Fix all violations. Target: Lighthouse Accessibility = 100 on all pages.'],
    ['Deliverables','axe-core E2E audit on all major pages. Manual keyboard navigation test (every interactive element reachable by Tab). Screen reader test (VoiceOver on macOS + NVDA on Windows). Focus ring verification. Color contrast audit (all text/background combinations). Motion audit (all animations off in reduced-motion mode). Aria label audit.'],
    ['Dependencies','All page milestones must be complete (M3–M12)'],
    ['Acceptance Criteria','axe-core: 0 violations on: homepage, product page, quote form, contact page, gallery, blog. Manual keyboard test: all features usable without mouse. Screen reader: all interactive elements announced correctly.'],
    ['Definition of Done','Lighthouse Accessibility = 100 on 5 sampled pages. axe-core CI gate passes on all E2E tests.'],
    ['Risks','Focus trap edge cases in complex components (mega menu, lightbox, modal). Missing aria-labels on Framer Motion animated elements.'],
  ]),
  spacer(),

  mBadge(18,'Performance Optimization','22–23','Medium complexity · 6 days'),
  kvt([
    ['Objectives','Achieve all performance budget targets from V4 Section 6 on production build.'],
    ['Deliverables','Lighthouse CI targets met (Performance ≥ 90 mobile, ≥ 95 desktop). LCP < 1.8s. CLS < 0.05. INP < 150ms. First JS bundle < 100KB gzipped. Image optimization audit (all above-fold images use priority, all below-fold use lazy). Code splitting verified (hero, quote, AI Design Studio all lazy-loaded). Third-party scripts deferred. Font loading optimized.'],
    ['Dependencies','All page milestones complete. Real photography assets loaded (not placeholders).'],
    ['Acceptance Criteria','All Core Web Vitals pass "Good" thresholds in Lighthouse CI on main branch. @next/bundle-analyzer report shows no unexpected large chunks. No render-blocking resources.'],
    ['Definition of Done','Vercel Speed Insights shows green Core Web Vitals on production for 7 consecutive days.'],
    ['Risks','Third-party scripts (GTM, Clarity, Intercom) degrading LCP and INP. Large hero images degrading LCP. Framer Motion bundle size.'],
  ]),
  spacer(),

  mBadge(19,'Testing Suite Completion','23–24','Medium complexity · 8 days'),
  kvt([
    ['Objectives','Ensure full test coverage before launch. All unit tests, E2E tests, and accessibility tests must pass.'],
    ['Deliverables','Vitest unit tests: all lib/utils/ functions (≥ 90% coverage). All lib/validations/ schemas (≥ 95%). All custom hooks (≥ 80%). Playwright E2E: all 10 critical path tests from V4 Section 1.11. Quote form end-to-end. Contact form. Gallery lightbox. Mobile menu. Search overlay. 404 page. axe-core automated accessibility on all major pages. Lighthouse CI green on all PRs.'],
    ['Dependencies','All feature milestones complete'],
    ['Acceptance Criteria','npm test passes. npm run test:e2e passes with all tests green. Coverage thresholds met. CI pipeline green.'],
    ['Definition of Done','Zero failing tests. Zero axe-core violations. All Lighthouse CI targets met.'],
    ['Risks','E2E test flakiness in CI (especially animated elements). Test data setup for quote submission tests.'],
  ]),
  spacer(),

  mBadge(20,'Production Launch','25–26','Low complexity · 4 days'),
  kvt([
    ['Objectives','Deploy to production. Complete the Production Readiness Checklist (Section 14 of this document).'],
    ['Deliverables','Domain DNS configured. SSL verified. All env vars set in Vercel production. Cloudflare WAF enabled. GSC verified. GA4 receiving real data. Resend email sending from production domain. Error monitoring active. Uptime monitoring (Uptime Robot) configured. v1.0.0 git tag. GitHub Release created.'],
    ['Dependencies','M19 (Testing Suite) — nothing launches without passing tests.'],
    ['Acceptance Criteria','Production URL loads correctly. Quote submission delivers email to the internal team. GA4 receives page views. Lighthouse runs on production URL and all scores meet targets.'],
    ['Definition of Done','Production Readiness Checklist (Section 14) fully signed off. First real user submits a quote successfully.'],
    ['Risks','DNS propagation delays. Cloudflare caching stale pages after first deployment. Email deliverability (SPF/DKIM records).'],
  ]),
  pb(),

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 4 — GITHUB ISSUES
════════════════════════════════════════════════════════════════════════════ */
  h1('04 · GITHUB ISSUES'),
  sLabel('Granular Issues for Every Feature'),

  h2('4.1 Issue Format Standard'),
  body('Every issue in the GitHub project follows this template. The fields below are the minimum required for an issue to be moved to "Ready":'),
  kvt([
    ['Title','[Milestone] Component/Feature: Specific task. Example: [M5] PatchCard: implement SVG texture overlay'],
    ['Description','What needs to be built and why. Reference to the V1–V4 spec section. 3–5 sentences.'],
    ['Acceptance Criteria','Checkboxes. Each criterion is independently verifiable. Average: 4–6 criteria per issue.'],
    ['Files Likely Affected','List of component files, API routes, or config files that will change.'],
    ['Dependencies','Other issue numbers that must be completed first.'],
    ['Labels','type: + priority: + effort: + milestone: (4 labels minimum)'],
    ['Effort Estimate','XS (<2h), S (2–4h), M (0.5–1d), L (1–2d), XL (3+d)'],
    ['Assignee','Set when the issue moves to "In Progress"'],
  ]),
  spacer(),

  h2('4.2 Complete Issue List — Milestone 1 (Foundation)'),
  ...issueCard('001','Repository setup: create GitHub repo, configure branch protection, install commitlint + husky','P0 — Critical','S (2–4h)','[type: chore] [priority: critical] [effort: S] [milestone: foundation]'),
  bullet('Acceptance Criteria: repo created, branch protection on main+staging, commitlint rejects non-conventional commits'),
  ...issueCard('002','Project scaffolding: create Next.js 15 app with TypeScript, Tailwind CSS 4, and App Router','P0 — Critical','M (0.5–1d)','[type: chore] [priority: critical] [effort: M] [milestone: foundation]'),
  bullet('Acceptance Criteria: npm run dev starts. npm run build completes. npm run type-check passes.'),
  ...issueCard('003','Install and configure shadcn/ui with all approved components','P0 — Critical','S (2–4h)','[type: chore] [priority: critical] [effort: S] [milestone: foundation]'),
  bullet('Acceptance Criteria: All 17 shadcn components from V4 Section 1.6 installed in components/ui/'),
  ...issueCard('004','Configure ESLint, Prettier, and Tailwind CSS Prettier plugin','P0 — Critical','S','[type: chore] [priority: critical] [effort: S] [milestone: foundation]'),
  ...issueCard('005','Install Vitest and React Testing Library. Create first placeholder test.','P0 — Critical','S','[type: chore] [priority: critical] [effort: S] [milestone: foundation]'),
  ...issueCard('006','Install Playwright. Configure for E2E testing against localhost:3000.','P0 — Critical','S','[type: chore] [priority: critical] [effort: S] [milestone: foundation]'),
  ...issueCard('007','Connect Vercel project. Configure preview + production environments.','P0 — Critical','S','[type: chore] [priority: critical] [effort: S] [milestone: foundation]'),
  ...issueCard('008','Create GitHub Actions CI workflow: type-check, lint, unit tests, build.','P0 — Critical','M','[type: ci] [priority: critical] [effort: M] [milestone: foundation]'),
  bullet('Acceptance Criteria: CI runs on every PR. Failing type-check or lint blocks merge.'),
  ...issueCard('009','Set up Lighthouse CI in GitHub Actions. Configure targets from V4 Section 6.','P1 — High','M','[type: ci] [priority: high] [effort: M] [milestone: foundation]'),
  ...issueCard('010','Create .env.example with all environment variables from V4 Section 1.3.','P0 — Critical','XS','[type: chore] [priority: critical] [effort: XS] [milestone: foundation]'),
  spacer(),

  h2('4.3 Complete Issue List — Milestone 2 (Design System)'),
  ...issueCard('011','Implement CSS custom properties (design tokens) in styles/globals.css from V3 Section 12','P0 — Critical','M','[type: feature] [priority: critical] [effort: M] [milestone: design-system]'),
  bullet('Acceptance Criteria: All color, shadow, radius, and spacing tokens defined. Match V3 values exactly.'),
  ...issueCard('012','Configure Tailwind CSS 4 to use CSS custom properties for all design tokens','P0 — Critical','S','[type: chore] [priority: critical] [effort: S] [milestone: design-system]'),
  ...issueCard('013','Load Inter font via next/font/google. Configure display:swap, latin subset, weights 400–800.','P0 — Critical','S','[type: feature] [priority: critical] [effort: S] [milestone: design-system]'),
  ...issueCard('014','Create lib/animations/variants.ts with all shared Framer Motion variants from V4 Section 1.7','P0 — Critical','S','[type: feature] [priority: critical] [effort: S] [milestone: design-system]'),
  ...issueCard('015','Create lib/animations/springs.ts with spring and easing configs from V4 Section 1.7','P0 — Critical','XS','[type: feature] [priority: critical] [effort: XS] [milestone: design-system]'),
  ...issueCard('016','Create all TypeScript types in types/ directory (QuoteItem, ProductCategory, etc.) from V4 Section 1.3','P0 — Critical','S','[type: feature] [priority: critical] [effort: S] [milestone: design-system]'),
  ...issueCard('017','Create lib/constants/ with PRODUCT_TYPES, ROUTES, COUNTRIES, ALLOWED_MIME_TYPES','P1','S','[type: feature] [priority: high] [effort: S] [milestone: design-system]'),
  ...issueCard('018','Create all custom hooks: useScrollY, useCountUp, useMouse, useMediaQuery, useReducedMotion, useLocalStorage, useDebounce, useInView','P0 — Critical','L (1–2d)','[type: feature] [priority: critical] [effort: L] [milestone: design-system]'),
  bullet('Acceptance Criteria: Each hook has a unit test. useReducedMotion returns true in a jsdom environment with prefers-reduced-motion: reduce.'),
  ...issueCard('019','Create track() analytics utility in lib/analytics/track.ts with typed event names','P1','S','[type: feature] [priority: high] [effort: S] [milestone: design-system]'),
  ...issueCard('020','Create /app/style-guide/page.tsx (dev-only) showing all design tokens visually','P2','M','[type: docs] [priority: low] [effort: M] [milestone: design-system]'),
  spacer(),

  h2('4.4 Complete Issue List — Milestone 3 (Global Layout)'),
  ...issueCard('021','Build root layout.tsx with HTML lang, metadata defaults, font class, and GTM snippet','P0','S','[type: feature] [priority: critical] [effort: S] [milestone: global-layout]'),
  ...issueCard('022','Build Header component: transparent + solid variants, 3-zone layout, sticky scroll behavior','P0','L','[type: feature] [priority: critical] [effort: L] [milestone: global-layout]'),
  ...issueCard('023','Build AnnouncementBar: dismissible, sessionStorage persistence, slide-down animation','P1','S','[type: feature] [priority: high] [effort: S] [milestone: global-layout]'),
  ...issueCard('024','Build Footer: 5-column grid, responsive (3 breakpoints), all link groups, bottom bar','P0','M','[type: feature] [priority: critical] [effort: M] [milestone: global-layout]'),
  ...issueCard('025','Build CountrySelector: dropdown, flag emojis, cookie storage','P2','M','[type: feature] [priority: medium] [effort: M] [milestone: global-layout]'),
  ...issueCard('026','Build Breadcrumbs: with BreadcrumbList JSON-LD schema, mobile abbreviated form','P1','S','[type: feature] [priority: high] [effort: S] [milestone: global-layout]'),
  ...issueCard('027','Implement skip-to-main-content link (visually hidden, revealed on focus)','P0','XS','[type: accessibility] [priority: critical] [effort: XS] [milestone: global-layout]'),
  bullet('AC: Pressing Tab on any page reveals the skip link. Pressing Enter scrolls to #main-content.'),
  ...issueCard('028','Build 404 not-found page with SVG patch illustration and recovery CTAs','P0','S','[type: feature] [priority: high] [effort: S] [milestone: global-layout]'),
  ...issueCard('029','Build global error.tsx and global-error.tsx with branded error UI','P0','S','[type: feature] [priority: high] [effort: S] [milestone: global-layout]'),
  ...issueCard('030','Configure generateMetadata() base template and OG image defaults','P0','S','[type: seo] [priority: critical] [effort: S] [milestone: global-layout]'),
  spacer(),

  h2('4.5 Selected High-Priority Issues — Milestones 4–20'),
  body('The following sample issues represent the structure for all remaining milestones. Each milestone will contain 8–15 issues of this format in the actual GitHub project.'),
  spacer(),

  h4('Milestone 4 — Homepage'),
  ...issueCard('031','Build TrustBar: 5 stats with icons, counter animation (useCountUp on viewport entry)','P0','M','[type: feature] [priority: critical] [effort: M] [milestone: homepage]'),
  ...issueCard('032','Build Featured Products 4-grid with CategoryCard components','P0','M','[type: feature] [priority: critical] [effort: M] [milestone: homepage]'),
  ...issueCard('033','Build How It Works: 3 steps, SVG connector line draw animation on scroll entry','P0','M','[type: feature] [priority: high] [effort: M] [milestone: homepage]'),
  ...issueCard('034','Build Industries chip section on dark background with hover states','P0','S','[type: feature] [priority: high] [effort: S] [milestone: homepage]'),
  ...issueCard('035','Build Why Choose Us: 6 feature cards, icon containers, hover lift','P0','M','[type: feature] [priority: high] [effort: M] [milestone: homepage]'),
  ...issueCard('036','Build Testimonials carousel: auto-scroll, touch swipe, glass cards on dark background','P1','L','[type: feature] [priority: high] [effort: L] [milestone: homepage]'),
  ...issueCard('037','Build Client Logo marquee: dual rows, opposing directions, CSS animation, hover pause','P1','M','[type: feature] [priority: medium] [effort: M] [milestone: homepage]'),
  ...issueCard('038','Build homepage FAQ accordion (6 items): FAQPage JSON-LD, single-open mode','P0','S','[type: feature] [priority: high] [effort: S] [milestone: homepage]'),
  ...issueCard('039','Build Blog preview (3 cards): BlogCard component, link to /blog','P1','S','[type: feature] [priority: medium] [effort: S] [milestone: homepage]'),
  ...issueCard('040','Build Final CTA banner: dark background, oversized CTA button, trust strip','P0','S','[type: feature] [priority: high] [effort: S] [milestone: homepage]'),
  spacer(),

  h4('Milestone 5 — Hero Slider'),
  ...issueCard('041','Build HeroSlider: auto-advance timer (7s), pause on interaction, restart after 10s','P0','M','[type: feature] [priority: critical] [effort: M] [milestone: hero]'),
  ...issueCard('042','Build SlideControls: dot navigation (8px→24px pill animation), prev/next arrows','P0','S','[type: feature] [priority: critical] [effort: S] [milestone: hero]'),
  ...issueCard('043','Build PatchCard component: individual card with textures, border, specular highlight, shadow layers','P0','L','[type: feature] [priority: critical] [effort: L] [milestone: hero]'),
  ...issueCard('044','Build PatchCardScene: 6-card arc layout, mouse parallax (useMouse hook), auto-drift animation','P0','XL','[type: feature] [priority: critical] [effort: XL] [milestone: hero]'),
  bullet('AC: All 15 acceptance criteria from V4 Section 7.6 verified'),
  ...issueCard('045','Build HeroSlide1: content zone (eyebrow, H1, CTAs, trust strip) + PatchCardScene integration','P0','M','[type: feature] [priority: critical] [effort: M] [milestone: hero]'),
  ...issueCard('046','Build ApparelDeckScene: 5 garment cards, fan-spread hover interaction','P0','L','[type: feature] [priority: critical] [effort: L] [milestone: hero]'),
  ...issueCard('047','Build MartialArtsScene: gi photo, light sweep animation, fabric close-up glass card, gold rule','P0','L','[type: feature] [priority: critical] [effort: L] [milestone: hero]'),
  ...issueCard('048','Implement hero reduced-motion fallback for all 3 slides','P0','S','[type: accessibility] [priority: critical] [effort: S] [milestone: hero]'),
  ...issueCard('049','Implement hero touch/swipe navigation (Framer Motion drag API)','P0','S','[type: feature] [priority: high] [effort: S] [milestone: hero]'),
  ...issueCard('050','Implement hero keyboard navigation (arrow keys, Tab to CTAs, accessible dot controls)','P0','S','[type: accessibility] [priority: critical] [effort: S] [milestone: hero]'),
  spacer(),

  h4('Milestone 7 — Quote System'),
  ...issueCard('060','Set up Zustand quote state: QuoteWizardState, actions, URL sync, localStorage persistence','P0','L','[type: feature] [priority: critical] [effort: L] [milestone: quote-system]'),
  ...issueCard('061','Build QuoteProgressIndicator: step circles, connector line, completed/current/future states','P0','M','[type: feature] [priority: critical] [effort: M] [milestone: quote-system]'),
  ...issueCard('062','Build Step 0: Product selection grid with category cards and sub-product selection','P0','M','[type: feature] [priority: critical] [effort: M] [milestone: quote-system]'),
  ...issueCard('063','Build Step 1: Embroidery coverage selector (3 visual cards — patches only)','P0','S','[type: feature] [priority: high] [effort: S] [milestone: quote-system]'),
  ...issueCard('064','Build Step 2: Quantity selector (preset buttons + custom input + validation)','P0','S','[type: feature] [priority: high] [effort: S] [milestone: quote-system]'),
  ...issueCard('065','Build Step 3: Color count selector (4 visual cards with patch examples)','P0','S','[type: feature] [priority: high] [effort: S] [milestone: quote-system]'),
  ...issueCard('066','Build Step 4: Size selector with live SVG size visualizer','P0','M','[type: feature] [priority: high] [effort: M] [milestone: quote-system]'),
  ...issueCard('067','Build Step 5: Artwork upload (drag & drop zone, R2 presign flow, file preview grid)','P0','L','[type: feature] [priority: critical] [effort: L] [milestone: quote-system]'),
  ...issueCard('068','Build Step 6: Contact form with all fields, country select with flag picker','P0','M','[type: feature] [priority: critical] [effort: M] [milestone: quote-system]'),
  ...issueCard('069','Build OrderSummary: sticky sidebar (desktop), bottom drawer (mobile), edit navigation','P0','M','[type: feature] [priority: critical] [effort: M] [milestone: quote-system]'),
  ...issueCard('070','Implement step transition animations (slide left/right, spring physics)','P1','S','[type: feature] [priority: high] [effort: S] [milestone: quote-system]'),
  ...issueCard('071','Implement Save & Continue Later: JWT encoding, shareable URL, 30-day expiry','P0','M','[type: feature] [priority: high] [effort: M] [milestone: quote-system]'),
  ...issueCard('072','Build POST /api/quote/submit: Zod validation, Turnstile verify, email via Resend, reference number','P0','L','[type: feature] [priority: critical] [effort: L] [milestone: quote-system]'),
  ...issueCard('073','Build POST /api/files/presign: MIME validation, extension check, R2 presigned URL generation','P0','M','[type: feature] [priority: critical] [effort: M] [milestone: quote-system]'),
  ...issueCard('074','Build /quote/success page: animated checkmark, reference number, next steps','P0','S','[type: feature] [priority: critical] [effort: S] [milestone: quote-system]'),
  ...issueCard('075','Implement rate limiting middleware (Upstash Redis) on quote submit and file presign','P0','S','[type: security] [priority: critical] [effort: S] [milestone: quote-system]'),
  ...issueCard('076','Write Playwright E2E test for complete quote submission flow','P0','M','[type: test] [priority: critical] [effort: M] [milestone: quote-system]'),
  spacer(),

  h4('Milestone 9 — AI Design Studio'),
  ...issueCard('090','Build AIDesigner page layout: split panel (controls 40%, preview 60%)','P0','M','[type: feature] [priority: high] [effort: M] [milestone: ai-designer]'),
  ...issueCard('091','Build AIPromptInput: floating label, 500-char counter, suggestion chips, prompt history','P0','M','[type: feature] [priority: high] [effort: M] [milestone: ai-designer]'),
  ...issueCard('092','Build AIControlPanel: all selector inputs (product type, shape, size, colors, border, backing)','P0','L','[type: feature] [priority: high] [effort: L] [milestone: ai-designer]'),
  ...issueCard('093','Build AIPreviewPanel: Phase 1 static placeholder logic, loading skeleton, reveal animation','P0','M','[type: feature] [priority: high] [effort: M] [milestone: ai-designer]'),
  ...issueCard('094','Build version history strip: thumbnail row, click-to-restore, max 6 versions','P1','M','[type: feature] [priority: medium] [effort: M] [milestone: ai-designer]'),
  ...issueCard('095','Build compare view: split-screen, draggable divider (requestAnimationFrame drag)','P1','M','[type: feature] [priority: medium] [effort: M] [milestone: ai-designer]'),
  ...issueCard('096','Implement undo/redo (20-step Zustand history stack)','P1','S','[type: feature] [priority: medium] [effort: S] [milestone: ai-designer]'),
  ...issueCard('097','Build POST /api/ai/generate: Phase 1 placeholder response, rate limiting, logging','P0','S','[type: feature] [priority: high] [effort: S] [milestone: ai-designer]'),
  ...issueCard('098','Implement "Get a Quote" → /quote with all current parameters as URL params','P0','S','[type: feature] [priority: high] [effort: S] [milestone: ai-designer]'),
  pb(),

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 5 — SPRINT PLANNING
════════════════════════════════════════════════════════════════════════════ */
  h1('05 · SPRINT PLANNING'),
  sLabel('26 Sprints — 1 Week Each'),

  h2('5.1 Sprint Structure Assumptions'),
  kvt([
    ['Sprint duration','1 week (Monday–Friday)'],
    ['Team size assumption','2 developers (adjust velocity accordingly)'],
    ['Velocity assumption','8–12 story points per developer per sprint (1 point ≈ 2–4 hours)'],
    ['Sprint capacity','16–24 story points total per sprint for a 2-developer team'],
    ['XS effort','1 point. S effort: 2 points. M effort: 4 points. L effort: 8 points. XL effort: 16 points.'],
    ['Buffer','Reserve 20% of sprint capacity for bugs, PR reviews, and unplanned work.'],
    ['Sprint ceremonies','Monday: Sprint planning (1 hour). Daily: 15-minute standup. Friday: Sprint review (30 min) + retrospective (30 min).'],
  ]),
  spacer(),

  h2('5.2 Sprint Plan (Weeks 1–10)'),
  tbl(
    ['Sprint','Week','Milestone','Primary Goals','Key Issues','Points'],
    [700,700,1600,2800,2400,1160],
    [
      ['S1','1','M1','Repo setup, scaffolding, CI pipeline','#001–#010','20'],
      ['S2','2','M2','Design tokens, animations, TypeScript types','#011–#020','22'],
      ['S3','3','M3 start','Root layout, header shell, skip link','#021, #022, #027, #030','18'],
      ['S4','4','M3 finish','Footer, announcement bar, breadcrumbs, 404','#023–#029','20'],
      ['S5','5','M4 start','Trust Bar, Featured Products grid, How It Works','#031–#033','18'],
      ['S6','6','M4 middle','Industries, Why Choose Us, CTA banner','#034, #035, #040','16'],
      ['S7','7','M4 finish + M5 start','Blog preview, testimonials, FAQ. HeroSlider + controls scaffold.','#036–#039, #041, #042','20'],
      ['S8','8','M5 core','PatchCard component, PatchCardScene, HeroSlide1','#043–#045','22'],
      ['S9','9','M5 finish','ApparelDeckScene, MartialArtsScene, reduced-motion','#046–#050','22'],
      ['S10','10','M6','Mega menu, mobile drawer, search overlay','All M6 issues','20'],
    ]
  ),
  spacer(),

  h2('5.3 Sprint Plan (Weeks 11–20)'),
  tbl(
    ['Sprint','Week','Milestone','Primary Goals','Points'],
    [700,700,1600,3800,1560],
    [
      ['S11','11','M7 start','Zustand state, progress indicator, Steps 0–2','20'],
      ['S12','12','M7 middle','Steps 3–5 (size, colors, artwork upload + R2)','22'],
      ['S13','13','M7 finish','Step 6, Order Summary, API endpoints, success page','22'],
      ['S14','14','M8 start','Product page template, 7 patch product pages','20'],
      ['S15','15','M8 middle','9 apparel product pages, category hubs','20'],
      ['S16','16','M8 finish + M9 start','5 MA pages, 4 accessory pages. AI Design Studio layout + controls.','22'],
      ['S17','17','M9 finish','AI preview panel, version history, compare view, API','20'],
      ['S18','18','M10 + M11','Gallery masonry + lightbox. 10 industry pages.','18'],
      ['S19','19','M12','Blog infrastructure, 5 seed articles','18'],
      ['S20','20','M13 start','Sanity schema definition, Studio setup','20'],
    ]
  ),
  spacer(),

  h2('5.4 Sprint Plan (Weeks 21–26)'),
  tbl(
    ['Sprint','Week','Milestone','Primary Goals','Points'],
    [700,700,1600,3800,1560],
    [
      ['S21','21','M13 finish','Content migration, ISR webhooks, preview mode','18'],
      ['S22','22','M14 start','Admin auth, quote list view, quote detail drawer','20'],
      ['S23','23','M14 finish','Contacts, analytics dashboard, activity log','20'],
      ['S24','24','M15 + M16','SEO (sitemap, schemas, OG). Analytics (all events).','16'],
      ['S25','25','M17 + M18 + M19','Accessibility audit + fixes. Performance optimization. Test suite.','22'],
      ['S26','26','M20','Production launch, DNS, monitoring, v1.0.0 tag','14'],
    ]
  ),
  spacer(),

  h2('5.5 Sprint Review & Retrospective'),
  h3('Sprint Review (Friday, 30 min)'),
  bullet('Demo: Every completed issue is demonstrated in a screen share against the acceptance criteria'),
  bullet('Sign-off: Product owner / tech lead signs off on each completed issue'),
  bullet('Velocity: Record actual story points completed vs planned'),
  bullet('Carry-over: Incomplete issues move to next sprint with an explanation'),
  spacer(),
  h3('Sprint Retrospective (Friday, 30 min)'),
  bullet('What went well (keep doing)'),
  bullet('What was difficult (investigate)'),
  bullet('What to change (action item with owner and due date)'),
  bullet('Action items tracked as chore issues in GitHub with priority: high'),
  pb(),

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 6 — COMPONENT BUILD ORDER
════════════════════════════════════════════════════════════════════════════ */
  h1('06 · COMPONENT BUILD ORDER'),
  sLabel('The Exact Sequence Codex Should Follow'),

  h2('6.1 Build Order Rationale'),
  body('Components must be built in dependency order. You cannot build a Product Card before you have a Card base style. You cannot build the Quote Wizard before you have Button, Input, and Select. The sequence below minimizes re-work by building foundations before consumers.'),
  spacer(),

  h2('6.2 Phase 1: Atomic Components (No Dependencies)'),
  body('These components have no dependencies on other custom components. Build these first.'),
  tbl(
    ['Order','Component','File','Reason'],
    [600,2400,2800,3560],
    [
      ['1','Button (all variants)','components/ui/button.tsx (shadcn)','Used in every other component. Must exist first.'],
      ['2','Input','components/ui/input.tsx','Used in all forms.'],
      ['3','Textarea','components/ui/textarea.tsx','Used in quote form and AI Design Studio.'],
      ['4','Select','components/ui/select.tsx','Used in country selector and form.'],
      ['5','Badge / Chip','components/ui/badge.tsx','Used in cards, navigation, AI Design Studio.'],
      ['6','Avatar','components/ui/avatar.tsx','Used in review cards and team section.'],
      ['7','Separator','components/ui/separator.tsx','Used in navigation and forms.'],
      ['8','Progress','components/ui/progress.tsx','Used in file upload and quote progress.'],
      ['9','Tooltip','components/ui/tooltip.tsx','Used on icon-only buttons.'],
      ['10','Dialog / Modal','components/ui/dialog.tsx','Used in exit intent, review submit.'],
      ['11','Sheet / Drawer','components/ui/sheet.tsx','Used in mobile menu and order summary.'],
      ['12','Accordion','components/ui/accordion.tsx','Used in FAQ sections and mobile nav.'],
      ['13','Tabs','components/ui/tabs.tsx','Used in product page spec section.'],
      ['14','Toast / Sonner','components/ui/sonner.tsx','Used for all notification feedback.'],
    ]
  ),
  spacer(),

  h2('6.3 Phase 2: Shared / Utility Components'),
  tbl(
    ['Order','Component','Dependencies','Notes'],
    [600,2400,2400,4000],
    [
      ['15','TrustBadge','Button (optional)','Standalone stat display. Used in trust bar and quote form.'],
      ['16','LoadingSkeleton','None (CSS only)','Used as placeholder in all async sections.'],
      ['17','Breadcrumbs','None','Pure display. Used on all product/blog pages.'],
      ['18','CountrySelector','Select, Sheet','Used in header.'],
      ['19','FloatingQuoteButton','Button, useInView','Requires hook to detect quote form visibility.'],
    ]
  ),
  spacer(),

  h2('6.4 Phase 3: Layout Components'),
  tbl(
    ['Order','Component','Dependencies','Notes'],
    [600,2400,2400,4000],
    [
      ['20','Header','Button, CountrySelector, Sheet (mobile)','Must be built before any page can be rendered with navigation.'],
      ['21','MegaMenu','None (CSS transition)','Built inside Header — separate sub-component.'],
      ['22','MobileMenu','Accordion, Sheet','Built inside Header. Drawer for mobile nav.'],
      ['23','SearchOverlay','Input, Dialog','Built inside Header. Opened by search icon.'],
      ['24','AnnouncementBar','None','Built above Header. Dismissible.'],
      ['25','Footer','None','No interactive dependencies. Pure content.'],
    ]
  ),
  spacer(),

  h2('6.5 Phase 4: Content Cards'),
  tbl(
    ['Order','Component','Dependencies','Notes'],
    [600,2400,2400,4000],
    [
      ['26','ProductCard','Badge','Used in product grid sections.'],
      ['27','CategoryCard','None (image + overlay)','Used in featured products section.'],
      ['28','FeatureCard','Button (link variant)','Used in Why Choose Us.'],
      ['29','IndustryCard/Chip','Badge','Used in industries section.'],
      ['30','BlogCard','Badge, Avatar','Used in blog preview and blog index.'],
      ['31','ReviewCard','Avatar, Badge','Used in product pages and testimonials.'],
      ['32','TestimonialCard','Avatar','Used in testimonials carousel.'],
      ['33','StatCard','None','Used in trust bar.'],
      ['34','GalleryCard','None','Used in gallery masonry.'],
    ]
  ),
  spacer(),

  h2('6.6 Phase 5: Page-Level / Complex Components'),
  tbl(
    ['Order','Component','Dependencies','Notes'],
    [600,2400,2800,3600],
    [
      ['35','FAQAccordion','Accordion (shadcn)','All FAQ sections. Renders JSON-LD schema.'],
      ['36','TrustBar','StatCard, useCountUp, useInView','Homepage trust section.'],
      ['37','TestimonialCarousel','TestimonialCard','Homepage dark section.'],
      ['38','LogoMarquee','None (CSS animation)','Client logos strip.'],
      ['39','MasonryGallery','GalleryCard','Gallery page + homepage preview.'],
      ['40','Lightbox','MasonryGallery (triggers it)','Opens from gallery card click.'],
      ['41','ProcessStep','None','How It Works section.'],
      ['42','BackingSelector','None (display only)','Product pages and quote form.'],
      ['43','ColorSwatch / Chart','None','Product pages and AI Design Studio.'],
      ['44','SizeVisualizer','None (SVG)','Product pages and quote form Step 4.'],
      ['45','OrderSummary','Sheet (mobile drawer)','Quote form sidebar.'],
      ['46','ArtworkUpload','Progress, Toast','Quote form Step 5.'],
      ['47','QuoteProgressIndicator','None','Top of quote form.'],
      ['48','QuoteWizard','All step components, OrderSummary, QuoteProgressIndicator','The complete multi-step form.'],
      ['49','AIPromptInput','Textarea, Tooltip','AI Design Studio left panel.'],
      ['50','AIPreviewPanel','LoadingSkeleton','AI Design Studio right panel.'],
      ['51','PatchCard','None (CSS + SVG)','Hero Slide 1.'],
      ['52','PatchCardScene','PatchCard, useMouse','Hero Slide 1 visual.'],
      ['53','ApparelDeckScene','None (Framer Motion)','Hero Slide 2 visual.'],
      ['54','MartialArtsScene','None (Framer Motion)','Hero Slide 3 visual.'],
      ['55','HeroSlider','HeroSlide1/2/3, SlideControls','Homepage hero. Built last — depends on all 3 scenes.'],
    ]
  ),
  pb(),

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 7 — PAGE BUILD ORDER
════════════════════════════════════════════════════════════════════════════ */
  h1('07 · PAGE BUILD ORDER'),
  sLabel('Every Page — Dependencies and Sequence'),

  h2('7.1 Page Build Sequence'),
  tbl(
    ['Order','Page','Route','Dependencies','Milestone'],
    [600,2400,2200,2800,1360],
    [
      ['1','/style-guide','Dev only','M2 design tokens','M2'],
      ['2','Layout + 404','layout.tsx, not-found.tsx','M3 global components','M3'],
      ['3','Homepage (sections)','/ (no hero yet)','M4 section components','M4'],
      ['4','Homepage (hero)','/ (hero added)','M5 hero components','M5'],
      ['5','Quote Wizard','/quote, /quote/success','M7 quote components, API routes','M7'],
      ['6','Custom Patches Hub','/custom-patches','M8 product template','M8'],
      ['7','All Patch Product Pages','/custom-patches/[slug]','M8 product template','M8'],
      ['8','Apparel Hub','/apparel','M8 (same template)','M8'],
      ['9','All Apparel Product Pages','/apparel/[slug]','M8','M8'],
      ['10','Martial Arts Hub','/martial-arts','M8','M8'],
      ['11','All MA Product Pages','/martial-arts/[slug]','M8','M8'],
      ['12','Accessories Hub + Pages','/accessories, /accessories/[slug]','M8','M8'],
      ['13','AI Design Studio','/ai-designer','M9 AI components, API','M9'],
      ['14','Gallery','/gallery','M10 gallery components','M10'],
      ['15','All Industry Pages','/industries/[slug]','M11, M8 (product links)','M11'],
      ['16','Industries Hub','/industries','M11','M11'],
      ['17','Blog Index','/blog','M12 blog components','M12'],
      ['18','Blog Articles','/blog/[slug]','M12','M12'],
      ['19','FAQ Page','/faq','M4 FAQ accordion','M4 (basic) → M13 (CMS)'],
      ['20','About Page','/about','M3 layout, M4 section patterns','M4'],
      ['21','Contact Page','/contact','M3 layout, contact form component','M3+'],
      ['22','Privacy, Terms, Shipping','/privacy-policy, /terms, /shipping','M3 layout','M15 (SEO)'],
      ['23','Admin Dashboard','/admin/*','M14 admin components, auth','M14'],
      ['24','HTML Sitemap','/sitemap','M15 SEO','M15'],
    ]
  ),
  spacer(),
  h3('Build Order Rules'),
  bullet('Never build a page before its required components are complete'),
  bullet('Product pages (Step 7–12) all share the same template — build the template once, then generate all pages from content data'),
  bullet('The homepage is built in 2 stages: content sections (M4) then hero (M5) — this allows testing all homepage sections while the hero is in development'),
  bullet('The /contact and /faq pages can be built as simple pages during M3/M4 using static content — they are upgraded with CMS content in M13'),
  bullet('Admin pages (M14) are built after all customer-facing features — they depend on the quote API existing to have data to display'),
  pb(),
];

/* ─── assembly ─────────────────────────────────────────────────────────── */
const doc = new Document({
  title:'Tam Custom Patches — Master Development Roadmap v5.0',
  styles:{
    default:{document:{run:{font:'Inter',size:22,color:C.ink}}},
    paragraphStyles:[
      {id:'Heading1',name:'Heading 1',basedOn:'Normal',next:'Normal',quickFormat:true,run:{font:'Inter',size:40,bold:true,color:C.white},paragraph:{spacing:{before:480,after:240},outlineLevel:0}},
      {id:'Heading2',name:'Heading 2',basedOn:'Normal',next:'Normal',quickFormat:true,run:{font:'Inter',size:28,bold:true,color:C.accentDk},paragraph:{spacing:{before:360,after:160},outlineLevel:1}},
      {id:'Heading3',name:'Heading 3',basedOn:'Normal',next:'Normal',quickFormat:true,run:{font:'Inter',size:24,bold:true,color:C.ink},paragraph:{spacing:{before:280,after:120},outlineLevel:2}},
      {id:'Heading4',name:'Heading 4',basedOn:'Normal',next:'Normal',quickFormat:true,run:{font:'Inter',size:21,bold:true,color:C.muted},paragraph:{spacing:{before:200,after:80},outlineLevel:3}},
    ],
  },
  numbering:{config:[
    {reference:'bullets',levels:[
      {level:0,format:LevelFormat.BULLET,text:'•',alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}},
      {level:1,format:LevelFormat.BULLET,text:'◦',alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:1080,hanging:360}}}},
    ]},
    {reference:'numbers',levels:[
      {level:0,format:LevelFormat.DECIMAL,text:'%1.',alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}},
    ]},
  ]},
  sections:[{
    properties:{page:{size:{width:12240,height:15840},margin:{top:1080,right:1080,bottom:1080,left:1080}}},
    headers:{default:new Header({children:[new Paragraph({children:[new TextRun({text:'Tam Custom Patches  ·  Master Development Roadmap v5.0  ·  Part A: Sections 1–7',font:'Inter',size:18,color:C.muted}),new TextRun({text:'\t',font:'Inter',size:18}),new TextRun({text:'Confidential',font:'Inter',size:18,color:C.muted})],tabStops:[{type:TabStopType.RIGHT,position:TabStopPosition.MAX}],border:{bottom:{style:BorderStyle.SINGLE,size:2,color:C.border,space:4}}})]})},
    footers:{default:new Footer({children:[new Paragraph({children:[new TextRun({text:'Page ',font:'Inter',size:18,color:C.muted}),new TextRun({children:[PageNumber.CURRENT],font:'Inter',size:18,color:C.muted}),new TextRun({text:'\t',font:'Inter',size:18}),new TextRun({text:'tamcustompatches.com',font:'Inter',size:18,color:C.muted})],tabStops:[{type:TabStopType.RIGHT,position:TabStopPosition.MAX}],border:{top:{style:BorderStyle.SINGLE,size:2,color:C.border,space:4}}})]})},
    children:[...cover(),...s1()],
  }],
});

Packer.toBuffer(doc).then(buf=>{
  fs.writeFileSync('/home/claude/tam-v5/Tam_V5_PartA.docx',buf);
  console.log('✅ V5 Part A written.');
}).catch(e=>{console.error(e);process.exit(1);});