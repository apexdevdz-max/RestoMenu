-- ============================================
-- El-Mawid Restaurant Management
-- Migration 007: Enable Realtime on restaurant_tables
-- ============================================

ALTER TABLE restaurant_tables REPLICA IDENTITY FULL;

DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE restaurant_tables;
  EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE 'restaurant_tables already in publication';
  END;
END $$;
