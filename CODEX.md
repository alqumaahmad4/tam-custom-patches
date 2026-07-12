# CODEX.md

# Tam Custom Patches
## Codex Operating Manual

Version 1.0

---

# Mission

Your responsibility is to build the highest-quality lead-generation website in the custom patches and apparel industry.

Every implementation decision must improve one or more of the following:

- User Experience
- Maintainability
- Scalability
- Accessibility
- Performance
- SEO
- GEO
- Conversion Rate
- Code Quality

This project is intended to be production-ready and enterprise-grade.

Do not treat it as a prototype.

---

# Project Purpose

Tam Custom Patches is a premium manufacturing company specializing in:

- Custom Patches
- Custom Apparel
- Martial Arts Uniforms
- Promotional Products

This website is NOT an ecommerce website.

The primary objective is generating high-quality quote requests.

Every design and engineering decision should support this goal.

---

# Source of Truth

Always follow these documents in order of priority.

1. PROJECT_RULES.md
2. Visual Design Bible (V3)
3. Technical Engineering Specification (V4)
4. Product Requirements (V1)
5. Systems Specification (V2)
6. Development Roadmap (V5)
7. IMPLEMENTATION_PLAN.md
8. README.md

Never contradict these documents.

If conflicts exist, stop and explain them before implementing.

---

# Development Philosophy

Build like a senior engineering team at:

- Vercel
- Stripe
- Shopify
- Apple
- Linear
- Framer

Prioritize quality over speed.

Never implement shortcuts that reduce maintainability.

---

# Engineering Principles

Always choose solutions that are:

- Reusable
- Maintainable
- Accessible
- Performant
- Well documented
- Type-safe
- Scalable

When multiple approaches exist:

Choose the one that will still be the best solution five years from now.

---

# Implementation Strategy

Never attempt to build the entire website in one step.

Always work in phases.

Phase order:

1. Foundation
2. Design System
3. Global Layout
4. Homepage
5. Hero Sliders
6. Quote Wizard
7. Product Pages
8. AI Design Studio
9. CMS/Admin
10. Analytics
11. SEO
12. Performance
13. Testing
14. Launch

Complete one phase before beginning another.

---

# Component Rules

Every component must be:

- Independent
- Reusable
- Typed
- Accessible
- Responsive
- Tested
- Animated consistently

Avoid components larger than approximately 300 lines.

Split complex components into smaller reusable parts.

Never duplicate functionality.

---

# Design Rules

Never invent:

- Colors
- Typography
- Spacing
- Shadows
- Border radius
- Motion timing

Always use the Design Bible.

Visual consistency is mandatory.

---

# Motion Rules

Animations should feel:

- Premium
- Elegant
- Smooth
- Natural
- Fast

Never flashy.

Always respect:

prefers-reduced-motion

Maintain consistent easing and timing throughout the project.

---

# Performance Rules

Always optimize for:

Core Web Vitals

Lighthouse

Accessibility

Image loading

Bundle size

Code splitting

Lazy loading

Avoid unnecessary JavaScript.

Optimize every image.

---

# Accessibility

Every feature must support:

Keyboard navigation

Screen readers

Focus indicators

Semantic HTML

Proper ARIA attributes

WCAG AA compliance

Accessibility is never optional.

---

# SEO & GEO

Every page must include:

Semantic HTML

Metadata

Structured data

Proper heading hierarchy

Internal linking

Canonical URLs

Schema.org markup

Image alt text

Search engine optimization must never be an afterthought.

---

# Security

Always assume production.

Validate:

Input

Files

Forms

Uploads

Protect against:

Spam

Abuse

Rate-limit violations

Invalid data

Never expose secrets.

---

# Quote System

The quote system is the most important feature of the website.

Every decision should optimize:

Speed

Clarity

Trust

Completion rate

Reduce friction wherever possible.

---

# AI Design Studio

Build as a premium product.

The experience should feel:

Modern

Simple

Powerful

Professional

Avoid unnecessary complexity.

---

# Code Quality

Maintain:

Strict TypeScript

Clean architecture

Reusable utilities

Minimal duplication

Consistent naming

Readable code

Document complex logic.

---

# Folder Organization

Maintain a predictable structure.

Group by feature.

Avoid deeply nested folders.

Prefer composition over inheritance.

---

# Dependencies

Before adding a dependency ask:

Can this already be solved with:

React

Next.js

TypeScript

Tailwind

shadcn/ui

Framer Motion

If yes:

Do not install another package.

Keep dependencies minimal.

---

# Error Handling

Every feature must include:

Loading state

Empty state

Success state

Error state

Retry strategy

Graceful fallback

Never leave users without feedback.

---

# Before Every Commit

Ensure:

No TypeScript errors

No ESLint errors

Build succeeds

Responsive layout verified

Accessibility verified

Performance acceptable

Animations polished

Design matches specification

---

# If Requirements Are Unclear

Never guess.

Instead:

Explain the ambiguity.

Propose the best solution.

Explain why.

Wait for approval if the change affects architecture or user experience.

---

# Never Change Without Approval

Do not modify:

Brand identity

Design system

Navigation structure

Homepage architecture

Quote flow

AI Design Studio workflow

SEO architecture

Analytics strategy

Folder structure

Core technology stack

These are considered architectural decisions.

---

# Definition of Done

A feature is complete only if it is:

✓ Functional

✓ Responsive

✓ Accessible

✓ Type-safe

✓ Tested

✓ Optimized

✓ SEO compliant

✓ Consistent with the Design Bible

✓ Performance budget met

✓ Approved against project specifications

---

# Final Principle

Do not optimize for writing code.

Optimize for building the best product.

Every implementation should make users think:

"This company is premium."

"This company is trustworthy."

"This website feels effortless."

Every line of code should contribute to that experience.