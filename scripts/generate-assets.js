require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const sharp = require('sharp');
const { GoogleGenAI } = require('@google/genai');

const REF_DIR = path.join(__dirname, '..', 'fotos-referencia');
const OUT_DIR = path.join(__dirname, '..', 'src', 'assets', 'editorial');
fs.mkdirSync(OUT_DIR, { recursive: true });

function getFfmpegExecutable() {
  try {
    return require('ffmpeg-static');
  } catch {
    return 'ffmpeg';
  }
}

function createCleanLogoSvgs() {
  const fullLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 110" fill="none">
  <g fill="#1E1E1C">
    <path d="M168.5 44.2C164.8 36.4 156.2 29.8 153.4 22.1C150.8 14.9 154.9 7.8 162.4 7.2C169.8 6.6 175.5 13.5 174.2 23.8C173.3 31.1 170.6 38.2 168.5 44.2Z" />
    <path d="M171.2 46.8C174.9 35.2 181.4 18.6 191.8 11.4C200.6 5.3 212.4 7.8 215.8 17.6C219.6 28.5 210.4 42.1 196.2 46.4C187.8 48.9 178.4 48.2 171.2 46.8Z" />
  </g>
  <text x="180" y="76" text-anchor="middle" fill="#1E1E1C" font-family="'Cormorant Garamond', 'Playfair Display', Georgia, serif" font-size="34" font-style="italic" font-weight="500" letter-spacing="0.02em">Gotas de Ouro</text>
  <text x="180" y="96" text-anchor="middle" fill="#1E1E1C" font-family="'Manrope', 'Outfit', sans-serif" font-size="9.5" font-weight="500" letter-spacing="0.42em">SEMIJOIAS</text>
</svg>`;

  const symbolSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 60" fill="none">
  <g fill="#1E1E1C">
    <path d="M31.5 49.2C27.2 39.8 17.4 31.8 14.2 22.6C11.2 14.0 15.9 5.6 24.5 4.8C33.0 4.1 39.6 12.2 38.1 24.5C37.0 33.3 33.9 41.9 31.5 49.2Z" />
    <path d="M34.6 52.2C38.9 38.4 46.4 18.5 58.4 9.9C68.5 2.6 82.1 5.6 86.0 17.3C90.4 30.3 79.8 46.6 63.4 51.7C53.8 54.7 42.9 53.9 34.6 52.2Z" transform="translate(-10, 0)" />
  </g>
</svg>`;

  fs.writeFileSync(path.join(OUT_DIR, 'logo-gotas-de-ouro.svg'), fullLogoSvg, 'utf8');
  fs.writeFileSync(path.join(OUT_DIR, 'logo-symbol.svg'), symbolSvg, 'utf8');
}

async function createStaticNoiseTile() {
  const tilePath = path.join(OUT_DIR, 'noise-tile.png');
  if (fs.existsSync(tilePath)) return;
  const size = 150;
  const buf = Buffer.alloc(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const v = Math.floor(Math.random() * 255);
    buf[i * 4] = v;
    buf[i * 4 + 1] = v;
    buf[i * 4 + 2] = v;
    buf[i * 4 + 3] = 255;
  }
  await sharp(buf, { raw: { width: size, height: size, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(tilePath);
}

async function generateWithGenAI({ refFile, outName, prompt, width = 1280, height = 1600 }) {
  const outPath = path.join(OUT_DIR, outName);
  if (fs.existsSync(outPath)) {
    return true;
  }

  const apiKey = process.env.GOOGLE_AI_STUDIO_KEY;
  if (!apiKey) return false;

  const ai = new GoogleGenAI({ apiKey });
  const contents = [];
  if (refFile) {
    const refPath = path.join(REF_DIR, refFile);
    if (fs.existsSync(refPath)) {
      const ext = path.extname(refFile).toLowerCase();
      contents.push({
        inlineData: {
          mimeType: ext === '.png' ? 'image/png' : 'image/jpeg',
          data: fs.readFileSync(refPath).toString('base64')
        }
      });
    }
  }
  contents.push({ text: prompt });

  for (const modelName of ['gemini-3-pro-image', 'gemini-3.1-flash-image', 'gemini-2.5-flash-image']) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: { responseModalities: ['TEXT', 'IMAGE'] }
      });
      const parts = response.candidates?.[0]?.content?.parts || [];
      const imgPart = parts.find(p => p.inlineData && p.inlineData.data);
      if (imgPart) {
        const rawBuffer = Buffer.from(imgPart.inlineData.data, 'base64');
        await sharp(rawBuffer)
          .resize(width, height, { fit: 'cover', position: 'centre' })
          .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
          .toFile(outPath);
        return true;
      }
    } catch (err) {
      console.log(`Aviso em ${modelName} para ${outName}:`, err.message);
    }
  }
  return false;
}

