import * as React from 'react';
import { useState } from 'react';
import { theme } from '../styles/theme';
import { CartItem } from '../types/types';

interface CashRegisterProps {
  cashBalance: number;
  cartItems: CartItem[];
  onClearCart: () => void;
  onCheckout: () => void;
}

const CashRegister: React.FC<CashRegisterProps> = ({
  cashBalance,
  cartItems,
  onClearCart,
  onCheckout
}) => {
    const containerStyles: React.CSSProperties = {
        background: theme.colors.surface,
        padding: theme.spacing.md,
        borderRadius: '8px',
        boxShadow: theme.shadows.medium,
        border: `1px solid ${theme.colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.md,
        height: '100%',
        maxHeight: '100%',
        overflow: 'hidden'
      };
      
      const cartStyles: React.CSSProperties = {
        flex: 1,
        overflowY: 'auto',
        minHeight: 0, // Wichtig für Flex-Container
        padding: theme.spacing.sm
      };

  const headerStyles: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 500,
    color: theme.colors.primary,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottom: `1px solid ${theme.colors.border}`
  };

  const cartItemStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing.sm,
    borderBottom: `1px solid ${theme.colors.border}`
  };

  const totalStyles: React.CSSProperties = {
    padding: theme.spacing.md,
    borderTop: `1px solid ${theme.colors.border}`,
    fontWeight: 500,
    display: 'flex',
    justifyContent: 'space-between'
  };

  const buttonContainerStyles: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.md,
    padding: theme.spacing.md
  };

  const buttonStyles = (isCancel: boolean): React.CSSProperties => ({
    flex: 1,
    padding: theme.spacing.md,
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 500,
    background: isCancel ? theme.colors.error : theme.colors.primary,
    color: theme.colors.textLight,
    transition: 'all 0.2s'
  });

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <span>Kassenstand</span>
        <span>{cashBalance.toFixed(2)} €</span>
      </div>

      <div style={cartStyles}>
        {cartItems.map((item, index) => (
          <div key={index} style={cartItemStyles}>
            <span>{item.quantity}x {item.name}</span>
            <span>{(item.price * item.quantity).toFixed(2)} €</span>
          </div>
        ))}
      </div>

      <div style={totalStyles}>
        <span>Zwischensumme:</span>
        <span>{total.toFixed(2)} €</span>
      </div>

      <div style={buttonContainerStyles}>
        <button 
          style={buttonStyles(true)}
          onClick={onClearCart}
        >
          Storno
        </button>
        <button 
          style={buttonStyles(false)}
          onClick={onCheckout}
        >
          Buchen
        </button>
      </div>
    </div>
  );
};

export default CashRegister;