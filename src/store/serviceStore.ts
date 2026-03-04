import { create } from "zustand";
import { getFileUrl } from "../services/pbClient";
import { apiClient, useApi } from "../services/apiClient";

interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  logo?: string;
  horaires?: string;
  statut: "actif" | "inactif";
  telephone?: string;
  instagram?: string;
  facebook?: string;
  email?: string;
  siteWeb?: string;
  website?: string;
  adresse?: string;
  ouvertLeDimanche?: boolean;
}

interface ServiceStore {
  services: Service[];
  loading: boolean;
  error: string | null;
  fetchServices: () => Promise<void>;
}

function imgUrl(record: any, field: string): string {
  const v = record[field];
  if (typeof v === 'string' && v.startsWith('http')) return v;
  return (record[field] ? getFileUrl(record, record[field]) : '') || '';
}

function mapRecordToService(record: any): Service {
  const logoUrl = imgUrl(record, 'logo');
  const images = Array.isArray(record.images) ? record.images : [];
  const firstImage = images[0];
  const imageUrl = typeof firstImage === 'string' && firstImage.startsWith('http')
    ? firstImage
    : (logoUrl || (firstImage ? getFileUrl(record, firstImage) : '') || '/images/logos/default.png');

  return {
    id: record.id,
    name: record.nom || record.name || "Service sans nom",
    description: record.description || "",
    image: imageUrl,
    logo: logoUrl || undefined,
    statut: record.statut || "actif",
    ouvertLeDimanche: !!record.ouvertLeDimanche,
    telephone: record.telephone,
    email: record.email || record.mail,
    siteWeb: record.siteWeb || record.website,
    website: record.website || record.siteWeb,
    adresse: record.adresse,
    horaires: record.horaires,
    facebook: record.reseauxSociaux?.facebook ?? record.facebook,
    instagram: record.reseauxSociaux?.instagram ?? record.instagram,
  };
}

export const useServiceStore = create<ServiceStore>((set, get) => ({
  services: [],
  loading: false,
  error: null,

  fetchServices: async () => {
    const state = get();
    if (state.loading) return;
    set({ loading: true, error: null });
    try {
      if (useApi()) {
        const result = await apiClient.services.list();
        const services = result.map((r: any) => mapRecordToService(r)).filter((s: Service) => s.statut !== 'inactif');
        set({ services, loading: false });
        return;
      }
      const result = await (await import('../services/pbClient')).pb.collection("services").getFullList();
      const services = result
        .map(mapRecordToService)
        .filter((s: Service) => s.statut === "actif");
      set({ services, loading: false });
    } catch (error) {
      console.error("Error fetching services:", error);
      set({ error: "Erreur lors de la récupération des services", loading: false });
    }
  },
}));
