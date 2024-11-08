import { Product } from '../types/types';

export const StorageService = {
  saveProducts: (products: Product[]): void => {
    localStorage.setItem('products', JSON.stringify(products));
  },

  loadProducts: (): Product[] => {
    const stored = localStorage.getItem('products');
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  },

  saveCashBalance: (balance: number): void => {
    localStorage.setItem('cashBalance', balance.toString());
  },

  loadCashBalance: (): number => {
    const stored = localStorage.getItem('cashBalance');
    if (stored) {
      return parseFloat(stored);
    }
    return 0;
  }
};