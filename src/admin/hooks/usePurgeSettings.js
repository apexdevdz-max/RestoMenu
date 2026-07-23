import { useState, useCallback } from 'react';

const STORAGE_KEY = 'elmawid_purge_settings';

const DEFAULT_SETTINGS = {
  purge_mode: 'delay',  // 'delay' or 'fixed_time'
  purge_value: '4',     // hours for delay, or 'HH:MM' for fixed_time
};

export function usePurgeSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const saveSettings = useCallback(async (newSettings) => {
    setSaving(true);
    setSuccess(false);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving purge settings:', err);
    } finally {
      setSaving(false);
    }
  }, []);

  return { settings, saveSettings, saving, success };
}

/**
 * Returns the IDs of processed orders that should be DELETED
 * based on the purge settings stored in localStorage.
 */
export function getOrdersToDelete(orders) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const { purge_mode, purge_value } = JSON.parse(stored);
    const now = new Date();

    if (purge_mode === 'delay') {
      const hoursAgo = parseInt(purge_value, 10);
      if (isNaN(hoursAgo) || hoursAgo <= 0) return [];

      const cutoff = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);

      return orders
        .filter(order => {
          if (order.status !== 'processed' && order.status !== 'completed') return false;
          const orderDate = new Date(order.processed_at || order.updated_at || order.created_at);
          return orderDate < cutoff;
        })
        .map(o => o.id);
    }

    if (purge_mode === 'fixed_time') {
      const [hours, minutes] = purge_value.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) return [];

      const resetTime = new Date(now);
      resetTime.setHours(hours, minutes, 0, 0);

      const effectiveReset = now >= resetTime
        ? resetTime
        : new Date(resetTime.getTime() - 24 * 60 * 60 * 1000);

      return orders
        .filter(order => {
          if (order.status !== 'processed' && order.status !== 'completed') return false;
          const orderDate = new Date(order.processed_at || order.updated_at || order.created_at);
          return orderDate < effectiveReset;
        })
        .map(o => o.id);
    }

    return [];
  } catch {
    return [];
  }
}
