#!/usr/bin/env node
/**
 * strip-color-profiles.mjs
 *
 * Nettoie les profils couleur embarqués (ICC, sRGB, gAMA, cHRM, EXIF) des images
 * du dossier public/images afin que Safari et Chrome lisent les mêmes pixels bruts.
 *
 * Pourquoi : Safari (ColorSync) applique les profils ICC/gAMA embarqués, alors que
 * Chrome les ignore souvent. Supprimer ces chunks garantit un rendu identique
 * cross-navigateur sans modifier les couleurs visuelles de l'image.
 *
 * Usage : node scripts/strip-color-profiles.mjs [--dry-run]
 *
 * Dépendance : sharp (réinstaller les images en sRGB sans profil embarqué).
 *   npm install --save-dev sharp
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TARGET_DIR = path.join(ROOT, 'public', 'images');
const DRY_RUN = process.argv.includes('--dry-run');

const EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

async function walk(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (EXTENSIONS.has(path.extname(e.name).toLowerCase())) out.push(p);
  }
  return out;
}

async function main() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.error('sharp n\'est pas installé. Lance :');
    console.error('  npm install --save-dev sharp');
    process.exit(1);
  }

  console.log(`\nNettoyage des profils couleur dans : ${TARGET_DIR}`);
  console.log(DRY_RUN ? '(mode dry-run : aucune écriture)\n' : '');

  const files = await walk(TARGET_DIR);
  let changed = 0;
  let skipped = 0;

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    try {
      const input = await fs.readFile(file);
      const meta = await sharp(input).metadata();
      const hasProfile = Boolean(meta.icc || meta.iccp || meta.hasProfile);
      // On re-encode systématiquement avec withMetadata(false) pour strip tous les chunks
      // (sRGB, gAMA, cHRM, iCCP, EXIF, XMP)

      let pipeline = sharp(input, { failOn: 'none' }).withMetadata({ icc: undefined });

      // Format-specific encoding : garder les caractéristiques visuelles
      const ext = path.extname(file).toLowerCase();
      if (ext === '.png') pipeline = pipeline.png({ compressionLevel: 9 });
      else if (ext === '.jpg' || ext === '.jpeg') pipeline = pipeline.jpeg({ quality: 92, mozjpeg: true });
      else if (ext === '.webp') pipeline = pipeline.webp({ quality: 92 });

      const output = await pipeline.toBuffer();

      if (!DRY_RUN) await fs.writeFile(file, output);
      changed++;
      const before = input.length;
      const after = output.length;
      const diff = ((after - before) / before * 100).toFixed(1);
      console.log(`  OK  ${rel}  (${before}o -> ${after}o, ${diff}%)${hasProfile ? '  [profil retire]' : ''}`);
    } catch (err) {
      skipped++;
      console.log(`  SKIP ${rel}  (${err.message})`);
    }
  }

  console.log(`\nTermine : ${changed} image(s) re-encodee(s), ${skipped} ignoree(s).`);
  if (DRY_RUN) console.log('Relance sans --dry-run pour appliquer.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
