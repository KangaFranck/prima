export interface OpeningHours {
  heureOuverture: string;
  heureFermeture: string;
  openSunday?: boolean;
  horaires?: string; // Format "Lun-Dim: 11h30-22h00"
  statut?: 'actif' | 'inactif';
}

// Fonction pour parser une heure au format "HH:MM" ou ISO corrompu
const parseTime = (time: string) => {
  console.log(' Parsing time:', time);
  
  // Si c'est déjà au format HH:MM, on l'utilise directement
  if (/^\d{1,2}:\d{2}$/.test(time)) {
    const [hours, minutes] = time.split(':').map(Number);
    return {
      hours: hours || 0,
      minutes: minutes || 0,
      totalMinutes: (hours || 0) * 60 + (minutes || 0)
    };
  }
  
  // Si c'est un format ISO corrompu, on essaie d'extraire l'heure
  if (time.includes('T') && time.includes(':')) {
    try {
      // Extraire la partie heure de "2025-09-27T2025-09-27T09:44:00.000Z:00.000Z"
      const timeMatch = time.match(/(\d{1,2}):(\d{2})/);
      if (timeMatch) {
        const hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);
        console.log(' Extracted from ISO:', { hours, minutes });
        return {
          hours,
          minutes,
          totalMinutes: hours * 60 + minutes
        };
      }
    } catch (error) {
      console.error(' Error parsing ISO time:', error);
    }
  }
  
  // Fallback: essayer de parser n'importe quel format
  try {
    const date = new Date(time);
    if (!isNaN(date.getTime())) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      console.log(' Parsed as Date:', { hours, minutes });
      return {
        hours,
        minutes,
        totalMinutes: hours * 60 + minutes
      };
    }
  } catch (error) {
    console.error(' Error parsing as Date:', error);
  }
  
  // Dernier recours: retourner 0:00
  console.warn(' Could not parse time, using 0:00');
  return {
    hours: 0,
    minutes: 0,
    totalMinutes: 0
  };
};

export const isCurrentlyOpen = (params: OpeningHours): boolean => {
  console.group(' Vérification des horaires d\'ouverture');
  console.log(' Paramètres reçus:', params);
  
  // Utiliser le fuseau horaire de la Côte d'Ivoire
  const now = new Date();
  const ivoryCoastTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Abidjan' }));
  const currentHour = ivoryCoastTime.getHours();
  const currentMinutes = ivoryCoastTime.getMinutes();
  const currentDay = ivoryCoastTime.getDay();
  
  console.log(` Heure actuelle (Côte d'Ivoire): ${currentHour}:${currentMinutes.toString().padStart(2, '0')}`);
  console.log(` Heure UTC: ${now.getUTCHours()}:${now.getUTCMinutes().toString().padStart(2, '0')}`);
  console.log(` Jour actuel: ${currentDay} (0 = Dimanche)`);
  
  // Vérifier si le magasin est inactif
  if (params.statut === 'inactif') {
    console.log(' Le magasin est inactif');
    console.groupEnd();
    return false;
  }

  // Vérifier si c'est dimanche et si le magasin est fermé le dimanche
  if (currentDay === 0 && !params.openSunday) {
    console.log(' Fermé le dimanche');
    console.groupEnd();
    return false;
  }

  const openTime = parseTime(params.heureOuverture);
  const closeTime = parseTime(params.heureFermeture);
  const currentTime = currentHour * 60 + currentMinutes;

  console.log(` Heure d'ouverture: ${params.heureOuverture} (${openTime.totalMinutes} minutes)`);
  console.log(` Heure de fermeture: ${params.heureFermeture} (${closeTime.totalMinutes} minutes)`);
  console.log(` Heure actuelle en minutes: ${currentTime}`);

  // Si l'heure de fermeture est plus petite que l'heure d'ouverture,
  // cela signifie que la fermeture est le lendemain
  let isOpen;
  if (closeTime.totalMinutes < openTime.totalMinutes) {
    // Le commerce ferme après minuit
    isOpen = currentTime >= openTime.totalMinutes || currentTime <= closeTime.totalMinutes;
  } else {
    // Horaires normaux dans la même journée
    isOpen = currentTime >= openTime.totalMinutes && currentTime <= closeTime.totalMinutes;
  }
  
  console.log(` Résultat: ${isOpen ? ' OUVERT' : ' FERMÉ'}`);
  console.groupEnd();
  
  return isOpen;
};

