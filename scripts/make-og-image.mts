/**
 * Regenerates the branded social card + favicons from the hero photo and logo.
 * Run with: npx tsx scripts/make-og-image.mts
 */
import sharp from 'sharp';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = (...p: string[]) => join(root, 'public', ...p);

const W = 1200;
const H = 630;
const LOGO = 128;
const PAD = 56;

const scrim = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#2A1406" stop-opacity="0.92"/>
      <stop offset="45%" stop-color="#2A1406" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#2A1406" stop-opacity="0.05"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
</svg>`;

const textX = PAD + LOGO + 28;
const text = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <text x="${textX}" y="${H - PAD - 62}" fill="#FDFBF7" font-family="Georgia, 'Times New Roman', serif" font-size="72">W1 @ WMU</text>
  <text x="${textX}" y="${H - PAD - 16}" fill="#F0E4D6" font-family="Helvetica, Arial, sans-serif" font-size="28" letter-spacing="0.5">Student startup community · Kalamazoo, Michigan</text>
</svg>`;

const logo = await sharp(pub('w1_logo.png'))
  .resize(LOGO, LOGO)
  .png()
  .toBuffer();

await sharp(pub('images', 'cards', 'w1_hero.avif'))
  .resize(W, H, { fit: 'cover', position: 'attention' })
  .composite([
    { input: Buffer.from(scrim) },
    { input: Buffer.from(text) },
    { input: logo, left: PAD, top: H - PAD - LOGO },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(pub('images', 'cards', 'w1_hero_og.jpg'));

// Icons: brown-on-transparent logo flattened onto warm white (iOS/Android ignore alpha).
const icon = (size: number, file: string) =>
  sharp(pub('w1_logo.png'))
    .resize(size, size)
    .flatten({ background: '#FDFBF7' })
    .png()
    .toFile(pub(file));

await Promise.all([
  icon(32, 'favicon-32x32.png'),
  icon(180, 'apple-touch-icon.png'),
  icon(192, 'icon-192.png'),
  icon(512, 'icon-512.png'),
]);

console.log('wrote og image + icons');
