import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, Coffee, Dumbbell, Calendar, LogOut, Settings, User, Utensils, Menu, X, Wrench, Mail, Image } from 'lucide-react';
import { useAuthStore } from '../store/pbAuthStore';
import { motion } from 'framer-motion';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout, user, canAccessSettings } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#F5F5DC] flex">
      {/* Overlay mobile quand la sidebar est ouverte */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Fermer le menu"
        onClick={closeSidebar}
        onKeyDown={(e) => e.key === 'Escape' && closeSidebar()}
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
      {/* Sidebar : masquée à gauche sur mobile/tablette, visible sur lg+ */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#2C2C2C] text-white transform transition-transform duration-200 ease-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#3D3D3D] lg:p-6">
          <div>
            <h1 className="text-lg font-semibold text-[#F5F5DC] lg:text-xl">PRIMA CENTER</h1>
            <p className="text-xs text-[#E8E8D5] mt-0.5 lg:text-sm lg:mt-1">Interface d'administration</p>
          </div>
          <button
            type="button"
            onClick={closeSidebar}
            className="p-2 rounded-lg text-[#E8E8D5] hover:bg-[#3D3D3D] lg:hidden"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="mt-4 lg:mt-6 overflow-y-auto max-h-[calc(100vh-120px)]">
          <NavLink
            to="/admin/home-images"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 text-base lg:px-6 lg:py-3 lg:text-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-[#F5F5DC] text-[#2C2C2C] font-medium'
                  : 'text-gray-300 hover:bg-[#3D3D3D] hover:text-[#F5F5DC]'
              }`}
          >
            <Image className="w-5 h-5 mr-3 shrink-0" />
            Images accueil
          </NavLink>
          <NavLink
            to="/admin"
            end
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 text-base lg:px-6 lg:py-3 lg:text-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-[#F5F5DC] text-[#2C2C2C] font-medium'
                  : 'text-gray-300 hover:bg-[#3D3D3D] hover:text-[#F5F5DC]'
              }`}
          >
            <Home className="w-5 h-5 mr-3 shrink-0" />
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/boutiques"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 text-base lg:px-6 lg:py-3 lg:text-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-[#F5F5DC] text-[#2C2C2C] font-medium'
                  : 'text-gray-300 hover:bg-[#3D3D3D] hover:text-[#F5F5DC]'
              }`}
          >
            <ShoppingBag className="w-5 h-5 mr-3 shrink-0" />
            Boutiques
          </NavLink>
          <NavLink
            to="/admin/restaurants"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 text-base lg:px-6 lg:py-3 lg:text-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-[#F5F5DC] text-[#2C2C2C] font-medium'
                  : 'text-gray-300 hover:bg-[#3D3D3D] hover:text-[#F5F5DC]'
              }`}
          >
            <Coffee className="w-5 h-5 mr-3 shrink-0" />
            Restaurants
          </NavLink>
          <NavLink
            to="/admin/loisirs"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 text-base lg:px-6 lg:py-3 lg:text-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-[#F5F5DC] text-[#2C2C2C] font-medium'
                  : 'text-gray-300 hover:bg-[#3D3D3D] hover:text-[#F5F5DC]'
              }`}
          >
            <Utensils className="w-5 h-5 mr-3 shrink-0" />
            Loisirs
          </NavLink>
          <NavLink
            to="/admin/services"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 text-base lg:px-6 lg:py-3 lg:text-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-[#F5F5DC] text-[#2C2C2C] font-medium'
                  : 'text-gray-300 hover:bg-[#3D3D3D] hover:text-[#F5F5DC]'
              }`}
          >
            <Wrench className="w-5 h-5 mr-3 shrink-0" />
            Services
          </NavLink>
          <NavLink
            to="/admin/evenements"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 text-base lg:px-6 lg:py-3 lg:text-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-[#F5F5DC] text-[#2C2C2C] font-medium'
                  : 'text-gray-300 hover:bg-[#3D3D3D] hover:text-[#F5F5DC]'
              }`}
          >
            <Calendar className="w-5 h-5 mr-3 shrink-0" />
            Événements
          </NavLink>
          <NavLink
            to="/admin/newsletter"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 text-base lg:px-6 lg:py-3 lg:text-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-[#F5F5DC] text-[#2C2C2C] font-medium'
                  : 'text-gray-300 hover:bg-[#3D3D3D] hover:text-[#F5F5DC]'
              }`}
          >
            <Mail className="w-5 h-5 mr-3 shrink-0" />
            Newsletter
          </NavLink>
          {canAccessSettings() && (
            <NavLink
              to="/admin/settings"
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 text-base lg:px-6 lg:py-3 lg:text-lg transition-colors duration-200 mt-4 pt-4 border-t border-[#3D3D3D] ${
                  isActive 
                    ? 'bg-[#F5F5DC] text-[#2C2C2C] font-medium'
                    : 'text-gray-300 hover:bg-[#3D3D3D] hover:text-[#F5F5DC]'
                }`}
            >
              <Settings className="w-5 h-5 mr-3 shrink-0" />
              Paramètres
            </NavLink>
          )}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 lg:ml-64">
        <header className="bg-white shadow-sm border-b border-[#E8E8D5] fixed left-0 right-0 lg:left-64 z-30 lg:w-[calc(100%-16rem)]">
          <div className="px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-lg text-[#2C2C2C] hover:bg-[#F5F5DC] lg:hidden shrink-0"
                  aria-label="Ouvrir le menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <h2 className="text-base sm:text-lg lg:text-xl font-medium text-[#2C2C2C] truncate">
                  Tableau de bord
                </h2>
              </div>
              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                <motion.div 
                  className="hidden sm:flex items-center space-x-3 bg-[#F5F5DC] px-3 py-2 rounded-lg"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#2C2C2C] rounded-full flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 lg:w-6 lg:h-6 text-[#F5F5DC]" />
                  </div>
                  <div className="min-w-0 hidden md:block">
                    <p className="text-xs lg:text-sm font-medium text-[#2C2C2C] truncate max-w-[140px] lg:max-w-none">
                      {user?.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {canAccessSettings() ? 'Super Admin' : 'Admin'}
                    </p>
                  </div>
                </motion.div>
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center justify-center sm:space-x-2 p-2 sm:px-4 sm:py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium hidden sm:inline">Déconnexion</span>
                </motion.button>
              </div>
            </div>
          </div>
        </header>
        <main className="pt-14 sm:pt-16">
          <div className="p-3 sm:p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
