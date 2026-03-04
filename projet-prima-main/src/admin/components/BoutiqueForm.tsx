import React, { useState, useEffect } from 'react';
import { Boutique } from '../../types/admin';
import { X, Upload, ChevronRight } from 'lucide-react';

interface BoutiqueFormProps {
  initialData?: Partial<Boutique>;
  onSubmit: (data: Partial<Boutique>) => void;
  onCancel: () => void;
}

const universeOptions = [
  'Mode',
  'Restaurant & FastFood',
  'Bien-être et Santé',
  'Sports et Loisirs',
  'Enfant',
  'Déco maison et cadeau',
  'Électro et Tech',
  'Services',
  'Parfumerie'
];

const BoutiqueForm: React.FC<BoutiqueFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Boutique>>({
    nom: '',
    description: '',
    horaires: '',
    logo: '',
    statut: 'actif',
    universe: 'Mode',
    images: initialData?.images || [],
    ...initialData,
  });

  const [previewLogo, setPreviewLogo] = useState<string | null>(initialData?.logo || null);
  const [showDescription, setShowDescription] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewLogo(previewUrl);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          logo: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const promises = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(newImages => {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  useEffect(() => {
    return () => {
      if (previewLogo && !previewLogo.startsWith('data:')) {
        URL.revokeObjectURL(previewLogo);
      }
    };
  }, [previewLogo]);

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[600px]">
      <form id="boutiqueForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6">
        <div className="space-y-4 pb-20">
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-[#2C2C2C]">
              Nom
            </label>
            <input
              type="text"
              name="nom"
              id="nom"
              required
              value={formData.nom}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-[#E8E8D5] shadow-sm focus:border-[#2C2C2C] focus:ring-[#2C2C2C] sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#2C2C2C]">
              Description
            </label>
            <div 
              onClick={() => setShowDescription(true)}
              className="mt-1 block w-full rounded-md border border-[#E8E8D5] p-2 cursor-pointer hover:bg-[#F5F5DC] transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 truncate pr-4">
                  {formData.description || 'Cliquez pour éditer la description'}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {showDescription && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg w-full max-w-2xl">
                  <div className="p-4 border-b border-[#E8E8D5] flex justify-between items-center">
                    <h3 className="text-lg font-medium text-[#2C2C2C]">Modifier la description</h3>
                    <button
                      type="button"
                      onClick={() => setShowDescription(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-4">
                    <textarea
                      name="description"
                      id="description"
                      rows={8}
                      required
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full rounded-md border-[#E8E8D5] shadow-sm focus:border-[#2C2C2C] focus:ring-[#2C2C2C] sm:text-sm"
                      placeholder="Entrez la description de la boutique..."
                    />
                    <div className="text-right mt-2 text-xs text-gray-500">
                      {formData.description.length} caractères
                    </div>
                  </div>
                  <div className="p-4 border-t border-[#E8E8D5] flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowDescription(false)}
                      className="px-4 py-2 bg-[#2C2C2C] text-white rounded-md hover:bg-[#3D3D3D]"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="horaires" className="block text-sm font-medium text-[#2C2C2C]">
              Horaires
            </label>
            <textarea
              name="horaires"
              id="horaires"
              rows={2}
              required
              value={formData.horaires}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-[#E8E8D5] shadow-sm focus:border-[#2C2C2C] focus:ring-[#2C2C2C] sm:text-sm"
              placeholder="Ex: Lun-Sam: 10h-20h, Dim: Fermé"
            />
          </div>

          <div>
            <label htmlFor="universe" className="block text-sm font-medium text-[#2C2C2C]">
              Univers
            </label>
            <select
              name="universe"
              id="universe"
              required
              value={formData.universe}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-[#E8E8D5] shadow-sm focus:border-[#2C2C2C] focus:ring-[#2C2C2C] sm:text-sm"
            >
              {universeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-[#2C2C2C]">
              Logo
            </label>
            <div className="mt-1 flex items-center space-x-4">
              {previewLogo && (
                <div className="relative w-32 h-32">
                  <img
                    src={previewLogo}
                    alt="Aperçu du logo"
                    className="object-cover rounded-lg w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewLogo(null);
                      setFormData(prev => ({ ...prev, logo: '' }));
                    }}
                    className="absolute -top-2 -right-2 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200"
                  >
                    ×
                  </button>
                </div>
              )}
              <input
                type="file"
                name="logo"
                id="logo"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="logo"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-[#E8E8D5] rounded-md shadow-sm text-sm font-medium text-[#2C2C2C] bg-white hover:bg-[#F5F5DC] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C2C2C]"
              >
                Choisir un fichier
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="images" className="block text-sm font-medium text-[#2C2C2C]">
              Images de la boutique
            </label>
            <div className="mt-1 grid grid-cols-3 gap-4">
              {formData.images.map((image: string, index: number) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <label className="aspect-square border-2 border-gray-300 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Ajouter des images</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImagesUpload}
                />
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="statut" className="block text-sm font-medium text-[#2C2C2C]">
              Statut
            </label>
            <select
              name="statut"
              id="statut"
              required
              value={formData.statut}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-[#E8E8D5] shadow-sm focus:border-[#2C2C2C] focus:ring-[#2C2C2C] sm:text-sm"
            >
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>
        </div>
      </form>

      <div className="sticky bottom-0 bg-white p-4 border-t border-[#E8E8D5] mt-auto">
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-[#E8E8D5] rounded-md shadow-sm text-sm font-medium text-[#2C2C2C] bg-white hover:bg-[#F5F5DC] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C2C2C]"
          >
            Annuler
          </button>
          <button
            type="submit"
            form="boutiqueForm"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2C2C2C] hover:bg-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C2C2C]"
          >
            {initialData ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoutiqueForm; 