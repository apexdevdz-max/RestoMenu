import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { categoryService } from '../services/categoryService';

export function useAdminCategories() {
  const { restaurantId } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await categoryService.fetchCategories(restaurantId);
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const createCategory = useCallback(async (name) => {
    const cat = await categoryService.createCategory(restaurantId, name);
    setCategories(prev => [...prev, cat]);
    return cat;
  }, [restaurantId]);

  const updateCategory = useCallback(async (id, updates) => {
    const cat = await categoryService.updateCategory(id, updates);
    setCategories(prev => prev.map(c => c.id === id ? cat : c));
    return cat;
  }, []);

  const deleteCategory = useCallback(async (id) => {
    await categoryService.deleteCategory(id);
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  return { categories, loading, createCategory, updateCategory, deleteCategory, refetch: fetchCategories };
}
