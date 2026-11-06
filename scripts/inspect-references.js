const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

function getBrowserExecutable() {
  const localApp = process.env.LOCALAPPDATA || 'C:\\Users\\hojej\\AppData\\Local';
  const candidate = path.join(localApp, 'ms-playwright', 'chromium-1234', 'chrome-win64', 'chrome.exe');
  return fs.existsSync(candidate) ? candidate : undefined;
}

const SITES = [
  {
    name: 'Collab Capitolium',
    url: 'https://www.collabcapitolium.fr/',
    focus: 'Arcos clip-path, scroll video scrubbing, fundos texturizados'
  },
  {
    name: 'Bulgari Eclettica Emerald Strata',
    url: 'https://eclettica.bulgari.com/emerald-strata',
    focus: 'Atmosfera mineral, texturas de pedra, iluminacao dramatica'
  },
  {
    name: 'Seed Jewelry',
    url: 'https://seedjewelry.com/',
    focus: 'Minimalismo organico, respiro editorial, tipografia'
  },
  {
    name: 'Veronique et Cie',
    url: 'https://www.veronique-et-cie.com/',
    focus: 'Assimetria de grades, sofisticacao francesa, transicoes'
  }
];

async function inspectAll() {
  const browser = await chromium.launch({ headless: true, executablePath: getBrowserExecutable() });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 }
  });

  for (const site of SITES) {
    const page = await context.newPage();
    console.log('====================================================');
    console.log('INSPECIONANDO:', site.name, '-', site.url);
    console.log('FOCO:', site.focus);
    try {
      await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(3000);
      const data = await page.evaluate(() => {
        const bodyStyle = window.getComputedStyle(document.body);
        const headings = Array.from(document.querySelectorAll('h1, h2, h3')).slice(0, 5).map(el => {
          const st = window.getComputedStyle(el);
          return {
            tag: el.tagName,
            text: el.innerText.trim().slice(0, 60),
            fontFamily: st.fontFamily,
            fontSize: st.fontSize,
            letterSpacing: st.letterSpacing,
            lineHeight: st.lineHeight
          };
        });
        const videos = document.querySelectorAll('video').length;
        const canvases = document.querySelectorAll('canvas').length;
        const svgs = document.querySelectorAll('svg').length;
        const clipPaths = Array.from(document.querySelectorAll('*'))
          .map(el => window.getComputedStyle(el).clipPath)
          .filter(cp => cp && cp !== 'none')
          .slice(0, 6);
        const borderRadii = Array.from(document.querySelectorAll('*'))
          .map(el => window.getComputedStyle(el).borderRadius)
          .filter(br => br && br !== '0px' && (br.includes('999') || br.includes('50%') || parseInt(br, 10) > 100))
          .slice(0, 6);
        const scripts = Array.from(document.querySelectorAll('script[src]'))
          .map(s => s.getAttribute('src'))
          .filter(Boolean)
          .slice(0, 12);
        return {
          title: document.title,
          bgColor: bodyStyle.backgroundColor,
          color: bodyStyle.color,
          fontFamily: bodyStyle.fontFamily,
          headings,
          counts: { videos, canvases, svgs },
          clipPaths,
          borderRadii,
          scripts
        };
      });
      console.log(JSON.stringify(data, null, 2));
    } catch (err) {
      console.log('Aviso ao inspecionar', site.name, ':', err.message);
    } finally {
      await page.close();
    }
  }

  console.log('====================================================');
  console.log('INSPECIONANDO POST DO INSTAGRAM: https://www.instagram.com/p/DeSDjxkhj4a/');
  const igPage = await context.newPage();
  try {
    await igPage.goto('https://www.instagram.com/p/DeSDjxkhj4a/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await igPage.waitForTimeout(4000);
    const igData = await igPage.evaluate(() => {
      const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
      const ogUrl = document.querySelector('meta[property="og:url"]')?.getAttribute('content') || '';
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
      const links = Array.from(document.querySelectorAll('a[href]')).map(a => a.getAttribute('href')).slice(0, 20);
      return { title: document.title, metaDesc, ogTitle, ogUrl, canonical, links };
    });
    console.log(JSON.stringify(igData, null, 2));
  } catch (err) {
    console.log('Aviso ao inspecionar Instagram:', err.message);
  } finally {
    await igPage.close();
  }

  await browser.close();
}

inspectAll();
