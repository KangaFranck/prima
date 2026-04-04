import { create } from 'zustand';
import { getFileUrl } from '../utils/mediaUrl';
import { apiClient } from '../services/apiClient';

interface Shop {
  id: string;
  name: string;
  logo: string;
  logoCarousel?: string;
  website?: string;
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

function imgUrl(record: any, field: string): string {
  const v = record[field];
  if (typeof v === 'string' && v.startsWith('http')) return v;
  return (record[field] ? getFileUrl(record, record[field]) : '') || '';
}

function mapRecordToShop(record: any): Shop {
  const logoUrl = imgUrl(record, 'logo');
  const logoCarouselUrl = imgUrl(record, 'logoCarousel');

  return {
    id: record.id,
    name: record.name || record.nom,
    logo: logoUrl || '/images/logos/default.png',
    logoCarousel: logoCarouselUrl || undefined,
    website: record.website || undefined,
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
    if (state.loading) return;
    set({ loading: true, error: null });
    try {
      const result = await apiClient.boutiques.list();
      const shops = result.map((r: any) => mapRecordToShop(r)).filter((s: Shop) => s.statut !== 'inactif');
      set({ shops, loading: false });
    } catch (error) {
      console.error('Error fetching shops:', error);
      set({ error: 'Erreur lors de la recuperation des boutiques', loading: false });
    }
  },
}));
