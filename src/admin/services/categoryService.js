import { supabase } from '../../lib/supabase';

export const categoryService = {
  async fetchCategories(restaurantId) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async createCategory(restaurantId, name) {
    const maxOrder = await categoryService._getMaxSortOrder(restaurantId);
    const { data, error } = await supabase
      .from('categories')
      .insert({
        restaurant_id: restaurantId,
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        sort_order: maxOrder + 1,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateCategory(categoryId, updates) {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', categoryId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteCategory(categoryId) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);
    if (error) throw error;
  },

  async _getMaxSortOrder(restaurantId) {
    const { data } = await supabase
      .from('categories')
      .select('sort_order')
      .eq('restaurant_id', restaurantId)
      .order('sort_order', { ascending: false })
      .limit(1);
    return data?.[0]?.sort_order ?? 0;
  },
};
