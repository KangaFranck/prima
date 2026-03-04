import { UniverseDescription } from '../types/shop.types';
import { shops } from './shops';

// Fonction helper pour compter les boutiques par catégorie
const getShopCountByCategory = (categoryName: string): number => {
  return shops.filter(shop => shop.categories.includes(categoryName)).length;
};

export const universeDescriptions: UniverseDescription[] = [
  {
    name: "Mode",
    description: "Des marques internationales et locales pour votre style",
    count: getShopCountByCategory("Mode"),
    icon: "👕"
  },
  {
    name: "Restaurant & FastFood",
    description: "Une variété de saveurs pour tous les goûts",
    count: getShopCountByCategory("Restaurant & FastFood"),
    icon: "🍽️"
  },
  {
    name: "Bien-être et Santé",
    description: "Prenez soin de vous avec nos experts",
    count: getShopCountByCategory("Bien-être et Santé"),
    icon: "💆"
  },
  {
    name: "Sports et Loisirs",
    description: "Équipements et vêtements pour tous les sports",
    count: getShopCountByCategory("Sports et Loisirs"),
    icon: "⚽"
  },
  {
    name: "Enfant",
    description: "Tout pour le bonheur de vos enfants",
    count: getShopCountByCategory("Enfant"),
    icon: "👶"
  },
  {
    name: "Déco maison et cadeau",
    description: "Embellissez votre intérieur",
    count: getShopCountByCategory("Déco maison et cadeau"),
    icon: "🏠"
  },
  {
    name: "Électro et Tech",
    description: "Les dernières innovations technologiques",
    count: getShopCountByCategory("Électro et Tech"),
    icon: "📱"
  },
  {
    name: "Parfumerie",
    description: "Les plus grandes marques de beauté",
    count: getShopCountByCategory("Parfumerie"),
    icon: "💄"
  },
  {
    name: "Services",
    description: "Des services pratiques pour votre quotidien",
    count: getShopCountByCategory("Services"),
    icon: "💳"
  }
]; 