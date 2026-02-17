import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pb, getFileUrl } from '../services/pbClient';

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

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      setIsLoading(true);
      const query = searchQuery.toLowerCase().trim();

      console.log('🔍 Recherche pour:', query);

      if (query.length < 2) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      try {
        const searchResults: SearchResult[] = [];

        // Recherche dans les boutiques
        try {
          console.log('🔍 Recherche dans les boutiques...');
          
          const allBoutiques = await pb.collection('boutiques').getFullList({
            sort: 'nom'
          });
          
          const boutiques = allBoutiques.filter(boutique => {
            const isActive = boutique.statut !== 'inactif';
            const matchesQuery = 
              boutique.nom?.toLowerCase().includes(query) ||
              boutique.universe?.toLowerCase().includes(query) ||
              boutique.description?.toLowerCase().includes(query);
            
            return isActive && matchesQuery;
          });
          
          console.log('✅ Boutiques trouvées:', boutiques.length);

          boutiques.forEach(boutique => {
            // Utiliser le logo au lieu de l'image
            const logoUrl = boutique.logo ? getFileUrl(boutique, boutique.logo) : null;
            
            console.log('🔍 Boutique:', {
              nom: boutique.nom,
              logo: boutique.logo,
              logoUrl: logoUrl,
              hasLogo: !!boutique.logo
            });
            
            searchResults.push({
              id: boutique.id,
              name: boutique.nom,
              type: 'boutique',
              description: boutique.description,
              universe: boutique.universe,
              image: logoUrl || '/images/logos/default.png'
            });
          });
        } catch (error) {
          console.error('❌ Erreur lors de la recherche dans les boutiques:', error);
        }

        // Recherche dans les restaurants
        try {
          console.log('🔍 Recherche dans les restaurants...');
          
          const allRestaurants = await pb.collection('restaurants').getFullList({
            sort: 'nom'
          });
          
          const restaurants = allRestaurants.filter(restaurant => {
            const isActive = restaurant.statut !== 'inactif';
            const matchesQuery = 
              restaurant.nom?.toLowerCase().includes(query) ||
              restaurant.universe?.toLowerCase().includes(query) ||
              restaurant.description?.toLowerCase().includes(query);
            
            return isActive && matchesQuery;
          });
          
          console.log('✅ Restaurants trouvés:', restaurants.length);

          restaurants.forEach(restaurant => {
            // Utiliser le logo au lieu de l'image
            const logoUrl = restaurant.logo ? getFileUrl(restaurant, restaurant.logo) : null;
            
            console.log('🔍 Restaurant:', {
              nom: restaurant.nom,
              logo: restaurant.logo,
              logoUrl: logoUrl,
              hasLogo: !!restaurant.logo
            });
            
            searchResults.push({
              id: restaurant.id,
              name: restaurant.nom,
              type: 'restaurant',
              description: restaurant.description,
              universe: restaurant.universe,
              image: logoUrl || '/images/logos/default.png'
            });
          });
        } catch (error) {
          console.error('❌ Erreur lors de la recherche dans les restaurants:', error);
        }

        // Recherche dans les loisirs
        try {
          console.log('🔍 Recherche dans les loisirs...');
          
          const allLoisirs = await pb.collection('loisirs').getFullList({
            sort: 'nom'
          });
          
          const loisirs = allLoisirs.filter(loisir => {
            const isActive = loisir.statut !== 'inactif';
            const matchesQuery = 
              loisir.nom?.toLowerCase().includes(query) ||
              loisir.universe?.toLowerCase().includes(query) ||
              loisir.description?.toLowerCase().includes(query);
            
            return isActive && matchesQuery;
          });
          
          console.log('✅ Loisirs trouvés:', loisirs.length);

          loisirs.forEach(loisir => {
            // Utiliser le logo au lieu de l'image
            const logoUrl = loisir.logo ? getFileUrl(loisir, loisir.logo) : null;
            
            console.log('🔍 Loisir:', {
              nom: loisir.nom,
              logo: loisir.logo,
              logoUrl: logoUrl,
              hasLogo: !!loisir.logo
            });
            
            searchResults.push({
              id: loisir.id,
              name: loisir.nom,
              type: 'loisir',
              description: loisir.description,
              universe: loisir.universe,
              image: logoUrl || '/images/logos/default.png'
            });
          });
        } catch (error) {
          console.error('❌ Erreur lors de la recherche dans les loisirs:', error);
        }

        console.log('🎯 Total des résultats trouvés:', searchResults.length);
        console.log('📋 Résultats finaux:', searchResults.map(r => ({ 
          name: r.name, 
          type: r.type, 
          image: r.image,
          hasImage: !!r.image 
        })));

        // Trier les résultats par pertinence (nom exact en premier)
        const sortedResults = searchResults.sort((a, b) => {
          const aExactMatch = a.name.toLowerCase() === query;
          const bExactMatch = b.name.toLowerCase() === query;
          
          if (aExactMatch && !bExactMatch) return -1;
          if (!aExactMatch && bExactMatch) return 1;
          
          // Puis par ordre alphabétique
          return a.name.localeCompare(b.name);
        });

        setResults(sortedResults);
      } catch (error) {
        console.error('❌ Erreur générale lors de la recherche:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleResultClick = async (result: SearchResult) => {
    try {
      // Navigation selon le type de résultat
      const path = `/${result.type}s/${result.id}`;
      console.log('🧭 Navigation vers:', path);
      await navigate(path);
      setSearchQuery('');
      setResults([]);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la navigation:', error);
      return false;
    }
  };

  return { 
    searchQuery, 
    setSearchQuery, 
    results, 
    isLoading, 
    handleResultClick 
  };
}; 