# Tam Custom Patches — Project Rules

## Mission

Build the world's highest-quality lead-generation website for the custom patches and apparel industry.

Every decision must improve:

- User Experience
- Performance
- Accessibility
- SEO & GEO
- Maintainability
- Scalability
- Trust
- Conversion Rate

---

# Technology Stack

Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- Framer Motion
- Lucide Icons

Backend
- Route Handlers
- PostgreSQL (future)
- Cloudflare R2
- Vercel
- Cloudflare

Analytics
- GA4
- GTM
- Microsoft Clarity
- Meta Pixel
- LinkedIn Insight

---

# Architecture Principles

Always prioritize:

1. Simplicity
2. Maintainability
3. Scalability
4. Accessibility
5. Performance
6. SEO
7. Component Reuse

Never optimize for short-term convenience.

---

# Design Rules

Never invent new colors.

Never invent spacing.

Never invent typography.

Never invent shadows.

Never invent animations.

Always follow:

- Design Bible (V3)
- Engineering Specification (V4)

---

# Component Rules

Every component must be:

✓ Reusable

✓ Typed

✓ Accessible

✓ Responsive

✓ Animated consistently

✓ Documented

✓ Independent

Avoid components larger than 300 lines.

Extract logic into hooks.

---

# Performance Rules

Homepage Lighthouse

95+

Product Pages

95+

LCP

<1.8 s

CLS

<0.05

INP

<150 ms

Bundle Size

Keep JavaScript as small as possible.

---

# Accessibility

Every page must:

✓ Keyboard accessible

✓ Screen reader friendly

✓ WCAG AA

✓ Reduced motion support

✓ Focus indicators

✓ Semantic HTML

---

# Code Quality

Always:

- TypeScript Strict Mode
- ESLint clean
- Prettier formatted
- No console logs
- No dead code
- No duplicated logic

---

# Images

Always:

- next/image
- AVIF/WebP
- Lazy loading
- Responsive sizes
- Blur placeholders

---

# Animations

Always:

- Framer Motion
- GPU accelerated
- 60fps
- Elegant
- Minimal
- Respect prefers-reduced-motion

---

# Before Every Commit

Must pass:

npm run lint

npm run typecheck

npm run test

npm run build

---

# Definition of Done

A feature is complete only if:

✓ Responsive

✓ Accessible

✓ Typed

✓ Tested

✓ SEO compliant

✓ Matches Design Bible

✓ Performance budget met

✓ No TypeScript errors

✓ No ESLint errors

✓ Animations polished

---

# Never Do

❌ Duplicate components

❌ Hardcode colors

❌ Hardcode spacing

❌ Ignore accessibility

❌ Ignore loading states

❌ Ignore error states

❌ Break design consistency

❌ Sacrifice maintainability

---

# Guiding Principle

When multiple solutions exist, choose the one that is:

1. Easier to maintain
2. More reusable
3. Faster
4. More accessible
5. More scalable
6. More elegant