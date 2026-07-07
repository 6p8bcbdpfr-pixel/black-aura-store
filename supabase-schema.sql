-- Black Aura — Database Schema

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT DEFAULT '',
  price TEXT DEFAULT '',
  description TEXT DEFAULT '',
  sizes JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  details JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for everyone"
  ON products FOR ALL
  USING (true)
  WITH CHECK (true);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  address TEXT DEFAULT '',
  governorate TEXT DEFAULT '',
  product TEXT DEFAULT '',
  quantity INTEGER DEFAULT 1,
  payment_method TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  size TEXT DEFAULT '',
  shipping INTEGER DEFAULT 0,
  receipt TEXT DEFAULT '',
  date TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for everyone"
  ON orders FOR ALL
  USING (true)
  WITH CHECK (true);

-- Site content table (singleton)
CREATE TABLE IF NOT EXISTS site_content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for everyone"
  ON site_content FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert default site content
INSERT INTO site_content (id, data)
VALUES (1, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;
