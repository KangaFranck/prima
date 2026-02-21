#!/usr/bin/env node
/**
 * Lance PocketBase en local (http://127.0.0.1:8090).
 * Place le binaire dans pocketbase/ : pocketbase.exe (Windows) ou pocketbase (Mac/Linux).
 * Téléchargement : https://github.com/pocketbase/pocketbase/releases
 */
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isWindows = process.platform === 'win32';
const bin = path.join(__dirname, '..', 'pocketbase', isWindows ? 'pocketbase.exe' : 'pocketbase');

if (!fs.existsSync(bin)) {
  console.error('Le binaire PocketBase est absent :', bin);
  console.error('1. Téléchargez-le : https://github.com/pocketbase/pocketbase/releases');
  console.error('   (Windows : pocketbase_*_windows_amd64.zip → extrayez pocketbase.exe)');
  console.error('2. Placez pocketbase.exe dans le dossier pocketbase/ de ce projet.');
  console.error('Voir aussi pocketbase/README.md');
  process.exit(1);
}

const child = spawn(bin, ['serve'], {
  stdio: 'inherit',
  shell: isWindows,
  cwd: path.join(__dirname, '..')
});

child.on('error', (err) => {
  console.error('Impossible de lancer PocketBase. Vérifiez que le binaire est dans pocketbase/ :', bin);
  console.error('Téléchargez-le depuis https://github.com/pocketbase/pocketbase/releases');
  process.exit(1);
});

child.on('exit', (code) => process.exit(code ?? 0));
