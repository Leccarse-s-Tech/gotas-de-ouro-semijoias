const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const sharp = require('sharp');
const ffmpegPath = require('ffmpeg-static');

const EDITORIAL_DIR = path.join(__dirname, '..', 'src', 'assets', 'editorial');
const ARTIFACT_DIR = 'C:/Users/hojej/.gemini/antigravity-cli/brain/bc78c5c9-dc29-4a22-a69f-da03fac134c9';

function resolveSourceImage(artifactFile, fallbackWebp) {
  const candidate = path.join(ARTIFACT_DIR, artifactFile);
  if (fs.existsSync(candidate)) {
    return candidate;
  }
  return path.join(EDITORIAL_DIR, fallbackWebp);
}

async function prepareMasterPng(srcPath, tempPngPath) {
  await sharp(srcPath)
    .resize(3840, 2400, { fit: 'cover', position: 'centre', kernel: sharp.kernel.lanczos3 })
    .png({ compressionLevel: 2 })
    .toFile(tempPngPath);
}

async function buildSeamlessHdVideo(outputName, sources) {
  const tempDir = path.join(__dirname, '..', '.angular', 'video-temp');
  fs.mkdirSync(tempDir, { recursive: true });

  const pngPaths = [];
  for (let i = 0; i < sources.length; i++) {
    const p = path.join(tempDir, `${outputName}-src-${i}.png`);
    await prepareMasterPng(sources[i], p);
    pngPaths.push(p);
  }

  const tempMp4 = path.join(tempDir, `${outputName}-temp.mp4`);
  const finalMp4 = path.join(EDITORIAL_DIR, `${outputName}.mp4`);

  const filterComplex = [
    `[0:v]zoompan=z='1.0+0.08*(on/105)':x='iw/2-(iw/zoom/2)+(iw*0.025)*(on/105)':y='ih/2-(ih/zoom/2)':d=105:s=1280x800:fps=30,format=yuv420p[v0]`,
    `[1:v]zoompan=z='1.08-0.06*(on/105)':x='iw/2-(iw/zoom/2)-(iw*0.02)*(on/105)':y='ih/2-(ih/zoom/2)+(ih*0.015)*(on/105)':d=105:s=1280x800:fps=30,format=yuv420p[v1]`,
    `[2:v]zoompan=z='1.02+0.07*(on/105)':x='iw/2-(iw/zoom/2)+(iw*0.015)*(on/105)':y='ih/2-(ih/zoom/2)-(ih*0.02)*(on/105)':d=105:s=1280x800:fps=30,format=yuv420p[v2]`,
    `[0:v]zoompan=z='1.0':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=36:s=1280x800:fps=30,format=yuv420p[v3]`,
    `[v0][v1]xfade=transition=fade:duration=1.0:offset=2.5[x1]`,
    `[x1][v2]xfade=transition=fade:duration=1.0:offset=5.0[x2]`,
    `[x2][v3]xfade=transition=fade:duration=1.0:offset=7.5,trim=duration=8.5,setpts=PTS-STARTPTS,scale=1280:-2:flags=lanczos[outv]`
  ].join(';');

  await new Promise((resolve, reject) => {
    const args = [
      '-y',
      '-i', pngPaths[0],
      '-i', pngPaths[1],
      '-i', pngPaths[2],
      '-filter_complex', filterComplex,
      '-map', '[outv]',
      '-c:v', 'libx264',
      '-crf', '26',
      '-preset', 'slow',
      '-profile:v', 'high',
      '-level', '4.0',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      '-an',
      tempMp4
    ];

    const proc = spawn(ffmpegPath, args);
    let errOutput = '';
    proc.stderr.on('data', chunk => {
      errOutput += chunk.toString();
    });
    proc.on('error', reject);
    proc.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg falhou (${code}): ${errOutput.slice(-500)}`));
    });
  });

  fs.copyFileSync(tempMp4, finalMp4);
  fs.unlinkSync(tempMp4);
  for (const p of pngPaths) {
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }

  const sizeKb = (fs.statSync(finalMp4).size / 1024).toFixed(1);
  console.log(`Video HD gerado: ${outputName}.mp4 (${sizeKb} KB)`);
}

function removeObsoleteVideos() {
  const obsolete = [
    'linen-macro-video.mp4',
    'linen-macro-video.webm',
    'hero-arch-video.webm',
    'scrub-showcase-video.webm'
  ];
  for (const name of obsolete) {
    const target = path.join(EDITORIAL_DIR, name);
    if (fs.existsSync(target)) {
      fs.unlinkSync(target);
      console.log(`Arquivo removido: ${name}`);
    }
  }
}

async function convertRemainingImagesToWebp() {
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
      } else if (base.startsWith('texture-')) {
        await sharp(srcPath)
          .resize({ width: 720, withoutEnlargement: true })
          .webp({ quality: 75, effort: 6 })
          .toFile(destPath);
      } else {
        await sharp(srcPath)
          .resize({ width: 1400, withoutEnlargement: true })
          .webp({ quality: 80, effort: 6 })
          .toFile(destPath);
      }

      fs.unlinkSync(srcPath);
    }
  }

  for (const name of ['texture-linen.webp', 'texture-travertine.webp']) {
    const target = path.join(EDITORIAL_DIR, name);
    if (fs.existsSync(target)) {
      const artName = name.replace('.webp', '') === 'texture-linen' ? 'texture_linen_1793986940707.jpg' : 'texture_travertine_1793986897824.jpg';
      const artPath = path.join(ARTIFACT_DIR, artName);
      if (fs.existsSync(artPath)) {
        const tempDest = path.join(EDITORIAL_DIR, `${name}.tmp`);
        await sharp(artPath)
          .resize({ width: 720, withoutEnlargement: true })
          .webp({ quality: 75, effort: 6 })
          .toFile(tempDest);
        fs.copyFileSync(tempDest, target);
        fs.unlinkSync(tempDest);
      }
    }
  }
}

async function main() {
  removeObsoleteVideos();
  await convertRemainingImagesToWebp();

  await buildSeamlessHdVideo('hero-arch-video', [
    resolveSourceImage('editorial_macro_frame_2_1793987210051.jpg', 'editorial-macro-frame-2.webp'),
    resolveSourceImage('joia_1_editorial_1793986751031.jpg', 'joia-1-editorial.webp'),
    resolveSourceImage('joia_3_editorial_1793986819424.jpg', 'joia-3-editorial.webp')
  ]);

  await buildSeamlessHdVideo('scrub-showcase-video', [
    resolveSourceImage('editorial_macro_frame_3_1793987267339.jpg', 'editorial-macro-frame-3.webp'),
    resolveSourceImage('joia_4_editorial_1793986859785.jpg', 'joia-4-editorial.webp'),
    resolveSourceImage('joia_2_editorial_1793986784511.jpg', 'joia-2-editorial.webp')
  ]);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