async function generateSlowMotionVideo({ sourceImages, outputBaseName, durationSec = 6 }) {
  const ffmpeg = getFfmpegExecutable();
  const outMp4 = path.join(OUT_DIR, `${outputBaseName}.mp4`);
  if (fs.existsSync(outMp4)) {
    return;
  }

  const fps = 30;
  const totalFrames = durationSec * fps;
  const outW = 1280;
  const outH = 800;
  const canvasW = 1600;
  const canvasH = 1000;

  const preparedBuffers = [];
  for (const imgName of sourceImages) {
    const buf = await sharp(path.join(OUT_DIR, imgName))
      .resize(canvasW, canvasH, { fit: 'cover', position: 'centre' })
      .toBuffer();
    preparedBuffers.push(buf);
  }

  await new Promise((resolve, reject) => {
    const proc = spawn(ffmpeg, [
      '-y',
      '-f', 'image2pipe',
      '-c:v', 'mjpeg',
      '-r', String(fps),
      '-i', 'pipe:0',
      '-c:v', 'libx264',
      '-crf', '20',
      '-preset', 'slow',
      '-vf', 'scale=1280:-2',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      '-an',
      outMp4
    ]);

    let errLog = '';
    proc.stderr.on('data', d => { errLog += d.toString(); });
    proc.on('error', reject);
    proc.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}: ${errLog.slice(-400)}`));
    });

    (async () => {
      for (let f = 0; f < totalFrames; f++) {
        const progress = f / Math.max(1, totalFrames - 1);
        const segCount = preparedBuffers.length;
        const segFloat = progress * segCount;
        const segIdx = Math.min(segCount - 1, Math.floor(segFloat));
        const localT = segFloat - segIdx;

        const baseBuf = preparedBuffers[segIdx];
        const zoom = 1.0 + 0.1 * Math.sin(localT * Math.PI * 0.5);
        const cropW = Math.round(outW / zoom);
        const cropH = Math.round(outH / zoom);
        const maxLeft = canvasW - cropW;
        const maxTop = canvasH - cropH;
        const panX = Math.round((maxLeft / 2) + (maxLeft * 0.25) * Math.sin(progress * Math.PI * 2));
        const panY = Math.round((maxTop / 2) + (maxTop * 0.2) * Math.cos(progress * Math.PI));

        const left = Math.max(0, Math.min(maxLeft, panX));
        const top = Math.max(0, Math.min(maxTop, panY));

        let pipeline = sharp(baseBuf)
          .extract({ left, top, width: cropW, height: cropH })
          .resize(outW, outH);

        if (segIdx < segCount - 1 && localT > 0.72) {
          const alpha = Math.min(1, (localT - 0.72) / 0.28);
          const nextCrop = await sharp(preparedBuffers[segIdx + 1])
            .extract({ left, top, width: cropW, height: cropH })
            .resize(outW, outH)
            .ensureAlpha(alpha)
            .png()
            .toBuffer();
          pipeline = pipeline.composite([{ input: nextCrop, blend: 'over' }]);
        }

        const frameJpeg = await pipeline.jpeg({ quality: 92 }).toBuffer();
        const canContinue = proc.stdin.write(frameJpeg);
        if (!canContinue) {
          await new Promise(r => proc.stdin.once('drain', r));
        }
      }
      proc.stdin.end();
    })().catch(reject);
  });
}

async function run() {
  createCleanLogoSvgs();
  await createStaticNoiseTile();

  await generateWithGenAI({
    refFile: 'joia-1.jpeg',
    outName: 'joia-1-editorial.jpg',
    width: 1280,
    height: 1600,
    prompt: 'Macro editorial jewelry photography of this exact gold round bezel necklace and matching round stud earrings resting on a warm studio mineral surface (#D8D3C8).'
  });

  await generateWithGenAI({
    refFile: 'joia-2.png',
    outName: 'joia-2-editorial.jpg',
    width: 1280,
    height: 1600,
    prompt: 'Macro luxury editorial jewelry photography of this exact silver chain necklace with 3 sparkling stones resting on soft linen paper (#F1F1EA).'
  });

  await generateWithGenAI({
    refFile: 'joia-3.png',
    outName: 'joia-3-editorial.jpg',
    width: 1280,
    height: 1600,
    prompt: 'High-fashion art gallery still-life photograph of this exact organic sculptural gold bezel necklace and matching stud earrings with matte white stone draped over a curved matte plaster surface (#F1F1EA).'
  });

  await generateWithGenAI({
    refFile: 'joia-4.jpeg',
    outName: 'joia-4-editorial.jpg',
    width: 1280,
    height: 1600,
    prompt: 'Macro luxury editorial jewelry photography of this exact brushed satin gold 5-petal flower necklace and matching floral stud earrings resting on softly draped raw linen fabric (#F3F2D9).'
  });

  await generateSlowMotionVideo({
    sourceImages: ['editorial-macro-frame-2.jpg', 'joia-1-editorial.jpg', 'joia-3-editorial.jpg'],
    outputBaseName: 'hero-arch-video',
    durationSec: 5
  });

  await generateSlowMotionVideo({
    sourceImages: ['editorial-macro-frame-3.jpg', 'joia-2-editorial.jpg', 'joia-4-editorial.jpg'],
    outputBaseName: 'scrub-showcase-video',
    durationSec: 6
  });
}

run().catch(err => {
  console.error('Erro no pipeline:', err);
  process.exit(1);
});
