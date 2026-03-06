'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, getToken } from '@/infrastructure/api';
import type { CurrentUser, CartItem, Order } from '@/domain/entities';

export type { CurrentUser, CartItem };
export type OrderConfirmation = Order;

function generateOrderId() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let id = '';
  for (let i = 0; i < 14; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

interface AppContextValue {
  currentUser: CurrentUser | null;
  cartItems: CartItem[];
  lastOrder: Order | null;
  orderHistory: Order[];
  signInWarning: string | null;
  setSignInWarning: (msg: string | null) => void;
  registerUser: (name: string, email: string, password: string, phone: string, confirmPassword: string) => Promise<{ success: true } | { success: false; message: string }>;
  validateLogin: (email: string, password: string) => Promise<{ success: boolean; isAdmin?: boolean }>;
  addToCart: (productId: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: (data: { receiverName: string; phone: string; address: string; paymentMethod: string }) => Promise<void>;
  updateOrder: (orderId: string, data: { receiverName: string; phone: string; address: string; paymentMethod: string }) => Promise<boolean>;
  refreshOrderHistory: () => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [signInWarning, setSignInWarning] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!getToken()) return;
    api.auth.me().then((res) => {
      if (res.success) {
        setCurrentUser(res.user);
        if (res.user?.role === 'admin') {
          router.replace('/admin');
        } else {
          api.cart.get().then((r) => {
            if (r.success && r.items.length) setCartItems(r.items);
          });
        }
      } else {
        api.auth.logout();
      }
    }).catch(() => {});
  }, [router]);

  const syncCartToBackend = useCallback((items: CartItem[]) => {
    if (!currentUser || !getToken()) return;
    api.cart.set(items).catch(() => {});
  }, [currentUser]);

  const registerUser = useCallback(async (
    name: string,
    email: string,
    password: string,
    phone: string,
    confirmPassword: string
  ): Promise<{ success: true } | { success: false; message: string }> => {
    const res = await api.auth.register({ name, email, password, confirmPassword, phone });
    if (res.success) {
      setSignInWarning(null);
      setCurrentUser(res.user);
      return { success: true };
    }
    return { success: false, message: res.message || 'Registration failed' };
  }, []);

  const validateLogin = useCallback(async (email: string, password: string): Promise<{ success: boolean; isAdmin?: boolean }> => {
    const res = await api.auth.login(email.trim(), password);
    if (!res.success) return { success: false };
    setSignInWarning(null);
    setCurrentUser(res.user);
    const cartRes = await api.cart.get();
    if (cartRes.success && cartRes.items.length) setCartItems(cartRes.items);
    return { success: true, isAdmin: res.user?.role === 'admin' };
  }, []);

  const addToCart = useCallback((productId: string, quantity = 1) => {
    if (!currentUser) {
      setSignInWarning('Please sign in first to add items to your cart.');
      return;
    }
    setCartItems((prev) => {
      const i = prev.findIndex((x) => x.productId === productId);
      const next = i >= 0
        ? prev.map((x, idx) => idx === i ? { ...x, quantity: x.quantity + quantity } : x)
        : [...prev, { productId, quantity }];
      syncCartToBackend(next);
      return next;
    });
  }, [currentUser, syncCartToBackend]);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => {
        const next = prev.filter((x) => x.productId !== productId);
        syncCartToBackend(next);
        return next;
      });
      return;
    }
    setCartItems((prev) => {
      const next = prev.map((x) => (x.productId === productId ? { ...x, quantity } : x));
      syncCartToBackend(next);
      return next;
    });
  }, [syncCartToBackend]);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prev) => {
      const next = prev.filter((x) => x.productId !== productId);
      syncCartToBackend(next);
      return next;
    });
  }, [syncCartToBackend]);

  const placeOrder = useCallback(async (data: { receiverName: string; phone: string; address: string; paymentMethod: string }) => {
    let order: Order;
    if (currentUser && getToken()) {
      const res = await api.orders.create(data);
      if (res.success) {
        order = res.order;
        await api.cart.clear();
      } else {
        order = {
          orderId: generateOrderId(),
          receiverName: data.receiverName,
          phone: data.phone,
          address: data.address,
          paymentMethod: data.paymentMethod,
        };
      }
    } else {
      order = {
        orderId: generateOrderId(),
        receiverName: data.receiverName,
        phone: data.phone,
        address: data.address,
        paymentMethod: data.paymentMethod,
      };
    }
    setLastOrder(order);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('handicraft_last_order', JSON.stringify(order));
    }
    router.push('/confirmation');
  }, [currentUser, router]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const updateOrder = useCallback(async (
    orderId: string,
    data: { receiverName: string; phone: string; address: string; paymentMethod: string }
  ): Promise<boolean> => {
    const res = await api.orders.update(orderId, data);
    if (!res.success) return false;
    const list = await api.orders.getMy();
    if (list.success) setOrderHistory(list.orders);
    return true;
  }, []);

  const logout = useCallback(() => {
    api.auth.logout();
    setCurrentUser(null);
    setCartItems([]);
    router.push('/');
  }, [router]);

  const refreshOrderHistory = useCallback(async () => {
    if (currentUser && getToken()) {
      const r = await api.orders.getMy();
      if (r.success) setOrderHistory(r.orders);
    }
  }, [currentUser]);

  const value: AppContextValue = {
    currentUser,
    cartItems,
    lastOrder,
    orderHistory,
    signInWarning,
    setSignInWarning,
    registerUser,
    validateLogin,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
    updateOrder,
    refreshOrderHistory,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
