import { createHash } from 'node:crypto';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

export function sha256(input) {
  return createHash('sha256').update(input).digest('hex');
}

export function ensureDirSync(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function fileExistsSync(filePath) {
  return fs.existsSync(filePath);
}

export async function readJsonCache(filePath, maxAgeMs) {
  try {
    const raw = await fsp.readFile(filePath, 'utf-8');
    const data = JSON.parse(raw);
    if (typeof data.cachedAt !== 'number') return null;
    if (Date.now() - data.cachedAt > maxAgeMs) return null;
    return data;
  } catch {
    return null;
  }
}

export async function writeJsonCache(filePath, data) {
  ensureDirSync(path.dirname(filePath));
  const payload = { ...data, cachedAt: Date.now() };
  await fsp.writeFile(filePath, JSON.stringify(payload));
}
