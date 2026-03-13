import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useServiceStore } from "../../store/serviceStore";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  CommerceDetailView,
  CommerceDetailData,
} from "../../components/CommerceDetailView";

function toDetailData(s: {
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
  website?: string;
  siteWeb?: string;
  adresse?: string;
  ouvertLeDimanche?: boolean;
}): CommerceDetailData {
  return {
    name: s.name,
    image: s.image,
    image2: undefined,
    logo: s.logo,
    description: s.description || undefined,
    adresse: s.adresse,
    telephone: s.telephone,
    email: s.email,
    website: s.website || s.siteWeb,
    horaires: s.horaires,
    heureOuverture: "",
    heureFermeture: "",
    openSunday: s.ouvertLeDimanche,
    statut: s.statut,
    facebook: s.facebook,
    instagram: s.instagram,
  };
}

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const { services, fetchServices, loading, error } = useServiceStore();
  const service = services.find((s) => s.id === id);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4">
        <p className="text-center text-red-600">{error}</p>
        <Link
          to="/services"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Retour aux services
        </Link>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4">
        <p className="text-center text-slate-600">Service non trouvé</p>
        <Link
          to="/services"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Retour aux services
        </Link>
      </div>
    );
  }

  const currentId = id ?? "";
  const otherServices = services
    .filter((s) => s.id !== currentId)
    .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'fr'))
    .slice(0, 5)
    .map((s) => ({ id: s.id, name: s.name, logo: s.logo }));

  return (
    <CommerceDetailView
      data={toDetailData(service)}
      listPath="/services"
      listLabel="Services"
      otherCommerces={otherServices}
    />
  );
}
