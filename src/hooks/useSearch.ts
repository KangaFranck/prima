import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiClient';

interface SearchResult {
  id: string;
  name: string;
  type: 'boutique' | 'restaurant' | 'loisir';
  description?: string;
  universe?: string;
  cuisine?: string;
  categories?: string[];
  image?: string;
}

function matchesQuery(query: string, ...fields: (string | undefined)[]): boolean {
  const q = query.toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(q));
}

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      const query = searchQuery.toLowerCase().trim();
      if (query.length < 2) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const [boutiques, restaurants, loisirs] = await Promise.all([
          apiClient.boutiques.list(),
          apiClient.restaurants.list(),
          apiClient.loisirs.list(),
        ]);

        const searchResults: SearchResult[] = [];

        boutiques
          .filter((b) => b.statut !== 'inactif' && matchesQuery(query, b.nom, b.universe, b.description))
          .forEach((b) => {
            searchResults.push({
              id: b.id,
              name: b.nom,
              type: 'boutique',
              description: b.description,
              universe: b.universe,
              image: b.logo || b.image || '/images/logos/default.png',
            });
          });

        restaurants
          .filter((r) => r.statut !== 'inactif' && matchesQuery(query, r.nom, r.universe, r.description))
          .forEach((r) => {
            searchResults.push({
              id: r.id,
              name: r.nom,
              type: 'restaurant',
              description: r.description,
              universe: r.universe,
              cuisine: r.cuisine,
              image: r.logo || r.image || '/images/logos/default.png',
            });
          });

        loisirs
          .filter((l) => l.statut !== 'inactif' && matchesQuery(query, l.nom, l.universe, l.description))
          .forEach((l) => {
            searchResults.push({
              id: l.id,
              name: l.nom,
              type: 'loisir',
              description: l.description,
              universe: l.universe,
              image: l.logo || l.image || '/images/logos/default.png',
            });
          });

        const sorted = searchResults.sort((a, b) => {
          const aExact = a.name.toLowerCase() === query;
          const bExact = b.name.toLowerCase() === query;
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;
          return a.name.localeCompare(b.name);
        });

        setResults(sorted);
      } catch (error) {
        if (import.meta.env.DEV) console.error('Erreur recherche:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleResultClick = async (result: SearchResult) => {
    try {
      const path = `/${result.type}s/${result.id}`;
      await navigate(path);
      setSearchQuery('');
      setResults([]);
      return true;
    } catch {
      return false;
    }
  };

  return { searchQuery, setSearchQuery, results, isLoading, handleResultClick };
};
