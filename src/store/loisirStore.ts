import { create } from "zustand";
import { pb, getFileUrl } from "../services/pbClient";
import { apiClient, useApi } from "../services/apiClient";

interface Loisir {
  id: string;
  name: string;
  description: string;
  universe: string;
  image: string;
  logo?: string;
  horaires?: string;
  heureOuverture: string;
  heureFermeture: string;
  openSunday: boolean;
  statut: "actif" | "inactif";
  telephone?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  email?: string;
  siteWeb?: string;
  website?: string;
  logoCarousel?: string;
  adresse?: string;
}

interface LoisirStore {
  loisirs: Loisir[];
  loading: boolean;
  error: string | null;
  fetchLoisirs: () => Promise<void>;
}

function imgUrl(record: any, field: string): string {
  const v = record[field];
  if (typeof v === 'string' && v.startsWith('http')) return v;
  return (record[field] ? getFileUrl(record, record[field]) : '') || '';
}

function mapRecordToLoisir(record: any): Loisir {
  const logoUrl = imgUrl(record, 'logo');
  const imageUrl = imgUrl(record, 'image');
  const logoCarouselUrl = imgUrl(record, 'logoCarousel');

  return {
    id: record.id,
    name: record.nom || record.name || "Loisir sans nom",
    description: record.description || "",
    universe: record.universe || "Autre",
    image: imageUrl || "/images/logos/default.png",
    logo: logoUrl,
    logoCarousel: logoCarouselUrl || undefined,
    website: record.website || record.siteWeb,
    statut: record.statut || "actif",
    heureOuverture: record.heureOuverture,
    heureFermeture: record.heureFermeture,
    openSunday: !!record.openSunday,
    telephone: record.telephone,
    email: record.email || record.mail,
    siteWeb: record.siteWeb || record.website,
    adresse: record.adresse,
    horaires: record.horaires,
    facebook: record.facebook,
    instagram: record.instagram || record.Instagram,
    tiktok: record.tiktok || record.TikTok || record.TIKTOK || record.tt || record.TT,
  };
}

export const useLoisirStore = create<LoisirStore>((set, get) => ({
  loisirs: [],
  loading: false,
  error: null,

  fetchLoisirs: async () => {
    const state = get();
    if (state.loading) return;
    set({ loading: true, error: null });
    try {
      if (useApi()) {
        const result = await apiClient.loisirs.list();
        const loisirs = result.map((r: any) => mapRecordToLoisir(r)).filter((l: Loisir) => l.statut !== 'inactif');
        set({ loisirs, loading: false });
        return;
      }
      const result = await pb.collection("loisirs").getFullList();
      const loisirs = result
        .map(mapRecordToLoisir)
        .filter(loisir => loisir.statut === "actif");
      
      console.log(` Loisirs actifs récupérés: ${loisirs.length}`);
      set({ loisirs, loading: false });
    } catch (error) {
      console.error("Error fetching loisirs:", error);
      set({ error: "Erreur lors de la recuperation des loisirs", loading: false });
    }
  },
}));
