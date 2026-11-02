// Every file path a doc names in `backticks` must exist, so no doc sends a reader to a file that is gone.
// Usage: node scripts/lint-paths.mjs   (exit 1 if any path is missing)
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['node_modules', '.git', 'vendor', 'backup', 'reference', 'ideas', 'CHANGELOG.md', 'hairline-create', 'beui', 'shadcn', 'hallmark']); // old or private copies; the change log names files that were later removed; other people's skills use paths inside their own folder
// scripts that belong to other tools (craft, Anatomy), named in their own folders
const OTHERS = new Set(['scripts/scan.sh', 'scripts/publish.mjs']);
const docs = [];
const walk = d => { for (const f of readdirSync(d)) { const p = join(d, f); if (SKIP.has(f)) continue; statSync(p).isDirectory() ? walk(p) : f.endsWith('.md') && docs.push(p); } };
walk(KIT);

let missing = 0;
for (const doc of docs) {
  const text = readFileSync(doc, 'utf8');
  for (const [, raw] of text.matchAll(/`([^`\s]+)`/g)) {
    // only things shaped like a path inside this folder: a known top folder or a file with an extension and a slash
    const p = raw.replace(/^~\/\.claude\/design\//, '').replace(/[:#].*$/, '').replace(/\/$/, '');
    if (!/^(components|patterns|tools|scripts|hairline|notes|assets|claude)\//.test(p) || /[<>*{}]/.test(p) || OTHERS.has(p)) continue;
    if (!existsSync(join(KIT, p)) && !existsSync(join(dirname(doc), p))) { console.log(`${relative(KIT, doc)}: \`${raw}\` not found`); missing++; }
  }
}
console.log(`${docs.length} docs checked, ${missing} missing paths.`);
process.exit(missing ? 1 : 0);
