import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CategoryType } from '../types/shop.types';
import { useAdminStore } from '../store/adminStore';

interface ShopFiltersProps {
  selectedUniverse: CategoryType | "";
  onUniverseChange: (universe: CategoryType | "") => void;
}

const universeIcons: Record<CategoryType, string> = {
  'Mode': '👕',
  'Restaurant & FastFood': '🍽️',
  'Bien-être et Santé': '💆',
  'Sports et Loisirs': '⚽',
  'Enfant': '👶',
  'Déco maison et cadeau': '🏠',
  'Divers': '📦',
  'Électro et Tech': '📱',
  'Services': '💳',
  'Parfumerie': '💄'
};

const universeDescriptions: Record<CategoryType, string> = {
  'Mode': 'Des marques internationales et locales pour votre style',
  'Restaurant & FastFood': 'Une variété de saveurs pour tous les goûts',
  'Bien-être et Santé': 'Prenez soin de vous avec nos experts',
  'Sports et Loisirs': 'Équipements et vêtements pour tous les sports',
  'Enfant': 'Tout pour le bonheur de vos enfants',
  'Déco maison et cadeau': 'Embellissez votre intérieur',
  'Divers': 'Découvrez nos autres boutiques',
  'Électro et Tech': 'Les dernières innovations technologiques',
  'Services': 'Des services pratiques pour votre quotidien',
  'Parfumerie': 'Les plus grandes marques de beauté'
};

const ShopFilters: React.FC<ShopFiltersProps> = ({
  selectedUniverse,
  onUniverseChange,
}) => {
  const { boutiques } = useAdminStore();
  
  const universeStats = useMemo(() => {
    const stats = new Map<CategoryType, number>();
    
    boutiques.forEach(boutique => {
      if (boutique.statut === 'actif' && boutique.universe) {
        const count = stats.get(boutique.universe as CategoryType) || 0;
        stats.set(boutique.universe as CategoryType, count + 1);
      }
    });
    
    return Array.from(stats.entries()).map(([name, count]) => ({
      name,
      count,
      description: universeDescriptions[name],
      icon: universeIcons[name]
    }));
  }, [boutiques]);

  return (
    <section className="py-20 bg-[#E5DDD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-6">Nos Univers</h2>
          <p className="text-xl text-gray-600">
            Découvrez notre sélection de boutiques par catégorie
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {universeStats.map((universe, index) => (
            <motion.button
              key={universe.name}
              onClick={() => onUniverseChange(universe.name)}
              className={`group p-8 rounded-xl text-left transition-all duration-300 ${
                selectedUniverse === universe.name
                  ? 'bg-black text-white'
                  : 'bg-white hover:bg-black/5'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{universe.icon}</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{universe.name}</h3>
                  <p className={`text-sm mb-3 ${
                    selectedUniverse === universe.name
                      ? 'text-white/80'
                      : 'text-gray-600'
                  }`}>
                    {universe.description}
                  </p>
                  <div className={`text-sm ${
                    selectedUniverse === universe.name
                      ? 'text-white/80'
                      : 'text-gray-600'
                  }`}>
                    {universe.count} boutique{universe.count > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ShopFilters; 