import { Shop, CategoryType } from '../types/shop.types';

// Constantes pour les catégories
export const CATEGORIES: CategoryType[] = [
  'Mode',
  'Restaurant & FastFood',
  'Bien-être et Santé',
  'Sports et Loisirs',
  'Enfant',
  'Déco maison et cadeau',
  'Électro et Tech',
  'Services',
  'Parfumerie'
];

// Fonction helper pour créer une boutique avec des valeurs par défaut
const createShop = (
  id: string,
  name: string,
  categories: CategoryType[],
  options: Partial<Shop> = {}
): Shop => ({
  id,
  name,
  logo: `/images/logos/${id}.png`,
  categories,
  slug: id,
  ...options
});

// Boutiques organisées par catégorie
const modeShops: Shop[] = [
  createShop('aldo', 'ALDO', ['Mode']),
  createShop('aiwatch', 'Aï Watch', ['Mode']),
  createShop('celio', 'Celio', ['Mode']),
  createShop('chevignon-tbs', 'Chevignon & TBS', ['Mode']),
  createShop('ethnyka', 'ETHNYKA', ['Mode']),
  createShop('kadel', 'KADEL', ['Mode']),
  createShop('lancaster', 'LANCASTER', ['Mode']),
  createShop('le-creation', 'LE CREATION', ['Mode']),
  createShop('maestro', 'MAESTRO', ['Mode']),
  createShop('mosaic', 'MOSAIC', ['Mode']),
  createShop('riscles', 'RISCLES', ['Mode'])
];

const restaurantShops: Shop[] = [
  createShop('360-snack', '360 SNACK', ['Restaurant & FastFood']),
  createShop('atelier-gourmand', 'ATELIER GOURMAND', ['Restaurant & FastFood']),
  createShop('beyti', 'BEYTI', ['Restaurant & FastFood']),
  createShop('dipndip', 'DIPNDIP', ['Restaurant & FastFood']),
  createShop('latelier-du-chocolat', "L'ATELIER DU CHOCOLAT", ['Restaurant & FastFood']),
  createShop('pistache-chocolat', 'PISTACHE ET CHOCOLAT', ['Restaurant & FastFood']),
  createShop('poz-cafe', "POZ'CAFÉ", ['Restaurant & FastFood']),
  createShop('smooy', 'SMOOY', ['Restaurant & FastFood'])
];

const bienEtreShops: Shop[] = [
  createShop('ideal-optic', 'IDEAL OPTIC', ['Bien-être et Santé']),
  createShop('lessentiel', "L'ESSENTIEL", ['Bien-être et Santé']),
  createShop('privilege', 'PRIVILEGE COIFFURE', ['Bien-être et Santé']),
  createShop('veda', 'VEDA', ['Bien-être et Santé'])
];

const sportsLoisirsShops: Shop[] = [
  createShop('bodymax', 'BODYMAX', ['Sports et Loisirs']),
  createShop('city-sport', 'CITY SPORT', ['Sports et Loisirs']),
  createShop('librairie-de-france', 'LIBRAIRIE DE FRANCE', ['Sports et Loisirs']),
  createShop('majestic', 'MAJESTIC', ['Sports et Loisirs']),
  createShop('vr-games', 'VR GAMES', ['Sports et Loisirs']),
  createShop('party-shop', 'PARTY SHOP ACCESSOIRES', ['Sports et Loisirs']),
  createShop('ruthys-plus', "PRODUITS RUTHY'S PLUS", ['Sports et Loisirs'])
];

const enfantShops: Shop[] = [
  createShop('cybertoys', 'CYBERTOYS', ['Enfant']),
  createShop('my-baby', 'MY BABY', ['Enfant']),
  createShop('original-marines', 'ORIGINAL MARINES', ['Enfant'])
];

const decoMaisonShops: Shop[] = [
  createShop('distrimax', 'DISTRIMAX', ['Déco maison et cadeau']),
  createShop('neyala', 'NEYALA', ['Déco maison et cadeau'])
];

const electroTechShops: Shop[] = [
  createShop('planet-video', 'PLANET VIDEO', ['Électro et Tech']),
  createShop('samsung', 'SAMSUNG', ['Électro et Tech']),
  createShop('geek-zone', 'GEEK ZONE', ['Électro et Tech'])
];

const servicesShops: Shop[] = [
  createShop('afriland', 'AFRILAND FIRST BANK', ['Services']),
  createShop('la-poste', 'LA POSTE', ['Services']),
  createShop('mondial-voyage', 'MONDIAL VOYAGE', ['Services']),
  createShop('pressing-eco', 'PRESSING ECO', ['Services']),
  createShop('stanbic-bank', 'STANBIC BANK', ['Services']),
  createShop('dinapoli', 'DINAPOLI', ['Services'])
];

const parfumerieShops: Shop[] = [
  createShop('nuages-dsens', "NUAGES D'SENS", ['Parfumerie']),
  createShop('olfacto', 'OLFACTO', ['Parfumerie']),
  createShop('zeina', 'PARFUMERIE ZEINA', ['Parfumerie'])
];

// Export toutes les boutiques
export const shops: Shop[] = [
  ...modeShops,
  ...restaurantShops,
  ...bienEtreShops,
  ...sportsLoisirsShops,
  ...enfantShops,
  ...decoMaisonShops,
  ...electroTechShops,
  ...servicesShops,
  ...parfumerieShops
]; 