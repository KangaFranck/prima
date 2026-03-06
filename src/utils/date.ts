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