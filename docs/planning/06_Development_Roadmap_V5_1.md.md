const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, TabStopType, TabStopPosition,
  LevelFormat
} = require('docx');
const fs = require('fs');

const C = {
  ink:'0A0A0A',accent:'1A56DB',accentDk:'1E429F',gold:'B8860B',
  surface:'F8FAFC',border:'E2E8F0',muted:'64748B',white:'FFFFFF',
  dark:'1A1A2E',tagBg:'DBEAFE',sectionBg:'F1F5F9',
  success:'16A34A',successBg:'DCFCE7',error:'DC2626',errorBg:'FEE2E2',
  warn:'D97706',warnBg:'FEF3C7',purple:'7C3AED',purpleBg:'F5F3FF',
  phase1:'1A1A2E',phase2:'B8860B',
};
const brd={style:BorderStyle.SINGLE,size:1,color:C.border};
const borders={top:brd,bottom:brd,left:brd,right:brd};
const h1=t=>new Paragraph({heading:HeadingLevel.HEADING_1,children:[new TextRun({text:t,font:'Inter',bold:true,size:38,color:C.white})],shading:{fill:C.dark,type:ShadingType.CLEAR},spacing:{before:480,after:240},indent:{left:360,right:360}});
const h2=t=>new Paragraph({heading:HeadingLevel.HEADING_2,children:[new TextRun({text:t,font:'Inter',bold:true,size:28,color:C.accentDk})],spacing:{before:360,after:160},border:{bottom:{style:BorderStyle.SINGLE,size:4,color:C.accent,space:4}}});
const h3=t=>new Paragraph({heading:HeadingLevel.HEADING_3,children:[new TextRun({text:t,font:'Inter',bold:true,size:24,color:C.ink})],spacing:{before:280,after:120}});
const h4=t=>new Paragraph({heading:HeadingLevel.HEADING_4,children:[new TextRun({text:t,font:'Inter',bold:true,size:21,color:C.muted})],spacing:{before:200,after:80}});
const body=t=>new Paragraph({children:[new TextRun({text:t,font:'Inter',size:22,color:C.ink})],spacing:{after:120}});
const bold=t=>new Paragraph({children:[new TextRun({text:t,font:'Inter',size:22,bold:true,color:C.ink})],spacing:{after:120}});
const sLabel=t=>new Paragraph({children:[new TextRun({text:t.toUpperCase(),font:'Inter',bold:true,size:18,color:C.accent,characterSpacing:80})],spacing:{before:240,after:80}});
const bullet=(t,lv=0,bd=false)=>new Paragraph({numbering:{reference:'bullets',level:lv},children:[new TextRun({text:t,font:'Inter',size:22,bold:bd})],spacing:{after:80}});
const num=(t,lv=0)=>new Paragraph({numbering:{reference:'numbers',level:lv},children:[new TextRun({text:t,font:'Inter',size:22})],spacing:{after:80}});
const check=t=>new Paragraph({children:[new TextRun({text:`☐  ${t}`,font:'Inter',size:22,color:C.ink})],spacing:{after:80},indent:{left:360}});
const spacer=()=>new Paragraph({children:[],spacing:{after:120}});
const divider=()=>new Paragraph({children:[],border:{bottom:{style:BorderStyle.SINGLE,size:4,color:C.border,space:1}},spacing:{before:160,after:160}});
const pb=()=>new Paragraph({children:[new TextRun({break:1})],spacing:{after:0}});
const note=(bg,lc,label,t)=>new Paragraph({children:[new TextRun({text:`${label}  `,font:'Inter',bold:true,size:20,color:lc}),new TextRun({text:t,font:'Inter',size:20,color:lc})],shading:{fill:bg,type:ShadingType.CLEAR},indent:{left:360,right:360},spacing:{before:80,after:160}});
const info=t=>note(C.tagBg,C.accentDk,'INFO',t);
const warn=t=>note(C.warnBg,C.warn,'WARN',t);
const risk=t=>note(C.errorBg,C.error,'RISK',t);
const directive=t=>note(C.purpleBg,C.purple,'DIRECTIVE',t);

const cell=(t,{w=2400,bg,bd:isBd,color}={})=>new TableCell({borders,width:{size:w,type:WidthType.DXA},shading:bg?{fill:bg,type:ShadingType.CLEAR}:undefined,margins:{top:100,bottom:100,left:140,right:140},verticalAlign:VerticalAlign.CENTER,children:[new Paragraph({children:[new TextRun({text:t,font:'Inter',size:20,bold:isBd||false,color:color||C.ink})]})]});
const hdr=(labels,ws)=>new TableRow({tableHeader:true,children:labels.map((l,i)=>new TableCell({borders,width:{size:ws[i],type:WidthType.DXA},shading:{fill:C.dark,type:ShadingType.CLEAR},margins:{top:100,bottom:100,left:140,right:140},children:[new Paragraph({children:[new TextRun({text:l,font:'Inter',size:20,bold:true,color:C.white})]})]}))});
const tbl=(headers,ws,rows)=>new Table({width:{size:ws.reduce((a,b)=>a+b,0),type:WidthType.DXA},columnWidths:ws,rows:[hdr(headers,ws),...rows.map(r=>new TableRow({children:r.map((c,i)=>cell(c,{w:ws[i]}))}))]});
const kvt=(pairs,w1=2600,w2=6760)=>new Table({width:{size:w1+w2,type:WidthType.DXA},columnWidths:[w1,w2],rows:pairs.map(([k,v])=>new TableRow({children:[cell(k,{w:w1,bd:true,bg:C.sectionBg}),cell(v,{w:w2})]}))});

const phase1Banner=()=>new Paragraph({children:[new TextRun({text:'  PHASE 1 — LAUNCH CRITICAL  ',font:'Inter',bold:true,size:24,color:C.white})],shading:{fill:C.phase1,type:ShadingType.CLEAR},alignment:AlignmentType.CENTER,spacing:{before:200,after:120}});
const phase2Banner=()=>new Paragraph({children:[new TextRun({text:'  PHASE 2 — POST-LAUNCH ENHANCEMENT  ',font:'Inter',bold:true,size:24,color:C.white})],shading:{fill:C.phase2,type:ShadingType.CLEAR},alignment:AlignmentType.CENTER,spacing:{before:200,after:120}});

const mCard=(num,title,complexity,effort,risk,critPath)=>new Paragraph({children:[
  new TextRun({text:`M${num}  `,font:'Inter',bold:true,size:22,color:C.accentDk}),
  new TextRun({text:`${title}  `,font:'Inter',bold:true,size:22,color:C.ink}),
  new TextRun({text:`  Complexity: ${complexity}  ·  Effort: ${effort}  ·  Risk: ${risk}${critPath?' ·  ★ Critical Path':''}`,font:'Inter',size:18,color:C.muted}),
],shading:{fill:C.surface,type:ShadingType.CLEAR},spacing:{before:160,after:80},indent:{left:200,right:200}});

