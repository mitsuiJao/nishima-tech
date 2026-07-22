import ogs from 'open-graph-scraper';
import { CRAWLER_USER_AGENT } from './constants.js';

// resvg rasterizes plain bitmap formats fine, and also happily renders nested
// SVGs, but silently produces a blank image for `.ico` (no error, no pixels) —
// so `.ico` favicons are deliberately excluded rather than shipped broken.
const IMAGE_CONTENT_TYPES = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']);
const FAVICON_CONTENT_TYPES = new Set([...IMAGE_CONTENT_TYPES, 'image/svg+xml']);
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

function resolveAbsoluteUrl(rawUrl, baseUrl) {
  if (!rawUrl) return undefined;
  try {
    return new URL(rawUrl, baseUrl).href;
  } catch {
    return undefined;
  }
}

// Google's favicon service redirects to a PNG it generates itself, so it
// works even for sites whose own favicon is an unsupported format (.ico).
export function googleFaviconFallbackUrl(hostname) {
  return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
}

export async function getOGData(url) {
  try {
    const { result } = await ogs({
      url,
      fetchOptions: { headers: { 'user-agent': CRAWLER_USER_AGENT } },
    });
    const hostname = new URL(url).hostname;
    const ogImage = Array.isArray(result.ogImage) ? result.ogImage[0] : undefined;
    const ogImageURL = resolveAbsoluteUrl(ogImage?.url, url);
    const resolvedFaviconURL = result.favicon ? resolveAbsoluteUrl(result.favicon, url) : undefined;
    const faviconURL = resolvedFaviconURL ?? googleFaviconFallbackUrl(hostname);

    return {
      title: result.ogTitle || url,
      description: result.ogDescription || undefined,
      ogImageURL,
      faviconURL,
      hostname,
    };
  } catch (error) {
    console.error('[og-card] Failed to fetch OG data for', url, error);
    return null;
  }
}

export async function downloadImageBuffer(url, { maxBytes = MAX_IMAGE_BYTES, allowSvg = false } = {}) {
  try {
    const response = await fetch(url, {
      headers: { 'user-agent': CRAWLER_USER_AGENT },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return null;

    const contentType = response.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase();
    const allowedTypes = allowSvg ? FAVICON_CONTENT_TYPES : IMAGE_CONTENT_TYPES;
    if (!contentType || !allowedTypes.has(contentType)) return null;

    const arrayBuffer = await response.arrayBuffer();
    if (arrayBuffer.byteLength > maxBytes) return null;

    return { buffer: Buffer.from(arrayBuffer), mimeType: contentType };
  } catch (error) {
    console.error('[og-card] Failed to download image', url, error);
    return null;
  }
}
