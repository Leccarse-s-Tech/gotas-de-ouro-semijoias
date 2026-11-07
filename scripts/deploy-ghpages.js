const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

execSync('node scripts/build-ghpages.js', { stdio: 'inherit' });

const browserDir = path.join(__dirname, '..', 'dist', 'gotas-de-ouro', 'browser');
const gitDir = path.join(browserDir, '.git');

if (fs.existsSync(gitDir)) {
  fs.rmSync(gitDir, { recursive: true, force: true });
}

execSync('git init', { cwd: browserDir, stdio: 'inherit' });
execSync('git checkout -B gh-pages', { cwd: browserDir, stdio: 'inherit' });
execSync('git add -A', { cwd: browserDir, stdio: 'inherit' });
execSync('git commit -m "deploy: release to github pages"', { cwd: browserDir, stdio: 'inherit' });
execSync('git remote add origin https://github.com/Leccarse-s-Tech/gotas-de-ouro-semijoias.git', { cwd: browserDir, stdio: 'inherit' });
execSync('git push -f origin gh-pages', { cwd: browserDir, stdio: 'inherit' });

console.log('Successfully deployed to gh-pages branch.');
