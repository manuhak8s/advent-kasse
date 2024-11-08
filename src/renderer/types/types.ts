export interface Product {
    id: string;
    name: string;
    price: number;
  }
  
  export interface Transaction {
    productId: string;
    quantity: number;
    price: number;
    timestamp: Date;
  }
  
  export interface CartItem extends Product {
    quantity: number;
  }
  
  // Für das Bezahlfenster
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