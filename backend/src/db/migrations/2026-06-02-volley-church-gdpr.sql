ALTER TABLE volley_registrations
  ADD COLUMN IF NOT EXISTS church_name TEXT NOT NULL DEFAULT '';
