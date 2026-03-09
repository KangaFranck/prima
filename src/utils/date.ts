/** Retourne la date/heure de fin effective d'un événement (dateFin ou date + fin de journée) */
export function getEventEndDate(params: { date: string; dateFin?: string; heureFin?: string }): Date {
  const { date, dateFin, heureFin } = params;
  const d = dateFin ? new Date(dateFin) : new Date(date);
  if (heureFin) {
    const [h, m] = heureFin.slice(0, 5).split(':').map(Number);
    d.setHours(h ?? 23, m ?? 59, 59, 999);
  } else if (!dateFin) {
    d.setHours(23, 59, 59, 999);
  }
  return d;
}

/** Retourne la date/heure de début effective */
export function getEventStartDate(params: { date: string; heure?: string }): Date {
  const { date, heure } = params;
  const d = new Date(date);
  if (heure) {
    const [h, m] = heure.slice(0, 5).split(':').map(Number);
    d.setHours(h ?? 0, m ?? 0, 0, 0);
  } else {
    d.setHours(0, 0, 0, 0);
  }
  return d;
}

/** Statut d'un événement : 'en_cours' | 'avenir' | 'passe' */
export function getEventStatus(params: {
  date: string;
  heure?: string;
  dateFin?: string;
  heureFin?: string;
}): 'en_cours' | 'avenir' | 'passe' {
  const now = new Date();
  const start = getEventStartDate({ date: params.date, heure: params.heure });
  const end = getEventEndDate({
    date: params.date,
    dateFin: params.dateFin,
    heureFin: params.heureFin,
  });
  if (end < now) return 'passe';
  if (start > now) return 'avenir';
  return 'en_cours';
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

/** Affiche la plage de dates/heures d’un événement (début et optionnellement fin). */
export const formatEventDateRange = (params: {
  date: string;
  heure?: string;
  dateFin?: string;
  heureFin?: string;
}): string => {
  const { date, heure, dateFin, heureFin } = params;
  const d = new Date(date);
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const dateStr = new Intl.DateTimeFormat('fr-FR', opts).format(d);
  const timeStr = heure ? ` ${heure.slice(0, 5)}` : '';
  if (dateFin) {
    const df = new Date(dateFin);
    const dateFinStr = new Intl.DateTimeFormat('fr-FR', opts).format(df);
    const timeFinStr = heureFin ? ` ${heureFin.slice(0, 5)}` : '';
    return `Du ${dateStr}${timeStr} au ${dateFinStr}${timeFinStr}`;
  }
  return `${dateStr}${timeStr}`;
}; 