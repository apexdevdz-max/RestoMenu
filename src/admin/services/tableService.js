import { supabase } from '../../lib/supabase';

export const tableService = {
  async fetchTables(restaurantId) {
    const { data, error } = await supabase
      .from('restaurant_tables')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('table_number', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getActiveOrders(restaurantId) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id, table_number, status, total, created_at, customer_name, notes,
        order_items (
          *,
          order_item_options (*)
        )
      `)
      .eq('restaurant_id', restaurantId)
      .in('status', ['new', 'pending', 'preparing', 'ready'])
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async addTable(restaurantId, tableNumber, seats) {
    const { data, error } = await supabase
      .from('restaurant_tables')
      .insert({ restaurant_id: restaurantId, table_number: tableNumber, seats })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateTable(tableId, updates) {
    const { data, error } = await supabase
      .from('restaurant_tables')
      .update(updates)
      .eq('id', tableId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteTable(tableId) {
    const { error } = await supabase
      .from('restaurant_tables')
      .delete()
      .eq('id', tableId);
    if (error) throw error;
  },

  async completeOrdersForTable(restaurantId, tableNumber) {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'processed', processed_at: new Date().toISOString() })
      .eq('restaurant_id', restaurantId)
      .eq('table_number', tableNumber)
      .in('status', ['new', 'pending', 'preparing', 'ready']);
    if (error) throw error;
  },

  // Realtime subscription for orders (to detect table status changes)
  subscribeToChanges(restaurantId, onChangeCallback) {
    const channel = supabase
      .channel('tables-orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `restaurant_id=eq.${restaurantId}` },
        () => onChangeCallback()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'restaurant_tables', filter: `restaurant_id=eq.${restaurantId}` },
        () => onChangeCallback()
      )
      .subscribe();
    return channel;
  },

  unsubscribe(channel) {
    supabase.removeChannel(channel);
  },
};
