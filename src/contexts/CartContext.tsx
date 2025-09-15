import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, PromoCode, Address, PaymentMethod } from '../types/commerce';

interface CartState {
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  promoCode?: PromoCode;
  shippingAddress?: Address;
  billingAddress?: Address;
  paymentMethod?: PaymentMethod;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'APPLY_PROMO'; payload: PromoCode }
  | { type: 'REMOVE_PROMO' }
  | { type: 'SET_SHIPPING_ADDRESS'; payload: Address }
  | { type: 'SET_BILLING_ADDRESS'; payload: Address }
  | { type: 'SET_PAYMENT_METHOD'; payload: PaymentMethod }
  | { type: 'CLEAR_CART' }
  | { type: 'CALCULATE_TOTALS' };

const initialState: CartState = {
  items: [],
  subtotal: 0,
  discount: 0,
  tax: 0,
  shipping: 0,
  total: 0,
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyPromoCode: (promoCode: PromoCode) => void;
  removePromoCode: () => void;
  clearCart: () => void;
  getCartItemCount: () => number;
}>({
  state: initialState,
  dispatch: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  applyPromoCode: () => {},
  removePromoCode: () => {},
  clearCart: () => {},
  getCartItemCount: () => 0,
});

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => 
        item.productId === action.payload.productId && 
        item.planId === action.payload.planId
      );
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, items: updatedItems };
      }
      
      const newItem = {
        ...action.payload,
        id: `${action.payload.type}_${action.payload.productId || action.payload.planId}_${Date.now()}`,
      };
      
      return { ...state, items: [...state.items, newItem] };
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0),
      };
    
    case 'APPLY_PROMO':
      return { ...state, promoCode: action.payload };
    
    case 'REMOVE_PROMO':
      return { ...state, promoCode: undefined };
    
    case 'SET_SHIPPING_ADDRESS':
      return { ...state, shippingAddress: action.payload };
    
    case 'SET_BILLING_ADDRESS':
      return { ...state, billingAddress: action.payload };
    
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload };
    
    case 'CLEAR_CART':
      return initialState;
    
    case 'CALCULATE_TOTALS': {
      const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      let discount = 0;
      if (state.promoCode) {
        if (state.promoCode.discountType === 'percentage') {
          discount = subtotal * (state.promoCode.discountValue / 100);
        } else {
          discount = state.promoCode.discountValue;
        }
      }
      
      const discountedSubtotal = subtotal - discount;
      const tax = discountedSubtotal * 0.08; // 8% tax rate
      const shipping = subtotal > 100 ? 0 : 9.99; // Free shipping over $100
      const total = discountedSubtotal + tax + shipping;
      
      return {
        ...state,
        subtotal,
        discount,
        tax,
        shipping,
        total,
      };
    }
    
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  // Auto-calculate totals when items or promo code changes
  React.useEffect(() => {
    dispatch({ type: 'CALCULATE_TOTALS' });
  }, [state.items, state.promoCode]);
  
  const addToCart = (item: Omit<CartItem, 'id'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item as CartItem });
  };
  
  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };
  
  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };
  
  const applyPromoCode = (promoCode: PromoCode) => {
    dispatch({ type: 'APPLY_PROMO', payload: promoCode });
  };
  
  const removePromoCode = () => {
    dispatch({ type: 'REMOVE_PROMO' });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const getCartItemCount = () => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  };
  
  return (
    <CartContext.Provider value={{
      state,
      dispatch,
      addToCart,
      removeFromCart,
      updateQuantity,
      applyPromoCode,
      removePromoCode,
      clearCart,
      getCartItemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};