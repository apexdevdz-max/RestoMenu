import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { tableService } from '../services/tableService';

export function useTables() {
  const { restaurantId } = useAuth();
  const [tables, setTables] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Enrich tables with occupancy status
  const enrichedTables = tables.map(table => {
    const order = activeOrders.find(o => o.table_number === table.table_number);
    return {
      ...table,
      status: order ? 'occupied' : 'free',
      activeOrderId: order?.id || null,
    };
  });

  return { tables: enrichedTables, loading, refetch: fetchAll };
}
