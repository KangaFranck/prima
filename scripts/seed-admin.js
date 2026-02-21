/**
 * Crée un admin Neon pour le back-office Prima Center.
 * Usage: node scripts/seed-admin.js [email] [password]
 * Ou avec .env / .env.local: ADMIN_EMAIL, ADMIN_PASSWORD (optionnel).
 * Dépendances: dotenv, @neondatabase/serverless, bcryptjs.
 */
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
dotenv.config({ path: join(root, '.env.local') });
dotenv.config({ path: join(root, '.env') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL manquant. Définissez-le dans .env ou .env.local');
  process.exit(1);
}

const email = process.argv[2] || process.env.ADMIN_EMAIL || 'communicationprimacenter@gmail.com';
const password = process.argv[3] || process.env.ADMIN_PASSWORD || 'Pr!ma@center#2025';
const name = process.env.ADMIN_NAME || 'Administrateur Principal';

const permissions = ['dashboard', 'boutiques', 'restaurants', 'loisirs', 'evenements', 'settings', 'users'];

async function main() {
  const sql = neon(DATABASE_URL);
  const password_hash = bcrypt.hashSync(password, 10);

  try {
    await sql`
      INSERT INTO admins (email, password_hash, name, permissions)
      VALUES (${email}, ${password_hash}, ${name}, ${JSON.stringify(permissions)})
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        name = EXCLUDED.name,
        permissions = EXCLUDED.permissions,
        updated_at = NOW()
    `;
    console.log('✅ Admin créé ou mis à jour:', email);
  } catch (err) {
    console.error('❌ Erreur seed admin:', err);
    process.exit(1);
  }
}

main();
