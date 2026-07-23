import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../services/orderService';
import { getOrdersToDelete } from './usePurgeSettings';

export function useOrders() {
  const { restaurantId } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const channelRef = useRef(null);
  const onNewOrderRef = useRef(null);

  // Expose a callback setter for new order notifications
  const setOnNewOrder = useCallback((cb) => {
    onNewOrderRef.current = cb;
  }, []);

  // Fetch all orders
  const fetchOrders = useCallback(async () => {
    try {
      const data = await orderService.fetchOrders(restaurantId);
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  // Mark order as processed
  const markAsProcessed = useCallback(async (orderId) => {
    try {
      await orderService.markAsProcessed(orderId);
      // Optimistic update
      setOrders(prev => prev.map(o =>
        o.id === orderId
          ? { ...o, status: 'processed', processed_at: new Date().toISOString() }
          : o
      ));
    } catch (err) {
      console.error('Error marking order as processed:', err);
      // Refetch on error
      fetchOrders();
    }
  }, [fetchOrders]);

  // Purge expired processed orders from database
  const purgeExpiredOrders = useCallback(async () => {
    try {
      const idsToDelete = getOrdersToDelete(orders);
      if (idsToDelete.length === 0) return;

      await orderService.deleteProcessedOrders(idsToDelete);
      // Remove from local state
      setOrders(prev => prev.filter(o => !idsToDelete.includes(o.id)));
      console.log(`🗑️ Purged ${idsToDelete.length} expired orders from database`);
    } catch (err) {
      console.error('Error purging orders:', err);
    }
  }, [orders]);

  // Setup realtime subscription
  useEffect(() => {
    fetchOrders();

    channelRef.current = orderService.subscribeToOrders(restaurantId, {
      onInsert: async (newOrder) => {
        // Fetch the full order with items
        try {
          const data = await orderService.fetchOrders(restaurantId);
          setOrders(data);
        } catch {
          // fallback: just add the basic order
          setOrders(prev => [newOrder, ...prev]);
        }
        // Notify (for sound)
        onNewOrderRef.current?.();
      },
      onUpdate: (updatedOrder) => {
        setOrders(prev => prev.map(o =>
          o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o
        ));
      },
    });

    return () => {
      if (channelRef.current) {
        orderService.unsubscribe(channelRef.current);
      }
    };
  }, [restaurantId, fetchOrders]);

  // Run purge check every minute
  useEffect(() => {
    // Initial purge check
    purgeExpiredOrders();

    const interval = setInterval(purgeExpiredOrders, 60_000);
    return () => clearInterval(interval);
  }, [purgeExpiredOrders]);

  // Split orders
  const newOrders = orders.filter(o => o.status === 'new' || o.status === 'pending');
  const processedOrders = orders.filter(o => o.status === 'processed' || o.status === 'completed');

  return {
    orders,
    newOrders,
    processedOrders,
    loading,
    error,
    markAsProcessed,
    setOnNewOrder,
    refetch: fetchOrders,
  };
}
