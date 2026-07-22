-- ============================================
-- El-Mawid Restaurant Management
-- Migration 004: Fix NULL restaurant_id on orders
-- ============================================
-- Sets a default restaurant_id so all orders are always linked,
-- even if the client code forgets to include it.
-- ============================================

-- 1. Fix all existing orders with NULL restaurant_id
UPDATE orders
SET restaurant_id = '00000000-0000-0000-0000-000000000001'
WHERE restaurant_id IS NULL;

-- 2. Set DEFAULT so future orders always get restaurant_id
ALTER TABLE orders
  ALTER COLUMN restaurant_id SET DEFAULT '00000000-0000-0000-0000-000000000001';

-- 3. Same for order_items
UPDATE order_items
SET restaurant_id = '00000000-0000-0000-0000-000000000001'
WHERE restaurant_id IS NULL;

ALTER TABLE order_items
  ALTER COLUMN restaurant_id SET DEFAULT '00000000-0000-0000-0000-000000000001';
