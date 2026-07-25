import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { useSharedCart } from '../hooks/useSharedCart';
import { isSupabaseConfigured } from '../lib/supabase';

const CartContext = createContext(null);

// Generate unique cart item ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// Reducer (local fallback only)
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, selectedOptions } = action.payload;
      const optionsModifier = selectedOptions.reduce((sum, o) => sum + o.price_modifier, 0);
      const lineTotal = (product.price + optionsModifier) * quantity;

      const newItem = {
        cartItemId: generateId(),
        productId: product.id,
        name: product.name,
        image: product.image_url,
        basePrice: product.price,
        quantity,
        selectedOptions,
        lineTotal,
      };

      return { ...state, items: [...state.items, newItem] };
    }

    case 'UPDATE_QUANTITY': {
      const { cartItemId, quantity } = action.payload;
      if (quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.cartItemId !== cartItemId) };
      }
      return {
        ...state,
        items: state.items.map(item => {
          if (item.cartItemId !== cartItemId) return item;
          const optionsModifier = item.selectedOptions.reduce((sum, o) => sum + o.price_modifier, 0);
          return {
            ...item,
            quantity,
            lineTotal: (item.basePrice + optionsModifier) * quantity,
          };
        }),
      };
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.cartItemId !== action.payload) };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    default:
      return state;
  }
}

// Local-only cart hook (fallback)
function useLocalCart() {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const addItem = useCallback((product, quantity, selectedOptions) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, selectedOptions } });
  }, []);

  const updateQuantity = useCallback((cartItemId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { cartItemId, quantity } });
  }, []);

  const removeItem = useCallback((cartItemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: cartItemId });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const totalItems = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items]
  );

  const totalPrice = useMemo(
    () => state.items.reduce((sum, i) => sum + i.lineTotal, 0),
    [state.items]
  );

  const getProductCount = useCallback(
    (productId) => state.items.filter(i => i.productId === productId).reduce((sum, i) => sum + i.quantity, 0),
    [state.items]
  );

  return {
    items: state.items,
    totalItems,
    totalPrice,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getProductCount,
    isShared: false,
    orderValidated: false,
    resetValidated: () => {},
    submitSharedOrder: null,
    isValidating: false,
  };
}

// Provider
export function CartProvider({ tableId, children }) {
  const shared = useSharedCart(tableId);
  const local = useLocalCart();

  // Use shared cart when Supabase is configured and we have a tableId
  const useShared = isSupabaseConfigured && tableId;
  const value = useShared ? shared : local;

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Hook
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
