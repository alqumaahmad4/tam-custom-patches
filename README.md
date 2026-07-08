# Tam Custom Patches

Tam Custom Patches is a premium lead-generation website for custom patches, apparel,
martial arts uniforms, and promotional products. It is not an ecommerce website:
there is no cart, checkout, or payment flow in scope.

## Milestone 1 Status

This repository is currently at **Milestone 1: Foundation & Repository Setup**.

Implemented foundation work:

- Next.js 15 App Router scaffold with React 19 and TypeScript strict mode.
- Tailwind CSS 4, shadcn/ui configuration, and shared UI primitives.
- Linting, formatting, unit test, E2E test, Lighthouse CI, and commit tooling.
- Environment examples, GitHub workflow placeholders, and issue/PR templates.
- Minimal application shell only.

Not implemented in Milestone 1:

- Homepage sections
- Quote system
- AI Designer
- Product pages
- Gallery, blog, CMS, admin, analytics, cart, checkout, or payment features

## Source Of Truth

Read project documentation in this order before planning or implementation:

1. `MASTER_INDEX.md`
2. `PROJECT_RULES.md`
3. `CODEX.md`
4. `IMPLEMENTATION_PLAN.md`
5. `ARCHITECTURE.md`
6. `docs/architecture/*`
7. `docs/planning/*`

Conflict resolution:

- `PROJECT_RULES.md` overrides `CODEX.md`.
- Use V4 content for implementation details.
- Use V3 content for visual and design decisions.
- Ignore ecommerce references in older documents.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- Framer Motion
- Vitest
- Playwright
- Lighthouse CI

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run checks:

```bash
npm run type-check
npm run lint
npm run test
npm run build
```

Install Playwright browsers before the first E2E run:

```bash
npm run test:e2e:install
npm run test:e2e
```

On Windows, if certificate validation blocks package installation, run the commands
from PowerShell with:

```powershell
$env:NODE_OPTIONS = "--use-system-ca"
$env:npm_config_cache = "$(Get-Location)\.npm-cache"
npm.cmd install
```

## Environment

Copy `.env.example` to `.env.local` for local development and fill values only when
the relevant integration is implemented. Milestone 1 does not require external
service credentials.

## Quality Gates

- TypeScript must pass with strict mode enabled.
- ESLint must pass with zero warnings.
- Unit and E2E tests should cover newly added behavior.
- Lighthouse target remains 95+ for performance, accessibility, SEO, and best
  practices once user-facing pages are implemented.
