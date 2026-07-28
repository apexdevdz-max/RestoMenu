-- ============================================
-- El-Mawid Restaurant Management
-- Migration 012: Add multilingual content columns
-- ============================================

-- JSONB columns for multilingual name and description on products
ALTER TABLE products ADD COLUMN IF NOT EXISTS name_i18n JSONB DEFAULT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_i18n JSONB DEFAULT NULL;

-- JSONB columns for multilingual name on categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_i18n JSONB DEFAULT NULL;

-- Backfill: copy existing French text into the JSONB structure
UPDATE products SET name_i18n = jsonb_build_object('fr', name)
  WHERE name_i18n IS NULL AND name IS NOT NULL;

UPDATE products SET description_i18n = jsonb_build_object('fr', description)
  WHERE description_i18n IS NULL AND description IS NOT NULL;

UPDATE categories SET name_i18n = jsonb_build_object('fr', name)
  WHERE name_i18n IS NULL AND name IS NOT NULL;
