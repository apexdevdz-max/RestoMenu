import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { FALLBACK_CATEGORIES } from '../lib/fallbackData';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const channelRef = useRef(null);
  const mountedRef = useRef(true);

  const fetchCategories = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setCategories(FALLBACK_CATEGORIES);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data, error: err } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (err) throw err;

      if (mountedRef.current) {
        setCategories(data || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      if (mountedRef.current) {
        setError(err.message);
        // Fallback to local data on error
        setCategories(FALLBACK_CATEGORIES);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchCategories();

    // Subscribe to realtime changes on categories
    if (!isSupabaseConfigured) return;

    channelRef.current = supabase
      .channel('categories-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        () => {
          // Refetch all categories on any change
          fetchCategories();
        }
      )
      .subscribe();

    return () => {
      mountedRef.current = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [fetchCategories]);

  return { categories, loading, error };
}
