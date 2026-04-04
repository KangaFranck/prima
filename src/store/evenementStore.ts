import { create } from "zustand";
import { getFileUrl } from "../utils/mediaUrl";
import { apiClient } from "../services/apiClient";

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
  /** Date de fin (optionnel) */
  dateFin?: string;
  /** Heure de fin (optionnel) */
  heureFin?: string;
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

function getRecordImages(record: any): string[] {
  const raw = record?.images ?? record?.Images;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.slice(0, 3).filter((u: unknown) => typeof u === 'string' && u.length > 0);
  if (typeof raw === 'string') {
    try {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.slice(0, 3).filter((u: unknown) => typeof u === 'string' && u.length > 0) : [];
    } catch { return []; }
  }
  return [];
}

function mapRecordToEvenement(record: any): Evenement {
  const imageUrl = eventImageUrl(record);
  const images = getRecordImages(record);

  return {
    id: record.id,
    title: record.titre || record.title || record.nom || "",
    description: record.description || "",
    date: record.date,
    image: imageUrl || "/images/logos/default.png",
    images: images.length > 0 ? images : undefined,
    lieu: record.lieu,
    heure: record.heure,
    dateFin: record.dateFin,
    heureFin: record.heureFin,
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
      const result = await apiClient.evenements.list();
      const activeEvenements = result
        .map((r: any) => mapRecordToEvenement(r))
        .filter((e: Evenement) => e.statut === "actif" || e.statut === "planifié");
      set({ evenements: activeEvenements, loading: false });
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des événements:', error);
      set({ error: 'Erreur lors de la recuperation des evenements', loading: false });
    }
  },
}));
