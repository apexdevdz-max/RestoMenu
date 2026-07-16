import { supabase } from '../../lib/supabase';
import { uploadToCloudinary } from '../../lib/cloudinary';

export const restaurantService = {
  async fetchRestaurant(restaurantId) {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', restaurantId)
      .single();
    if (error) throw error;
    return data;
  },

  async updateRestaurant(restaurantId, updates) {
    const { data, error } = await supabase
      .from('restaurants')
      .update(updates)
      .eq('id', restaurantId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Upload logo to Cloudinary
  async uploadLogo(file) {
    const result = await uploadToCloudinary(file, 'logos');
    return result.url;
  },
};
