import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
  Facebook,
  Instagram,
} from "lucide-react";
import { isCurrentlyOpen } from "../utils/timeUtils";
export interface CommerceDetailData {
  name: string;
  image: string;
  /** Deuxième image de couverture (optionnelle). Si présente, affichée à droite de la première en haut. */
  image2?: string;
  logo?: string;
  description?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  website?: string;
  horaires?: string;
  heureOuverture: string;
  heureFermeture: string;
  openSunday?: boolean;
  statut?: "actif" | "inactif";
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  universe?: string;
}
export interface OtherCommerce {
  id: string;
  name: string;
  logo?: string;
}
interface CommerceDetailViewProps {
  data: CommerceDetailData;
  listPath: string;
  listLabel: string;
  /** Autres commerces du même type (5 max), pour afficher les logos entre "Découvrez les autres" et "Retour à..." */
  otherCommerces?: OtherCommerce[];
}
const ACCENT = "#b8956e"; // tan / gold comme Africafé ITC
function StatusBadge({
  heureOuverture,
  heureFermeture,
  openSunday,
  statut,
}: {
  heureOuverture: string;
  heureFermeture: string;
  openSunday?: boolean;
  statut?: "actif" | "inactif";
}) {
  const open = isCurrentlyOpen({
    heureOuverture: heureOuverture || "",
    heureFermeture: heureFermeture || "",
    openSunday,
    statut,
  });
  return (
    <span
      className={`inline-flex items-center gap-2 border px-3 py-1.5 font-sofia text-sm font-medium rounded-none ${
        open
          ? "border-emerald-600 bg-emerald-50 text-emerald-800"
          : "border-red-300 bg-red-50 text-red-800"
      }`}
    >
      <span
        className={`h-2 w-2 shrink-0 ${
          open ? "bg-emerald-500" : "bg-red-500"
        }`}
      />
      {open ? "Ouvert" : "Fermé"}
    </span>
  );
}
export function CommerceDetailView({
  data,
  listPath,
  listLabel,
  otherCommerces = [],
}: CommerceDetailViewProps) {
  const {
    name,
    image,
    image2,
    logo,
    description,
    adresse,
    telephone,
    email,
    website,
    horaires,
    heureOuverture,
    heureFermeture,
    openSunday,
    statut,
    facebook,
    instagram,
    tiktok,
  } = data;
  const hasSocial = facebook || instagram || tiktok;
  const horairesText =
    horaires ||
    (heureOuverture && heureFermeture
      ? `Lundi au vendredi : ${heureOuverture} – ${heureFermeture}\nSamedi : ${heureOuverture} – ${heureFermeture}${openSunday ? `\nDimanche : ${heureOuverture} – ${heureFermeture}` : "\nDimanche : fermé"}`
      : null);
  const mapUrl = adresse
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adresse)}`
    : null;
  return (
    <div className="min-h-screen bg-white w-full max-w-full min-w-0 overflow-x-hidden">
      {/* Barre retour */}
      <div className="border-b border-neutral-100">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-3 md:px-8">
          <Link
            to={listPath}
            className="inline-flex items-center gap-2 font-sofia text-sm text-neutral-600 hover:text-neutral-900"
            aria-label={`Retour à ${listLabel}`}
          >
            <ArrowLeft className="h-5 w-5" />
            {listLabel}
          </Link>
        </div>
      </div>
      {/* Section images en haut : 2 côte à côte si image2 fournie, sinon 1 en pleine largeur */}
      {image ? (
        <div className={`w-full ${image2 ? 'grid grid-cols-1 md:grid-cols-2' : ''}`}>
          <div className="aspect-[4/3] md:aspect-auto md:min-h-[320px] w-full overflow-hidden bg-neutral-100">
            <img src={image} alt="" className="h-full w-full object-cover" />
          </div>
          {image2 ? (
            <div className="aspect-[4/3] md:aspect-auto md:min-h-[320px] w-full overflow-hidden bg-neutral-100">
              <img src={image2} alt="" className="h-full w-full object-cover" />
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="mx-auto max-w-5xl w-full min-w-0 px-4 pt-12 pb-10 md:px-8 md:pt-16 md:pb-14">
        {/* Bloc principal : Logo à gauche, Titre + description à droite (style Africafé) */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12 xl:gap-16">
          {/* Logo : bloc carré invisible (transparent) pour s’accorder au design */}
          <div className="shrink-0 flex flex-col items-start gap-4 lg:w-40 xl:w-48">
            {logo ? (
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-none bg-neutral-50 p-2 md:h-28 md:w-28">
                <img src={logo} alt="" className="max-h-full max-w-full object-contain" />
              </div>
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-none font-ogg text-2xl font-semibold text-neutral-300 bg-neutral-50 md:h-28 md:w-28">
                {name.charAt(0)}
              </div>
            )}
          </div>

          <div className="mt-8 lg:mt-0 min-w-0 flex-1 max-w-2xl">
            <h1 className="font-ogg text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl uppercase">
              {name}
            </h1>
            {description ? (
              <div className="mt-4">
                <h2 className="font-sofia font-bold text-xs uppercase tracking-widest text-neutral-900 mb-1.5">
                  Description
                </h2>
                <p className="font-sofia text-base leading-relaxed text-neutral-700 whitespace-pre-line md:text-lg">
                  {description}
                </p>
              </div>
            ) : null}
            <div className="mt-6 space-y-4">
              {adresse ? (
                <div>
                  <h2 className="font-sofia font-bold text-xs uppercase tracking-widest text-neutral-900 mb-1.5">
                    Adresse
                  </h2>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-neutral-600" />
                    <div>
                      <p className="font-sofia text-neutral-700 text-sm md:text-base">
                        {adresse}
                      </p>
                    {mapUrl ? (
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block font-sofia text-sm text-neutral-600 hover:underline"
                      >
                        Voir la carte
                      </a>
                    ) : null}
                  </div>
                </div>
                </div>
              ) : null}
              {telephone ? (
                <div>
                  <h2 className="font-sofia font-bold text-xs uppercase tracking-widest text-neutral-900 mb-1.5">
                    Téléphone
                  </h2>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 shrink-0 text-neutral-600" />
                    <a
                    href={`tel:${telephone.replace(/\s/g, "")}`}
                    className="font-sofia text-neutral-700 text-sm md:text-base hover:underline"
                  >
                    {telephone}
                  </a>
                </div>
                </div>
              ) : null}
              {horairesText ? (
                <div>
                  <h2 className="font-sofia font-bold text-xs uppercase tracking-widest text-neutral-900 mb-1.5">
                    Horaires
                  </h2>
                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 mt-0.5 shrink-0 text-neutral-600" />
                    <p className="font-sofia text-neutral-700 text-sm md:text-base whitespace-pre-line">
                      {horairesText}
                    </p>
                  </div>
                </div>
              ) : null}
              {email ? (
                <div>
                  <h2 className="font-sofia font-bold text-xs uppercase tracking-widest text-neutral-900 mb-1.5">
                    Email
                  </h2>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 shrink-0 text-neutral-600" />
                    <a
                      href={`mailto:${email}`}
                      className="font-sofia text-neutral-700 text-sm md:text-base hover:underline"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="mt-6">
              <StatusBadge
                heureOuverture={heureOuverture}
                heureFermeture={heureFermeture}
                openSunday={openSunday}
                statut={statut}
              />
            </div>
          </div>

          {(hasSocial || website) ? (
            <div className="mt-8 lg:mt-0 shrink-0 flex flex-row items-center justify-center lg:justify-end gap-3">
{website && (
                <a
                  href={website.startsWith("http") ? website : `https://${website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:opacity-80"
                  aria-label="Site web"
                >
                  <Globe className="h-5 w-5" />
                </a>
              )}
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:opacity-80"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:opacity-80"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {tiktok && (
                <a
                  href={tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:opacity-80"
                  aria-label="TikTok"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
              )}
            </div>
          ) : null}
        </div>
        {/* Séparateur + Découvrez les autres établissements (style ITC) */}
        <div className="mt-16 border-t pt-12" style={{ borderColor: ACCENT }}>
          <h2 className="font-ogg text-center text-xl font-bold uppercase tracking-wide text-neutral-900 md:text-2xl">
            Découvrez les autres établissements
          </h2>
          <div
            className="mx-auto mt-4 h-0.5 w-16"
            style={{ backgroundColor: ACCENT }}
          />
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link
              to={listPath}
              className="font-sofia font-medium hover:underline"
              style={{ color: ACCENT }}
            >
              {listLabel}
            </Link>
          </div>
          {/* Logos des autres commerces du même type (5 max) */}
          <div className="mt-8 min-h-[5rem] flex flex-wrap justify-center items-center gap-6">
            {otherCommerces.length > 0 ? (
              otherCommerces.slice(0, 5).map((other) => (
                <Link
                  key={other.id}
                  to={`${listPath}/${other.id}`}
                  className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-none bg-neutral-100 transition hover:opacity-90 md:h-20 md:w-20"
                  title={other.name}
                >
                  {other.logo ? (
                    <img
                      src={other.logo}
                      alt={other.name}
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <span className="font-ogg text-xl font-semibold text-neutral-400">
                      {other.name.charAt(0)}
                    </span>
                  )}
                </Link>
              ))
            ) : (
              <p className="font-sofia text-sm text-neutral-500">
                Aucun autre établissement dans cette catégorie pour le moment.
              </p>
            )}
          </div>
        </div>
        <div className="mt-12 text-center">
          <Link
            to={listPath}
            className="inline-flex items-center gap-2 font-sofia text-sm text-neutral-500 hover:text-neutral-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à {listLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
