-- ============================================
-- El-Mawid Restaurant Management
-- Migration 011: Add images gallery column to products
-- ============================================

-- images: array of URLs for multi-image gallery
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
