const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

execSync('npx ng build --configuration production --base-href /gotas-de-ouro-semijoias/', {
  stdio: 'inherit'
});

const browserDir = path.join(__dirname, '..', 'dist', 'gotas-de-ouro', 'browser');
const indexFile = path.join(browserDir, 'index.html');
const notFoundFile = path.join(browserDir, '404.html');
const noJekyllFile = path.join(browserDir, '.nojekyll');

if (fs.existsSync(indexFile)) {
  fs.copyFileSync(indexFile, notFoundFile);
  fs.writeFileSync(noJekyllFile, '');
  console.log('GitHub Pages build prepared at:', browserDir);
} else {
  console.error('index.html not found in browser directory');
  process.exit(1);
}
