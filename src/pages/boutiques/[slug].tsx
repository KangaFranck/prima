import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { shops, Shop } from '../../data/shops';

const ShopPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  // Trouver la boutique correspondante
  const shopDetails = shops.find(shop => shop.slug === slug);

  if (!shopDetails) {
    if (!router.isReady) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl text-gray-600"
          >
            Chargement...
          </motion.div>
        </div>
      );
    }

    // Rediriger vers la page des boutiques si la boutique n'est pas trouvée
    router.push('/boutiques');
    return null;
  }

  return (
    <>
      <Head>
        <title>{shopDetails.name} - Prima Center</title>
      </Head>
      <div className="min-h-screen bg-white">
        {/* Hero Section avec Logo */}
        <div className="relative h-[300px] bg-[#E5DDD3]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-64 h-64">
              <Image
                src={shopDetails.logo}
                alt={shopDetails.name}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Informations de la boutique */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-8"
          >
            <div className="flex flex-col md:flex-row gap-8">
              {/* Informations principales */}
              <div className="flex-1">
                <div className="flex flex-wrap gap-3 mb-4">
                  {shopDetails.categories.map((category, index) => (
                    <span
                      key={index}
                      className="px-4 py-1.5 bg-[#E5DDD3] rounded-full text-sm"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <h1 className="text-4xl font-bold mb-6">{shopDetails.name}</h1>
                {shopDetails.description && (
                  <div className="text-gray-600 text-lg whitespace-pre-line">
                    {shopDetails.description}
                  </div>
                )}
              </div>

              {/* Horaires et Contact */}
              {(shopDetails.openingHours || shopDetails.phone) && (
                <div className="md:w-80 shrink-0">
                  <div className="bg-gray-50 rounded-lg p-6">
                    {shopDetails.openingHours && (
                      <>
                        <h3 className="font-semibold text-lg mb-4">Horaires d'ouverture</h3>
                        <div className="space-y-2">
                          {shopDetails.openingHours.map((schedule, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-gray-600">{schedule.day}</span>
                              <span className="font-medium">{schedule.hours}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {shopDetails.phone && (
                      <div className="mt-6">
                        <h3 className="font-semibold text-lg mb-2">Contact</h3>
                        <a
                          href={`tel:${shopDetails.phone}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {shopDetails.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Section Suggestions */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-8">Vous aimerez peut-être</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shops
              .filter(shop => 
                shop.slug !== slug && 
                shop.categories.some(cat => shopDetails.categories.includes(cat))
              )
              .slice(0, 3)
              .map(shop => (
                <motion.div
                  key={shop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => router.push(`/boutiques/${shop.slug}`)}
                >
                  <h3 className="text-xl font-medium mb-3">{shop.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {shop.categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm bg-[#E5DDD3] rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopPage; 