import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Coffee, Dumbbell, Calendar, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useShopStore } from '../store/shopStore';
import { useRestaurantStore } from '../store/restaurantStore';
import { useLoisirStore } from '../store/loisirStore';
import { useServiceStore } from '../store/serviceStore';
import Logo from '../components/Logo';
import 'swiper/css';
import 'swiper/css/navigation';

// Vidéo unique de la première section (fichier : public/videos/backvideos.mp4)
const backVideo = '/videos/backvideos.mp4';

const universeBlocks = [
  {
    category: 'Shopping',
    title: 'Boutiques',
    description: 'Mode, beauté, technologie et équipements du quotidien dans une sélection variée pour toutes les envies.',
    image: '/images/BOUTIQUES.png',
    link: '/boutiques'
  },
  {
    category: 'FOOD & DRINKS',
    title: 'Restaurants',
    description: 'Restaurants, cafés, pâtisseries et glaciers pour se retrouver à tout moment de la journée.',
    image: '/images/RESTAURANTS.png',
    link: '/restaurants'
  },
  {
    category: 'Lifestyle',
    title: 'Loisirs',
    description: 'Cinéma et espaces de jeux pour enfants et adultes pour se divertir et partager un moment de détente.',
    image: '/images/LOISIRS.png',
    link: '/loisirs'
  },
  {
    category: 'DAILY LIFE',
    title: 'Services',
    description: 'Banques, santé et services du quotidien réunis en un seul lieu.',
    image: '/images/SERVICES.png',
    link: '/services'
  }
];

interface CarouselItem {
  id: string;
  name: string;
  logo?: string;
  image?: string;
  type: 'boutique' | 'restaurant' | 'loisir' | 'service';
}

const DESKTOP_BREAKPOINT = 1024;
const ENSEIGNES_PER_PAGE_DESKTOP = 6;

/** Texte avec effet machine à écrire, lettre par lettre */
function TypewriterText({
  text,
  className,
  as: Tag = 'span',
  delay = 0,
  charDelay = 0.045,
}: {
  text: string;
  className?: string;
  as?: 'span' | 'h2' | 'p';
  delay?: number;
  charDelay?: number;
}) {
  const chars = Array.from(text);
  return (
    <Tag className={className}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{
            duration: 0.02,
            delay: delay + i * charDelay,
          }}
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </Tag>
  );
}

