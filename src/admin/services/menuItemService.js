import { supabase } from '../../lib/supabase';
import { uploadToCloudinary } from '../../lib/cloudinary';

export const menuItemService = {
  async fetchItems(restaurantId, categoryId) {
    let query = supabase
      .from('products')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('sort_order', { ascending: true });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createItem(restaurantId, item) {
    const { data, error } = await supabase
      .from('products')
      .insert({
        restaurant_id: restaurantId,
        category_id: item.category_id,
        name: item.name,
        description: item.description || '',
        price: item.price,
        image_url: item.image_url || null,
        media_type: item.media_type || 'image',
        is_available: item.is_available ?? true,
        sort_order: item.sort_order || 0,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateItem(itemId, updates) {
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', itemId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteItem(itemId) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', itemId);
    if (error) throw error;
  },

  async toggleAvailability(itemId, available) {
    return menuItemService.updateItem(itemId, { is_available: available });
  },

  // Upload image or video to Cloudinary
  async uploadMedia(file) {
    return uploadToCloudinary(file, 'menu');
  },
};
