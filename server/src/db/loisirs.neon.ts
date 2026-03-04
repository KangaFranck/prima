import { getNeonSql } from './neon';

const sql = () => getNeonSql();

export interface LoisirRow {
  id: string;
  nom: string;
  type: string | null;
  description: string | null;
  horaires: string | null;
  telephone: string | null;
  email: string | null;
  adresse: string | null;
  logo: string | null;
  images: unknown;
  statut: string;
  ouvert_le_dimanche: boolean;
  reseaux_sociaux: unknown;
  tarifs: unknown;
  created_at: Date;
  updated_at: Date;
}

function rowToLoisir(r: LoisirRow) {
  return {
    _id: r.id,
    id: r.id,
    nom: r.nom,
    type: r.type ?? undefined,
    description: r.description ?? undefined,
    horaires: r.horaires ?? undefined,
    telephone: r.telephone ?? undefined,
    email: r.email ?? undefined,
    adresse: r.adresse ?? undefined,
    logo: r.logo ?? undefined,
    images: Array.isArray(r.images) ? r.images : (typeof r.images === 'string' ? JSON.parse(r.images || '[]') : []),
    statut: r.statut,
    ouvertLeDimanche: r.ouvert_le_dimanche,
    reseauxSociaux: typeof r.reseaux_sociaux === 'object' ? r.reseaux_sociaux : (typeof r.reseaux_sociaux === 'string' ? JSON.parse(r.reseaux_sociaux || '{}') : {}),
    tarifs: Array.isArray(r.tarifs) ? r.tarifs : (typeof r.tarifs === 'string' ? JSON.parse(r.tarifs || '[]') : []),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export async function neonGetAllLoisirs() {
  const rows = await sql()`SELECT * FROM loisirs ORDER BY created_at DESC`;
  return (rows as LoisirRow[]).map(rowToLoisir);
}

export async function neonGetLoisirById(id: string) {
  const rows = await sql()`SELECT * FROM loisirs WHERE id = ${id} LIMIT 1`;
  const r = (rows as LoisirRow[])[0];
  return r ? rowToLoisir(r) : null;
}

export async function neonCreateLoisir(data: Record<string, unknown>) {
  const images = JSON.stringify(Array.isArray(data.images) ? data.images : []);
  const reseauxSociaux = JSON.stringify(data.reseauxSociaux ?? {});
  const tarifs = JSON.stringify(Array.isArray(data.tarifs) ? data.tarifs : []);
  const ouvertLeDimanche = data.ouvertLeDimanche === true || data.ouvertLeDimanche === 'true';
  const rows = await sql()`
    INSERT INTO loisirs (nom, type, description, horaires, telephone, email, adresse, logo, images, statut, ouvert_le_dimanche, reseaux_sociaux, tarifs)
    VALUES (
      ${String(data.nom)},
      ${data.type != null ? String(data.type) : null},
      ${data.description != null ? String(data.description) : null},
      ${data.horaires != null ? String(data.horaires) : null},
      ${data.telephone != null ? String(data.telephone) : null},
      ${data.email != null ? String(data.email) : null},
      ${data.adresse != null ? String(data.adresse) : null},
      ${data.logo != null ? String(data.logo) : null},
      ${images}::jsonb,
      ${String(data.statut || 'actif')},
      ${ouvertLeDimanche},
      ${reseauxSociaux}::jsonb,
      ${tarifs}::jsonb
    )
    RETURNING *
  `;
  const r = (rows as LoisirRow[])[0];
  return r ? rowToLoisir(r) : null;
}

export async function neonUpdateLoisir(id: string, data: Record<string, unknown>) {
  const images = data.images != null ? JSON.stringify(data.images) : undefined;
  const reseauxSociaux = data.reseauxSociaux != null ? JSON.stringify(data.reseauxSociaux) : undefined;
  const ouvertLeDimanche = data.ouvertLeDimanche === true || data.ouvertLeDimanche === 'true';
  const rows = await sql()`
    UPDATE loisirs SET
      nom = COALESCE(${data.nom != null ? String(data.nom) : null}, nom),
      type = COALESCE(${data.type != null ? String(data.type) : null}, type),
      description = COALESCE(${data.description != null ? String(data.description) : null}, description),
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
  const r = (rows as LoisirRow[])[0];
  return r ? rowToLoisir(r) : null;
}

export async function neonDeleteLoisir(id: string) {
  const rows = await sql()`DELETE FROM loisirs WHERE id = ${id} RETURNING id`;
  return (rows as { id: string }[]).length > 0;
}
