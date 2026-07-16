-- ============================================
-- El-Mawid Restaurant Management
-- Migration 002: Admin Schema (Multi-tenant ready)
-- ============================================
-- This migration creates the admin-facing schema while
-- maintaining backward compatibility with the customer app.
-- ============================================

-- ===================== RESTAURANTS =====================

CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'El-Mawid',
  logo_url TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ===================== USERS =====================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('owner', 'manager', 'staff')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ===================== RESTAURANT TABLES =====================

CREATE TABLE IF NOT EXISTS restaurant_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  table_number INT NOT NULL,
  seats INT NOT NULL DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(restaurant_id, table_number)
);

-- ===================== ENHANCE EXISTING TABLES =====================

-- Add restaurant_id to categories (with default for existing rows)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'restaurant_id'
  ) THEN
    ALTER TABLE categories ADD COLUMN restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add restaurant_id to products (with default for existing rows)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'restaurant_id'
  ) THEN
    ALTER TABLE products ADD COLUMN restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add available column alias if not exists (products already has is_available)
-- Add updated_at to products
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE products ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
  END IF;
END $$;

-- Enhance orders table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'restaurant_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'table_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN table_id UUID REFERENCES restaurant_tables(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'processed_at'
  ) THEN
    ALTER TABLE orders ADD COLUMN processed_at TIMESTAMPTZ;
  END IF;
END $$;

-- Enhance order_items table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_items' AND column_name = 'restaurant_id'
  ) THEN
    ALTER TABLE order_items ADD COLUMN restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_items' AND column_name = 'selected_options'
  ) THEN
    ALTER TABLE order_items ADD COLUMN selected_options JSONB DEFAULT '[]';
  END IF;
END $$;

-- Update status check constraint on orders to include 'new' and 'processed'
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('new', 'pending', 'preparing', 'ready', 'completed', 'cancelled', 'processed'));

-- ===================== INDEXES =====================

CREATE INDEX IF NOT EXISTS idx_users_restaurant ON users(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_tables_restaurant ON restaurant_tables(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_categories_restaurant ON categories(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_products_restaurant ON products(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_table_id ON orders(table_id);
CREATE INDEX IF NOT EXISTS idx_order_items_restaurant ON order_items(restaurant_id);

-- ===================== RLS POLICIES =====================

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_tables ENABLE ROW LEVEL SECURITY;

-- Restaurants: authenticated users can read their own restaurant
CREATE POLICY "Users read own restaurant" ON restaurants
  FOR SELECT USING (
    id IN (SELECT restaurant_id FROM users WHERE id = auth.uid())
    OR true  -- allow public read for now (single tenant)
  );

CREATE POLICY "Users update own restaurant" ON restaurants
  FOR UPDATE USING (
    id IN (SELECT restaurant_id FROM users WHERE id = auth.uid())
  );

-- Users: can read own profile
CREATE POLICY "Users read own profile" ON users
  FOR SELECT USING (id = auth.uid() OR true);

-- Restaurant tables: public read (customer needs to know table), authenticated write
CREATE POLICY "Public read tables" ON restaurant_tables
  FOR SELECT USING (true);

CREATE POLICY "Auth insert tables" ON restaurant_tables
  FOR INSERT WITH CHECK (
    restaurant_id IN (SELECT restaurant_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Auth update tables" ON restaurant_tables
  FOR UPDATE USING (
    restaurant_id IN (SELECT restaurant_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Auth delete tables" ON restaurant_tables
  FOR DELETE USING (
    restaurant_id IN (SELECT restaurant_id FROM users WHERE id = auth.uid())
  );

-- Update existing policies for categories to allow authenticated CRUD
DROP POLICY IF EXISTS "Public read categories" ON categories;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);

CREATE POLICY "Auth insert categories" ON categories
  FOR INSERT WITH CHECK (
    restaurant_id IN (SELECT restaurant_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Auth update categories" ON categories
  FOR UPDATE USING (
    restaurant_id IN (SELECT restaurant_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Auth delete categories" ON categories
  FOR DELETE USING (
    restaurant_id IN (SELECT restaurant_id FROM users WHERE id = auth.uid())
  );

-- Update existing policies for products to allow authenticated CRUD
DROP POLICY IF EXISTS "Public read products" ON products;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);

CREATE POLICY "Auth insert products" ON products
  FOR INSERT WITH CHECK (
    restaurant_id IN (SELECT restaurant_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Auth update products" ON products
  FOR UPDATE USING (
    restaurant_id IN (SELECT restaurant_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Auth delete products" ON products
  FOR DELETE USING (
    restaurant_id IN (SELECT restaurant_id FROM users WHERE id = auth.uid())
  );

-- Update orders: allow authenticated update (mark as processed)
CREATE POLICY "Auth update orders" ON orders
  FOR UPDATE USING (
    restaurant_id IN (SELECT restaurant_id FROM users WHERE id = auth.uid())
  );

-- ===================== ENABLE REALTIME =====================

-- Enable realtime on orders table for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- ===================== STORAGE BUCKETS =====================
-- Note: Run these in the Supabase Dashboard SQL editor or via API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('menu-images', 'menu-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('restaurant-logos', 'restaurant-logos', true);

-- ===================== SEED DATA =====================

-- Insert default restaurant
INSERT INTO restaurants (id, name, logo_url, address, phone, email) VALUES
  ('00000000-0000-0000-0000-000000000001', 'El-Mawid', '/images/logo.png', '123 Rue Didouche Mourad, Alger', '+213 555 123 456', 'contact@elmawid.dz')
ON CONFLICT (id) DO NOTHING;

-- Update existing categories with restaurant_id
UPDATE categories SET restaurant_id = '00000000-0000-0000-0000-000000000001' WHERE restaurant_id IS NULL;

-- Update existing products with restaurant_id
UPDATE products SET restaurant_id = '00000000-0000-0000-0000-000000000001' WHERE restaurant_id IS NULL;

-- Update existing orders with restaurant_id
UPDATE orders SET restaurant_id = '00000000-0000-0000-0000-000000000001' WHERE restaurant_id IS NULL;

-- Update existing order_items with restaurant_id
UPDATE order_items SET restaurant_id = '00000000-0000-0000-0000-000000000001' WHERE restaurant_id IS NULL;

-- Seed 10 restaurant tables
INSERT INTO restaurant_tables (restaurant_id, table_number, seats) VALUES
  ('00000000-0000-0000-0000-000000000001', 1, 2),
  ('00000000-0000-0000-0000-000000000001', 2, 4),
  ('00000000-0000-0000-0000-000000000001', 3, 2),
  ('00000000-0000-0000-0000-000000000001', 4, 6),
  ('00000000-0000-0000-0000-000000000001', 5, 4),
  ('00000000-0000-0000-0000-000000000001', 6, 2),
  ('00000000-0000-0000-0000-000000000001', 7, 6),
  ('00000000-0000-0000-0000-000000000001', 8, 4),
  ('00000000-0000-0000-0000-000000000001', 9, 2),
  ('00000000-0000-0000-0000-000000000001', 10, 8)
ON CONFLICT (restaurant_id, table_number) DO NOTHING;

-- ===================== HELPER FUNCTION =====================

-- Function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, restaurant_id, email, full_name, role)
  VALUES (
    NEW.id,
    '00000000-0000-0000-0000-000000000001',  -- default restaurant
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'staff')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
