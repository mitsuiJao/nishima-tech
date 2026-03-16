# CLAUDE.md — Oh My Zsh Prompt Builder (apps/next)

## Overview

Visual web tool for designing custom zsh prompts. Users compose prompts by combining segments (username, directory, git info, decorators, etc.), apply ANSI colors, preview in real-time, and export a `.zshrc` configuration file.

Built with **Next.js 16 + App Router + Tailwind CSS 4 + TypeScript**.

## Architecture

### State Management

Single `useReducer` in `PromptBuilder.tsx` (root component) manages all prompt state via `PromptState` / `PromptAction` discriminated union.

**Actions:**
- `ADD_SEGMENT` — append a segment by `segmentId`
- `REMOVE_SEGMENT` — remove by `instanceId`
- `MOVE_SEGMENT` — shift segment up/down by arrow buttons
- `REORDER_SEGMENTS` — drag-and-drop reorder (fromIndex → toIndex)
- `SET_COLOR` — set fg/bg `AnsiColor` on a segment
- `LOAD_PRESET` — replace all segments with a preset template
- `CLEAR_ALL` — clear all segments (returns to Get Started screen)

### Component Tree

```
PromptBuilder (state owner, reducer, resizable layout)
├── Header (title, Templates button, About button, preset dropdown, download)
│   ├── TemplatesModal (modal overlay, preserves current state)
│   └── AboutModal
├── Sidebar (segment catalog, collapsible categories)
│   └── SegmentItem (clickable to add)
├── ResizeHandle (drag-to-resize panels)
├── ActiveSegmentList (drag-and-drop list)
│   └── ActiveSegment (per-segment controls, color picker)
│       └── ColorPicker (fg/bg ANSI color selection)
├── TerminalPreview (live prompt preview on dark background)
├── RawOutput (.zshrc output with copy button)
└── PresetGallery (Get Started screen, shown when segments are empty)
```

### Key Files

| Path | Purpose |
|------|---------|
| `src/types/prompt.ts` | Core types: `AnsiColor`, `SegmentDefinition`, `ActiveSegmentData`, `PromptAction`, `PresetTheme` |
| `src/lib/segments.ts` | Segment definitions (prompt, git, decorators, plugins), category labels, lookup |
| `src/lib/presets.ts` | 10 preset themes (robbyrussell, agnoster, minimal, clean, refined, powerline, lambda, pure, spaceship, bullet-train) |
| `src/lib/generator.ts` | `generatePromptString()` — zsh escape codes; `generateZshrc()` — full .zshrc; `getMockPreview()` — web preview data; CSS color maps |
| `src/app/layout.tsx` | Root layout with SEO metadata, Geist fonts |
| `src/app/page.tsx` | Single page rendering `<PromptBuilder />` |

## Data Model

### Segment Definition (`SegmentDefinition`)
Each segment has:
- `id` — unique identifier
- `label` — display name in sidebar
- `code` — actual zsh code emitted in .zshrc (e.g., `%n`, `$(git_current_branch)`, `\uE0B0`)
- `mockValue` — text shown in web preview (standard Unicode, NOT Private Use Area characters)
- `category` — one of: `prompt`, `git`, `decorators`, `plugins`
- `description` — tooltip/help text

### Active Segment (`ActiveSegmentData`)
A placed instance of a segment:
- `instanceId` — unique per-instance (format: `{segmentId}-{random6}`)
- `segmentId` — references `SegmentDefinition.id`
- `fg` / `bg` — `AnsiColor` (17 values: 8 base + 8 bold/bright + `"default"`)

### Important: `code` vs `mockValue`
- `code` — emitted in the .zshrc output. May contain Nerd Font / Powerline PUA characters (e.g., `\uE0B0`) or shell commands.
- `mockValue` — displayed in the web browser preview. Must use standard Unicode only (e.g., `◢` instead of Powerline `\uE0B0`, `"OS"` text instead of Nerd Font `\uF179`).

## UI/UX Specifications

### Layout
- Three-column layout: Sidebar (segments catalog) | Active Segments | Preview + Output
- Sidebar and Active Segments columns are **resizable** via drag handles (`ResizeHandle` component)
- Sidebar default width: 280px (min 200, max 500)
- Active Segments default width: 300px (min 220, max 500)
- Preview area fills remaining space

### Navigation
- **Title click** ("Oh My Zsh Prompt Builder") → dispatches `CLEAR_ALL`, returns to Get Started screen
- **Templates button** → opens `TemplatesModal` as overlay. Current prompt state is preserved. Selecting a template replaces all segments.
- **Empty state** (no segments) → automatically shows `PresetGallery` (Get Started) inline in the preview area

### Drag and Drop
- HTML5 Drag and Drop API (no external libraries)
- Active segments are reorderable by dragging
- Visual drop indicator: indigo `border-t-2` / `border-b-2` at drop target
- Arrow buttons (up/down) also available for keyboard reordering

### Color Picker
- 17 ANSI colors as swatches (5×9 grid, `h-5 w-5` each)
- Shows color name label (e.g., "Bright Red") for selected color
- Selected swatch: `scale-125`, indigo ring
- Separate pickers for foreground and background

### Terminal Preview
- Dark background (`#1e1e1e`), monospace font
- No Mac-style traffic light dots
- Uses `getMockPreview()` to render colored spans with inline styles
- Blinking cursor (`|`) at end
- Font: `text-base leading-7`

### Template Cards (PresetGallery & TemplatesModal)
- Grid: 1/2/3 columns responsive
- Each card: terminal preview on top, info section below
- Info section: fixed height `h-[4.5rem]`, title truncated, description `line-clamp-2`
- No Mac-style traffic light dots

### Fonts
- App uses Geist (sans) + Geist Mono
- Terminal preview areas use monospace (`font-mono`)

### Theme
- Light/dark mode with `ThemeToggle` component
- Dark mode: zinc-based palette
- Accent color: indigo

## Code Generation

`generateZshrc()` produces a `.zshrc` file with:
- Header comments
- `PROMPT='...'` line with zsh escape sequences
- Segments wrapped in `%F{color}`, `%K{color}`, `%B`/`%b` as needed

Color wrapping logic (`wrapWithColor`):
- `fg !== default && bg !== default` → `%F{fg}%K{bg}code%k%f`
- `fg !== default` only → `%F{fg}code%f`
- `bg !== default` only → `%K{bg}code%k`
- Bold colors (`bold_*`) → wrapped with `%B`...`%b`

## Known Constraints

- No test framework configured
- Powerline/Nerd Font PUA characters cannot render in standard web fonts — always use standard Unicode fallbacks in `mockValue`
- No external DnD or UI component libraries — all interactions are built with native APIs
- Build: `npm run build:next` (from monorepo root)
- Dev: `npm run dev:next` → http://localhost:3000
- Node.js path may need: `export PATH="/home/nishima/.nvm/versions/node/v24.14.0/bin:$PATH"`
