import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash, Search, X, Wrench } from 'lucide-react';
import { EntityModal } from '../components/EntityModal';
import { Service } from '../../types/entity';
import { usePbAdminStore } from '../../store/pbAdminStore';

export const Services = () => {
  const { services, createService, updateService, deleteService, fetchServices, loading, error } = usePbAdminStore();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = services.filter(service =>
    service.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (service.telephone && service.telephone.includes(searchTerm)) ||
    (service.email && service.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = async (formData: FormData) => {
    try {
      const service: Partial<Service> & Record<string, any> = {
        nom: formData.get('nom') as string,
        description: formData.get('description') as string,
        horaires: formData.get('horaires') as string,
        heureOuverture: String(formData.get('heureOuverture') ?? '').trim(),
        heureFermeture: String(formData.get('heureFermeture') ?? '').trim(),
        openSunday: formData.get('openSunday') === 'true',
        statut: formData.get('statut') as 'actif' | 'inactif',
        universe: formData.get('universe') as string || 'Général',
        telephone: formData.get('telephone') as string || undefined,
        email: formData.get('email') as string || undefined,
        instagram: (formData.get('instagram') as string)?.trim() || undefined,
        facebook: formData.get('facebook') as string || undefined,
        website: formData.get('website') as string || undefined
      };

      const logoFile = formData.get('logo') as File;
      if (logoFile && logoFile.size > 0) service.logo = logoFile;
      else if (selectedService?.logo) service.logo = selectedService.logo;

      const imageFile = formData.get('image') as File;
      if (imageFile && imageFile.size > 0) service.image = imageFile;
      else if (selectedService?.images?.[0]) service.image = selectedService.images[0];

      if (selectedService) {
        await updateService(selectedService.id, service);
      } else {
        await createService(service);
      }
      setIsModalOpen(false);
      setSelectedService(null);
      fetchServices();
    } catch (err) {
      console.error('Erreur lors de la soumission:', err);
    }
  };

  const handleEdit = (service: any) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      try {
        await deleteService(id);
        fetchServices();
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
      }
    }
  };

  const handleAdd = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const clearSearch = () => setSearchTerm('');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        <p>Erreur: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-50 p-3 sm:p-4 md:p-6">
      <div className="mb-4 sm:mb-6 md:mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-1 sm:mb-2">Services</h1>
            <p className="text-sm sm:text-base text-stone-600">Gérez les prestations et services</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center justify-center px-4 py-3 sm:px-6 w-full sm:w-auto bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Plus className="w-5 h-5 mr-2 shrink-0" />
            Ajouter un service
          </button>
        </div>
      </div>

      <div className="mb-4 sm:mb-6 md:mb-8">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un service (nom, description, téléphone, email)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white shadow-sm"
          />
          {searchTerm && (
            <button type="button" onClick={clearSearch} className="absolute inset-y-0 right-0 pr-3 flex items-center" aria-label="Effacer la recherche" title="Effacer la recherche">
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="mt-2 text-sm text-gray-600">
            {filteredServices.length} service(s) trouvé(s) pour "{searchTerm}"
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices.map((service) => (
          <div key={service.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-amber-100 hover:border-amber-300 transform hover:-translate-y-2">
            <div className="relative h-48 overflow-hidden">
              {(service.logo || service.images?.[0]) ? (
                <img
                  src={service.logo || service.images?.[0]}
                  alt={service.nom}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-slate-300 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Wrench className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-slate-600 font-medium">Service</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-2 flex items-center justify-center">
                {service.logo ? (
                  <img src={service.logo} alt={service.nom} className="max-w-full max-h-full object-contain" />
                ) : (
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Wrench className="w-4 h-4 text-slate-600" />
                  </div>
                )}
              </div>
              <div className="absolute top-4 left-4 flex space-x-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                  title="Modifier"
                >
                  <Pencil className="w-4 h-4 text-amber-600" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors shadow-lg"
                  title="Supprimer"
                >
                  <Trash className="w-4 h-4 text-red-600" />
                </button>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  service.statut === 'actif'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {service.statut === 'actif' ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-stone-800 group-hover:text-amber-700 transition-colors">
                {service.nom}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && searchTerm && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-stone-800 mb-4">Aucun service trouvé</h3>
          <p className="text-stone-600 mb-8 max-w-md mx-auto">
            Aucun service ne correspond à votre recherche "{searchTerm}".
          </p>
          <button
            onClick={clearSearch}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <X className="w-5 h-5 mr-2" />
            Effacer la recherche
          </button>
        </div>
      )}

      {services.length === 0 && !searchTerm && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wrench className="w-12 h-12 text-slate-600" />
          </div>
          <h3 className="text-2xl font-bold text-stone-800 mb-4">Aucun service enregistré</h3>
          <p className="text-stone-600 mb-8 max-w-md mx-auto">
            Commencez par ajouter votre premier service en cliquant sur le bouton "Ajouter un service".
          </p>
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ajouter votre premier service
          </button>
        </div>
      )}

      <EntityModal
        key={selectedService?.id ?? 'new'}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedService(null);
        }}
        onSubmit={handleSubmit}
        title={selectedService ? "Modifier le service" : "Ajouter un service"}
        entityData={selectedService ? { ...selectedService, image: selectedService.images?.[0] || selectedService.logo } : undefined}
        entityType="services"
      />
    </div>
  );
};
