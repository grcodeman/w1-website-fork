/**
 * One-off: compress public/images/cards/*.png to AVIF.
 * Run with: npx tsx scripts/optimize-card-images.ts
 */
import sharp from 'sharp';
import { stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CARDS_DIR = join(__dirname, '..', 'public', 'images', 'cards');

type Target = {
  file: string;
  maxWidth: number;
  quality: number;
};

const targets: Target[] = [
  { file: 'w1_hero.png', maxWidth: 2400, quality: 55 },
  { file: 'w1_learn.png', maxWidth: 1600, quality: 55 },
  { file: 'w1_build.png', maxWidth: 1600, quality: 55 },
  { file: 'w1_ecosystem.png', maxWidth: 1600, quality: 55 },
];

function format(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

async function run() {
  console.log(`Source: ${CARDS_DIR}\n`);
  for (const t of targets) {
    const src = join(CARDS_DIR, t.file);
    const out = join(CARDS_DIR, t.file.replace(/\.png$/, '.avif'));
    const before = (await stat(src)).size;
    await sharp(src)
      .resize({ width: t.maxWidth, withoutEnlargement: true })
      .avif({ quality: t.quality, effort: 6 })
      .toFile(out);
    const after = (await stat(out)).size;
    const pct = ((1 - after / before) * 100).toFixed(1);
    console.log(
      `${t.file.padEnd(20)} ${format(before).padStart(10)} -> ${format(after).padStart(10)}  (-${pct}%)`,
    );
  }

  // OG/Twitter scrapers do not reliably decode AVIF, so emit a JPEG hero for meta tags.
  const ogSrc = join(CARDS_DIR, 'w1_hero.png');
  const ogOut = join(CARDS_DIR, 'w1_hero_og.jpg');
  await sharp(ogSrc)
    .resize({ width: 1200, height: 630, fit: 'cover' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(ogOut);
  const ogSize = (await stat(ogOut)).size;
  console.log(`w1_hero_og.jpg       (OG card)  -> ${format(ogSize).padStart(10)}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
