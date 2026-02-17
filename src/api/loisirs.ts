import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface Loisir {
  id: string;
  name: string;
  description: string;
  image: string;
  type: string;
  level: string;
  statut: 'actif' | 'inactif';
}

export const getLoisirs = async (): Promise<Loisir[]> => {
  try {
    const response = await axios.get(`${API_URL}/loisirs`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des loisirs:', error);
    return [];
  }
}; 