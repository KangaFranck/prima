-- Images supplémentaires pour les événements (1 à 3 optionnelles)
-- Exécuter dans le SQL Editor Neon si la table evenements existe déjà.

ALTER TABLE evenements ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]';

COMMENT ON COLUMN evenements.images IS 'Tableau de 1 à 3 URLs d’images supplémentaires (galerie), optionnel.';
