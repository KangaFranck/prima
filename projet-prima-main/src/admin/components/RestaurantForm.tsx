import { useState, useEffect } from 'react';
import { Restaurant } from '../../types/admin';
import { X, Upload } from 'lucide-react';

interface RestaurantFormProps {
  initialData?: Restaurant;
  onSubmit: (data: Partial<Restaurant>) => void;
  onCancel: () => void;
}

export const RestaurantForm = ({ initialData, onSubmit, onCancel }: RestaurantFormProps) => {
  const [formData, setFormData] = useState<Partial<Restaurant>>({
    nom: '',
    description: '',
    typeCuisine: '',
    horaires: '',
    menu: '',
    logo: '',
    images: [],
    statut: 'actif',
    ...initialData
  });

  const [previewLogo, setPreviewLogo] = useState<string | null>(initialData?.logo || null);
  const [previewMenu, setPreviewMenu] = useState<string | null>(initialData?.menu || null);
  const [menuFile, setMenuFile] = useState<File | null>(null);
  const [images, setImages] = useState<{ file: File; preview: string }[]>(
    initialData?.images?.map((img: string) => ({ file: new File([], ''), preview: img })) || []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const fieldName = e.target.name;
    
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (fieldName === 'logo') {
        setPreviewLogo(previewUrl);
      } else if (fieldName === 'menu') {
        setMenuFile(file);
        if (file.type.includes('image')) {
          setPreviewMenu(previewUrl);
        } else {
          setPreviewMenu('/images/pdf-icon.png');
        }
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [fieldName]: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);

    // Convertir les images en base64
    const base64Images = await Promise.all(
      files.map(file => new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      }))
    );

    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), ...base64Images]
    }));
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
  };

  const handleRemoveFile = () => {
    setMenuFile(null);
    setPreviewMenu(null);
    setFormData(prev => ({
      ...prev,
      menu: ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convertir le menu en base64 si présent
    if (menuFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const finalData = {
          ...formData,
          menu: reader.result as string
        };
        onSubmit(finalData);
      };
      reader.readAsDataURL(menuFile);
    } else {
      onSubmit(formData);
    }
  };

  useEffect(() => {
    return () => {
      if (previewLogo && !previewLogo.startsWith('data:')) {
        URL.revokeObjectURL(previewLogo);
      }
      if (previewMenu && !previewMenu.startsWith('data:')) {
        URL.revokeObjectURL(previewMenu);
      }
    };
  }, [previewLogo, previewMenu]);

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[600px]">
      <form id="restaurantForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6">
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
            <label htmlFor="typeCuisine" className="block text-sm font-medium text-[#2C2C2C]">
              Type de cuisine
            </label>
            <input
              type="text"
              name="typeCuisine"
              id="typeCuisine"
              required
              value={formData.typeCuisine}
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
              placeholder="Ex: Lun-Ven: 11h-23h, Sam-Dim: 11h-00h"
            />
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
            <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
              Menu (PDF ou Image)
            </label>
            <div className="relative">
              {previewMenu ? (
                <div className="relative inline-block">
                  {previewMenu.includes('pdf') ? (
                    <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded-md">
                      <span className="text-sm text-gray-600">PDF</span>
                    </div>
                  ) : (
                    <img 
                      src={previewMenu} 
                      alt="Menu preview" 
                      className="w-32 h-32 object-cover rounded-md"
                    />
                  )}
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <div className="text-sm text-gray-600">
                      <label htmlFor="menu" className="relative cursor-pointer rounded-md font-medium text-[#2C2C2C] hover:text-[#3D3D3D]">
                        <span>Choisir un fichier</span>
                        <input
                          id="menu"
                          name="menu"
                          type="file"
                          accept=".pdf,image/*"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PDF ou Image jusqu'à 10MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
              Images de la boutique
            </label>
            <div className="grid grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image.preview}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleImagesChange}
                  className="hidden"
                />
                <label htmlFor="images" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Ajouter des images</span>
                </label>
              </div>
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
            form="restaurantForm"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2C2C2C] hover:bg-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C2C2C]"
          >
            {initialData ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}; 