import { create } from "zustand";
import { pb, getFileUrl } from "../services/pbClient";

interface Evenement {
  id: string;
  title: string; // Changé de 'nom' à 'title'
  description: string;
  date: string;
  image: string; // Changé de 'affiche' à 'image'
  lieu?: string; // Ajouté le lieu
  heure?: string; // Ajouté l'heure
  statut: "actif" | "inactif" | "planifié"; // Ajouté "planifié"
}

interface EvenementStore {
  evenements: Evenement[];
  loading: boolean;
  error: string | null;
  fetchEvenements: () => Promise<void>;
}

function mapRecordToEvenement(record: any): Evenement {
  const imageUrl = record.affiche ? getFileUrl(record, record.affiche) || "" : "";

  return {
    id: record.id,
    title: record.titre || record.nom || "", // Essayer 'titre' puis 'nom'
    description: record.description || "",
    date: record.date,
    image: imageUrl || "/images/logos/default.png",
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
      console.log("🔍 Récupération des événements...");
      
      // Récupérer tous les événements
      const result = await pb.collection('evenements').getFullList();
      console.log("📊 Données brutes des événements:", result);
      console.log("📊 Nombre total d'événements:", result.length);
      
      // Mapper les événements
      const mappedEvenements = result.map(mapRecordToEvenement);
      console.log("📋 Événements mappés:", mappedEvenements.map(e => ({ 
        id: e.id, 
        title: e.title, 
        statut: e.statut 
      })));
      
      // Filtrer les événements actifs et planifiés
      const activeEvenements = mappedEvenements.filter(evenement => 
        evenement.statut === "actif" || evenement.statut === "planifié"
      );
      
      console.log(`✅ Événements actifs/planifiés: ${activeEvenements.length}`);
      console.log("📋 Événements finaux:", activeEvenements);
      
      set({ evenements: activeEvenements, loading: false });
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des événements:', error);
      set({ error: 'Erreur lors de la recuperation des evenements', loading: false });
    }
  },
}));
