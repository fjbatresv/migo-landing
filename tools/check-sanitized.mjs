import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const roots = process.argv.slice(2).length ? process.argv.slice(2) : ['.'];
const blocked = [
  /migopayments[.]com/i,
  /amazonaws[.]com/i,
  /(?:^|[^\d])(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})(?:$|[^\d])/m,
  /(?:AKIA|ASIA)[A-Z0-9]{16}/,
  /(?:sk|pk)_live_[A-Za-z0-9]{16,}/,
  /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/,
];
const skip = new Set(['.git','node_modules','.astro','playwright-report','test-results']);
const violations = [];
async function walk(path) {
  let entries;
  try { entries = await readdir(path, { withFileTypes: true }); } catch { return; }
  for (const entry of entries) {
    if (skip.has(entry.name)) continue;
    const full = join(path, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (/\.(?:html|js|mjs|ts|astro|css|svg|md|json|txt|xml|yml|yaml|toml)$/i.test(entry.name)) {
      const text = await readFile(full, 'utf8');
      for (const pattern of blocked) if (pattern.test(text)) violations.push(`${full}: blocked pattern ${pattern}`);
    }
  }
}
for (const root of roots) await walk(root);
if (violations.length) { console.error(violations.join('\n')); process.exit(1); }
console.log('Sanitized content check passed.');
