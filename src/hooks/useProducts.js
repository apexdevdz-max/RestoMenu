import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { FALLBACK_PRODUCTS } from '../lib/fallbackData';

export function useProducts(categoryId) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const channelRef = useRef(null);

  // Fetch products with option groups
  const fetchProducts = useCallback(async () => {
    if (!isSupabaseConfigured) {
      const filtered = categoryId
        ? FALLBACK_PRODUCTS.filter(p => p.category_id === categoryId)
        : FALLBACK_PRODUCTS;
      setProducts(filtered);
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          option_groups (
            *,
            option_items (*)
          )
        `)
        .eq('is_available', true)
        .order('sort_order', { ascending: true });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error: err } = await query;

      if (err) throw err;

      // Sort nested option_groups and option_items
      const sorted = (data || []).map(product => ({
        ...product,
        option_groups: (product.option_groups || [])
          .sort((a, b) => a.sort_order - b.sort_order)
          .map(group => ({
            ...group,
            option_items: (group.option_items || []).sort((a, b) => a.sort_order - b.sort_order),
          })),
      }));

      setProducts(sorted);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      // Fallback
      const filtered = categoryId
        ? FALLBACK_PRODUCTS.filter(p => p.category_id === categoryId)
        : FALLBACK_PRODUCTS;
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchProducts();

    // Subscribe to realtime changes on products
    if (!isSupabaseConfigured) return;

    // Clean up previous channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    channelRef.current = supabase
      .channel('products-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          // Refetch all products on any change (INSERT, UPDATE, DELETE)
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [fetchProducts]);

  return { products, loading, error };
}
