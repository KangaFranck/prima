import { create } from "zustand";
import { pb, getFileUrl } from "../services/pbClient";

interface Boutique {
  _id: string;
  nom: string;
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

interface BoutiqueStore {
  boutiques: Boutique[];
  loading: boolean;
  error: string | null;
  fetchBoutiques: () => Promise<void>;
}

function mapRecordToBoutique(record: any): Boutique {
  const logoUrl = record.logo ? getFileUrl(record, record.logo) || "" : "";
  const imageUrl = record.image ? getFileUrl(record, record.image) || "" : "";

  return {
    _id: record.id,
    nom: record.nom || record.name,
    description: record.description || record.description_ || "", // Essayer les deux variantes
    universe: record.universe || "Autre",
    image: imageUrl || "/images/logos/default.png",
    logo: logoUrl,
    horaires: record.horaires, // Simple string field
    heureOuverture: record.heureOuverture || "09:00",
    heureFermeture: record.heureFermeture || "18:00",
    openSunday: !!record.openSunday,
    statut: record.statut || "actif",
    telephone: record.telephone,
    // Essayer toutes les variantes possibles
    facebook: record.facebook,
    instagram: record.instagram || record.Instagram,
    tiktok: record.tiktok || record.TikTok || record.TIKTOK || record.tt || record.TT,
    email: record.email || record.mail, // Try both 'email' and 'mail' fields
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
      // Récupérer toutes les boutiques
      const result = await pb.collection("boutiques").getFullList();
      console.log(" RAW BOUTIQUES DATA:");
      console.log("Total boutiques:", result.length);
      
      // DEBUG: Voir chaque boutique et son statut
      result.forEach((boutique, index) => {
        console.log(` Boutique ${index + 1}:`, {
          id: boutique.id,
          nom: boutique.nom,
          statut: boutique.statut,
          statutType: typeof boutique.statut,
          statutValue: JSON.stringify(boutique.statut),
          description: boutique.description || boutique.description_ || "Aucune description"
        });
      });
      
      // DEBUG: Voir les valeurs uniques de statut
      const statutValues = result.map(b => b.statut);
      console.log(" TOUS LES STATUTS:", statutValues);
      console.log(" STATUTS UNIQUES:", [...new Set(statutValues)]);
      
      // Mapper les boutiques
      const mappedBoutiques = result.map(mapRecordToBoutique);
      console.log(" BOUTIQUES MAPPÉES:", mappedBoutiques.map(b => ({ nom: b.nom, statut: b.statut, description: b.description })));
      
      // DEBUG: Tester le filtrage
      const activeBoutiques = mappedBoutiques.filter(boutique => {
        const isNotInactive = boutique.statut !== "inactif";
        console.log(` ${boutique.nom}: statut="${boutique.statut}", !== "inactif" = ${isNotInactive}`);
        return isNotInactive;
      });
      
      console.log(` Boutiques visibles après filtrage: ${activeBoutiques.length}`);
      set({ boutiques: activeBoutiques, loading: false });
    } catch (error) {
      console.error("Error fetching boutiques:", error);
      set({ error: "Erreur lors de la recuperation des boutiques", loading: false });
    }
  },
}));
