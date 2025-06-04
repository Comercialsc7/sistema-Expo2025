import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { OrderItem, Client, PaymentTerm } from './useOrderStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CachedOrder {
  id: string;
  items: OrderItem[];
  client: Client;
  paymentTerm: PaymentTerm;
  timestamp: string;
  subtotal: number;
  total: number;
  discount: number;
  spinPrize?: {
    type: 'product' | 'no_prize';
    description: string;
    photo?: string;
  };
}

interface CachedOrdersState {
  cachedOrders: CachedOrder[];
  _hasHydrated: boolean;
  addCachedOrder: (order: CachedOrder) => void;
  clearCachedOrders: () => void;
  getOrderById: (id: string) => CachedOrder | undefined;
  setHasHydrated: (state: boolean) => void;
}

export const useCachedOrdersStore = create<CachedOrdersState>()(
  persist(
    (set, get) => ({
      cachedOrders: [],
      _hasHydrated: false,
      addCachedOrder: (order) => set((state) => ({
        cachedOrders: [...state.cachedOrders, order],
      })),
      clearCachedOrders: () => set({ cachedOrders: [] }),
      getOrderById: (id) => get().cachedOrders.find(order => order.id === id),
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state
        });
      },
    }),
    {
      name: 'cached-orders-storage',
      storage: createJSONStorage(() => AsyncStorage as any),
      onRehydrateStorage: (state) => {
        return (state, error) => {
          if (error) {
            console.error('cached-orders-storage hydration failed', error);
          } else {
            (state as CachedOrdersState).setHasHydrated(true);
          }
        };
      },
    }
  )
);