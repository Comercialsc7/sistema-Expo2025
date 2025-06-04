import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { OrderItem, Client, PaymentTerm } from './useOrderStore'; // Importa as definições necessárias
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
  // Adicionar outros campos se necessário
}

interface CachedOrdersState {
  cachedOrders: CachedOrder[]; // Usar a nova interface CachedOrder
  _hasHydrated: boolean; // Adicionar estado para controle de hidratação
  addCachedOrder: (order: CachedOrder) => void; // Aceitar CachedOrder
  clearCachedOrders: () => void;
  getOrderById: (id: string) => CachedOrder | undefined;
  setHasHydrated: (state: boolean) => void; // Adicionar ação para atualizar o estado de hidratação
}

export const useCachedOrdersStore = create<CachedOrdersState>()(
  persist(
    (set, get) => ({
      cachedOrders: [],
      _hasHydrated: false, // Inicialmente false
      addCachedOrder: (order) => set((state) => ({
        cachedOrders: [...state.cachedOrders, order],
      })),
      clearCachedOrders: () => set({ cachedOrders: [] }),
      getOrderById: (id) => get().cachedOrders.find(order => order.id === id),
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state
        });
      }, // Implementação da ação
    }),
    {
      name: 'cached-orders-storage',
      storage: createJSONStorage(() => AsyncStorage as any), // Usar AsyncStorage
      onRehydrateStorage: (state) => {
        console.log('cached-orders-storage hydration starts');
        return (state, error) => {
          if (error) {
            console.error('cached-orders-storage hydration failed', error);
          } else {
            console.log('cached-orders-storage hydration finished');
            (state as CachedOrdersState).setHasHydrated(true);
          }
        };
      },
    }
  )
); 