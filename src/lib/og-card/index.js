import fsp from 'node:fs/promises';
import path from 'node:path';
import { visitParents } from 'unist-util-visit-parents';
import { isElement } from 'hast-util-is-element';
import { h } from 'hastscript';
import { getOGData, downloadImageBuffer, googleFaviconFallbackUrl } from './network.js';
import { loadFonts, buildCardTree, renderCardPng } from './render.js';
import { sha256, ensureDirSync, fileExistsSync, readJsonCache, writeJsonCache } from './cache.js';
import {
  META_CACHE_DIR,
  OUTPUT_DIR,
  PUBLIC_URL_PREFIX,
  META_MAX_AGE_MS,
  TEMPLATE_VERSION,
  CARD_WIDTH,
  CARD_HEIGHT,
} from './constants.js';

const BARE_URL_PATTERN = /^https?:\/\/\S+$/;

function isValidUrl(value) {
  if (!BARE_URL_PATTERN.test(value)) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function isTextNode(node) {
  return Boolean(node) && node.type === 'text';
}

// Returns the href if `node` is a bare-URL text node, or an `<a href>` whose
// only child's text is identical to the href (e.g. `[https://x](https://x)`).
function findBareLinkHref(node) {
  if (isTextNode(node)) {
    const trimmed = node.value.trim();
    return isValidUrl(trimmed) ? trimmed : null;
  }
  if (
    isElement(node, 'a') &&
    typeof node.properties?.href === 'string' &&
    isValidUrl(node.properties.href) &&
    node.children.length === 1 &&
    isTextNode(node.children[0]) &&
    node.children[0].value.trim() === node.properties.href
  ) {
    return node.properties.href;
  }
  return null;
}

async function toDataUri(url, options) {
  const downloaded = await downloadImageBuffer(url, options);
  if (!downloaded) return null;
  return `data:${downloaded.mimeType};base64,${downloaded.buffer.toString('base64')}`;
}

const FAVICON_DOWNLOAD_OPTIONS = { allowSvg: true, maxBytes: 1024 * 1024 };

// Many sites only publish a `.ico` favicon, which resvg can't rasterize (see
// network.js). Google's favicon service always redirects to a PNG it
// generates itself, so it's tried as a second attempt before giving up.
async function resolveFaviconDataUri(faviconURL, hostname) {
  if (faviconURL) {
    const primary = await toDataUri(faviconURL, FAVICON_DOWNLOAD_OPTIONS);
    if (primary) return primary;
  }
  const fallbackURL = googleFaviconFallbackUrl(hostname);
  if (fallbackURL === faviconURL) return null;
  return toDataUri(fallbackURL, FAVICON_DOWNLOAD_OPTIONS);
}

async function getOrRenderCardPng(ogData) {
  const { title, description, ogImageURL, faviconURL, hostname } = ogData;
  const renderKey = sha256(
    JSON.stringify({
      v: TEMPLATE_VERSION,
      title,
      description: description ?? null,
      hostname,
      ogImageURL: ogImageURL ?? null,
      faviconURL: faviconURL ?? null,
    }),
  );
  const filename = `${renderKey}.png`;
  const pngPath = path.join(OUTPUT_DIR, filename);

  if (fileExistsSync(pngPath)) return filename;

  const fonts = await loadFonts();
  if (!fonts) return null;

  try {
    const [thumbnailDataUri, faviconDataUri] = await Promise.all([
      ogImageURL ? toDataUri(ogImageURL) : null,
      resolveFaviconDataUri(faviconURL, hostname),
    ]);
    const tree = buildCardTree({ title, description, hostname, thumbnailDataUri, faviconDataUri });
    const png = await renderCardPng(tree, fonts);
    ensureDirSync(OUTPUT_DIR);
    await fsp.writeFile(pngPath, png);
    return filename;
  } catch (error) {
    console.error('[og-card] Failed to render card image', error);
    return null;
  }
}

async function processMatch(node, ancestors) {
  const href = findBareLinkHref(node);
  if (!href) return;

  const parent = ancestors[ancestors.length - 1];
  if (!parent || !isElement(parent, 'p')) return;
  if (parent.children.length !== 1) return;
  if (ancestors.some((ancestor) => isElement(ancestor) && ['ul', 'ol'].includes(ancestor.tagName))) return;

  const grandparent = ancestors[ancestors.length - 2];
  if (!grandparent || !('children' in grandparent)) return;

  const metaKey = sha256(href);
  const metaPath = path.join(META_CACHE_DIR, `${metaKey}.json`);

  let ogData = await readJsonCache(metaPath, META_MAX_AGE_MS);
  if (!ogData) {
    ogData = await getOGData(href);
    if (!ogData) return;
    await writeJsonCache(metaPath, ogData);
  }

  const filename = await getOrRenderCardPng(ogData);
  if (!filename) return;

  const cardElement = h('div.og-card-container', [
    h('a', { href, target: '_blank', rel: 'noopener noreferrer' }, [
      h('img.og-card-image', {
        src: `${PUBLIC_URL_PREFIX}/${filename}`,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        alt: ogData.title,
        loading: 'lazy',
        decoding: 'async',
      }),
    ]),
  ]);

  const index = grandparent.children.indexOf(parent);
  if (index === -1) return;
  grandparent.children.splice(index, 1, cardElement);
}

export default function rehypeOgCard() {
  return async (tree) => {
    const jobs = [];
    visitParents(tree, ['element', 'text'], (node, ancestors) => {
      jobs.push(processMatch(node, [...ancestors]));
    });
    await Promise.all(jobs);
  };
}
