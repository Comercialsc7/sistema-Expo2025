import { create } from 'zustand';
import { OrderItem, Client, PaymentTerm } from './useOrderStore'; // Importa as definições necessárias

export interface CachedOrder {
  id: string;
  items: OrderItem[];
  client: Client;
  paymentTerm: PaymentTerm;
  timestamp: string;
  // Adicionar outros campos se necessário
}

interface CachedOrdersState {
  cachedOrders: CachedOrder[]; // Usar a nova interface CachedOrder
  addCachedOrder: (order: CachedOrder) => void; // Aceitar CachedOrder
  clearCachedOrders: () => void;
}

export const useCachedOrdersStore = create<CachedOrdersState>((set) => ({
  cachedOrders: [],
  addCachedOrder: (order) => set((state) => ({
    cachedOrders: [...state.cachedOrders, order],
  })),
  clearCachedOrders: () => set({ cachedOrders: [] }),
})); 