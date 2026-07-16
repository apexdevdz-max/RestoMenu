import { supabase } from '../../lib/supabase';

export const orderService = {
  async fetchOrders(restaurantId) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          order_item_options (*)
        )
      `)
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async markAsProcessed(orderId) {
    const { data, error } = await supabase
      .from('orders')
      .update({
        status: 'processed',
        processed_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Subscribe to realtime order changes
  subscribeToOrders(restaurantId, callbacks) {
    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          callbacks.onInsert?.(payload.new);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          callbacks.onUpdate?.(payload.new);
        }
      )
      .subscribe();

    return channel;
  },

  unsubscribe(channel) {
    supabase.removeChannel(channel);
  },
};
