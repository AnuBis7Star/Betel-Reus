ALTER TABLE volley_registrations
  ADD COLUMN IF NOT EXISTS shirt_color TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_volley_registrations_shirt_color_status
  ON volley_registrations(shirt_color, status);
