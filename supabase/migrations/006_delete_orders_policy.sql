-- ============================================
-- El-Mawid Restaurant Management
-- Migration 006: Allow authenticated users to delete orders
-- ============================================

-- Allow authenticated admin users to delete orders from their restaurant
CREATE POLICY "Auth delete orders" ON orders
  FOR DELETE USING (
    restaurant_id IN (SELECT restaurant_id FROM users WHERE id = auth.uid())
  );

-- Also allow cascade delete on order_items
CREATE POLICY "Auth delete order_items" ON order_items
  FOR DELETE USING (
    restaurant_id IN (SELECT restaurant_id FROM users WHERE id = auth.uid())
  );

-- Allow cascade delete on order_item_options (through order_items CASCADE)
CREATE POLICY "Auth delete order_item_options" ON order_item_options
  FOR DELETE USING (true);
