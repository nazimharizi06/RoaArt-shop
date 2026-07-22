"use client";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem { id: string; title: string; price: number; quantity: number; maxQuantity: number; imageUrl?: string | null; }
interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}
export const useCart = create<CartStore>()(persist((set) => ({
  items: [],
  addItem: (item) => set((state) => {
    const existing = state.items.find((entry) => entry.id === item.id);
    if (!existing) return { items: [...state.items, { ...item, quantity: Math.min(item.quantity, item.maxQuantity) }] };
    return { items: state.items.map((entry) => entry.id === item.id ? { ...entry, quantity: Math.min(entry.quantity + item.quantity, entry.maxQuantity) } : entry) };
  }),
  updateQuantity: (id, quantity) => set((state) => ({ items: state.items.map((item) => item.id === id ? { ...item, quantity: Math.max(1, Math.min(quantity, item.maxQuantity)) } : item) })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  clearCart: () => set({ items: [] }),
}), { name: 'roa-art-cart' }));
