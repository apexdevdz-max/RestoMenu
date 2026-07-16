import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { menuItemService } from '../services/menuItemService';

export function useMenuItems(categoryId) {
  const { restaurantId } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await menuItemService.fetchItems(restaurantId, categoryId);
      setItems(data);
    } catch (err) {
      console.error('Error fetching menu items:', err);
    } finally {
      setLoading(false);
    }
  }, [restaurantId, categoryId]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const createItem = useCallback(async (item) => {
    const created = await menuItemService.createItem(restaurantId, item);
    setItems(prev => [...prev, created]);
    return created;
  }, [restaurantId]);

  const updateItem = useCallback(async (id, updates) => {
    const updated = await menuItemService.updateItem(id, updates);
    setItems(prev => prev.map(i => i.id === id ? updated : i));
    return updated;
  }, []);

  const deleteItem = useCallback(async (id) => {
    await menuItemService.deleteItem(id);
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const toggleAvailability = useCallback(async (id, available) => {
    const updated = await menuItemService.toggleAvailability(id, available);
    setItems(prev => prev.map(i => i.id === id ? updated : i));
  }, []);

  return { items, loading, createItem, updateItem, deleteItem, toggleAvailability, refetch: fetchItems };
}