export default function Home() {
  const swiperRef = useRef<{ realIndex: number; slideTo: (i: number) => void } | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoTouchedRef = useRef(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [enseignesPage, setEnseignesPage] = useState(0);
  /** Sur iOS, définir la source après le montage peut éviter l’écran noir */
  const [videoFallback, setVideoFallback] = useState(false);

  useEffect(() => {
    if (videoFallback) return;
    const t = setTimeout(() => {
      const video = videoRef.current;
      if (video && (video.readyState ?? 0) < 2) setVideoFallback(true);
    }, 5000);
    return () => clearTimeout(t);
  }, [videoFallback]);

  /** Forcer la lecture — Safari exige muted+playsinline pour autoplay */
  const tryPlayVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }, []);

  const onVideoSectionTouch = useCallback(() => {
    if (videoTouchedRef.current) return;
    videoTouchedRef.current = true;
    tryPlayVideo();
  }, [tryPlayVideo]);

  /** useLayoutEffect : synchrone avant paint — crucial pour Safari/iOS */
  useLayoutEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('playsinline', 'true');
    }
    tryPlayVideo();
    const onVisibility = () => { if (document.visibilityState === 'visible') tryPlayVideo(); };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [tryPlayVideo]);

  // Utiliser les nouveaux stores
  const { shops, fetchShops } = useShopStore();
  const { restaurants, fetchRestaurants } = useRestaurantStore();
  const { loisirs, fetchLoisirs } = useLoisirStore();
  const { services, fetchServices } = useServiceStore();

  // Charger les données au montage du composant
  useEffect(() => {
    fetchShops();
    fetchRestaurants();
    fetchLoisirs();
    fetchServices();
  }, [fetchShops, fetchRestaurants, fetchLoisirs, fetchServices]);

  // Desktop ou mobile pour la pagination du carousel enseignes (mobile = rien ne change)
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Combine tous les commerces pour le carousel (logos carousel en priorité depuis la base)
  const allItems: CarouselItem[] = [
    ...shops.map((item) => ({ id: item.id, name: item.name, logo: item.logo, image: item.image, type: 'boutique' as const })),
    ...restaurants.map((item) => ({ id: item.id, name: item.name, logo: item.logo, image: item.image, type: 'restaurant' as const })),
    ...loisirs.map((item) => ({ id: item.id, name: item.name, logo: item.logo, image: item.image, type: 'loisir' as const })),
    ...services.map((item) => ({ id: item.id, name: item.name, logo: item.logo, image: item.image, type: 'service' as const }))
  ];

  return (
    <div className="min-h-screen w-full max-w-full min-w-0 overflow-x-hidden">
      {/* Section 1: Vidéo de fond — fallback gradient si non supportée ou échec de chargement */}
      <section
        className="relative h-screen overflow-hidden bg-black"
        onTouchEnd={onVideoSectionTouch}
      >
        {videoFallback ? (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900" />
        ) : (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            disablePictureInPicture
            onCanPlay={tryPlayVideo}
            onLoadedData={tryPlayVideo}
            onError={() => setVideoFallback(true)}
          >
            <source src={backVideo} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-black/30">
          <div className="w-full h-full flex flex-col content-edge">
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="flex flex-col items-center justify-center w-full">
                <div className="mb-6 flex items-center justify-center w-full">
                  <Logo 
                    className="h-40 md:h-56 lg:h-72 xl:h-80 mx-auto" 
                    color="white"
                    variant="light"
                  />
                </div>
                <p className="text-[16px] md:text-[18px] lg:text-[20px] font-sofia font-thin text-white text-center tracking-wider leading-relaxed -mt-10 md:-mt-12 lg:-mt-14 xl:-mt-16 max-w-2xl">
                  Shopping, restaurants, loisirs et services<br />
                  au cœur de la Zone 4 à Abidjan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Universes - même alignement que navbar/footer */}
      <section className="py-20 bg-white w-full">
        <div className="content-wrap">
          <div className="text-center mb-16">
            <TypewriterText
              text="NOS UNIVERS"
              as="h2"
              className="text-4xl font-ogg font-bold mb-4 text-gray-800"
            />
            <TypewriterText
              text="Découvrez plus de 70 enseignes, des marques internationales aux adresses locales, reconnues pour leur qualité et leur savoir-faire."
              as="p"
              className="text-gray-600 max-w-2xl mx-auto"
              delay={0.55}
            />
          </div>
          
          <div className="space-y-20">
            {universeBlocks.map((block, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row items-center gap-12 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <motion.div
                  className="w-full lg:w-1/2 overflow-hidden transition-all duration-500 ease-out hover:-translate-y-3 hover:shadow-2xl"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -200 : 200 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link to={block.link} className="group relative block aspect-square overflow-hidden">
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
                </motion.div>
                
                <div className="w-full lg:w-1/2 text-center lg:text-left">
                  <TypewriterText
                    text={block.category}
                    className="text-sm font-sofia font-normal text-gray-500 uppercase tracking-widest block"
                    delay={0}
                  />
                  <TypewriterText
                    text={block.title}
                    as="h2"
                    className="text-4xl font-ogg font-bold text-gray-800 mt-2 mb-4 tracking-wide uppercase"
                    delay={0.15}
                  />
                  <TypewriterText
                    text={block.description}
                    as="p"
                    className="text-base lg:text-lg font-sofia text-gray-600 leading-relaxed mb-6 max-w-xl"
                    delay={0.4}
                  />
                  <Link
                    to={block.link}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent border-2 border-gray-800 text-gray-800 font-sofia font-medium text-sm tracking-wide rounded-md hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-colors"
                  >
                    <TypewriterText text="Découvrir " delay={0.7} />
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Carousel - même alignement que navbar/footer */}
      <section className="py-12 relative overflow-hidden bg-[#E5DDD3] w-full enseignes-carousel">
        <div className="content-wrap relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-ogg mb-4 text-gray-800">DÉCOUVREZ NOS ENSEIGNES</h2>
          </div>
          
          <div>
            <Swiper
              modules={[Autoplay]}
              loop={true}
              spaceBetween={12}
              slidesPerView={2}
              centeredSlides={false}
              speed={600}
              breakpoints={{
                480: {
                  slidesPerView: 2,
                  spaceBetween: 16,
                },
                640: {
                  slidesPerView: 3,
                  spaceBetween: 4,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 6,
                },
                1024: {
                  slidesPerView: 5,
                  spaceBetween: 8,
                  slidesPerGroup: 6,
                },
                1280: {
                  slidesPerView: 6,
                  spaceBetween: 10,
                  slidesPerGroup: 6,
                }
              }}
              pagination={false}
              onSwiper={(swiper) => { swiperRef.current = swiper; }}
              onSlideChange={(swiper) => {
                if (isDesktop) setEnseignesPage(Math.floor(swiper.realIndex / 6));
              }}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              className="w-full"
            >
              {allItems.map((item, index) => (
                <SwiperSlide key={item.id}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ duration: 0.9, delay: index * 0.22, ease: 'easeOut' }}
                  >
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
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
            {/* Pagination desktop : un point par groupe de 6 logos */}
            {isDesktop && allItems.length > 0 && (() => {
              const totalPages = Math.ceil(allItems.length / ENSEIGNES_PER_PAGE_DESKTOP);
              return totalPages > 1 ? (
                <div className="flex justify-center gap-1.5 mt-6">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Page ${i + 1}`}
                      onClick={() => swiperRef.current?.slideTo(i * ENSEIGNES_PER_PAGE_DESKTOP)}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        i === enseignesPage ? 'bg-black opacity-100' : 'bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              ) : null;
            })()}
          </div>
        </div>
      </section>
    </div>
  );
}




