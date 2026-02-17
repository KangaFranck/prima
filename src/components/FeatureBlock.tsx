import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const FeatureBlock = () => {
  return (
    <Link 
      to="/boutiques" 
      className="block bg-[#FFFEF2] p-8 hover:bg-[#F5F4E8] transition-colors cursor-pointer"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">
          <ShoppingBag size={32} />
        </div>
        <h3 className="text-xl font-bold mb-2">Plus de 100 Boutiques</h3>
        <p className="text-gray-600">
          Une sélection variée de marques locales et internationales
        </p>
      </div>
    </Link>
  );
};

export default FeatureBlock; 