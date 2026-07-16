import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { restaurantService } from '../services/restaurantService';

export function useRestaurant() {
  const { restaurantId } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRestaurant = useCallback(async () => {
    try {
      const data = await restaurantService.fetchRestaurant(restaurantId);
      setRestaurant(data);
    } catch (err) {
      console.error('Error fetching restaurant:', err);
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => { fetchRestaurant(); }, [fetchRestaurant]);

  const updateRestaurant = useCallback(async (updates) => {
    const data = await restaurantService.updateRestaurant(restaurantId, updates);
    setRestaurant(data);
    return data;
  }, [restaurantId]);

  return { restaurant, loading, updateRestaurant, refetch: fetchRestaurant };
}
