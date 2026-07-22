-- ============================================
-- El-Mawid Restaurant Management
-- Migration 005: Enable Realtime on products & categories
-- ============================================

-- Set REPLICA IDENTITY to FULL (required for Supabase Realtime to detect changes)
ALTER TABLE products REPLICA IDENTITY FULL;
ALTER TABLE categories REPLICA IDENTITY FULL;
ALTER TABLE orders REPLICA IDENTITY FULL;

-- Add tables to the realtime publication
-- (ignore errors if already added)
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE products;
  EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE 'products already in publication';
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE categories;
  EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE 'categories already in publication';
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE 'orders already in publication';
  END;
END $$;
