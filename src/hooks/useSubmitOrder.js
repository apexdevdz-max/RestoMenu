import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function useSubmitOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);

  async function submitOrder({ tableNumber, customerName, notes, items, totalPrice }) {
    setLoading(true);
    setError(null);
    setOrderId(null);

    // If Supabase is not configured, simulate a successful order
    if (!isSupabaseConfigured) {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      const fakeId = `local-${Date.now()}`;
      setOrderId(fakeId);
      setLoading(false);
      return { success: true, orderId: fakeId };
    }

    try {
      // 1. Insert order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          table_number: tableNumber,
          customer_name: customerName || null,
          notes: notes || null,
          status: 'pending',
          total: totalPrice,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.basePrice + item.selectedOptions.reduce((s, o) => s + o.price_modifier, 0),
        subtotal: item.lineTotal,
      }));

      const { data: insertedItems, error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
        .select();

      if (itemsError) throw itemsError;

      // 3. Insert order item options
      const allOptions = [];
      items.forEach((item, idx) => {
        if (item.selectedOptions.length > 0 && insertedItems[idx]) {
          item.selectedOptions.forEach(opt => {
            allOptions.push({
              order_item_id: insertedItems[idx].id,
              option_name: opt.name,
              price_modifier: opt.price_modifier,
            });
          });
        }
      });

      if (allOptions.length > 0) {
        const { error: optionsError } = await supabase
          .from('order_item_options')
          .insert(allOptions);

        if (optionsError) throw optionsError;
      }

      setOrderId(order.id);
      setLoading(false);
      return { success: true, orderId: order.id };
    } catch (err) {
      console.error('Error submitting order:', err);
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }

  return { submitOrder, loading, error, orderId };
}
