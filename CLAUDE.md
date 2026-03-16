# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

npm workspaces monorepo containing two apps:
- **apps/homepage** — Astro 4 static site (tech notes & articles). Japanese-language content.
- **apps/next** — Next.js 16 + App Router + Tailwind CSS 4 app.

## Commands

```bash
npm install                # install all workspace deps

# Development
npm run dev:homepage       # Astro dev server → http://localhost:4321
npm run dev:next           # Next.js dev server → http://localhost:3000

# Build
npm run build              # build both apps
npm run build:homepage     # Astro only
npm run build:next         # Next.js only

# Next.js lint
npm run lint -w @repo/next
```

No test framework is configured.

## Architecture — apps/homepage (Astro)

Routing and navigation are driven by `apps/homepage/src/config.json`, which defines all routes, their titles, and which content files or collections they map to. Pages in `src/pages/` read this config to render the correct markdown content.

**Content model:**
- `src/content/pages/` — static page markdown (home, about, etc.)
- `src/content/article/` — article markdown (single file `foo.md` or directory `foo/index.md`)
- Articles are listed at `/articles` and served individually at `/<slug>`

**Images for articles** go in `public/<slug>/`, never in the content directory. Reference via absolute path (`/slug/image.png`).

**Article frontmatter:** `title`, `date` (YYYY-MM-DD), `tags` (array).

**Markdown pipeline** (configured in `astro.config.mjs`):
- `remark-math` + `rehype-katex` — LaTeX math rendering
- `rehype-og-card` — bare URLs on their own line become OGP link cards (caches to `.cache/og-card`)

**Layout:** `BaseLayout.astro` wraps all pages with dark-mode CSS variables. Shared `header.astro` and `Footer.astro` components.

## Git workflow

- Article additions: work directly on main
- Structural/page changes: use a feature branch
