import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

interface ShopCardProps {
  shop: {
    id: string;
    name: string;
    categories: string[];
    slug: string;
  };
}

const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -5,
        backgroundColor: 'rgba(229, 221, 211, 0.1)'
      }}
      transition={{ duration: 0.2 }}
      className="p-6 bg-white hover:bg-[#E5DDD3]/5 transition-colors rounded-lg cursor-pointer"
      onClick={() => router.push(`/boutiques/${shop.slug}`)}
    >
      <h3 className="text-xl font-medium mb-3 text-gray-900">{shop.name}</h3>
      <div className="flex flex-wrap gap-2">
        {shop.categories.map((category, index) => (
          <span
            key={index}
            className="px-4 py-1.5 text-sm bg-[#E5DDD3] rounded-full text-gray-700"
          >
            {category}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default ShopCard; 