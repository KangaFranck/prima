import { create } from 'zustand';
import { pb, getFileUrl } from '../services/pbClient';

interface Shop {
  id: string;
  name: string;
  logo: string;
  categories: string[];
  slug: string;
  description?: string;
  statut?: 'actif' | 'inactif';
  heureOuverture?: string;
  heureFermeture?: string;
  openSunday?: boolean;
}

interface ShopStore {
  shops: Shop[];
  loading: boolean;
  error: string | null;
  fetchShops: () => Promise<void>;
}

function mapRecordToShop(record: any): Shop {
  const logoUrl = record.logo ? getFileUrl(record, record.logo) || '' : '';

  return {
    id: record.id,
    name: record.name || record.nom,
    logo: logoUrl || '/images/logos/default.png',
    categories: record.universe ? [record.universe] : ['Autre'],
    slug: (record.name || record.nom)?.toLowerCase().replace(/\s+/g, '-') || record.id,
    description: record.description,
    statut: record.statut,
    heureOuverture: record.heureOuverture,
    heureFermeture: record.heureFermeture,
    openSunday: !!record.openSunday,
  };
}

export const useShopStore = create<ShopStore>((set, get) => ({
  shops: [],
  loading: false,
  error: null,

  fetchShops: async () => {
    const state = get();
    if (state.loading) return; // Éviter les appels multiples
    
    set({ loading: true, error: null });
    try {
      const result = await pb.collection('boutiques').getFullList();
      const shops = result.map(mapRecordToShop);
      set({ shops, loading: false });
    } catch (error) {
      console.error('Error fetching shops:', error);
      set({ error: 'Erreur lors de la recuperation des boutiques', loading: false });
    }
  },
}));
