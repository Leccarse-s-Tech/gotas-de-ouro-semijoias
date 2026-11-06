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

    if (rel.startsWith('src') && /\bLenis\b/.test(content)) {
      violations.push(`Lenis ainda presente em: ${rel}`);
    }

    if (rel.startsWith('src') && /pin:\s*true/.test(content)) {
      violations.push(`GSAP pin: true ainda presente em: ${rel}`);
    }

    if (rel.startsWith('src') && /clipPath/.test(content)) {
      violations.push(`Animacao de clipPath detectada em: ${rel}`);
    }

    if (rel.startsWith('src') && /loading="lazy"/.test(content)) {
      violations.push(`loading="lazy" detectado em: ${rel}`);
    }

    if (rel === path.join('src', 'styles.css') && /scroll-behavior:\s*smooth/.test(content)) {
      violations.push(`scroll-behavior: smooth detectado em: ${rel}`);
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
  let videoFileCount = 0;
  for (const f of fs.readdirSync(editorialDir)) {
    const ext = path.extname(f).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
      violations.push(`Imagem nao convertida para WebP: ${f}`);
    }
    if (ext === '.mp4' || ext === '.webm') {
      videoFileCount++;
    }
    if (ext === '.webp') {
      const sizeKb = fs.statSync(path.join(editorialDir, f)).size / 1024;
      if (sizeKb > 250) {
        violations.push(`Imagem WebP acima de 250KB: ${f} (${sizeKb.toFixed(1)} KB)`);
      }
    }
  }

  if (videoFileCount > 2) {
    violations.push(`Mais de 2 arquivos de video na pasta editorial (${videoFileCount})`);
  }

  console.log('Arquivos auditados:', allFiles.length);
  console.log('Violacoes de codigo encontradas:', violations.length);
  if (violations.length > 0) {
    console.error(violations.join('\n'));
    process.exit(1);
  }
}

async function validateBrowser() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: getBrowserExecutable()
  });

  const viewportsToTest = [
    { name: 'mobile-small-375', width: 375, height: 812, isMobile: true },
    { name: 'mobile-large-425', width: 425, height: 844, isMobile: true },
    { name: 'tablet-768', width: 768, height: 1024, isMobile: false },
    { name: 'tablet-820', width: 820, height: 1180, isMobile: false },
    { name: 'desktop-1280', width: 1280, height: 800, isMobile: false },
    { name: 'desktop-1920', width: 1920, height: 1080, isMobile: false }
  ];

  let desktopTotalBytes = 0;
  let status206Count = 0;

  for (const vp of viewportsToTest) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile
    });

    const consoleErrors = [];
    page.on('pageerror', err => consoleErrors.push(err.message));

    if (vp.name === 'desktop-1920') {
      page.on('response', res => {
        if (res.status() === 206) {
          status206Count++;
        }
        const len = res.headers()['content-length'];
        if (len) {
          desktopTotalBytes += parseInt(len, 10);
        }
      });
    }

    await page.goto('http://localhost:4200', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    const initialOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(500);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(600);

    const fullScrollOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    const checkDom = await page.evaluate(() => {
      const vids = document.querySelectorAll('video');
      const cards = document.querySelectorAll('.collection-item');
      const cardRects = Array.from(cards).map(c => {
        const r = c.getBoundingClientRect();
        return { width: r.width, right: r.right };
      });
      const clientW = document.documentElement.clientWidth;
      const cardsOutOfBounds = cardRects.filter(r => r.right > clientW + 1);
      return {
        videoCount: vids.length,
        cardCount: cards.length,
        clientW,
        cardsOutOfBounds: cardsOutOfBounds.length
      };
    });

    await page.screenshot({
      path: path.join(SCRATCH_DIR, `${vp.name}-full.jpg`),
      fullPage: false,
      quality: 85
    });

    console.log(`Viewport ${vp.name} (${vp.width}x${vp.height}):`);
    console.log(`  - Overflow inicial: ${initialOverflow ? 'FALHA' : 'OK'}`);
    console.log(`  - Overflow apos scroll completo: ${fullScrollOverflow ? 'FALHA' : 'OK'}`);
    console.log(`  - Cards fora da borda direita: ${checkDom.cardsOutOfBounds}`);
    console.log(`  - Videos na DOM: ${checkDom.videoCount}`);
    console.log(`  - Erros de console: ${consoleErrors.length}`);

    if (initialOverflow || fullScrollOverflow || checkDom.cardsOutOfBounds > 0 || consoleErrors.length > 0) {
      throw new Error(`Falha de validacao no viewport ${vp.name}`);
    }

    if (checkDom.videoCount > 2) {
      throw new Error(`Mais de 2 tags <video> na DOM (${checkDom.videoCount})`);
    }

    await page.close();
  }

  const desktopMb = (desktopTotalBytes / (1024 * 1024)).toFixed(2);
  console.log(`Total transferido no Desktop (1920x1080): ${desktopMb} MB`);
  console.log(`Total de requisicoes 206 Partial Content: ${status206Count}`);

  if (desktopTotalBytes > 6 * 1024 * 1024) {
    throw new Error(`Transferencia de rede excedeu 6MB: ${desktopMb} MB`);
  }

  await browser.close();
}

async function main() {
  auditCodebase();
  await validateBrowser();
  console.log('Validacao completa executada com sucesso.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
