CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  language TEXT NOT NULL DEFAULT 'ro',
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  reserved INTEGER NOT NULL DEFAULT 0 CHECK (reserved >= 0),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_name TEXT NOT NULL,
  contact TEXT NOT NULL DEFAULT 'biblioteca',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'collected', 'cancelled')),
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  fulfilled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id),
  title TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price NUMERIC(10, 2) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor TEXT NOT NULL DEFAULT 'admin',
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  before_data JSONB,
  after_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS volley_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name TEXT NOT NULL,
  representative_name TEXT NOT NULL,
  shirt_color TEXT NOT NULL DEFAULT '',
  players JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

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

CREATE INDEX IF NOT EXISTS idx_books_active_title ON books(active, title);
CREATE INDEX IF NOT EXISTS idx_orders_status_created_at ON orders(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
ALTER TABLE volley_registrations ADD COLUMN IF NOT EXISTS shirt_color TEXT NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS idx_volley_registrations_status_created_at ON volley_registrations(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_volley_registrations_shirt_color_status ON volley_registrations(shirt_color, status);
CREATE INDEX IF NOT EXISTS idx_church_events_public_date ON church_events(published, event_date, featured);
CREATE INDEX IF NOT EXISTS idx_church_events_created_at ON church_events(created_at DESC);

INSERT INTO books (title, author, category, language, price, stock, reserved)
VALUES
  ('Viața condusă de scopuri', 'Rick Warren', 'General', 'ro', 12.50, 4, 0),
  ('Creștinul autentic', 'John Stott', 'General', 'ro', 9.99, 2, 0),
  ('Rugăciunea', 'Timothy Keller', 'General', 'ro', 14.00, 1, 0),
  ('Biblia pentru copii', 'Resurse familie', 'Copii', 'ro', 18.00, 6, 0)
ON CONFLICT DO NOTHING;
