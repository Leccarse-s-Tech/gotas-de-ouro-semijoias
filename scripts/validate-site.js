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

    if (rel.startsWith('src') && /feTurbulence/i.test(content)) {
      violations.push(`feTurbulence detectado em: ${rel}`);
    }

    if (rel.endsWith('.component.ts') && !content.includes('ChangeDetectionStrategy.OnPush')) {
      violations.push(`Componente sem OnPush: ${rel}`);
    }

    if (rel.endsWith('.component.ts')) {
      if (/\b(transition-all|transition-transform|duration-\d+|ease-spring)\b/.test(content)) {
        violations.push(`Conflito Tailwind transition/duration detectado em: ${rel}`);
      }
      if (/\.currentTime\s*=/.test(content)) {
        violations.push(`Mutacao de video.currentTime no scroll detectada em: ${rel}`);
      }
      if (/\b(mix-blend-multiply|backdrop-blur|shadow-2xl|drop-shadow)\b/.test(content)) {
        violations.push(`Filtro pesado (mix-blend/backdrop-blur/shadow) detectado em: ${rel}`);
      }
      if (/\(mousemove\)|\(scroll\)/.test(content)) {
        violations.push(`Listener de alta frequencia no template Angular em: ${rel}`);
      }
    }
  }

  const editorialDir = path.join(__dirname, '..', 'src', 'assets', 'editorial');
  ['brand-deboss-box.jpg', 'brand-limestone-plaque.jpg'].forEach(fakeImg => {
    if (fs.existsSync(path.join(editorialDir, fakeImg))) {
      violations.push(`Imagem falsa nao removida: ${fakeImg}`);
    }
  });

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
  await desktopPage.waitForTimeout(1500);

  await desktopPage.screenshot({ path: path.join(SCRATCH_DIR, 'desktop-hero.jpg'), quality: 90 });

  await desktopPage.evaluate(() => window.scrollTo(0, 950));
  await desktopPage.waitForTimeout(700);
  await desktopPage.screenshot({ path: path.join(SCRATCH_DIR, 'desktop-arch-expanded.jpg'), quality: 90 });

  await desktopPage.evaluate(() => document.querySelector('#manifesto')?.scrollIntoView());
  await desktopPage.waitForTimeout(700);
  await desktopPage.screenshot({ path: path.join(SCRATCH_DIR, 'desktop-manifesto.jpg'), quality: 90 });

  await desktopPage.evaluate(() => {
    const el = document.querySelector('#colecoes');
    if (el) window.scrollTo(0, el.offsetTop + 320);
  });
  await desktopPage.waitForTimeout(700);
  await desktopPage.screenshot({ path: path.join(SCRATCH_DIR, 'desktop-collections.jpg'), quality: 90 });

  await desktopPage.evaluate(() => document.querySelector('#atelier-filme')?.scrollIntoView());
  await desktopPage.waitForTimeout(700);
  await desktopPage.screenshot({ path: path.join(SCRATCH_DIR, 'desktop-scrub.jpg'), quality: 90 });

  await desktopPage.evaluate(() => document.querySelector('#avaliacoes')?.scrollIntoView());
  await desktopPage.waitForTimeout(700);
  await desktopPage.screenshot({ path: path.join(SCRATCH_DIR, 'desktop-reviews.jpg'), quality: 90 });

  await desktopPage.evaluate(() => document.querySelector('#boutique')?.scrollIntoView());
  await desktopPage.waitForTimeout(700);
  await desktopPage.screenshot({ path: path.join(SCRATCH_DIR, 'desktop-boutique.jpg'), quality: 90 });

  await desktopPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await desktopPage.waitForTimeout(700);
  await desktopPage.screenshot({ path: path.join(SCRATCH_DIR, 'desktop-instagram.jpg'), quality: 90 });

  const desktopAudit = await desktopPage.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    const brokenImgs = imgs.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src);
    const bodyText = document.body.innerText;
    const forbiddenCopyTerms = [
      'luz natural',
      'algodão prensado',
      'relevo seco',
      'pedra travertino',
      'metal nobre',
      'acabamento nobre',
      'moissanite',
      'madrepérola',
      'mariana costa lima',
      'letícia barros',
      'bianca nogueira',
      'tatiane ribeiro',
      'meses atrás',
      'semanas atrás',
      'local guide'
    ];
    const detectedForbiddenCopy = forbiddenCopyTerms.filter(term =>
      bodyText.toLowerCase().includes(term.toLowerCase())
    );

    const reviewCards = Array.from(document.querySelectorAll('#avaliacoes article'));

    return {
      title: document.title,
      imageCount: imgs.length,
      brokenImgs,
      videoCount: document.querySelectorAll('video').length,
      reviewCardCountInDom: reviewCards.length,
      hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      containsBonsucessoVisible: /bonsucesso/i.test(bodyText),
      containsForbiddenCartWords: /\b(carrinho|adicionar ao carrinho|parcelamento|sem juros)\b/i.test(bodyText),
      detectedForbiddenCopy
    };
  });

  console.log('Auditoria Desktop (1440x900):', JSON.stringify(desktopAudit, null, 2));

  const mobilePage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  await mobilePage.goto('http://localhost:4200', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(1200);
  await mobilePage.screenshot({ path: path.join(SCRATCH_DIR, 'mobile-hero.jpg'), quality: 90 });

  await mobilePage.evaluate(() => document.querySelector('#manifesto')?.scrollIntoView());
  await mobilePage.waitForTimeout(700);
  await mobilePage.screenshot({ path: path.join(SCRATCH_DIR, 'mobile-manifesto.jpg'), quality: 90 });

  await mobilePage.evaluate(() => document.querySelector('#colecoes')?.scrollIntoView());
  await mobilePage.waitForTimeout(700);
  await mobilePage.screenshot({ path: path.join(SCRATCH_DIR, 'mobile-collections.jpg'), quality: 90 });

  await mobilePage.evaluate(() => document.querySelector('#avaliacoes')?.scrollIntoView());
  await mobilePage.waitForTimeout(700);
  await mobilePage.screenshot({ path: path.join(SCRATCH_DIR, 'mobile-reviews.jpg'), quality: 90 });

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
