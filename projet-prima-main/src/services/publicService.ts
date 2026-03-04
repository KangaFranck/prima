import { Boutique } from '../types/admin';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://prima-8fvobd0l8-primacenters-projects.vercel.app/api'
  : 'http://localhost:3000/api';

console.log('Configuration API:', {
  API_URL,
  NODE_ENV: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD
});

// Service pour les boutiques publiques
export const publicService = {
  async getBoutiques(): Promise<Boutique[]> {
    try {
      const response = await axios.get(`${API_URL}/boutiques`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des boutiques:', error);
      throw error;
    }
  },

  async createBoutique(boutique: Boutique): Promise<Boutique> {
    try {
      const response = await axios.post(`${API_URL}/boutiques`, boutique);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la boutique:', error);
      throw error;
    }
  }
}; 