/**
 * Generates public/og-image.png
 * 1200×630 dark background (#1a1a1a) with the VaultScope darkmode logo centred.
 *
 * Run once:  node scripts/generate-og.mjs
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root      = join(__dirname, '..');

const OG_W = 1200;
const OG_H = 630;
const BG   = { r: 26, g: 26, b: 26 };   // #1a1a1a — matches dark theme background

// Scale the logo so its width is 55% of the canvas width, preserve aspect ratio
const LOGO_TARGET_W = Math.round(OG_W * 0.55);

const logoPath = join(root, 'public', 'logos', 'darkmode-logo.png');
const outPath  = join(root, 'public', 'og-image.png');

const logo = await sharp(readFileSync(logoPath))
  .resize({ width: LOGO_TARGET_W })
  .toBuffer({ resolveWithObject: true });

const left = Math.round((OG_W - logo.info.width)  / 2);
const top  = Math.round((OG_H - logo.info.height) / 2);

await sharp({
  create: {
    width:      OG_W,
    height:     OG_H,
    channels:   3,
    background: BG,
  },
})
  .composite([{ input: logo.data, left, top }])
  .png()
  .toFile(outPath);

console.log(`✓ og-image.png generated (${OG_W}×${OG_H}) → public/og-image.png`);
