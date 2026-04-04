import { create } from "zustand";
import { getFileUrl } from "../utils/mediaUrl";
import { apiClient } from "../services/apiClient";

interface Boutique {
  _id: string;
  nom: string;
  description: string;
  universe: string;
  image: string;
  logo?: string;
  logoCarousel?: string;
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
  adresse?: string;
}

interface BoutiqueStore {
  boutiques: Boutique[];
  loading: boolean;
  error: string | null;
  fetchBoutiques: () => Promise<void>;
}

function imgUrl(record: any, field: string): string {
  const v = record[field];
  if (typeof v === 'string' && v.startsWith('http')) return v;
  return (record[field] ? getFileUrl(record, record[field]) : '') || '';
}

function mapRecordToBoutique(record: any): Boutique {
  const logoUrl = imgUrl(record, 'logo');
  const imageUrl = imgUrl(record, 'image');
  const logoCarouselUrl = imgUrl(record, 'logoCarousel');

  return {
    _id: record.id,
    nom: record.nom || record.name,
    description: record.description || record.description_ || "",
    universe: record.universe || "Autre",
    image: imageUrl || "/images/logos/default.png",
    logo: logoUrl,
    logoCarousel: logoCarouselUrl || undefined,
    horaires: record.horaires,
    heureOuverture: record.heureOuverture || "09:00",
    heureFermeture: record.heureFermeture || "18:00",
    openSunday: !!record.openSunday,
    statut: record.statut || "actif",
    telephone: record.telephone,
    facebook: record.facebook,
    instagram: record.instagram || record.Instagram,
    tiktok: record.tiktok || record.TikTok || record.TIKTOK || record.tt || record.TT,
    email: record.email || record.mail,
    siteWeb: record.siteWeb,
    adresse: record.adresse,
  };
}

export const useBoutiqueStore = create<BoutiqueStore>((set, get) => ({
  boutiques: [],
  loading: false,
  error: null,

  fetchBoutiques: async () => {
    const state = get();
    if (state.loading) return;
    set({ loading: true, error: null });
    try {
      const result = await apiClient.boutiques.list();
      const activeBoutiques = result.map((r: any) => mapRecordToBoutique(r)).filter((b: Boutique) => b.statut !== "inactif");
      set({ boutiques: activeBoutiques, loading: false });
    } catch (error) {
      console.error("Error fetching boutiques:", error);
      set({ error: "Erreur lors de la recuperation des boutiques", loading: false });
    }
  },
}));
