import { create } from 'zustand';

export interface OrderItem {
  id: string;
  name: string;
  box: string;
  price: number;
  discount: number;
  image: string;
  quantity: number;
  isAccelerator: boolean;
  paymentTerm?: {
    id: string;
    days: number;
    description: string;
  };
}

export interface Client {
  id: string;
  name: string;
  code: string;
  cnpj: string;
  address: string;
}

export interface PaymentTerm {
  id: string;
  days: number;
  description: string;
}

interface OrderState {
  items: OrderItem[];
  client?: Client;
  paymentTerm?: PaymentTerm;
  addItem: (item: OrderItem) => void;
  removeItem: (index: number) => void;
  updateItemQuantity: (index: number, quantity: number) => void;
  clearOrder: () => void;
  setClient: (client: Client) => void;
  setPaymentTerm: (term: PaymentTerm) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  items: [],
  client: undefined,
  paymentTerm: undefined,
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (index) => set((state) => ({ 
    items: state.items.filter((_, i) => i !== index) 
  })),
  updateItemQuantity: (index, quantity) => set((state) => ({
    items: state.items.map((item, i) => 
      i === index ? { ...item, quantity } : item
    )
  })),
  clearOrder: () => set({ items: [], client: undefined, paymentTerm: undefined }),
  setClient: (client) => set({ client }),
  setPaymentTerm: (term) => set({ paymentTerm: term }),
})); 