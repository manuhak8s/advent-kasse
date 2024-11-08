export interface Product {
    id: string;
    name: string;
    price: number;
  }
  
  // Basistyp für Transaktionen
  export interface BaseTransaction {
    productId: string;
    quantity: number;
    price: number;
    timestamp: Date;
    tip: number;  // Trinkgeld wurde zu Basis hinzugefügt
  }
  
  // Gespeicherter Transaktionstyp
  export interface StoredTransaction extends Omit<BaseTransaction, 'timestamp'> {
    timestamp: string;
  }
  
  // Typ für die Statistik
  export interface ProductStat {
    productId: string;
    productName: string;
    quantity: number;
    totalRevenue: number;
  }
  
  export interface CartItem extends Product {
    quantity: number;
  }
  
  export interface PaymentOption {
    value: number;
    type: 'coin' | 'bill';
    label: string;
  }
  
  export const PAYMENT_OPTIONS: PaymentOption[] = [
    { value: 0.01, type: 'coin', label: '1 Cent' },
    { value: 0.02, type: 'coin', label: '2 Cent' },
    { value: 0.05, type: 'coin', label: '5 Cent' },
    { value: 0.10, type: 'coin', label: '10 Cent' },
    { value: 0.20, type: 'coin', label: '20 Cent' },
    { value: 0.50, type: 'coin', label: '50 Cent' },
    { value: 1.00, type: 'coin', label: '1 Euro' },
    { value: 2.00, type: 'coin', label: '2 Euro' },
    { value: 5.00, type: 'bill', label: '5 Euro' },
    { value: 10.00, type: 'bill', label: '10 Euro' },
    { value: 20.00, type: 'bill', label: '20 Euro' },
    { value: 50.00, type: 'bill', label: '50 Euro' },
    { value: 100.00, type: 'bill', label: '100 Euro' },
    { value: 200.00, type: 'bill', label: '200 Euro' }
  ];