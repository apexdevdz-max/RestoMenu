import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DEFAULT_RESTAURANT_ID } from '../admin/services/authService';

// Generate or retrieve a persistent anonymous client ID
function getClientId() {
  const KEY = 'elmawid_client_id';
  let id = sessionStorage.getItem(KEY);
  if (!id) {
    id = `client-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    sessionStorage.setItem(KEY, id);
  }
  return id;
}

export function useSharedCart(tableNumber) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [orderValidated, setOrderValidated] = useState(false);
  const channelRef = useRef(null);
  const broadcastRef = useRef(null);
  const clientId = useMemo(() => getClientId(), []);
  const tableNum = parseInt(tableNumber, 10) || 1;

  // Auto-expiry: clear cart if untouched for 30 minutes
  const CART_EXPIRY_MS = 30 * 60 * 1000;

  // Fetch all cart items for this table
  const fetchCartItems = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from('table_cart_items')
        .select('*')
        .eq('restaurant_id', DEFAULT_RESTAURANT_ID)
        .eq('table_number', tableNum)
        .order('created_at', { ascending: true });
      if (error) throw error;

      const rows = data || [];

      // Auto-expire: if all items are older than CART_EXPIRY_MS, purge them
      if (rows.length > 0) {
        const now = Date.now();
        const latestUpdate = Math.max(...rows.map(r => new Date(r.created_at).getTime()));
        if (now - latestUpdate > CART_EXPIRY_MS) {
          console.log('[SharedCart] Cart expired, auto-clearing for table', tableNum);
          await supabase
            .from('table_cart_items')
            .delete()
            .eq('restaurant_id', DEFAULT_RESTAURANT_ID)
            .eq('table_number', tableNum);
          setItems([]);
          setLoading(false);
          return;
        }
      }

      setItems(rows);
    } catch (err) {
      console.error('Error fetching shared cart:', err);
    } finally {
      setLoading(false);
    }
  }, [tableNum]);

  // Setup Realtime subscriptions
  useEffect(() => {
    fetchCartItems();

    if (!isSupabaseConfigured) return;

    // 1. Postgres changes on table_cart_items
    channelRef.current = supabase
      .channel(`shared-cart-${tableNum}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'table_cart_items',
          filter: `table_number=eq.${tableNum}`,
        },
        () => {
          // Refetch all items on any change
          fetchCartItems();
        }
      )
      .subscribe();

    // 2. Broadcast channel for order validation signals
    broadcastRef.current = supabase
      .channel(`table-${tableNum}-events`)
      .on('broadcast', { event: 'order-validated' }, () => {
        setItems([]);
        setOrderValidated(true);
      })
      .subscribe();

    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
      if (broadcastRef.current) supabase.removeChannel(broadcastRef.current);
    };
  }, [tableNum, fetchCartItems]);

  // Add item to shared cart
  const addItem = useCallback(async (product, quantity, selectedOptions) => {
    if (!isSupabaseConfigured) return;

    const options = selectedOptions.map(o => ({
      name: o.name,
      price_modifier: o.price_modifier,
    }));

    const { error } = await supabase
      .from('table_cart_items')
      .insert({
        table_number: tableNum,
        restaurant_id: DEFAULT_RESTAURANT_ID,
        product_id: product.id,
        product_name: product.name,
        image_url: product.image_url || null,
        base_price: product.price,
        quantity,
        selected_options: options,
        added_by: clientId,
      });

    if (error) console.error('Error adding to shared cart:', error);
  }, [tableNum, clientId]);

  // Update quantity
  const updateQuantity = useCallback(async (cartItemId, quantity) => {
    if (!isSupabaseConfigured) return;

    if (quantity <= 0) {
      const { error } = await supabase
        .from('table_cart_items')
        .delete()
        .eq('id', cartItemId);
      if (error) console.error('Error removing from shared cart:', error);
    } else {
      const { error } = await supabase
        .from('table_cart_items')
        .update({ quantity })
        .eq('id', cartItemId);
      if (error) console.error('Error updating shared cart:', error);
    }
  }, []);

  // Remove item
  const removeItem = useCallback(async (cartItemId) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('table_cart_items')
      .delete()
      .eq('id', cartItemId);
    if (error) console.error('Error removing from shared cart:', error);
  }, []);

  // Clear entire cart for this table
  const clearCart = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('table_cart_items')
      .delete()
      .eq('restaurant_id', DEFAULT_RESTAURANT_ID)
      .eq('table_number', tableNum);
    if (error) console.error('Error clearing shared cart:', error);
    setItems([]);
  }, [tableNum]);

  // Submit the shared order
  const submitSharedOrder = useCallback(async ({ customerName, notes }) => {
    if (!isSupabaseConfigured || items.length === 0) return { success: false };

    setIsValidating(true);
    try {
      // Re-fetch to get latest state (anti-doublon)
      const { data: currentItems, error: fetchErr } = await supabase
        .from('table_cart_items')
        .select('*')
        .eq('restaurant_id', DEFAULT_RESTAURANT_ID)
        .eq('table_number', tableNum);

      if (fetchErr) throw fetchErr;
      if (!currentItems || currentItems.length === 0) {
        // Another client already validated
        setIsValidating(false);
        setOrderValidated(true);
        return { success: true, alreadyValidated: true };
      }

      // Calculate total
      const totalPrice = currentItems.reduce((sum, item) => {
        const optsMod = (item.selected_options || []).reduce((s, o) => s + (o.price_modifier || 0), 0);
        return sum + (item.base_price + optsMod) * item.quantity;
      }, 0);

      // 1. Create the order
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          restaurant_id: DEFAULT_RESTAURANT_ID,
          table_number: tableNum,
          customer_name: customerName || null,
          notes: notes || null,
          status: 'pending',
          total: totalPrice,
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      // 2. Create order items
      const orderItems = currentItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.base_price + (item.selected_options || []).reduce((s, o) => s + (o.price_modifier || 0), 0),
        subtotal: (item.base_price + (item.selected_options || []).reduce((s, o) => s + (o.price_modifier || 0), 0)) * item.quantity,
      }));

      const { data: insertedItems, error: itemsErr } = await supabase
        .from('order_items')
        .insert(orderItems)
        .select();

      if (itemsErr) throw itemsErr;

      // 3. Create order item options
      const allOptions = [];
      currentItems.forEach((item, idx) => {
        const opts = item.selected_options || [];
        if (opts.length > 0 && insertedItems[idx]) {
          opts.forEach(opt => {
            allOptions.push({
              order_item_id: insertedItems[idx].id,
              option_name: opt.name,
              price_modifier: opt.price_modifier || 0,
            });
          });
        }
      });

      if (allOptions.length > 0) {
        const { error: optsErr } = await supabase
          .from('order_item_options')
          .insert(allOptions);
        if (optsErr) throw optsErr;
      }

      // 4. Clear the shared cart
      await supabase
        .from('table_cart_items')
        .delete()
        .eq('restaurant_id', DEFAULT_RESTAURANT_ID)
        .eq('table_number', tableNum);

      // 5. Broadcast to all connected clients
      if (broadcastRef.current) {
        await supabase
          .channel(`table-${tableNum}-events`)
          .send({
            type: 'broadcast',
            event: 'order-validated',
            payload: { orderId: order.id },
          });
      }

      setItems([]);
      setOrderValidated(true);
      setIsValidating(false);
      return { success: true, orderId: order.id };
    } catch (err) {
      console.error('Error submitting shared order:', err);
      setIsValidating(false);
      return { success: false, error: err.message };
    }
  }, [items, tableNum]);

  // Reset the validated flag (after confirmation is dismissed)
  const resetValidated = useCallback(() => {
    setOrderValidated(false);
  }, []);

  // Computed values
  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, i) => {
      const optsMod = (i.selected_options || []).reduce((s, o) => s + (o.price_modifier || 0), 0);
      return sum + (i.base_price + optsMod) * i.quantity;
    }, 0),
    [items]
  );

  // Map items to the same shape expected by CartContext consumers
  const mappedItems = useMemo(
    () => items.map(i => ({
      cartItemId: i.id, // Use Supabase UUID as cart item ID
      productId: i.product_id,
      name: i.product_name,
      image: i.image_url,
      basePrice: i.base_price,
      quantity: i.quantity,
      selectedOptions: (i.selected_options || []).map(o => ({
        name: o.name,
        price_modifier: o.price_modifier || 0,
      })),
      lineTotal: (i.base_price + (i.selected_options || []).reduce((s, o) => s + (o.price_modifier || 0), 0)) * i.quantity,
      addedBy: i.added_by,
    })),
    [items]
  );

  const getProductCount = useCallback(
    (productId) => items.filter(i => i.product_id === productId).reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  return {
    items: mappedItems,
    totalItems,
    totalPrice,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getProductCount,
    submitSharedOrder,
    isValidating,
    orderValidated,
    resetValidated,
    loading,
    isShared: true,
    clientId,
  };
}
