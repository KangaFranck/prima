export interface OpeningHours {
  heureOuverture: string;
  heureFermeture: string;
  openSunday?: boolean;
  horaires?: string; // Format "Lun-Dim: 11h30-22h00"
  statut?: 'actif' | 'inactif';
}

const devLog = (...args: unknown[]) => { if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) console.log(...args); };

/** Normalise une heure (ISO, "YYYY-MM-DD HH:MM:SS", "HH:MM" ou Date) en "HH:MM". */
function toHHMM(v: unknown): string {
  if (v == null) return '00:00';
  if (typeof v === 'string') {
    const s = v.trim();
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(s)) return s.slice(0, 5);
    const m = s.match(/(\d{1,2}):(\d{2})/);
    if (m) return `${m[1].padStart(2, '0')}:${m[2]}`;
  }
  if (typeof v === 'object' && v instanceof Date && !isNaN(v.getTime())) {
    const h = v.getHours();
    const m = v.getMinutes();
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }
  return '00:00';
}

function parseTime(time: string) {
  const normalized = toHHMM(time);
  const [hours, minutes] = normalized.split(':').map(Number);
  return {
    hours: hours || 0,
    minutes: minutes || 0,
    totalMinutes: (hours || 0) * 60 + (minutes || 0)
  };
}

/**
 * Indique si le commerce est actuellement ouvert selon :
 * - heureOuverture / heureFermeture (définies en base),
 * - openSunday (ouvert le dimanche ou non),
 * - statut (actif / inactif).
 * Fuseau : Africa/Abidjan (Côte d'Ivoire).
 */
export const isCurrentlyOpen = (params: OpeningHours): boolean => {
  const heureOuverture = toHHMM(params.heureOuverture);
  const heureFermeture = toHHMM(params.heureFermeture);
  devLog(' [isCurrentlyOpen]', { heureOuverture, heureFermeture, openSunday: params.openSunday, statut: params.statut });

  const now = new Date();
  const ivoryCoastTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Abidjan' }));
  const currentHour = ivoryCoastTime.getHours();
  const currentMinutes = ivoryCoastTime.getMinutes();
  const currentDay = ivoryCoastTime.getDay(); // 0 = Dimanche

  if (params.statut === 'inactif') {
    devLog(' [isCurrentlyOpen] Fermé (statut inactif)');
    return false;
  }

  if (currentDay === 0 && !params.openSunday) {
    devLog(' [isCurrentlyOpen] Fermé le dimanche (openSunday=false)');
    return false;
  }

  const openTime = parseTime(heureOuverture);
  const closeTime = parseTime(heureFermeture);
  const currentTime = currentHour * 60 + currentMinutes;

  let isOpen: boolean;
  if (closeTime.totalMinutes < openTime.totalMinutes) {
    isOpen = currentTime >= openTime.totalMinutes || currentTime <= closeTime.totalMinutes;
  } else {
    isOpen = currentTime >= openTime.totalMinutes && currentTime <= closeTime.totalMinutes;
  }
  devLog(' [isCurrentlyOpen]', isOpen ? 'Ouvert' : 'Fermé');
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
