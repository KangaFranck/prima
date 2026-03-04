export const isCurrentlyOpen = (heureOuverture: string, heureFermeture: string): boolean => {
  if (!heureOuverture || !heureFermeture) return false;

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinutes;

  const [openHour, openMinutes] = heureOuverture.split(':').map(Number);
  const [closeHour, closeMinutes] = heureFermeture.split(':').map(Number);
  
  const openTime = openHour * 60 + openMinutes;
  const closeTime = closeHour * 60 + closeMinutes;

  return currentTime >= openTime && currentTime <= closeTime;
}; 