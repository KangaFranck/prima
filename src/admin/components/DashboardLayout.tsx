import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, Coffee, Dumbbell, Calendar } from 'lucide-react';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F5F5DC] flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#2C2C2C] text-white">
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
              }`
            }
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
              }`
            }
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
              }`
            }
          >
            <Coffee className="w-5 h-5 mr-3" />
            Restaurants
          </NavLink>
          <NavLink
            to="/admin/fitness"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-[#F5F5DC] text-[#2C2C2C] font-medium'
                  : 'text-gray-300 hover:bg-[#3D3D3D] hover:text-[#F5F5DC]'
              }`
            }
          >
            <Dumbbell className="w-5 h-5 mr-3" />
            Fitness
          </NavLink>
          <NavLink
            to="/admin/evenements"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-[#F5F5DC] text-[#2C2C2C] font-medium'
                  : 'text-gray-300 hover:bg-[#3D3D3D] hover:text-[#F5F5DC]'
              }`
            }
          >
            <Calendar className="w-5 h-5 mr-3" />
            Événements
          </NavLink>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <header className="bg-white shadow-sm border-b border-[#E8E8D5]">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-[#2C2C2C]">
                Tableau de bord
              </h2>
              <span className="text-sm text-[#2C2C2C] opacity-75">
                Prima Center • Administration
              </span>
            </div>
          </div>
        </header>
        <main className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-[#E8E8D5]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}; 