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
      .select('id, table_number, status, created_at')
      .eq('restaurant_id', restaurantId)
      .eq('status', 'new')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
};
