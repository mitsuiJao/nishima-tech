# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Astro 4 static site (tech notes & articles). Japanese-language content.

## Commands

```bash
npm install        # install deps

# Development
npm run dev        # Astro dev server → http://localhost:4321

# Build
npm run build      # Astro build

# Preview
npm run preview    # preview built site
```

No test framework is configured.

## Architecture

Routing and navigation are driven by `src/config.json`, which defines all routes, their titles, and which content files or collections they map to. Pages in `src/pages/` read this config to render the correct markdown content.

**Content model:**
- `src/content/pages/` — static page markdown (home, about, etc.)
- `src/content/article/` — article markdown (single file `foo.md` or directory `foo/index.md`)
- Articles are listed at `/articles` and served individually at `/<slug>`

**Images for articles** live next to the markdown, not in `public/`. If an article has images, use the directory form (`src/content/article/foo/index.md`) and put images in the same directory, referenced by relative path (`./image.png`). Astro's asset pipeline picks up relative image paths inside content collections automatically (optimizes to WebP, adds width/height, lazy-loads) — no extra config needed. Articles with no images can stay as a single `foo.md` file.

**Article frontmatter:** `title`, `date` (YYYY-MM-DD), `tags` (array).

**Markdown pipeline** (configured in `astro.config.mjs`):
- `remark-math` + `rehype-katex` — LaTeX math rendering
- `rehype-og-card` — bare URLs on their own line become OGP link cards (caches to `.cache/og-card`)

**Layout:** `BaseLayout.astro` wraps all pages with dark-mode CSS variables. Shared `header.astro` and `Footer.astro` components.

## Git workflow

- Article additions: work directly on main
- Structural/page changes: use a feature branch
