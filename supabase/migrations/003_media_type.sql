-- ============================================
-- El-Mawid Restaurant Management
-- Migration 003: Add media_type to products
-- ============================================
-- Adds support for video media on menu items.
-- The image_url column now stores either an image or video URL,
-- and media_type indicates which one it is.
-- ============================================

-- Add media_type column to products (defaults to 'image' for existing rows)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'media_type'
  ) THEN
    ALTER TABLE products ADD COLUMN media_type TEXT NOT NULL DEFAULT 'image'
      CHECK (media_type IN ('image', 'video'));
  END IF;
END $$;
