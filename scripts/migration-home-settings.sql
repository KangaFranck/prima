-- Images de la page d'accueil (section Nos Univers)
-- À exécuter dans le SQL Editor Neon
CREATE TABLE IF NOT EXISTS home_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_boutiques TEXT DEFAULT '/images/BOUTIQUES.png',
  image_restaurants TEXT DEFAULT '/images/RESTAURANTS.png',
  image_loisirs TEXT DEFAULT '/images/LOISIRS.png',
  image_services TEXT DEFAULT '/images/SERVICES.png',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Une seule ligne de configuration (insert si vide)
INSERT INTO home_settings (id, image_boutiques, image_restaurants, image_loisirs, image_services)
SELECT
  '00000000-0000-0000-0000-000000000001'::uuid,
  '/images/BOUTIQUES.png',
  '/images/RESTAURANTS.png',
  '/images/LOISIRS.png',
  '/images/SERVICES.png'
WHERE NOT EXISTS (SELECT 1 FROM home_settings LIMIT 1);
