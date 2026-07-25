-- ============================================
-- El-Mawid Restaurant Management
-- Migration 008: Shared Cart (table_cart_items)
-- ============================================

-- Table to hold shared cart items per restaurant table
CREATE TABLE IF NOT EXISTS table_cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number INT NOT NULL,
  restaurant_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001',
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  image_url TEXT,
  base_price INT NOT NULL DEFAULT 0,
  quantity INT NOT NULL DEFAULT 1,
  selected_options JSONB DEFAULT '[]'::jsonb,
  added_by TEXT NOT NULL DEFAULT 'anonymous',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups by table
CREATE INDEX IF NOT EXISTS idx_cart_table ON table_cart_items(restaurant_id, table_number);

-- ===================== RLS =====================
ALTER TABLE table_cart_items ENABLE ROW LEVEL SECURITY;

-- Anyone (anon + authenticated) can read cart items
CREATE POLICY "Anyone can read cart items" ON table_cart_items
  FOR SELECT USING (true);

-- Anyone can insert cart items
CREATE POLICY "Anyone can insert cart items" ON table_cart_items
  FOR INSERT WITH CHECK (true);

-- Anyone can update cart items (for quantity changes)
CREATE POLICY "Anyone can update cart items" ON table_cart_items
  FOR UPDATE USING (true);

-- Anyone can delete cart items (for removal + checkout clear)
CREATE POLICY "Anyone can delete cart items" ON table_cart_items
  FOR DELETE USING (true);

-- ===================== REALTIME =====================
ALTER TABLE table_cart_items REPLICA IDENTITY FULL;

DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE table_cart_items;
  EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE 'table_cart_items already in publication';
  END;
END $$;
