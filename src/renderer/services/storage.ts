import { Product, BaseTransaction, StoredTransaction } from '../types/types';

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

  saveTransaction: (transaction: BaseTransaction): void => {
    const transactions = StorageService.getStoredTransactions();
    const storedTransaction: StoredTransaction = {
      ...transaction,
      timestamp: transaction.timestamp.toISOString()
    };
    transactions.push(storedTransaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
  },

  getStoredTransactions: (): StoredTransaction[] => {
    const stored = localStorage.getItem('transactions');
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  },

  getTransactions: (): BaseTransaction[] => {
    const storedTransactions = StorageService.getStoredTransactions();
    return storedTransactions.map(t => ({
      ...t,
      timestamp: new Date(t.timestamp)
    }));
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