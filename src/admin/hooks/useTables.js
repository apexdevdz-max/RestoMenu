import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { tableService } from '../services/tableService';

export function useTables() {
  const { restaurantId } = useAuth();
  const [tables, setTables] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef(null);

  const fetchAll = useCallback(async () => {
    try {
      const [tablesData, ordersData] = await Promise.all([
        tableService.fetchTables(restaurantId),
        tableService.getActiveOrders(restaurantId),
      ]);
      setTables(tablesData);
      setActiveOrders(ordersData);
    } catch (err) {
      console.error('Error fetching tables:', err);
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  // Setup realtime subscription
  useEffect(() => {
    fetchAll();

    channelRef.current = tableService.subscribeToChanges(restaurantId, fetchAll);

    return () => {
      if (channelRef.current) {
        tableService.unsubscribe(channelRef.current);
      }
    };
  }, [restaurantId, fetchAll]);

  // CRUD operations
  const addTable = useCallback(async (tableNumber, seats) => {
    await tableService.addTable(restaurantId, tableNumber, seats);
    await fetchAll();
  }, [restaurantId, fetchAll]);

  const updateTable = useCallback(async (tableId, updates) => {
    await tableService.updateTable(tableId, updates);
    await fetchAll();
  }, [fetchAll]);

  const deleteTable = useCallback(async (tableId) => {
    await tableService.deleteTable(tableId);
    await fetchAll();
  }, [fetchAll]);

  const releaseTable = useCallback(async (tableNumber) => {
    await tableService.completeOrdersForTable(restaurantId, tableNumber);
    await fetchAll();
  }, [restaurantId, fetchAll]);

  // Enrich tables with occupancy status + ALL active orders
  const enrichedTables = tables.map(table => {
    const tableOrders = activeOrders
      .filter(o => o.table_number === table.table_number)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const grandTotal = tableOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    return {
      ...table,
      status: tableOrders.length > 0 ? 'occupied' : 'free',
      activeOrders: tableOrders,
      orderCount: tableOrders.length,
      grandTotal,
    };
  });

  return {
    tables: enrichedTables,
    loading,
    addTable,
    updateTable,
    deleteTable,
    releaseTable,
    refetch: fetchAll,
  };
}
