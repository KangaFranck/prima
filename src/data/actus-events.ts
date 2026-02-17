export interface ActusEvent {
  id: string;
  titre: string;
  description: string;
  date: string;
  image: string;
  statut: 'actif' | 'inactif';
}

export const actusEvents: ActusEvent[] = [
  {
    id: "1",
    titre: "Programme du 18 au 24 Décembre 2023",
    description: "Découvrez notre programme spécial pour les fêtes de fin d'année",
    date: "2023-12-24",
    image: "/images/events/event1.jpg",
    statut: "actif"
  },
  {
    id: "2",
    titre: "Programme du 13 au 17 Décembre 2023",
    description: "Une semaine riche en animations et découvertes",
    date: "2023-12-13",
    image: "/images/events/event2.jpg",
    statut: "actif"
  },
  {
    id: "6",
    titre: "Marché de Noël Prima Center",
    description: "Venez découvrir notre magnifique marché de Noël et ses artisans",
    date: "2023-12-01",
    image: "/images/events/noel.jpg",
    statut: "actif"
  },
  {
    id: "7",
    titre: "Black Friday Prima Center",
    description: "Des offres exceptionnelles dans toutes vos boutiques",
    date: "2023-11-24",
    image: "/images/events/blackfriday.jpg",
    statut: "actif"
  },
  {
    id: "3",
    titre: "Monop'Prima",
    description: "Découvrez votre nouveau Monop' au Prima Center",
    date: "2023-02-02",
    image: "/images/boutiques/monop.jpg",
    statut: "actif"
  },
  {
    id: "4",
    titre: "AGS : votre conciergerie",
    description: "Un service de conciergerie premium à votre disposition",
    date: "2023-06-16",
    image: "/images/boutiques/ags.jpg",
    statut: "actif"
  },
  {
    id: "5",
    titre: "Nougatine : offre café croissant",
    description: "Profitez de notre offre petit-déjeuner exceptionnelle",
    date: "2023-05-21",
    image: "/images/kitchen/nougatine.jpg",
    statut: "actif"
  }
]; 