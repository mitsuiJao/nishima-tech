#!/usr/bin/env node
// Manually force-refreshes OGP link cards: clears the cached metadata so every
// linked URL is re-scraped (picking up title/thumbnail changes or sites that
// previously failed), rebuilds the site, then removes any card PNGs under
// public/og-card/ that are no longer referenced by the built output.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const META_CACHE_DIR = path.join('.cache', 'og-card', 'meta');
const OUTPUT_DIR = path.join('public', 'og-card');
const DIST_DIR = 'dist';

console.log('[og-card:refresh] Clearing cached OGP metadata to force a fresh scrape...');
fs.rmSync(META_CACHE_DIR, { recursive: true, force: true });

console.log('[og-card:refresh] Clearing Astro content cache so markdown is reprocessed...');
fs.rmSync(path.join('.astro', 'data-store.json'), { force: true });
fs.rmSync(path.join('node_modules', '.astro', 'data-store.json'), { force: true });

console.log('[og-card:refresh] Building the site (re-fetches OGP data, re-renders changed cards)...');
execSync('npm run build', { stdio: 'inherit' });

console.log('[og-card:refresh] Scanning build output for referenced card images...');
const referenced = new Set();
const htmlFiles = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  }
})(DIST_DIR);

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf-8');
  for (const match of html.matchAll(/\/og-card\/([a-f0-9]{64})\.png/g)) {
    referenced.add(match[1]);
  }
}

console.log(`[og-card:refresh] ${referenced.size} card(s) currently in use.`);

let removed = 0;
for (const entry of fs.readdirSync(OUTPUT_DIR)) {
  if (!entry.endsWith('.png')) continue;
  const hash = entry.slice(0, -'.png'.length);
  if (!referenced.has(hash)) {
    fs.rmSync(path.join(OUTPUT_DIR, entry));
    removed += 1;
  }
}

console.log(`[og-card:refresh] Removed ${removed} orphaned card image(s).`);
console.log('[og-card:refresh] Done. Review `git status` / `git diff --stat public/og-card` and commit if it looks right.');
