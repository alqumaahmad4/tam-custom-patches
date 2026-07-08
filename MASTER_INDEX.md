# MASTER_INDEX.md

# Tam Custom Patches
## Master Documentation Index

Version 1.0

---

# Purpose

This repository contains multiple documentation files covering product strategy, design, engineering, implementation, and development standards.

This document is the navigation guide.

It tells developers, AI coding agents, designers, and project managers exactly where to find authoritative information.

If two documents appear to overlap, follow the document hierarchy defined below.

---

# Documentation Hierarchy (Highest Authority → Lowest)

| Priority | Document | Purpose |
|----------:|----------|---------|
| 1 | PROJECT_RULES.md | Non-negotiable project standards and engineering rules. |
| 2 | CODEX.md | Operating manual for AI coding agents. Defines implementation philosophy and constraints. |
| 3 | docs/04_Engineering_Specification_V4.md | Technical architecture, APIs, engineering standards, analytics, security, performance, 3D hero implementation. |
| 4 | docs/03_Visual_Design_Bible_V3.md | Visual identity, UI system, motion, art direction, interaction design. |
| 5 | docs/02_System_Specification_V2.md | Components, design system, CMS, database concepts, feature specifications. |
| 6 | docs/01_Product_Requirements_V1.md | Product goals, information architecture, user experience, website requirements. |
| 7 | docs/06_Development_Roadmap_V5_1.md | Execution roadmap, milestones, dependencies, sprint planning, acceptance criteria. |
| 8 | docs/05_Development_Roadmap_V5.md | Original development roadmap and GitHub project structure. |
| 9 | IMPLEMENTATION_PLAN.md | Recommended build order. |
| 10 | README.md | Project overview and setup instructions. |

---

# Quick Navigation

## Product Vision

Read:

- docs/01_Product_Requirements_V1.md

Includes:

- Business goals
- Website objectives
- User journeys
- Sitemap
- Feature overview
- Conversion strategy

---

## UI Components

Read:

- docs/02_System_Specification_V2.md

Includes:

- Component library
- Component behaviors
- Responsive layouts
- Design system
- UI specifications

---

## Visual Design

Read:

- docs/03_Visual_Design_Bible_V3.md

Includes:

- Colors
- Typography
- Motion
- Photography
- Hero art direction
- Animation
- UI consistency
- Premium design standards

---

## Engineering

Read:

- docs/04_Engineering_Specification_V4.md

Includes:

- Frontend architecture
- Backend architecture
- CMS
- Analytics
- Security
- Performance
- API contracts
- Folder structure
- 3D hero engineering

---

## Development Roadmap

Read:

- docs/06_Development_Roadmap_V5_1.md

Includes:

- Milestones
- GitHub releases
- Sprint planning
- Risks
- Acceptance criteria
- Phase 1 / Phase 2 planning

---

## Build Order

Read:

- IMPLEMENTATION_PLAN.md

Use this document before beginning any milestone.

---

## Coding Rules

Read:

- PROJECT_RULES.md

This document defines:

- Code quality
- Accessibility
- Performance
- Design consistency
- Definition of Done
- Non-negotiable engineering standards

Always follow this document.

---

## AI Development Rules

Read:

- CODEX.md

This document tells AI coding agents:

- How to implement features
- Which documents take priority
- Development philosophy
- Architectural constraints
- What requires approval before changes

---

# Feature Reference Matrix

| Feature | Primary Document | Supporting Documents |
|---------|------------------|----------------------|
| Homepage | V1 | V2, V3, V4 |
| 3D Hero | V4 | V3 |
| Mega Menu | V2 | V3 |
| Product Pages | V1 | V2, V3 |
| Quote Wizard | V4 | V2, V1 |
| AI Patch Designer | V4 | V2, V3 |
| Gallery | V2 | V3 |
| Blog | V2 | V1 |
| Industries | V1 | V2 |
| CMS | V4 | V2 |
| Admin Dashboard | V4 | V2 |
| Analytics | V4 | V5.1 |
| SEO | V4 | V1 |
| Accessibility | V4 | PROJECT_RULES.md |
| Performance | V4 | PROJECT_RULES.md |
| Testing | V5.1 | PROJECT_RULES.md |
| Deployment | V5.1 | README.md |

---

# Development Workflow

Every feature should follow this sequence:

1. Read the Product Requirements (V1) to understand the business objective.
2. Read the System Specification (V2) to understand the component and feature requirements.
3. Read the Visual Design Bible (V3) to understand the intended user experience and visual standards.
4. Read the Engineering Specification (V4) for architecture, APIs, performance, analytics, and security.
5. Read the Development Roadmap (V5.1) for dependencies, acceptance criteria, and implementation order.
6. Follow PROJECT_RULES.md during implementation.
7. Follow CODEX.md throughout development.

---

# Conflict Resolution

If documentation conflicts occur, resolve them in this order:

1. PROJECT_RULES.md
2. CODEX.md
3. Engineering Specification (V4)
4. Visual Design Bible (V3)
5. System Specification (V2)
6. Product Requirements (V1)
7. Development Roadmap (V5.1)
8. Implementation Plan
9. README.md

If a conflict still exists, stop implementation and request clarification before proceeding.

---

# Definition of Ready

Before implementing any feature, confirm that:

- Business requirements are defined.
- UI and UX specifications are complete.
- Visual standards are documented.
- Technical architecture is available.
- Dependencies are satisfied.
- Acceptance criteria are defined.

If any of these are missing, do not begin implementation.

---

# Definition of Done

A feature is complete only when:

- Functionality matches the specifications.
- Design matches the Visual Design Bible.
- Engineering follows the Engineering Specification.
- Accessibility meets WCAG AA.
- Performance budgets are met.
- SEO requirements are implemented.
- Analytics events are configured.
- Tests pass.
- Documentation is updated where required.
- Code complies with PROJECT_RULES.md.

---

# Repository Structure

```text
tam-custom-patches/
│
├── MASTER_INDEX.md
├── CODEX.md
├── PROJECT_RULES.md
├── IMPLEMENTATION_PLAN.md
├── README.md
│
├── docs/
│   ├── 01_Product_Requirements_V1.md
│   ├── 02_System_Specification_V2.md
│   ├── 03_Visual_Design_Bible_V3.md
│   ├── 04_Engineering_Specification_V4.md
│   ├── 05_Development_Roadmap_V5.md
│   └── 06_Development_Roadmap_V5_1.md
│
├── app/
├── components/
├── features/
├── lib/
├── hooks/
├── services/
├── styles/
├── public/
├── tests/
└── ...
```

---

# Guiding Principle

Every document in this repository exists to support one goal:

> Build the highest-quality, most trustworthy, and most performant lead-generation website in the custom patches and apparel industry.

If a proposed change improves the product while remaining consistent with the documented standards, it should be implemented.

If it conflicts with the documented standards, update the documentation first, then implement the change.

This documentation set is the project's single source of truth.