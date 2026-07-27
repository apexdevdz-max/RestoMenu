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

      // Helper: convert JSONB options to option_groups format
      function buildOptionGroups(product) {
        const groups = [];
        const opts = product.options || {};

        // Sizes
        if (opts.sizes?.length > 0) {
          groups.push({
            id: `${product.id}-sizes`,
            name: 'Taille',
            type: opts.sizes_mode || 'single',
            max_selections: opts.sizes_max ?? (opts.sizes_mode === 'multi' ? 0 : 1),
            required: false,
            sort_order: 0,
            option_items: opts.sizes.map((s, i) => ({
              id: `${product.id}-size-${i}`,
              name: s.name,
              price_modifier: s.price || 0,
              sort_order: i,
            })),
          });
        }

        // Supplements
        if (opts.supplements?.length > 0) {
          groups.push({
            id: `${product.id}-supplements`,
            name: 'Suppléments',
            type: opts.supplements_mode || 'multi',
            max_selections: opts.supplements_max ?? 0,
            required: false,
            sort_order: 1,
            option_items: opts.supplements.map((s, i) => ({
              id: `${product.id}-supp-${i}`,
              name: s.name,
              price_modifier: s.price || 0,
              sort_order: i,
            })),
          });
        }

        // Removals
        if (opts.removals?.length > 0) {
          groups.push({
            id: `${product.id}-removals`,
            name: 'Retirer',
            type: opts.removals_mode || 'multi',
            max_selections: opts.removals_max ?? 0,
            required: false,
            sort_order: 2,
            option_items: opts.removals.map((r, i) => ({
              id: `${product.id}-rem-${i}`,
              name: r,
              price_modifier: 0,
              sort_order: i,
            })),
          });
        }

        // Sauces
        if (opts.sauces?.length > 0) {
          groups.push({
            id: `${product.id}-sauces`,
            name: 'Sauce',
            type: opts.sauces_mode || 'single',
            max_selections: opts.sauces_max ?? 1,
            required: false,
            sort_order: 3,
            option_items: opts.sauces.map((s, i) => ({
              id: `${product.id}-sauce-${i}`,
              name: s,
              price_modifier: 0,
              sort_order: i,
            })),
          });
        }

        // Custom groups
        if (opts.custom_groups?.length > 0) {
          opts.custom_groups.forEach((cg, gIdx) => {
            if (!cg.items?.length) return;
            groups.push({
              id: `${product.id}-custom-${gIdx}`,
              name: cg.name,
              type: cg.mode || (cg.type === 'priced' ? 'multi' : 'single'),
              max_selections: cg.max_selections ?? 0,
              required: false,
              sort_order: 4 + gIdx,
              option_items: cg.items.map((item, i) => ({
                id: `${product.id}-cg${gIdx}-${i}`,
                name: typeof item === 'string' ? item : item.name,
                price_modifier: typeof item === 'string' ? 0 : (item.price || 0),
                sort_order: i,
              })),
            });
          });
        }

        return groups;
      }

      // Sort nested option_groups and merge with JSONB options
      const sorted = (data || []).map(product => {
        // Existing option_groups from DB relations
        const dbGroups = (product.option_groups || [])
          .sort((a, b) => a.sort_order - b.sort_order)
          .map(group => ({
            ...group,
            option_items: (group.option_items || []).sort((a, b) => a.sort_order - b.sort_order),
          }));

        // JSONB-based option groups
        const jsonGroups = buildOptionGroups(product);

        return {
          ...product,
          option_groups: [...dbGroups, ...jsonGroups],
        };
      });

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
