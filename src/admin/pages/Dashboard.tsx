import { Link } from 'react-router-dom';
import { ShoppingBag, Coffee, Utensils, Calendar, TrendingUp, Users, Activity, RefreshCw } from 'lucide-react';
import { usePbAdminStore } from '../../store/pbAdminStore';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const Dashboard = () => {
  const { 
    boutiques, 
    restaurants, 
    loisirs, 
    evenements, 
    fetchBoutiques, 
    fetchRestaurants, 
    fetchLoisirs, 
    fetchEvenements,
    loading,
    error
  } = usePbAdminStore();

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Chargement initial des données
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log(' Chargement des données du dashboard...');
        await Promise.all([
          fetchBoutiques(),
          fetchRestaurants(),
          fetchLoisirs(),
          fetchEvenements()
        ]);
        console.log(' Données du dashboard chargées avec succès');
      } catch (error) {
        console.error(' Erreur lors du chargement des données:', error);
      }
    };
    
    loadData();
  }, [fetchBoutiques, fetchRestaurants, fetchLoisirs, fetchEvenements]);

  // Fonction de rafraîchissement manuel
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchBoutiques(),
        fetchRestaurants(),
        fetchLoisirs(),
        fetchEvenements()
      ]);
      console.log(' Dashboard rafraîchi avec succès');
    } catch (error) {
      console.error(' Erreur lors du rafraîchissement:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calcul des statistiques - ÉVÉNEMENTS EXCLUS DU TOTAL DES COMMERCES
  const totalCommerces = boutiques.length + restaurants.length + loisirs.length; // Seulement les commerces
  const totalEntities = totalCommerces + evenements.length; // Total général (commerces + événements)
  const activeEntities = [...boutiques, ...restaurants, ...loisirs].filter(entity => entity.statut === 'actif').length;
  const inactiveEntities = [...boutiques, ...restaurants, ...loisirs].filter(entity => entity.statut === 'inactif').length;

  const stats = [
    {
      title: 'Boutiques',
      count: boutiques.length,
      active: boutiques.filter(b => b.statut === 'actif').length,
      inactive: boutiques.filter(b => b.statut === 'inactif').length,
      description: 'Gérer vos boutiques',
      icon: ShoppingBag,
      path: '/admin/boutiques',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      iconBg: 'bg-blue-500'
    },
    {
      title: 'Restaurants',
      count: restaurants.length,
      active: restaurants.filter(r => r.statut === 'actif').length,
      inactive: restaurants.filter(r => r.statut === 'inactif').length,
      description: 'Gérer vos restaurants',
      icon: Coffee,
      path: '/admin/restaurants',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      iconBg: 'bg-green-500'
    },
    {
      title: 'Loisirs',
      count: loisirs.length,
      active: loisirs.filter(l => l.statut === 'actif').length,
      inactive: loisirs.filter(l => l.statut === 'inactif').length,
      description: 'Gérer vos loisirs',
      icon: Utensils,
      path: '/admin/loisirs',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      iconBg: 'bg-purple-500'
    },
    {
      title: 'Événements',
      count: evenements.length,
      active: evenements.length, // Les événements n'ont pas de statut actif/inactif
      inactive: 0,
      description: 'Gérer vos événements',
      icon: Calendar,
      path: '/admin/evenements',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100',
      iconBg: 'bg-amber-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-50 p-3 sm:p-4 md:p-6">
      {/* Header élégant avec bouton de rafraîchissement */}
      <div className="mb-6 sm:mb-8 md:mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3 sm:mb-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-800">
              Tableau de bord
            </h1>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || loading}
              className="p-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200/50 hover:bg-amber-50 transition-all duration-300 disabled:opacity-50"
              title="Rafraîchir les données"
            >
              <RefreshCw className={`w-5 h-5 text-amber-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base md:text-xl text-stone-600 max-w-2xl mx-auto px-2">
            Vue d'ensemble de votre centre commercial Prima Center
          </p>
          {loading && (
            <p className="text-amber-600 mt-2 text-sm">Chargement des données...</p>
          )}
          {error && (
            <p className="text-red-600 mt-2 text-sm">Erreur: {error}</p>
          )}
        </motion.div>
      </div>

      {/* Statistiques globales - CORRECTION : ÉVÉNEMENTS EXCLUS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-12"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-amber-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-stone-600 mb-1">Total des commerces</p>
              <p className="text-2xl sm:text-3xl font-bold text-stone-800">{totalCommerces}</p>
              <p className="text-xs text-stone-500">Boutiques + Restaurants + Loisirs</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-600 mb-1">Commerces actifs</p>
              <p className="text-3xl font-bold text-green-600">{activeEntities}</p>
              <p className="text-xs text-stone-500">En activité</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-amber-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-stone-600 mb-1">Commerces inactifs</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-600">{inactiveEntities}</p>
              <p className="text-xs text-stone-500">Hors service</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cartes des catégories avec vraies données */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group"
          >
            <Link to={stat.path} className="block">
              <div className={`${stat.bgColor} rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 group-hover:border-amber-300/50 transform group-hover:-translate-y-2`}>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ${stat.iconBg} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-800 mb-1">{stat.count}</p>
                    <p className="text-xs sm:text-sm text-stone-600">éléments</p>
                  </div>
                </div>
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-stone-800 mb-2 group-hover:text-amber-700 transition-colors">
                    {stat.title}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed mb-3">
                    {stat.description}
                  </p>
                  
                  {/* Détails des statuts - seulement pour les commerces */}
                  {stat.title !== 'Événements' && (
                    <div className="flex justify-between text-xs">
                      <span className="text-green-600 font-semibold">
                         {stat.active} actif{stat.active > 1 ? 's' : ''}
                      </span>
                      {stat.inactive > 0 && (
                        <span className="text-red-600 font-semibold">
                           {stat.inactive} inactif{stat.inactive > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-stone-700 group-hover:text-amber-700 transition-colors">
                    Voir détails
                  </span>
                  <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                    <div className="w-2 h-2 bg-stone-400 group-hover:bg-amber-600 rounded-full transition-colors"></div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Message de bienvenue si aucune donnée */}
      {totalCommerces === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-12 h-12 text-amber-600" />
          </div>
          <h3 className="text-2xl font-bold text-stone-800 mb-4">Bienvenue sur votre tableau de bord</h3>
          <p className="text-stone-600 mb-8 max-w-md mx-auto">
            Commencez par ajouter vos premiers commerces, restaurants, loisirs et événements pour voir vos statistiques ici.
          </p>
        </motion.div>
      )}
    </div>
  );
};
