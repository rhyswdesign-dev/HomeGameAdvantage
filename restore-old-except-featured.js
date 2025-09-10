const fs = require('fs');
const path = require('path');

const root = process.cwd();
const srcDir = path.join(root, 'src');

if (!fs.existsSync(srcDir)) {
  console.log('No src/ directory found; nothing to restore.');
  process.exit(0);
}

// find all "*.backup.*.(ts|tsx|js|jsx)" under src/
const backupRe = /\.backup\.[^/]+\.(tsx|ts|jsx|js)$/i;
const featuredRe = new RegExp(
  String.raw`[/\\]src[/\\]screens[/\\]FeaturedScreen\.(tsx|ts|jsx|js)$`,
  'i'
);

function walk(dir, acc) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (backupRe.test(p)) acc.push(p);
  }
}

const backups = [];
walk(srcDir, backups);
if (backups.length === 0) {
  console.log('No *.backup.* files found under src/. Nothing to restore.');
  process.exit(0);
}

// group backups by their target path (strip ".backup.*")
const groups = {};
for (const file of backups) {
  const base = file.replace(backupRe, (m, ext) => `.${ext}`);
  (groups[base] ||= []).push({ file, mtime: fs.statSync(file).mtimeMs });
}

let restored = 0, skipped = 0;
for (const base of Object.keys(groups)) {
  // keep the new Featured screen; skip restoring any backups there
  if (featuredRe.test(base)) {
    console.log(`SKIP (keep new Featured): ${base}`);
    skipped++;
    continue;
  }
  const newest = groups[base].sort((a,b)=>b.mtime-a.mtime)[0].file;
  fs.mkdirSync(path.dirname(base), { recursive: true });
  fs.copyFileSync(newest, base);
  console.log(`Restored: ${base}  <=  ${path.basename(newest)}`);
  restored++;
}

console.log(`Done. Restored: ${restored}, Skipped Featured: ${skipped}`);
