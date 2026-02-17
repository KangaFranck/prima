import { create } from "zustand";
import { pb, getFileUrl } from "../services/pbClient";

interface Restaurant {
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

interface RestaurantStore {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  fetchRestaurants: () => Promise<void>;
}

function mapRecordToRestaurant(record: any): Restaurant {
  const logoUrl = record.logo ? getFileUrl(record, record.logo) || "" : "";
  const imageUrl = record.image ? getFileUrl(record, record.image) || "" : "";

  return {
    id: record.id,
    //  CORRECTION: Utiliser le bon champ pour le nom
    name: record.nom || record.name || "Restaurant sans nom",
    description: record.description || "",
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

export const useRestaurantStore = create<RestaurantStore>((set, get) => ({
  restaurants: [],
  loading: false,
  error: null,

  fetchRestaurants: async () => {
    const state = get();
    if (state.loading) return;
    
    set({ loading: true, error: null });
    try {
      // Récupérer tous les restaurants
      const result = await pb.collection("restaurants").getFullList();
      console.log(" Raw restaurants data:", result);
      
      //  CORRECTION: Filtrer pour masquer les restaurants "inactif"
      const restaurants = result
        .map(mapRecordToRestaurant)
        .filter(restaurant => restaurant.statut !== "inactif"); // Masquer les "inactif"
      
      console.log(` Restaurants visibles récupérés: ${restaurants.length}`);
      set({ restaurants, loading: false });
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      set({ error: "Erreur lors de la recuperation des restaurants", loading: false });
    }
  },
}));
