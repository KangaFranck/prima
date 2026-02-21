import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Coffee, Dumbbell, Calendar, Play, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useShopStore } from '../store/shopStore';
import { useRestaurantStore } from '../store/restaurantStore';
import { useLoisirStore } from '../store/loisirStore';
import Logo from '../components/Logo';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Importez vos vidéos et images ici
const mainVideo = '/videos/prima-main.mp4';
const video1 = '/videos/prima-1.mp4';
const video2 = '/videos/prima-2.mp4';
const video3 = '/videos/prima-3.mp4';

const universeBlocks = [
  {
    category: 'Shopping',
    title: 'Boutiques',
    description: 'Découvrez nos boutiques de mode et accessoires',
    image: '/images/sections/boutiques.jpg',
    link: '/boutiques'
  },
  {
    category: 'Gastronomie',
    title: 'Restaurants',
    description: 'Une expérience culinaire unique',
    image: '/images/sections/restaurants.jpg',
    link: '/restaurants'
  },
  {
    category: 'Lifestyle',
    title: 'Loisir',
    description: 'Votre espace bien-être et sport',
    image: '/images/sections/loisir.jpg',
    link: '/loisirs'
  }
];

interface CarouselItem {
  id: string;
  name: string;
  logo?: string;
  logoCarousel?: string;
  image?: string;
  type: 'boutique' | 'restaurant' | 'loisir';
}

