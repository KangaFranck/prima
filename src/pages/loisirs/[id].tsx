import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLoisirStore } from "../../store/loisirStore";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  CommerceDetailView,
  CommerceDetailData,
} from "../../components/CommerceDetailView";

function toDetailData(l: {
  id: string;
  name: string;
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
  website?: string;
  adresse?: string;
}): CommerceDetailData {
  return {
    name: l.name,
    image: l.image,
    image2: l.logoCarousel,
    logo: l.logo,
    description: l.description || undefined,
    adresse: l.adresse,
    telephone: l.telephone,
    email: l.email,
    website: l.website || l.siteWeb,
    horaires: l.horaires,
    heureOuverture: l.heureOuverture,
    heureFermeture: l.heureFermeture,
    openSunday: l.openSunday,
    statut: l.statut,
    facebook: l.facebook,
    instagram: l.instagram,
    tiktok: l.tiktok,
  };
}

export default function LoisirDetail() {
  const { id } = useParams<{ id: string }>();
  const { loisirs, fetchLoisirs, loading, error } = useLoisirStore();
  const loisir = loisirs.find((l) => l.id === id);

  useEffect(() => {
    fetchLoisirs();
  }, [fetchLoisirs]);

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
          to="/loisirs"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Retour aux loisirs
        </Link>
      </div>
    );
  }

  if (!loisir) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4">
        <p className="text-center text-slate-600">Loisirs non trouvés</p>
        <Link
          to="/loisirs"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Retour aux loisirs
        </Link>
      </div>
    );
  }

  const currentId = id ?? "";
  const otherLoisirs = loisirs
    .filter((l) => l.id !== currentId)
    .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'fr'))
    .slice(0, 5)
    .map((l) => ({ id: l.id, name: l.name, logo: l.logo }));

  return (
    <CommerceDetailView
      data={toDetailData(loisir)}
      listPath="/loisirs"
      listLabel="Loisirs"
      otherCommerces={otherLoisirs}
    />
  );
}
