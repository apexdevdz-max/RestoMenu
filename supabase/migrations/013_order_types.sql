-- ============================================
-- El-Mawid Restaurant Management
-- Migration 013: Add order types (dine_in / takeaway)
-- ============================================

-- order_type: 'dine_in' (sur place) or 'takeaway' (à emporter)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_type TEXT NOT NULL DEFAULT 'dine_in';

-- customer_phone: required for takeaway orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- Make table_number nullable (takeaway orders have no table)
ALTER TABLE orders ALTER COLUMN table_number DROP NOT NULL;
