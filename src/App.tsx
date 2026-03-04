/**
 * Application Prima Center
 * 
 * Structure principale de l'application avec :
 * - TopInfoBar : Barre d'information supérieure
 * - Navbar : Barre de navigation
 * - Routes : Système de routage pour les différentes pages
 * - Footer : Pied de page
 * 
 * Le composant gère l'agencement global et le routage de l'application.
 */

import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Boutiques from './pages/Boutiques';
import BoutiqueDetail from './pages/boutiques/[id]';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/restaurants/[id]';
import Loisirs from './pages/Loisirs';
import LoisirDetail from './pages/loisirs/[id]';
import Services from './pages/Services';
import ServiceDetail from './pages/services/[id]';
import EventDetail from './pages/evenements/[id]';
import ActusEvents from './pages/ActusEvents';
import ServicesInfo from './pages/ServicesInfo';
import APropos from './pages/APropos';
import { Menu, ShoppingBag, Phone, MapPin, Clock, ChevronRight, Facebook, Instagram, Twitter } from 'lucide-react';
import Navbar from './components/Navbar';
import TopInfoBar from './components/TopInfoBar';
import Hero from './components/Hero';
import Features from './components/Features';
import Shops from './components/Shops';
import Footer from './components/Footer';
import { Boutiques as AdminBoutiques } from './admin/pages/Boutiques';
import { Restaurants as AdminRestaurants } from './admin/pages/Restaurants';
import { FitnessPage } from './admin/pages/Fitness';
import { Evenements } from './admin/pages/Evenements';
import { Dashboard } from './admin/pages/Dashboard';
import { UserSettings as Settings } from './admin/pages/Settings';
import { AdminLayout } from './layouts/AdminLayout';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { ProtectedSettingsRoute } from './components/ProtectedSettingsRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ScrollToTop from './components/ScrollToTop';
import { Loisirs as AdminLoisirs } from './admin/pages/Loisirs';
import { Services as AdminServices } from './admin/pages/Services';
import { useAuthStore } from './store/pbAuthStore';

const queryClient = new QueryClient();

// Layout pour les pages publiques
const PublicLayout = () => {
  const [isTopInfoBarVisible, setIsTopInfoBarVisible] = React.useState(true);

  return (
    <div className="min-h-screen bg-white w-full max-w-full min-w-0">
      <TopInfoBar isVisible={isTopInfoBarVisible} onClose={() => setIsTopInfoBarVisible(false)} />
      <Navbar />
      <div className="pt-[var(--navbar-height)] w-full max-w-full min-w-0 overflow-x-hidden">
        <Routes>
          <Route index element={<Home />} />
          <Route path="boutiques" element={<Boutiques />} />
          <Route path="boutiques/:id" element={<BoutiqueDetail />} />
          <Route path="restaurants" element={<Restaurants />} />
          <Route path="restaurants/:id" element={<RestaurantDetail />} />
          <Route path="loisirs" element={<Loisirs />} />
          <Route path="loisirs/:id" element={<LoisirDetail />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:id" element={<ServiceDetail />} />
          <Route path="actualites" element={<ActusEvents />} />
          <Route path="contact" element={<ServicesInfo />} />
          <Route path="a-propos" element={<APropos />} />
          <Route path="evenements" element={<ActusEvents />} />
          <Route path="evenements/:id" element={<EventDetail />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

// Main App component that serves as the root of our application
export default function App() {
  const { checkAuth } = useAuthStore();

  // Vérifier l'authentification au chargement de l'application
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <ScrollToTop />
      <QueryClientProvider client={queryClient}>
        <Routes>
          {/* Routes publiques */}
          <Route path="/*" element={<PublicLayout />} />
          <Route path="/login" element={<Login />} />

          {/* Routes d'administration protégées */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="boutiques" element={<AdminBoutiques />} />
            <Route path="restaurants" element={<AdminRestaurants />} />
            <Route path="loisirs" element={<AdminLoisirs />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="evenements" element={<Evenements />} />
            <Route 
              path="settings" 
              element={
                <ProtectedSettingsRoute>
                  <Settings />
                </ProtectedSettingsRoute>
              } 
            />
          </Route>
        </Routes>
      </QueryClientProvider>
    </>
  );
}