/* ─── cover ─────────────────────────────────────────────────────────────── */
const cover=()=>[
  new Paragraph({children:[new TextRun({text:'TAM CUSTOM PATCHES',font:'Inter',bold:true,size:72,color:C.white})],shading:{fill:C.dark,type:ShadingType.CLEAR},alignment:AlignmentType.CENTER,spacing:{before:0,after:0}}),
  new Paragraph({children:[new TextRun({text:'Master Development Roadmap — Version 5.1',font:'Inter',size:34,color:C.accent})],shading:{fill:C.dark,type:ShadingType.CLEAR},alignment:AlignmentType.CENTER,spacing:{before:0,after:0}}),
  new Paragraph({children:[new TextRun({text:'Extension of V5.0  ·  Flexible Planning Model  ·  Phase 1 / Phase 2 Separation',font:'Inter',size:22,color:C.muted})],shading:{fill:C.dark,type:ShadingType.CLEAR},alignment:AlignmentType.CENTER,spacing:{before:120,after:0}}),
  new Paragraph({children:[new TextRun({text:'Do NOT rewrite V5.0  ·  This document extends it with improved planning mechanics',font:'Inter',size:20,color:C.muted,italic:true})],shading:{fill:C.dark,type:ShadingType.CLEAR},alignment:AlignmentType.CENTER,spacing:{before:80,after:0}}),
  new Paragraph({children:[new TextRun({text:' ',size:48})],shading:{fill:C.dark,type:ShadingType.CLEAR}}),
  pb(),
];

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION A — FLEXIBLE ROADMAP MODEL (REPLACES FIXED WEEKS)
════════════════════════════════════════════════════════════════════════════ */
const sA=()=>[
  h1('A · FLEXIBLE ROADMAP MODEL'),
  sLabel('Replaces Fixed Calendar Weeks in V5.0'),

  h2('A.1 Why Fixed Weeks Are Removed'),
  body('Version 5.0 assigned calendar weeks to every milestone (e.g. "Weeks 7–10"). This model breaks the moment a single early milestone is delayed — all downstream week estimates become meaningless. Software projects routinely run long. A roadmap tied to calendar dates creates false precision and unnecessary pressure.'),
  body('Version 5.1 replaces all calendar week assignments with a complexity-based dependency model. Milestones are completed in dependency order. The total duration is a function of team size, velocity, and external dependencies — not a Gantt chart.'),
  directive('When using this roadmap, sequence work by dependency, not by calendar. Ask: "What must be done before this?" not "When is this due?"'),
  spacer(),

  h2('A.2 Milestone Classification System'),
  h3('Development Complexity'),
  tbl(
    ['Level','Definition','Typical Indicators'],
    [1600,2800,4960],
    [
      ['Very Low','Routine configuration, copy changes, simple wiring','Environment setup, README, .env config, label creation'],
      ['Low','Well-understood patterns, minimal state','Footer, static pages, analytics events, simple API routes'],
      ['Medium','Multiple interacting components, some state, responsive behavior','Product cards, FAQ accordion, blog system, gallery, industry pages'],
      ['High','Complex state machines, external APIs, novel interactions','Quote wizard, hero 3D system, CMS integration, admin dashboard'],
      ['Very High','Multiple systems interacting, high uncertainty, novel engineering','Full AI generation pipeline, online proofing system, real-time features'],
    ]
  ),
  spacer(),
  h3('Engineering Effort (T-Shirt Sizing)'),
  tbl(
    ['Size','Approximate Duration','Typical Work'],
    [800,2000,6560],
    [
      ['XS','< 1 day','Single component tweak, config change, single API endpoint with no state'],
      ['S','1–2 days','Small component, simple page, utility hook, basic API route with validation'],
      ['M','3–5 days (1 week)','Full feature: component + API + tests. A single milestone with 3–5 issues.'],
      ['L','6–10 days (2 weeks)','Multi-component feature: quote wizard step group, product page template + 5 pages'],
      ['XL','10–20 days (2–4 weeks)','Major system: complete quote wizard (7 steps), hero slider (3 scenes), admin dashboard'],
      ['XXL','> 20 days','Multi-system integration: CMS + all content pages migrated. Planned as sub-milestones.'],
    ]
  ),
  spacer(),
  h3('Risk Level'),
  tbl(
    ['Level','Definition','Response'],
    [1200,3400,4800],
    [
      ['Low','Well-understood technology, clear requirements, no external dependencies','Standard development — no special mitigation needed'],
      ['Medium','Some uncertainty, minor external dependencies, established patterns with edge cases','Spike/prototype the riskiest part first. Time-box spikes to 1 day.'],
      ['High','Significant technical uncertainty, critical external dependencies, novel implementation','Build a proof-of-concept before committing to full implementation. Have a fallback plan documented before starting.'],
      ['Critical','Blocking dependency for launch. Failure = launch blocked.','Assign the most experienced developer. Daily check-in on progress. Fallback plan approved before work begins.'],
    ]
  ),
  spacer(),

  h2('A.3 Updated Milestone Reference Table (All 20 Milestones)'),
  body('This table replaces the week-based table in V5.0 Section 3. All other milestone details (objectives, deliverables, AC) remain unchanged in V5.0.'),
  tbl(
    ['#','Milestone','Complexity','Effort','Risk','Critical Path','Blocks'],
    [400,2200,1400,800,1000,1400,2200],
    [
      ['M1','Foundation & Repository Setup','Very Low','S','Low','Yes','Everything'],
      ['M2','Design System & Tokens','Low','S','Low','Yes','M3–M20'],
      ['M3','Global Layout (Header, Footer)','Medium','M','Medium','Yes','M4–M12'],
      ['M4','Homepage Sections','Medium','L','Medium','Yes','M5, M15'],
      ['M5','Hero Slider (3D Scenes)','High','XL','High','Yes','M20'],
      ['M6','Navigation (Mega Menu, Mobile, Search)','Medium','M','Medium','No','M8 product links'],
      ['M7','Quote System (6-Step Wizard)','High','XL','Critical','Yes','M14, M16, M20'],
      ['M8','Product Pages (25+)','Medium','L','Medium','No','M11, M13'],
      ['M9','AI Design Studio','High','L','High','No','Phase 2 AI'],
      ['M10','Gallery & Lightbox','Medium','M','Low','No','M13'],
      ['M11','Industry Landing Pages (10)','Low','M','Low','No','M13'],
      ['M12','Blog & Learning Center','Medium','M','Low','No','M13'],
      ['M13','CMS Integration (Sanity)','High','XL','High','No','M14'],
      ['M14','Admin Dashboard','High','XL','High','No','M20'],
      ['M15','SEO Foundation','Medium','M','Medium','Yes','M20'],
      ['M16','Analytics & Tracking','Low','S','Low','Yes','M20'],
      ['M17','Accessibility Audit & Fixes','Medium','M','Medium','Yes','M20'],
      ['M18','Performance Optimization','Medium','M','Medium','Yes','M20'],
      ['M19','Testing Suite Completion','Medium','L','Medium','Yes','M20'],
      ['M20','Production Launch','Very Low','S','Critical','Yes','Phase 2'],
    ]
  ),
  spacer(),
  h3('How to Estimate Your Timeline'),
  body('To estimate total duration for your team:'),
  num('Count the critical path milestones: M1 → M2 → M3 → M4 → M5 → M7 → M15 → M16 → M17 → M18 → M19 → M20'),
  num('Sum the effort sizes: S+S+M+L+XL+XL+M+S+M+M+L+S = approximately 20–30 developer-weeks for a single developer'),
  num('For a 2-developer team with parallel streams: divide by 1.6 (not 2.0 — account for coordination overhead and code review time)'),
  num('Add 20% buffer for bugs, PR review cycles, and external dependency delays'),
  num('The result is your estimated total duration. It is an estimate, not a commitment.'),
  info('For a 2-developer team moving at medium velocity: expect 10–14 weeks to Phase 1 launch. For a solo developer: expect 20–28 weeks.'),
  pb(),

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION B — PHASE 1 / PHASE 2 SEPARATION
════════════════════════════════════════════════════════════════════════════ */
  h1('B · PHASE 1 / PHASE 2 SEPARATION'),
  sLabel('Launch-Critical vs Post-Launch Enhancements'),

  phase1Banner(),
  spacer(),
  h2('B.1 Phase 1 Scope — Launch Requirements'),
  bold('Phase 1 contains exactly and only what is required for the v1.0.0 production launch. Nothing from Phase 2 is allowed in Phase 1 unless it directly enables a quote request.'),
  spacer(),
  tbl(
    ['Milestone','What Is Included in Phase 1','What Is Excluded (Phase 2)'],
    [1400,3800,4200],
    [
      ['M1: Foundation','Full repo, CI, tooling, env setup','Phase 2 infrastructure (Sentry, advanced monitoring)'],
      ['M2: Design System','All design tokens, animation system, types, hooks','Storybook, visual regression (Chromatic)'],
      ['M3: Global Layout','Header, footer, breadcrumbs, 404, error pages','i18n-ready strings (prep only, no translation)'],
      ['M4: Homepage','All sections (trust bar, FAQ, gallery preview, blog preview, CTA)','Personalized homepage content, A/B tests'],
      ['M5: Hero','All 3 slides, 3D cards, reduced-motion fallback','Video background option, WebGL version'],
      ['M6: Navigation','Mega menu, mobile drawer, search (Phase 1: static)','Algolia search (Phase 2)'],
      ['M7: Quote Wizard','Full 6-step wizard, file upload, R2, email notifications, success page','Saved quotes, CRM sync, pricing engine, quote PDF'],
      ['M8: Product Pages','All 25+ product pages, size guide, backing selector, reviews (static JSON)','CMS-connected reviews, 360° product view'],
      ['M9: AI Design Studio','Complete UI, Phase 1 placeholder previews, quote link','Real AI generation (Stability AI / Ideogram API)'],
      ['M10: Gallery','Masonry, lightbox, static JSON data, greyscale hover','CMS-connected gallery, customer submission form'],
      ['M11: Industries','All 10 industry landing pages, static content','Industry-specific dynamic pricing, case studies'],
      ['M12: Blog','Blog infrastructure, 5 seed articles, MDX','CMS-connected blog, author pages, newsletter'],
      ['M13: CMS','Full Sanity setup, content migration, ISR webhooks','CMS for gallery submissions, review submission workflow'],
      ['M14: Admin','Quote list, quote detail, basic analytics, email templates','Full CRM integration, advanced reporting, notifications'],
      ['M15: SEO','Sitemap, schemas, OG images, meta tags, GSC verification','International SEO, hreflang, local SEO pages'],
      ['M16: Analytics','GA4, GTM, Clarity, all 30+ events, conversion tracking','LinkedIn Insight, advanced GA4 custom dimensions'],
      ['M17: Accessibility','Full WCAG AA audit and fixes on all pages','WCAG AAA upgrade, dedicated accessibility statement page'],
      ['M18: Performance','All Core Web Vitals targets met, bundle optimized','Edge rendering optimization, service worker PWA'],
      ['M19: Testing','All E2E Tier 1+2 tests, unit test coverage, Lighthouse CI','Visual regression (Chromatic), load testing (k6)'],
      ['M20: Launch','DNS, SSL, monitoring, v1.0.0 tag, go-live','Post-launch retrospective, Phase 2 planning'],
    ]
  ),
  spacer(),
  warn('SCOPE CONTROL RULE: Any feature request that arrives during Phase 1 development goes to Phase 2 backlog immediately. No exceptions. Not even "small" ones. Small features compound into milestone delays.'),
  spacer(),

  phase2Banner(),
  spacer(),
  h2('B.2 Phase 2 Feature Tracks'),
  body('Phase 2 is organized into four parallel tracks. Each track can be planned and delivered independently after v1.0.0 launches.'),
  spacer(),
  h3('Track 1 — AI & Intelligence'),
  tbl(
    ['Feature','Complexity','Effort','Depends On'],
    [3200,1600,800,3800],
    [
      ['Real AI image generation (Stability AI / Ideogram)','Very High','XL','AI Design Studio (M9), API keys, rate limiting infrastructure'],
      ['AI-assisted copywriting in admin (blog, product descriptions)','Medium','M','Sanity CMS (M13), OpenAI API'],
      ['AI design quality scoring (embroidery complexity analysis)','High','L','AI Design Studio, image analysis API'],
      ['AI prompt improvement suggestions','Medium','M','AI Design Studio, GPT-4 API'],
    ]
  ),
  spacer(),
  h3('Track 2 — Customer Platform'),
  tbl(
    ['Feature','Complexity','Effort','Depends On'],
    [3200,1600,800,3800],
    [
      ['Customer account registration and authentication','Medium','L','NextAuth.js, PostgreSQL, email verification'],
      ['Quote history dashboard (/account/quotes)','Medium','M','Customer accounts, quote DB records'],
      ['Saved AI designs synced to account','Low','S','Customer accounts, AI Design Studio local saves'],
      ['Reorder portal (one-click reorder from history)','Medium','M','Quote history, pre-fill quote wizard'],
      ['Artwork online proofing system','Very High','XXL','Customer accounts, R2, approval workflow'],
    ]
  ),
  spacer(),
  h3('Track 3 — Operations & Sales'),
  tbl(
    ['Feature','Complexity','Effort','Depends On'],
    [3200,1600,800,3800],
    [
      ['HubSpot CRM integration (quote → deal pipeline)','Medium','L','Quote system (M7), HubSpot API'],
      ['Automated email follow-up sequences (Klaviyo)','Medium','M','CRM integration, Klaviyo API'],
      ['Quote PDF generation','Low','S','Quote system, react-pdf'],
      ['Admin artwork approval workflow','Medium','M','Admin dashboard (M14), R2'],
      ['Advanced analytics dashboard (cohorts, revenue attribution)','High','L','Admin (M14), more data collection'],
      ['International shipping calculator','Medium','M','Carrier API (FedEx/DHL), country data'],
    ]
  ),
  spacer(),
  h3('Track 4 — Global Expansion'),
  tbl(
    ['Feature','Complexity','Effort','Depends On'],
    [3200,1600,800,3800],
    [
      ['Multi-language support (French, Spanish)','High','XL','All copy extracted to i18n keys (Phase 1 prep)'],
      ['Multi-currency display','Medium','M','Exchange rate API, country selector (M3)'],
      ['International SEO (hreflang, localized pages)','Medium','M','Multi-language, Sanity localization'],
      ['Live order tracking','High','L','CRM, order management system integration'],
    ]
  ),
  spacer(),
  h3('Phase 2 Prioritization Rule'),
  body('At v1.0.0 launch, review 2 weeks of real GA4 data before committing to any Phase 2 work. Prioritize based on:'),
  num('What is causing quote drop-off? (Funnel report)'),
  num('What are users searching for that the site doesn\'t have? (Search report)'),
  num('What is the sales team asking for to close more deals? (Stakeholder input)'),
  num('What do repeat visitors look for on return visits? (Behavior flow)'),
  pb(),

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION C — IMPROVED GITHUB RELEASES STRUCTURE
════════════════════════════════════════════════════════════════════════════ */
  h1('C · GITHUB RELEASES & MILESTONE HIERARCHY'),
  sLabel('How GitHub Releases, Milestones, and Issues Relate'),

  h2('C.1 The Three-Level Hierarchy'),
  body('GitHub\'s project management structure maps naturally to three levels of this roadmap. Understanding the relationship prevents confusion about where to track work.'),
  spacer(),
  tbl(
    ['Level','GitHub Object','Scope','Contains','Example'],
    [1000,1800,2000,2400,2200],
    [
      ['L1','GitHub Release','A shippable version','Multiple milestones that together form a working product state','Release 0.3 — Quote Platform'],
      ['L2','GitHub Milestone','A coherent unit of work','Multiple issues that together deliver one feature system','Milestone: M7 — Quote Wizard'],
      ['L3','GitHub Issue','A single task','One component, one API route, one test suite','#072 — POST /api/quote/submit endpoint'],
    ]
  ),
  spacer(),
  directive('Releases are created in GitHub when a group of milestones is merged to main. Issues close when PRs merge. Milestones close when all their issues close. Releases are created manually by the tech lead after validating the milestone group on staging.'),
  spacer(),

  h2('C.2 Release Structure (v0.1 → v1.0)'),
  tbl(
    ['Release','Version','Milestones Included','What It Delivers','Deploy Target'],
    [1200,1000,2400,2800,1800],
    [
      ['Foundation','v0.1.0','M1, M2','Blank Next.js app with design system, CI, all tooling configured','Vercel preview only'],
      ['Layout','v0.2.0','M3, M6','Header, footer, navigation, global components. Every page has consistent chrome.','Vercel preview + internal staging'],
      ['Homepage','v0.3.0','M4, M5','Full homepage with all sections and the 3D hero slider.','Staging (client review)'],
      ['Quote Platform','v0.4.0','M7','Complete quote wizard, file upload, email notifications, success page.','Staging (internal QA + client demo)'],
      ['Content','v0.5.0','M8, M9, M10, M11, M12','All product pages, AI Design Studio, gallery, industry pages, blog.','Staging (full content review)'],
      ['CMS','v0.6.0','M13','CMS-connected content. Editors can update the site without code.','Staging (content team acceptance)'],
      ['Admin','v0.7.0','M14','Admin dashboard: quote management, analytics, email templates.','Internal only (admin team review)'],
      ['Launch Readiness','v0.9.0','M15, M16, M17, M18, M19','SEO, analytics, accessibility, performance, complete test suite. Launch-ready.','Full staging — final pre-launch review'],
      ['Production Launch','v1.0.0','M20','Live on tamcustompatches.com.','Production'],
    ]
  ),
  spacer(),

  h2('C.3 Release Creation Process'),
  num('All issues in the milestone group are closed'),
  num('The milestone group is merged to main (via a Release PR with ≥ 2 approvals)'),
  num('Vercel deploys to production automatically'),
  num('Tech lead verifies the deployment on production URL (5-minute smoke test)'),
  num('Tech lead creates the GitHub Release: tag (e.g. v0.3.0), release notes (CHANGELOG entries), and marks it as the latest release'),
  num('Team is notified in the project Slack/communication channel'),
  num('If applicable, the Tam client is notified and given the staging URL for review'),
  spacer(),

  h2('C.4 GitHub Milestone Configuration'),
  body('Each of the 20 milestones in V5.0 is created as a GitHub Milestone with these fields:'),
  kvt([
    ['Title','M[number]: [Milestone Name] — e.g. "M7: Quote System"'],
    ['Description','1-paragraph summary of what this milestone delivers. Include the release it belongs to (e.g. "Part of Release v0.4.0 — Quote Platform").'],
    ['Due date','Not set (flexible roadmap). Due dates are set only in the week before a milestone starts, based on current velocity.'],
    ['Issues','All issues in this milestone are assigned to it on creation. Milestone progress bar in GitHub reflects issue completion automatically.'],
    ['Closure','Close the GitHub milestone when all its issues are closed and the tech lead has signed off.'],
  ]),
  pb(),

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION D — IMPROVED DEPENDENCY PLANNING
════════════════════════════════════════════════════════════════════════════ */
  h1('D · IMPROVED DEPENDENCY PLANNING'),
  sLabel('Sequential vs Parallel — Exactly Specified'),

  h2('D.1 Sequential Dependency Chains'),
  body('The following chains are strictly sequential. Work in chain 2 cannot begin until chain 1 is complete. These are immovable constraints.'),
  spacer(),
  h3('Chain 1: Core Platform (Critical Path)'),
  body('M1 → M2 → M3 → M4 → M5 → M7 → M15 → M17 → M18 → M19 → M20'),
  body('Rationale: You cannot build homepage sections (M4) without global layout (M3). You cannot run SEO (M15) without the pages existing (M4). You cannot go live (M20) without testing (M19).'),
  spacer(),
  h3('Chain 2: Content System'),
  body('M3 → M8 → M11 → M13 → M14'),
  body('Rationale: Product pages (M8) need the layout. Industry pages (M11) link to product pages. CMS (M13) migrates the content from M8 and M11. Admin (M14) reads CMS and quote data.'),
  spacer(),
  h3('Chain 3: Engagement Features'),
  body('M3 → M10 → M12 → M13'),
  body('Rationale: Gallery and Blog need global layout. CMS (M13) connects them to the editorial system.'),
  spacer(),

  h2('D.2 Parallel Work Opportunities'),
  body('The following milestones share only the M2 + M3 dependency. Once M3 is complete, all of these can be developed simultaneously by different developers:'),
  spacer(),
  tbl(
    ['Milestone','Can Start When','Can Run In Parallel With'],
    [2000,2400,4960],
    [
      ['M5: Hero Slider','M4 homepage placeholder exists','M6, M7, M8, M9, M10, M11, M12'],
      ['M6: Navigation','M3 header shell exists','M4, M5, M7, M8, M9, M10, M11, M12'],
      ['M8: Product Pages','M3 complete','M5, M6, M9, M10, M11, M12'],
      ['M9: AI Design Studio','M3 complete + M7 quote link exists (can mock link)','M5, M6, M8, M10, M11, M12'],
      ['M10: Gallery','M3 complete','M5, M6, M8, M9, M11, M12'],
      ['M11: Industry Pages','M3 complete + M8 product pages exist (can link to placeholders)','M9, M10, M12'],
      ['M12: Blog','M3 complete','M9, M10, M11'],
    ]
  ),
  spacer(),

  h2('D.3 Decision Points (Gates)'),
  body('These are the moments in the project where a specific external input or decision must arrive before work can continue. Identify these early and assign an owner.'),
  tbl(
    ['Gate','Blocks','Input Required','Owner','Deadline (relative to blocking milestone start)'],
    [1600,1600,2400,1600,2200],
    [
      ['Photography ready','M5 (hero photos), M8 (product photos)','Final hero + product photography in WebP format delivered to the dev team','Tam / Creative Agency','Before M5 starts'],
      ['Copywriting ready','M8, M11, M12','Final approved copy for all product pages, industry pages, 5 blog articles','Tam / Copywriter','Before M8 starts'],
      ['R2 + Resend provisioned','M7','Credentials in Vercel env vars, test email delivered successfully','DevOps','Before M7 starts'],
      ['Sanity schema approved','M13','Schema review meeting held. All content stakeholders have signed off on field structure.','Tech Lead + Tam Content Manager','Before M13 starts'],
      ['Admin team access','M14','Admin email addresses collected. Roles assigned. First login test successful.','Tam Operations','Before M14 starts'],
      ['Domain + DNS','M20','DNS records configured. Propagation verified.','Tam IT','5+ days before M20'],
      ['Client final approval','M20','Tam client has reviewed staging.tamcustompatches.com and given written sign-off.','PM / Tech Lead','Before M20 starts'],
    ]
  ),
  pb(),

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION E — IMPROVED SPRINT PLANNING
════════════════════════════════════════════════════════════════════════════ */
  h1('E · DYNAMIC SPRINT PLANNING'),
  sLabel('Date-Free Sprint Methodology'),

  h2('E.1 The Sprint Unit'),
  body('A sprint is a 1-week timebox of focused development work. Sprints have no calendar dates assigned at the start of the project. Instead, sprints are numbered sequentially (Sprint 1, Sprint 2, Sprint N) and dated only in the week before they begin — when the team knows actual availability.'),
  spacer(),
  kvt([
    ['Sprint duration','1 week (5 working days)'],
    ['Sprint planning','First thing Monday morning, 60 minutes maximum'],
    ['Daily standup','Every morning, 15 minutes. Three questions: What did I complete yesterday? What will I complete today? What is blocking me?'],
    ['Sprint review','Friday afternoon, 30 minutes. Demo every completed issue against its acceptance criteria.'],
    ['Sprint retrospective','Friday after review, 30 minutes. What to start, stop, continue. One action item per retrospective with an owner.'],
    ['Velocity tracking','Record actual story points completed at end of each sprint. Calculate rolling average after Sprint 3.'],
  ]),
  spacer(),

  h2('E.2 Sprint Planning Process'),
  body('Sprint planning is a conversation, not a template. The output is a sprint backlog — a list of issues the team commits to completing in the next 5 days.'),
  num('Review the milestone dependency order. What is the highest priority unblocked work?'),
  num('Pull issues from the "Ready" column in the GitHub Project board.'),
  num('The team selects issues based on effort estimates and available capacity. Never over-commit.'),
  num('Each developer commits to their portion of the sprint backlog.'),
  num('Any issue that is unclear or missing acceptance criteria is moved back to "Needs Refinement" and cannot be in the sprint.'),
  num('A sprint goal is stated in one sentence: "This sprint, we will complete the hero slider component including all 3 scene variants and reduced-motion support."'),
  spacer(),
  info('Sprint goal format: "This sprint, we will [specific deliverable] so that [user/business value]." This forces the team to connect technical work to outcomes.'),
  spacer(),

  h2('E.3 Velocity Management'),
  tbl(
    ['Situation','Response'],
    [2800,6560],
    [
      ['Sprint 1–2 velocity is unknown','Undercommit. Take 60–70% of what seems achievable. Use the remaining capacity to refine upcoming issues.'],
      ['Velocity is lower than estimated (under-delivering)','Do not extend the sprint. Carry incomplete issues to Sprint N+1. At the retrospective: was the issue underestimated, or were there unexpected interruptions? Adjust future estimates accordingly.'],
      ['Velocity is higher than estimated (over-delivering)','Pull the next highest-priority issue from Ready. Do not add scope to an existing issue.'],
      ['A critical blocker appears mid-sprint','Move the blocked issue to "Blocked" column. Create a blocker issue if the dependency is external. The developer picks up the next Ready issue.'],
      ['A P0 bug is discovered mid-sprint','Immediately stop work on the lowest-priority sprint issue. Address the P0. The displaced issue returns to Ready.'],
    ]
  ),
  spacer(),

  h2('E.4 Release Sprint Pattern'),
  body('A Release Sprint is a sprint dedicated to launching a GitHub Release. The sprint backlog contains only: final QA, bug fixes, documentation, and the release actions. No new feature development in a Release Sprint.'),
  tbl(
    ['Day','Activity'],
    [800,8560],
    [
      ['Monday','Full E2E test suite run on staging. All Tier 1 + Tier 2 tests must pass.'],
      ['Monday–Tuesday','Fix any failing tests or newly discovered bugs. No new features.'],
      ['Wednesday','Manual review session: all team members review the staging site against the release scope. Accessibility spot-check. Performance verification.'],
      ['Thursday','Tech lead creates the Release PR (staging → main). Two required approvals.'],
      ['Friday','Release PR merged. Vercel deploys to production. Tech lead creates GitHub Release with CHANGELOG. Team and client notified.'],
    ]
  ),
  pb(),

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION F — EXPANDED RISK MANAGEMENT PER MILESTONE
════════════════════════════════════════════════════════════════════════════ */
  h1('F · EXPANDED RISK MANAGEMENT'),
  sLabel('Technical, Business & Schedule Risks Per Milestone'),

  h2('F.1 Risk Management Principles'),
  body('Every risk in this register has three parts: the risk itself, a mitigation strategy (prevents the risk from materializing), and a fallback plan (what to do if the risk materializes despite mitigation). A risk without a fallback is not managed — it is ignored.'),
  spacer(),

  h2('F.2 Per-Milestone Risk Detail'),

  mCard(5,'Hero Slider (3D Scenes)','High','XL','High','Critical Path'),
  tbl(
    ['Risk Type','Risk','Prob','Mitigation','Fallback'],
    [1400,2400,600,2800,2200],
    [
      ['Technical','CSS 3D transforms broken on Safari iOS','High','Test on physical iPhone Safari from day 1. Use @supports (transform: perspective(1px)) CSS feature query.','Static image card group (no 3D) served to browsers failing the feature query. Same visual quality, different technique.'],
      ['Technical','Framer Motion spring physics cause layout thrash on mobile','Medium','Profile with Chrome DevTools Performance panel on a real Android device during development.','Reduce spring stiffness. On mobile < 640px, replace spring with CSS transition (no JS animation).'],
      ['Schedule','XL effort takes more than 3 sprints','High','Time-box each scene to 1 sprint maximum. Parallelize scene development if team size allows.','Ship homepage with Hero 1 (patches) only for v0.3.0. Add Hero 2 (apparel) and Hero 3 (MA) in the following sprint as a v0.3.1 patch.'],
      ['Business','Photography not ready for hero','High','Set photography deadline at M4 start. Brief the creative team immediately.','Use high-quality stock photography from Unsplash/Getty (with license) as placeholders. Replace within 2 weeks of launch.'],
    ]
  ),
  spacer(),

  mCard(7,'Quote System','High','XL','Critical','Critical Path'),
  tbl(
    ['Risk Type','Risk','Prob','Mitigation','Fallback'],
    [1400,2400,600,2800,2200],
    [
      ['Technical','R2 presign URL expiry causes failed uploads on slow connections','Medium','Set expiry to 10 minutes. Implement retry logic on the client. Show clear "Upload expired — retry" UI.','Allow users to skip artwork upload entirely and receive a follow-up email with an upload link.'],
      ['Technical','Cloudflare Turnstile blocks legitimate users (false positives)','Low','Test across 5+ different IP ranges and devices before launch. Monitor failure rate daily for first week.','If failure rate > 2%, switch to the visible checkbox Turnstile mode (user clicks a checkbox, no image puzzle).'],
      ['External','R2 or Resend provisioning delayed','High','Resolve both in M1 (first sprint). Treat as blockers for M7.','Build quote form in "email fallback mode" — store submissions in localStorage and send via mailto link until R2/Resend are operational.'],
      ['Business','Quote form abandonment rate is high at a specific step','Medium','Instrument every step with GA4 events from day 1 (M16). Review funnel weekly post-launch.','Simplify the failing step: reduce options, change copy, make a field optional. A/B test via feature flag.'],
    ]
  ),
  spacer(),

  mCard(13,'CMS Integration','High','XL','High','No'),
  tbl(
    ['Risk Type','Risk','Prob','Mitigation','Fallback'],
    [1400,2400,600,2800,2200],
    [
      ['Technical','Sanity GROQ queries perform poorly with large datasets','Medium','Add indexes to all queried fields during schema setup. Use ISR (1-hour revalidation) to serve cached HTML.','If GROQ is slow: serve static JSON snapshots of CMS data. Rebuild snapshots via a cron job every hour.'],
      ['Schedule','Schema disagreement between developers and content team causes rework','High','Hold a single 2-hour schema review meeting before M13 starts. Freeze the schema after this meeting.','If schema must change post-migration: Sanity supports additive schema changes without data migration. Destructive changes require a migration script — budget 1 day.'],
      ['Business','Content team has difficulty using Sanity Studio','Medium','Deliver a 15-minute screen-recorded training video with the Studio. Schedule a live Q&A session.','Provide a developer point-of-contact for content questions for 30 days post M13 completion.'],
    ]
  ),
  spacer(),

  mCard(14,'Admin Dashboard','High','XL','High','No'),
  tbl(
    ['Risk Type','Risk','Prob','Mitigation','Fallback'],
    [1400,2400,600,2800,2200],
    [
      ['Schedule','Admin scope grows beyond estimate','High','Scope is explicitly capped at: quote list, quote detail, basic analytics, email templates. Any request beyond this is a P2 feature.','If M14 is delayed, v1.0.0 still launches on schedule. Quote notifications go to email. Admin dashboard ships as v0.7.0 post-launch.'],
      ['Technical','TanStack Table performance with large quote volume','Low','Use virtualization (react-virtual) for tables > 100 rows. Implement server-side pagination.','If virtualization is complex: paginate at 20 rows per page with simple prev/next controls.'],
      ['Security','Admin IP allowlist blocks team members working remotely','Medium','Document the allowlist update process. DevOps must be reachable within 1 hour to add a new IP.','Maintain a VPN-based fallback: team members on VPN can access admin from any IP.'],
    ]
  ),
  pb(),

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION G — MEASURABLE ACCEPTANCE CRITERIA PER MILESTONE
════════════════════════════════════════════════════════════════════════════ */
  h1('G · MEASURABLE ACCEPTANCE CRITERIA PER MILESTONE'),
  sLabel('Quantified Completion Criteria — No Ambiguity'),

  h2('G.1 Acceptance Criteria Framework'),
  body('For a milestone to be marked "Done", every acceptance criterion must be verified and documented in a milestone sign-off comment on the GitHub milestone. Criteria are checked by the tech lead, not self-reported by the developer.'),
  spacer(),

  h2('G.2 Milestone Acceptance Criteria (Quantified)'),
  tbl(
    ['Milestone','Acceptance Criteria (All Must Pass)'],
    [1800,7600],
    [
      ['M1: Foundation','☐ npm run dev starts without errors. ☐ npm run build completes. ☐ npm run type-check: 0 errors. ☐ npm run lint: 0 errors. ☐ GitHub Actions CI pipeline runs and passes on an empty commit to a feature branch. ☐ Vercel preview deploy created successfully. ☐ .env.example contains all variables from V4 Section 1.3.'],
      ['M2: Design System','☐ All 22 CSS custom properties from V3 match their hex values exactly. ☐ Inter font renders in the browser with no FOUT (verify with Network throttling). ☐ All 8 animation variants from V4 Section 1.7 are defined and exported. ☐ All 6 spring configs from V4 Section 1.7 are defined. ☐ All TypeScript types from V4 Section 1.3 compile without errors. ☐ npm test: all hook unit tests pass.'],
      ['M3: Global Layout','☐ Header transitions transparent→solid at 80px scroll (verified in Chrome). ☐ Mobile menu opens and closes on 375px viewport. ☐ Escape key closes mobile menu. ☐ Footer renders correctly at 375px, 768px, 1440px. ☐ Skip link appears on Tab press and links to #main-content. ☐ axe-core: 0 violations on header + footer. ☐ Lighthouse Accessibility: 100 on the root layout page.'],
      ['M4: Homepage','☐ All 10 homepage sections render at 375px, 768px, 1440px. ☐ Trust bar counter animation triggers on scroll. ☐ FAQ accordion: FAQPage JSON-LD validates in Google Rich Results Test. ☐ Testimonial carousel auto-advances after 7 seconds. ☐ Logo marquee pauses on hover. ☐ Lighthouse Performance ≥ 90 (mobile) on homepage. ☐ Lighthouse SEO: 100. ☐ CLS = 0 on homepage.'],
      ['M5: Hero','☐ All 15 acceptance criteria from V4 Section 7.6 individually verified and documented. ☐ Mouse parallax functional on desktop (verified: cards move on mouse movement). ☐ Swipe navigation functional on iPhone Safari (physical device). ☐ Reduced motion: all card animations disabled when OS setting is active. ☐ Lighthouse Performance ≥ 90 (mobile) with hero fully rendered. ☐ CLS = 0 during card entrance animations.'],
      ['M6: Navigation','☐ Mega menu opens in ≤ 150ms after mouse hover (verified with DevTools). ☐ Mega menu closes on Escape key press. ☐ Tab key navigates through all mega menu links. ☐ Mobile accordion expands/collapses. ☐ Search overlay opens on ⌘K / Ctrl+K. ☐ axe-core: 0 violations on navigation. ☐ Lighthouse Accessibility: 100 on navigation components.'],
      ['M7: Quote Wizard','☐ E2E-001 passes: end-to-end quote submission → email delivered. ☐ E2E-002 passes: save URL restores all previous selections. ☐ File upload: 10MB EPS uploads successfully to R2 in < 30 seconds on a 10Mbps connection. ☐ Turnstile: bot-simulated request (missing token) returns 400 TURNSTILE_FAILED. ☐ Rate limit: 4th submission in 1 minute returns 429. ☐ Mobile: complete quote form on 375px iPhone Safari without horizontal scroll. ☐ All Zod validation schemas have ≥ 95% unit test coverage.'],
      ['M8: Product Pages','☐ All 25+ product pages return 200 and render content. ☐ Product JSON-LD validates with no errors in Google Rich Results Test (tested on 3 pages). ☐ Related products carousel scrolls on mobile touch. ☐ Quote CTA pre-fills product type in /quote URL (verify ?product= param). ☐ Lighthouse SEO: 100 on 5 sampled product pages. ☐ Lighthouse Performance ≥ 90 (mobile) on 3 sampled product pages.'],
      ['M9: AI Design Studio','☐ "Generate Preview" shows a placeholder result within 3 seconds. ☐ Regenerate changes the result (different placeholder). ☐ Undo/Redo reverses parameter changes (verified: 5-step undo chain tested). ☐ Compare view divider is draggable (mouse and touch). ☐ Share URL: copying URL in browser A, opening in browser B, restores all parameters. ☐ "Get a Quote" → /quote with correct URL params (all AI selections pre-filled). ☐ Mobile: Controls and Preview tabs switch correctly on 375px.'],
      ['M10: Gallery','☐ Masonry layout renders with variable card heights (no forced crop). ☐ Greyscale→color transition on hover (desktop) verified. ☐ Tap toggles color on mobile. ☐ Lightbox opens on image click. ☐ Keyboard: arrow keys navigate images in lightbox. Escape closes. ☐ Lightbox zoom: click image to 2×. Click again to 1×. ☐ axe-core: 0 violations in lightbox. ☐ Lighthouse Performance ≥ 90 with 18 gallery images loaded.'],
      ['M11: Industries','☐ All 10 industry pages return 200 and render content. ☐ Quote CTA on each page links to /quote with the correct ?product= pre-fill. ☐ Breadcrumbs present: Home > Industries > [Industry Name]. ☐ Lighthouse SEO: 100 on 3 sampled industry pages.'],
      ['M12: Blog','☐ 5 blog articles render with correct content. ☐ Article JSON-LD validates in Google Rich Results Test. ☐ Pagination works: /blog loads 6 articles, page 2 loads the next 6 (if available). ☐ Category filter returns only articles in the selected category. ☐ Reading time estimate displays on all articles. ☐ Lighthouse SEO: 100 on 2 sampled articles.'],
      ['M13: CMS','☐ Editing a product description in Sanity Studio reflects on the product page within 1 hour (ISR revalidation verified). ☐ Publishing a new blog article makes it immediately available (< 30 seconds). ☐ Content editor role cannot publish directly (requires manager approval). ☐ All Phase 1 content is accessible and editable in Sanity Studio. ☐ ISR webhook: POST /api/revalidate returns 200 on valid payload.'],
      ['M14: Admin','☐ Admin login blocks unauthenticated access (non-admin IP returns 403). ☐ Quote list loads all submitted quotes in < 2 seconds (test with 100+ records). ☐ Quote detail drawer shows all quote information including artwork file links. ☐ Status change recorded in activity log. ☐ Analytics KPI cards show accurate data (verified against GA4). ☐ Email template editor saves changes and sends a test email correctly.'],
      ['M15: SEO','☐ sitemap.xml generated with all product, industry, blog, and main URLs (0 404s in sitemap). ☐ robots.txt: /api/ and /admin/ blocked. Product pages not blocked. ☐ OG image: URL shared on LinkedIn shows the correct preview image. ☐ Google Rich Results Test: Product, FAQ, Article, Breadcrumb schemas — 0 errors. ☐ GSC: Sitemap submitted and shows 0 errors.'],
      ['M16: Analytics','☐ Submitting a test quote fires quote_submitted in GA4 DebugView within 30 seconds. ☐ All 10 quote funnel events from V4 Section 4.3 fire in the correct order. ☐ Clarity: session recording starts within 5 minutes of a new browser session. ☐ GTM Preview: all tags fire on their configured triggers.'],
      ['M17: Accessibility','☐ axe-core: 0 violations on: homepage, product page, quote form, gallery, blog article. ☐ Lighthouse Accessibility: 100 on 5 sampled pages. ☐ Manual keyboard test: complete quote form without mouse on desktop. ☐ VoiceOver (macOS): homepage headings and main content announced correctly. ☐ Reduced motion OS setting: verify all animations disabled on site.'],
      ['M18: Performance','☐ Lighthouse Performance: ≥ 90 (mobile) on: homepage, product page, quote form. ☐ LCP < 1.8s on homepage (Lighthouse lab data). ☐ CLS < 0.05 on homepage (Lighthouse lab data). ☐ First JS bundle < 100KB gzipped (@next/bundle-analyzer verified). ☐ All hero images loading as WebP (Network tab: 0 JPEG requests for hero).'],
      ['M19: Testing','☐ npm test: all tests pass. Coverage: utils ≥ 90%, validations ≥ 95%, hooks ≥ 80%. ☐ npm run test:e2e: all 20 E2E tests (Tier 1 + Tier 2) pass. ☐ Lighthouse CI: no PR on main branch fails Performance < 85 (mobile). ☐ 0 axe-core violations on any E2E test page scan.'],
      ['M20: Production Launch','☐ Production Readiness Checklist (Section 14 of V5.0) fully signed off. ☐ Homepage loads correctly on tamcustompatches.com in < 2 seconds (WebPageTest.org). ☐ Quote submission tested on production — email received by internal team. ☐ GA4 shows real page views from the production domain. ☐ v1.0.0 git tag created. ☐ GitHub Release v1.0.0 published with CHANGELOG.'],
    ]
  ),
  spacer(),
  divider(),
  new Paragraph({children:[new TextRun({text:'TAM CUSTOM PATCHES',font:'Inter',bold:true,size:20,color:C.accent}),new TextRun({text:'  ·  Master Development Roadmap v5.1  ·  Extension of V5.0',font:'Inter',size:20,color:C.muted})],alignment:AlignmentType.CENTER,spacing:{before:160,after:80}}),
  new Paragraph({children:[new TextRun({text:'Sections A–G: Flexible Planning · Phase 1/2 · GitHub Releases · Dependencies · Sprints · Risk · Acceptance Criteria',font:'Inter',size:18,color:C.muted,italic:true})],alignment:AlignmentType.CENTER,spacing:{before:0,after:80}}),
  new Paragraph({children:[new TextRun({text:'Complete Specification: V1.0 Architecture · V2.0 Systems · V3.0 Visual Design · V4.0 Engineering · V5.0+V5.1 Project Management',font:'Inter',size:18,color:C.muted,italic:true})],alignment:AlignmentType.CENTER,spacing:{before:0,after:0}}),
];

