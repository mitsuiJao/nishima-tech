import fsp from 'node:fs/promises';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { ensureDirSync, fileExistsSync } from './cache.js';
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  THUMB_WIDTH,
  THUMB_MIN_WIDTH,
  THUMB_MAX_WIDTH,
  FONT_CACHE_DIR,
  FONT_FAMILY_STACK,
  FONT_SPECS,
  LEGACY_FONT_USER_AGENT,
} from './constants.js';

let fontsPromise;

function fontSlug(name, weight) {
  return `${name.toLowerCase().replace(/\s+/g, '-')}-${weight}`;
}

function fontCachePath(name, weight) {
  return path.join(FONT_CACHE_DIR, `${fontSlug(name, weight)}.ttf`);
}

function buildGoogleFontsCssUrl() {
  const byParam = new Map();
  for (const spec of FONT_SPECS) {
    if (!byParam.has(spec.googleParam)) byParam.set(spec.googleParam, new Set());
    byParam.get(spec.googleParam).add(spec.weight);
  }
  const familyQuery = [...byParam.entries()]
    .map(([googleParam, weights]) => `family=${googleParam}:wght@${[...weights].sort((a, b) => a - b).join(';')}`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${familyQuery}&display=swap`;
}

function parseFontFaceBlocks(css) {
  const blocks = css.split('@font-face').slice(1);
  const results = [];
  for (const block of blocks) {
    const familyMatch = block.match(/font-family:\s*'([^']+)'/);
    const weightMatch = block.match(/font-weight:\s*(\d+)/);
    const urlMatch = block.match(/url\(([^)]+)\)\s*format\('(?:truetype|opentype)'\)/);
    if (familyMatch && weightMatch && urlMatch) {
      results.push({
        family: familyMatch[1],
        weight: Number(weightMatch[1]),
        url: urlMatch[1],
      });
    }
  }
  return results;
}

async function ensureFontFilesCached() {
  ensureDirSync(FONT_CACHE_DIR);
  const missing = FONT_SPECS.filter((spec) => !fileExistsSync(fontCachePath(spec.name, spec.weight)));
  if (missing.length === 0) return;

  const cssUrl = buildGoogleFontsCssUrl();
  const cssResponse = await fetch(cssUrl, { headers: { 'user-agent': LEGACY_FONT_USER_AGENT } });
  if (!cssResponse.ok) {
    throw new Error(`Google Fonts CSS request failed: ${cssResponse.status}`);
  }
  const css = await cssResponse.text();
  const faceEntries = parseFontFaceBlocks(css);

  for (const spec of missing) {
    const entry = faceEntries.find((e) => e.family === spec.name && e.weight === spec.weight);
    if (!entry) {
      throw new Error(`Could not find @font-face for ${spec.name} ${spec.weight} in Google Fonts CSS response`);
    }
    const fontResponse = await fetch(entry.url);
    if (!fontResponse.ok) {
      throw new Error(`Font file download failed for ${spec.name} ${spec.weight}: ${fontResponse.status}`);
    }
    const buffer = Buffer.from(await fontResponse.arrayBuffer());
    await fsp.writeFile(fontCachePath(spec.name, spec.weight), buffer);
  }
}

export async function loadFonts() {
  if (!fontsPromise) {
    fontsPromise = (async () => {
      try {
        await ensureFontFilesCached();
        const fonts = [];
        for (const spec of FONT_SPECS) {
          const data = await fsp.readFile(fontCachePath(spec.name, spec.weight));
          fonts.push({ name: spec.name, data, weight: spec.weight, style: 'normal' });
        }
        return fonts;
      } catch (error) {
        console.error('[og-card] Failed to load fonts', error);
        return null;
      }
    })();
  }
  return fontsPromise;
}

function hashToHue(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return hash % 360;
}

// Falls back to the fixed THUMB_WIDTH when dimensions weren't readable, so a
// photo whose aspect ratio is unknown still lays out like the no-photo case.
function computeThumbnailWidth(naturalWidth, naturalHeight) {
  if (!naturalWidth || !naturalHeight) return THUMB_WIDTH;
  const idealWidth = Math.round((naturalWidth / naturalHeight) * CARD_HEIGHT);
  return Math.min(THUMB_MAX_WIDTH, Math.max(THUMB_MIN_WIDTH, idealWidth));
}

function buildThumbnailNode({ thumbnailDataUri, thumbnailWidth, thumbnailHeight, faviconDataUri, hostname }) {
  if (thumbnailDataUri) {
    return {
      type: 'img',
      props: {
        src: thumbnailDataUri,
        width: computeThumbnailWidth(thumbnailWidth, thumbnailHeight),
        height: CARD_HEIGHT,
        // Kept for when clamping pulls the width away from the true aspect ratio.
        style: { objectFit: 'cover', flexShrink: 0 },
      },
    };
  }

  const background = `hsl(${hashToHue(hostname)}, 35%, 22%)`;

  if (faviconDataUri) {
    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: THUMB_WIDTH,
          height: CARD_HEIGHT,
          flexShrink: 0,
          background,
        },
        children: [
          {
            type: 'img',
            props: { src: faviconDataUri, width: 44, height: 44 },
          },
        ],
      },
    };
  }

  const initial = hostname.replace(/^www\./, '').slice(0, 1).toUpperCase();
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: THUMB_WIDTH,
        height: CARD_HEIGHT,
        flexShrink: 0,
        background,
        color: '#e8e8e8',
        fontSize: 44,
        fontWeight: 700,
      },
      children: initial,
    },
  };
}

export function buildCardTree({
  title,
  description,
  hostname,
  thumbnailDataUri,
  thumbnailWidth,
  thumbnailHeight,
  faviconDataUri,
}) {
  const hostRow = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 'auto',
        color: '#9a9a9a',
        fontSize: 14,
      },
      children: [
        faviconDataUri
          ? { type: 'img', props: { src: faviconDataUri, width: 16, height: 16, style: { flexShrink: 0 } } }
          : null,
        { type: 'span', props: { children: hostname } },
      ].filter(Boolean),
    },
  };

  const textColumn = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: description ? 'flex-start' : 'center',
        flex: 1,
        minWidth: 0,
        padding: '18px 26px',
        gap: 6,
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              color: '#e8e8e8',
              fontSize: 20,
              fontWeight: 700,
              lineHeight: 1.2,
              height: 24,
              overflow: 'hidden',
            },
            children: title,
          },
        },
        description
          ? {
              type: 'div',
              props: {
                style: {
                  color: '#9a9a9a',
                  fontSize: 14,
                  fontWeight: 400,
                  lineHeight: 1.3,
                  height: 36,
                  overflow: 'hidden',
                },
                children: description,
              },
            }
          : null,
        hostRow,
      ].filter(Boolean),
    },
  };

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        background: '#161616',
        fontFamily: FONT_FAMILY_STACK,
      },
      children: [
        textColumn,
        buildThumbnailNode({ thumbnailDataUri, thumbnailWidth, thumbnailHeight, faviconDataUri, hostname }),
      ],
    },
  };
}

export async function renderCardPng(tree, fonts) {
  const svg = await satori(tree, { width: CARD_WIDTH, height: CARD_HEIGHT, fonts });
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'zoom', value: 2 },
    font: { loadSystemFonts: false },
  });
  return resvg.render().asPng();
}
