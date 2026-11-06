const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const sharp = require('sharp');

const EDITORIAL_DIR = path.join(__dirname, '..', 'src', 'assets', 'editorial');

function getFfmpegExecutable() {
  const localApp = process.env.LOCALAPPDATA || 'C:\\Users\\hojej\\AppData\\Local';
  const candidate = path.join(localApp, 'ms-playwright', 'ffmpeg-1011', 'ffmpeg-win64.exe');
  return fs.existsSync(candidate) ? candidate : 'ffmpeg';
}

async function convertImagesToWebp() {
  const files = fs.readdirSync(EDITORIAL_DIR);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
      const base = path.basename(file, ext);
      const srcPath = path.join(EDITORIAL_DIR, file);
      const destPath = path.join(EDITORIAL_DIR, `${base}.webp`);

      if (base === 'noise-tile') {
        await sharp(srcPath)
          .resize({ width: 150, height: 150, fit: 'cover' })
          .webp({ quality: 80, alphaQuality: 80 })
          .toFile(destPath);
      } else {
        await sharp(srcPath)
          .resize({ width: 1400, withoutEnlargement: true })
          .webp({ quality: 80, effort: 6 })
          .toFile(destPath);
      }

      const stat = fs.statSync(destPath);
      const sizeKb = (stat.size / 1024).toFixed(1);
      console.log(`Imagem convertida: ${base}.webp (${sizeKb} KB)`);
      fs.unlinkSync(srcPath);
    }
  }
}

async function compressVideo(baseName) {
  const ffmpeg = getFfmpegExecutable();
  const webmPath = path.join(EDITORIAL_DIR, `${baseName}.webm`);
  const mp4Path = path.join(EDITORIAL_DIR, `${baseName}.mp4`);
  const tempPath = path.join(EDITORIAL_DIR, `${baseName}-temp.webm`);

  if (!fs.existsSync(webmPath)) return;

  await new Promise((resolve, reject) => {
    const proc = spawn(ffmpeg, [
      '-y',
      '-i', webmPath,
      '-vf', 'scale=1280:720',
      '-c:v', 'libvpx',
      '-b:v', '1100k',
      '-crf', '26',
      '-g', '15',
      '-an',
      tempPath
    ]);
    let err = '';
    proc.stderr.on('data', d => { err += d.toString(); });
    proc.on('error', reject);
    proc.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg error (${code}): ${err.slice(-300)}`));
    });
  });

  fs.copyFileSync(tempPath, webmPath);
  fs.copyFileSync(tempPath, mp4Path);
  fs.unlinkSync(tempPath);
  const stat = fs.statSync(webmPath);
  console.log(`Video comprimido: ${baseName}.webm (${(stat.size / 1024).toFixed(1)} KB)`);
}

async function main() {
  await convertImagesToWebp();
  await compressVideo('hero-arch-video');
  await compressVideo('scrub-showcase-video');
  await compressVideo('linen-macro-video');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
