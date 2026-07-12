const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, TabStopType, TabStopPosition,
  LevelFormat
} = require('docx');
const fs = require('fs');

const C = {
  ink: '0A0A0A', accent: '1A56DB', accentDk: '1E429F', gold: 'B8860B',
  surface: 'F8FAFC', border: 'E2E8F0', muted: '64748B', white: 'FFFFFF',
  dark: '1A1A2E', tagBg: 'DBEAFE', sectionBg: 'F1F5F9', warm: 'F5F0EB',
  success: '16A34A', error: 'DC2626',
};

const brd = { style: BorderStyle.SINGLE, size: 1, color: C.border };
const borders = { top: brd, bottom: brd, left: brd, right: brd };

const h1 = t => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: t, font: 'Inter', bold: true, size: 38, color: C.white })], shading: { fill: C.dark, type: ShadingType.CLEAR }, spacing: { before: 480, after: 240 }, indent: { left: 360, right: 360 } });
const h2 = t => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: t, font: 'Inter', bold: true, size: 28, color: C.accentDk })], spacing: { before: 360, after: 160 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.accent, space: 4 } } });
const h3 = t => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: t, font: 'Inter', bold: true, size: 24, color: C.ink })], spacing: { before: 280, after: 120 } });
const h4 = t => new Paragraph({ heading: HeadingLevel.HEADING_4, children: [new TextRun({ text: t, font: 'Inter', bold: true, size: 21, color: C.muted })], spacing: { before: 200, after: 80 } });
const body = t => new Paragraph({ children: [new TextRun({ text: t, font: 'Inter', size: 22, color: C.ink })], spacing: { after: 120 } });
const italic = t => new Paragraph({ children: [new TextRun({ text: t, font: 'Inter', size: 22, italic: true, color: C.muted })], spacing: { after: 120 } });
const note = t => new Paragraph({ children: [new TextRun({ text: 'DIRECTIVE  ', font: 'Inter', bold: true, size: 20, color: C.accentDk }), new TextRun({ text: t, font: 'Inter', size: 20, color: C.accentDk })], shading: { fill: C.tagBg, type: ShadingType.CLEAR }, indent: { left: 360, right: 360 }, spacing: { before: 80, after: 160 } });
const callout = t => new Paragraph({ children: [new TextRun({ text: t, font: 'Inter', size: 20, color: C.ink })], shading: { fill: C.warm, type: ShadingType.CLEAR }, indent: { left: 360, right: 360 }, spacing: { before: 80, after: 160 }, border: { left: { style: BorderStyle.SINGLE, size: 12, color: C.gold, space: 8 } } });
const sectionLabel = t => new Paragraph({ children: [new TextRun({ text: t.toUpperCase(), font: 'Inter', bold: true, size: 18, color: C.accent, characterSpacing: 80 })], spacing: { before: 240, after: 80 } });
const bullet = (t, level = 0, bold = false) => new Paragraph({ numbering: { reference: 'bullets', level }, children: [new TextRun({ text: t, font: 'Inter', size: 22, bold })], spacing: { after: 80 } });
const numbered = (t, level = 0) => new Paragraph({ numbering: { reference: 'numbers', level }, children: [new TextRun({ text: t, font: 'Inter', size: 22 })], spacing: { after: 80 } });
const spacer = () => new Paragraph({ children: [], spacing: { after: 120 } });
const divider = () => new Paragraph({ children: [], border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.border, space: 1 } }, spacing: { before: 160, after: 160 } });
const pageBreak = () => new Paragraph({ children: [new TextRun({ break: 1 })], spacing: { after: 0 } });

