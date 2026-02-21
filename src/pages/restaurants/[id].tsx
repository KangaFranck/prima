import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useRestaurantStore } from "../../store/restaurantStore";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  CommerceDetailView,
  CommerceDetailData,
} from "../../components/CommerceDetailView";

function toDetailData(r: {
  id: string;
  name: string;
  description: string;
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
  adresse?: string;
}): CommerceDetailData {
  return {
    name: r.name,
    image: r.image,
    logo: r.logo,
    description: r.description || undefined,
    adresse: r.adresse,
    telephone: r.telephone,
    email: r.email,
    website: r.website || r.siteWeb,
    horaires: r.horaires,
    heureOuverture: r.heureOuverture,
    heureFermeture: r.heureFermeture,
    openSunday: r.openSunday,
    statut: r.statut,
    facebook: r.facebook,
    instagram: r.instagram,
    tiktok: r.tiktok,
  };
}

export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const { restaurants, fetchRestaurants, loading, error } = useRestaurantStore();
  const restaurant = restaurants.find((r) => r.id === id);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

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
          to="/restaurants"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Retour aux restaurants
        </Link>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4">
        <p className="text-center text-slate-600">Restaurant non trouvé</p>
        <Link
          to="/restaurants"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Retour aux restaurants
        </Link>
      </div>
    );
  }

  const currentId = id ?? "";
  const otherRestaurants = restaurants
    .filter((r) => r.id !== currentId)
    .slice(0, 5)
    .map((r) => ({ id: r.id, name: r.name, logo: r.logo }));

  return (
    <CommerceDetailView
      data={toDetailData(restaurant)}
      listPath="/restaurants"
      listLabel="Restaurants"
      otherCommerces={otherRestaurants}
    />
  );
}
