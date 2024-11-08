import * as React from 'react';
import { useState, useEffect } from 'react';
import { theme } from '../styles/theme';
import { Product, CartItem } from '../types/types';
import CashRegister from '../components/CashRegister';
import ProductGrid from '../components/ProductGrid';
import ProductEditor from '../components/ProductEditor';
import PaymentDialog from '../components/PaymentDialog';
import { StorageService } from '../services/storage';

const Homepage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cashBalance, setCashBalance] = useState(0);
  const [showProductEditor, setShowProductEditor] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  useEffect(() => {
    setProducts(StorageService.loadProducts());
    setCashBalance(StorageService.loadCashBalance());
  }, []);

  const handleProductClick = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCheckout = () => {
    setShowPaymentDialog(true);
  };

  const handlePaymentComplete = (receivedAmount: number, changeAmount: number) => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newBalance = cashBalance + total;
    
    setCashBalance(newBalance);
    StorageService.saveCashBalance(newBalance);
    setCartItems([]);
    setShowPaymentDialog(false);
  };

  const handleSaveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    StorageService.saveProducts(newProducts);
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: theme.spacing.md,
      height: '100%',
      padding: '0 8px 8px 8px',
      overflow: 'hidden',
    }}>
      <div style={{ 
        height: '100%',
        overflow: 'hidden'
      }}>
        <CashRegister
          cashBalance={cashBalance}
          cartItems={cartItems}
          onClearCart={handleClearCart}
          onCheckout={handleCheckout}
        />
      </div>
      
      <div style={{ 
        height: '100%',
        overflow: 'hidden'
      }}>
        <ProductGrid
          products={products}
          cartItems={cartItems}
          onProductClick={handleProductClick}
          onEditProducts={() => setShowProductEditor(true)}
        />
      </div>

      {showProductEditor && (
        <ProductEditor
          products={products}
          onClose={() => setShowProductEditor(false)}
          onSave={handleSaveProducts}
        />
      )}

      {showPaymentDialog && (
        <PaymentDialog
          total={cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
          onClose={() => setShowPaymentDialog(false)}
          onComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
};

export default Homepage;