const cell = (t, { w = 2400, bg, bold: b, color } = {}) => new TableCell({ borders, width: { size: w, type: WidthType.DXA }, shading: bg ? { fill: bg, type: ShadingType.CLEAR } : undefined, margins: { top: 100, bottom: 100, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: t, font: 'Inter', size: 20, bold: b || false, color: color || C.ink })] })] });
const hdrRow = (labels, widths) => new TableRow({ tableHeader: true, children: labels.map((l, i) => new TableCell({ borders, width: { size: widths[i], type: WidthType.DXA }, shading: { fill: C.dark, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: l, font: 'Inter', size: 20, bold: true, color: C.white })] })] })) });
const tbl = (headers, widths, rows) => new Table({ width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: widths, rows: [hdrRow(headers, widths), ...rows.map(r => new TableRow({ children: r.map((c, i) => cell(c, { w: widths[i] })) }))] });
const kvTbl = (pairs, w1 = 2600, w2 = 6760) => new Table({ width: { size: w1 + w2, type: WidthType.DXA }, columnWidths: [w1, w2], rows: pairs.map(([k, v]) => new TableRow({ children: [cell(k, { w: w1, bold: true, bg: C.sectionBg }), cell(v, { w: w2 })] })) });

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 10 — EMPTY STATES
// ═══════════════════════════════════════════════════════════════════════════════
const buildEmptyStates = () => [
  h1('10 · EMPTY STATES'),
  sectionLabel('Every Empty Condition — Full Design Direction'),

  h2('10.1 Empty State Design Philosophy'),
  body('Empty states are moments of friction. The visitor expected to find something and found nothing. Good empty state design turns this friction into an opportunity: it explains what happened, shows the path forward, and maintains visual quality even when there is no content to show.'),
  body('Every empty state on this site follows the same structure: Illustration → Headline → Subline → Optional CTA. The illustration and copy change per context.'),
  spacer(),

  h2('10.2 Gallery — No Photos'),
  kvTbl([
    ['Illustration',    'An SVG: a blank 4×4 grid of rounded squares, each square containing a small camera icon. The grid represents a gallery that is empty. Colors: #E2E8F0 for the squares, #94A3B8 for the icons.'],
    ['Headline',        '"No gallery photos yet."'],
    ['Subline',         '"We\'re building our gallery of customer creations. Have a photo to share? We\'d love to feature you."'],
    ['CTA',             '"Submit Your Photo" — secondary button style (not primary — this is optional, not urgent)'],
    ['Tone',            'Warm and inviting. An absence of photos is an opportunity to participate, not a failure.'],
  ]),
  spacer(),

  h2('10.3 Search Results — No Results'),
  kvTbl([
    ['Illustration',    'An SVG: a magnifying glass with a gentle swirl inside (representing "searching"). Colors match the gallery empty state for consistency.'],
    ['Headline',        '"No results for "[search term]"" — the search term is shown in the headline, wrapped in quotation marks and bold.'],
    ['Subline',         '"Try a different word, or browse our product categories below."'],
    ['Recovery links',  'Below the subline: 4 pill links to the main category pages. "Custom Patches" · "Custom Apparel" · "Martial Arts" · "Accessories". These are the most common destinations and redirect the lost visitor.'],
    ['No CTA button',   'Search empty states do not need a button. The recovery links and the always-visible search input above are sufficient.'],
  ]),
  spacer(),

  h2('10.4 Saved Designs — No Designs'),
  kvTbl([
    ['Illustration',    'An SVG: a blank canvas/artboard with a pencil hovering above it, about to draw. The pencil casts a small shadow. Colors: muted gray palette.'],
    ['Headline',        '"Your designs will appear here."'],
    ['Subline',         '"Use the AI Design Studio to create and save custom patch designs. They\'ll be stored here for easy reference."'],
    ['CTA',             '"Open AI Design Studio →" — primary button. This is an opportunity to drive a conversion action.'],
    ['Tone',            'Helpful and forward-looking. The visitor has not failed to save designs — they simply have not started yet.'],
  ]),
  spacer(),

  h2('10.5 Quotes — No Quote History'),
  kvTbl([
    ['Context',         'This state appears in the customer account dashboard (Phase 2) when a logged-in user has no past quote requests.'],
    ['Illustration',    'An SVG: a blank clipboard with a ruler and pencil crossed over it (representing an empty order form).'],
    ['Headline',        '"No quotes yet."'],
    ['Subline',         '"When you request a quote, it will appear here. You can track status, reorder, and save details for future projects."'],
    ['CTA',             '"Request Your First Quote →" — primary button.'],
  ]),
  spacer(),

  h2('10.6 404 — Page Not Found'),
  kvTbl([
    ['Illustration',    'The signature empty state for the brand: a circular embroidered patch with "404" stitched in the center in the same thread-texture style used across the site. The thread texture is simulated via SVG feTurbulence (same technique as the hero patch cards). Colors: navy and gold (the most classic patch combination). This illustration is unique to the 404 page — it connects the error to the brand\'s product identity.'],
    ['Headline',        '"This page got lost in production."'],
    ['Subline',         '"The URL may have changed or the page may have moved. Let\'s get you back on track."'],
    ['Recovery',        'Three paths: primary button "Back to Homepage", secondary button "Browse Products", text link "Contact Us". Below these: an inline search bar.'],
    ['Background',      'White — clean and calm. A 404 page that looks alarming increases abandonment. A calm, brand-consistent 404 retains visitors.'],
  ]),
  spacer(),

  h2('10.7 500 — Server Error'),
  kvTbl([
    ['Illustration',    'A wrench icon (40px, muted gray) inside a broken circle. Simple. Clear. Signals mechanical problem, not user error.'],
    ['Headline',        '"Something went wrong on our end."'],
    ['Subline',         '"We\'ve been notified and are working to fix this. Please try again in a moment, or contact us if the problem persists."'],
    ['CTA',             '"Try Again" (refreshes the page) + "Contact Us" link.'],
    ['Tone',            'Honest, apologetic, reassuring. Never blame the user. Never use technical language ("500 internal server error"). Just: "we messed up, here\'s how to recover."'],
  ]),
  spacer(),

  h2('10.8 Offline State'),
  kvTbl([
    ['Detection',       'Service Worker (Next.js PWA plugin) detects when the browser is offline and intercepts requests to show this state.'],
    ['Illustration',    'A WiFi icon with a slash through it. Colors: muted gray.'],
    ['Headline',        '"You\'re offline."'],
    ['Subline',         '"Check your internet connection and try again. Pages you\'ve visited recently may still be available below."'],
    ['Cached links',    'The service worker provides a list of cached pages. These appear as text links: "Home · Custom Patches · About Us" — pages the visitor has previously loaded.'],
  ]),
  spacer(),

  h2('10.9 Maintenance Mode'),
  kvTbl([
    ['Background',      'Full dark brand background (#1A1A2E). This uses the premium hero aesthetic — the site looks good even when down.'],
    ['Logo',            'Tam wordmark in white, centered, top of page.'],
    ['Illustration',    'The 3-card patch stack from the hero (CSS, no images) — the signature visual element, present even during maintenance. Shows that the brand identity is solid.'],
    ['Headline',        '"We\'re improving things."'],
    ['Subline',         '"The Tam website is temporarily offline for scheduled maintenance. We\'ll be back shortly — usually within an hour."'],
    ['Contact',         'A single line below: "Urgent order? Email us: [email address]" — the only way to reach the team during maintenance.'],
    ['Estimated time',  'If known: "Expected back at [time]" — honest and specific is always better.'],
  ]),
  pageBreak(),
];

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 11 — MOBILE EXPERIENCE
// ═══════════════════════════════════════════════════════════════════════════════
const buildMobileExperience = () => [
  h1('11 · MOBILE EXPERIENCE'),
  sectionLabel('Every Element on Small Screens'),

  h2('11.1 Mobile Design Philosophy'),
  body('Mobile is not a degraded desktop experience. It is a different medium with different constraints and different user behaviors. A mobile visitor is more likely to be researching on the go, comparing options, or returning to a quote they started on desktop. The mobile experience must be fast, thumb-friendly, and visually premium.'),
  callout('"Design mobile-first, then scale up to desktop." This is the development approach. But this document describes the final designed experience at each breakpoint — not the development order.'),
  spacer(),

  h2('11.2 Mobile Navigation'),
  kvTbl([
    ['Header height',       '64px (vs 80px desktop). The reduction saves vertical space on small screens.'],
    ['Logo size',           'Monogram mark only on screens < 375px. Full wordmark on 375–640px.'],
    ['Hamburger placement', 'Right edge, 20px from edge. Thumb-reachable from both hands. 44×44px touch target.'],
    ['Quote button in header', 'A small "Quote" pill button between the logo and hamburger. 36px height. Accent blue. Always visible — the primary conversion action should never be buried.'],
    ['Drawer behavior',     'Full-screen. Slides in from right (not left — avoids conflict with iOS left-edge swipe-back gesture). Navigation items are large: 52px touch target height for each item.'],
    ['Thumb zone',          'Primary navigation items (most important destinations) are in the bottom 60% of the drawer height — the easiest thumb reach zone. Secondary links (About, Contact, Legal) are at the top.'],
    ['Sub-menu',            'Expanding accordion within the drawer. Tap category to reveal sub-items. The chevron rotates 90° to indicate expansion. 250ms spring.'],
    ['Bottom CTA',          '"Get a Quote" primary button pinned to the bottom of the drawer, 16px from the screen bottom edge. Always visible. Never scrolled away.'],
  ]),
  spacer(),

  h2('11.3 Mobile Hero'),
  kvTbl([
    ['Stack order',         'Content on top (eyebrow, headline, CTA). Visual (patch cards) below. The visual is decorative on mobile — the conversion action is in the content.'],
    ['Headline size',       '34px (clamp to a maximum of 40px on wide phones like iPhone 15 Pro Max). Never below 32px — readability is non-negotiable.'],
    ['CTA layout',          'Two CTA buttons stack vertically (full width). Primary button first. Secondary button second. 8px gap between them. Both buttons are 52px height (larger touch target than desktop).'],
    ['Patch cards (mobile)', 'Three cards in a tight fan at bottom of hero section. Cards: 120px × 120px. Rotation: ±8°. A very gentle auto-rock animation (±3°, 4 seconds, ease-in-out infinite). No mouse parallax.'],
    ['Hero height',         '100svh total. Content zone: approximately 60% of height. Patch zone: 40%.'],
    ['Performance',         'The three mobile hero cards use CSS and SVG exclusively — no image loading. Total hero first render: < 5KB network transfer.'],
  ]),
  spacer(),

  h2('11.4 Mobile Cards & Grids'),
  kvTbl([
    ['Product grid',        'Single column (375–540px). Two columns (541–767px). Cards: 100% width in 1-column layout. Cards take a landscape aspect ratio (3:2) in single-column to avoid excessive scrolling.'],
    ['Card padding',        'Reduced to 16px (vs 24px desktop). Titles: text-lg (vs text-xl desktop). Every typographic size reduces one step on mobile.'],
    ['Card hover',          'No hover on touch devices. The hover state is replaced by a tap state: the card briefly shows the hover style (tint + shadow increase) for 150ms on tap, then navigates.'],
    ['Carousel vs grid',    'On mobile, feature card grids become horizontal scroll carousels. The first card is fully visible; subsequent cards peek from the right edge at 80% (peek = 60px visible). A visual cue at the right edge and a "swipe →" microtext on first view.'],
    ['Gallery',             'Single column masonry. Images are full-width. The grayscale-to-color hover effect becomes: tap to toggle (because mobile has no hover). A "Tap to see in color" text is shown below the first image on first visit.'],
  ]),
  spacer(),

  h2('11.5 Mobile Forms (Quote Wizard)'),
  kvTbl([
    ['Step layout',         'Full screen per step. No sidebar Order Summary visible by default — it collapses to a sticky bottom bar showing current summary and "View full summary" toggle.'],
    ['Input sizing',        'Font size 16px minimum on all inputs. This prevents iOS Safari\'s automatic zoom on input focus, which causes the entire page to shift — disorienting and unprofessional.'],
    ['Option cards',        'Two columns in step selectors. Each card: full height (not truncated). If content is long, the card expands rather than truncating.'],
    ['Keyboard avoidance',  'Use the VisualViewport API to detect the keyboard height and add bottom padding to the step container. The active input is always visible above the keyboard.'],
    ['Progress bar',        'On mobile, the step circles collapse to a simple "[step] of [total]" text + a thin linear progress bar. The circle-and-connector design is too wide for mobile screens.'],
    ['File upload',         '"Browse Files" button replaces the drop zone. The drag-and-drop zone is hidden on touch devices. Below the button: "Take Photo" (iOS/Android camera integration).'],
    ['Sticky CTA',          'The "Continue →" button is sticky at the bottom of the screen on mobile. It stays fixed while the step content scrolls above it. This ensures the navigation action is always within thumb reach.'],
  ]),
  spacer(),

  h2('11.6 Mobile Typography'),
  tbl(
    ['Element', 'Desktop', 'Mobile', 'Rationale'],
    [2000, 1600, 1600, 4200],
    [
      ['Hero H1', '60px', '34px', 'Line count: 2 lines maximum. Legibility on small screens.'],
      ['Section H2', '36px', '26px', 'Proportional reduction.'],
      ['Card heading', '22px', '18px', 'Cards are narrower — less text per line.'],
      ['Body copy', '16px', '15px', 'Very subtle reduction. Never below 15px.'],
      ['CTA button text', '15px', '16px', 'Slightly LARGER on mobile for touch comfort.'],
      ['Captions / labels', '12px', '12px', 'Same — this is already the minimum.'],
      ['Section spacing', '96px', '64px', 'Proportional reduction. Mobile has less space.'],
    ]
  ),
  spacer(),

  h2('11.7 Thumb Reach Design Rules'),
  body('The thumb reach zones on a standard smartphone determine which elements feel natural to interact with and which feel like a stretch. All primary actions must be in the "easy" zone.'),
  tbl(
    ['Zone', 'Screen Position', 'What Belongs Here'],
    [1600, 2400, 5400],
    [
      ['Easy (green)', 'Bottom 60% of screen', 'Quote CTA, navigation drawer links, form submit button, step navigation'],
      ['Stretch (yellow)', 'Middle 25% of screen', 'Secondary navigation, read-only content, page titles'],
      ['Hard (red)', 'Top 15% of screen', 'Header logo (no interaction needed), page number indicators'],
    ]
  ),
  note('All interactive elements are placed in the Easy or Stretch zones. Elements in the Hard zone are informational only — never require tapping.'),
  pageBreak(),
];

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 12 — TABLET EXPERIENCE
// ═══════════════════════════════════════════════════════════════════════════════
const buildTabletExperience = () => [
  h1('12 · TABLET EXPERIENCE'),
  sectionLabel('640px to 1023px — The In-Between'),

  h2('12.1 Tablet Design Philosophy'),
  body('The tablet is the most challenging breakpoint. It is neither the focused single-column mobile experience nor the spacious multi-column desktop layout. The design must be intentional — never a stretched-mobile or a shrunk-desktop.'),
  body('The guiding principle for tablet: 2-column grids, maintained hero side-by-side, navigation that bridges mobile and desktop.'),
  spacer(),

  h2('12.2 Tablet Navigation'),
  kvTbl([
    ['640–767px (tablet-sm)', 'Mobile navigation (hamburger) + header. Same as mobile. The viewport is wide enough for a header but not for full desktop nav.'],
    ['768–1023px (tablet-md)', 'A hybrid: logo + the 3 most important nav links visible in the header + hamburger for the full menu. "Custom Patches | Apparel | Quote" links in the center. The hamburger opens the full drawer.'],
    ['Mega menu',            'Disabled at this breakpoint. The hamburger drawer provides the full navigation structure.'],
  ]),
  spacer(),

  h2('12.3 Tablet Grid System'),
  tbl(
    ['Section', 'Mobile (< 640px)', 'Tablet (640–1023px)', 'Desktop (≥ 1024px)'],
    [2000, 1800, 2000, 2400, 1160],
    [
      ['Hero', '1 column (stacked)', '2 columns (50/50)', '2 columns (40/60)'],
      ['Products grid', '1 column', '2 columns', '4 columns'],
      ['Feature cards', '1 column', '2 columns', '3 columns'],
      ['Trust bar', '2 × 3 grid', '5 columns (all visible)', '5 columns'],
      ['Testimonials', '1 card (full width)', '2 cards visible', '3 cards visible + 1 peeking'],
      ['Blog cards', '1 column', '2 columns', '3 columns'],
      ['Gallery (masonry)', '1 column', '2 columns', '3 columns'],
    ]
  ),
  spacer(),

  h2('12.4 Tablet Hero'),
  kvTbl([
    ['Layout',              '50/50 split (vs desktop\'s 40/60). Content left, visual right. Side-by-side maintained.'],
    ['Headline size',       '44px (clamp between 36px and 52px based on viewport width).'],
    ['Patch showcase',      '4 cards visible (vs 6 on desktop). The two "back" cards are hidden. The visible 4 maintain the arc arrangement.'],
    ['Cards size',          '180px × 180px (vs 240px on desktop, 120px on mobile).'],
    ['Touch interaction',   'No mouse parallax. Auto-drift animation only. Gyroscope option available if permission granted.'],
  ]),
  spacer(),

  h2('12.5 Tablet Forms'),
  kvTbl([
    ['Quote wizard layout', '1-column form with the Order Summary sidebar collapsed to a sticky bottom bar (same as mobile). The viewport is not wide enough for comfortable side-by-side at this breakpoint.'],
    ['Input layout',        'Two inputs per row at 768px+ (First Name / Last Name, for example). One input per row at 640–767px.'],
    ['Option cards',        '3 columns at 768px+, 2 columns at 640–767px.'],
    ['File upload zone',    'Full drag-and-drop functionality restored at 768px+ (users with keyboards and trackpads expect it). Drop zone is full width.'],
  ]),
  pageBreak(),
];

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 13 — DESKTOP EXPERIENCE
// ═══════════════════════════════════════════════════════════════════════════════
const buildDesktopExperience = () => [
  h1('13 · DESKTOP EXPERIENCE'),
  sectionLabel('1024px and Above — The Primary Canvas'),

  h2('13.1 Desktop Design Philosophy'),
  body('The desktop is where this design performs at its highest level. The generous screen real estate is used for depth, not for filling space with more content. The whitespace on desktop is the most powerful element in the design — it is earned breathing room that signals premium quality.'),
  spacer(),

  h2('13.2 Wide Desktop Adaptations (≥ 1440px)'),
  body('At very wide viewports (1440px and above), the content width is capped at 1280px and centered. The flanking space on either side remains the page background color. This centering prevents the design from becoming uncomfortably wide.'),
  body('The exception: full-bleed section backgrounds (hero, dark sections, CTA banner) extend to the full viewport width. Only the content inside is centered.'),
  spacer(),

  h2('13.3 Desktop Grid Density'),
  kvTbl([
    ['Product cards',       '4 columns at 1024px, 4 columns at 1280px, 5 columns at 1440px+ only on the dedicated category page. Homepage stays at 4 columns even on very wide screens.'],
    ['Feature cards',       '3 columns maximum. Never 4. Three is the cognitive processing limit for feature comparison — adding a fourth makes it harder, not easier, to understand.'],
    ['Blog grid',           '3 columns. The third column allows an editorial spread feel.'],
    ['Gallery',             '3 columns at 1024px, 3 columns at 1280px, 4 columns at 1440px. Photography deserves space.'],
    ['Quote wizard',        '2-column layout: form (60%) + order summary sidebar (40%). The sidebar is sticky.'],
    ['AI Design Studio',         '2-column: controls panel (40%) + preview panel (60%). At 1440px+: controls expand to 45% for better usability.'],
  ]),
  spacer(),

  h2('13.4 Cursor Behavior (Desktop Only)'),
  body('Custom cursor behavior is used in one specific context only: the hero patch card showcase. In all other contexts, the default system cursor is used.'),
  kvTbl([
    ['Over hero patch group', 'cursor: grab — signals the cards are interactive (even though they only do the parallax, not actual drag)'],
    ['Hero card mouse-down',  'cursor: grabbing'],
    ['Gallery images',        'cursor: zoom-in — signals the image can be expanded'],
    ['Lightbox image',        'cursor: zoom-in (at normal size) / cursor: zoom-out (at 2× zoom)'],
    ['All other elements',    'Default system cursor. No custom cursor. Custom cursors on links feel gimmicky and reduce trust.'],
  ]),
  spacer(),

  h2('13.5 Desktop Hover Depth System'),
  body('Desktop allows a richer hover vocabulary than mobile. The hover system has three levels of depth:'),
  tbl(
    ['Level', 'Elements', 'Hover Effect'],
    [1000, 2800, 5600],
    [
      ['L1 — Subtle', 'Links, chips, trust badges, stat cards', 'Color change only. No movement. No shadow change. Fast (150ms).'],
      ['L2 — Lift', 'Product cards, feature cards, blog cards, gallery cards', 'translateY(-4px) + shadow increases one level. 200ms ease-standard.'],
      ['L3 — Active', 'Patch cards in hero, category cards, primary CTAs', 'Scale + translateY + shadow + color change. 200–250ms spring.'],
    ]
  ),
  pageBreak(),
];

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 14 — ACCESSIBILITY VISUAL RULES
// ═══════════════════════════════════════════════════════════════════════════════
const buildAccessibilityVisual = () => [
  h1('14 · ACCESSIBILITY VISUAL RULES'),
  sectionLabel('Design That Works for Everyone'),

  h2('14.1 Accessibility as Design Quality'),
  body('Accessible design is not a checklist item — it is a quality signal. A site that is fully accessible has been designed with more precision and care than one that is not. The following rules are enforced in the design system, not added as an afterthought.'),
  spacer(),

  h2('14.2 Contrast Requirements'),
  tbl(
    ['Context', 'Minimum Contrast', 'Target Contrast', 'Test Tool'],
    [2400, 1800, 1800, 3360],
    [
      ['Body text (ink on white)', '4.5:1 (AA)', '7:1 (AAA)', '#0A0A0A on #FFFFFF = 20.6:1 ✓'],
      ['Body text (ink on surface-alt)', '4.5:1 (AA)', '7:1 (AAA)', '#0A0A0A on #F8FAFC = 18.9:1 ✓'],
      ['White on dark bg (#1A1A2E)', '4.5:1 (AA)', '7:1 (AAA)', '#FFFFFF on #1A1A2E = 11.2:1 ✓'],
      ['Muted text (#64748B on white)', '4.5:1 (AA)', '4.5:1 (AA)', '#64748B on #FFFFFF = 4.58:1 ✓'],
      ['Muted text on dark bg', '4.5:1 (AA)', '4.5:1 minimum', 'rgba(255,255,255,0.75) on #1A1A2E — check each use'],
      ['Accent blue CTA text', '4.5:1 (AA)', 'White on #1A56DB', '#FFFFFF on #1A56DB = 4.93:1 ✓'],
      ['Gold on dark background', '4.5:1 (AA minimum)', 'Check gold uses', '#B8860B on #1C1C1E = check at design time'],
      ['Large text (24px+ bold)', '3:1 (AA large)', '4.5:1 preferred', 'Section headings, card titles'],
    ]
  ),
  spacer(),

  h2('14.3 Focus State Visual System'),
  body('Focus states must be instantly recognizable at a glance. The system uses a single, consistent focus treatment:'),
  kvTbl([
    ['Focus ring',          '3px solid #1A56DB (accent blue). 2px transparent offset (creates a white gap between element and ring). border-radius matches the element border-radius.'],
    ['Focus ring on dark', 'On dark backgrounds: 3px solid #FFFFFF (white ring). Same offset.'],
    ['Never use outline: none', 'Removing the default focus ring is only acceptable when replacing it with an explicit custom focus style. Both the custom style AND the removal must be present.'],
    ['Focus visible only', 'Use :focus-visible pseudo-class. The focus ring is shown only when keyboard-navigating — not when clicking with a mouse. This is the correct modern approach.'],
    ['Focus ring scope',    'All interactive elements: buttons, links, inputs, selects, checkboxes, radio buttons, accordion triggers, tabs, dropdown triggers. No exceptions.'],
    ['Tab order',           'The visual tab order must match the reading order of the page. Never use tabindex="0" on non-interactive elements. Never use tabindex with values > 0 (creates a separate tab sequence that is confusing).'],
  ]),
  spacer(),

  h2('14.4 Reduced Motion — Visual Alternatives'),
  body('When animations are removed due to prefers-reduced-motion, the static state of every element must be visually complete. It must not look like something is missing.'),
  tbl(
    ['Animated State', 'Static Alternative (Reduced Motion)', 'Completeness Check'],
    [2400, 2800, 4200],
    [
      ['Hero patch cards arc + drift', 'Cards shown in final arc position, no movement', 'The arc itself is beautiful — motion is enhancement, not requirement'],
      ['Slide transition (hero)', 'Cross-fade only at 200ms (very subtle)', 'Slides still change, just without the directional movement'],
      ['Scroll reveal animations', 'All elements visible from page load at full opacity', 'The page looks complete without scroll-triggered reveals'],
      ['Counter animation (stats)', 'Numbers show final values immediately', '4.9/5 is as impressive at 0ms as it is after a 1200ms count-up'],
      ['Process step connector draw', 'Connector line shown at full width immediately', 'The process flow is still clear without the drawing animation'],
      ['Card hover lift', 'Background-color change only (no translateY)', 'Cards still respond to hover — just without movement'],
    ]
  ),
  spacer(),

  h2('14.5 Typography Accessibility'),
  bullet('Minimum body text size: 15px. Never below this threshold — even for secondary content.'),
  bullet('Line height for body text: 1.6 minimum. This is especially important for dyslexic readers.'),
  bullet('Maximum line length (measure): 70 characters (approximately 680px at 16px base). Text that is wider than this becomes harder to read — the eye struggles to find the start of the next line.'),
  bullet('Never use ALL CAPS for body text or paragraphs. ALL CAPS reduces reading speed by approximately 13%. Use only for very short labels (section labels, badge text, button labels).'),
  bullet('Never use text below 12px for any visible on-screen content. Legal text, captions, timestamps: 12px minimum.'),
  pageBreak(),
];

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 15 — 100 PREMIUM DETAILS
// ═══════════════════════════════════════════════════════════════════════════════
const buildPremiumDetails = () => [
  h1('15 · 100 PREMIUM DETAILS'),
  sectionLabel('The Details That Separate Good from Exceptional'),

  h2('15.1 The Importance of Small Details'),
  body('Users don\'t consciously notice most of these details. But they feel them. The cumulative effect of 100 precise small decisions is the difference between a website that feels "nice" and one that feels "exceptional." Every item below has been included because it makes a measurable difference to the perceived quality of the experience.'),
  spacer(),
  h3('Typography & Text'),
  numbered('Use "curly" typographic quotes (" ") and apostrophes (\') instead of straight ASCII equivalents (" " and \'). In CSS: quotes: "\\201C" "\\201D" "\\2018" "\\2019".'),
  numbered('Use real em-dashes (—) in all copy, not double hyphens (--). The em-dash is a typographic mark. The double hyphen is a typewriter approximation.'),
  numbered('Use non-breaking spaces between numbers and their units: "7–14 business days" should never line-wrap between "14" and "business."'),
  numbered('Set tracking (letter-spacing) on all uppercase text: minimum +0.06em. Uppercase text without tracking looks cramped.'),
  numbered('Use tabular number variant (font-variant-numeric: tabular-nums) in all counters, statistics, and tables. This prevents the layout from shifting as numbers change.'),
  numbered('Apply hyphenation to body text columns narrower than 400px: hyphens: auto. Prevents awkward line breaks on narrow mobile text.'),
  numbered('Set text-rendering: optimizeLegibility on headings only. This enables kerning pairs and ligatures without the performance cost on body text.'),
  numbered('Use font-smoothing: antialiased on macOS for light text on dark backgrounds. The default "auto" renders slightly pixelated on Retina displays.'),
  spacer(),
  h3('Spacing & Rhythm'),
  numbered('Never use odd pixel values for spacing. Every margin, padding, and gap is a multiple of 8px (or 4px for fine details).'),
  numbered('The gap between a heading and its following body text is exactly half the gap above the heading. Example: H2 has 32px above, 16px below. This maintains visual attachment between headings and their content.'),
  numbered('Section padding (top + bottom: 96px) must never be applied to the hero section — it uses svh units instead.'),
  numbered('The visual center of a circle is not its mathematical center. Icon images inside circular containers need a slight upward offset of 1–2px to appear optically centered.'),
  numbered('Paragraph spacing (margin-bottom on paragraphs) is exactly 1em (the current font size). This creates breathing room proportional to the text size.'),
  spacer(),
  h3('Shadow & Depth'),
  numbered('All box-shadows use rgba() with alpha channel — never hex colors or named colors. rgba(0,0,0,0.08) is always softer than rgba(0,0,0,0.1).'),
  numbered('Multi-layer shadows are more realistic than single-layer. Always compose shadows from at least 2 layers: a tight shadow (low y-offset, low blur) and a soft shadow (high y-offset, high blur).'),
  numbered('Interactive elements (buttons, cards) transition their box-shadow value on hover, not just the other properties. box-shadow transitions require the transition property to include box-shadow.'),
  numbered('Text shadows are never used on this site. They create a dated look and reduce text legibility.'),
  numbered('The shadow on a card that is "lifted" (hover state) should have slightly higher y-offset than the resting state, simulating the card moving away from its light source.'),
  spacer(),
  h3('Color & Contrast'),
  numbered('Interactive links in body text use the accent color (#1A56DB) with an underline on hover. Never use the accent color for non-interactive text — color is a signal of interactivity.'),
  numbered('The background-color property changes must always include a transition: background-color 150ms ease. Instant background-color changes on hover look like a bug, not a feature.'),
  numbered('Do not use pure black (#000000) anywhere on the site. Use #0A0A0A (near-black). Pure black looks harsh on most displays; near-black looks intentional.'),
  numbered('Do not use pure white (#FFFFFF) for backgrounds behind pure-black text on large surfaces. Use #FFFFFF for cards. Use #F8FAFC for page backgrounds. The subtle shift reduces eye strain.'),
  numbered('The dark hero background color (#1A1A2E) has a slight blue tint — it is not neutral gray. This subtle blue warmth makes the blue accent color feel harmonious against the background.'),
  spacer(),
  h3('Buttons & Interactive Elements'),
  numbered('Button text never wraps. If the button text is long, the button gets wider — it does not become a multi-line button. Set white-space: nowrap on all button text.'),
  numbered('The disabled state for buttons must not be cursor: default. Use cursor: not-allowed — it communicates that the element exists but cannot be interacted with.'),
  numbered('Buttons that perform destructive actions (delete, clear) use the error color (#DC2626), not the accent blue. Color carries semantic meaning.'),
  numbered('The loading state of a button preserves the button\'s width. If the label is replaced by a spinner, the button must not shrink. Use min-width: the button\'s resting width.'),
  numbered('Primary buttons have a subtle gradient overlay at 0–5% opacity from transparent at the top to rgba(0,0,0,0.06) at the bottom. This adds dimension without visible color change.'),
  spacer(),
  h3('Images & Media'),
  numbered('All images use the loading="lazy" attribute for below-the-fold content. Hero images use loading="eager" and fetchpriority="high".'),
  numbered('Every image has an explicit width and height attribute, even if CSS overrides the visual size. This prevents cumulative layout shift (CLS).'),
  numbered('Images within cards use object-fit: cover. Never object-fit: fill (distorts) or object-fit: contain (creates letterboxing).'),
  numbered('Image placeholders (blur up LQIP — Low Quality Image Placeholder) use the dominant color of the image at 40% opacity, not a generic gray. This creates a contextual placeholder that feels intentional.'),
  numbered('Lazy-loaded images fade in: opacity 0 → 1, 300ms ease-out after loading. Images that pop in instantly feel jarring.'),
  numbered('The aspect-ratio CSS property is used on all image containers to reserve the exact space before the image loads. This is the primary CLS prevention mechanism.'),
  spacer(),
  h3('Forms & Inputs'),
  numbered('Input labels float above the input field on focus and when the field has a value (floating label pattern). The label must never be replaced by a placeholder — placeholder text disappears on focus.'),
  numbered('Placeholder text is always lighter than the input text: color: rgba(0,0,0,0.4). This contrast between placeholder and value helps users confirm they have entered content.'),
  numbered('All form inputs have autocomplete attributes. Name fields: autocomplete="given-name" and "family-name". Email: autocomplete="email". Phone: autocomplete="tel". Country: autocomplete="country". This dramatically improves form fill speed on mobile.'),
  numbered('The "Submit" / "Continue" button in a form is never outside the form element. It should be the last focusable element inside the form.'),
  numbered('Form validation errors must appear inline below the specific field, not in a banner at the top of the form. The user should not have to scroll to find which field has the error.'),
  spacer(),
  h3('Navigation & Wayfinding'),
  numbered('The current page\'s navigation link has a distinctly different visual treatment than hover state — it is permanent, not triggered. Use font-weight: 600 (bold) + underline for current page link.'),
  numbered('All external links open in a new tab (_blank) AND have rel="noopener noreferrer". The external link icon (Lucide ExternalLink, 14px) appears after the link text for transparency.'),
  numbered('Breadcrumbs use structured data (BreadcrumbList schema) AND visually rendered HTML — both are required. Schema alone is not enough (not visible). HTML alone is not enough (not indexed with rich results).'),
  numbered('The browser tab title format is: "[Page Name] — Tam Custom Patches". The separator is an em-dash, not a pipe or hyphen.'),
  numbered('All 404 errors log to the analytics system with the referring URL. This is how broken links are found and fixed without waiting for user reports.'),
  spacer(),
  h3('Loading & Performance'),
  numbered('The first paint of every page must show the header, the hero background color, and the page title. No blank white flash before content appears.'),
  numbered('Skeleton screens match the exact layout and dimensions of the content they replace. A skeleton that is a different size from the content causes a layout shift when content loads.'),
  numbered('Font loading strategy: Inter is loaded with the Next.js font module, which inlines the @font-face declarations and preloads the latin subset. No font flash.'),
  numbered('The main bundle (first JS load) must not exceed 150KB gzipped. Every dependency addition requires a bundle size audit.'),
  numbered('Use resource hints: <link rel="preconnect"> for Cloudflare R2 domain (for uploaded artwork files). <link rel="dns-prefetch"> for Resend email API domain.'),
  spacer(),
  h3('Micro-Interactions'),
  numbered('The cursor changes to "text" when hovering over body text paragraphs — but NOT over headings (they are not selectable/copyable in the same way). This is the default browser behavior but is often accidentally overridden.'),
  numbered('Selecting text on the page should highlight in the brand accent color: ::selection { background-color: rgba(26,86,219,0.25); color: #0A0A0A; }.'),
  numbered('The browser scrollbar on Windows (not macOS which uses the overlay scrollbar) should be styled: a thin, 8px scrollbar with a subtle thumb color (#CBD5E1) and track (#F1F5F9). Styled scrollbars feel like part of the design, not an OS imposition.'),
  numbered('The resize handle on textareas (the bottom-right drag handle) is hidden: resize: vertical — user can resize height only, not width (which would break the form layout).'),
  numbered('The spellcheck attribute is explicitly set: spellcheck="true" on all textarea and input fields that contain user-written content. The red underlines from the browser\'s spellcheck help users submit better content.'),
  spacer(),
  h3('Animations — The Fine Points'),
  numbered('The hover transition-property should be explicitly listed, not transition: all. transition: all re-triggers on every property change including width and height, which can cause unexpected behavior. Instead: transition: box-shadow 200ms ease, transform 200ms ease, background-color 150ms ease.'),
  numbered('Hardware acceleration (GPU layer) is promoted with will-change: transform on the hero patch cards, the gallery lightbox, and the mobile drawer. This must be removed after the animation completes (will-change: auto) to free GPU memory.'),
  numbered('AnimatePresence in Framer Motion is required around every conditional element (toasts, modals, dropdowns). Without it, elements disappear instantly when removed from the DOM — no exit animation.'),
  numbered('The staggerChildren prop in Framer Motion must be set at the parent container level, not inside each child. The parent orchestrates the stagger; the children define their own animation.'),
  numbered('The delay on scroll-triggered animations must not exceed 200ms after the trigger. Delays longer than 200ms make the animation feel disconnected from the scroll action.'),
  spacer(),
  h3('Trust & Conversion'),
  numbered('The trust bar statistics are updated in the CMS quarterly. Stale statistics erode trust — "5,000+ clients" from 3 years ago feels dishonest to returning visitors.'),
  numbered('All testimonials include the customer\'s full name and company. Anonymous reviews or first-name-only reviews ("— Sarah T.") are less credible. Real names with real companies are the highest-trust format.'),
  numbered('The quote form never asks for credit card information. This is a lead-generation site — the absence of payment fields reduces friction and increases trust.'),
  numbered('The privacy policy link is in the footer AND in the quote form contact step. The form placement is especially important: users actively think about data privacy when entering personal information.'),
  numbered('The last item in a FAQ accordion is always "How do I get started?" with the answer "Get a Quote →" — a link to the quote form. Every FAQ section is a conversion opportunity.'),
  pageBreak(),
];

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 16 — DESIGN INSPIRATION REFERENCES
// ═══════════════════════════════════════════════════════════════════════════════
const buildInspirationReferences = () => [
  h1('16 · DESIGN INSPIRATION REFERENCES'),
  sectionLabel('30 Websites — What to Borrow (Not Copy)'),

  h2('16.1 How to Use This Section'),
  body('These references are sources of specific principles, not templates. For each reference, only the cited specific principle is borrowed — never the layout, color, brand identity, or code. The goal is to assemble a synthesis of the world\'s best practices into a wholly original design.'),
  spacer(),

  tbl(
    ['#', 'Reference', 'Category', 'Principle to Borrow'],
    [400, 2000, 1600, 5360],
    [
      ['01', 'stripe.com', 'Trust / Typography', 'The way Stripe uses a single typeface (Inter) at different weights to achieve extraordinary typographic richness. Also: their gradient hero with floating UI cards — directly parallel to our patch card concept.'],
      ['02', 'linear.app', 'Dark Mode / Motion', 'The way Linear uses a dark background with carefully controlled accent colors. Also: their scroll-triggered animations that feel effortless and never jarring.'],
      ['03', 'vercel.com', 'Typography / Layout', 'Vercel\'s headline typesetting: very tight tracking on large display type. Also: their use of white space — the emptiness feels intentional, not lazy.'],
      ['04', 'apple.com', 'Photography / Product Showcase', 'Apple\'s product photography standard: objects against white or dark backgrounds, studio lighting, no clutter. Also: their hero transition (the way hero images slide and scale on scroll).'],
      ['05', 'framer.com', 'Motion / CTA', 'Framer\'s use of motion as a demonstration of their product. For us: the hero patch cards are our "motion as demonstration" — they show the quality of our product.'],
      ['06', 'arc.net', 'Personality / Voice', 'Arc\'s confident, slightly playful brand voice. They know exactly who they are. For us: the directness ("Custom Patches Made Easy") should feel this confident.'],
      ['07', 'notion.so', 'Simplicity / Navigation', 'Notion\'s navigation is a masterclass in hierarchy without complexity. Clean top nav, mega menu that is genuinely useful, no visual noise.'],
      ['08', 'rivian.com', 'Dark Hero / Product Staging', 'How Rivian stages a vehicle in a dark environment with precise lighting. Direct parallel to our martial arts hero — one premium product, perfect light, dark background.'],
      ['09', 'nike.com', 'Action / Confidence', 'Nike\'s headlines are always imperative and short. "Just Do It." For us: "Made Easy." "Get a Quote." Short declarative phrases signal confidence.'],
      ['10', 'carhartt.com', 'Industrial Trust', 'How Carhartt communicates manufacturing quality through photography of fabric texture, construction details, and real workers. Directly applicable to our manufacturing photography.'],
      ['11', 'customink.com', 'Product Configurator UX', 'How Custom Ink makes custom product ordering feel approachable. Study their order flow for the emotional feeling — not the specific design. Their quote funnel has good step-logic.'],
      ['12', 'shopify.com', 'Trust / Social Proof', 'How Shopify places their customer logos and testimonials at exact inflection points in the user journey. The strategic placement of trust signals, not their visual design.'],
      ['13', 'figma.com', 'Feature Cards', 'Figma\'s feature card system: icons, 2–3 line descriptions, consistent grid. The card design is clean and fast to scan. Apply the same rhythm to the "Why Choose Us" section.'],
      ['14', 'airbnb.com', 'Photography / Gallery', 'Airbnb\'s masonry gallery approach: variable height images, no forced cropping, photography that feels editorial. Apply to the customer gallery section.'],
      ['15', 'lusion.co', 'Premium Web Motion', 'Lusion\'s use of WebGL and subtle page motion creates a sense of depth and craft. For us: the hero card parallax should feel like this level of spatial quality — achieved with CSS, not WebGL.'],
      ['16', 'designsystems.com (various)', 'Component Documentation', 'The way well-documented design systems define components with states, specs, and usage rules. The component library in V2 should match this precision.'],
      ['17', 'king-size.fr', 'Typography Contrast', 'How French luxury brands use extreme type-size contrast (very large display vs very small caption) to create visual drama. Apply to section headlines and their subtitles.'],
      ['18', 'superhuman.com', 'Speed Messaging', 'How Superhuman makes speed itself a premium feature. For us: fast website = fast manufacturing. Both the site speed AND the speed messaging signal competence.'],
      ['19', 'rapha.cc', 'Premium Apparel Photography', 'Rapha\'s standard for cycling apparel photography: on-model in real contexts, specific lighting, fabric texture visible. Apply to our custom apparel photography.'],
      ['20', 'patagonia.com', 'Manufacturing Authenticity', 'How Patagonia uses manufacturing and process photography to build trust. The "behind the scenes" imagery style — not documentary, not overly polished.'],
      ['21', 'aesop.com', 'Whitespace / Premium', 'Aesop is the gold standard for whitespace as luxury. Their product pages use so little — and it makes every element feel precious. Study the homepage for spacing rhythm.'],
      ['22', 'kingz.com', 'Martial Arts Premium', 'The product presentation quality for martial arts gear — the lighting, the fabric close-ups, the on-model photography. The specific benchmark for the martial arts section.'],
      ['23', 'bottegaveneta.com', 'Craft Storytelling', 'How luxury fashion brands show craftsmanship. Close-up photography of construction, hands at work, materials. For us: the embroidery close-up photography and manufacturing photos.'],
      ['24', 'carta.com', 'B2B Trust Building', 'How B2B companies build trust without being boring. Clean layouts, specific claims, social proof from recognizable companies. Apply to the industries section.'],
      ['25', 'pitch.com', 'Onboarding / CTA Flow', 'The way Pitch guides users toward their primary conversion action without being pushy. The CTA placement and copy tone is a direct reference.'],
      ['26', 'lottiefiles.com', 'Micro-animation Library', 'Not for direct use — for understanding the range of micro-animations that are available as Lottie files for empty states and loading states.'],
      ['27', 'basehub.com', 'Developer Documentation Quality', 'The quality of documentation that the V1, V2, and V3 specs aspire to — technically precise, well-organized, leaves no ambiguity.'],
      ['28', 'clay.com', 'Gradient Hero', 'How Clay uses a dark gradient hero with floating UI elements to showcase their product. The spatial depth of the hero — especially the shadow depth — is a reference.'],
      ['29', 'mercury.com', 'Financial Trust Design', 'Mercury (banking startup) manages to feel both trustworthy and modern. The balance of precision and warmth is the right model for a manufacturing company.'],
      ['30', 'amie.so', 'Motion Elegance', 'Amie\'s page transitions and micro-interactions are the gold standard for elegant motion design. Not flashy — every animation has a reason and the timing is impeccable.'],
    ]
  ),
  pageBreak(),
];

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 17 — DESIGN CONSISTENCY RULES
// ═══════════════════════════════════════════════════════════════════════════════
const buildConsistencyRules = () => [
  h1('17 · DESIGN CONSISTENCY RULES'),
  sectionLabel('Strict Rules Ensuring Every Page Belongs to the Same Brand'),

  h2('17.1 The Consistency Principle'),
  body('Consistency is the foundation of trust. A visitor who moves from the homepage to a product page to the quote form should never feel like they have entered a different website. These rules are not guidelines — they are enforced constraints.'),
  spacer(),

  h2('17.2 Color Consistency Rules'),
  tbl(
    ['Rule', 'Specification', 'No-Exception Clause'],
    [400, 2800, 6160],
    [
      ['R-C1', 'The accent blue (#1A56DB) is used ONLY for interactive elements (CTAs, links, focus rings, active states)', 'Never use accent blue for decorative purposes. Never use it as a background on large surfaces.'],
      ['R-C2', 'The gold (#B8860B) is used ONLY in the martial arts category and for premium achievement badges', 'The gold must never appear on patch, apparel, or accessories pages. Its scarcity across non-martial-arts sections is what makes it powerful in martial arts contexts.'],
      ['R-C3', 'The dark background (#1A1A2E) is used ONLY for hero sections and high-emphasis full-width CTA banners', 'Never use the dark background on cards, product pages, or blog posts. It is a structural element, not a card treatment.'],
      ['R-C4', 'The success green (#16A34A) is used ONLY for success states, checkmarks, and the satisfaction guarantee component', 'Never use green decoratively. Green means "this worked" or "this is guaranteed."'],
      ['R-C5', 'No new colors may be introduced to any page without updating the design token system', 'If a new color is needed, it must be added to the design token file and documented with its use case.'],
    ]
  ),
  spacer(),

  h2('17.3 Typography Consistency Rules'),
  tbl(
    ['Rule', 'Specification'],
    [400, 8960],
    [
      ['R-T1', 'Inter is the only typeface used on this site. No exceptions. No "premium" serif accent, no Google Fonts variety. One typeface, perfectly executed.'],
      ['R-T2', 'Page titles (H1) are always Inter Bold or ExtraBold (700–800 weight). Never Regular. Never SemiBold for a page heading.'],
      ['R-T3', 'All section headlines (H2) use the same type size (clamp from 28px to 36px). No section may have a "larger" headline than another — this creates hierarchy between pages, not within them.'],
      ['R-T4', 'Body text is always 16px (or 15px on mobile). Never larger. If copy needs more prominence, it uses the "intro paragraph" style (text-lg, 18px) — a different element, not an enlarged body text.'],
      ['R-T5', 'Navigation text is always 15px, Inter Medium (500). Never bold (too heavy in nav). Never regular (too light — links must feel clearly interactive).'],
    ]
  ),
  spacer(),

  h2('17.4 Spacing Consistency Rules'),
  bullet('R-S1: All section vertical padding is 96px (desktop), 64px (tablet), 48px (mobile). No exceptions for "hero" sections or "compact" sections — use the system.'),
  bullet('R-S2: All card internal padding is 24px. Small cards (industry chips, stat cards) use 16px. Never 20px — it is not in the system.'),
  bullet('R-S3: The gap between a section headline and the first content element below it is always 48px.'),
  bullet('R-S4: All grids use the defined column gap for their breakpoint (see Section 12.7 in V2). Never use custom gap values.'),
  spacer(),

  h2('17.5 Component Consistency Rules'),
  bullet('R-P1: Primary buttons across all pages are identical. No page may have a "special" primary button with a different color, size, or treatment.'),
  bullet('R-P2: All card types (product, feature, blog, review) use the same border radius (--radius-lg: 12px). No card uses a different radius.'),
  bullet('R-P3: The header is identical on all pages. The only variation is the "minimized" variant inside the quote form. No page gets a "special" header.'),
  bullet('R-P4: The footer is identical on all pages. No page gets a "simplified" footer or a different footer layout.'),
  bullet('R-P5: All icons are from the Lucide library at the specified stroke-width (1.5px). No page may introduce icons from another library.'),
  spacer(),

  h2('17.6 The "Does This Belong?" Test'),
  body('Before adding any new element to any page, apply this test:'),
  numbered('Does this element use only the approved design tokens (colors, spacing, typography, radius, shadows)?'),
  numbered('Does this element use only approved component variants?'),
  numbered('If shown side-by-side with the homepage, would this look like it belongs to the same brand?'),
  numbered('If removed, would the page be clearer or less clear?'),
  body('If the answer to question 4 is "clearer" — remove the element. If the answer to any of questions 1–3 is "no" — revise the element before publishing.'),
  pageBreak(),
];

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 18 — ASSET PRODUCTION CHECKLIST
// ═══════════════════════════════════════════════════════════════════════════════
const buildAssetChecklist = () => [
  h1('18 · ASSET PRODUCTION CHECKLIST'),
  sectionLabel('Every Visual Asset Required Before Launch'),

  h2('18.1 Brand Assets'),
  tbl(
    ['Asset', 'Format', 'Sizes', 'Priority'],
    [2800, 1000, 2200, 1600, 1760],
    [
      ['Wordmark (dark version)', 'SVG', 'Single SVG (scalable)', 'P0 — Required before any development'],
      ['Wordmark (white version)', 'SVG', 'Single SVG', 'P0'],
      ['Monogram mark (dark)', 'SVG', 'Single SVG', 'P0'],
      ['Monogram mark (white)', 'SVG', 'Single SVG', 'P0'],
      ['Favicon (.ico)', 'ICO', '16×16, 32×32, 48×48 combined', 'P0'],
      ['Favicon (PNG)', 'PNG', '32×32, 192×192, 512×512', 'P0'],
      ['Apple Touch Icon', 'PNG', '180×180', 'P0'],
      ['Open Graph default image', 'PNG', '1200×630', 'P0 — shown in all social link previews'],
      ['Open Graph — patches', 'PNG', '1200×630', 'P1 — product category specific'],
      ['Open Graph — apparel', 'PNG', '1200×630', 'P1'],
      ['Open Graph — martial arts', 'PNG', '1200×630', 'P1'],
      ['Twitter/X card image', 'PNG', '1200×628', 'P1'],
    ]
  ),
  spacer(),

  h2('18.2 Hero Assets'),
  tbl(
    ['Asset', 'Description', 'Format', 'Priority'],
    [2800, 2800, 1000, 1360, 1400],
    [
      ['Hero background texture', 'SVG noise texture (feTurbulence, 2% opacity) — dark background', 'SVG inline', 'P0'],
      ['Hero linen texture', 'SVG noise texture (warm, 1% opacity) — light background for apparel hero', 'SVG inline', 'P0'],
      ['Hero gold rule', 'SVG horizontal rule, 2px, gold gradient, full-width', 'SVG inline', 'P0'],
      ['Patch card — Embroidered', 'CSS + SVG illustration (no photo needed for Phase 1)', 'CSS/SVG', 'P0'],
      ['Patch card — PVC', 'CSS + SVG', 'CSS/SVG', 'P0'],
      ['Patch card — Woven', 'CSS + SVG', 'CSS/SVG', 'P0'],
      ['Patch card — Chenille', 'CSS + SVG', 'CSS/SVG', 'P0'],
      ['Patch card — Printed', 'CSS + SVG', 'CSS/SVG', 'P0'],
      ['Patch card — Velcro', 'CSS + SVG', 'CSS/SVG', 'P0'],
      ['Apparel card — Hoodie', 'Ghost mannequin product photo', 'WebP', 'P0'],
      ['Apparel card — Polo', 'Ghost mannequin product photo', 'WebP', 'P0'],
      ['Apparel card — T-Shirt', 'Ghost mannequin product photo', 'WebP', 'P0'],
      ['Apparel card — Jersey', 'Ghost mannequin product photo', 'WebP', 'P0'],
      ['Apparel card — Crewneck', 'Ghost mannequin product photo', 'WebP', 'P0'],
      ['MA hero — BJJ Gi', 'On-model 3/4 angle, dark background removed', 'WebP', 'P0'],
      ['MA hero — Fabric close-up', 'Extreme macro of gi weave', 'WebP', 'P0'],
    ]
  ),
  spacer(),

  h2('18.3 Product Photography'),
  tbl(
    ['Product', 'Shots Required', 'Format', 'Priority'],
    [2400, 3200, 1000, 1760],
    [
      ['Embroidered patches', 'Overview (3/4), detail (macro thread), edge (merrowed border), hand scale', 'WebP', 'P0'],
      ['PVC patches', 'Overview (front), specular highlight shot, relief detail', 'WebP', 'P0'],
      ['Woven patches', 'Overhead overview, 3/4 angle, fine detail close-up', 'WebP', 'P0'],
      ['Chenille patches', 'Front overview, texture close-up, edge detail', 'WebP', 'P1'],
      ['Printed patches', 'Front overview, color accuracy shot, flat lay with multiple', 'WebP', 'P1'],
      ['Velcro patches', 'Front overview, velcro detail, on-bag lifestyle', 'WebP', 'P1'],
      ['Custom T-Shirts', 'Flat lay, ghost mannequin front, ghost mannequin back, on-model', 'WebP', 'P0'],
      ['Custom Hoodies', 'Ghost mannequin (hood up + hood down), flat lay, detail (pocket, zip)', 'WebP', 'P0'],
      ['Custom Jerseys', 'Ghost mannequin front, back, on-model team shot (group)', 'WebP', 'P1'],
      ['Custom Polo', 'Ghost mannequin front, on-model corporate context', 'WebP', 'P1'],
      ['BJJ Gi', 'On-model 3/4, front detail, fabric close-up, lapel detail, belt close-up', 'WebP', 'P0'],
      ['Karate Uniform', 'On-model, side stance, front, patch detail', 'WebP', 'P1'],
      ['Taekwondo Uniform', 'On-model, kick stance, front, back', 'WebP', 'P1'],
      ['Judo Uniform', 'On-model, gripping position, fabric', 'WebP', 'P1'],
      ['Embroidered Keychains', 'Flat lay with hand, detail close-up, on keys lifestyle', 'WebP', 'P1'],
      ['PVC Keychains', 'Flat lay, 3D detail, lifestyle', 'WebP', 'P2'],
      ['Scout Neckerchiefs', 'Flat lay, folded, on-neck', 'WebP', 'P1'],
      ['Stickers', 'Flat lay sheet, peeled on surface, lifestyle', 'WebP', 'P2'],
    ]
  ),
  spacer(),

  h2('18.4 SVG Illustrations & Icons'),
  tbl(
    ['Asset', 'Description', 'Format', 'Priority'],
    [2800, 2800, 1000, 1760],
    [
      ['Process step 1: Artwork', 'Designer reviewing artwork — isometric line art', 'SVG', 'P0'],
      ['Process step 2: Digitization', 'Stitch pattern on screen — isometric line art', 'SVG', 'P0'],
      ['Process step 3: Manufacturing', 'Embroidery machine — isometric line art', 'SVG', 'P0'],
      ['Process step 4: Shipping', 'Packaging + world map — isometric line art', 'SVG', 'P0'],
      ['Size guide illustration', 'Hand with ruler and patch at various sizes', 'SVG', 'P0'],
      ['Backing type: Iron-On', 'Iron icon — outline, 1.5px stroke', 'SVG', 'P0'],
      ['Backing type: Sew-On', 'Needle and thread — outline', 'SVG', 'P0'],
      ['Backing type: Velcro', 'Two layers joining — outline', 'SVG', 'P0'],
      ['Backing type: Peel & Stick', 'Sticker peeling — outline', 'SVG', 'P0'],
      ['Backing type: Safety Pin', 'Pin — outline', 'SVG', 'P0'],
      ['Backing type: Magnetic', 'Magnet — outline', 'SVG', 'P0'],
      ['Backing type: None', 'Cut edge — outline', 'SVG', 'P0'],
      ['Empty state: Gallery', '4×4 grid of blank photo squares with camera icons', 'SVG', 'P1'],
      ['Empty state: Search', 'Magnifying glass with swirl inside', 'SVG', 'P1'],
      ['Empty state: Saved designs', 'Blank canvas with hovering pencil', 'SVG', 'P1'],
      ['Empty state: Quotes', 'Blank clipboard with pencil', 'SVG', 'P1'],
      ['Empty state: 404', 'Circular patch with "404" stitched in', 'SVG', 'P0'],
      ['Empty state: 500', 'Broken circle with wrench', 'SVG', 'P0'],
      ['Empty state: Offline', 'WiFi icon with slash', 'SVG', 'P1'],
      ['Country selector flags', 'Flag emoji SVGs for top 6 countries', 'SVG (or emoji)', 'P1'],
    ]
  ),
  spacer(),

  h2('18.5 Manufacturing & Lifestyle Photography'),
  tbl(
    ['Asset', 'Description', 'Priority'],
    [2800, 4200, 1760, 1600],
    [
      ['Embroidery machine in operation', 'Thread in motion, top-down or angled. Machine fills 80% of frame.', 'P1'],
      ['Quality inspection', 'Human hands holding patch against light, examining stitching', 'P0'],
      ['QC comparison', 'Patch next to printed proof on a light box, hands visible', 'P1'],
      ['Packaging', 'Finished patches arranged in order packaging, ready to ship', 'P1'],
      ['Team member sewing', 'Craftsperson at work, documentary style, natural light', 'P2'],
      ['Production floor wide', 'Wide establishing shot of production space (if available)', 'P2'],
      ['Lifestyle: patches on jacket', 'Leather jacket with multiple embroidered patches, moody light', 'P0'],
      ['Lifestyle: patches on bag', 'Canvas bag with patches, urban environment', 'P1'],
      ['Lifestyle: team in custom jerseys', 'Sports team in custom jerseys, authentic team setting', 'P1'],
      ['Lifestyle: corporate polo', 'Professional in custom polo, office context', 'P1'],
      ['Lifestyle: BJJ sparring', 'Two practitioners training, gi detail visible', 'P1'],
      ['Lifestyle: patches on military vest', 'Tactical vest with custom patches (replica/film gear only)', 'P2'],
    ]
  ),
  spacer(),

  h2('18.6 Social Media Assets'),
  tbl(
    ['Asset', 'Dimensions', 'Format', 'Priority'],
    [2800, 1600, 1000, 1960],
    [
      ['Instagram profile photo', '400×400px minimum', 'PNG', 'P0 (launch)'],
      ['Instagram post template — product feature', '1080×1080px', 'SVG template', 'P1'],
      ['Instagram story template', '1080×1920px', 'SVG template', 'P1'],
      ['Facebook cover', '820×312px', 'PNG', 'P1'],
      ['Facebook profile', '170×170px', 'PNG', 'P1'],
      ['LinkedIn company cover', '1128×191px', 'PNG', 'P1'],
      ['LinkedIn company logo', '300×300px', 'PNG', 'P0 (launch)'],
      ['Pinterest profile', '165×165px', 'PNG', 'P2'],
      ['TikTok profile', '20MB max, 1:1 ratio', 'MP4 loop or PNG', 'P2'],
    ]
  ),
  spacer(),

  h2('18.7 Lottie Animations (Phase 2)'),
  tbl(
    ['Asset', 'Description', 'Trigger', 'Priority'],
    [2400, 2800, 2000, 1160, 1000],
    [
      ['Quote submission success', 'Animated checkmark in a circle — draws then pulses green', 'Quote form submission', 'P0 (Phase 2)'],
      ['Upload complete', 'Small checkmark for individual file upload completion', 'File upload success', 'P1 (Phase 2)'],
      ['AI generating', 'Abstract thread-weaving animation for AI loading state', 'AI Design Studio generating', 'P1 (Phase 2)'],
      ['Loading indicator', 'Branded spinner (Tam "T" monogram rotating)', 'Long page loads', 'P2'],
    ]
  ),
  spacer(),

  h2('18.8 Prelaunch Asset Completion Gate'),
  body('No page is considered ready for launch until all P0 assets for that page are completed, correctly named, correctly sized, and in WebP/SVG format. This is a hard gate — not a soft guideline.'),
  tbl(
    ['Page', 'P0 Asset Gate Conditions'],
    [2000, 7360],
    [
      ['Homepage', 'All 3 hero backgrounds (CSS), 3 hero visual assets (CSS + at minimum placeholder patch cards), trust bar icons, all 4 featured product photography thumbnails, logo assets, Open Graph image'],
      ['Product pages (all)', 'Primary product photo (overview), 1 detail/macro photo per product, all backing type SVG icons, size guide SVG illustration, Open Graph image'],
      ['Martial Arts pages', 'Hero product photos for all 4 uniform types, fabric close-up macro, on-model photography'],
      ['Quote form', 'All backing type SVG icons, size guide SVG, all process illustration SVGs'],
      ['About page', 'At minimum 3 manufacturing photography images, team photos if applicable'],
      ['404 page', 'Patch-with-404 SVG illustration'],
      ['All pages', 'Favicon set (ICO + PNG), brand logo SVGs (dark + white), all Lucide icons (already in library)'],
    ]
  ),
  spacer(),
  divider(),
  new Paragraph({
    children: [new TextRun({ text: ' ', size: 36 })], spacing: { before: 240, after: 0 },
  }),
  new Paragraph({
    children: [
      new TextRun({ text: 'TAM CUSTOM PATCHES', font: 'Inter', bold: true, size: 20, color: C.accent }),
      new TextRun({ text: '  ·  Visual Design Bible v3.0  ·  All 18 Sections Complete', font: 'Inter', size: 20, color: C.muted }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { before: 160, after: 80 },
  }),
  new Paragraph({
    children: [new TextRun({ text: 'This document completes the three-volume Tam Custom Patches Website Specification.', font: 'Inter', size: 18, color: C.muted, italic: true })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
  }),
  new Paragraph({
    children: [new TextRun({ text: 'V1.0: Architecture & Sitemap  ·  V2.0: Components & Systems  ·  V3.0: Visual Design & Art Direction', font: 'Inter', size: 18, color: C.muted, italic: true })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 0 },
  }),
];

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT ASSEMBLY
// ═══════════════════════════════════════════════════════════════════════════════
const doc = new Document({
  title: 'Tam Custom Patches — Visual Design Bible v3.0 (Part 2)',
  styles: {
    default: { document: { run: { font: 'Inter', size: 22, color: C.ink } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: 'Inter', size: 40, bold: true, color: C.white }, paragraph: { spacing: { before: 480, after: 240 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: 'Inter', size: 28, bold: true, color: C.accentDk }, paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: 'Inter', size: 24, bold: true, color: C.ink }, paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 2 } },
      { id: 'Heading4', name: 'Heading 4', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: 'Inter', size: 21, bold: true, color: C.muted }, paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 3 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }, { level: 1, format: LevelFormat.BULLET, text: '◦', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1080, hanging: 360 } } } }] },
      { reference: 'numbers', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
    headers: {
      default: new Header({ children: [new Paragraph({ children: [new TextRun({ text: 'Tam Custom Patches  ·  Visual Design Bible v3.0  ·  Part 2 of 2', font: 'Inter', size: 18, color: C.muted }), new TextRun({ text: '\t', font: 'Inter', size: 18 }), new TextRun({ text: 'Confidential', font: 'Inter', size: 18, color: C.muted })], tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }], border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: C.border, space: 4 } } })] }),
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ children: [new TextRun({ text: 'Page ', font: 'Inter', size: 18, color: C.muted }), new TextRun({ children: [PageNumber.CURRENT], font: 'Inter', size: 18, color: C.muted }), new TextRun({ text: '\t', font: 'Inter', size: 18 }), new TextRun({ text: 'tamcustompatches.com', font: 'Inter', size: 18, color: C.muted })], tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }], border: { top: { style: BorderStyle.SINGLE, size: 2, color: C.border, space: 4 } } })] }),
    },
    children: [
      ...buildEmptyStates(),
      ...buildMobileExperience(),
      ...buildTabletExperience(),
      ...buildDesktopExperience(),
      ...buildAccessibilityVisual(),
      ...buildPremiumDetails(),
      ...buildInspirationReferences(),
      ...buildConsistencyRules(),
      ...buildAssetChecklist(),
    ],
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('/home/claude/tam-v3/Tam_V3_Part2.docx', buf);
  console.log('✅ Part 2 written.');
}).catch(err => { console.error(err); process.exit(1); });