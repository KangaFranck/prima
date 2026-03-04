import { useState, useEffect } from 'react';
import { Evenement } from '../../types/admin';

interface EvenementFormProps {
  initialData?: Evenement;
  onSubmit: (data: Partial<Evenement>) => void;
  onCancel: () => void;
}

export const EvenementForm = ({ initialData, onSubmit, onCancel }: EvenementFormProps) => {
  const [formData, setFormData] = useState<Partial<Evenement>>({
    titre: '',
    description: '',
    date: '',
    lieu: '',
    statut: 'planifié',
    affiche: '',
    ...initialData
  });

  const [previewAffiche, setPreviewAffiche] = useState<string | null>(initialData?.affiche || null);

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
      setPreviewAffiche(previewUrl);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          affiche: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  useEffect(() => {
    return () => {
      if (previewAffiche && !previewAffiche.startsWith('data:')) {
        URL.revokeObjectURL(previewAffiche);
      }
    };
  }, [previewAffiche]);

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[600px]">
      <form id="evenementForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6">
        <div className="space-y-4 pb-20">
          <div>
            <label htmlFor="titre" className="block text-sm font-medium text-[#2C2C2C]">
              Titre
            </label>
            <input
              type="text"
              name="titre"
              id="titre"
              required
              value={formData.titre}
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
            <label htmlFor="date" className="block text-sm font-medium text-[#2C2C2C]">
              Date
            </label>
            <input
              type="datetime-local"
              name="date"
              id="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-[#E8E8D5] shadow-sm focus:border-[#2C2C2C] focus:ring-[#2C2C2C] sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="lieu" className="block text-sm font-medium text-[#2C2C2C]">
              Lieu
            </label>
            <input
              type="text"
              name="lieu"
              id="lieu"
              required
              value={formData.lieu}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-[#E8E8D5] shadow-sm focus:border-[#2C2C2C] focus:ring-[#2C2C2C] sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="affiche" className="block text-sm font-medium text-[#2C2C2C]">
              Affiche
            </label>
            <div className="mt-1 flex items-center space-x-4">
              {previewAffiche && (
                <div className="relative w-32 h-32">
                  <img
                    src={previewAffiche}
                    alt="Aperçu de l'affiche"
                    className="object-cover rounded-lg w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewAffiche(null);
                      setFormData(prev => ({ ...prev, affiche: '' }));
                    }}
                    className="absolute -top-2 -right-2 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200"
                  >
                    ×
                  </button>
                </div>
              )}
              <input
                type="file"
                name="affiche"
                id="affiche"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="affiche"
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
              <option value="planifié">Planifié</option>
              <option value="annulé">Annulé</option>
              <option value="terminé">Terminé</option>
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
            form="evenementForm"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2C2C2C] hover:bg-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C2C2C]"
          >
            {initialData ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}; 