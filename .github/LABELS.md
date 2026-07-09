# GitHub Labels Setup

## Overview

This document explains how to configure GitHub labels for the Tam Custom Patches repository.

GitHub labels help organize issues by type, priority, effort estimate, and milestone.

## Automated Setup

To set up labels programmatically, use the GitHub CLI:

```bash
gh label create "type: feature" --color "1A56DB" --description "New feature or functionality"
gh label create "type: bug" --color "DC2626" --description "Something is broken"
gh label create "type: performance" --color "7C3AED" --description "Performance improvement"
gh label create "type: accessibility" --color "16A34A" --description "Accessibility improvement or fix"
gh label create "type: seo" --color "0284C7" --description "SEO-related change"
gh label create "type: security" --color "B45309" --description "Security-related change"
gh label create "type: chore" --color "64748B" --description "Maintenance, dependencies, config"
gh label create "type: docs" --color "94A3B8" --description "Documentation only"

gh label create "priority: critical" --color "7F1D1D" --description "Blocks release. Must be resolved immediately."
gh label create "priority: high" --color "DC2626" --description "Must be in current sprint."
gh label create "priority: medium" --color "D97706" --description "Should be in current sprint."
gh label create "priority: low" --color "64748B" --description "Nice to have. Next sprint or later."

gh label create "effort: XS" --color "DCFCE7" --description "< 2 hours"
gh label create "effort: S" --color "D1FAE5" --description "2–4 hours"
gh label create "effort: M" --color "FEF3C7" --description "0.5–1 day"
gh label create "effort: L" --color "FED7AA" --description "1–2 days"
gh label create "effort: XL" --color "FEE2E2" --description "3+ days. Consider breaking down."

gh label create "milestone: foundation" --color "1A1A2E" --description "Milestone 1 — Foundation"
gh label create "milestone: design-system" --color "1A56DB" --description "Milestone 2 — Design System"
gh label create "milestone: homepage" --color "7C3AED" --description "Milestone 4 — Homepage"
gh label create "milestone: quote-system" --color "16A34A" --description "Milestone 7 — Quote System"
gh label create "milestone: production" --color "B45309" --description "Milestone 20 — Production Launch"

gh label create "blocked" --color "DC2626" --description "Issue is blocked by another issue or external dependency"
gh label create "needs-design" --color "F59E0B" --description "Requires design decision before implementation"
gh label create "needs-review" --color "1A56DB" --description "PR or design is ready for review"
gh label create "good first issue" --color "16A34A" --description "Suitable for a new contributor"
```

## Manual Setup

If you prefer to set up labels manually:

1. Go to **Settings** > **Labels**
2. Click **New label** for each label below
3. Enter the label name, color, and description

| Label                      | Color     | Description                                              |
| -------------------------- | --------- | -------------------------------------------------------- |
| `type: feature`            | `#1A56DB` | New feature or functionality                             |
| `type: bug`                | `#DC2626` | Something is broken                                      |
| `type: performance`        | `#7C3AED` | Performance improvement                                  |
| `type: accessibility`      | `#16A34A` | Accessibility improvement or fix                         |
| `type: seo`                | `#0284C7` | SEO-related change                                       |
| `type: security`           | `#B45309` | Security-related change                                  |
| `type: chore`              | `#64748B` | Maintenance, dependencies, config                        |
| `type: docs`               | `#94A3B8` | Documentation only                                       |
| `priority: critical`       | `#7F1D1D` | Blocks release. Must be resolved immediately.            |
| `priority: high`           | `#DC2626` | Must be in current sprint.                               |
| `priority: medium`         | `#D97706` | Should be in current sprint.                             |
| `priority: low`            | `#64748B` | Nice to have. Next sprint or later.                      |
| `effort: XS`               | `#DCFCE7` | < 2 hours                                                |
| `effort: S`                | `#D1FAE5` | 2–4 hours                                                |
| `effort: M`                | `#FEF3C7` | 0.5–1 day                                                |
| `effort: L`                | `#FED7AA` | 1–2 days                                                 |
| `effort: XL`               | `#FEE2E2` | 3+ days. Consider breaking down.                         |
| `milestone: foundation`    | `#1A1A2E` | Milestone 1 — Foundation                                 |
| `milestone: design-system` | `#1A56DB` | Milestone 2 — Design System                              |
| `milestone: homepage`      | `#7C3AED` | Milestone 4 — Homepage                                   |
| `milestone: quote-system`  | `#16A34A` | Milestone 7 — Quote System                               |
| `milestone: production`    | `#B45309` | Milestone 20 — Production Launch                         |
| `blocked`                  | `#DC2626` | Issue is blocked by another issue or external dependency |
| `needs-design`             | `#F59E0B` | Requires design decision before implementation           |
| `needs-review`             | `#1A56DB` | PR or design is ready for review                         |
| `good first issue`         | `#16A34A` | Suitable for a new contributor                           |

## Label Usage Guidelines

### Type Labels

Apply exactly **one** `type:` label to every issue:

- `type: feature` — New functionality or enhancement
- `type: bug` — Defect or unexpected behavior
- `type: performance` — Speed, bundle size, or resource optimization
- `type: accessibility` — A11y improvements or fixes
- `type: seo` — SEO-related work
- `type: security` — Security improvements or fixes
- `type: chore` — Infrastructure, dependencies, build config
- `type: docs` — Documentation only

### Priority Labels

Apply **one** `priority:` label to issues in the current or next sprint:

- `priority: critical` — Blocks release
- `priority: high` — Must complete this sprint
- `priority: medium` — Should complete this sprint
- `priority: low` — Nice to have; next sprint or later

### Effort Labels

Apply **one** `effort:` label when the issue is being sized:

- `effort: XS` — < 2 hours
- `effort: S` — 2–4 hours
- `effort: M` — 0.5–1 day (1 week)
- `effort: L` — 1–2 days (2 weeks)
- `effort: XL` — 3+ days (2–4 weeks). Consider breaking down.

### Milestone Labels

Apply **one** `milestone:` label to connect issues to their milestone:

- `milestone: foundation` — M1: Foundation & Repository Setup
- `milestone: design-system` — M2: Design System & Tokens
- `milestone: homepage` — M4: Homepage Sections
- `milestone: quote-system` — M7: Quote System (6-Step Wizard)
- `milestone: production` — M20: Production Launch

### Status Labels

Apply status labels as needed:

- `blocked` — Work cannot proceed. Link the blocking issue in comments.
- `needs-design` — Cannot start implementation until design is approved.
- `needs-review` — PR is ready for code review; awaiting reviewer action.
- `good first issue` — Suitable for new contributors. Document setup clearly.

## References

See `docs/planning/05_Development_Roadmap_V5.md.md` for the complete label system design.
