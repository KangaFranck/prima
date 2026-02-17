import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface EntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  title: string;
  entityData?: any;
  entityType: 'loisirs' | 'boutiques' | 'restaurants' | 'evenements';
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
    logo: null as File | null,
    image: null as File | null,
    // Champs spécifiques aux événements - SEULEMENT CEUX QUI EXISTENT DANS LA DB
    titre: '',
    date: '',
    lieu: '',
    affiche: null as File | null
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [affichePreview, setAffichePreview] = useState<string | null>(null);

  useEffect(() => {
    if (entityData) {
      if (entityType === 'evenements') {
        setFormData({
          titre: entityData.titre || entityData.title || '',
          description: entityData.description || '',
          date: entityData.date || '',
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
      } else {
        setFormData({
          nom: entityData.nom || '',
          description: entityData.description || '',
          horaires: entityData.horaires || '',
          heureOuverture: entityData.heureOuverture || '',
          heureFermeture: entityData.heureFermeture || '',
          openSunday: entityData.openSunday || false,
          statut: entityData.statut || 'actif',
          universe: entityData.universe || 'Général',
          telephone: entityData.telephone || '',
          email: entityData.email || '',
          instagram: entityData.instagram || '',
          facebook: entityData.facebook || '',
          tiktok: entityData.tiktok || '',
          logo: null,
          image: null,
          // Champs non utilisés pour commerces
          titre: '',
          date: '',
          lieu: '',
          affiche: null
        });
        
        if (entityData.logo) {
          setLogoPreview(entityData.logo);
        }
        if (entityData.image) {
          setImagePreview(entityData.image);
        }
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
        logo: null,
        image: null,
        titre: '',
        date: '',
        lieu: '',
        affiche: null
      });
      setLogoPreview(null);
      setImagePreview(null);
      setAffichePreview(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'image' | 'affiche') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
      
      const previewUrl = URL.createObjectURL(file);
      if (field === 'logo') {
        setLogoPreview(previewUrl);
      } else if (field === 'image') {
        setImagePreview(previewUrl);
      } else if (field === 'affiche') {
        setAffichePreview(previewUrl);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataObj = new FormData();
    
    if (entityType === 'evenements') {
      // Champs spécifiques aux événements - SEULEMENT CEUX QUI EXISTENT DANS LA DB
      formDataObj.append('titre', formData.titre);
      formDataObj.append('description', formData.description);
      formDataObj.append('date', formData.date);
      formDataObj.append('lieu', formData.lieu);
      formDataObj.append('statut', formData.statut);
      if (formData.affiche) formDataObj.append('affiche', formData.affiche);
    } else {
      // Champs pour commerces
      formDataObj.append('nom', formData.nom);
      formDataObj.append('description', formData.description);
      formDataObj.append('horaires', formData.horaires);
      formDataObj.append('heureOuverture', formData.heureOuverture);
      formDataObj.append('heureFermeture', formData.heureFermeture);
      formDataObj.append('openSunday', formData.openSunday.toString());
      formDataObj.append('statut', formData.statut);
      formDataObj.append('universe', formData.universe);
      if (formData.telephone) formDataObj.append('telephone', formData.telephone);
      if (formData.email) formDataObj.append('email', formData.email);
      if (formData.instagram) formDataObj.append('instagram', formData.instagram);
      if (formData.facebook) formDataObj.append('facebook', formData.facebook);
      if (formData.tiktok) formDataObj.append('tiktok', formData.tiktok);
      if (formData.logo) formDataObj.append('logo', formData.logo);
      if (formData.image) formDataObj.append('image', formData.image);
    }
    
    onSubmit(formDataObj);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
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

              {/* Date - Obligatoire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
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

              {/* Universe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Univers
                </label>
                <input
                  type="text"
                  name="universe"
                  value={formData.universe}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Ex: Mode, Sport, Culture..."
                />
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

              {/* Image principale - Obligatoire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image principale <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-4">
                  {imagePreview && (
                    <div className="relative w-32 h-32">
                      <img
                        src={imagePreview}
                        alt="Aperçu de l'image"
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
                      {imagePreview ? 'Changer l\'image' : 'Télécharger une image'}
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
            onClick={handleSubmit}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            {entityData ? 'Modifier' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
};
