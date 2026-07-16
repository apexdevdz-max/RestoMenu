import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { FALLBACK_CATEGORIES } from '../lib/fallbackData';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      if (!isSupabaseConfigured) {
        setCategories(FALLBACK_CATEGORIES);
        setLoading(false);
        return;
      }

      try {
        const { data, error: err } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true });

        if (err) throw err;
        setCategories(data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.message);
        // Fallback to local data on error
        setCategories(FALLBACK_CATEGORIES);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return { categories, loading, error };
}
