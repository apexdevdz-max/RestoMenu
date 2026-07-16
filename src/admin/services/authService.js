import { supabase } from '../../lib/supabase';

// Default restaurant ID (single-tenant for now)
export const DEFAULT_RESTAURANT_ID = '00000000-0000-0000-0000-000000000001';

export const authService = {
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*, restaurants(*)')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
