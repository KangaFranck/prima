import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Stats from './Stats';

// Shops section showcasing featured stores
const Shops = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const categories = [
    {
      id: "mode",
      name: "Mode & Accessoires",
      image: "/images/mode-accessoires.jpg",
      description: "Découvrez les dernières tendances de la mode internationale et locale. Des marques prestigieuses aux créateurs émergents, trouvez votre style parmi notre sélection exclusive de vêtements, chaussures, sacs et accessoires.",
      brands: ["Zara", "H&M", "Celio", "Aldo"],
      color: "from-purple-600 to-pink-600"
    },
    {
      id: "resto",
      name: "Restauration",
      image: "/images/restauration.jpg",
      description: "Une expérience culinaire unique avec nos restaurants et cafés. De la cuisine traditionnelle aux saveurs internationales, savourez des plats délicieux dans une ambiance chaleureuse et conviviale.",
      brands: ["Starbucks", "Quick", "Subway", "Dipndip"],
      color: "from-orange-600 to-red-600"
    },
    {
      id: "beaute",
      name: "Beauté & Bien-être",
      image: "/images/beaute-bien-etre.jpg",
      description: "Prenez soin de vous dans nos espaces dédiés à la beauté et au bien-être. Cosmétiques, soins, parfums et services professionnels pour sublimer votre beauté naturelle.",
      brands: ["Sephora", "Marionnaud", "Yves Rocher", "L'Atelier du Chocolat"],
      color: "from-pink-600 to-rose-600"
    },
    {
      id: "tech",
      name: "Électronique",
      image: "/images/electronique.jpg",
      description: "Le meilleur de la technologie à portée de main. Découvrez les dernières innovations en matière d'électronique, smartphones, informatique et multimédia avec nos experts passionnés.",
      brands: ["Samsung", "Orange", "FNAC", "Cybertoys"],
      color: "from-blue-600 to-indigo-600"
    }
  ];

  return (
    <div className="py-24 bg-gray-50 perspective-1000">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-bold text-center text-black mb-6">
          Nos Catégories de Boutiques
        </h2>
        <p className="text-xl text-gray-600 text-center mb-20 max-w-3xl mx-auto">
          Explorez notre sélection unique de boutiques réparties en quatre univers distincts pour une expérience shopping incomparable
        </p>
        
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-4 relative">
          {categories.map((category) => (
            <Link
              to="/boutiques"
              key={category.id}
              className={`group relative overflow-hidden transition-all duration-500 ease-out transform-gpu
                before:absolute before:inset-0 before:p-[2px]
                before:bg-[linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888,#f09433)]
                before:bg-[length:200%_200%] before:[animation:gradient-rotate_3s_linear_infinite]
                ${hoveredCategory === category.id ? 
                  'z-10 scale-110 translate-y-[-20px] shadow-2xl before:[animation:gradient-rotate_1.5s_linear_infinite]' : 
                  hoveredCategory ? 
                    'scale-95 translate-y-[10px] opacity-50 blur-[1px]' : 
                    'scale-100 translate-y-0'
                }`}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div className="relative h-[400px] overflow-hidden bg-gray-900">
                <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-black transition-opacity duration-500
                  ${hoveredCategory === category.id ? 'opacity-40' : 'opacity-60'} z-10`}>
                </div>
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className={`w-full h-full object-cover transform transition-all duration-700
                    ${hoveredCategory === category.id ? 'scale-110' : 'scale-100'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 z-10"></div>
              </div>

              <div className="absolute inset-x-0 bottom-0 z-20 p-8">
                <h3 className={`text-3xl font-bold text-white mb-4 transition-transform duration-500
                  ${hoveredCategory === category.id ? 'scale-110 translate-y-[-10px]' : 'scale-100'}`}>
                  {category.name}
                </h3>
                <div className={`overflow-hidden transition-all duration-500 ${hoveredCategory === category.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-gray-200 text-base mb-6 leading-relaxed">
                    {category.description}
                  </p>
                  <div className="space-y-3">
                    <p className="text-white text-base font-semibold">Marques phares :</p>
                    <div className="flex flex-wrap gap-2">
                      {category.brands.map((brand) => (
                        <span 
                          key={brand}
                          className="text-sm bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-1.5"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 inline-flex items-center text-white text-base group-hover:underline">
                    <span>Découvrir</span>
                    <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              <div 
                className={`absolute inset-[2px] bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-10`}
              ></div>
            </Link>
          ))}
        </div>

        <div className="mt-24">
          <Stats />
        </div>
      </div>
    </div>
  );
};

export default Shops;