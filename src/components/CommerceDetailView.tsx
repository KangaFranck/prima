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
    <div className="min-h-screen bg-white">
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

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
        {/* Bloc principal : Logo à gauche, Titre + description à droite (style Africafé) */}
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-14">
          {/* Logo : bloc carré invisible (transparent) pour s’accorder au design */}
          <div className="shrink-0 md:sticky md:top-24">
            {logo ? (
              <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-none p-4 md:h-52 md:w-52 bg-transparent">
                <img
                  src={logo}
                  alt=""
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-none font-ogg text-4xl font-semibold text-neutral-400 md:h-52 md:w-52 bg-transparent">
                {name.charAt(0)}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="font-ogg text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
              {name}
            </h1>
            {description ? (
              <div className="mt-6 space-y-4">
                <p className="font-sofia text-lg leading-relaxed text-neutral-700 whitespace-pre-line md:text-xl">
                  {description}
                </p>
                <StatusBadge
                  heureOuverture={heureOuverture}
                  heureFermeture={heureFermeture}
                  openSunday={openSunday}
                  statut={statut}
                />
              </div>
            ) : (
              <div className="mt-4">
                <StatusBadge
                  heureOuverture={heureOuverture}
                  heureFermeture={heureFermeture}
                  openSunday={openSunday}
                  statut={statut}
                />
              </div>
            )}
          </div>
        </div>

        {/* Galerie : 1 image (même image répétée pour l’effet visuel type ITC) */}
        {/* Deux colonnes : Infos (gauche) + CTA carte ; puis “Découvrez les autres” */}
        <div className="mt-14 grid gap-8 md:grid-cols-[1fr,minmax(0,340px)] lg:grid-cols-[1fr,minmax(0,380px)] items-start">
          {/* Colonne gauche : image du commerce */}
          <div className="w-full self-stretch min-h-[360px] md:min-h-[420px] order-2 md:order-1">
            {image ? (
              <div className="sticky top-24 h-full min-h-[360px] md:min-h-[420px] w-full overflow-hidden bg-neutral-100">
                <img
                  src={image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
          </div>
          {/* Colonne droite : HORAIRES, TÉLÉPHONE, RÉSEAUX SOCIAUX, VOIR LA CARTE */}
          <div className="space-y-8 order-1 md:order-2">
            {horairesText ? (
              <section>
                <h2 className="font-ogg text-xs font-bold uppercase tracking-[0.2em] text-neutral-900">
                  Horaires
                </h2>
                <p className="mt-2 font-sofia text-base leading-relaxed text-neutral-700 whitespace-pre-line">
                  {horairesText}
                </p>
              </section>
            ) : null}

            {telephone ? (
              <section>
                <h2 className="font-ogg text-xs font-bold uppercase tracking-[0.2em] text-neutral-900">
                  Téléphone
                </h2>
                <a
                  href={`tel:${telephone.replace(/\s/g, "")}`}
                  className="mt-2 block font-sofia text-base text-neutral-700 hover:underline"
                >
                  {telephone}
                </a>
              </section>
            ) : null}

            {email ? (
              <section>
                <h2 className="font-ogg text-xs font-bold uppercase tracking-[0.2em] text-neutral-900">
                  Email
                </h2>
                <a
                  href={`mailto:${email}`}
                  className="mt-2 block font-sofia text-base text-neutral-700 hover:underline"
                >
                  {email}
                </a>
              </section>
            ) : null}

            {(hasSocial || website) ? (
              <section>
                <h2 className="font-ogg text-xs font-bold uppercase tracking-[0.2em] text-neutral-900">
                  Réseaux sociaux
                </h2>
                <div className="mt-3 flex flex-wrap gap-3">
                  {website && (
                    <a
                      href={
                        website.startsWith("http") ? website : `https://${website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:opacity-90"
                      style={{ backgroundColor: ACCENT }}
                      aria-label="Visiter le site web"
                    >
                      <Globe className="h-5 w-5" />
                    </a>
                  )}
                  {facebook && (
                    <a
                      href={facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:opacity-90"
                      style={{ backgroundColor: ACCENT }}
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
                      className="flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:opacity-90"
                      style={{ backgroundColor: ACCENT }}
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
                      className="flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:opacity-90"
                      style={{ backgroundColor: ACCENT }}
                      aria-label="TikTok"
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden
                      >
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                      </svg>
                    </a>
                  )}
                </div>
              </section>
            ) : null}

            {adresse ? (
              <section>
                <h2 className="font-ogg text-xs font-bold uppercase tracking-[0.2em] text-neutral-900">
                  Adresse
                </h2>
                <p className="mt-2 font-sofia text-base text-neutral-700">
                  {adresse}
                </p>
                {mapUrl ? (
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 px-5 py-3 font-sofia text-sm font-medium uppercase tracking-wider text-white transition hover:opacity-90"
                    style={{ backgroundColor: ACCENT }}
                  >
                    <MapPin className="h-4 w-4" />
                    Voir la carte
                  </a>
                ) : null}
              </section>
            ) : mapUrl ? (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 font-sofia text-sm font-medium uppercase tracking-wider text-white transition hover:opacity-90"
                style={{ backgroundColor: ACCENT }}
              >
                <MapPin className="h-4 w-4" />
                Voir la carte
              </a>
            ) : null}
          </div>
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
