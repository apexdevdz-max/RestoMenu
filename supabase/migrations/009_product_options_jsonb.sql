-- ============================================
-- El-Mawid Restaurant Management
-- Migration 009: Add JSONB options column to products
-- ============================================

-- Add options column for sizes, supplements, removals, sauces
ALTER TABLE products ADD COLUMN IF NOT EXISTS options JSONB DEFAULT '{}'::jsonb;

-- Example structure:
-- {
--   "sizes": [{"name": "33cl", "price": 0}, {"name": "1L", "price": 150}],
--   "supplements": [{"name": "Extra fromage", "price": 100}],
--   "removals": ["Sans oignons", "Sans tomate"],
--   "sauces": ["Sauce maison", "Ketchup", "Mayonnaise"]
-- }
