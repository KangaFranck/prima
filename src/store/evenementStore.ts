import { create } from "zustand";
import { pb, getFileUrl } from "../services/pbClient";
import { apiClient, useApi } from "../services/apiClient";

interface Evenement {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  /** 1 à 3 images supplémentaires (galerie), optionnel */
  images?: string[];
  lieu?: string;
  heure?: string;
  statut: "actif" | "inactif" | "planifié";
}

interface EvenementStore {
  evenements: Evenement[];
  loading: boolean;
  error: string | null;
  fetchEvenements: () => Promise<void>;
}

function eventImageUrl(record: any): string {
  const v = record.image ?? record.affiche;
  if (typeof v === 'string' && v.startsWith('http')) return v;
  return (record.affiche ? getFileUrl(record, record.affiche) : '') || '';
}

function mapRecordToEvenement(record: any): Evenement {
  const imageUrl = eventImageUrl(record);
  const images = Array.isArray(record.images) ? record.images.slice(0, 3).filter((u: unknown) => typeof u === 'string' && u.length > 0) : [];

  return {
    id: record.id,
    title: record.titre || record.title || record.nom || "",
    description: record.description || "",
    date: record.date,
    image: imageUrl || "/images/logos/default.png",
    images: images.length > 0 ? images : undefined,
    lieu: record.lieu,
    heure: record.heure,
    statut: record.statut || "actif",
  };
}

export const useEvenementStore = create<EvenementStore>((set, get) => ({
  evenements: [],
  loading: false,
  error: null,

  fetchEvenements: async () => {
    const state = get();
    if (state.loading) return;
    set({ loading: true, error: null });
    try {
      if (useApi()) {
        const result = await apiClient.evenements.list();
        const activeEvenements = result
          .map((r: any) => mapRecordToEvenement(r))
          .filter((e: Evenement) => e.statut === "actif" || e.statut === "planifié");
        set({ evenements: activeEvenements, loading: false });
        return;
      }
      const result = await pb.collection('evenements').getFullList();
      const mappedEvenements = result.map(mapRecordToEvenement);
      const activeEvenements = mappedEvenements.filter(e => e.statut === "actif" || e.statut === "planifié");
      set({ evenements: activeEvenements, loading: false });
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des événements:', error);
      set({ error: 'Erreur lors de la recuperation des evenements', loading: false });
    }
  },
}));
