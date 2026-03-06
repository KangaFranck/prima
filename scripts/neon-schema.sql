-- =============================================================================
-- Prima Center - Schéma Neon (PostgreSQL)
-- Médias sur Cloudflare R2 → champs *_url stockent les URLs (pas les fichiers).
-- À exécuter dans le SQL Editor de ton projet Neon (copier-coller).
-- =============================================================================

-- Extensions utiles (Neon les supporte)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. AUTH / ADMINS (connexion back-office)
-- =============================================================================
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) DEFAULT '',
  avatar_url TEXT,
  permissions JSONB DEFAULT '["dashboard", "boutiques", "restaurants", "loisirs", "evenements", "settings", "users"]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admins_email ON admins(email);

-- =============================================================================
-- 2. USERS (comptes staff créés par les admins)
-- =============================================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) DEFAULT '',
  role VARCHAR(50) DEFAULT 'user',
  permissions JSONB DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);

-- =============================================================================
-- 3. BOUTIQUES
-- logo_url, image_url, logo_carousel_url = URLs Cloudflare R2
-- =============================================================================
CREATE TABLE boutiques (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom VARCHAR(255) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  logo_url TEXT,
  image_url TEXT,
  logo_carousel_url TEXT,
  website TEXT,
  horaires VARCHAR(500) DEFAULT '',
  heure_ouverture TIME DEFAULT '09:00',
  heure_fermeture TIME DEFAULT '18:00',
  open_sunday BOOLEAN NOT NULL DEFAULT false,
  statut VARCHAR(20) NOT NULL DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif')),
  universe VARCHAR(100) DEFAULT 'Général',
  telephone VARCHAR(50),
  email VARCHAR(255),
  instagram VARCHAR(500),
  facebook VARCHAR(500),
  tiktok VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_boutiques_statut ON boutiques(statut);
CREATE INDEX idx_boutiques_universe ON boutiques(universe);

-- =============================================================================
-- 4. RESTAURANTS
-- logo_url, image_url, logo_carousel_url, menu_url = URLs Cloudflare R2
-- =============================================================================
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  cuisine VARCHAR(255) DEFAULT '',
  logo_url TEXT,
  image_url TEXT,
  logo_carousel_url TEXT,
  website TEXT,
  menu_url TEXT,
  horaires VARCHAR(500) DEFAULT '',
  heure_ouverture TIME DEFAULT '09:00',
  heure_fermeture TIME DEFAULT '18:00',
  open_sunday BOOLEAN NOT NULL DEFAULT false,
  statut VARCHAR(20) NOT NULL DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif')),
  universe VARCHAR(100) DEFAULT 'Général',
  telephone VARCHAR(50),
  email VARCHAR(255),
  instagram VARCHAR(500),
  facebook VARCHAR(500),
  tiktok VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_restaurants_statut ON restaurants(statut);

-- =============================================================================
-- 5. LOISIRS
-- logo_url, image_url, logo_carousel_url = URLs Cloudflare R2
-- =============================================================================
CREATE TABLE loisirs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  logo_url TEXT,
  image_url TEXT,
  logo_carousel_url TEXT,
  website TEXT,
  type VARCHAR(100) DEFAULT '',
  level VARCHAR(50) DEFAULT '',
  horaires VARCHAR(500) DEFAULT '',
  heure_ouverture TIME DEFAULT '09:00',
  heure_fermeture TIME DEFAULT '18:00',
  open_sunday BOOLEAN NOT NULL DEFAULT false,
  statut VARCHAR(20) NOT NULL DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif')),
  universe VARCHAR(100) DEFAULT 'Général',
  telephone VARCHAR(50),
  email VARCHAR(255),
  instagram VARCHAR(500),
  facebook VARCHAR(500),
  tiktok VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_loisirs_statut ON loisirs(statut);

-- =============================================================================
-- 6. ÉVÉNEMENTS
-- affiche_url, image_url = URLs Cloudflare R2 (affiche = image principale)
-- =============================================================================
CREATE TABLE evenements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titre VARCHAR(500) NOT NULL,
  description TEXT DEFAULT '',
  date DATE NOT NULL,
  heure VARCHAR(20),
  date_fin DATE,
  heure_fin VARCHAR(20),
  lieu VARCHAR(500) DEFAULT '',
  statut VARCHAR(20) NOT NULL DEFAULT 'planifié' CHECK (statut IN ('planifié', 'en cours', 'annulé', 'terminé')),
  affiche_url TEXT,
  image_url TEXT,
  images JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_evenements_date ON evenements(date);
CREATE INDEX idx_evenements_statut ON evenements(statut);

-- =============================================================================
-- 7. TRIGGERS updated_at (optionnel mais utile)
-- =============================================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER admins_updated_at
  BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER boutiques_updated_at
  BEFORE UPDATE ON boutiques FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER restaurants_updated_at
  BEFORE UPDATE ON restaurants FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER loisirs_updated_at
  BEFORE UPDATE ON loisirs FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER evenements_updated_at
  BEFORE UPDATE ON evenements FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- 8. COMPTE ADMIN INITIAL (à créer après avoir hashé le mot de passe côté app)
-- Exemple : insérer manuellement ou via ton API avec bcrypt.
-- Décommente et remplace le password_hash par le hash bcrypt de ton mot de passe.
-- =============================================================================
-- INSERT INTO admins (email, password_hash, name, permissions)
-- VALUES (
--   'communicationprimacenter@gmail.com',
--   '$2a$10$...',  -- remplacer par le hash bcrypt généré par ton backend
--   'Admin Prima Center',
--   '["dashboard", "boutiques", "restaurants", "loisirs", "evenements", "settings", "users"]'::jsonb
-- );

-- Fin du schéma
