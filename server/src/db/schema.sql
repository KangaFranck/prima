-- Neon (PostgreSQL) : schéma pour boutiques, restaurants, loisirs
-- Exécuter une fois dans le SQL Editor du dashboard Neon

CREATE TABLE IF NOT EXISTS boutiques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  description TEXT,
  horaires JSONB DEFAULT '[]',
  telephone VARCHAR(50),
  email VARCHAR(255),
  adresse TEXT,
  logo VARCHAR(500),
  images JSONB DEFAULT '[]',
  statut VARCHAR(20) DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif')),
  ouvert_le_dimanche BOOLEAN DEFAULT false,
  reseaux_sociaux JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(255) NOT NULL,
  description TEXT,
  cuisine VARCHAR(100),
  horaires VARCHAR(255),
  telephone VARCHAR(50),
  email VARCHAR(255),
  adresse TEXT,
  logo VARCHAR(500),
  images JSONB DEFAULT '[]',
  statut VARCHAR(20) DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif')),
  ouvert_le_dimanche BOOLEAN DEFAULT false,
  reseaux_sociaux JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loisirs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  description TEXT,
  horaires VARCHAR(255),
  telephone VARCHAR(50),
  email VARCHAR(255),
  adresse TEXT,
  logo VARCHAR(500),
  images JSONB DEFAULT '[]',
  statut VARCHAR(20) DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif')),
  ouvert_le_dimanche BOOLEAN DEFAULT false,
  reseaux_sociaux JSONB DEFAULT '{}',
  tarifs JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  description TEXT,
  horaires VARCHAR(255),
  telephone VARCHAR(50),
  email VARCHAR(255),
  adresse TEXT,
  logo VARCHAR(500),
  images JSONB DEFAULT '[]',
  statut VARCHAR(20) DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif')),
  ouvert_le_dimanche BOOLEAN DEFAULT false,
  reseaux_sociaux JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
