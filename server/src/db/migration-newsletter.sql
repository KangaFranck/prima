-- Table newsletter_subscribers pour stocker les inscriptions à la newsletter
-- Exécuter dans le SQL Editor Neon

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_created_at ON newsletter_subscribers (created_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers (email);

COMMENT ON TABLE newsletter_subscribers IS 'Inscriptions à la newsletter Prima Center';
