import { create } from "zustand";
import { getFileUrl } from "../utils/mediaUrl";
import { apiClient } from "../services/apiClient";

interface Restaurant {
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

interface RestaurantStore {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  fetchRestaurants: () => Promise<void>;
}

function imgUrl(record: any, field: string): string {
  const v = record[field];
  if (typeof v === 'string' && v.startsWith('http')) return v;
  return (record[field] ? getFileUrl(record, record[field]) : '') || '';
}

function mapRecordToRestaurant(record: any): Restaurant {
  const logoUrl = imgUrl(record, 'logo');
  const imageUrl = imgUrl(record, 'image');
  const logoCarouselUrl = imgUrl(record, 'logoCarousel');

  return {
    id: record.id,
    name: record.nom || record.name || "Restaurant sans nom",
    description: record.description || "",
    universe: record.universe || "Autre",
    image: imageUrl || "/images/logos/default.png",
    logo: logoUrl,
    logoCarousel: logoCarouselUrl || undefined,
    website: record.website || record.siteWeb,
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
    siteWeb: record.siteWeb || record.website,
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
      const result = await apiClient.restaurants.list();
      const restaurants = result.map((r: any) => mapRecordToRestaurant(r)).filter((r: Restaurant) => r.statut !== 'inactif');
      set({ restaurants, loading: false });
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      set({ error: "Erreur lors de la recuperation des restaurants", loading: false });
    }
  },
}));
