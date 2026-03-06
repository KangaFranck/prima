import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface EntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void | Promise<void>;
  title: string;
  entityData?: any;
  entityType: 'loisirs' | 'boutiques' | 'restaurants' | 'services' | 'evenements';
}

export const EntityModal: React.FC<EntityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  entityData,
  entityType
}) => {
  const [formData, setFormData] = useState({
    // Champs communs pour commerces
    nom: '',
    description: '',
    horaires: '',
    heureOuverture: '',
    heureFermeture: '',
    openSunday: false,
    statut: 'actif',
    universe: 'Général',
    telephone: '',
    email: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    website: '',
    logo: null as File | null,
    image: null as File | null,
    image2: null as File | null,
    // Champs spécifiques aux événements
    titre: '',
    date: '',
    heure: '',
    dateFin: '',
    heureFin: '',
    lieu: '',
    affiche: null as File | null,
    galerie1: null as File | null,
    galerie2: null as File | null,
    galerie3: null as File | null
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [image2Preview, setImage2Preview] = useState<string | null>(null);
  const [affichePreview, setAffichePreview] = useState<string | null>(null);
  const [galerie1Preview, setGalerie1Preview] = useState<string | null>(null);
  const [galerie2Preview, setGalerie2Preview] = useState<string | null>(null);
  const [galerie3Preview, setGalerie3Preview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (entityData) {
      if (entityType === 'evenements') {
        const dateDebutRaw = entityData.date ? String(entityData.date).slice(0, 10) : '';
        const heureDebut = entityData.heure ? String(entityData.heure).trim().slice(0, 5) : '';
        const dateTimeDebut = dateDebutRaw ? (heureDebut ? `${dateDebutRaw}T${heureDebut}` : dateDebutRaw) : '';
        const dateFinRaw = entityData.dateFin ? String(entityData.dateFin).slice(0, 10) : '';
        setFormData({
          titre: entityData.titre || entityData.title || '',
          description: entityData.description || '',
          date: dateTimeDebut,
          heure: heureDebut,
          dateFin: dateFinRaw,
          heureFin: entityData.heureFin ? String(entityData.heureFin).trim().slice(0, 5) : '',
          lieu: entityData.lieu || '',
          statut: entityData.statut || 'planifié',
          affiche: null,
          // Champs non utilisés pour événements
          nom: '',
          horaires: '',
          heureOuverture: '',
          heureFermeture: '',
          openSunday: false,
          universe: 'Général',
          telephone: '',
          email: '',
          instagram: '',
          facebook: '',
          tiktok: '',
          logo: null,
          image: null
        });

        if (entityData.affiche) {
          setAffichePreview(entityData.affiche);
        }
        const images = Array.isArray(entityData.images) ? entityData.images : [];
        setGalerie1Preview(images[0] && typeof images[0] === 'string' ? images[0] : null);
        setGalerie2Preview(images[1] && typeof images[1] === 'string' ? images[1] : null);
        setGalerie3Preview(images[2] && typeof images[2] === 'string' ? images[2] : null);
      } else {
        // Commerces : préremplir avec les données en base (heures en ISO, "YYYY-MM-DD HH:MM:SS" ou "HH:MM")
        const toTime = (v: unknown): string => {
          if (v == null) return '';
          if (typeof v === 'string') {
            const s = v.trim();
            const mT = s.match(/T(\d{1,2}):(\d{2})/);
            if (mT) return `${mT[1].padStart(2, '0')}:${mT[2]}`;
            const mSpace = s.match(/\s(\d{1,2}):(\d{2})/);
            if (mSpace) return `${mSpace[1].padStart(2, '0')}:${mSpace[2]}`;
            if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(s)) return s.slice(0, 5);
            return '';
          }
          if (v instanceof Date && !isNaN(v.getTime())) {
            const h = v.getHours();
            const m = v.getMinutes();
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
          }
          return '';
        };

        const nextForm = {
          nom: entityData.nom ?? '',
          description: entityData.description ?? '',
          horaires: entityData.horaires ?? '',
          heureOuverture: toTime(entityData.heureOuverture) || '',
          heureFermeture: toTime(entityData.heureFermeture) || '',
          openSunday: !!entityData.openSunday,
          statut: (entityData.statut === 'inactif' ? 'inactif' : 'actif') as 'actif' | 'inactif',
          universe: entityData.universe ?? 'Général',
          telephone: String(entityData?.telephone ?? '').trim(),
          email: String(entityData?.email ?? '').trim(),
          instagram: String(entityData?.instagram ?? '').trim(),
          facebook: String(entityData?.facebook ?? '').trim(),
          tiktok: String(entityData?.tiktok ?? '').trim(),
          website: String(entityData?.website ?? '').trim(),
          logo: null,
          image: null,
          image2: null,
          titre: '',
          date: '',
          lieu: '',
          affiche: null
        };
        if (import.meta.env.DEV) console.log('EntityModal prefill commerces:', { email: nextForm.email, website: nextForm.website, instagram: nextForm.instagram, tiktok: nextForm.tiktok });
        setFormData(nextForm);

        setLogoPreview(entityData.logo && typeof entityData.logo === 'string' ? entityData.logo : null);
        setImagePreview(entityData.image && typeof entityData.image === 'string' ? entityData.image : null);
        setImage2Preview(entityData.logoCarousel && typeof entityData.logoCarousel === 'string' ? entityData.logoCarousel : null);
      }
    } else {
      // Reset form for new entity
      setFormData({
        nom: '',
        description: '',
        horaires: '',
        heureOuverture: '',
        heureFermeture: '',
        openSunday: false,
        statut: entityType === 'evenements' ? 'planifié' : 'actif',
        universe: 'Général',
        telephone: '',
        email: '',
        instagram: '',
        facebook: '',
        tiktok: '',
        website: '',
        logo: null,
        image: null,
        image2: null,
        titre: '',
        date: '',
        heure: '',
        dateFin: '',
        heureFin: '',
        lieu: '',
        affiche: null,
        galerie1: null,
        galerie2: null,
        galerie3: null
      });
      setLogoPreview(null);
      setImagePreview(null);
      setImage2Preview(null);
      setAffichePreview(null);
      setGalerie1Preview(null);
      setGalerie2Preview(null);
      setGalerie3Preview(null);
    }
  }, [entityData, isOpen, entityType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'image' | 'image2' | 'affiche' | 'galerie1' | 'galerie2' | 'galerie3') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
      const previewUrl = URL.createObjectURL(file);
      if (field === 'logo') setLogoPreview(previewUrl);
      else if (field === 'image') setImagePreview(previewUrl);
      else if (field === 'image2') setImage2Preview(previewUrl);
      else if (field === 'affiche') setAffichePreview(previewUrl);
      else if (field === 'galerie1') setGalerie1Preview(previewUrl);
      else if (field === 'galerie2') setGalerie2Preview(previewUrl);
      else if (field === 'galerie3') setGalerie3Preview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const formEl = e.currentTarget;

    const formDataObj = new FormData();

    if (entityType === 'evenements') {
      // Champs spécifiques aux événements - SEULEMENT CEUX QUI EXISTENT DANS LA DB
      formDataObj.append('titre', formData.titre);
      formDataObj.append('description', formData.description);
      const dateDebutVal = (formEl.querySelector('[name="date"]') as HTMLInputElement)?.value ?? formData.date ?? '';
      formDataObj.append('date', dateDebutVal);
      if (dateDebutVal && dateDebutVal.includes('T')) formDataObj.append('heure', dateDebutVal.slice(11, 16));
      formDataObj.append('dateFin', formData.dateFin || '');
      formDataObj.append('heureFin', formData.heureFin || '');
      formDataObj.append('lieu', formData.lieu);
      formDataObj.append('statut', formData.statut);
      if (formData.affiche) formDataObj.append('affiche', formData.affiche);
    } else {
      // Heures : priorité au DOM (source de vérité), fallback sur l'état React si le DOM est vide
      const domHeureOuv = (formEl.querySelector('[name="heureOuverture"]') as HTMLInputElement)?.value?.trim() ?? '';
      const domHeureFerm = (formEl.querySelector('[name="heureFermeture"]') as HTMLInputElement)?.value?.trim() ?? '';
      const heureOuv = domHeureOuv || (formData.heureOuverture ?? '').trim() || '';
      const heureFerm = domHeureFerm || (formData.heureFermeture ?? '').trim() || '';
      if (import.meta.env.DEV) console.log('EntityModal submit – heures:', { dom: { domHeureOuv, domHeureFerm }, final: { heureOuv, heureFerm } });
      formDataObj.append('nom', formData.nom);
      formDataObj.append('description', formData.description);
      formDataObj.append('horaires', formData.horaires);
      formDataObj.append('heureOuverture', heureOuv);
      formDataObj.append('heureFermeture', heureFerm);
      formDataObj.append('openSunday', formData.openSunday.toString());
      formDataObj.append('statut', formData.statut);
      formDataObj.append('universe', (formData.universe || 'Général').trim());
      if (formData.telephone) formDataObj.append('telephone', formData.telephone);
      if (formData.email) formDataObj.append('email', formData.email);
      if (formData.instagram && String(formData.instagram).trim()) formDataObj.append('instagram', String(formData.instagram).trim());
      if (formData.facebook) formDataObj.append('facebook', formData.facebook);
      if (formData.tiktok && String(formData.tiktok).trim()) formDataObj.append('tiktok', String(formData.tiktok).trim());
      if (formData.website) formDataObj.append('website', formData.website);
      if (formData.logo) formDataObj.append('logo', formData.logo);
      if (formData.image) formDataObj.append('image', formData.image);
      if (formData.image2) formDataObj.append('image2', formData.image2);
    }

    setSubmitting(true);
    try {
      await Promise.resolve(onSubmit(formDataObj));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full sm:rounded-2xl shadow-2xl sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 shrink-0">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800 truncate pr-2">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <form id="entity-modal-form" onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto min-h-0 flex-1 max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-140px)]">
          {entityType === 'evenements' ? (
            // Formulaire pour événements - SEULEMENT LES CHAMPS QUI EXISTENT DANS LA DB
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Titre - Obligatoire */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="titre"
                  value={formData.titre}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Titre de l'événement"
                />
              </div>

              {/* Description - Obligatoire */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Description de l'événement"
                />
              </div>

              {/* Date et heure de début - Obligatoire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date et heure de début <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              {/* Lieu - Obligatoire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lieu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lieu"
                  value={formData.lieu}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Lieu de l'événement"
                />
              </div>

              {/* Date de fin - Optionnel (événements sur plusieurs jours/semaines) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de fin
                </label>
                <input
                  type="date"
                  name="dateFin"
                  value={formData.dateFin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              {/* Heure de fin - Optionnel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure de fin
                </label>
                <input
                  type="time"
                  name="heureFin"
                  value={formData.heureFin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              {/* Affiche - Obligatoire */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Affiche <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-4">
                  {affichePreview && (
                    <div className="relative w-32 h-32">
                      <img
                        src={affichePreview}
                        alt="Aperçu de l'affiche"
                        className="object-cover rounded-lg w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setAffichePreview(null);
                          setFormData(prev => ({ ...prev, affiche: null }));
                        }}
                        className="absolute -top-2 -right-2 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200"
                      >
                        
                      </button>
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'affiche')}
                      className="hidden"
                      id="affiche-upload"
                    />
                    <label
                      htmlFor="affiche-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      {affichePreview ? 'Changer l\'affiche' : 'Télécharger une affiche'}
                    </label>
                  </div>
                </div>
              </div>

              {/* Images supplémentaires (1 à 3, optionnel) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images supplémentaires (optionnel, 1 à 3)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {([1, 2, 3] as const).map((n) => {
                    const prev = n === 1 ? galerie1Preview : n === 2 ? galerie2Preview : galerie3Preview;
                    const field = n === 1 ? 'galerie1' : n === 2 ? 'galerie2' : 'galerie3';
                    return (
                      <div key={n} className="flex flex-col gap-2">
                        {prev && (
                          <div className="relative w-full aspect-[1020/1350] max-h-24 rounded overflow-hidden bg-gray-100">
                            <img src={prev} alt={`Galerie ${n}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              aria-label={`Supprimer l'image ${n}`}
                              onClick={() => {
                                setFormData(prev => ({ ...prev, [field]: null }));
                                if (n === 1) setGalerie1Preview(null);
                                else if (n === 2) setGalerie2Preview(null);
                                else setGalerie3Preview(null);
                              }}
                              className="absolute top-1 right-1 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, field)}
                          className="hidden"
                          id={`galerie-${n}-upload`}
                        />
                        <label
                          htmlFor={`galerie-${n}-upload`}
                          className="cursor-pointer inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          {prev ? `Remplacer` : `Image ${n}`}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Statut - Obligatoire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut <span className="text-red-500">*</span>
                </label>
                <select
                  name="statut"
                  value={formData.statut}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="planifié">Planifié</option>
                  <option value="annulé">Annulé</option>
                  <option value="terminé">Terminé</option>
                </select>
              </div>
            </div>
          ) : (
            // Formulaire pour commerces (boutiques, restaurants, loisirs)
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nom - Obligatoire */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder={`Nom du ${entityType.slice(0, -1)}`}
                />
              </div>

              {/* Description - Obligatoire */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder={`Description du ${entityType.slice(0, -1)}`}
                />
              </div>

              {/* Horaires - Obligatoire */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horaires <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="horaires"
                  value={formData.horaires}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Ex: Lundi - Vendredi : 10h30-20h30&#10;Samedi : 10h30-19h30&#10;Dimanche : Fermé"
                />
              </div>

              {/* Heures d'ouverture et fermeture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure d'ouverture <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="heureOuverture"
                  value={formData.heureOuverture}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure de fermeture <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="heureFermeture"
                  value={formData.heureFermeture}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              {/* Portes ouvertes dimanche */}
              <div className="md:col-span-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="openSunday"
                    checked={formData.openSunday}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Portes ouvertes dimanche</span>
                </label>
              </div>

              {/* Statut - Obligatoire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut <span className="text-red-500">*</span>
                </label>
                <select
                  name="statut"
                  value={formData.statut}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Numéro de téléphone"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Adresse email"
                />
              </div>

              {/* Réseaux sociaux */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TikTok
                </label>
                <input
                  type="url"
                  name="tiktok"
                  value={formData.tiktok}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="https://tiktok.com/..."
                />
              </div>

              {/* Site web */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site web
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>

              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo
                </label>
                <div className="flex items-center space-x-4">
                  {logoPreview && (
                    <div className="relative w-16 h-16">
                      <img
                        src={logoPreview}
                        alt="Aperçu du logo"
                        className="object-cover rounded-lg w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setLogoPreview(null);
                          setFormData(prev => ({ ...prev, logo: null }));
                        }}
                        className="absolute -top-2 -right-2 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200"
                      >
                        
                      </button>
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'logo')}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      {logoPreview ? 'Changer le logo' : 'Télécharger un logo'}
                    </label>
                  </div>
                </div>
              </div>

              {/* Image de couverture 1 - Obligatoire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image de couverture <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-4">
                  {imagePreview && (
                    <div className="relative w-32 h-32">
                      <img
                        src={imagePreview}
                        alt="Aperçu image de couverture"
                        className="object-cover rounded-lg w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, image: null }));
                        }}
                        className="absolute -top-2 -right-2 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'image')}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      {imagePreview ? 'Changer l\'image de couverture' : 'Télécharger l\'image de couverture'}
                    </label>
                  </div>
                </div>
              </div>

              {/* Image de couverture 2 - Optionnelle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image de couverture 2 <span className="text-gray-400 font-normal">(optionnelle)</span>
                </label>
                <div className="flex items-center space-x-4">
                  {image2Preview && (
                    <div className="relative w-32 h-32">
                      <img
                        src={image2Preview}
                        alt="Aperçu image de couverture 2"
                        className="object-cover rounded-lg w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImage2Preview(null);
                          setFormData(prev => ({ ...prev, image2: null }));
                        }}
                        className="absolute -top-2 -right-2 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'image2')}
                      className="hidden"
                      id="image2-upload"
                    />
                    <label
                      htmlFor="image2-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      {image2Preview ? 'Changer' : 'Télécharger (optionnel)'}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            form="entity-modal-form"
            disabled={submitting}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting
              ? (entityData ? 'Enregistrement…' : 'Création en cours… (patientez jusqu’à 1 min)')
              : (entityData ? 'Modifier' : 'Créer')}
          </button>
        </div>
      </div>
    </div>
  );
};
