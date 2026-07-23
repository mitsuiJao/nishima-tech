import path from 'node:path';

export const META_CACHE_DIR = path.join('.cache', 'og-card', 'meta');
export const FONT_CACHE_DIR = path.join('.cache', 'og-card', 'fonts');
export const OUTPUT_DIR = path.join('public', 'og-card');
export const PUBLIC_URL_PREFIX = '/og-card';

export const META_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

// Bump when the visual template changes, to force regeneration of all cards.
export const TEMPLATE_VERSION = 3;

export const CARD_WIDTH = 900;
export const CARD_HEIGHT = 140;
export const THUMB_WIDTH = 200;
export const THUMB_MIN_WIDTH = 120;
export const THUMB_MAX_WIDTH = 320;

export const CRAWLER_USER_AGENT =
  'Mozilla/5.0 (compatible; nishima-tech-og-card/1.0; +https://nishima-tech.com; link-preview)';

// An old-browser UA makes Google Fonts' CSS2 API respond with TTF font URLs
// instead of WOFF2 (which satori can't parse).
export const LEGACY_FONT_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/533.20.25 (KHTML, like Gecko) Version/5.0.4 Safari/533.20.27';

export const FONT_FAMILY_STACK = '"IBM Plex Sans", "Noto Sans JP"';

export const FONT_SPECS = [
  { name: 'IBM Plex Sans', googleParam: 'IBM+Plex+Sans', weight: 400 },
  { name: 'IBM Plex Sans', googleParam: 'IBM+Plex+Sans', weight: 700 },
  { name: 'Noto Sans JP', googleParam: 'Noto+Sans+JP', weight: 400 },
  { name: 'Noto Sans JP', googleParam: 'Noto+Sans+JP', weight: 700 },
];
