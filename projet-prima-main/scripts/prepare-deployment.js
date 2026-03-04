#!/usr/bin/env node

/**
 * Script de préparation pour le déploiement
 * Vérifie la configuration et prépare le projet pour GitHub/Vercel
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Préparation du déploiement Prima Center...\n');

// Vérifications
const checks = [
  {
    name: 'package.json',
    path: './package.json',
    required: true
  },
  {
    name: 'vercel.json',
    path: './vercel.json',
    required: true
  },
  {
    name: 'README.md',
    path: './README.md',
    required: true
  },
  {
    name: '.gitignore',
    path: './.gitignore',
    required: true
  }
];

let allGood = true;

console.log('📋 Vérification des fichiers requis...\n');

checks.forEach(check => {
  if (fs.existsSync(check.path)) {
    console.log(`✅ ${check.name} - Trouvé`);
  } else {
    console.log(`❌ ${check.name} - Manquant`);
    if (check.required) {
      allGood = false;
    }
  }
});

console.log('\n🔧 Vérification de la configuration...\n');

// Vérifier package.json
try {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  
  console.log(`📦 Nom du projet: ${packageJson.name}`);
  console.log(`📝 Version: ${packageJson.version}`);
  console.log(`🏠 Homepage: ${packageJson.homepage || 'Non défini'}`);
  
  if (packageJson.scripts && packageJson.scripts.build) {
    console.log('✅ Script de build configuré');
  } else {
    console.log('❌ Script de build manquant');
    allGood = false;
  }
} catch (error) {
  console.log('❌ Erreur lors de la lecture du package.json');
  allGood = false;
}

// Vérifier vercel.json
try {
  const vercelJson = JSON.parse(fs.readFileSync('./vercel.json', 'utf8'));
  console.log('✅ Configuration Vercel trouvée');
  
  if (vercelJson.builds && vercelJson.builds.length > 0) {
    console.log('✅ Builds Vercel configurés');
  } else {
    console.log('⚠️  Aucun build configuré dans vercel.json');
  }
} catch (error) {
  console.log('❌ Erreur lors de la lecture du vercel.json');
  allGood = false;
}

console.log('\n📁 Vérification des dossiers...\n');

const requiredDirs = ['src', 'public', 'api'];
requiredDirs.forEach(dir => {
  if (fs.existsSync(`./${dir}`)) {
    console.log(`✅ Dossier ${dir}/ trouvé`);
  } else {
    console.log(`❌ Dossier ${dir}/ manquant`);
    allGood = false;
  }
});

console.log('\n🎯 Instructions pour le déploiement:\n');

if (allGood) {
  console.log('✅ Tous les fichiers requis sont présents!\n');
  
  console.log('📋 Étapes suivantes:');
  console.log('1. Initialiser Git (si pas déjà fait):');
  console.log('   git init');
  console.log('   git add .');
  console.log('   git commit -m "Initial commit"');
  console.log('');
  console.log('2. Créer le repository GitHub:');
  console.log('   - Aller sur https://github.com/new');
  console.log('   - Nom: projet-prima');
  console.log('   - Description: Centre commercial Prima Center - Abidjan');
  console.log('   - Public ou Private selon vos préférences');
  console.log('');
  console.log('3. Connecter le repository local:');
  console.log('   git remote add origin https://github.com/KangaFranck/projet-prima.git');
  console.log('   git branch -M main');
  console.log('   git push -u origin main');
  console.log('');
  console.log('4. Déployer sur Vercel:');
  console.log('   - Aller sur https://vercel.com');
  console.log('   - Connecter votre compte GitHub');
  console.log('   - Importer le repository projet-prima');
  console.log('   - Configurer les variables d\'environnement');
  console.log('   - Déployer!');
  console.log('');
  console.log('🌐 Votre site sera disponible sur: https://prima-five.vercel.app');
} else {
  console.log('❌ Certains fichiers requis sont manquants.');
  console.log('Veuillez corriger les erreurs avant de continuer.');
}

console.log('\n🎉 Préparation terminée!');
