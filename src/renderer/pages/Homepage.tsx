import * as React from 'react';
import { useState, useEffect } from 'react';
import { theme } from '../styles/theme';
import { Product, CartItem, BaseTransaction } from '../types/types';
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

  const handlePaymentComplete = (receivedAmount: number, changeAmount: number, tipAmount: number) => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newBalance = cashBalance + total + tipAmount;
    
    // Erstelle eine Transaktion für jedes Produkt im Warenkorb
    cartItems.forEach(item => {
      // Berechne den anteiligen Trinkgeldanteil pro Produkt
      const itemTotalPrice = item.price * item.quantity;
      const itemTipShare = (itemTotalPrice / total) * tipAmount;
      
      const transaction: BaseTransaction = {
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        timestamp: new Date(),
        tip: itemTipShare
      };
      
      StorageService.saveTransaction(transaction);
    });
    
    setCashBalance(newBalance);
    StorageService.saveCashBalance(newBalance);
    setCartItems([]);
    setShowPaymentDialog(false);
  };

  const handleSaveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    StorageService.saveProducts(newProducts);
  };

  const handleRemoveItem = (itemToRemove: CartItem) => {
    setCartItems(prevItems => {
      if (itemToRemove.quantity > 1) {
        // Wenn Menge > 1, reduziere die Menge um 1
        return prevItems.map(item =>
          item.id === itemToRemove.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        // Wenn Menge = 1, entferne das Item komplett
        return prevItems.filter(item => item.id !== itemToRemove.id);
      }
    });
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
          onRemoveItem={handleRemoveItem}
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