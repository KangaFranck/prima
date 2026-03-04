import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface Boutique {
  id: string;
  nom: string;
  description: string;
  image: string;
  logo?: string;
  category: string;
  level: string;
  statut: 'actif' | 'inactif';
}

export const getBoutiques = async (): Promise<Boutique[]> => {
  try {
    const response = await axios.get(`${API_URL}/boutiques`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des boutiques:', error);
    return [];
  }
}; 