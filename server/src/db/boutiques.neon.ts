import { getNeonSql } from './neon';

const sql = () => getNeonSql();

export interface BoutiqueRow {
  id: string;
  nom: string;
  type: string | null;
  description: string | null;
  horaires: unknown;
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

function rowToBoutique(r: BoutiqueRow) {
  return {
    _id: r.id,
    id: r.id,
    nom: r.nom,
    type: r.type ?? undefined,
    description: r.description ?? undefined,
    horaires: Array.isArray(r.horaires) ? r.horaires : (typeof r.horaires === 'string' ? JSON.parse(r.horaires || '[]') : []),
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

export async function neonGetAllBoutiques() {
  const rows = await sql()`SELECT * FROM boutiques ORDER BY created_at DESC`;
  return (rows as BoutiqueRow[]).map(rowToBoutique);
}

export async function neonGetBoutiqueById(id: string) {
  const rows = await sql()`SELECT * FROM boutiques WHERE id = ${id} LIMIT 1`;
  const r = (rows as BoutiqueRow[])[0];
  return r ? rowToBoutique(r) : null;
}

export async function neonCreateBoutique(data: Record<string, unknown>) {
  const horaires = JSON.stringify(data.horaires ?? []);
  const images = JSON.stringify(Array.isArray(data.images) ? data.images : []);
  const reseauxSociaux = JSON.stringify(data.reseauxSociaux ?? {});
  const ouvertLeDimanche = data.ouvertLeDimanche === true || data.ouvertLeDimanche === 'true';
  const rows = await sql()`
    INSERT INTO boutiques (nom, type, description, horaires, telephone, email, adresse, logo, images, statut, ouvert_le_dimanche, reseaux_sociaux)
    VALUES (
      ${String(data.nom)},
      ${data.type != null ? String(data.type) : null},
      ${data.description != null ? String(data.description) : null},
      ${horaires}::jsonb,
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
  const r = (rows as BoutiqueRow[])[0];
  return r ? rowToBoutique(r) : null;
}

export async function neonUpdateBoutique(id: string, data: Record<string, unknown>) {
  const horaires = data.horaires != null ? JSON.stringify(data.horaires) : undefined;
  const images = data.images != null ? JSON.stringify(data.images) : undefined;
  const reseauxSociaux = data.reseauxSociaux != null ? JSON.stringify(data.reseauxSociaux) : undefined;
  const ouvertLeDimanche = data.ouvertLeDimanche === true || data.ouvertLeDimanche === 'true';
  const rows = await sql()`
    UPDATE boutiques SET
      nom = COALESCE(${data.nom != null ? String(data.nom) : null}, nom),
      type = COALESCE(${data.type != null ? String(data.type) : null}, type),
      description = COALESCE(${data.description != null ? String(data.description) : null}, description),
      horaires = COALESCE(${horaires}::jsonb, horaires),
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
  const r = (rows as BoutiqueRow[])[0];
  return r ? rowToBoutique(r) : null;
}

export async function neonDeleteBoutique(id: string) {
  const rows = await sql()`DELETE FROM boutiques WHERE id = ${id} RETURNING id`;
  return (rows as { id: string }[]).length > 0;
}
