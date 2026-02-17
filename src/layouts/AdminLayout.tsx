import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, Coffee, Dumbbell, Calendar, LogOut, Settings, User, Utensils } from 'lucide-react';
import { useAuthStore } from '../store/pbAuthStore';
import { motion } from 'framer-motion';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout, user, canAccessSettings } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F5F5DC] flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#2C2C2C] text-white fixed h-full">
        <div className="p-6 border-b border-[#3D3D3D]">
          <h1 className="text-xl font-semibold text-[#F5F5DC]">Prima Center</h1>
          <p className="text-sm text-[#E8E8D5] mt-1">Interface d'administration</p>
        </div>
        <nav className="mt-6">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-[#F5F5DC] text-[#2C2C2C] font-medium'
                  : 'text-gray-300 hover:bg-[#3D3D3D] hover:text-[#F5F5DC]'
              }`}
          >
            <Home className="w-5 h-5 mr-3" />
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/boutiques"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-[#F5F5DC] text-[#2C2C2C] font-medium'
                  : 'text-gray-300 hover:bg-[#3D3D3D] hover:text-[#F5F5DC]'
              }`}
          >
            <ShoppingBag className="w-5 h-5 mr-3" />
            Boutiques
          </NavLink>
          <NavLink
            to="/admin/restaurants"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-[#F5F5DC] text-[#2C2C2C] font-medium'
                  : 'text-gray-300 hover:bg-[#3D3D3D] hover:text-[#F5F5DC]'
              }`}
          >
            <Coffee className="w-5 h-5 mr-3" />
            Restaurants
          </NavLink>
          <NavLink
            to="/admin/loisirs"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-[#F5F5DC] text-[#2C2C2C] font-medium'
                  : 'text-gray-300 hover:bg-[#3D3D3D] hover:text-[#F5F5DC]'
              }`}
          >
            <Utensils className="w-5 h-5 mr-3" />
            Loisirs
          </NavLink>
          <NavLink
            to="/admin/evenements"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-[#F5F5DC] text-[#2C2C2C] font-medium'
                  : 'text-gray-300 hover:bg-[#3D3D3D] hover:text-[#F5F5DC]'
              }`}
          >
            <Calendar className="w-5 h-5 mr-3" />
            Événements
          </NavLink>
          
          {/* Menu Paramètres - SEULEMENT pour communicationprimacenter@gmail.com */}
          {canAccessSettings() && (
            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-lg transition-colors duration-200 mt-6 border-t border-[#3D3D3D] ${
                  isActive 
                    ? 'bg-[#F5F5DC] text-[#2C2C2C] font-medium'
                    : 'text-gray-300 hover:bg-[#3D3D3D] hover:text-[#F5F5DC]'
                }`}
            >
              <Settings className="w-5 h-5 mr-3" />
              Paramètres
            </NavLink>
          )}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b border-[#E8E8D5] fixed w-[calc(100%-16rem)] z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-[#2C2C2C]">
                Tableau de bord
              </h2>
              <div className="flex items-center space-x-6">
                <motion.div 
                  className="flex items-center space-x-3 bg-[#F5F5DC] px-4 py-2 rounded-lg"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-10 h-10 bg-[#2C2C2C] rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-[#F5F5DC]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#2C2C2C]">
                      {user?.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {canAccessSettings() ? 'Super Administrateur' : 'Administrateur'}
                    </p>
                  </div>
                </motion.div>
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Déconnexion</span>
                </motion.button>
              </div>
            </div>
          </div>
        </header>
        <main className="pt-16">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
