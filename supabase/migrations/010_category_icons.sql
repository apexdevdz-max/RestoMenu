-- ============================================
-- El-Mawid Restaurant Management
-- Migration 010: Add icon columns to categories
-- ============================================

-- icon_name: lucide icon name (e.g. 'Pizza', 'Coffee')
ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon_name TEXT DEFAULT NULL;

-- icon_type: 'lucide' (default) or 'image'
ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon_type TEXT DEFAULT 'lucide';

-- image_url: URL for custom image/SVG when icon_type = 'image'
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT NULL;