export default function Home() {
  const [currentVideo, setCurrentVideo] = useState(mainVideo);
  
  // Utiliser les nouveaux stores
  const { shops, fetchShops } = useShopStore();
  const { restaurants, fetchRestaurants } = useRestaurantStore();
  const { loisirs, fetchLoisirs } = useLoisirStore();

  // Charger les données au montage du composant
  useEffect(() => {
    fetchShops();
    fetchRestaurants();
    fetchLoisirs();
  }, [fetchShops, fetchRestaurants, fetchLoisirs]);

  // Combine tous les commerces pour le carousel (logos carousel en priorité depuis la base)
  const allItems: CarouselItem[] = [
    ...shops.map((item) => ({ id: item.id, name: item.name, logo: item.logo, logoCarousel: item.logoCarousel, type: 'boutique' as const })),
    ...restaurants.map((item) => ({ id: item.id, name: item.name, logo: item.logo, logoCarousel: item.logoCarousel, image: item.image, type: 'restaurant' as const })),
    ...loisirs.map((item) => ({ id: item.id, name: item.name, logo: item.logo, logoCarousel: item.logoCarousel, image: item.image, type: 'loisir' as const }))
  ];

  return (
    <div className="min-h-screen">
      {/* Section 1: Video Background */}
      <section className="relative h-screen overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={currentVideo}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black/60">
          <div className="w-full h-full flex flex-col px-4 sm:px-6 md:px-8">
            {/* Présentation Prima avec Logo - Parfaitement centré */}
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="flex flex-col items-center justify-center w-full">
                {/* Logo Prima Center - Taille maximale et parfaitement centré */}
                <div className="mb-6 flex items-center justify-center w-full">
                  <Logo 
                    className="h-48 md:h-64 lg:h-80 xl:h-96 mx-auto" 
                    color="white"
                    variant="light"
                  />
                </div>
                <p className="text-[16px] md:text-[18px] lg:text-[20px] font-sofia font-thin text-white text-center tracking-wider leading-relaxed -mt-12 md:-mt-14 lg:-mt-16 xl:-mt-18">
                  Un espace unique où shopping, loisirs et gastronomie se rencontrent
                </p>
              </div>
            </div>

            {/* Mini vidéos en bas */}
            <div className="absolute bottom-0 left-0 right-0 pb-16">
              <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto px-4">
                {[
                  { src: video1, title: 'Découvrez Prima' },
                  { src: video2, title: 'Nos espaces' },
                  { src: video3, title: 'Événements' }
                ].map((video, index) => (
                  <div key={index} className="flex flex-col items-center opacity-100 md:opacity-0 md:hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => setCurrentVideo(video.src)}
                      className="relative w-full aspect-video overflow-hidden shadow-lg mb-3 group"
                    >
                      <video
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        src={video.src}
                        muted
                        loop
                        playsInline
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center p-2 mx-1">
                        <Play className="w-6 h-6 md:w-8 md:h-8 text-white opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </button>
                    <p className="text-white text-xs md:text-sm font-sofia font-light">{video.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Universes - Pleine largeur jusqu'aux bords */}
      <section className="py-20 bg-white w-full">
        <div className="w-full px-4 sm:px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-ogg font-bold mb-4 text-gray-800">NOS UNIVERS</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez plus de 70 commerçants, des marques internationales aux enseignes locales, le tout dans un cadre moderne et convivial, au cœur de la zone 4
            </p>
          </div>
          
          <div className="space-y-20">
            {universeBlocks.map((block, index) => (
              <div key={index} className={`flex flex-col lg:flex-row items-center gap-12 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}>
                {/* Image */}
                <div className="w-full lg:w-1/2">
                  <Link to={block.link} className="group relative block aspect-video lg:aspect-square overflow-hidden">
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300 z-10" />
                    <img
                      src={block.image}
                      alt={block.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className="w-8 h-8 text-white" />
                    </div>
                  </Link>
                </div>
                
                {/* Texte – style magazine / luxe (serif titre + sans corps + bouton noir) */}
                <div className="w-full lg:w-1/2 text-center lg:text-left">
                  <span className="text-sm font-sofia font-normal text-gray-500 uppercase tracking-widest">
                    {block.category}
                  </span>
                  <h2 className="text-4xl font-ogg font-bold text-gray-800 mt-2 mb-4 tracking-wide uppercase">
                    {block.title}
                  </h2>
                  <p className="text-base lg:text-lg font-sofia text-gray-600 leading-relaxed mb-6 max-w-xl">
                    {block.description}
                  </p>
                  <Link 
                    to={block.link}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-black text-white font-sofia font-medium text-sm tracking-wide rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Découvrir
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Carousel - LOGOS CENTRÉS SUR MOBILE */}
      <section className="py-12 relative overflow-hidden bg-[#E5DDD3] w-full">
        <div className="w-full px-4 sm:px-6 md:px-8 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-ogg mb-4 text-gray-800">DES COMMERCES OUVERTS 7J/7</h2>
          </div>
          
          <div>
            <Swiper
              modules={[Pagination, Autoplay]}
              loop={true}
              spaceBetween={16}
              slidesPerView={1}
              centeredSlides={true}
              breakpoints={{
                480: {
                  slidesPerView: 1.2,
                  spaceBetween: 20,
                  centeredSlides: true, // Centrer aussi sur mobile large
                },
                640: {
                  slidesPerView: 3, // Tablette: 3 logos
                  spaceBetween: 4,
                  centeredSlides: false, // Pas besoin de centrer sur tablette
                },
                768: {
                  slidesPerView: 4, // Desktop petit: 4 logos
                  spaceBetween: 6,
                  centeredSlides: false,
                },
                1024: {
                  slidesPerView: 5, // Desktop: 5 logos
                  spaceBetween: 8,
                  centeredSlides: false,
                },
                1280: {
                  slidesPerView: 6, // Desktop large: 6 logos
                  spaceBetween: 10,
                  centeredSlides: false,
                }
              }}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet custom-bullet !bg-gray-400',
                bulletActiveClass: 'swiper-pagination-bullet-active custom-bullet-active !bg-black !opacity-100'
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              className="w-full"
            >
              {allItems.map((item) => (
                <SwiperSlide key={item.id}>
                  <Link 
                    to={`/${item.type}s/${item.id}`}
                    className="block bg-transparent backdrop-blur-none overflow-hidden transition-all"
                  >
                    <div className="min-w-[140px] min-h-[120px] w-[140px] h-[120px] md:min-w-[160px] md:min-h-[100px] md:w-[160px] md:h-[100px] lg:min-w-[180px] lg:min-h-[120px] lg:w-[180px] lg:h-[120px] flex items-center justify-center p-2 mx-auto">
                      {(item.logoCarousel || item.logo || item.image) ? (
                        <img
                          src={item.logoCarousel || item.logo || item.image}
                          alt={item.name}
                          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-2">
                          {item.type === 'boutique' && <ShoppingBag className="w-14 h-14 text-gray-600" />}
                          {item.type === 'restaurant' && <Coffee className="w-14 h-14 text-gray-600" />}
                          {item.type === 'loisir' && <Dumbbell className="w-14 h-14 text-gray-600" />}
                        </div>
                      )}
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </div>
  );
}