// Fonction utilitaire pour parser les horaires
export const parseHoraires = (horaires: string) => {
  if (!horaires) return { isOpen: false };

  try {
    const [days, hours] = horaires.split(': ');
    const [start, end] = hours.split('-').map(time => {
      const [hour, minute] = time.replace('h', ':').split(':').map(Number);
      return {
        hour,
        minute: minute || 0,
        totalMinutes: hour * 60 + (minute || 0)
      };
    });

    const [startDay, endDay] = days.split('-').map(day => {
      const daysMap: { [key: string]: number } = {
        'Lun': 1, 'Mar': 2, 'Mer': 3, 'Jeu': 4,
        'Ven': 5, 'Sam': 6, 'Dim': 0
      };
      return daysMap[day.substring(0, 3)];
    });

    return {
      startTime: start,
      endTime: end,
      startDay,
      endDay,
      formatted: {
        start: `${start.hour}:${start.minute.toString().padStart(2, '0')}`,
        end: `${end.hour}:${end.minute.toString().padStart(2, '0')}`
      }
    };
  } catch {
    return { isOpen: false };
  }
};

// Fonction de test pour vérifier différents scénarios
export function testOpeningHours() {
  const testCases = [
    {
      name: "Test 1: Magasin ouvert pendant les heures normales",
      params: {
        heureOuverture: "10:00",
        heureFermeture: "18:00",
        openSunday: true,
        statut: "actif"
      },
      expectedTime: new Date("2024-01-15T14:30:00"), // Un lundi à 14h30
      expected: true
    },
    {
      name: "Test 2: Magasin fermé après l'heure de fermeture",
      params: {
        heureOuverture: "10:00",
        heureFermeture: "18:00",
        openSunday: true,
        statut: "actif"
      },
      expectedTime: new Date("2024-01-15T18:01:00"),
      expected: false
    }
  ];

  console.group(" Tests de la fonction isCurrentlyOpen");
  
  testCases.forEach(testCase => {
    console.group(`Test: ${testCase.name}`);
    
    // Sauvegarder la fonction Date originale
    const OriginalDate = Date;
    
    // Remplacer la fonction Date par notre mock
    window.Date = class extends OriginalDate {
      constructor() {
        super();
        return testCase.expectedTime;
      }
      
      static now() {
        return testCase.expectedTime.getTime();
      }
    };
    
    try {
      const result = isCurrentlyOpen(testCase.params);
      const passed = result === testCase.expected;
      
      console.log(`Résultat: ${result ? ' OUVERT' : ' FERMÉ'}`);
      console.log(`Attendu: ${testCase.expected ? ' OUVERT' : ' FERMÉ'}`);
      console.log(`Test ${passed ? ' RÉUSSI' : ' ÉCHOUÉ'}`);
    } catch (error) {
      console.error(' Erreur pendant le test:', error);
    } finally {
      // Restaurer la fonction Date originale
      window.Date = OriginalDate;
    }
    
    console.groupEnd();
  });
  
  console.groupEnd();
}

// Exécuter les tests
testOpeningHours();

// Fonction pour tester un cas spécifique
export const testSpecificCase = () => {
  const params = {
    heureOuverture: "10:52",
    heureFermeture: "17:57",
    openSunday: true,
    statut: "actif"
  };

  console.log('\n=== Test des horaires actuels ===');
  console.log('Paramètres:', params);
  
  const result = isCurrentlyOpen(params);
  
  console.log('\n=== Résumé ===');
  console.log(`La boutique devrait être: ${result ? 'OUVERTE ' : 'FERMÉE '}`);
  console.log('============================\n');
  
  return result;
};

// Exécuter le test spécifique
testSpecificCase();