/* ─── assembly ─────────────────────────────────────────────────────────── */
const doc=new Document({
  title:'Tam Custom Patches — Master Development Roadmap v5.1',
  styles:{default:{document:{run:{font:'Inter',size:22,color:C.ink}}},paragraphStyles:[
    {id:'Heading1',name:'Heading 1',basedOn:'Normal',next:'Normal',quickFormat:true,run:{font:'Inter',size:40,bold:true,color:C.white},paragraph:{spacing:{before:480,after:240},outlineLevel:0}},
    {id:'Heading2',name:'Heading 2',basedOn:'Normal',next:'Normal',quickFormat:true,run:{font:'Inter',size:28,bold:true,color:C.accentDk},paragraph:{spacing:{before:360,after:160},outlineLevel:1}},
    {id:'Heading3',name:'Heading 3',basedOn:'Normal',next:'Normal',quickFormat:true,run:{font:'Inter',size:24,bold:true,color:C.ink},paragraph:{spacing:{before:280,after:120},outlineLevel:2}},
    {id:'Heading4',name:'Heading 4',basedOn:'Normal',next:'Normal',quickFormat:true,run:{font:'Inter',size:21,bold:true,color:C.muted},paragraph:{spacing:{before:200,after:80},outlineLevel:3}},
  ]},
  numbering:{config:[
    {reference:'bullets',levels:[{level:0,format:LevelFormat.BULLET,text:'•',alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}},{level:1,format:LevelFormat.BULLET,text:'◦',alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:1080,hanging:360}}}}]},
    {reference:'numbers',levels:[{level:0,format:LevelFormat.DECIMAL,text:'%1.',alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]},
  ]},
  sections:[{
    properties:{page:{size:{width:12240,height:15840},margin:{top:1080,right:1080,bottom:1080,left:1080}}},
    headers:{default:new Header({children:[new Paragraph({children:[new TextRun({text:'Tam Custom Patches  ·  Master Development Roadmap v5.1  ·  Extension of V5.0',font:'Inter',size:18,color:C.muted}),new TextRun({text:'\t',font:'Inter',size:18}),new TextRun({text:'Confidential',font:'Inter',size:18,color:C.muted})],tabStops:[{type:TabStopType.RIGHT,position:TabStopPosition.MAX}],border:{bottom:{style:BorderStyle.SINGLE,size:2,color:C.border,space:4}}})]})},
    footers:{default:new Footer({children:[new Paragraph({children:[new TextRun({text:'Page ',font:'Inter',size:18,color:C.muted}),new TextRun({children:[PageNumber.CURRENT],font:'Inter',size:18,color:C.muted}),new TextRun({text:'\t',font:'Inter',size:18}),new TextRun({text:'tamcustompatches.com',font:'Inter',size:18,color:C.muted})],tabStops:[{type:TabStopType.RIGHT,position:TabStopPosition.MAX}],border:{top:{style:BorderStyle.SINGLE,size:2,color:C.border,space:4}}})]})},
    children:[...cover(),...sA()],
  }],
});
Packer.toBuffer(doc).then(buf=>{
  fs.writeFileSync('/mnt/user-data/outputs/Tam_V5_1_Roadmap_Extension.docx',buf);
  console.log('✅ V5.1 written.');
}).catch(e=>{console.error(e);process.exit(1);});