import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useBoutiqueStore } from "../../store/boutiqueStore";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  CommerceDetailView,
  CommerceDetailData,
} from "../../components/CommerceDetailView";

function toDetailData(b: {
  _id: string;
  nom: string;
  description: string;
  image: string;
  logo?: string;
  logoCarousel?: string;
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
  adresse?: string;
}): CommerceDetailData {
  return {
    name: b.nom,
    image: b.image,
    image2: b.logoCarousel,
    logo: b.logo,
    description: b.description || undefined,
    adresse: b.adresse,
    telephone: b.telephone,
    email: b.email,
    website: b.siteWeb,
    horaires: b.horaires,
    heureOuverture: b.heureOuverture,
    heureFermeture: b.heureFermeture,
    openSunday: b.openSunday,
    statut: b.statut,
    facebook: b.facebook,
    instagram: b.instagram,
    tiktok: b.tiktok,
  };
}

export default function BoutiqueDetail() {
  const { id } = useParams<{ id: string }>();
  const { boutiques, fetchBoutiques, loading, error } = useBoutiqueStore();
  const boutique = boutiques.find((b) => b._id === id);

  useEffect(() => {
    fetchBoutiques();
  }, [fetchBoutiques]);

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
          to="/boutiques"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Retour aux boutiques
        </Link>
      </div>
    );
  }

  if (!boutique) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4">
        <p className="text-center text-slate-600">Boutique non trouvée</p>
        <Link
          to="/boutiques"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Retour aux boutiques
        </Link>
      </div>
    );
  }

  const currentId = id ?? "";
  const otherBoutiques = boutiques
    .filter((b) => b._id !== currentId)
    .sort((a, b) => (a.nom || '').localeCompare(b.nom || '', 'fr'))
    .slice(0, 5)
    .map((b) => ({ id: b._id, name: b.nom, logo: b.logo }));

  return (
    <CommerceDetailView
      data={toDetailData(boutique)}
      listPath="/boutiques"
      listLabel="Boutiques"
      otherCommerces={otherBoutiques}
    />
  );
}
