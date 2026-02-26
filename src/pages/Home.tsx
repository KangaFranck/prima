import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Coffee, Dumbbell, Calendar, Play, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useShopStore } from '../store/shopStore';
import { useRestaurantStore } from '../store/restaurantStore';
import { useLoisirStore } from '../store/loisirStore';
import { getInstagramThumbnail } from '../services/apiClient';
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

// Section Instagram : publications du compte https://www.instagram.com/primacenter_marcory
// Pour afficher les vrais posts : sur Instagram, ouvrez chaque publication → ⋮ → « Copier le lien », puis collez l'URL ci‑dessous.
// La miniature (cover) est chargée automatiquement via l'API. Les 5 premières URLs sont affichées.
const INSTAGRAM_HANDLE = 'primacenter_marcory';
const INSTAGRAM_URL = 'https://www.instagram.com/primacenter_marcory';
const instagramPosts: { imageUrl: string; postUrl: string }[] = [
  { imageUrl: '', postUrl: 'https://www.instagram.com/reel/DU55PM2CZAG/' },
  { imageUrl: '', postUrl: INSTAGRAM_URL },
  { imageUrl: '', postUrl: INSTAGRAM_URL },
  { imageUrl: '', postUrl: INSTAGRAM_URL },
  { imageUrl: '', postUrl: INSTAGRAM_URL },
];

/** Retourne l'URL d'embed Instagram pour un post (ex: /p/CODE/ ou /reel/CODE/) */
function getInstagramEmbedUrl(postUrl: string): string | null {
  const match = postUrl.match(/instagram\.com\/(p|reel)\/([^/?]+)/i);
  if (!match) return null;
  return `https://www.instagram.com/${match[1]}/${match[2]}/embed/`;
}

interface CarouselItem {
  id: string;
  name: string;
  logo?: string;
  image?: string;
  type: 'boutique' | 'restaurant' | 'loisir';
}

