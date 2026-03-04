import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { FitnessForm } from '../components/FitnessForm';
import { FitnessCenter } from '../../types/admin';

export const FitnessPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFitness, setSelectedFitness] = useState<FitnessCenter | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { fitness, loading, addFitness, updateFitness, deleteFitness, setLoading } = useAdminStore();

  const handleSubmit = async (data: Partial<FitnessCenter>) => {
    try {
      setLoading(true);
      if (selectedFitness) {
        const updatedFitness = { ...selectedFitness, ...data };
        updateFitness(selectedFitness.id, updatedFitness);
      } else {
        const newFitness: FitnessCenter = {
          id: Date.now().toString(),
          ...data as Omit<FitnessCenter, 'id'>,
        };
        addFitness(newFitness);
      }
      setIsModalOpen(false);
      setSelectedFitness(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet espace fitness ?')) {
      try {
        setLoading(true);
        deleteFitness(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#2C2C2C]">Gestion du fitness</h1>
        <button
          onClick={() => {
            setSelectedFitness(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#2C2C2C] hover:bg-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C2C2C]"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter un espace fitness
        </button>
      </div>

      {error && (
        <div className="mb-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden rounded-lg border border-[#E8E8D5]">
        {loading ? (
          <div className="p-4 text-center text-[#2C2C2C]">Chargement...</div>
        ) : (
          <table className="min-w-full divide-y divide-[#E8E8D5]">
            <thead className="bg-[#F5F5DC]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2C2C2C] uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2C2C2C] uppercase tracking-wider">
                  Horaires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2C2C2C] uppercase tracking-wider">
                  Tarifs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2C2C2C] uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2C2C2C] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#E8E8D5]">
              {fitness.map((item) => (
                <tr key={item.id} className="hover:bg-[#F5F5DC] transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2C2C2C]">
                    {item.nom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C2C2C]">
                    {item.horaires}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C2C2C]">
                    {item.tarifs}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.statut === 'actif' 
                        ? 'bg-[#F5F5DC] text-[#2C2C2C]' 
                        : 'bg-[#E8E8D5] text-[#2C2C2C]'
                    }`}>
                      {item.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C2C2C]">
                    <button
                      onClick={() => {
                        setSelectedFitness(item);
                        setIsModalOpen(true);
                      }}
                      className="text-[#2C2C2C] hover:text-[#3D3D3D] mr-4"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-[#2C2C2C] hover:text-[#3D3D3D]"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#2C2C2C] bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-lg font-medium text-[#2C2C2C] mb-4">
                {selectedFitness ? 'Modifier l\'espace fitness' : 'Ajouter un espace fitness'}
              </h2>
              <FitnessForm
                initialData={selectedFitness || undefined}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsModalOpen(false);
                  setSelectedFitness(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 