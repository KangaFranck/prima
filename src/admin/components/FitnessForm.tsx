import { useState, useEffect } from 'react';
import { Fitness } from '../../types/admin';

interface FitnessFormProps {
  initialData?: Fitness;
  onSubmit: (data: Partial<Fitness>) => void;
  onCancel: () => void;
}

export const FitnessForm = ({ initialData, onSubmit, onCancel }: FitnessFormProps) => {
  const [formData, setFormData] = useState<Partial<Fitness>>({
    nom: '',
    description: '',
    horaires: '',
    equipements: [],
    tarifs: '',
    statut: 'actif',
    image: '',
    ...initialData
  });

  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.image || null);
  const [equipementInput, setEquipementInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddEquipement = () => {
    if (equipementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        equipements: [...(prev.equipements || []), equipementInput.trim()]
      }));
      setEquipementInput('');
    }
  };

  const handleRemoveEquipement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      equipements: prev.equipements?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  useEffect(() => {
    return () => {
      if (previewImage && !previewImage.startsWith('data:')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[600px]">
      <form id="fitnessForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6">
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
            <textarea
              name="description"
              id="description"
              rows={3}
              required
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-[#E8E8D5] shadow-sm focus:border-[#2C2C2C] focus:ring-[#2C2C2C] sm:text-sm"
            />
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
              placeholder="Ex: Lun-Ven: 6h-22h, Sam-Dim: 8h-20h"
            />
          </div>

          <div>
            <label htmlFor="equipements" className="block text-sm font-medium text-[#2C2C2C]">
              Équipements
            </label>
            <div className="mt-1 flex space-x-2">
              <input
                type="text"
                value={equipementInput}
                onChange={(e) => setEquipementInput(e.target.value)}
                className="block w-full rounded-md border-[#E8E8D5] shadow-sm focus:border-[#2C2C2C] focus:ring-[#2C2C2C] sm:text-sm"
                placeholder="Ajouter un équipement"
              />
              <button
                type="button"
                onClick={handleAddEquipement}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#2C2C2C] hover:bg-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C2C2C]"
              >
                +
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.equipements?.map((equipement, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F5F5DC] text-[#2C2C2C]"
                >
                  {equipement}
                  <button
                    type="button"
                    onClick={() => handleRemoveEquipement(index)}
                    className="ml-1 inline-flex items-center p-0.5 rounded-full text-[#2C2C2C] hover:bg-[#E8E8D5] focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="tarifs" className="block text-sm font-medium text-[#2C2C2C]">
              Tarifs
            </label>
            <textarea
              name="tarifs"
              id="tarifs"
              rows={2}
              required
              value={formData.tarifs}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-[#E8E8D5] shadow-sm focus:border-[#2C2C2C] focus:ring-[#2C2C2C] sm:text-sm"
              placeholder="Ex: Abonnement mensuel: 50€, Séance: 10€"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-[#2C2C2C]">
              Image
            </label>
            <div className="mt-1 flex items-center space-x-4">
              {previewImage && (
                <div className="relative w-32 h-32">
                  <img
                    src={previewImage}
                    alt="Aperçu de l'image"
                    className="object-cover rounded-lg w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null);
                      setFormData(prev => ({ ...prev, image: '' }));
                    }}
                    className="absolute -top-2 -right-2 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200"
                  >
                    ×
                  </button>
                </div>
              )}
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="image"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-[#E8E8D5] rounded-md shadow-sm text-sm font-medium text-[#2C2C2C] bg-white hover:bg-[#F5F5DC] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C2C2C]"
              >
                Choisir un fichier
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
            form="fitnessForm"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2C2C2C] hover:bg-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C2C2C]"
          >
            {initialData ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}; 