export default function Home() {
  const [currentVideo, setCurrentVideo] = useState(mainVideo);
  const [instagramModalPost, setInstagramModalPost] = useState<string | null>(null);
  const [instagramCovers, setInstagramCovers] = useState<Record<string, string>>({}); // postUrl -> thumbnail_url

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

  // Charger les covers (miniatures) des posts Instagram depuis l'API oEmbed
  useEffect(() => {
    const loadCovers = async () => {
      for (const post of instagramPosts) {
        if (!getInstagramEmbedUrl(post.postUrl)) continue;
        const thumb = await getInstagramThumbnail(post.postUrl);
        if (thumb) {
          setInstagramCovers((prev) => ({ ...prev, [post.postUrl]: thumb }));
        }
      }
    };
    loadCovers();
  }, []);

  // Combine tous les commerces pour le carousel (logos carousel en priorité depuis la base)
  const allItems: CarouselItem[] = [
    ...shops.map((item) => ({ id: item.id, name: item.name, logo: item.logo, image: item.image, type: 'boutique' as const })),
    ...restaurants.map((item) => ({ id: item.id, name: item.name, logo: item.logo, image: item.image, type: 'restaurant' as const })),
    ...loisirs.map((item) => ({ id: item.id, name: item.name, logo: item.logo, image: item.image, type: 'loisir' as const }))
  ];

  return (
    <div className="min-h-screen w-full max-w-full min-w-0 overflow-x-hidden">
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
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent border-2 border-gray-800 text-gray-800 font-sofia font-medium text-sm tracking-wide rounded-md hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-colors"
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

      {/* Section Instagram : affichage type feed (cartes avec branding PRIMA CENTER) */}
      <section className="py-16 md:py-20 bg-[#FAFAF9] w-full">
        <div className="w-full px-4 sm:px-6 md:px-8">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center mb-10 md:mb-12 hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 rounded-lg"
            aria-label="Suivez Prima Center sur Instagram"
          >
            <div className="flex justify-center mb-4">
              <svg className="w-12 h-12 md:w-14 md:h-14 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
            <p className="text-2xl md:text-3xl font-ogg text-gray-800 tracking-wide" style={{ fontFamily: "'Ogg Roman', 'Playfair Display', Georgia, serif" }}>
              @{INSTAGRAM_HANDLE}
            </p>
            <p className="mt-2 text-xs md:text-sm font-sofia font-medium text-gray-500 uppercase tracking-widest">
              Suivez-nous sur Instagram
            </p>
          </a>
          {/* Grille type Instagram : chaque post en carte avec bandeau PRIMA CENTER */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 max-w-5xl mx-auto">
            {instagramPosts.slice(0, 5).map((post, index) => {
              const embedUrl = getInstagramEmbedUrl(post.postUrl);
              const handleClick = (e: React.MouseEvent) => {
                if (embedUrl) {
                  e.preventDefault();
                  setInstagramModalPost(post.postUrl);
                }
              };
              return (
                <a
                  key={index}
                  href={post.postUrl}
                  target={embedUrl ? undefined : '_blank'}
                  rel={embedUrl ? undefined : 'noopener noreferrer'}
                  onClick={handleClick}
                  className="group block bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                  aria-label={embedUrl ? `Voir le post Instagram ${index + 1}` : `Post Instagram ${index + 1}`}
                >
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={instagramCovers[post.postUrl] || post.imageUrl || '/images/sections/boutiques.jpg'}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="py-2 px-3 bg-white border-t border-gray-100 text-center">
                    <span className="font-ogg text-xs md:text-sm text-gray-700 tracking-wide">PRIMA CENTER</span>
                    <span className="block font-sofia text-[10px] md:text-xs text-gray-500">ESTD. 1998</span>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Modal : afficher le post Instagram (embed) ou lien direct si l'embed est bloqué */}
          {instagramModalPost && getInstagramEmbedUrl(instagramModalPost) && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
              onClick={() => setInstagramModalPost(null)}
              role="dialog"
              aria-modal="true"
              aria-label="Post Instagram"
            >
              <div
                className="relative bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setInstagramModalPost(null)}
                  className="absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md"
                  aria-label="Fermer"
                >
                  <span className="text-xl leading-none">×</span>
                </button>
                <iframe
                  src={getInstagramEmbedUrl(instagramModalPost)!}
                  title="Post Instagram"
                  className="w-full min-h-[400px] flex-1 border-0"
                  allowFullScreen
                />
                <div className="p-3 border-t border-gray-200 bg-gray-50 flex flex-wrap items-center justify-center gap-2">
                  <p className="text-sm text-gray-600 w-full text-center">Si la vidéo ne s'affiche pas, ouvrez le post sur Instagram.</p>
                  <a
                    href={instagramModalPost}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#E1306C] text-white text-sm font-medium rounded-lg hover:opacity-90"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Voir le post sur Instagram
                  </a>
                </div>
              </div>
            </div>
          )}
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
              speed={600}
              breakpoints={{
                480: {
                  slidesPerView: 1.2,
                  spaceBetween: 20,
                  centeredSlides: true,
                },
                640: {
                  slidesPerView: 3,
                  spaceBetween: 4,
                  centeredSlides: false,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 6,
                  centeredSlides: false,
                },
                1024: {
                  slidesPerView: 5,
                  spaceBetween: 8,
                  centeredSlides: false,
                },
                1280: {
                  slidesPerView: 6,
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
                delay: 2500,
                disableOnInteraction: false,
              }}
              className="w-full"
            >
              {allItems.map((item) => (
                <SwiperSlide key={item.id}>
                  <Link 
                    to={`/${item.type}s/${item.id}`}
                    className="block bg-transparent backdrop-blur-none overflow-hidden transition-all"
                    title={item.name}
                  >
                    <div className="min-w-[140px] min-h-[120px] w-[140px] h-[120px] md:min-w-[160px] md:min-h-[100px] md:w-[160px] md:h-[100px] lg:min-w-[180px] lg:min-h-[120px] lg:w-[180px] lg:h-[120px] flex items-center justify-center p-2 mx-auto">
                      {(item.logo || item.image) ? (
                        <img
                          src={item.logo || item.image}
                          alt=""
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




