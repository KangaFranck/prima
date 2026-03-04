import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface Restaurant {
  id: string;
  nom: string;
  description: string;
  image: string;
  logo?: string;
  cuisine: string;
  level: string;
  statut: 'actif' | 'inactif';
}

export const getRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const response = await axios.get(`${API_URL}/restaurants`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des restaurants:', error);
    return [];
  }
}; 