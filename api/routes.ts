import { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './db.ts';
import { getAdminFromToken, withAdminAuth } from './middleware/auth.ts';
import { rowToBoutique, rowToRestaurant, rowToLoisir, rowToEvenement, toTimePg } from './lib/mappers.ts';
import { uploadToR2, checkR2 } from './lib/r2.ts';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000,http://localhost:3001,https://prima-five.vercel.app,https://prima-six-eta.vercel.app').split(',').map((s) => s.trim().replace(/\/$/, '')).filter(Boolean);

function cors(res: VercelResponse, origin: string | undefined) {
  const originNorm = origin ? origin.replace(/\/$/, '') : '';
  const allowed = originNorm && ALLOWED_ORIGINS.includes(originNorm);
  const vercelApp = originNorm && /\.vercel\.app$/i.test(originNorm);
  const o = allowed ? originNorm : (vercelApp ? originNorm : ALLOWED_ORIGINS[0]);
  res.setHeader('Access-Control-Allow-Origin', o || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;
  cors(res, origin);

  if ((req.method || '').toUpperCase() === 'OPTIONS') {
    return res.status(204).end();
  }

  const path = ((req.query.path as string) || '').replace(/\/$/, '').trim();
  const segments = path.split('/').filter(Boolean);
  const [resource, id] = segments;

  // GET /api/debug — diagnostic : path, method, env (sans secrets) pour trouver la cause 405
  if (path === 'debug' && (req.method || '').toUpperCase() === 'GET') {
    const originNorm = (origin || '').replace(/\/$/, '');
    return res.status(200).json({
      ok: true,
      path,
      method: req.method,
      xForwardedMethod: req.headers['x-vercel-forwarded-method'],
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      hasJwtSecret: Boolean(process.env.JWT_SECRET),
      allowedOriginsCount: (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean).length,
      originReceived: originNorm || null,
      hint: 'Si method !== POST sur login, le problème vient du routage Vercel. Ajoute ton URL dans ALLOWED_ORIGINS sur Vercel.',
    });
  }

  // GET /api/instagram-oembed — miniature (cover) d'un post/reel Instagram
  if (path === 'instagram-oembed' && req.method === 'GET') {
    const postUrl = (req.query.url as string) || '';
    if (!postUrl || !/instagram\.com\/(p|reel)\//i.test(postUrl)) {
      return res.status(400).json({ error: 'URL Instagram post/reel requise (paramètre url).' });
    }
    try {
      const fetchUrl = `https://api.instagram.com/oembed?url=${encodeURIComponent(postUrl)}`;
      const r = await fetch(fetchUrl);
      if (!r.ok) {
        const t = await r.text();
        return res.status(r.status).json({ error: 'Instagram oEmbed indisponible', detail: t.slice(0, 200) });
      }
      const data = (await r.json()) as { thumbnail_url?: string; title?: string };
      return res.status(200).json({ thumbnail_url: data.thumbnail_url || null, title: data.title || null });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return res.status(502).json({ error: 'Erreur lors de la récupération de la miniature Instagram', detail: msg });
    }
  }

  // GET /api/health — vérifie Neon + R2 (réécrit en /api/routes?path=health)
  if (path === 'health' && req.method === 'GET') {
    const result: { ok: boolean; api: string; database: string | { error: string }; r2: string | { error: string } } = {
      ok: true,
      api: 'prima-center',
      database: 'ok',
      r2: 'ok',
    };
    try {
      await sql`SELECT 1`;
    } catch (e) {
      result.ok = false;
      result.database = { error: e instanceof Error ? e.message : String(e) };
    }
    const r2Result = await checkR2();
    if (!r2Result.ok) {
      result.ok = false;
      result.r2 = { error: r2Result.error || 'R2 indisponible' };
    }
    return res.status(result.ok ? 200 : 503).json(result);
  }

  try {
    // ---- Login : /api/login ET /api/auth/login (un seul handler = plus de 404) ----
    const isLoginPath = path === 'login' || path === 'auth/login';
    if (isLoginPath) {
      const raw = req.headers['x-vercel-forwarded-method'] ?? req.method ?? '';
      const method = (Array.isArray(raw) ? raw[0] : raw).toUpperCase();
      if (method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
      }
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { email, password } = body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
      }
      const rows = await sql`SELECT id, email, password_hash, name, permissions FROM admins WHERE email = ${email} LIMIT 1`;
      const admin = rows[0];
      if (!admin) {
        return res.status(401).json({ error: 'Identifiants incorrects.' });
      }
      const ok = await bcrypt.compare(password, (admin as any).password_hash);
      if (!ok) {
        return res.status(401).json({ error: 'Identifiants incorrects.' });
      }
      const permissions = (admin as any).permissions || ['dashboard', 'boutiques', 'restaurants', 'loisirs', 'evenements', 'settings', 'users'];
      const token = jwt.sign(
        { adminId: (admin as any).id, email: (admin as any).email, permissions },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      const record = {
        id: (admin as any).id,
        email: (admin as any).email,
        name: (admin as any).name,
        role: 'super_admin',
        permissions,
        isActive: true,
      };
      return res.status(200).json({ token, record });
    }

    // ---- Upload (admin only) ----
    if (path === 'upload' && req.method === 'POST') {
      return withAdminAuth(async (req: VercelRequest, res: VercelResponse) => {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
        const { file, folder, name } = body; // file = base64
        if (!file || !folder || !name) {
          return res.status(400).json({ error: 'file (base64), folder et name requis' });
        }
        try {
          const buf = Buffer.from(file, 'base64');
          const key = `${folder}/${Date.now()}-${name}`;
          const contentType = body.contentType || 'application/octet-stream';
          const url = await uploadToR2(key, buf, contentType);
          return res.status(200).json({ url, key });
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          if (msg.includes('R2_') || msg.includes('requis')) {
            return res.status(503).json({
              error: 'R2 non configuré. Vous pouvez enregistrer sans image.',
              code: 'R2_NOT_CONFIGURED',
            });
          }
          throw e;
        }
      })(req, res);
    }

    // ---- Public GET: boutiques, restaurants, loisirs, evenements ----
    if (req.method === 'GET' && ['boutiques', 'restaurants', 'loisirs', 'evenements'].includes(resource)) {
      let rows: Record<string, unknown>[];
      if (resource === 'boutiques') {
        rows = id ? await sql`SELECT * FROM boutiques WHERE id = ${id} LIMIT 1` : await sql`SELECT * FROM boutiques ORDER BY created_at DESC`;
      } else if (resource === 'restaurants') {
        rows = id ? await sql`SELECT * FROM restaurants WHERE id = ${id} LIMIT 1` : await sql`SELECT * FROM restaurants ORDER BY created_at DESC`;
      } else if (resource === 'loisirs') {
        rows = id ? await sql`SELECT * FROM loisirs WHERE id = ${id} LIMIT 1` : await sql`SELECT * FROM loisirs ORDER BY created_at DESC`;
      } else {
        rows = id ? await sql`SELECT * FROM evenements WHERE id = ${id} LIMIT 1` : await sql`SELECT * FROM evenements ORDER BY created_at DESC`;
      }
      const m = resource === 'boutiques' ? rowToBoutique : resource === 'restaurants' ? rowToRestaurant : resource === 'loisirs' ? rowToLoisir : rowToEvenement;
      if (id) {
        if (rows.length === 0) return res.status(404).json({ error: 'Non trouvé' });
        return res.status(200).json(m(rows[0]));
      }
      return res.status(200).json(rows.map((r) => m(r)));
    }

    // ---- Protected mutations ----
    const admin = getAdminFromToken(req);
    if (!admin && req.method !== 'GET') {
      return res.status(401).json({ error: 'Token manquant ou invalide' });
    }

    if (resource === 'boutiques') {
      if (req.method === 'POST') {
        const b = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
        const [inserted] = await sql`
          INSERT INTO boutiques (nom, description, logo_url, image_url, logo_carousel_url, website, horaires, heure_ouverture, heure_fermeture, open_sunday, statut, universe, telephone, email, instagram, facebook, tiktok)
          VALUES (${b.nom || ''}, ${b.description || ''}, ${b.logo_url || null}, ${b.image_url || null}, ${b.logoCarousel || b.logo_carousel_url || null}, ${b.website || null}, ${b.horaires || ''}, ${toTimePg(b.heureOuverture)}::time, ${toTimePg(b.heureFermeture)}::time, ${!!b.openSunday}, ${b.statut || 'actif'}, ${b.universe || 'Général'}, ${b.telephone || null}, ${b.email || null}, ${b.instagram || null}, ${b.facebook || null}, ${b.tiktok || null})
          RETURNING *
        `;
        return res.status(201).json(rowToBoutique((inserted as Record<string, unknown>)!));
      }
      if (req.method === 'PUT' && id) {
        const b = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
        await sql`
          UPDATE boutiques SET
            nom = ${b.nom ?? ''},
            description = ${b.description ?? ''},
            logo_url = ${b.logo_url ?? b.logo ?? null},
            image_url = ${b.image_url ?? b.image ?? null},
            logo_carousel_url = ${b.logoCarousel ?? b.logo_carousel_url ?? null},
            website = ${b.website ?? null},
            horaires = ${b.horaires ?? ''},
            heure_ouverture = ${toTimePg(b.heureOuverture)}::time,
            heure_fermeture = ${toTimePg(b.heureFermeture)}::time,
            open_sunday = ${!!b.openSunday},
            statut = ${b.statut ?? 'actif'},
            universe = ${b.universe ?? 'Général'},
            telephone = ${b.telephone ?? null},
            email = ${b.email ?? null},
            instagram = ${b.instagram ?? null},
            facebook = ${b.facebook ?? null},
            tiktok = ${b.tiktok ?? null}
          WHERE id = ${id}
        `;
        const [row] = await sql`SELECT * FROM boutiques WHERE id = ${id}`;
        if (!row) return res.status(404).json({ error: 'Non trouvé' });
        return res.status(200).json(rowToBoutique(row as Record<string, unknown>));
      }
      if (req.method === 'DELETE' && id) {
        await sql`DELETE FROM boutiques WHERE id = ${id}`;
        return res.status(200).json({ ok: true });
      }
    }

    if (resource === 'restaurants') {
      if (req.method === 'POST') {
        const b = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
        const [inserted] = await sql`
          INSERT INTO restaurants (nom, description, cuisine, logo_url, image_url, logo_carousel_url, website, menu_url, horaires, heure_ouverture, heure_fermeture, open_sunday, statut, universe, telephone, email, instagram, facebook, tiktok)
          VALUES (${b.nom || ''}, ${b.description || ''}, ${b.cuisine || ''}, ${b.logo_url || null}, ${b.image_url || null}, ${b.logoCarousel || null}, ${b.website || null}, ${b.menu_url || b.menu || null}, ${b.horaires || ''}, ${toTimePg(b.heureOuverture)}::time, ${toTimePg(b.heureFermeture)}::time, ${!!b.openSunday}, ${b.statut || 'actif'}, ${b.universe || 'Général'}, ${b.telephone || null}, ${b.email || null}, ${b.instagram || null}, ${b.facebook || null}, ${b.tiktok || null})
          RETURNING *
        `;
        return res.status(201).json(rowToRestaurant((inserted as Record<string, unknown>)!));
      }
      if (req.method === 'PUT' && id) {
        const b = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
        await sql`
          UPDATE restaurants SET
            nom = ${b.nom ?? ''}, description = ${b.description ?? ''}, cuisine = ${b.cuisine ?? ''},
            logo_url = ${b.logo_url ?? b.logo ?? null}, image_url = ${b.image_url ?? b.image ?? null}, logo_carousel_url = ${b.logoCarousel ?? null},
            website = ${b.website ?? null}, menu_url = ${b.menu_url ?? b.menu ?? null},
            horaires = ${b.horaires ?? ''}, heure_ouverture = ${toTimePg(b.heureOuverture)}::time, heure_fermeture = ${toTimePg(b.heureFermeture)}::time,
            open_sunday = ${!!b.openSunday}, statut = ${b.statut ?? 'actif'}, universe = ${b.universe ?? 'Général'},
            telephone = ${b.telephone ?? null}, email = ${b.email ?? null}, instagram = ${b.instagram ?? null}, facebook = ${b.facebook ?? null}, tiktok = ${b.tiktok ?? null}
          WHERE id = ${id}
        `;
        const [row] = await sql`SELECT * FROM restaurants WHERE id = ${id}`;
        if (!row) return res.status(404).json({ error: 'Non trouvé' });
        return res.status(200).json(rowToRestaurant(row as Record<string, unknown>));
      }
      if (req.method === 'DELETE' && id) {
        await sql`DELETE FROM restaurants WHERE id = ${id}`;
        return res.status(200).json({ ok: true });
      }
    }

    if (resource === 'loisirs') {
      if (req.method === 'POST') {
        const b = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
        const [inserted] = await sql`
          INSERT INTO loisirs (nom, description, logo_url, image_url, logo_carousel_url, website, type, level, horaires, heure_ouverture, heure_fermeture, open_sunday, statut, universe, telephone, email, instagram, facebook, tiktok)
          VALUES (${b.nom || ''}, ${b.description || ''}, ${b.logo_url || null}, ${b.image_url || null}, ${b.logoCarousel || null}, ${b.website || null}, ${b.type || ''}, ${b.level || ''}, ${b.horaires || ''}, ${toTimePg(b.heureOuverture)}::time, ${toTimePg(b.heureFermeture)}::time, ${!!b.openSunday}, ${b.statut || 'actif'}, ${b.universe || 'Général'}, ${b.telephone || null}, ${b.email || null}, ${b.instagram || null}, ${b.facebook || null}, ${b.tiktok || null})
          RETURNING *
        `;
        return res.status(201).json(rowToLoisir((inserted as Record<string, unknown>)!));
      }
      if (req.method === 'PUT' && id) {
        const b = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
        await sql`
          UPDATE loisirs SET
            nom = ${b.nom ?? ''}, description = ${b.description ?? ''},
            logo_url = ${b.logo_url ?? b.logo ?? null}, image_url = ${b.image_url ?? b.image ?? null}, logo_carousel_url = ${b.logoCarousel ?? null},
            website = ${b.website ?? null}, type = ${b.type ?? ''}, level = ${b.level ?? ''},
            horaires = ${b.horaires ?? ''}, heure_ouverture = ${toTimePg(b.heureOuverture)}::time, heure_fermeture = ${toTimePg(b.heureFermeture)}::time,
            open_sunday = ${!!b.openSunday}, statut = ${b.statut ?? 'actif'}, universe = ${b.universe ?? 'Général'},
            telephone = ${b.telephone ?? null}, email = ${b.email ?? null}, instagram = ${b.instagram ?? null}, facebook = ${b.facebook ?? null}, tiktok = ${b.tiktok ?? null}
          WHERE id = ${id}
        `;
        const [row] = await sql`SELECT * FROM loisirs WHERE id = ${id}`;
        if (!row) return res.status(404).json({ error: 'Non trouvé' });
        return res.status(200).json(rowToLoisir(row as Record<string, unknown>));
      }
      if (req.method === 'DELETE' && id) {
        await sql`DELETE FROM loisirs WHERE id = ${id}`;
        return res.status(200).json({ ok: true });
      }
    }

    if (resource === 'evenements') {
      if (req.method === 'POST') {
        const b = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
        const dateVal = b.date ? new Date(b.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
        const [inserted] = await sql`
          INSERT INTO evenements (titre, description, date, heure, lieu, statut, affiche_url, image_url)
          VALUES (${b.titre || ''}, ${b.description || ''}, ${dateVal}, ${b.heure || null}, ${b.lieu || ''}, ${b.statut || 'planifié'}, ${b.affiche_url ?? b.affiche ?? null}, ${b.image_url ?? b.image ?? null})
          RETURNING *
        `;
        return res.status(201).json(rowToEvenement((inserted as Record<string, unknown>)!));
      }
      if (req.method === 'PUT' && id) {
        const b = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
        const dateVal = b.date ? new Date(b.date).toISOString().slice(0, 10) : undefined;
        await sql`
          UPDATE evenements SET
            titre = ${b.titre ?? ''}, description = ${b.description ?? ''},
            date = COALESCE(${dateVal || null}::date, date),
            heure = ${b.heure ?? null}, lieu = ${b.lieu ?? ''}, statut = ${b.statut ?? 'planifié'},
            affiche_url = ${b.affiche_url ?? b.affiche ?? null}, image_url = ${b.image_url ?? b.image ?? null}
          WHERE id = ${id}
        `;
        const [row] = await sql`SELECT * FROM evenements WHERE id = ${id}`;
        if (!row) return res.status(404).json({ error: 'Non trouvé' });
        return res.status(200).json(rowToEvenement(row as Record<string, unknown>));
      }
      if (req.method === 'DELETE' && id) {
        await sql`DELETE FROM evenements WHERE id = ${id}`;
        return res.status(200).json({ ok: true });
      }
    }

    return res.status(404).json({ error: 'Route non trouvée' });
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
