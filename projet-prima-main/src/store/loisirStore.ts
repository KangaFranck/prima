import { create } from "zustand";
import { pb, getFileUrl } from "../services/pbClient";

interface Loisir {
  id: string;
  name: string;
  description: string;
  universe: string;
  image: string;
  logo?: string;
  horaires?: string; // Simple string field for free text
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

interface LoisirStore {
  loisirs: Loisir[];
  loading: boolean;
  error: string | null;
  fetchLoisirs: () => Promise<void>;
}

function mapRecordToLoisir(record: any): Loisir {
  const logoUrl = record.logo ? getFileUrl(record, record.logo) || "" : "";
  const imageUrl = record.image ? getFileUrl(record, record.image) || "" : "";

  return {
    id: record.id,
    //  CORRECTION: Utiliser le bon champ pour le nom
    name: record.nom || record.name || "Loisir sans nom",
    description: record.description || "",
    universe: record.universe || "Autre",
    image: imageUrl || "/images/logos/default.png",
    logo: logoUrl,
    statut: record.statut || "actif",
    heureOuverture: record.heureOuverture,
    heureFermeture: record.heureFermeture,
    openSunday: !!record.openSunday,
    telephone: record.telephone,
    email: record.email || record.mail,
    siteWeb: record.siteWeb,
    adresse: record.adresse,
    horaires: record.horaires,
    // Essayer toutes les variantes possibles
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
      // Récupérer tous les loisirs
      const result = await pb.collection("loisirs").getFullList();
      console.log(" Raw loisirs data:", result);
      
      // Filtrer côté client pour l'instant
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
