/**
 * One-shot codemod: remove the inline `<i className="fa-solid fa-X" />` tags
 * scattered across the dashboard pages. FontAwesome was never loaded in the
 * project (no CDN <link>, no npm package), so these tags render as nothing
 * in production — they're just code noise.
 *
 * Run from web/:
 *   node scripts/strip-fa-icons.js
 *
 * Idempotent. Safe to delete after running.
 */

const fs = require('fs');
const path = require('path');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (entry.isFile() && entry.name.endsWith('.tsx')) out.push(p);
  }
  return out;
}

// Match <i className="fa-..." /> with an optional style={{ ... }} attribute.
// We only target self-closing <i> tags (no children) and <i ...></i> with no
// content. Greedy on attributes within the opening tag, conservative on the
// className value (no nested quotes).
const RE_SELF = /<i\s+className="[^"]*fa-[^"]*"(?:\s+style=\{\{[^{}]*\}\})?\s*\/>/g;
const RE_PAIR = /<i\s+className="[^"]*fa-[^"]*"(?:\s+style=\{\{[^{}]*\}\})?\s*><\/i>/g;

const root = path.join(__dirname, '..', 'app');
const files = walk(root);

let touched = 0;
let removed = 0;

for (const f of files) {
  const before = fs.readFileSync(f, 'utf8');
  if (!before.includes('fa-')) continue;

  let after = before;
  let local = 0;
  after = after.replace(RE_SELF, () => {
    local++;
    return '';
  });
  after = after.replace(RE_PAIR, () => {
    local++;
    return '';
  });

  if (local === 0) continue;

  fs.writeFileSync(f, after);
  touched++;
  removed += local;
  console.log('  ' + path.relative(path.join(__dirname, '..'), f) + '  (' + local + ' tags)');
}

console.log('\nTouched ' + touched + ' files, removed ' + removed + ' tags');

// Report leftovers (anything still mentioning fa-solid we didn't catch)
const leftovers = files.filter((f) => fs.readFileSync(f, 'utf8').includes('fa-solid'));
if (leftovers.length) {
  console.log('\nLEFTOVER fa-solid mentions (need manual cleanup):');
  for (const f of leftovers) console.log('  ' + path.relative(path.join(__dirname, '..'), f));
}
