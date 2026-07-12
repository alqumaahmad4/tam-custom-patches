const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, TabStopType, TabStopPosition,
  LevelFormat
} = require('docx');
const fs = require('fs');

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  primary:   '0A0A0A',
  accent:    '1A56DB',
  accentDk:  '1E429F',
  gold:      'B8860B',
  surface:   'F8FAFC',
  border:    'E2E8F0',
  muted:     '64748B',
  white:     'FFFFFF',
  dark:      '1A1A2E',
  tagBg:     'DBEAFE',
  sectionBg: 'F1F5F9',
  success:   '16A34A',
  error:     'DC2626',
  warning:   'D97706',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const brd = { style: BorderStyle.SINGLE, size: 1, color: C.border };
const borders = { top: brd, bottom: brd, left: brd, right: brd };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, font: 'Inter', bold: true, size: 38, color: C.white })],
    shading: { fill: C.dark, type: ShadingType.CLEAR },
    spacing: { before: 480, after: 240 },
    indent: { left: 360, right: 360 },
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, font: 'Inter', bold: true, size: 28, color: C.accentDk })],
    spacing: { before: 360, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.accent, space: 4 } },
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text, font: 'Inter', bold: true, size: 24, color: C.primary })],
    spacing: { before: 280, after: 120 },
  });
}

function h4(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_4,
    children: [new TextRun({ text, font: 'Inter', bold: true, size: 21, color: C.muted })],
    spacing: { before: 200, after: 80 },
  });
}

function body(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: 'Inter', size: 22, color: C.primary })],
    spacing: { after: 120 },
  });
}

function note(text) {
  return new Paragraph({
    children: [
      new TextRun({ text: 'NOTE  ', font: 'Inter', bold: true, size: 20, color: C.accentDk }),
      new TextRun({ text, font: 'Inter', size: 20, color: C.accentDk }),
    ],
    shading: { fill: C.tagBg, type: ShadingType.CLEAR },
    indent: { left: 360, right: 360 },
    spacing: { before: 80, after: 160 },
  });
}

function code(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: 'Courier New', size: 18, color: C.accentDk })],
    shading: { fill: 'F0F4FF', type: ShadingType.CLEAR },
    indent: { left: 360, right: 360 },
    spacing: { before: 60, after: 60 },
  });
}

function sectionLabel(text) {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), font: 'Inter', bold: true, size: 18, color: C.accent, characterSpacing: 80 })],
    spacing: { before: 240, after: 80 },
  });
}

function bullet(text, level = 0, bold = false) {
  return new Paragraph({
    numbering: { reference: 'bullets', level },
    children: [new TextRun({ text, font: 'Inter', size: 22, bold })],
    spacing: { after: 80 },
  });
}

function numbered(text, level = 0) {
  return new Paragraph({
    numbering: { reference: 'numbers', level },
    children: [new TextRun({ text, font: 'Inter', size: 22 })],
    spacing: { after: 80 },
  });
}

function spacer() {
  return new Paragraph({ children: [], spacing: { after: 120 } });
}

function divider() {
  return new Paragraph({
    children: [],
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.border, space: 1 } },
    spacing: { before: 160, after: 160 },
  });
}

function pageBreak() {
  return new Paragraph({ children: [new TextRun({ break: 1 })], spacing: { after: 0 } });
}

// ─── Table helpers ────────────────────────────────────────────────────────────
function cell(text, { w = 2400, bg, bold, color } = {}) {
  return new TableCell({
    borders,
    width: { size: w, type: WidthType.DXA },
    shading: bg ? { fill: bg, type: ShadingType.CLEAR } : undefined,
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      children: [new TextRun({ text, font: 'Inter', size: 20, bold: bold || false, color: color || C.primary })],
    })],
  });
}

function hdrRow(labels, widths) {
  return new TableRow({
    tableHeader: true,
    children: labels.map((l, i) => new TableCell({
      borders,
      width: { size: widths[i], type: WidthType.DXA },
      shading: { fill: C.dark, type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 140, right: 140 },
      children: [new Paragraph({
        children: [new TextRun({ text: l, font: 'Inter', size: 20, bold: true, color: C.white })],
      })],
    })),
  });
}

function tbl(headers, widths, rows) {
  return new Table({
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      hdrRow(headers, widths),
      ...rows.map(r => new TableRow({ children: r.map((c, i) => cell(c, { w: widths[i] })) })),
    ],
  });
}

function kvTbl(pairs, w1 = 2800, w2 = 6560) {
  return new Table({
    width: { size: w1 + w2, type: WidthType.DXA },
    columnWidths: [w1, w2],
    rows: pairs.map(([k, v]) => new TableRow({
      children: [
        cell(k, { w: w1, bold: true, bg: C.sectionBg }),
        cell(v, { w: w2 }),
      ],
    })),
  });
}

