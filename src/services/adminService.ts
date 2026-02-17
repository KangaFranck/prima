import { Boutique, Evenement } from '../types/admin';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

console.log('API_URL:', API_URL);

// Service pour les boutiques
export const boutiqueService = {
  async getAll(): Promise<Boutique[]> {
    console.log('Appel de boutiqueService.getAll()');
    try {
      const url = `${API_URL}/boutiques`;
      console.log('URL appelée:', url);
      
      const response = await fetch(url);
      console.log('Status:', response.status);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));
      
      const text = await response.text();
      console.log('Réponse brute du serveur:', text.substring(0, 500)); // Affiche les 500 premiers caractères
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
      }
      
      try {
        const data = JSON.parse(text);
        return data;
      } catch (parseError) {
        console.error('Contenu reçu (non-JSON):', text);
        throw new Error(`Réponse non-JSON reçue du serveur. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur complète:', error);
      throw error;
    }
  },

  async create(boutique: Omit<Boutique, 'id' | 'createdAt' | 'updatedAt'>): Promise<Boutique> {
    console.log('Création d\'une boutique:', boutique);
    const response = await fetch(`${API_URL}/boutiques`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(boutique),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la création de la boutique');
    }
    return response.json();
  },

  async update(id: string, boutique: Partial<Boutique>): Promise<Boutique> {
    const response = await fetch(`${API_URL}/boutiques/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(boutique),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour de la boutique');
    }
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/boutiques/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de la boutique');
    }
  },
};

// Service pour les événements
export const evenementService = {
  async getAll(): Promise<Evenement[]> {
    const response = await fetch(`${API_URL}/evenements`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des événements');
    }
    return response.json();
  },

  async create(evenement: Omit<Evenement, 'id' | 'createdAt' | 'updatedAt'>): Promise<Evenement> {
    const response = await fetch(`${API_URL}/evenements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(evenement),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la création de l\'événement');
    }
    return response.json();
  },

  async update(id: string, evenement: Partial<Evenement>): Promise<Evenement> {
    const response = await fetch(`${API_URL}/evenements/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(evenement),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour de l\'événement');
    }
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/evenements/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de l\'événement');
    }
  },
}; 