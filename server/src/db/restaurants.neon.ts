import { getNeonSql } from './neon';

const sql = () => getNeonSql();

export interface RestaurantRow {
  id: string;
  nom: string;
  description: string | null;
  cuisine: string | null;
  horaires: string | null;
  telephone: string | null;
  email: string | null;
  adresse: string | null;
  logo: string | null;
  images: unknown;
  statut: string;
  ouvert_le_dimanche: boolean;
  reseaux_sociaux: unknown;
  created_at: Date;
  updated_at: Date;
}

function rowToRestaurant(r: RestaurantRow) {
  return {
    _id: r.id,
    id: r.id,
    nom: r.nom,
    description: r.description ?? undefined,
    cuisine: r.cuisine ?? undefined,
    horaires: r.horaires ?? undefined,
    telephone: r.telephone ?? undefined,
    email: r.email ?? undefined,
    adresse: r.adresse ?? undefined,
    logo: r.logo ?? undefined,
    images: Array.isArray(r.images) ? r.images : (typeof r.images === 'string' ? JSON.parse(r.images || '[]') : []),
    statut: r.statut,
    ouvertLeDimanche: r.ouvert_le_dimanche,
    reseauxSociaux: typeof r.reseaux_sociaux === 'object' ? r.reseaux_sociaux : (typeof r.reseaux_sociaux === 'string' ? JSON.parse(r.reseaux_sociaux || '{}') : {}),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export async function neonGetAllRestaurants() {
  const rows = await sql()`SELECT * FROM restaurants ORDER BY created_at DESC`;
  return (rows as RestaurantRow[]).map(rowToRestaurant);
}

export async function neonGetRestaurantById(id: string) {
  const rows = await sql()`SELECT * FROM restaurants WHERE id = ${id} LIMIT 1`;
  const r = (rows as RestaurantRow[])[0];
  return r ? rowToRestaurant(r) : null;
}

export async function neonCreateRestaurant(data: Record<string, unknown>) {
  const images = JSON.stringify(Array.isArray(data.images) ? data.images : []);
  const reseauxSociaux = JSON.stringify(data.reseauxSociaux ?? {});
  const ouvertLeDimanche = data.ouvertLeDimanche === true || data.ouvertLeDimanche === 'true';
  const rows = await sql()`
    INSERT INTO restaurants (nom, description, cuisine, horaires, telephone, email, adresse, logo, images, statut, ouvert_le_dimanche, reseaux_sociaux)
    VALUES (
      ${String(data.nom)},
      ${data.description != null ? String(data.description) : null},
      ${data.cuisine != null ? String(data.cuisine) : null},
      ${data.horaires != null ? String(data.horaires) : null},
      ${data.telephone != null ? String(data.telephone) : null},
      ${data.email != null ? String(data.email) : null},
      ${data.adresse != null ? String(data.adresse) : null},
      ${data.logo != null ? String(data.logo) : null},
      ${images}::jsonb,
      ${String(data.statut || 'actif')},
      ${ouvertLeDimanche},
      ${reseauxSociaux}::jsonb
    )
    RETURNING *
  `;
  const r = (rows as RestaurantRow[])[0];
  return r ? rowToRestaurant(r) : null;
}

export async function neonUpdateRestaurant(id: string, data: Record<string, unknown>) {
  const images = data.images != null ? JSON.stringify(data.images) : undefined;
  const reseauxSociaux = data.reseauxSociaux != null ? JSON.stringify(data.reseauxSociaux) : undefined;
  const ouvertLeDimanche = data.ouvertLeDimanche === true || data.ouvertLeDimanche === 'true';
  const rows = await sql()`
    UPDATE restaurants SET
      nom = COALESCE(${data.nom != null ? String(data.nom) : null}, nom),
      description = COALESCE(${data.description != null ? String(data.description) : null}, description),
      cuisine = COALESCE(${data.cuisine != null ? String(data.cuisine) : null}, cuisine),
      horaires = COALESCE(${data.horaires != null ? String(data.horaires) : null}, horaires),
      telephone = COALESCE(${data.telephone != null ? String(data.telephone) : null}, telephone),
      email = COALESCE(${data.email != null ? String(data.email) : null}, email),
      adresse = COALESCE(${data.adresse != null ? String(data.adresse) : null}, adresse),
      logo = COALESCE(${data.logo != null ? String(data.logo) : null}, logo),
      images = COALESCE(${images}::jsonb, images),
      statut = COALESCE(${data.statut != null ? String(data.statut) : null}, statut),
      ouvert_le_dimanche = COALESCE(${ouvertLeDimanche}, ouvert_le_dimanche),
      reseaux_sociaux = COALESCE(${reseauxSociaux}::jsonb, reseaux_sociaux),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  const r = (rows as RestaurantRow[])[0];
  return r ? rowToRestaurant(r) : null;
}

export async function neonDeleteRestaurant(id: string) {
  const rows = await sql()`DELETE FROM restaurants WHERE id = ${id} RETURNING id`;
  return (rows as { id: string }[]).length > 0;
}
