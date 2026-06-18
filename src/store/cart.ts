import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string; // combination of productId and options
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === newItem.id);
          const addQuantity = newItem.quantity || 1;
          
          if (existingItem) {
            // Update quantity, respecting stock limit
            const newQuantity = Math.min(existingItem.quantity + addQuantity, existingItem.stock);
            return {
              items: state.items.map((item) =>
                item.id === newItem.id ? { ...item, quantity: newQuantity } : item
              ),
            };
          }
          
          return { items: [...state.items, { ...newItem, quantity: addQuantity }] };
        });
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id) {
              const newQuantity = Math.max(1, Math.min(quantity, item.stock));
              return { ...item, quantity: newQuantity };
            }
            return item;
          }),
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      totalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'otostore-cart',
    }
  )
)
