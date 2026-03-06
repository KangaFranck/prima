-- Date et heure de fin pour les événements (début = date + heure existants)
-- Exécuter dans le SQL Editor Neon si la table evenements existe déjà.

ALTER TABLE evenements ADD COLUMN IF NOT EXISTS date_fin DATE;
ALTER TABLE evenements ADD COLUMN IF NOT EXISTS heure_fin VARCHAR(20);

COMMENT ON COLUMN evenements.date_fin IS 'Date de fin de l’événement (optionnel, pour événements sur plusieurs jours/semaines).';
COMMENT ON COLUMN evenements.heure_fin IS 'Heure de fin (ex. 22:00), optionnel.';
