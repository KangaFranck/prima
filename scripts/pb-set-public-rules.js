#!/usr/bin/env node
/**
 * Applique les règles API PocketBase pour autoriser la lecture publique
 * (list + view) sur les collections : boutiques, restaurants, loisirs, evenements.
 *
 * Prérequis :
 * - PocketBase doit être lancé (npm run pb:serve)
 * - Un admin doit exister (créé via http://127.0.0.1:8090/_/)
 *
 * Usage :
 *   Définir dans .env : PB_ADMIN_EMAIL et PB_ADMIN_PASSWORD (compte admin PocketBase)
 *   Puis : npm run pb:rules
 */
import 'dotenv/config';
import { fileURLToPath } from 'url';
import path from 'path';
import { readFileSync, existsSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PB_URL = process.env.VITE_PB_URL || process.env.PB_URL || 'http://127.0.0.1:8090';
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD;

const COLLECTIONS_PUBLIC = ['boutiques', 'restaurants', 'loisirs', 'evenements'];

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const m = line.match(/^\s*PB_ADMIN_EMAIL\s*=\s*(.+)$/);
    if (m) process.env.PB_ADMIN_EMAIL = m[1].trim().replace(/\r$/, '').replace(/^["']|["']$/g, '');
    const m2 = line.match(/^\s*PB_ADMIN_PASSWORD\s*=\s*(.+)$/);
    if (m2) process.env.PB_ADMIN_PASSWORD = m2[1].trim().replace(/\r$/, '').replace(/^["']|["']$/g, '');
  }
}

async function main() {
  loadEnv();
  const email = process.env.PB_ADMIN_EMAIL || ADMIN_EMAIL;
  const password = process.env.PB_ADMIN_PASSWORD || ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('❌ Définissez PB_ADMIN_EMAIL et PB_ADMIN_PASSWORD dans votre fichier .env');
    console.error('   (utilisez le compte admin créé sur http://127.0.0.1:8090/_/)');
    process.exit(1);
  }

  console.log('🔐 Connexion à PocketBase...', PB_URL);

  let token;
  try {
    const authRes = await fetch(`${PB_URL}/api/admins/auth-with-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: email, password }),
    });
    if (!authRes.ok) {
      const err = await authRes.json().catch(() => ({}));
      console.error('❌ Connexion admin échouée:', authRes.status, err);
      if (authRes.status === 400) {
        console.error('');
        console.error('   Email utilisé :', email);
        console.error('   → Soit l’admin n’existe pas encore : créez-le sur http://127.0.0.1:8090/_/ avec cet email et le mot de passe de .env');
        console.error('   → Soit le mot de passe dans .env ne correspond pas : mettez à jour PB_ADMIN_PASSWORD avec le mot de passe de votre admin PocketBase.');
        console.error('   → Sinon, configurez les règles à la main : voir pocketbase/REGLES_API_PUBLIC.md');
      }
      process.exit(1);
    }
    const authData = await authRes.json();
    token = authData.token;
  } catch (err) {
    console.error('❌ PocketBase injoignable. Lancez-le avec : npm run pb:serve');
    process.exit(1);
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': token,
  };

  let collections;
  try {
    const listRes = await fetch(`${PB_URL}/api/collections`, { headers });
    if (!listRes.ok) {
      console.error('❌ Impossible de lister les collections:', listRes.status);
      process.exit(1);
    }
    const data = await listRes.json();
    collections = data.items || data;
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    process.exit(1);
  }

  const byName = {};
  for (const c of collections) {
    byName[c.name] = c;
  }

  for (const name of COLLECTIONS_PUBLIC) {
    const col = byName[name];
    if (!col) {
      console.warn('⚠️ Collection non trouvée:', name);
      continue;
    }
    try {
      const patchRes = await fetch(`${PB_URL}/api/collections/${col.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          listRule: '',
          viewRule: '',
        }),
      });
      if (!patchRes.ok) {
        console.error('❌', name, patchRes.status, await patchRes.text());
        continue;
      }
      console.log('✅', name, '→ lecture publique (list + view)');
    } catch (err) {
      console.error('❌', name, err.message);
    }
  }

  console.log('\n✅ Règles appliquées. Rechargez le site pour voir les données.');
}

main();