// ─── Cover block ─────────────────────────────────────────────────────────────
function coverBlock() {
  return [
    new Paragraph({
      children: [new TextRun({ text: 'TAM CUSTOM PATCHES', font: 'Inter', bold: true, size: 72, color: C.white })],
      shading: { fill: C.dark, type: ShadingType.CLEAR },
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 0 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Enterprise Website Product Specification  —  Version 2.0', font: 'Inter', size: 32, color: C.accent })],
      shading: { fill: C.dark, type: ShadingType.CLEAR },
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 0 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Sections 12 – 19  ·  Extension of Version 1.0  ·  Codex-Ready Handoff', font: 'Inter', size: 22, color: C.muted })],
      shading: { fill: C.dark, type: ShadingType.CLEAR },
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 0 },
    }),
    new Paragraph({ children: [new TextRun({ text: ' ', size: 48 })], shading: { fill: C.dark, type: ShadingType.CLEAR }, spacing: { before: 0, after: 0 } }),
    pageBreak(),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 12 — COMPLETE DESIGN BIBLE
// ═══════════════════════════════════════════════════════════════════════════════

function buildDesignBible() {
  return [
    h1('12 · COMPLETE DESIGN BIBLE'),
    sectionLabel('Enterprise Design System — Figma-Grade Documentation'),

    // ── 12.1 Brand Personality ──────────────────────────────────────────────
    h2('12.1 Brand Personality'),
    body('Tam Custom Patches occupies a rare position: a global manufacturing company that operates with the confidence and polish of a premium consumer brand. The brand personality is built on five core traits that must permeate every pixel, word, and interaction.'),
    spacer(),
    tbl(
      ['Trait', 'Definition', 'In Practice'],
      [1800, 2800, 4760],
      [
        ['Precise', 'Every stitch is intentional. Every detail is considered.', 'Typography is never approximate. Spacing follows an 8pt grid. No lorem ipsum ever ships.'],
        ['Premium', 'Quality is the product. Price is secondary.', 'Dark hero backgrounds, gold accents, generous whitespace, photography that looks like editorial fashion.'],
        ['Confident', 'We do not explain ourselves. We demonstrate.', 'Short, declarative headlines. No hedging language. Trust signals shown, not told.'],
        ['Human', 'Behind every patch is a real team that cares.', 'Warm testimonial copy, behind-the-scenes photography, real reviewer names and faces.'],
        ['Global', 'We manufacture and ship everywhere.', 'Country selector in header, worldwide shipping trust signal, international testimonials.'],
      ]
    ),
    spacer(),

    // ── 12.2 Brand Voice ──────────────────────────────────────────────────────
    h2('12.2 Brand Voice & Tone Guidelines'),
    body('Brand voice is fixed. Tone shifts by context — more formal in quote confirmation emails, warmer in social-facing copy.'),
    spacer(),
    h3('Voice Principles'),
    bullet('Declarative, not explanatory  —  "Ships worldwide in 7–14 days." Not "We offer worldwide shipping with typical delivery in 7–14 days."'),
    bullet('Specific, not vague  —  "150+ thread colors." Not "a wide range of colors."'),
    bullet('Active, not passive  —  "We manufacture every patch." Not "Every patch is manufactured."'),
    bullet('Direct, not flowery  —  "Get a Quote." Not "Embark on your patch journey."'),
    bullet('Humble confidence  —  "Trusted by 5,000+ brands." Not "The world\'s greatest patch maker."'),
    spacer(),
    h3('Tone by Context'),
    tbl(
      ['Context', 'Tone', 'Example'],
      [2000, 2000, 5360],
      [
        ['Hero headlines', 'Bold, clean, minimal', '"Custom Patches Made Easy"'],
        ['Product descriptions', 'Precise, informative', '"100% colorfast thread. Machine washable. 7–14 day production."'],
        ['Quote form labels', 'Friendly, clear', '"How many patches do you need?"'],
        ['Error messages', 'Calm, helpful', '"That email doesn\'t look right — try again."'],
        ['Success messages', 'Warm, affirming', '"Your quote is on its way. We\'ll be in touch within 24 hours."'],
        ['FAQ answers', 'Conversational, precise', '"Yes — we accept orders from 25 units."'],
        ['Email notifications', 'Professional, warm', '"Hi [Name], your quote request has been received."'],
        ['Trust badges', 'Confident, factual', '"Free Artwork Revisions — Unlimited"'],
      ]
    ),
    spacer(),

    // ── 12.3 Design Philosophy ───────────────────────────────────────────────
    h2('12.3 Design Philosophy'),
    body('The guiding principle is "restraint in service of clarity." Every visual decision must pass a three-question test:'),
    numbered('Does this help the visitor understand what to do next?'),
    numbered('Does this build trust?'),
    numbered('Does this make the brand feel more premium?'),
    body('If the answer to all three is no, the element is removed.'),
    spacer(),
    h3('The Four Design Laws'),
    kvTbl([
      ['Law 1: Nothing without purpose',   'Every element earns its place. No decorative dividers, no stock icon borders, no filler text. If it does not inform, guide, or convert — it is removed.'],
      ['Law 2: Whitespace is active',       'Empty space is not absence. It is breathing room that creates hierarchy, focus, and luxury. Sections use 96px vertical padding minimum.'],
      ['Law 3: Typography first',           'Before any color or imagery is added, the typographic hierarchy must be legible, beautiful, and complete on its own. Good design reads in grayscale.'],
      ['Law 4: Motion with meaning',        'Animations communicate. A card that lifts on hover signals interactivity. A page that fades in signals arrival. Decorative motion is never added.'],
    ]),
    spacer(),

    // ── 12.4 Visual Identity ─────────────────────────────────────────────────
    h2('12.4 Visual Identity'),
    h3('Logo System'),
    body('The Tam Custom Patches logo consists of two elements: the wordmark and the monogram mark. Rules:'),
    bullet('Wordmark: "TAM" in Inter Bold, tracked at +5%, followed by "CUSTOM PATCHES" in Inter Medium at 60% of the wordmark size'),
    bullet('Monogram: The letter "T" in a rounded square container — used as favicon, app icon, and social profile avatar'),
    bullet('Minimum clear space: equal to the height of the capital "T" in the wordmark on all four sides'),
    bullet('Minimum size: 120px wide (wordmark) / 32px wide (monogram)'),
    bullet('Approved on: white, light gray (#F8FAFC), dark (#1A1A2E), black'),
    bullet('Never: stretch, rotate, add drop shadow, change color, place on busy backgrounds'),
    spacer(),

    // ── 12.5 Color System ─────────────────────────────────────────────────────
    h2('12.5 Color System & Psychology'),
    h3('Primary Palette'),
    tbl(
      ['Token', 'Hex', 'RGB', 'Usage', 'Psychology'],
      [2200, 1200, 1600, 2000, 2360],
      [
        ['--color-ink', '#0A0A0A', '10,10,10', 'Primary text, headings', 'Authority, precision, craft'],
        ['--color-surface', '#FFFFFF', '255,255,255', 'Page background, cards', 'Clarity, cleanliness'],
        ['--color-surface-alt', '#F8FAFC', '248,250,252', 'Alt sections, inputs', 'Softness, calm'],
        ['--color-accent', '#1A56DB', '26,86,219', 'CTAs, links, focus', 'Trust, professionalism'],
        ['--color-accent-dark', '#1E429F', '30,66,159', 'CTA hover, headings', 'Depth, confidence'],
        ['--color-gold', '#B8860B', '184,134,11', 'Premium badges, MA section', 'Prestige, quality, martial excellence'],
        ['--color-dark-bg', '#1A1A2E', '26,26,46', 'Hero bg, dark sections', 'Luxury, focus, premium'],
      ]
    ),
    spacer(),
    h3('Semantic Palette'),
    tbl(
      ['Token', 'Hex', 'Usage'],
      [2800, 1400, 5160],
      [
        ['--color-success', '#16A34A', 'Success states, confirmations, upload complete'],
        ['--color-success-light', '#DCFCE7', 'Success backgrounds, banners'],
        ['--color-error', '#DC2626', 'Error states, validation messages'],
        ['--color-error-light', '#FEE2E2', 'Error backgrounds'],
        ['--color-warning', '#D97706', 'Warning states, file size notices'],
        ['--color-warning-light', '#FEF3C7', 'Warning backgrounds'],
        ['--color-info', '#0284C7', 'Informational notices'],
        ['--color-info-light', '#E0F2FE', 'Info backgrounds'],
        ['--color-border', '#E2E8F0', 'Card borders, dividers, input borders'],
        ['--color-border-focus', '#1A56DB', 'Input focus ring color'],
        ['--color-muted', '#64748B', 'Secondary text, placeholders, captions'],
        ['--color-muted-light', '#94A3B8', 'Disabled text, very secondary content'],
      ]
    ),
    spacer(),
    h3('Color Usage Rules'),
    bullet('Never use more than 3 colors in a single UI section (excluding white and surface-alt)'),
    bullet('The gold accent is used ONLY in the martial arts category and for premium achievement badges'),
    bullet('Accent blue is used ONLY for interactive elements — CTAs, links, focus rings, and active states'),
    bullet('Dark background (#1A1A2E) is used ONLY for the hero section and high-emphasis CTA banners'),
    bullet('All color combinations must meet WCAG AA contrast (4.5:1 for body, 3:1 for large text)'),
    spacer(),

    // ── 12.6 Typography ───────────────────────────────────────────────────────
    h2('12.6 Typography Hierarchy'),
    h3('Font Stack'),
    kvTbl([
      ['Primary typeface',  'Inter — loaded via next/font/google with latin subset. Zero layout shift.'],
      ['Monospace',         'JetBrains Mono — used exclusively for code snippets and file names in the AI Design Studio.'],
      ['System fallback',   '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'],
      ['Font loading',      'display: swap on all fonts. Subset to latin characters only for Phase 1.'],
    ]),
    spacer(),
    h3('Type Scale (T-shirt sizing mapped to rem)'),
    tbl(
      ['Name', 'Size', 'Line Height', 'Weight', 'Tracking', 'Usage'],
      [1200, 1000, 1200, 1000, 1000, 3960],
      [
        ['--text-2xs', '11px', '1.4', '400', '+0.04em', 'Legal text, fine print only'],
        ['--text-xs', '12px', '1.4', '400/500', '+0.03em', 'Labels, captions, badge text'],
        ['--text-sm', '14px', '1.5', '400/500', '+0.01em', 'Secondary body, form labels, metadata'],
        ['--text-base', '16px', '1.625', '400', '0', 'Primary body copy — default'],
        ['--text-lg', '18px', '1.6', '400/500', '-0.01em', 'Intro paragraphs, large body'],
        ['--text-xl', '20px', '1.5', '500/600', '-0.01em', 'Card headings, subheadings'],
        ['--text-2xl', '24px', '1.4', '600/700', '-0.02em', 'Section subheadings (H3)'],
        ['--text-3xl', '30px', '1.3', '700', '-0.02em', 'Section headings (H2)'],
        ['--text-4xl', '36px', '1.2', '700', '-0.03em', 'Page headings (H1 — desktop)'],
        ['--text-5xl', '48px', '1.1', '700/800', '-0.04em', 'Hero headlines (medium)'],
        ['--text-6xl', '60px', '1.05', '800', '-0.05em', 'Hero display (large desktop)'],
        ['--text-7xl', '72px', '1.0', '800', '-0.06em', 'Hero display (max — wide screens only)'],
      ]
    ),
    spacer(),
    h3('Responsive Type Scaling Rules'),
    body('All display and heading sizes scale fluidly using CSS clamp(). Never use viewport-based text at small sizes — only at 36px and above.'),
    code('--text-hero: clamp(2.5rem, 5vw + 1rem, 4.5rem);'),
    code('--text-h1:   clamp(2rem,   3vw + 1rem, 2.75rem);'),
    code('--text-h2:   clamp(1.5rem, 2vw + 0.75rem, 2rem);'),
    spacer(),
    h3('Font Pairing Rationale'),
    body('Inter is the sole typeface. No decorative or serif font is used. This is intentional: a single typeface at different weights, sizes, and tracking creates sufficient hierarchy while maintaining a clean, manufacturing-grade precision aesthetic. The typographic system is inspired by Linear and Stripe — both of which achieve extraordinary visual richness with Inter alone.'),
    spacer(),

    // ── 12.7 Grid & Layout ───────────────────────────────────────────────────
    h2('12.7 Grid System & Responsive Layout'),
    h3('Container System'),
    tbl(
      ['Container', 'Max Width', 'Horizontal Padding', 'Usage'],
      [1800, 1400, 2000, 4160],
      [
        ['--container-xs', '480px', '16px', 'Mobile modals, narrow forms'],
        ['--container-sm', '640px', '24px', 'Blog content, legal pages'],
        ['--container-md', '768px', 'N/A', 'Breakpoint only'],
        ['--container-lg', '1024px', '32px', 'Compact layouts'],
        ['--container-xl', '1280px', '40px', 'Primary content container (default)'],
        ['--container-2xl', '1440px', '48px', 'Wide hero, full-bleed sections'],
        ['--container-full', '100%', '0px', 'Background sections, hero full-bleed'],
      ]
    ),
    spacer(),
    h3('Column Grid'),
    body('The site uses a 12-column grid for desktop, 8-column for tablet, and 4-column for mobile. Column gaps and gutters follow the 8pt spacing system.'),
    tbl(
      ['Breakpoint', 'Columns', 'Gutter', 'Margin'],
      [2000, 1200, 1200, 2000, 3000],
      [
        ['Mobile  (< 640px)', '4', '16px', '16px'],
        ['Tablet  (640–1023px)', '8', '24px', '24px'],
        ['Desktop (1024–1279px)', '12', '24px', '32px'],
        ['Wide    (1280–1439px)', '12', '32px', '40px'],
        ['XL      (≥ 1440px)', '12', '40px', '48px'],
      ]
    ),
    spacer(),

    // ── 12.8 Spacing System ──────────────────────────────────────────────────
    h2('12.8 Eight-Point Spacing System'),
    body('Every margin, padding, gap, and size value is a multiple of 8px. Exceptions (4px, 2px) exist only for fine details like border widths and icon internal padding.'),
    tbl(
      ['Token', 'Value', 'Usage'],
      [1600, 900, 6860],
      [
        ['--space-1', '4px', 'Icon internal padding, fine detail spacing only'],
        ['--space-2', '8px', 'Tight spacing: chip padding, tag gaps, inline badge margins'],
        ['--space-3', '12px', 'Compact spacing: input internal padding (vertical), small component gaps'],
        ['--space-4', '16px', 'Base spacing: standard internal padding, small gaps'],
        ['--space-5', '20px', 'Medium spacing: card internal gaps'],
        ['--space-6', '24px', 'Standard component padding: button padding, card padding top/bottom'],
        ['--space-8', '32px', 'Section element spacing, card padding'],
        ['--space-10', '40px', 'Large component spacing'],
        ['--space-12', '48px', 'Section internal top/bottom padding (compact)'],
        ['--space-16', '64px', 'Section spacing (mobile)'],
        ['--space-20', '80px', 'Section spacing (tablet)'],
        ['--space-24', '96px', 'Section spacing (desktop) — the standard section vertical rhythm'],
        ['--space-32', '128px', 'Hero internal spacing, large section separators'],
        ['--space-40', '160px', 'Homepage hero content spacing'],
        ['--space-48', '192px', 'Maximum hero vertical padding'],
      ]
    ),
    spacer(),

    // ── 12.9 Border Radius System ────────────────────────────────────────────
    h2('12.9 Border Radius System'),
    body('Radius values establish a personality. Sharp corners feel technical and cold. Large radii feel casual. Tam uses a measured mid-range that reads as modern and premium without feeling playful.'),
    tbl(
      ['Token', 'Value', 'Usage'],
      [2000, 900, 6460],
      [
        ['--radius-none', '0px', 'Full-bleed images, background sections — intentionally edgy'],
        ['--radius-sm', '4px', 'Small badges, code chips, checkbox'],
        ['--radius-md', '8px', 'Buttons, input fields, small cards'],
        ['--radius-lg', '12px', 'Standard cards, product cards, gallery thumbnails'],
        ['--radius-xl', '16px', 'Large cards, feature cards, modal dialogs'],
        ['--radius-2xl', '20px', 'Hero cards, AI preview panels'],
        ['--radius-3xl', '24px', 'Hero floating cards (3D patch cards in hero)'],
        ['--radius-full', '9999px', 'Pills, avatar bubbles, toggle switches'],
      ]
    ),
    spacer(),

    // ── 12.10 Shadow System ───────────────────────────────────────────────────
    h2('12.10 Shadow System'),
    body('All shadows use a single dark ink color at low opacity. No colored shadows except for focus rings (which use the accent color). The shadow system creates three elevation levels: resting, raised, and floating.'),
    tbl(
      ['Token', 'CSS Value', 'Usage'],
      [1800, 4000, 3560],
      [
        ['--shadow-xs', '0 1px 2px rgba(0,0,0,0.04)', 'Subtle border alternative for inputs on white backgrounds'],
        ['--shadow-sm', '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)', 'Resting state for cards, buttons'],
        ['--shadow-md', '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04)', 'Elevated cards on hover'],
        ['--shadow-lg', '0 10px 15px rgba(0,0,0,0.07), 0 4px 6px rgba(0,0,0,0.04)', 'Dropdowns, drawers, modals resting'],
        ['--shadow-xl', '0 20px 25px rgba(0,0,0,0.08), 0 8px 10px rgba(0,0,0,0.04)', 'Modals on dark overlay'],
        ['--shadow-2xl', '0 25px 50px rgba(0,0,0,0.16)', 'Hero floating cards, premium showcase elements'],
        ['--shadow-premium', '0 32px 64px rgba(0,0,0,0.22)', '3D patch cards in hero slider — the "wow" shadow'],
        ['--shadow-focus', '0 0 0 3px rgba(26,86,219,0.3)', 'Focus ring — always 3px with 30% opacity accent blue'],
        ['--shadow-inset', 'inset 0 2px 4px rgba(0,0,0,0.06)', 'Input fields on active/focused state background'],
      ]
    ),
    spacer(),

    // ── 12.11 Glassmorphism ───────────────────────────────────────────────────
    h2('12.11 Glassmorphism — Usage Rules'),
    body('Glassmorphism is used sparingly and only where it reinforces depth over a rich background. It is NEVER applied to interactive form elements, primary CTAs, or text containers.'),
    h3('Permitted Usage'),
    bullet('Hero floating stat cards overlaid on the dark hero background'),
    bullet('Trust ticker strip below the hero (light frosted glass over an image background)'),
    bullet('Navigation mega menu when positioned over hero imagery'),
    bullet('AI Preview panel background when showing a design over a dark canvas'),
    spacer(),
    h3('Glass Card Recipe'),
    code('background: rgba(255, 255, 255, 0.08);'),
    code('backdrop-filter: blur(12px) saturate(180%);'),
    code('-webkit-backdrop-filter: blur(12px) saturate(180%);'),
    code('border: 1px solid rgba(255, 255, 255, 0.12);'),
    code('border-radius: var(--radius-xl);'),
    code('box-shadow: 0 8px 32px rgba(0, 0, 0, 0.24);'),
    spacer(),
    note('Always test glassmorphism performance. backdrop-filter forces GPU compositing. Never apply it to more than 4 elements on a single page. Provide a solid fallback for browsers without backdrop-filter support.'),
    spacer(),

    // ── 12.12 Card Styles ──────────────────────────────────────────────────────
    h2('12.12 Card Styles'),
    tbl(
      ['Card Type', 'Background', 'Border', 'Radius', 'Shadow', 'Hover State'],
      [1800, 1600, 1600, 1200, 1400, 1760],
      [
        ['Product Card', 'white', '1px border', '--radius-lg', '--shadow-sm', 'shadow-md + translateY(-2px)'],
        ['Category Card', 'image fill', 'none', '--radius-lg', 'none (image card)', 'overlay darkens, arrow appears'],
        ['Industry Card', 'surface-alt', '1px border', '--radius-md', '--shadow-sm', 'border-color → accent, shadow-md'],
        ['Review Card', 'white', '1px border', '--radius-lg', '--shadow-sm', 'shadow-md'],
        ['Testimonial Card', 'dark-bg', 'none', '--radius-xl', 'none', 'subtle brightness increase'],
        ['Feature Card', 'white', '1px border', '--radius-xl', '--shadow-sm', 'shadow-lg + translateY(-4px)'],
        ['Blog Card', 'white', 'none', '--radius-lg', '--shadow-sm', 'shadow-md, image scales 1.03x'],
        ['Hero Float Card', 'glass', 'glass border', '--radius-3xl', '--shadow-premium', '3D Y-axis tilt on mouse move'],
        ['Stat Card', 'surface-alt', '1px border', '--radius-md', 'none', 'none (static element)'],
        ['AI Preview Card', 'dark canvas', 'none', '--radius-2xl', '--shadow-xl', 'none (display only)'],
      ]
    ),
    spacer(),

    // ── 12.13 Image Styles ────────────────────────────────────────────────────
    h2('12.13 Image Styles & Photography Direction'),
    h3('Photography Aesthetic'),
    body('All photography must feel intentional, premium, and craft-focused. No stock photography that looks generic. Product photography must communicate quality at a glance.'),
    spacer(),
    h3('Product Photography Standards'),
    kvTbl([
      ['Background',        'Clean white (#FFFFFF) for primary shots. Soft gray (#F4F4F4) for contextual lifestyle shots. Dark backgrounds for hero presentation.'],
      ['Lighting',          'Soft, directional light from the upper-left. A fill light at 50% intensity from the lower-right. No harsh shadows. Highlights show texture.'],
      ['Angle',             'Patches: 3/4 angle at 30° from vertical, slight downward tilt to show depth. Apparel: front-facing or slight 3/4, worn on model or flat lay.'],
      ['Texture detail',    'All embroidered product shots must include a close-up detail shot at 2–4x magnification showing thread quality.'],
      ['Size reference',    'At least one image per product includes a human hand (adult, clean, neutral skin tone) for size reference.'],
      ['Resolution',        'Minimum 2400×2400px for product shots. 3000×2000px for lifestyle. All exported at 85% quality WebP.'],
      ['Color accuracy',    'Color-calibrated to sRGB profile. Thread colors in images must match the color chart within visual tolerance.'],
      ['Consistency',       'All product card thumbnails cropped to 4:3 ratio. All hero images cropped to 16:9. All gallery images 1:1 or 4:3.'],
    ]),
    spacer(),
    h3('3D Rendering Style (Hero Patch Cards)'),
    body('The hero slider\'s floating patch cards are CSS + Framer Motion 3D transforms, NOT pre-rendered images. This is critical for performance and interactivity.'),
    kvTbl([
      ['Perspective',       '800px CSS perspective on the parent container'],
      ['Z-depth',           'Cards staggered at z(0), z(40px), z(80px) to create a stacked deck effect'],
      ['Lighting simulation', 'A subtle radial gradient overlay on each card mimics studio lighting: transparent center, 8% opacity dark at edges'],
      ['Texture overlay',   'A 2px tiled SVG noise texture at 3% opacity creates fabric/embroidery feel on embroidered patch cards'],
      ['Gold trim',         'A 2px CSS border with a linear gradient (gold → lighter gold → gold) simulates a merrowed border on embroidered patches'],
      ['Specular highlight', 'A small white radial gradient at 12% opacity, positioned top-left of each card, simulates light catching the thread'],
      ['Rotation on hover', 'On mouse move over parent: rotateY up to ±8°, rotateX up to ±4°. Spring animation: stiffness 120, damping 20.'],
      ['Auto-rotation',     'When no mouse hover: cards slowly drift ±3° on Y-axis, looping with a 6s period and easeInOut curve'],
    ]),
    spacer(),

    // ── 12.14 Iconography ─────────────────────────────────────────────────────
    h2('12.14 Iconography Rules'),
    kvTbl([
      ['Library',           'Lucide React (v0.383.0 — locked version). No mixing of icon libraries.'],
      ['Size scale',        '16px (xs), 20px (sm — default), 24px (md), 32px (lg), 40px (xl). Always use the closest size token, never arbitrary sizes.'],
      ['Stroke width',      '1.5px across all icons. Never change stroke width per instance.'],
      ['Color',             'Icon color always inherits from text color (currentColor) unless it is a standalone decorative icon.'],
      ['Semantic icons',    'Icons that communicate meaning must always have an aria-label or be accompanied by visible text. Never icon-only interactive elements without a label.'],
      ['Never',             'Never use emoji as UI icons. Never mix Lucide with Font Awesome, Heroicons, or any other library. Never rasterize vector icons.'],
      ['Animation',         'Icon-only buttons may animate their icon on hover: subtle scale(1.1) or a 15° rotation. No bounce, no spin unless it communicates action (e.g. refresh icon on "Regenerate" button).'],
    ]),
    spacer(),

    // ── 12.15 Motion Philosophy ───────────────────────────────────────────────
    h2('12.15 Motion Philosophy & Animation System'),
    h3('Core Principles'),
    bullet('Motion communicates — every animation tells the visitor something (this is interactive, this arrived, this completed)'),
    bullet('Motion is fast — UI feedback is 150–250ms. Page-level transitions are 300–400ms. Nothing above 600ms except loading sequences.'),
    bullet('Motion is reduced — all animations respect prefers-reduced-motion: reduce. Static alternatives are always provided.'),
    bullet('Motion is coherent — all spring animations use a single global spring config unless overridden for specific emotional effect.'),
    spacer(),
    h3('Global Spring Configuration (Framer Motion)'),
    code('const spring = { type: "spring", stiffness: 300, damping: 28, mass: 1 };'),
    code('const gentleSpring = { type: "spring", stiffness: 150, damping: 20, mass: 1 };'),
    code('const bouncySpring = { type: "spring", stiffness: 400, damping: 22, mass: 0.8 };'),
    spacer(),
    h3('Easing Curves'),
    tbl(
      ['Name', 'CSS / Framer Value', 'Usage'],
      [1800, 3200, 4360],
      [
        ['ease-out', 'cubic-bezier(0, 0, 0.2, 1)', 'Elements entering the viewport (fast in, slow out = feels natural)'],
        ['ease-in', 'cubic-bezier(0.4, 0, 1, 1)', 'Elements leaving (rare — used for exit animations only)'],
        ['ease-in-out', 'cubic-bezier(0.4, 0, 0.2, 1)', 'Continuous loops: hero slider, marquee, rotating badge'],
        ['spring-standard', 'stiffness:300 damping:28', 'Default Framer Motion spring for most UI interactions'],
        ['spring-gentle', 'stiffness:150 damping:20', 'Hero card 3D rotation, large element entrance'],
        ['spring-snappy', 'stiffness:500 damping:32', 'Accordion open/close, dropdown, tab switch'],
      ]
    ),
    spacer(),
    h3('Animation Timing Reference'),
    tbl(
      ['Interaction', 'Duration', 'Easing', 'Notes'],
      [2400, 1200, 1800, 4000],
      [
        ['Button hover scale', '150ms', 'ease-out', 'scale(1.02) on enter, scale(1.0) on leave'],
        ['Card hover lift', '200ms', 'ease-out', 'translateY(-4px) + shadow transition'],
        ['Dropdown open', '200ms', 'spring-snappy', 'opacity 0→1, translateY 8px→0'],
        ['Modal enter', '250ms', 'spring-standard', 'opacity 0→1, scale 0.95→1'],
        ['Modal exit', '200ms', 'ease-in', 'opacity 1→0, scale 1→0.95'],
        ['Page transition', '300ms', 'ease-in-out', 'opacity 0→1 on route change'],
        ['Hero slide change', '600ms', 'ease-in-out', 'crossfade + subtle Ken Burns'],
        ['Scroll reveal', '500ms', 'spring-gentle', 'opacity 0→1, translateY 24px→0'],
        ['Quote step', '350ms', 'spring-standard', 'slide left or right between steps'],
        ['Success checkmark', '600ms', 'spring-gentle', 'SVG path draw animation'],
        ['Loading skeleton', '1500ms', 'ease-in-out infinite', 'shimmer pulse'],
        ['Toast enter', '300ms', 'spring-bouncey', 'slide up from bottom-right'],
        ['Toast exit', '200ms', 'ease-in', 'opacity 1→0, translateX 100%'],
        ['3D card auto-drift', '6000ms', 'ease-in-out infinite', 'rotateY ±3° loop'],
        ['Marquee logos', '30000ms', 'linear infinite', 'translateX -100% continuous'],
      ]
    ),
    spacer(),

    // ── 12.16 Interaction States ─────────────────────────────────────────────
    h2('12.16 Complete Interaction State Specifications'),
    h3('Hover States'),
    body('Every interactive element must have a distinct hover state. The transition must always be 150–200ms. Rules:'),
    bullet('Buttons: background darkens by one shade OR border appears OR scale 1.02'),
    bullet('Cards: translateY(-2px to -4px) + shadow level increases by one'),
    bullet('Links (inline): underline appears with accent color, no color change on body links'),
    bullet('Nav links: accent underline expands from left, 200ms ease-out'),
    bullet('Icons in buttons: subtle translateY(-1px) or rotate 5° depending on icon type'),
    spacer(),
    h3('Focus States'),
    body('Focus states are critical for keyboard accessibility. They must be:'),
    bullet('Always visible (never outline: none without a custom focus style)'),
    bullet('High contrast: 3px solid accent blue + 2px white offset ring'),
    bullet('Applied on :focus-visible (mouse focus does NOT show focus ring — keyboard only)'),
    code('outline: 3px solid #1A56DB;'),
    code('outline-offset: 2px;'),
    code('border-radius: var(--radius-md);'),
    spacer(),
    h3('Loading States'),
    body('Three categories of loading states, each with distinct visual treatment:'),
    tbl(
      ['Category', 'Treatment', 'Duration', 'Usage'],
      [1800, 2800, 1400, 3360],
      [
        ['Skeleton', 'Gray shimmer placeholders matching content layout', 'Until data loads', 'Product cards, blog cards, review cards on first paint'],
        ['Spinner', 'Circular progress indicator, accent blue, 24px', '< 3s expected', 'Button loading state after form submit, file upload progress'],
        ['Progress bar', 'Linear bar at top of quote form steps', 'Per step action', 'File upload percent, long operations'],
        ['Pulse', 'Entire card pulses at 50% opacity', '< 1s transitions', 'Quick data refreshes, ISR revalidation in progress'],
      ]
    ),
    spacer(),
    h3('Empty States'),
    body('Empty states occur when a section has no content: no reviews yet, no gallery photos, no blog articles. They must be:'),
    bullet('Never just a blank space — always an illustration + heading + optional CTA'),
    bullet('Consistent illustration style: simple SVG line art, muted colors (#94A3B8)'),
    bullet('Gallery empty: "Be the first to share your creation — submit your photo"'),
    bullet('Reviews empty: "No reviews yet — your order could be the first!" + quote CTA'),
    bullet('Search empty: "No results for [term] — try a different keyword" + popular links'),
    spacer(),
    h3('Error States'),
    bullet('Form field errors: red border (#DC2626) + red error message below, prefixed with ⚠ icon + aria-describedby pointing to error message'),
    bullet('Page-level errors: Full-width error banner in red-light (#FEE2E2) with error message and retry option'),
    bullet('API errors: Toast notification with error message + dismiss button. Never expose technical error codes to the user.'),
    bullet('Upload errors: File thumbnail turns red with an overlay "Failed — Try Again" and retry button'),
    spacer(),
    h3('Success States'),
    bullet('Form submissions: animated checkmark SVG (Framer Motion path draw) + green banner'),
    bullet('File uploads: thumbnail turns green with checkmark overlay, file name shown'),
    bullet('Quote submit: full success page with animated checkmark, reference number, and next steps'),
    bullet('Copy to clipboard: button label changes to "Copied!" for 2 seconds with green icon'),
    spacer(),

    // ── 12.17 Accessibility ───────────────────────────────────────────────────
    h2('12.17 Accessibility Rules (WCAG 2.1 AA)'),
    tbl(
      ['Category', 'Requirement', 'Implementation'],
      [1800, 2800, 4760],
      [
        ['Color contrast', 'Body text ≥ 4.5:1, large text ≥ 3:1', 'Validate in Storybook with axe-core on every component'],
        ['Focus management', 'Visible focus ring on all interactive elements', ':focus-visible with 3px blue ring on all focusable elements'],
        ['Skip link', 'Skip to main content as first focusable element', 'Visually hidden, revealed on focus, links to #main-content'],
        ['Headings', 'Single H1 per page, logical H2→H6 hierarchy', 'ESLint jsx-a11y/heading-has-content enforced in CI'],
        ['Images', 'Meaningful alt text, decorative images alt=""', 'All next/image components require alt prop — TypeScript enforces'],
        ['Forms', 'All inputs have visible labels or aria-label', 'react-hook-form + custom label component — label always rendered'],
        ['Motion', 'All animations respect prefers-reduced-motion', 'Global CSS: @media (prefers-reduced-motion) { * { animation: none !important; transition: none !important; } }'],
        ['Touch targets', 'Minimum 44×44px for all touch targets', 'Button minimum height: 44px. Link tap target padding enforced.'],
        ['Screen readers', 'Semantic HTML, ARIA where needed', 'role, aria-expanded, aria-label, aria-describedby on all interactive components'],
        ['Keyboard nav', 'All interactions keyboard-accessible', 'Tab order matches visual order. No keyboard traps except modals (focus-trap-react).'],
        ['Language', 'lang attribute on html element', 'Next.js root layout: <html lang="en">'],
        ['Error ID', 'Form errors programmatically associated', 'aria-describedby on input points to error message id'],
      ]
    ),
    pageBreak(),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 13 — COMPLETE COMPONENT LIBRARY
// ═══════════════════════════════════════════════════════════════════════════════

function buildComponentLibrary() {
  return [
    h1('13 · COMPLETE COMPONENT LIBRARY'),
    sectionLabel('Every Reusable Component — Production Specification'),

    body('This section documents every reusable component in the Tam Custom Patches design system. Each component specification includes purpose, layout at all breakpoints, all interaction states, accessibility, and performance notes. This is the single source of truth for Codex implementation.'),
    spacer(),

    // ── Header / Navigation ───────────────────────────────────────────────────
    h2('13.1 Header Component'),
    h3('Purpose'),
    body('The global site header. Contains the brand logo, primary navigation, utility icons (search, country selector), and the primary CTA. The header is the single most critical conversion surface on the site — it must always be accessible and never obscure content.'),
    spacer(),
    h3('Variants'),
    tbl(
      ['Variant', 'Trigger', 'Background', 'Behavior'],
      [1600, 2000, 2000, 3760],
      [
        ['Transparent', 'Overlaying hero on homepage only', 'transparent', 'Logo and nav in white. Backdrop-blur not applied. Fades to solid on scroll.'],
        ['Solid', 'All non-homepage pages, or after 80px scroll on homepage', 'white + shadow-sm', 'Logo in dark ink. Nav in dark ink. Standard layout.'],
        ['Minimized', 'Inside quote form wizard (/quote)', 'white, no nav', 'Logo only + "Save & Exit" link. No mega menu, no utility icons.'],
      ]
    ),
    spacer(),
    h3('Desktop Layout (≥ 1024px)'),
    body('Single row, 80px tall. Three zones left/center/right. Container: --container-xl max-width, centered, 40px horizontal padding.'),
    bullet('Left zone (240px): Wordmark logo SVG, links to /'),
    bullet('Center zone (flex grow): Primary nav links with 32px gaps — "Custom Patches" / "Apparel" / "Martial Arts" / "Accessories" / "Gallery" / "About"'),
    bullet('Right zone (auto): Country selector icon → Search icon → "AI Design Studio" ghost button → "Get a Quote" primary button'),
    spacer(),
    h3('Tablet Layout (768–1023px)'),
    body('Collapses center nav. Right zone shows only hamburger icon + "Get Quote" button.'),
    spacer(),
    h3('Mobile Layout (< 768px)'),
    body('72px tall. Logo left. Hamburger icon right. "Get Quote" pill between them.'),
    spacer(),
    h3('Scroll Behavior'),
    code('// useScrollY hook — threshold at 80px'),
    code('const isScrolled = scrollY > 80;'),
    code('className={cn("header", isScrolled && "header--solid")}'),
    body('Transition: background-color 300ms ease-out, box-shadow 300ms ease-out, backdrop-filter 300ms ease-out.'),
    spacer(),
    h3('Accessibility'),
    bullet('role="banner" on <header> element'),
    bullet('Skip to main content link as first child (visually hidden, revealed on :focus)'),
    bullet('Nav links in <nav> with aria-label="Main navigation"'),
    bullet('Hamburger button: aria-label="Open menu" / aria-expanded toggled'),
    bullet('CTA button: aria-describedby points to a visually hidden "Get a free custom patch quote" description'),
    spacer(),

    // ── Announcement Bar ─────────────────────────────────────────────────────
    h2('13.2 Announcement Bar'),
    body('A full-width strip above the header (not sticky) for high-priority messages: promotions, shipping delays, new product launches. Dismissible with an X button. State stored in sessionStorage.'),
    kvTbl([
      ['Height',      '40px (desktop), 48px (mobile for longer text)'],
      ['Background',  '--color-accent (#1A56DB)'],
      ['Text',        'White, text-sm, centered'],
      ['Dismiss',     'X icon right-aligned. Click removes bar and stores "announcement-dismissed" in sessionStorage.'],
      ['Max lines',   '1 line on desktop (text truncated with ellipsis). 2 lines on mobile.'],
      ['Animation',   'Slides down from -40px to 0 on first load (300ms ease-out). Slides up to -40px on dismiss (200ms ease-in).'],
    ]),
    spacer(),

    // ── Mega Menu ─────────────────────────────────────────────────────────────
    h2('13.3 Mega Menu Component'),
    h3('Purpose'),
    body('Full-width dropdown triggered by hovering (desktop) or tapping (mobile) a primary nav link. Opens with a 150ms delay to prevent accidental triggers on mouse-over.'),
    spacer(),
    h3('Desktop Behavior'),
    body('Spans full viewport width with a 1px border-bottom. Contains a 3-column layout inside the --container-xl container. Maximum height: 480px with overflow-y: auto if content exceeds. Backdrop: a white overlay covers the page content below to focus attention.'),
    spacer(),
    h3('Column Layout'),
    bullet('Column 1 (300px): List of sub-product links with 40px icon + label. Each link has a hover underline and arrow.'),
    bullet('Column 2 (260px): "By Industry" quick links with industry names only'),
    bullet('Column 3 (220px): Resources + Tools CTAs — "Get a Quote" (primary button), "AI Design Studio", "Size Guide", "Gallery"'),
    bullet('Optional: Far right (200px): A featured image panel showing a rotating gallery of product photography — desktop only'),
    spacer(),
    h3('Mobile Behavior'),
    body('The mega menu does not exist on mobile. Navigation uses the Mobile Menu Drawer (13.4) instead.'),
    spacer(),
    h3('Interaction States'),
    tbl(
      ['State', 'Trigger', 'Animation'],
      [1600, 2400, 5360],
      [
        ['Closed', 'Default', 'Not rendered (removed from DOM via AnimatePresence)'],
        ['Opening', 'Mouse enters trigger link (150ms delay)', 'opacity 0→1, translateY -8px→0, 200ms ease-out'],
        ['Open', 'Mouse over menu area', 'Static — no animation while open'],
        ['Closing', 'Mouse leaves trigger + menu area', 'opacity 1→0, translateY 0→-4px, 150ms ease-in. 100ms delay before removal.'],
        ['Focus-open', 'Tab to trigger, press Enter or Space', 'Same as Opening animation'],
      ]
    ),
    spacer(),
    h3('Accessibility'),
    bullet('Trigger link: role="button", aria-haspopup="true", aria-expanded toggles on open/close'),
    bullet('Mega menu panel: role="region", aria-label="[Category name] submenu"'),
    bullet('Escape key closes the menu and returns focus to the trigger'),
    bullet('Tab key navigates through menu items. Shift+Tab goes backward.'),
    bullet('Arrow keys navigate between columns and items within the mega menu'),
    spacer(),

    // ── Mobile Menu ───────────────────────────────────────────────────────────
    h2('13.4 Mobile Menu Drawer'),
    body('A full-height slide-in drawer from the right (not left — avoids conflict with back-gesture on iOS Safari). Covers the entire screen with a dark overlay.'),
    kvTbl([
      ['Width',         '100% (full screen on < 640px), 360px on 640–1023px'],
      ['Background',    'White'],
      ['Animation',     'translateX 100%→0, 300ms spring-standard. Overlay: opacity 0→0.5, 300ms ease-out.'],
      ['Close trigger', 'X button top-right, backdrop tap, Escape key, swipe-right gesture (> 80px displacement)'],
      ['Structure',     'Logo at top, accordion nav below, "Get a Quote" primary button pinned to bottom, country selector'],
      ['Accordion',     'Each primary category is an accordion item. Tap expands to show sub-links. Active category remains open on navigation.'],
      ['Focus trap',    'Focus trapped inside drawer while open (focus-trap-react). Focus returns to hamburger button on close.'],
    ]),
    spacer(),

    // ── Search Overlay ────────────────────────────────────────────────────────
    h2('13.5 Search Overlay Component'),
    body('Triggered by the magnifier icon in the header. Full-screen overlay with instant search results. Indexed content: products, industries, blog articles, FAQ answers.'),
    spacer(),
    kvTbl([
      ['Trigger',           'Click search icon in header'],
      ['Layout',            'Full screen, white background. Input centered at 40% from top. Results below in 4 columns (product / industry / blog / faq).'],
      ['Animation',         'backdrop: opacity 0→1, 200ms. Input + results panel: scale 0.96→1 + opacity 0→1, 250ms spring.'],
      ['Debounce',          '300ms input debounce before firing search query'],
      ['Empty state',       'Show "Popular searches" chip group when input is empty: "Custom Embroidered Patches" / "BJJ Gi" / "Bulk Hoodies"'],
      ['No results',        '"No results for [term]" + 3 popular product links'],
      ['Close',             'Escape key, clicking overlay, clicking X button'],
      ['Focus',             'Input auto-focused on open. Trap focus inside overlay.'],
      ['Phase 1',           'Static data search (product names, FAQs stored in JS constant). Phase 2: Algolia integration.'],
    ]),
    spacer(),

    // ── Hero Slider ───────────────────────────────────────────────────────────
    h2('13.6 Hero Slider Component'),
    body('The primary hero component. Full-viewport-height (100svh). Auto-advances every 7 seconds. Contains 3 slides. See Section 14 for expanded production specification of each slide.'),
    spacer(),
    kvTbl([
      ['Height',              '100svh (Small Viewport Height — Safari-safe)'],
      ['Auto-advance',        '7s interval, cleared on manual interaction, restarted after 10s of no interaction'],
      ['Navigation',          'Dot indicators: bottom-center, 8px circles, active dot expands to 24px pill. Prev/next arrows: visible on hover (desktop), hidden (mobile)'],
      ['Touch support',       'Swipe left/right changes slide. Velocity threshold: 300px/s or 80px displacement.'],
      ['Keyboard',            'Arrow left/right changes slide. Tab navigates through CTA buttons.'],
      ['Transition type',     'Crossfade (opacity) + subtle translateX 20px on the outgoing slide. 600ms ease-in-out.'],
      ['Reduced motion',      'Disables auto-advance. Crossfade disabled. Slides snap without animation.'],
      ['Performance',         'Only active slide is fully rendered. Adjacent slides are pre-rendered but hidden. No layout shift.'],
      ['3D content',          '3D card elements within each slide use CSS transform3d, GPU-accelerated via will-change: transform.'],
    ]),
    spacer(),

    // ── CTA Button ────────────────────────────────────────────────────────────
    h2('13.7 CTA Button — Primary'),
    h3('Purpose'),
    body('The single most important UI element on the site. Every primary action — "Get a Quote" and related lead CTAs — uses this button. It must be visually distinct from all other elements at every viewport size.'),
    spacer(),
    tbl(
      ['Property', 'Value'],
      [2400, 6960],
      [
        ['Background', '#1A56DB (accent)'],
        ['Text', 'White, Inter SemiBold, 15px, tracking +0.01em'],
        ['Height', '48px (desktop/tablet), 52px (mobile — larger touch target)'],
        ['Padding', '0 24px (default), 0 32px (large variant)'],
        ['Border radius', '--radius-md (8px)'],
        ['Shadow', '--shadow-sm'],
        ['Hover', 'background → #1E429F, shadow → --shadow-md, translateY(-1px), 150ms ease-out'],
        ['Active (pressed)', 'background → #1E3A8A, translateY(0), shadow → --shadow-sm, 100ms ease-out'],
        ['Focus', '--shadow-focus (3px solid #1A56DB, 2px offset)'],
        ['Loading', 'Background stays blue, label replaced by spinner (20px white), disabled pointer-events'],
        ['Disabled', 'background → #94A3B8, cursor: not-allowed, opacity: 0.6'],
        ['With icon', 'Icon (20px) left of label, 8px gap. Icon is white, same current-color as text.'],
        ['Full-width variant', 'width: 100% — used in mobile sticky CTAs and quote form'],
        ['Small variant', 'Height: 36px, padding: 0 16px, text: 14px — used in card CTAs only'],
      ]
    ),
    spacer(),

    // ── Secondary & Ghost Buttons ─────────────────────────────────────────────
    h2('13.8 Secondary Button & Ghost Button'),
    h3('Secondary Button'),
    body('Used as the second action alongside a primary CTA. Example: "Browse Products" next to "Get a Quote." Same height as primary, different visual weight.'),
    tbl(
      ['Property', 'Value'],
      [2400, 6960],
      [
        ['Background', 'White'],
        ['Border', '1.5px solid --color-border (#E2E8F0)'],
        ['Text', '--color-ink (#0A0A0A), Inter SemiBold, 15px'],
        ['Hover', 'border-color → --color-accent, text → --color-accent, shadow → --shadow-sm'],
        ['Active', 'background → --color-surface-alt'],
        ['Focus', '--shadow-focus same as primary button'],
      ]
    ),
    spacer(),
    h3('Ghost Button'),
    body('Used on dark backgrounds only. Appears as an outlined button with white text. Example: Secondary CTA in hero sections or dark banner sections.'),
    tbl(
      ['Property', 'Value'],
      [2400, 6960],
      [
        ['Background', 'transparent'],
        ['Border', '1.5px solid rgba(255,255,255,0.4)'],
        ['Text', 'White, Inter SemiBold, 15px'],
        ['Hover', 'border-color → rgba(255,255,255,0.8), background → rgba(255,255,255,0.08)'],
        ['Focus', '3px solid white, 2px offset — white focus ring on dark background'],
      ]
    ),
    spacer(),

    // ── Product Card ─────────────────────────────────────────────────────────
    h2('13.9 Product Card'),
    body('Used on the homepage "Featured Products" section, category hub pages, and "Related Products" carousels. The card represents a single product type.'),
    kvTbl([
      ['Dimensions',     '280px wide (default), 100% in grid. 4:3 image ratio at top.'],
      ['Structure',      'Top: image (4:3 ratio, rounded-top-lg). Bottom: padding 20px. Tag (category chip), Product name (text-xl, bold), 1-line description (text-sm, muted), "Learn More →" link (text-sm, accent color)'],
      ['Hover',          'Card: shadow-sm→shadow-md, translateY(-2px). Image: scale 1.03. Arrow link: translateX 4px. All: 200ms ease-out.'],
      ['Loading state',  'Skeleton: gray shimmer for image area + 2 gray bars for text'],
      ['Mobile',         'Full-width single column. Horizontal layout option (image left, text right) for compact lists.'],
      ['Accessibility',  'Entire card is a single <a> tag with aria-label="[Product name] — View details". No nested interactive elements.'],
    ]),
    spacer(),

    // ── Category Card ─────────────────────────────────────────────────────────
    h2('13.10 Category Card'),
    body('Full-bleed image card. Used on the homepage "Featured Products" 4-up grid and category hub pages. The image fills the entire card, with a gradient overlay at the bottom for text readability.'),
    kvTbl([
      ['Aspect ratio',   '4:3 (standard), 1:1 (square variant for grid)'],
      ['Image',          'Object-fit: cover. Loaded with Next/Image, lazy by default.'],
      ['Overlay',        'linear-gradient: transparent 40% → rgba(0,0,0,0.7) 100%'],
      ['Text',           'Positioned bottom-left inside overlay. Category name in text-xl bold white. Sub-label in text-sm muted white.'],
      ['Hover',          'Overlay lightens (rgba(0,0,0,0.4)). Image scales 1.05x. White arrow icon appears at bottom-right. 250ms ease-out.'],
      ['Border radius',  '--radius-lg on the entire card'],
    ]),
    spacer(),

    // ── Gallery Card ─────────────────────────────────────────────────────────
    h2('13.11 Gallery Card'),
    body('Used in the homepage gallery and /gallery page. Masonry layout — cards are variable height based on image aspect ratio.'),
    kvTbl([
      ['Image display',  'Full-bleed, variable height. Minimum 200px, no maximum.'],
      ['Hover',          'Overlay appears: rgba(0,0,0,0.4). A "View" icon (24px Maximize2) appears centered in white. Image scales 1.02x. All: 200ms ease-out.'],
      ['Click',          'Opens Lightbox (13.30) with the full-resolution image'],
      ['Caption',        'Customer name + product type shown as a pill at bottom-left of overlay on hover'],
      ['Loading',        'Gray shimmer placeholder matching the approximate height of the image'],
    ]),
    spacer(),

    // ── Review Card ───────────────────────────────────────────────────────────
    h2('13.12 Review Card'),
    body('Used in the Reviews section of product pages. Displays a single customer review.'),
    kvTbl([
      ['Width',          '100% of parent column (grid or single column)'],
      ['Structure',      'Top row: star rating (filled stars SVG, gold) + date (muted, right-aligned). Body: review text (text-base, clamped to 4 lines with "Read more" expand). Footer row: reviewer avatar (32px) + name (text-sm bold) + "Verified Purchase" chip'],
      ['Stars',          '5 SVG stars. Filled: gold (#F59E0B). Empty: --color-border. Half-star: split fill SVG.'],
      ['Expand',         '"Read more" toggles full text. Animated max-height transition: 300ms ease-out.'],
      ['Verified badge', 'Green check icon + "Verified Purchase" in text-xs, --color-success color'],
    ]),
    spacer(),

    // ── FAQ Accordion ─────────────────────────────────────────────────────────
    h2('13.13 FAQ Accordion'),
    body('Used in the homepage FAQ section, product pages, and /faq. Each accordion item renders as a question/answer pair. Can be single-open (only one item open at a time) or multi-open.'),
    kvTbl([
      ['Closed state',   'Full-width row. Question text (text-base bold) left. Plus icon (20px) right. Bottom border 1px.'],
      ['Open state',     'Question row: background → surface-alt, icon rotates to Minus (45° rotation, 200ms spring). Answer panel: slides open from height 0, 250ms spring-standard.'],
      ['Transition',     'height: 0 → auto (using Framer Motion layout animation, NOT CSS max-height hack). This gives perfect natural animation.'],
      ['Accessibility',  'role="button" on trigger, aria-expanded, aria-controls pointing to answer panel id. Answer panel: role="region", aria-labelledby pointing to trigger id.'],
      ['Keyboard',       'Enter or Space toggles. Arrow Up/Down moves between accordion triggers. Home/End goes to first/last.'],
    ]),
    spacer(),

    // ── Trust Badge ───────────────────────────────────────────────────────────
    h2('13.14 Trust Badge Component'),
    body('A compact UI element displaying a single trust signal. Used in the Trust Bar, header utility area, quote form, and product pages.'),
    kvTbl([
      ['Variants',       'Icon+Stat+Label (trust bar), Icon+Text (inline), Certified Logo (partner badge image)'],
      ['Icon',           'Lucide icon, 24px, --color-accent'],
      ['Stat',           'text-2xl bold --color-ink'],
      ['Label',          'text-sm --color-muted'],
      ['No hover',       'Trust badges are never interactive — they are read-only signals. No hover state.'],
      ['Animation',      'On scroll into viewport: stat number counts up from 0 to value using a custom useCountUp hook. Duration: 1500ms ease-out.'],
    ]),
    spacer(),

    // ── Quote Progress Indicator ─────────────────────────────────────────────
    h2('13.15 Quote Progress Indicator'),
    body('Shown at the top of the /quote wizard. Displays all steps with current step highlighted. Steps before current are shown as completed (green checkmark). Steps after are dimmed.'),
    kvTbl([
      ['Desktop',        'Horizontal linear progress: step circles connected by lines. Completed: green fill. Current: accent blue fill + pulse ring animation. Upcoming: gray fill.'],
      ['Mobile',         'Compact: "Step 2 of 6" text + linear progress bar only. No circles.'],
      ['Step circle',    '32px circle. Completed: green background + white checkmark icon. Current: accent blue + white step number. Future: gray background + gray number.'],
      ['Connector line', '2px horizontal line between circles. Completed segments: green. Upcoming: --color-border.'],
      ['Animation',      'When advancing: connector line fills from left to right, 400ms ease-out. New circle bounces in with spring animation.'],
      ['Click behavior', 'Completed steps are clickable (navigate back). Current and future steps are not clickable.'],
    ]),
    spacer(),

    // ── Artwork Upload Component ──────────────────────────────────────────────
    h2('13.16 Artwork Upload Component'),
    body('The primary file upload interface in Step 5 of the quote form. Supports drag-and-drop and file browser. Handles multiple files up to 50MB each.'),
    spacer(),
    h3('Upload Zone States'),
    tbl(
      ['State', 'Appearance', 'Behavior'],
      [1600, 3000, 4760],
      [
        ['Idle', 'Dashed border (--color-border), white bg, cloud-upload icon centered, instruction text', 'Accepts drop events'],
        ['Drag-over', 'Dashed border → solid accent blue, surface-alt bg, icon pulses, text changes to "Drop your files here!"', 'Highlight on dragenter, unhighlight on dragleave'],
        ['Uploading', 'Per-file progress bars with file name and size. Cancel button per file.', 'Uploads to R2 via signed URL. Progress via XHR onprogress.'],
        ['Complete', 'File thumbnail grid (3 per row). Each thumbnail: preview image (or file type icon), file name (truncated), file size, X remove button.', 'Can add more files up to 5 total.'],
        ['Error', 'Red border, error message below. File thumbnail shows red overlay.', 'Can retry individual files or remove them.'],
      ]
    ),
    spacer(),
    h3('File Type Icons (for non-image files)'),
    bullet('PDF: red document icon with "PDF" label'),
    bullet('EPS / AI / SVG: green vector icon with format label'),
    bullet('PSD: blue layered document icon with "PSD" label'),
    bullet('Image preview: actual thumbnail scaled to 80×80px'),
    spacer(),

    // ── AI Prompt Input ───────────────────────────────────────────────────────
    h2('13.17 AI Prompt Input'),
    body('The natural-language text input in the AI Design Studio. Styled to feel premium and intentional — not like a standard textarea.'),
    kvTbl([
      ['Base',           'Rounded rectangle, 100% width, min-height 120px, auto-expand up to 240px. Border: 1.5px solid --color-border. Background: white.'],
      ['Placeholder',    '"Describe your patch idea... e.g. \'A fierce eagle with lightning bolts for a motorcycle club\'" — muted, italic'],
      ['Focus',          'Border → accent blue, shadow → --shadow-focus. Label slides up (floating label animation, 200ms spring).'],
      ['Character count','Bottom-right of textarea: "0 / 500" in text-xs muted. Turns orange at 400+. Turns red at 490+.'],
      ['Prompt chips',   'Below input: 5 scrollable suggestion chips ("Try: Fire theme", "Try: Military badge", "Try: Sports team"). Clicking a chip appends the text to the prompt.'],
      ['Submit trigger', '"Generate Preview" button below. Disabled when prompt is empty or loading.'],
    ]),
    spacer(),

    // ── Order Summary Component ───────────────────────────────────────────────
    h2('13.18 Order Summary Component'),
    body('The sticky sidebar card visible from Step 2 onward in the quote form. Shows all current selections and estimated pricing.'),
    kvTbl([
      ['Desktop',        'Sticky right sidebar (320px wide). Stays in view during scrolling (position: sticky, top: 100px).'],
      ['Mobile',         'Collapsed to a bottom bar showing quantity + "View Summary" button. Expands to a full-screen bottom drawer on tap.'],
      ['Rows',           'Each selection row: label (left, text-sm muted), value (right, text-sm bold). Edit icon on hover reveals "Change" link.'],
      ['Pricing',        'Subtotal row in text-base. Shipping: "Calculated on submission". Tax: "Based on your country". Total: text-xl bold, separated by top border.'],
      ['Edit',           'Clicking any row navigates back to that step (URL ?step=N). Current step selections are highlighted in accent blue.'],
      ['Empty rows',     'Unselected steps show "—" as value in muted color.'],
    ]),
    spacer(),

    // ── Breadcrumbs ───────────────────────────────────────────────────────────
    h2('13.19 Breadcrumbs Component'),
    body('Displayed below the header on all product pages, category pages, blog articles, and industry pages. Never on the homepage.'),
    kvTbl([
      ['Separator',      '/ character (text-sm muted)'],
      ['Links',          'All breadcrumb segments are links except the last (current page). Links: text-sm muted, hover → accent color.'],
      ['Current',        'Last segment: text-sm bold --color-ink. Not a link.'],
      ['Mobile',         'Abbreviated to show only "← [Parent page name]" on mobile (≤ 480px). Saves horizontal space.'],
      ['Schema',         'BreadcrumbList JSON-LD automatically generated from the breadcrumb trail'],
    ]),
    spacer(),

    // ── Blog Card ─────────────────────────────────────────────────────────────
    h2('13.20 Blog Card'),
    body('Used in the homepage blog preview section (3 cards) and the /blog index page (grid). Represents a single article.'),
    kvTbl([
      ['Structure',      'Top: cover image (16:9 ratio). Below: category tag (chip), article title (text-xl bold, 2-line clamp), excerpt (text-base, 2-line clamp), author avatar + name + date (text-sm muted)'],
      ['Hover',          'Card: shadow-md. Image: scale 1.03. Title: color → accent. 200ms ease-out.'],
      ['Click target',   'Entire card. aria-label="[Article title] — Read article"'],
      ['Author avatar',  '32px circle. Falls back to initials in a colored circle if no photo.'],
      ['Category chip',  'Small pill: --color-tagBg background, --color-accent text. E.g. "Embroidery Guide", "Sizing", "Industry"'],
      ['Loading',        'Skeleton shimmer for image, 2 gray lines for title, 1 line for meta'],
    ]),
    spacer(),

    // ── Footer ────────────────────────────────────────────────────────────────
    h2('13.21 Footer Component'),
    body('The global site footer. Dark background (#0A0A0A). White text. Always the last element on every page.'),
    kvTbl([
      ['Layout',         '5-column grid on desktop (240px + 4×flex). 2-column on tablet. Single column on mobile. 64px top/bottom padding.'],
      ['Column 1',       'Logo (white version). 2-line brand tagline. Social icons row (Instagram, Facebook, LinkedIn, Pinterest, TikTok). Each icon: 20px, white, hover → accent, 150ms.'],
      ['Columns 2–5',    'Link groups with heading (text-xs uppercase tracked muted-light) + link list. Links: text-sm white, hover → muted-light, 150ms.'],
      ['Bottom bar',     'Full-width divider, then: copyright left, "Privacy Policy · Terms of Service · Accessibility" links right. text-xs muted-light.'],
      ['Trust strip',    'Optional: before the bottom bar, a 3-item trust row: worldwide shipping map, security badge, satisfaction guarantee badge.'],
      ['No animations',  'Footer is a static element. No entrance animations — it\'s below the fold and user-initiated scroll reveals it.'],
    ]),
    spacer(),

    // ── Floating Quote Button ─────────────────────────────────────────────────
    h2('13.22 Floating Quote Button (FAB)'),
    body('A fixed-position button in the bottom-right corner of the viewport. Appears 3 seconds after page load. Hides when the quote form is visible in the viewport.'),
    kvTbl([
      ['Position',       'fixed, bottom: 24px, right: 24px, z-index: 1000'],
      ['Appearance',     '52px height, pill shape (--radius-full). Background: --color-accent. White text "Get Quote" + MessageSquare icon left.'],
      ['Entrance',       'Slides up from below viewport (translateY 80px → 0, opacity 0→1, 400ms spring, 3s delay)'],
      ['Hide trigger',   'IntersectionObserver watches #quote-form. When quote form is >50% visible, button hides (translateY 0 → 80px, opacity 1→0, 300ms ease-in).'],
      ['Mobile',         'Shows only the icon (no text) to reduce screen real estate usage. 48×48px, circular.'],
      ['Accessibility',  'aria-label="Get a free custom patch quote" — full description because mobile shows icon-only'],
    ]),
    spacer(),

    // ── Modal ─────────────────────────────────────────────────────────────────
    h2('13.23 Modal Component'),
    h3('Purpose & Variants'),
    body('Modals are used for: AI Design Studio save confirmation, review submission, exit intent offer, sample request, and contact quick-form. Never used for primary user flows (those use full pages or drawers).'),
    kvTbl([
      ['Overlay',        'rgba(0,0,0,0.5), full-viewport, backdrop-filter: blur(4px) — subtle blur behind modal'],
      ['Panel',          'White, --radius-xl, --shadow-xl, max-width: 480px, width: calc(100% - 32px), vertically centered'],
      ['Animation',      'Overlay: opacity 0→0.5, 200ms. Panel: scale 0.95→1 + opacity 0→1, 250ms spring-standard.'],
      ['Exit',           'Escape key, clicking overlay, or X button. Reverse animation on close.'],
      ['Focus trap',     'Focus trapped inside modal while open. Returns to trigger on close.'],
      ['Scroll lock',    'body overflow: hidden while modal is open (scrollbar-width preserved to prevent layout shift)'],
      ['Stacking',       'Multiple modals use an increasing z-index stack. Maximum 2 modals deep.'],
    ]),
    spacer(),

    // ── Lightbox ──────────────────────────────────────────────────────────────
    h2('13.24 Lightbox Component'),
    body('Full-screen image viewer triggered from gallery thumbnails. Supports keyboard and swipe navigation between images.'),
    kvTbl([
      ['Background',     'rgba(0,0,0,0.95) — near-black for maximum image focus'],
      ['Image display',  'Centered, max 90vw × 90vh, object-fit: contain. Never stretches or crops.'],
      ['Navigation',     'Large left/right arrow buttons at screen edges. Keyboard: arrow left/right. Swipe left/right on mobile.'],
      ['Close',          'Escape key, X button top-right, click outside image area'],
      ['Animation',      'Image enters: scale 0.9→1 + opacity 0→1, 250ms spring. Next/prev: slide in from direction of navigation.'],
      ['Caption',        'Bottom: customer name, product, optional testimonial quote. White text on dark background.'],
      ['Zoom',           'Click image to toggle 2x zoom. Pinch on mobile to zoom. Drag to pan when zoomed.'],
    ]),
    spacer(),

    // ── Toast Notification ────────────────────────────────────────────────────
    h2('13.25 Toast Notification'),
    body('Brief non-blocking notifications for feedback: file uploaded, quote saved, error occurred, link copied.'),
    kvTbl([
      ['Position',       'fixed, top: 16px, right: 16px on desktop. Bottom: 16px, left+right: 16px (full-width) on mobile.'],
      ['Variants',       'Success (green), Error (red), Warning (orange), Info (blue). Each has a colored left border (4px) and matching muted background.'],
      ['Duration',       'Auto-dismiss after 4000ms. Hovering pauses the timer. Error toasts require manual dismiss.'],
      ['Stack',          'Multiple toasts stack vertically with 8px gaps. Maximum 3 toasts visible at once.'],
      ['Animation',      'Enter: slide in from right + opacity 0→1, 300ms spring-bouncy. Exit: slide right + opacity 1→0, 200ms ease-in.'],
      ['Dismiss',        'X button top-right of each toast.'],
      ['Accessibility',  'role="status" for non-critical, role="alert" + aria-live="assertive" for errors. Always announced to screen readers.'],
    ]),
    spacer(),

    // ── Loading Skeleton ──────────────────────────────────────────────────────
    h2('13.26 Loading Skeleton'),
    body('Used as a placeholder while data loads. The skeleton must mirror the exact layout of the content it replaces to prevent layout shift on data arrival.'),
    kvTbl([
      ['Color',          'Base: #E2E8F0. Shimmer: #F1F5F9. Shimmer travels left to right.'],
      ['Animation',      'background-position: -200% 0 → 200% 0, 1.5s linear infinite. Uses CSS background-image: linear-gradient(90deg, base, shimmer, base).'],
      ['Border radius',  'Matches the element it replaces: text lines use --radius-sm, image areas use --radius-lg.'],
      ['Variants',       'Text line (100% × 16px), Short text (60% × 16px), Title (100% × 24px), Image (aspect-ratio matching), Avatar (circle 40px), Button (100% × 48px, --radius-md)'],
    ]),
    spacer(),

    // ── 404 Component ────────────────────────────────────────────────────────
    h2('13.27 404 Error Page'),
    body('A full-page component served when a route is not found. Renders inside the standard site layout (header + footer).'),
    kvTbl([
      ['Illustration',   'An SVG illustration: a patch with a question mark stitched into it. 200px wide, centered, muted colors (#CBD5E1 / #94A3B8).'],
      ['Headline',       '"Page Not Found" — text-4xl bold'],
      ['Sub-text',       '"Looks like this page got lost in production. Let\'s get you back on track." — text-lg muted'],
      ['Recovery CTAs',  'Primary: "Back to Homepage". Secondary: "Browse Custom Patches". Ghost: "Contact Us"'],
      ['Search bar',     'Inline search input: "Search for what you need…" — uses the same Search component as the overlay'],
      ['Popular links',  'Below the search: "Popular: Custom Embroidered Patches · BJJ Gis · Get a Quote"'],
    ]),
    spacer(),

    // ── Country Selector ──────────────────────────────────────────────────────
    h2('13.28 Country Selector Component'),
    body('Globe icon in the header right zone. Allows visitors to set their country for display purposes (shipping estimates, contact info). Stored in a cookie.'),
    kvTbl([
      ['Trigger',        'Globe icon (Lucide Globe, 20px) in header utility zone'],
      ['Dropdown',       'Appears below trigger on click. Max-height: 320px, overflow-y: auto. Contains a search input + country list.'],
      ['Animation',      'opacity 0→1, translateY -8px→0, 200ms ease-out on open. Reverse on close.'],
      ['Countries',      'Grouped: Top picks (USA, Canada, UK, Australia, EU), then alphabetical rest. Each row: flag emoji + country name + currency symbol.'],
      ['Current selection', 'Highlighted with accent-blue background. Checkmark icon on right.'],
      ['Storage',        'document.cookie: "tam-country=US; path=/; max-age=31536000"'],
      ['Impact',         'Phase 1: cosmetic only (changes footer contact info shown). Phase 2: influences pricing display and shipping estimates.'],
    ]),
    pageBreak(),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 14 — ADVANCED HOMEPAGE & HERO SPECIFICATION
// ═══════════════════════════════════════════════════════════════════════════════

function buildHeroSpec() {
  return [
    h1('14 · ADVANCED HOMEPAGE & HERO SPECIFICATION'),
    sectionLabel('Production-Level Hero Slider Implementation'),

    h2('14.1 Overall Homepage Feel'),
    body('The homepage must deliver a specific emotional journey in under 5 seconds:'),
    numbered('"This is not your average patches website." — The dark hero with 3D patch cards immediately signals premium.'),
    numbered('"These people are professional." — The trust bar with specific numbers (not vague claims) builds credibility.'),
    numbered('"I know exactly where to go." — The featured product section makes the product range immediately clear.'),
    numbered('"I want to work with them." — The testimonials and client logos confirm this is the right choice.'),
    body('The homepage is not a brochure. It is a conversion machine that builds trust fast and removes all friction from starting a quote request.'),
    spacer(),

    h2('14.2 Hero 1 — Custom Patches (Scene Specification)'),
    h3('Scene Composition'),
    body('The hero occupies the full viewport. It is divided into two zones: the visual (right 55%) and the content (left 45%). On mobile, content is on top, visual below.'),
    spacer(),
    h3('Content Zone (Left)'),
    tbl(
      ['Element', 'Specification'],
      [2000, 7360],
      [
        ['Eyebrow label', 'text-xs uppercase tracked, --color-accent, "WORLDWIDE CUSTOM MANUFACTURING"'],
        ['Headline', '"Custom Patches\\nMade Easy" — text-6xl (clamped), black/white per bg, Inter Bold 800, line-height 1.0, -0.05em tracking. The word "Easy" has an accent-color underline SVG animation.'],
        ['Subline', '"Embroidered · PVC · Woven · Chenille · Printed · Velcro — Ships Worldwide" — text-lg muted, Inter 400'],
        ['CTA row', '"Get a Quote" (primary button, large) + "Design Your Patch →" (ghost button on dark bg, or text link on light)'],
        ['Trust micro-strip', 'Below CTAs: 3 trust icons in a row — ✓ Free Artwork Revisions · ✓ 7–14 Day Production · ✓ Worldwide Shipping. text-sm, muted white.'],
      ]
    ),
    spacer(),
    h3('Visual Zone — 3D Patch Cards (Right)'),
    body('6 patch type cards arranged in a subtle arc/fan layout. Each card is a self-contained CSS + Framer Motion component.'),
    tbl(
      ['Card', 'Product', 'Color Scheme', 'Position (CSS transform)'],
      [800, 2000, 2200, 4360],
      [
        ['1', 'Embroidered', 'Navy + Gold', 'translateX(0) translateY(0) rotateZ(-6deg) — bottom-left, front'],
        ['2', 'PVC', 'Tactical Green + Black', 'translateX(60px) translateY(-30px) rotateZ(-2deg) — center-left'],
        ['3', 'Woven', 'White + Red', 'translateX(120px) translateY(-50px) rotateZ(1deg) — center'],
        ['4', 'Chenille', 'Varsity Blue + Gold', 'translateX(170px) translateY(-40px) rotateZ(4deg) — center-right'],
        ['5', 'Printed', 'Full-color gradient', 'translateX(200px) translateY(-20px) rotateZ(7deg) — right'],
        ['6', 'Velcro', 'Ranger Green', 'translateX(210px) translateY(20px) rotateZ(10deg) — bottom-right, back'],
      ]
    ),
    spacer(),
    h3('3D Lighting'),
    body('Simulated via CSS radial gradients and box-shadows, not actual WebGL. Each card has:'),
    bullet('A white radial gradient at 15% opacity at the top-left of the card (simulates studio key light)'),
    bullet('A dark radial gradient at 8% opacity at the bottom-right (simulates fill shadow)'),
    bullet('A --shadow-premium box-shadow that deepens to --shadow-2xl on hover'),
    spacer(),
    h3('Mouse Interaction (Desktop)'),
    body('The entire card group responds to mouse position over the hero:'),
    code('// useMouse hook tracks cursor position relative to hero container'),
    code('const rotateY = ((mouseX / heroWidth) - 0.5) * 12; // ±6 degrees'),
    code('const rotateX = ((mouseY / heroHeight) - 0.5) * -6; // ±3 degrees'),
    code('// Applied to the card group container using Framer Motion useSpring'),
    code('const springConfig = { stiffness: 100, damping: 20, mass: 1 };'),
    spacer(),
    h3('Auto-Rotation (When No Mouse)'),
    body('When the user\'s mouse is not over the hero, the card group drifts on a gentle pendulum:'),
    code('rotateY: [0, 4, 0, -4, 0], // keyframes'),
    code('transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }'),
    spacer(),
    h3('Entry Animation (On Page Load)'),
    body('Cards enter with a staggered spring animation. Each card starts 60px below and invisible:'),
    code('initial: { opacity: 0, translateY: 60, rotateZ: 0 }'),
    code('animate: { opacity: 1, translateY: targetY, rotateZ: targetZ }'),
    code('transition: { delay: index * 0.08, type: "spring", stiffness: 120, damping: 18 }'),
    spacer(),
    h3('Background'),
    body('Dark near-black gradient: radial-gradient(ellipse at 60% 40%, #1A1A2E 0%, #0A0A0A 100%). A very subtle canvas texture SVG at 2% opacity overlays this — reinforces the "manufactured" feel.'),
    spacer(),
    h3('Parallax'),
    body('A mild parallax effect on scroll: the card group moves UP at 0.3× the scroll velocity (translateY: scrollY * -0.3). Content zone moves at 0.15×. This creates depth as the visitor scrolls past.'),
    spacer(),
    h3('Performance Budget for Hero 1'),
    tbl(
      ['Asset', 'Target Size', 'Format', 'Loading'],
      [2000, 1600, 1400, 4360],
      [
        ['Hero background gradient', '0 bytes (CSS)', 'CSS', 'Inline styles'],
        ['Canvas texture SVG', '< 2KB', 'SVG', 'Inline in JSX'],
        ['Patch card content', 'CSS + JS only', 'No images Phase 1', 'No network request for Phase 1 cards'],
        ['CTA button styles', '0 bytes (Tailwind)', 'CSS', 'Inline'],
        ['Framer Motion bundle', '18KB gzipped', 'JS', 'Loaded once, cached'],
        ['Total hero network cost', '< 20KB', 'Mixed', 'Critical path: < 5KB'],
      ]
    ),
    spacer(),

    h2('14.3 Hero 2 — Custom Apparel (Scene Specification)'),
    h3('Contrast Principle'),
    body('Hero 2 deliberately contrasts with Hero 1. Hero 1 is dark and atmospheric. Hero 2 is light, clean, and product-focused. This variety prevents the slider from feeling repetitive.'),
    spacer(),
    h3('Background'),
    body('Off-white warm gradient: linear-gradient(135deg, #FAFAF8 0%, #F0EDE8 100%). This subtle warmth makes apparel photography look premium and fashion-forward.'),
    spacer(),
    h3('Content Zone'),
    tbl(
      ['Element', 'Specification'],
      [2000, 7360],
      [
        ['Eyebrow', '"CUSTOM APPAREL — BUILT FOR TEAMS & BRANDS"'],
        ['Headline', '"Premium Custom\\nApparel" — same type scale as Hero 1 but in --color-ink instead of white.'],
        ['Subline', '"T-Shirts · Hoodies · Jerseys · Polos · Activewear · Crewnecks — Minimum 25 units"'],
        ['CTA row', '"Start Your Order" (primary) + "Browse Apparel" (secondary button — dark on light bg)'],
      ]
    ),
    spacer(),
    h3('Visual Zone — Layered Apparel Stack'),
    body('A "fanned deck" of 5 apparel garment cards. Unlike the patches (which are physical objects shown 3D), the apparel cards simulate a product photography layout: each card is a clean product shot on white background, presented at a slight angle to create depth.'),
    tbl(
      ['Card', 'Garment', 'Color', 'Transform'],
      [800, 1600, 2000, 5000],
      [
        ['1 (front)', 'Custom Hoodie', 'Black', 'rotateZ(-4deg), translateY(0) — front center'],
        ['2', 'Polo Shirt', 'Navy', 'rotateZ(-1deg), translateY(-16px), translateX(20px) — slightly behind'],
        ['3', 'T-Shirt', 'White', 'rotateZ(2deg), translateY(-28px), translateX(40px)'],
        ['4', 'Jersey', 'Red + White', 'rotateZ(5deg), translateY(-20px), translateX(55px)'],
        ['5 (back)', 'Crewneck', 'Forest Green', 'rotateZ(8deg), translateY(-10px), translateX(65px) — furthest back'],
      ]
    ),
    h3('Hover Interaction — "Fan Spread"'),
    body('On mouse hover over the card group, the cards fan out fully (increased translateX on cards 2–5) to reveal all garments. Spring animation: stiffness 200, damping 24. On mouse leave: cards return to stacked position.'),
    spacer(),

    h2('14.4 Hero 3 — Martial Arts Uniforms (Scene Specification)'),
    h3('Visual Philosophy'),
    body('This slide references the premium aesthetic of elite martial arts brands. It should feel like the cover of a martial arts equipment catalog: focused, powerful, precise. The visual language borrows from the clean confidence of luxury athletic brands.'),
    spacer(),
    h3('Background'),
    body('Deep charcoal: #1C1C1E (iOS System Black — the subtlest dark that still reads as black). A 2px gold (#B8860B) horizontal rule at the very bottom of the hero reinforces prestige.'),
    spacer(),
    h3('Content Zone'),
    tbl(
      ['Element', 'Specification'],
      [2000, 7360],
      [
        ['Eyebrow', '"COMPETITION-GRADE CUSTOM UNIFORMS"'],
        ['Headline', '"Custom Martial Arts\\nUniforms & Gear" — white, same type scale'],
        ['Subline', '"BJJ Gis · Karate · Taekwondo · Judo — Dojos & Competition Teams"'],
        ['Gold accent', 'A thin 2px gold underline SVG under "Uniforms & Gear" — references the gold belt/rank tradition'],
        ['CTA row', '"Get a Quote" (primary) + "Browse Uniforms" (ghost button — white outline on dark bg)'],
      ]
    ),
    spacer(),
    h3('Visual Zone — Premium Uniform Showcase'),
    body('A single large product photograph of a BJJ Gi or Karate uniform at a 3/4 angle takes center stage (60% of the visual zone). This is a real product photograph, not a 3D simulation. Flanking it: 3 smaller secondary product thumbnails (belt close-up, patch detail, alternate uniform).'),
    kvTbl([
      ['Main image size',      '500×600px on desktop. Centered in visual zone with soft drop shadow below.'],
      ['Main image animation', 'Slides in from right (translateX 40px → 0, opacity 0→1, 600ms spring-gentle). A subtle light sweep animation passes across the fabric every 8 seconds (shimmer overlay, 0→10%→0 opacity, 1200ms ease-in-out).'],
      ['Thumbnail strip',      '3 cards at 120×120px below main image. Stagger entrance: 0.15s delay each.'],
      ['Gold belt detail',     'A small detail shot: a gold embroidered rank stripe on a belt, positioned bottom-left as a floating card element (glass treatment, --radius-lg, --shadow-xl)'],
    ]),
    spacer(),
    h3('Reduced Motion Behavior — All Slides'),
    body('When prefers-reduced-motion: reduce is detected:'),
    bullet('Hero auto-advance: disabled. Manual navigation only.'),
    bullet('All entrance animations: disabled. Elements appear at final state immediately.'),
    bullet('3D card group rotation: disabled. Cards appear in their final static arrangement.'),
    bullet('Auto-rotation (pendulum effect): disabled.'),
    bullet('Ken Burns / parallax: disabled.'),
    bullet('The hero still looks beautiful in its static state — the design is tested without any animations before animations are added.'),
    spacer(),
    h3('Accessibility for All Heroes'),
    bullet('Hero section: role="region", aria-label="[Slide title] — slide N of 3"'),
    bullet('Slider controls: role="tablist" on dots container, role="tab" on each dot, aria-selected on active'),
    bullet('Auto-advance pause: pauses when user focuses any element within the hero'),
    bullet('All CTAs have full descriptive aria-label: "Get a free custom patch quote — start your order"'),
    bullet('The 3D card group has role="presentation" — it is decorative, not informational'),
    bullet('All text in hero passes 4.5:1 contrast against the background color'),
    pageBreak(),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 15 — ADVANCED PRODUCT PAGE SPECIFICATION
// ═══════════════════════════════════════════════════════════════════════════════

function buildProductPageSpec() {
  return [
    h1('15 · ADVANCED PRODUCT PAGE SPECIFICATION'),
    sectionLabel('Every Product Page — Production Detail'),

    h2('15.1 Manufacturing Process Section'),
    body('Every product page includes a "How It\'s Made" section. This builds E-E-A-T signals, differentiates from competitors, and builds trust. It is positioned after the product specifications tabs and before the size guide.'),
    spacer(),
    h3('Visual Format: 4-Step Illustrated Timeline'),
    tbl(
      ['Step', 'Title', 'Description', 'Illustration Note'],
      [700, 1600, 3200, 3860],
      [
        ['01', 'Artwork Preparation', 'Your design is reviewed by our art team. Vector files are optimized. Thread colors are matched to our 150-color Pantone-mapped thread library.', 'SVG illustration: designer at screen reviewing artwork'],
        ['02', 'Digitization', 'For embroidered patches, our software converts your design into a stitch file. Every stitch angle, density, and underlay is set by our production specialists.', 'SVG illustration: stitch pattern grid on screen'],
        ['03', 'Manufacturing', 'Industrial embroidery machines run your design with precision-tensioned threads. Each patch is quality-checked against the approved digital proof.', 'SVG illustration: embroidery machine close-up'],
        ['04', 'Quality & Shipping', 'Each patch is trimmed, inspected, and heat-sealed. Orders are packed and shipped worldwide via tracked courier within 7–14 business days.', 'SVG illustration: patches in packaging, world map'],
      ]
    ),
    spacer(),
    h3('Interactive Backing Selector'),
    body('A visual card grid showing all available backing options for the current product. Each card is selectable and updates a "Selected Backing" display. Not connected to a form — purely informational and educational.'),
    tbl(
      ['Backing', 'Icon', 'Description', 'Best For'],
      [1400, 800, 2600, 4560],
      [
        ['Iron-On', 'Iron icon', 'Heat-activated adhesive. Permanent when applied correctly.', 'Garments, bags, hats — fabric surfaces'],
        ['Sew-On', 'Needle icon', 'Traditional attachment. Most durable. Requires sewing.', 'Uniforms, professional applications, long-term wear'],
        ['Peel & Stick', 'Sticker icon', 'Self-adhesive backing. Temporary. Repositionable.', 'Packaging, temporary campaigns, samples'],
        ['Velcro Hook', 'Velcro icon', 'Mates with Velcro loop surfaces. Removable.', 'Tactical gear, bags, interchangeable applications'],
        ['Safety Pin', 'Pin icon', 'Classic pin backing. Easy to attach and remove.', 'Events, name badges, conventions, shows'],
        ['Magnetic', 'Magnet icon', 'Strong magnet backing. No holes in fabric.', 'Dress shirts, delicate fabrics'],
        ['Plastic Snap', 'Snap icon', 'Snaps onto surfaces with matching button hardware.', 'Lanyards, keychains, zippered pouches'],
        ['None / Raw Edge', 'Cut icon', 'No backing material. Raw or laser-cut edge.', 'Sewing-in applications, manufacturer integration'],
      ]
    ),
    spacer(),
    h3('Border Selector'),
    body('Displayed on embroidered and woven patch pages only. Shows 4 border types with visual examples.'),
    tbl(
      ['Border Type', 'Description', 'Visual Example'],
      [1800, 3200, 4360],
      [
        ['Merrowed', 'The classic embroidery border. A tight, raised thread border sewn around the patch perimeter. Available in any thread color.', 'An SVG showing a circular patch with visible raised border loop around edge'],
        ['Hot Cut', 'The backing is heat-sealed to prevent fraying. No raised border. Gives a sharp, flat-edge appearance.', 'An SVG showing the same design with a flat, clean edge'],
        ['Laser Cut', 'Laser-precision cut for die-cut shapes. Clean edge, no fraying, any shape possible.', 'SVG: a custom shield shape with a clean laser-cut edge'],
        ['Overlap', 'One part of the patch overlaps another — used for 3D foam or raised elements.', 'SVG showing a badge with a raised center element overlapping the base'],
      ]
    ),
    spacer(),
    h3('Thread Color Guide'),
    body('A searchable, filterable grid of 150 standard thread colors. Displayed as 36px circular swatches with a 3-digit code and color name below. Filters: All / Warm / Cool / Neutral / Dark / Metallic.'),
    body('Clicking a color swatch shows: color name, color code (e.g. "EMB-147"), nearest Pantone equivalent (e.g. "Pantone 286 C"), and a small patch thumbnail showing that color as a dominant color.'),
    spacer(),
    h3('Industry Examples Section'),
    body('Below the product specifications, a "Who Orders This?" horizontal scroll gallery showing real customer use cases. Each card: industry icon + industry name + "N+ orders" + a gallery thumbnail. Clicking navigates to the industry landing page.'),
    tbl(
      ['Product Page', 'Top 4 Industry Examples Shown'],
      [3200, 6160],
      [
        ['Embroidered Patches', 'Military & Defense, Sports Teams, Schools & Universities, Motorcycle Clubs'],
        ['PVC Patches', 'Tactical & Law Enforcement, Outdoor / Adventure, Corporate Events, Fashion Brands'],
        ['BJJ Gis', 'Brazilian Jiu-Jitsu Academies, MMA Gyms, Competition Teams, Youth Programs'],
        ['Custom Hoodies', 'Corporate Teams, Universities, Sports Teams, Fashion Brands'],
      ]
    ),
    spacer(),
    h3('Cross-Linking Strategy'),
    body('Every product page must link to at minimum 5 other internal pages via contextual in-content links and sidebar related content. Rules:'),
    bullet('At least 1 link to the /quote page with a relevant pre-filled URL parameter (e.g. /quote?product=embroidered-patches)'),
    bullet('At least 2 links to related product pages (e.g. Embroidered Patches page links to Woven Patches and Velcro Patches)'),
    bullet('At least 1 link to a relevant blog article (e.g. "How to Design a Custom Patch")'),
    bullet('At least 1 link to a relevant industry page (e.g. "Custom Patches for Sports Teams")'),
    bullet('Related Products section shows 4–6 related product cards with automatic algorithm: same category priority, then cross-category'),
    pageBreak(),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 16 — ADVANCED AI DESIGN STUDIO
// ═══════════════════════════════════════════════════════════════════════════════

function buildAIDesignerSpec() {
  return [
    h1('16 · ADVANCED AI DESIGN STUDIO'),
    sectionLabel('Complete User Flow & Feature Specification'),

    h2('16.1 Complete User Flow'),
    body('The AI Design Studio is a progressive-enhancement tool. It works in Phase 1 as a configuration UI (no real AI). It upgrades to real AI generation in Phase 2. The user flow is identical in both phases — only the preview result differs.'),
    spacer(),
    h3('Step-by-Step User Flow'),
    numbered('User arrives at /ai-designer from header CTA, hero CTA, or product page "Design Your Patch" link'),
    numbered('Left panel defaults to: Product Type = Embroidered, Shape = Circle, Size = 3", all other fields empty'),
    numbered('User types a prompt in the AI Prompt Input (13.17). Suggestions appear as chips below the input.'),
    numbered('User selects shape, size, colors, border, backing, and style keywords from the control panel'),
    numbered('User clicks "Generate Preview" — loading state shows (spinner + "Designing your patch…" text)'),
    numbered('Phase 1: A placeholder preview renders (static pre-designed patch selected by keyword matching). Phase 2: Real AI image displayed.'),
    numbered('User can: Regenerate (new seed), Compare (view 2 versions side by side), Save, Share, or Download Preview'),
    numbered('"Get a Quote" button is always visible — clicking navigates to /quote with all current parameters pre-filled as URL query params'),
    spacer(),

    h2('16.2 Prompt Suggestions System'),
    body('Below the prompt input, 5 scrollable chips show suggested prompts based on: no input (default suggestions), partial input (autocomplete-style refinements), and selected product type (context-specific).'),
    spacer(),
    h3('Default Suggestions (When Prompt Is Empty)'),
    bullet('"A fierce eagle clutching lightning bolts — motorcycle club style"'),
    bullet('"Minimalist geometric mountain range with pine trees and stars"'),
    bullet('"Vintage-style team badge with laurel wreath and Roman numerals"'),
    bullet('"Military unit insignia with skull and crossed swords"'),
    bullet('"School crest with lion, banner, and Latin motto"'),
    spacer(),
    h3('Prompt History'),
    body('The last 10 prompts are stored in localStorage. A "Recent" dropdown arrow below the prompt input reveals them. Clicking a past prompt restores it to the input. Dismissible per item.'),
    spacer(),

    h2('16.3 Saved Designs & Collections'),
    kvTbl([
      ['Save (no auth)',  'Saves current design config (all parameters + preview image URL) to localStorage. Shows "Design saved locally." toast. Local saves are visible only on the same device/browser.'],
      ['Save (auth)',     'Phase 2: Saves to user account database. Accessible across devices. Syncs to customer dashboard at /account/designs.'],
      ['Collections',     'Phase 2: Users can organize saved designs into named collections (e.g. "Spring Campaign Ideas", "Team Patches").'],
      ['Limit',          'localStorage: 10 designs (LRU eviction). Database (Phase 2): unlimited.'],
    ]),
    spacer(),

    h2('16.4 Version History & Undo/Redo'),
    kvTbl([
      ['Undo/Redo',      'Every parameter change is tracked in an immutable state history stack (Zustand + immer). Ctrl+Z / ⌘+Z undoes last change. Ctrl+Shift+Z redoes.'],
      ['History depth',  '20 states maximum. Oldest states are evicted from front of stack.'],
      ['Version history', 'Each "Generate Preview" creates a version. Versions are shown in a horizontal strip below the preview. Click any version thumbnail to restore that state. Max 6 versions shown.'],
      ['Compare',        '"Compare" button opens a split-screen view: left = current version, right = selected comparison version. A draggable divider lets the user compare by sliding.'],
    ]),
    spacer(),

    h2('16.5 Design Quality Scoring (Phase 2)'),
    body('When real AI generation is active, the system evaluates the generated design for production viability and shows a quality score card alongside the preview.'),
    tbl(
      ['Score Category', 'What It Checks', 'Output'],
      [2000, 3200, 4160],
      [
        ['Embroidery complexity', 'Thread path count, small details below 2mm, fine text below 6pt', 'Score 1–5, with specific warnings'],
        ['Color count', 'Detected unique colors vs selected color count', 'Warning if detected > selected'],
        ['Minimum size viability', 'Features that will be lost at selected size', 'List of features to simplify'],
        ['Production feasibility', 'Overall assessment for embroidery type', '"Excellent / Good / Requires simplification"'],
      ]
    ),
    spacer(),

    h2('16.6 Share & Download'),
    kvTbl([
      ['Share',          'Generates a shareable URL: /ai-designer?p=[encoded-params]&v=[version-id]. URL encodes all current parameters. On other devices, the page restores the same configuration.'],
      ['Download preview', 'Phase 2: Downloads a 1200×1200px watermarked JPG of the AI-generated preview. Watermark: "Tam Custom Patches — Preview Only" diagonal, 15% opacity.'],
      ['Social share',   'Share to Twitter/Instagram prepopulates with: "I just designed a custom patch using Tam\'s AI Design Studio! [URL]"'],
      ['Embed (Phase 3)', 'A <script> embed code for third-party sites to show the AI Design Studio in an iframe.'],
    ]),
    spacer(),

    h2('16.7 Performance & GPU Optimization'),
    bullet('The left control panel and right preview panel are separate React subtrees to prevent unnecessary re-renders when controls change'),
    bullet('The preview panel uses will-change: transform on the preview image card for GPU layer promotion'),
    bullet('Debounce all control panel changes by 300ms before updating the preview state'),
    bullet('The comparison split-view uses requestAnimationFrame for smooth divider dragging'),
    bullet('Phase 1 placeholder renders are instant (pre-loaded image set, no network request)'),
    bullet('Phase 2 AI API calls show a skeleton in the preview panel during generation (typically 3–8 seconds)'),
    pageBreak(),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 17 — ADVANCED QUOTE SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

function buildAdvancedQuoteSystem() {
  return [
    h1('17 · ADVANCED QUOTE SYSTEM'),
    sectionLabel('Expanded Quote Flow — Production Specification'),

    h2('17.1 Progress Animations'),
    body('The quote form is a multi-step wizard. Every step transition must feel intentional and provide clear spatial orientation.'),
    spacer(),
    h3('Step Transition Animation'),
    body('Forward (next step): current step slides left (translateX 0 → -40px, opacity 1→0) while next step enters from right (translateX 40px→0, opacity 0→1). Both 350ms, spring-standard.'),
    body('Backward (previous step): reversed direction — current exits right, previous enters from left.'),
    body('The progress indicator updates before the slide animation starts (100ms earlier) so the user sees the progress change as the slide begins.'),
    spacer(),
    h3('Step Completion Micro-Animation'),
    body('When a user selects an option and taps "Continue," the selected card bounces (scale 1→1.04→1, 200ms spring) before the slide transition begins. This provides tactile confirmation of the selection.'),
    spacer(),

    h2('17.2 Save Quote & Continue Later'),
    kvTbl([
      ['Trigger',         '"Save & Continue Later" appears as a text link at the bottom of every step. Also accessible from the header "Save & Exit" in the minimized header variant.'],
      ['No-auth flow',    'Quote state (all selections made so far) is serialized to a URL-safe string and encoded. User is shown: "Bookmark this link or share it via email to continue later." A mailto: link is generated pre-filled.'],
      ['Auth flow (P2)',  'Quote is saved to the database against the user account. A unique quote ID is assigned. User can access from /account/quotes.'],
      ['Return flow',     'When a saved quote URL is loaded, the wizard initializes with all previously saved state. A banner confirms: "Welcome back — your quote has been restored." The user resumes from where they left off.'],
      ['Expiry',          'Saved quote URLs expire after 30 days (stored with a timestamp in the encoded state). After expiry, a friendly message explains the quote has expired and offers to start a new one.'],
    ]),
    spacer(),

    h2('17.3 Multi-Product Quote Requests'),
    body('A user may need patches AND apparel for the same project (e.g. a sports team ordering jerseys + chest patch + hat patch). The quote form supports this via an "Add Another Product" flow.'),
    spacer(),
    h3('Multi-Product Flow'),
    numbered('User completes a single product quote flow through Step 5 (artwork)'),
    numbered('On the Order Summary (Step 6 contact), before the contact form, a section shows: "Adding another product to this quote?" with a "+ Add Product" button'),
    numbered('Clicking "+ Add Product" opens a mini product selector (same as Step 0 but presented in a compact modal)'),
    numbered('Selected product is added as a second line item to the Order Summary sidebar'),
    numbered('User completes Step 2–5 for the second product (repeating the selection steps in a mini-wizard inside the modal)'),
    numbered('Both products are shown in the Order Summary with individual selections and combined estimated total'),
    numbered('Single contact form submission sends both product requests in one quote'),
    spacer(),
    h3('Order Summary — Multi-Product Layout'),
    body('In multi-product mode, the Order Summary sidebar shows:'),
    bullet('Product 1 section (collapsible accordion): all selections'),
    bullet('Product 2 section (collapsible accordion): all selections'),
    bullet('Combined total row at bottom'),
    bullet('"Remove" button per product line item'),
    spacer(),

    h2('17.4 Estimated Production & Shipping Timeline'),
    body('After the user selects their product and quantity, the Order Summary shows an estimated timeline:'),
    code('Production: 7–14 business days'),
    code('Shipping: 3–10 business days (depending on country)'),
    code('Estimated Delivery: [calculated date range]'),
    body('The estimated delivery date is calculated: today + 14 days production + shipping transit days. Transit days are hard-coded by region (Phase 1). Phase 2 integrates a shipping API.'),
    tbl(
      ['Region', 'Transit Days (Phase 1 Estimate)'],
      [3200, 6160],
      [
        ['USA (48 contiguous states)', '3–7 business days'],
        ['Canada', '4–8 business days'],
        ['United Kingdom', '4–7 business days'],
        ['Europe (EU)', '5–10 business days'],
        ['Australia & NZ', '6–12 business days'],
        ['Rest of World', '8–15 business days'],
      ]
    ),
    spacer(),

    h2('17.5 Validation Rules'),
    tbl(
      ['Field', 'Rule', 'Error Message'],
      [2000, 2800, 4560],
      [
        ['Email', 'Must match RFC 5321 email regex', '"That email address doesn\'t look right. Please try again."'],
        ['Quantity', 'Integer ≥ 10 (patches), ≥ 25 (apparel)', '"Minimum order is [minimum] units for this product."'],
        ['Custom size', 'Width and height between 0.5" and 12"', '"Size must be between 0.5 inches and 12 inches."'],
        ['Custom quantity', 'Integer only, no special characters', '"Please enter a whole number."'],
        ['First name', '2–50 characters, no numbers or symbols', '"Please enter your first name."'],
        ['Last name', '2–50 characters, no numbers or symbols', '"Please enter your last name."'],
        ['Phone (optional)', 'Valid international format if provided', '"Please enter a valid phone number or leave blank."'],
        ['File type', 'EPS, SVG, AI, PDF, PNG, JPG, PSD only', '"[filename] is not a supported file type. Please upload EPS, SVG, PDF, PNG, or JPG."'],
        ['File size', '≤ 50MB per file', '"[filename] is too large. Maximum file size is 50MB."'],
        ['File count', '≤ 5 files', '"You\'ve reached the maximum of 5 files. Remove a file to add more."'],
      ]
    ),
    spacer(),

    h2('17.6 Analytics Events'),
    body('Every significant user action in the quote system fires a GA4 custom event. These events are the primary conversion tracking data source.'),
    tbl(
      ['Event Name', 'Trigger', 'Parameters'],
      [2400, 2400, 4560],
      [
        ['quote_started', 'User clicks any "Get a Quote" CTA', 'source: (hero/header/product/floating), product: (if pre-filled)'],
        ['quote_step_complete', 'User advances from any step', 'step: (1–6), product_type: (string), step_name: (string)'],
        ['quote_artwork_uploaded', 'File successfully uploaded to R2', 'file_type: (ext), file_size_kb: (number)'],
        ['quote_artwork_skipped', 'User clicks "Upload Later"', 'step: 5'],
        ['quote_submitted', 'Form successfully submitted', 'product_type, quantity, color_count, size, has_artwork: (bool)'],
        ['quote_save_started', 'User clicks "Save & Continue Later"', 'step: (current step)'],
        ['quote_restored', 'User returns via saved quote URL', 'step: (step they left at), days_since_save: (number)'],
        ['ai_designer_opened', 'User navigates to /ai-designer', 'source: (header/hero/product)'],
        ['ai_prompt_generated', 'User clicks "Generate Preview"', 'prompt_length: (chars), product_type: (string)'],
        ['ai_quote_requested', 'User clicks "Get a Quote" from AI Design Studio', 'has_saved_design: (bool)'],
      ]
    ),
    spacer(),

    h2('17.7 Mobile Interactions'),
    body('The quote form is fully functional on mobile. Key mobile-specific considerations:'),
    bullet('Step option cards stack to a 2-column grid on mobile (instead of 3–4 columns on desktop)'),
    bullet('Order Summary is collapsed by default on mobile. A sticky bottom bar shows: "3 of 6 steps · Patches · 100 units · View Summary". Tapping opens the full summary as a bottom drawer.'),
    bullet('The file upload drop zone on mobile becomes a "Browse Files" button only (no drag-and-drop on mobile). The camera option is also offered: "Take Photo" triggers the native camera on iOS/Android.'),
    bullet('Form inputs on mobile: step size set to prevent iOS auto-zoom on focus. Font size 16px minimum on all inputs.'),
    bullet('Keyboard avoidance: the wizard layout accounts for the iOS soft keyboard. Content scrolls to keep the active input above the keyboard.'),
    pageBreak(),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 18 — DATABASE & API ARCHITECTURE
// ═══════════════════════════════════════════════════════════════════════════════

function buildDatabaseArchitecture() {
  return [
    h1('18 · DATABASE & API ARCHITECTURE'),
    sectionLabel('Complete Technical Backend Specification'),

    h2('18.1 Architecture Overview'),
    body('The backend architecture is intentionally minimal for Phase 1 and progressively expands in Phase 2 and 3. The principle is: do not build what you do not yet need. Phase 1 requires only a file upload endpoint and a quote submission endpoint.'),
    spacer(),
    h3('Phase 1 Stack (Weeks 1–8)'),
    bullet('Runtime: Vercel Edge Functions + Node.js serverless functions'),
    bullet('File storage: Cloudflare R2 (S3-compatible object storage)'),
    bullet('Email: Resend (transactional email API)'),
    bullet('Rate limiting: Upstash Redis via Vercel KV'),
    bullet('No database required in Phase 1 — quote submissions are emailed to the team'),
    spacer(),
    h3('Phase 2 Stack (Weeks 9–16)'),
    bullet('Database: PostgreSQL on Neon (serverless, auto-scaling, branch-per-PR preview deploys)'),
    bullet('ORM: Drizzle ORM (TypeScript-first, lightweight, no N+1 query issues)'),
    bullet('Auth: NextAuth.js v5 (customer accounts only — no admin auth in Phase 2)'),
    bullet('Search: Algolia (product, blog, FAQ search)'),
    bullet('CRM: HubSpot (Phase 2 lead sync)'),
    spacer(),

    h2('18.2 Entity Relationship Diagram (ERD)'),
    body('The following describes the database schema. Relationships are defined in Drizzle ORM schema files. All tables use UUID primary keys.'),
    spacer(),
    h3('Core Tables and Relationships (Text ERD)'),
    body('quotes → quote_items (1:many) — A quote can have multiple product line items'),
    body('quotes → contacts (many:1) — Multiple quotes can belong to one contact'),
    body('contacts → users (1:1, optional) — A contact may have an associated authenticated user account'),
    body('quote_items → products (many:1) — Each line item references a product type'),
    body('quote_files → quotes (many:1) — Multiple artwork files per quote'),
    body('products → product_options (1:many) — Each product has configurable options'),
    body('blog_articles → authors (many:1) — Each article has one author'),
    body('reviews → products (many:1) — Reviews are associated with products'),
    body('reviews → contacts (many:1) — Reviews are associated with verified contacts'),
    spacer(),

    h2('18.3 Database Table Specifications'),
    h3('Table: quotes'),
    tbl(
      ['Column', 'Type', 'Constraints', 'Notes'],
      [2200, 1400, 2000, 3760],
      [
        ['id', 'UUID', 'PRIMARY KEY DEFAULT gen_random_uuid()', 'Internal ID'],
        ['reference_number', 'TEXT', 'UNIQUE NOT NULL', 'Public ID: TAM-XXXXXXXX (8 random alphanumeric chars)'],
        ['status', 'TEXT', 'NOT NULL DEFAULT \'pending\'', 'Enum: pending | reviewed | quoted | accepted | declined | completed'],
        ['contact_id', 'UUID', 'FK contacts(id)', 'May be null for anonymous quotes in Phase 1'],
        ['session_id', 'TEXT', 'NULL', 'Anonymous session ID for Phase 1 quote tracking'],
        ['source_url', 'TEXT', 'NULL', 'The page URL where the quote was initiated'],
        ['utm_source', 'TEXT', 'NULL', 'Marketing attribution'],
        ['utm_medium', 'TEXT', 'NULL', ''],
        ['utm_campaign', 'TEXT', 'NULL', ''],
        ['how_found', 'TEXT', 'NULL', 'Self-reported discovery channel'],
        ['internal_notes', 'TEXT', 'NULL', 'Admin-only notes — never shown to customer'],
        ['admin_assignee', 'UUID', 'FK admin_users(id) NULL', 'Phase 2: assigned sales rep'],
        ['estimated_value', 'NUMERIC(10,2)', 'NULL', 'Internal pricing estimate'],
        ['created_at', 'TIMESTAMPTZ', 'NOT NULL DEFAULT NOW()', ''],
        ['updated_at', 'TIMESTAMPTZ', 'NOT NULL DEFAULT NOW()', 'Auto-updated via trigger'],
        ['submitted_at', 'TIMESTAMPTZ', 'NULL', 'When user submitted form — may differ from created_at for saved quotes'],
      ]
    ),
    spacer(),
    h3('Table: quote_items'),
    tbl(
      ['Column', 'Type', 'Constraints', 'Notes'],
      [2200, 1400, 2000, 3760],
      [
        ['id', 'UUID', 'PRIMARY KEY', ''],
        ['quote_id', 'UUID', 'FK quotes(id) ON DELETE CASCADE', ''],
        ['product_category', 'TEXT', 'NOT NULL', 'Enum: patches | apparel | martial_arts | accessories'],
        ['product_type', 'TEXT', 'NOT NULL', 'Enum: embroidered | pvc | woven | chenille | printed | velcro | t-shirt | hoodie | bjj-gi | etc.'],
        ['quantity', 'INTEGER', 'NOT NULL CHECK (quantity >= 1)', ''],
        ['size_width_inches', 'NUMERIC(4,2)', 'NULL', 'Width dimension'],
        ['size_height_inches', 'NUMERIC(4,2)', 'NULL', 'Height dimension — null if circular'],
        ['color_count_range', 'TEXT', 'NULL', 'Enum: 1_3 | 4_6 | 7_9 | 10_plus'],
        ['embroidery_coverage', 'INTEGER', 'NULL CHECK coverage IN (50, 75, 100)', 'Patches only'],
        ['backing_type', 'TEXT', 'NULL', 'Enum: iron_on | sew_on | velcro | peel_stick | safety_pin | magnetic | none'],
        ['border_type', 'TEXT', 'NULL', 'Enum: merrowed | hot_cut | laser_cut | overlap'],
        ['artwork_comment', 'TEXT', 'NULL', 'Free text from the artwork comment box'],
        ['artwork_upload_later', 'BOOLEAN', 'NOT NULL DEFAULT FALSE', 'TRUE if user chose "Upload Later"'],
        ['line_notes', 'TEXT', 'NULL', 'Admin notes specific to this line item'],
        ['created_at', 'TIMESTAMPTZ', 'NOT NULL DEFAULT NOW()', ''],
      ]
    ),
    spacer(),
    h3('Table: contacts'),
    tbl(
      ['Column', 'Type', 'Constraints', 'Notes'],
      [2200, 1400, 2000, 3760],
      [
        ['id', 'UUID', 'PRIMARY KEY', ''],
        ['email', 'TEXT', 'UNIQUE NOT NULL', 'Lowercase normalized'],
        ['first_name', 'TEXT', 'NOT NULL', ''],
        ['last_name', 'TEXT', 'NOT NULL', ''],
        ['phone', 'TEXT', 'NULL', 'E.164 format'],
        ['company', 'TEXT', 'NULL', ''],
        ['country_code', 'TEXT', 'NULL', 'ISO 3166-1 alpha-2'],
        ['user_id', 'UUID', 'FK users(id) NULL', 'Linked when contact creates an account'],
        ['crm_id', 'TEXT', 'NULL', 'HubSpot contact ID (Phase 2)'],
        ['crm_synced_at', 'TIMESTAMPTZ', 'NULL', ''],
        ['marketing_opt_in', 'BOOLEAN', 'NOT NULL DEFAULT FALSE', 'GDPR consent for email marketing'],
        ['created_at', 'TIMESTAMPTZ', 'NOT NULL DEFAULT NOW()', ''],
        ['updated_at', 'TIMESTAMPTZ', 'NOT NULL DEFAULT NOW()', ''],
      ]
    ),
    spacer(),
    h3('Table: quote_files'),
    tbl(
      ['Column', 'Type', 'Constraints', 'Notes'],
      [2200, 1400, 2000, 3760],
      [
        ['id', 'UUID', 'PRIMARY KEY', ''],
        ['quote_item_id', 'UUID', 'FK quote_items(id) ON DELETE CASCADE', ''],
        ['r2_key', 'TEXT', 'NOT NULL', 'Cloudflare R2 object key — format: quotes/{quote_id}/{uuid}.{ext}'],
        ['original_filename', 'TEXT', 'NOT NULL', 'Sanitized original filename for display'],
        ['file_size_bytes', 'INTEGER', 'NOT NULL', ''],
        ['mime_type', 'TEXT', 'NOT NULL', 'Validated MIME type'],
        ['upload_status', 'TEXT', 'NOT NULL DEFAULT \'pending\'', 'Enum: pending | complete | failed | virus_detected'],
        ['created_at', 'TIMESTAMPTZ', 'NOT NULL DEFAULT NOW()', ''],
      ]
    ),
    spacer(),

    h2('18.4 API Endpoints Specification'),
    tbl(
      ['Method', 'Endpoint', 'Auth', 'Purpose', 'Rate Limit'],
      [800, 2800, 1000, 2600, 1600],
      [
        ['POST', '/api/quote/submit', 'None', 'Submit complete quote form', '3/min per IP'],
        ['POST', '/api/quote/save', 'None', 'Save quote state (returns encoded URL)', '10/min per IP'],
        ['GET', '/api/quote/restore?token=X', 'None', 'Restore saved quote state', '20/min per IP'],
        ['POST', '/api/files/presign', 'None', 'Get R2 signed upload URL', '10/min per IP'],
        ['DELETE', '/api/files/:key', 'None', 'Delete an uploaded file (pre-submission only)', '10/min per IP'],
        ['POST', '/api/contact', 'None', 'Contact form submission', '3/min per IP'],
        ['POST', '/api/ai/generate', 'None (rate limited)', 'Trigger AI image generation (Phase 2)', '5/hour per IP'],
        ['GET', '/api/search?q=X', 'None', 'Site search proxy (Phase 2)', '60/min per IP'],
        ['POST', '/api/reviews/submit', 'Auth (customer)', 'Submit a product review (Phase 2)', '2/day per user'],
        ['POST', '/api/admin/quotes', 'Admin JWT', 'List/filter quotes', 'Internal only'],
        ['PATCH', '/api/admin/quotes/:id', 'Admin JWT', 'Update quote status/assignee/notes', 'Internal only'],
        ['POST', '/api/revalidate', 'Secret token', 'ISR revalidation webhook', 'Internal only'],
      ]
    ),
    spacer(),

    h2('18.5 File Upload Architecture'),
    h3('Upload Flow (Client → R2 Direct Upload)'),
    numbered('Client requests a presigned URL: POST /api/files/presign with { filename, mimeType, quoteId }'),
    numbered('Server validates: checks MIME type whitelist, file extension whitelist, generates UUID key, creates quote_files record with status=pending'),
    numbered('Server returns: { uploadUrl, key, expiresIn: 300 }'),
    numbered('Client uploads directly to R2 using the presigned URL (PUT request — never passes through the Next.js server)'),
    numbered('Client notifies server of completion: PATCH /api/files/:key { status: "complete" }'),
    numbered('Server updates quote_files status to \'complete\'. Phase 2: triggers async virus scan via Cloudflare Workers.'),
    spacer(),
    h3('Cloudflare R2 Bucket Structure'),
    code('quotes/{quote_id}/{uuid}.{ext}         — artwork files'),
    code('ai-previews/{session_id}/{uuid}.jpg    — AI generated previews (Phase 2)'),
    code('gallery/{year}/{month}/{uuid}.webp     — customer gallery uploads (Phase 3)'),
    code('blog/{slug}/cover.webp                — blog cover images (CMS)'),
    code('products/{slug}/{index}.webp           — product photography'),
    spacer(),

    h2('18.6 Caching Architecture'),
    tbl(
      ['Layer', 'Technology', 'TTL', 'What Is Cached'],
      [1200, 1800, 1200, 5160],
      [
        ['Browser', 'Cache-Control headers', '1 year', 'Static assets (JS, CSS, fonts) with content hash in filename'],
        ['CDN (Cloudflare)', 'Edge cache', '1 hour (ISR pages)', 'HTML pages for product pages, category pages, blog'],
        ['CDN (Cloudflare)', 'Edge cache', '30 days', 'Images served from R2'],
        ['Next.js ISR', 'Static regeneration', 'Per route config', 'Product pages (1h), homepage (60s), blog (24h)'],
        ['Vercel KV (Redis)', 'Application cache', '60 seconds', 'Rate limit counters, session data'],
        ['DB query cache', 'Drizzle + PG cache (P2)', '60 seconds', 'Product lists, blog lists — high-traffic read queries'],
      ]
    ),
    spacer(),

    h2('18.7 Security Architecture'),
    tbl(
      ['Threat', 'Mitigation', 'Implementation'],
      [2000, 2800, 4560],
      [
        ['SQL Injection', 'Parameterized queries via ORM', 'Drizzle ORM — never raw SQL from user input'],
        ['XSS', 'React auto-escapes all output. CSP header.', 'Content-Security-Policy: default-src \'self\'; script-src \'self\' \'nonce-...\''],
        ['CSRF', 'SameSite cookies + CSRF token on mutation endpoints', 'NextAuth.js manages this for auth endpoints. Custom CSRF for public forms.'],
        ['File upload abuse', 'MIME type validation + extension validation + size limit + virus scan (Phase 2)', 'Server-side validation before issuing presigned URL. Client-side validation for UX only.'],
        ['Rate limiting', 'Upstash Redis sliding window counter per IP', 'All public POST endpoints rate-limited. Headers: X-RateLimit-Limit, X-RateLimit-Remaining.'],
        ['Bot protection', 'Cloudflare Turnstile on quote form and contact form', 'Invisible CAPTCHA. Server-side token verification via Cloudflare API.'],
        ['Data exposure', 'No PII in URL params. No PII in GA4 events.', 'Quote restore tokens use opaque signed JWTs. No email/name in URLs.'],
        ['DDoS', 'Cloudflare WAF + rate limiting at CDN edge', 'Under-attack mode configurable in Cloudflare dashboard.'],
        ['Dependency vulnerabilities', 'Dependabot weekly scans + npm audit in CI', 'GitHub Actions: npm audit --audit-level=high blocks merge if critical found'],
      ]
    ),
    pageBreak(),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 19 — ADMIN DASHBOARD & CMS
// ═══════════════════════════════════════════════════════════════════════════════

function buildAdminDashboard() {
  return [
    h1('19 · ADMIN DASHBOARD & CMS'),
    sectionLabel('Complete Internal Operations System'),

    h2('19.1 Admin System Overview'),
    body('The admin dashboard is an internal-only web application. It is NOT part of the public-facing website. It is accessed at /admin (protected by authentication). The admin system enables the Tam team to manage all quote requests, customer interactions, content, and site configuration without developer involvement.'),
    spacer(),
    h3('Admin Technology Stack'),
    kvTbl([
      ['Framework',       'Next.js App Router (shared codebase with main site, separate /admin route group)'],
      ['Auth',            'NextAuth.js v5 with admin role check. Admin accounts created manually — no self-signup.'],
      ['UI Components',   'shadcn/ui + Tailwind (same design tokens as main site but with a distinct "operational" color palette — lighter grays, less accent blue)'],
      ['Tables',          'TanStack Table v8 — virtualized, sortable, filterable, resizable columns'],
      ['Charts',          'Recharts — used for analytics dashboard'],
      ['Date/Time',       'date-fns — all timestamps in user\'s local timezone. Server stores UTC.'],
      ['Rich text editor','Tiptap (for blog article editing and email template editing)'],
      ['File manager',    'Custom component interfacing directly with Cloudflare R2 via API'],
    ]),
    spacer(),

    h2('19.2 Admin Navigation Structure'),
    tbl(
      ['Section', 'URL', 'Description'],
      [1800, 2400, 5160],
      [
        ['Dashboard', '/admin', 'KPI overview, recent activity, pending items count'],
        ['Quotes', '/admin/quotes', 'All quote submissions — list, filter, search, assign, update status'],
        ['Contacts', '/admin/contacts', 'All contacts — search, view history, CRM sync status'],
        ['Products', '/admin/products', 'Product catalog management — specifications, options, images'],
        ['Blog', '/admin/blog', 'Article list, create/edit, publish/schedule, categories, tags'],
        ['Gallery', '/admin/gallery', 'Customer gallery — approve/reject submissions, organize, feature'],
        ['Media Library', '/admin/media', 'All uploaded files — search, organize, delete, replace'],
        ['Email Templates', '/admin/emails', 'Edit transactional email templates with live preview'],
        ['Analytics', '/admin/analytics', 'Traffic, conversion funnel, quote pipeline, top pages'],
        ['Settings', '/admin/settings', 'Site config, pricing rules, announcement bar, maintenance mode'],
        ['Team', '/admin/team', 'Admin user management, roles, activity logs'],
      ]
    ),
    spacer(),

    h2('19.3 Quote Management System'),
    h3('Quote List View'),
    body('The primary daily work surface for the sales team. Shows all quotes in a TanStack Table with:'),
    bullet('Columns (resizable, reorderable): Reference # / Contact Name / Company / Product / Qty / Status / Assignee / Submitted Date / Action'),
    bullet('Sort: any column, ascending/descending'),
    bullet('Filter: status (multi-select), product type (multi-select), date range, assignee, country'),
    bullet('Search: full-text across contact name, company, email, reference number'),
    bullet('Bulk actions: assign to team member, change status, export to CSV'),
    bullet('Row click: opens quote detail panel as a side drawer (not a new page — keeps list context)'),
    spacer(),
    h3('Quote Detail Panel (Side Drawer)'),
    body('A 480px right drawer showing the complete quote information:'),
    bullet('Header: Reference number (bold), status badge (color-coded), created timestamp'),
    bullet('Timeline: Vertical event log — "Quote submitted," "Reviewed by [name]," "Quote sent to customer," etc.'),
    bullet('Contact card: Name, email, phone, company, country, previous quote count'),
    bullet('Order items: Each line item with all specifications, artwork files (thumbnails with download links)'),
    bullet('Internal notes: A textarea for the assigned team member. Saved on blur. Shows last-edited by + timestamp.'),
    bullet('Action bar: Status dropdown + "Assign to" dropdown + "Send Quote Email" button + "Mark Complete" button'),
    bullet('Keyboard: Escape closes drawer. J/K keys navigate to next/previous quote in the filtered list.'),
    spacer(),

    h2('19.4 Blog Management'),
    h3('Article List'),
    body('All blog articles in a data table: Title / Status (draft / scheduled / published) / Author / Category / Published Date / Views / Actions (edit, duplicate, delete).'),
    spacer(),
    h3('Article Editor'),
    body('A full-page rich text editor built on Tiptap. Two-panel layout: left (editor, 65%) / right (metadata sidebar, 35%).'),
    spacer(),
    h3('Editor Features'),
    bullet('Tiptap extensions: Bold, Italic, Underline, Strike, Code, CodeBlock, Heading (H2–H4), BulletList, OrderedList, Blockquote, HorizontalRule, Link, Image, Table, YouTube embed'),
    bullet('Markdown shortcuts: ## for H2, **bold**, *italic*, - for bullet — all transform on space key'),
    bullet('Slash commands: Type "/" to open a command palette for inserting blocks'),
    bullet('Image insertion: Uploads to R2 via the media library picker. Auto-generates alt text (Phase 2 AI feature).'),
    bullet('Word count: Live count shown in status bar at the bottom'),
    spacer(),
    h3('Metadata Sidebar'),
    bullet('SEO title (60-char limit with character counter)'),
    bullet('Meta description (160-char limit with character counter)'),
    bullet('Slug (auto-generated from title, editable)'),
    bullet('Featured image (Media Library picker)'),
    bullet('Category (single-select from predefined list)'),
    bullet('Tags (multi-select, with "Create new" option)'),
    bullet('Author (defaults to logged-in user, changeable)'),
    bullet('Publish date (date picker — set to past to publish immediately, future to schedule)'),
    bullet('"Preview" button opens the article as it will appear on the public site in a new tab'),
    spacer(),

    h2('19.5 Analytics Dashboard'),
    h3('KPI Cards (Top Row)'),
    tbl(
      ['KPI', 'Source', 'Time Range'],
      [2400, 2800, 4160],
      [
        ['Total Quote Requests', 'Database: quotes table', 'This week vs last week'],
        ['Quote Conversion Rate', 'Quotes accepted / Quotes submitted', 'Rolling 30 days'],
        ['Top Product Type', 'Most frequent product in quote_items', 'This month'],
        ['Avg. Quote Response Time', 'Time from submitted_at to first status change', 'Rolling 7 days'],
        ['Website Visitors', 'GA4 API', 'Today, yesterday, this week'],
        ['Top Traffic Source', 'GA4 API', 'This week'],
      ]
    ),
    spacer(),
    h3('Charts Section'),
    bullet('Quote Volume Over Time: Line chart, daily granularity, last 90 days. Recharts LineChart.'),
    bullet('Quotes by Product Type: Donut chart showing distribution. Recharts PieChart.'),
    bullet('Quote Funnel: Funnel chart showing step completion rates in the quote wizard (powered by GA4 funnel events). Shows where users drop off.'),
    bullet('Geographic Distribution: Table with top 10 countries by quote volume + % share.'),
    bullet('Conversion Pipeline: Horizontal bar chart showing quote status distribution (pending / reviewed / quoted / accepted / declined).'),
    spacer(),

    h2('19.6 Role & Permission System'),
    tbl(
      ['Role', 'Access Level', 'Capabilities'],
      [1600, 1600, 6160],
      [
        ['Super Admin', 'Full access', 'Everything including: team management, delete any record, settings, pricing rules'],
        ['Sales Manager', 'Quotes + Contacts + Analytics', 'View/edit all quotes, assign to team, view all contacts, export reports. Cannot delete. Cannot access blog or settings.'],
        ['Sales Rep', 'Assigned quotes only', 'View and update quotes assigned to them. View own assigned contacts. Cannot reassign. Cannot export.'],
        ['Content Editor', 'Blog + Gallery + Media', 'Create/edit/publish blog articles, approve gallery submissions, manage media library. Cannot access quotes or contacts.'],
        ['Viewer', 'Read-only', 'Can view quotes and analytics but cannot modify anything. For stakeholders, investors, or junior staff.'],
      ]
    ),
    spacer(),

    h2('19.7 Activity Log'),
    body('Every change to any admin-managed resource is logged in an activity_logs table:'),
    tbl(
      ['Column', 'Type', 'Description'],
      [2000, 1600, 5760],
      [
        ['id', 'UUID', 'Log entry ID'],
        ['admin_user_id', 'UUID FK', 'Which admin performed the action'],
        ['action', 'TEXT', 'Enum: created | updated | deleted | status_changed | assigned | exported | logged_in | logged_out'],
        ['resource_type', 'TEXT', 'Enum: quote | contact | product | blog_article | gallery_item | admin_user | setting'],
        ['resource_id', 'UUID', 'ID of the affected resource'],
        ['changes', 'JSONB', 'Before/after diff for updated records (field: { before, after }) — PII fields are masked'],
        ['ip_address', 'TEXT', 'Admin\'s IP address'],
        ['created_at', 'TIMESTAMPTZ', 'UTC timestamp'],
      ]
    ),
    body('Activity logs are displayed in the Team section (/admin/team/activity) as a filterable, searchable table. They are retained for 12 months then archived to cold storage. Logs cannot be deleted by any role including Super Admin.'),
    spacer(),

    h2('19.8 Email Template Manager'),
    body('The Tam team can edit the content of all transactional emails without developer involvement. Templates are stored in the database as Tiptap JSON (not HTML). The email renderer converts them to responsive HTML at send time.'),
    spacer(),
    tbl(
      ['Template ID', 'Trigger', 'Recipient', 'Editable Fields'],
      [2000, 2400, 1600, 3360],
      [
        ['quote_confirmation', 'Quote form submitted', 'Customer', 'Subject, greeting, body paragraphs, sign-off name, logo'],
        ['quote_internal', 'Quote form submitted', 'Sales team', 'Subject, alert message, recipient email(s)'],
        ['quote_follow_up', 'Scheduled: 48h after submission if no response', 'Customer', 'Subject, body, CTA button text + URL'],
        ['artwork_reminder', 'Quote submitted with "Upload Later"', 'Customer', 'Subject, body, upload link text'],
        ['quote_sent', 'When sales rep marks "Quote Sent"', 'Customer', 'Subject, intro paragraph (pricing is inserted dynamically)'],
        ['review_request', 'Phase 2: 14 days after order completed', 'Customer', 'Subject, body, review link'],
      ]
    ),
    spacer(),
    h3('Template Editor'),
    body('A simplified version of the blog article editor. Shows the email template in a center panel with a live preview panel on the right (renders as it will appear in Gmail/Outlook). Variable placeholders shown as colored chips: {{customer_name}}, {{reference_number}}, {{product_type}}, etc.'),
    spacer(),

    h2('19.9 Notification System (Admin)'),
    body('Admin users receive in-app notifications and optional email notifications for:'),
    bullet('New quote submission (all admins + assigned rep if pre-assigned)'),
    bullet('Quote assigned to them'),
    bullet('Quote status changed (confirmation to the admin who changed it)'),
    bullet('New customer gallery submission awaiting approval'),
    bullet('New review submitted awaiting moderation'),
    bullet('System alerts: file upload failure, email delivery failure, rate limit threshold hit'),
    spacer(),
    body('Notifications appear as a bell icon in the admin header with an unread count badge. Clicking opens a notification drawer (right side, 360px) with the last 20 notifications. Each notification has a direct link to the relevant resource.'),
    spacer(),

    h2('19.10 Settings & Configuration'),
    body('The Settings page (/admin/settings) gives Super Admins control over site-wide configuration without code changes:'),
    tbl(
      ['Setting', 'Type', 'Description'],
      [2400, 1200, 5760],
      [
        ['Announcement bar text', 'Text + Color', 'Edit the announcement bar message and accent color. Toggle on/off.'],
        ['Minimum order quantities', 'Number per product', 'Editable minimum quantity per product type — validates against quote form.'],
        ['Production time ranges', 'Number range per product', 'Min/max production days shown in quote form and product pages.'],
        ['Shipping time ranges', 'Number range per region', 'Transit days per region shown in order summary.'],
        ['Contact email addresses', 'Emails', 'Where quote notifications are sent. Multiple recipients supported.'],
        ['Maintenance mode', 'Toggle', 'Puts the site in maintenance mode — shows a branded maintenance page for all non-admin visitors.'],
        ['AI generation rate limit', 'Number', 'Max AI generations per hour per IP (Phase 2).'],
        ['Gallery auto-approve', 'Toggle', 'If ON, gallery submissions are auto-approved without admin review (Phase 3 — after trust is established).'],
        ['Lead magnet download URLs', 'File upload', 'Update the PDF files offered as lead magnets without code changes.'],
      ]
    ),
    spacer(),
    divider(),
    new Paragraph({
      children: [new TextRun({ text: ' ', size: 36 })],
      spacing: { before: 240, after: 0 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'TAM CUSTOM PATCHES', font: 'Inter', bold: true, size: 20, color: C.accent }),
        new TextRun({ text: '  ·  Website Product Specification v2.0  ·  Sections 12–19', font: 'Inter', size: 20, color: C.muted }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 160, after: 80 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'This document extends Version 1.0 and is intended for Codex implementation.', font: 'Inter', size: 18, color: C.muted, italic: true })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 0 },
    }),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT ASSEMBLY
// ═══════════════════════════════════════════════════════════════════════════════

const doc = new Document({
  title: 'Tam Custom Patches — Website Product Specification v2.0',
  subject: 'Extension of V1.0 — Sections 12–19',
  creator: 'Tam Custom Patches',
  styles: {
    default: {
      document: { run: { font: 'Inter', size: 22, color: C.primary } },
    },
    paragraphStyles: [
      {
        id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run:       { font: 'Inter', size: 40, bold: true, color: C.white },
        paragraph: { spacing: { before: 480, after: 240 }, outlineLevel: 0 },
      },
      {
        id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run:       { font: 'Inter', size: 28, bold: true, color: C.accentDk },
        paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 1 },
      },
      {
        id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run:       { font: 'Inter', size: 24, bold: true, color: C.primary },
        paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 2 },
      },
      {
        id: 'Heading4', name: 'Heading 4', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run:       { font: 'Inter', size: 21, bold: true, color: C.muted },
        paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 3 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [
          {
            level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
          {
            level: 1, format: LevelFormat.BULLET, text: '◦', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 360 } } },
          },
        ],
      },
      {
        reference: 'numbers',
        levels: [
          {
            level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'Tam Custom Patches  ·  Website Specification v2.0  ·  Sections 12–19', font: 'Inter', size: 18, color: C.muted }),
                new TextRun({ text: '\t', font: 'Inter', size: 18 }),
                new TextRun({ text: 'Confidential', font: 'Inter', size: 18, color: C.muted }),
              ],
              tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
              border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: C.border, space: 4 } },
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'Page ', font: 'Inter', size: 18, color: C.muted }),
                new TextRun({ children: [PageNumber.CURRENT], font: 'Inter', size: 18, color: C.muted }),
                new TextRun({ text: '\t', font: 'Inter', size: 18 }),
                new TextRun({ text: 'tamcustompatches.com', font: 'Inter', size: 18, color: C.muted }),
              ],
              tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
              border: { top: { style: BorderStyle.SINGLE, size: 2, color: C.border, space: 4 } },
            }),
          ],
        }),
      },
      children: [
        ...coverBlock(),
        ...buildDesignBible(),
        ...buildComponentLibrary(),
        ...buildHeroSpec(),
        ...buildProductPageSpec(),
        ...buildAIDesignerSpec(),
        ...buildAdvancedQuoteSystem(),
        ...buildDatabaseArchitecture(),
        ...buildAdminDashboard(),
      ],
    },
  ],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('/mnt/user-data/outputs/Tam_Custom_Patches_Spec_V2.docx', buf);
  console.log('✅ V2 Document written successfully.');
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
