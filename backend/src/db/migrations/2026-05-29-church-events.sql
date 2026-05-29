CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS church_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_date DATE NOT NULL,
  event_time TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  accent_color TEXT NOT NULL DEFAULT '#7f090b',
  published BOOLEAN NOT NULL DEFAULT false,
  featured BOOLEAN NOT NULL DEFAULT false,
  title_ro TEXT NOT NULL DEFAULT '',
  short_description_ro TEXT NOT NULL DEFAULT '',
  full_description_ro TEXT NOT NULL DEFAULT '',
  poster_ro TEXT NOT NULL DEFAULT '',
  title_es TEXT NOT NULL DEFAULT '',
  short_description_es TEXT NOT NULL DEFAULT '',
  full_description_es TEXT NOT NULL DEFAULT '',
  poster_es TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_church_events_public_date ON church_events(published, event_date, featured);
CREATE INDEX IF NOT EXISTS idx_church_events_created_at ON church_events(created_at DESC);
