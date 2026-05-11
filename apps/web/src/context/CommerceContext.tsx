'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  variantName: string;
  price: number;
  quantity: number;
}

interface CommerceContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  
  // Customer Auth
  customer: any | null;
  loginCustomer: (data: any) => Promise<void>;
  logoutCustomer: () => void;
  isCustomerLoggedIn: boolean;
}

const CommerceContext = createContext<CommerceContextType | undefined>(undefined);

export const CommerceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<any | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('zhiin_cart');
    const savedCustomer = localStorage.getItem('zhiin_customer');
    
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) {}
    }
    if (savedCustomer) {
      try { setCustomer(JSON.parse(savedCustomer)); } catch (e) {}
    }
  }, []);

  // Save state to localStorage on change
  useEffect(() => {
    localStorage.setItem('zhiin_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (customer) {
      localStorage.setItem('zhiin_customer', JSON.stringify(customer));
    } else {
      localStorage.removeItem('zhiin_customer');
    }
  }, [customer]);

  const loginCustomer = async (data: any) => {
    const result = await commerceService.loginCustomer(data);
    setCustomer(result.customer);
    localStorage.setItem('zhiin_customer_token', result.accessToken);
  };

  const logoutCustomer = () => {
    setCustomer(null);
    localStorage.removeItem('zhiin_customer_token');
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.variantId === item.variantId);
      if (existing) {
        return prev.map(i => 
          i.variantId === item.variantId 
            ? { ...i, quantity: i.quantity + item.quantity } 
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (variantId: string) => {
    setCart(prev => prev.filter(i => i.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setCart(prev => prev.map(i => 
      i.variantId === variantId ? { ...i, quantity } : i
    ));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CommerceContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      cartTotal,
      cartCount,
      customer,
      loginCustomer,
      logoutCustomer,
      isCustomerLoggedIn: !!customer
    }}>
      {children}
    </CommerceContext.Provider>
  );
};

export const useCommerce = () => {
  const context = useContext(CommerceContext);
  if (!context) {
    throw new Error('useCommerce must be used within a CommerceProvider');
  }
  return context;
};
