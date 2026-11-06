const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

function getBrowserExecutable() {
  const localApp = process.env.LOCALAPPDATA || 'C:\\Users\\hojej\\AppData\\Local';
  const candidate = path.join(localApp, 'ms-playwright', 'chromium-1234', 'chrome-win64', 'chrome.exe');
  return fs.existsSync(candidate) ? candidate : undefined;
}

const SCRATCH_DIR = path.join(__dirname, '..', '.angular', 'screenshots');
fs.mkdirSync(SCRATCH_DIR, { recursive: true });

function auditCodebase() {
  const dirsToScan = [
    path.join(__dirname, '..', 'src'),
    path.join(__dirname, '..', 'scripts')
  ];
  const rootFiles = [
    path.join(__dirname, '..', 'tailwind.config.js'),
    path.join(__dirname, '..', 'angular.json'),
    path.join(__dirname, '..', 'tsconfig.json'),
    path.join(__dirname, '..', 'tsconfig.app.json')
  ];

  const allFiles = [...rootFiles];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'editorial') walk(full);
      } else if (/\.(ts|js|html|css|json|svg)$/i.test(entry.name)) {
        allFiles.push(full);
      }
    }
  }
  dirsToScan.forEach(walk);

  const violations = [];
  const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(path.join(__dirname, '..'), file);

    if (emojiRegex.test(content)) {
      violations.push(`Emoji detectado em: ${rel}`);
    }

    const strippedUrls = content
      .replace(/https?:\/\/[^\s"'`]+/g, '')
      .replace(/\*\*\/\*/g, '');
    const hasLineComment = strippedUrls.split('\n').some(line => /^\s*\/\//.test(line));
    const hasHtmlComment = strippedUrls.includes('<!' + '--');
    if (hasLineComment || hasHtmlComment) {
      violations.push(`Comentario detectado em: ${rel}`);
    }

    if (rel.startsWith('src') && (/#ffffff/i.test(content) || /#000000/i.test(content))) {
      violations.push(`Cor proibida (#FFFFFF ou #000000) em: ${rel}`);
    }
  }

  console.log('Arquivos auditados:', allFiles.length);
  console.log('Violacoes de codigo encontradas:', violations.length);
  if (violations.length > 0) {
    console.log(violations.join('\n'));
  }
}

async function validateBrowser() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: getBrowserExecutable()
  });

  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const consoleErrors = [];
  desktopPage.on('pageerror', err => consoleErrors.push(err.message));

  await desktopPage.goto('http://localhost:4200', { waitUntil: 'networkidle', timeout: 30000 });
  await desktopPage.waitForTimeout(2000);

  await desktopPage.screenshot({ path: path.join(SCRATCH_DIR, 'desktop-hero.jpg'), quality: 90 });

  await desktopPage.evaluate(() => window.scrollTo(0, 950));
  await desktopPage.waitForTimeout(800);
  await desktopPage.screenshot({ path: path.join(SCRATCH_DIR, 'desktop-arch-expanded.jpg'), quality: 90 });

  await desktopPage.evaluate(() => document.querySelector('#colecoes')?.scrollIntoView());
  await desktopPage.waitForTimeout(800);
  await desktopPage.screenshot({ path: path.join(SCRATCH_DIR, 'desktop-collections.jpg'), quality: 90 });

  await desktopPage.evaluate(() => document.querySelector('#avaliacoes')?.scrollIntoView());
  await desktopPage.waitForTimeout(800);
  await desktopPage.screenshot({ path: path.join(SCRATCH_DIR, 'desktop-reviews.jpg'), quality: 90 });

  await desktopPage.evaluate(() => document.querySelector('#boutique')?.scrollIntoView());
  await desktopPage.waitForTimeout(800);
  await desktopPage.screenshot({ path: path.join(SCRATCH_DIR, 'desktop-boutique.jpg'), quality: 90 });

  const desktopAudit = await desktopPage.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    const brokenImgs = imgs.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src);
    const bodyText = document.body.innerText;
    return {
      title: document.title,
      imageCount: imgs.length,
      brokenImgs,
      videoCount: document.querySelectorAll('video').length,
      hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      containsBonsucessoVisible: /bonsucesso/i.test(bodyText),
      containsForbiddenCartWords: /\b(carrinho|adicionar ao carrinho|parcelamento|sem juros)\b/i.test(bodyText)
    };
  });

  console.log('Auditoria Desktop (1440x900):', JSON.stringify(desktopAudit, null, 2));

  const mobilePage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  await mobilePage.goto('http://localhost:4200', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(1500);
  await mobilePage.screenshot({ path: path.join(SCRATCH_DIR, 'mobile-hero.jpg'), quality: 90 });

  await mobilePage.evaluate(() => document.querySelector('#colecoes')?.scrollIntoView());
  await mobilePage.waitForTimeout(800);
  await mobilePage.screenshot({ path: path.join(SCRATCH_DIR, 'mobile-collections.jpg'), quality: 90 });

  const mobileAudit = await mobilePage.evaluate(() => ({
    hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth
  }));

  console.log('Auditoria Mobile (390x844):', JSON.stringify(mobileAudit, null, 2));
  console.log('Erros de console:', consoleErrors.length);

  await browser.close();
}

async function main() {
  auditCodebase();
  await validateBrowser();
}

main().catch(err => {
  console.error('Erro na validacao:', err);
  process.exit(1);
});
