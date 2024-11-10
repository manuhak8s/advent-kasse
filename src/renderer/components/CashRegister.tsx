import * as React from 'react';
import { useState } from 'react';
import { theme } from '../styles/theme';
import { CartItem } from '../types/types';

interface CashRegisterProps {
  cashBalance: number;
  cartItems: CartItem[];
  onClearCart: () => void;
  onCheckout: () => void;
  onRemoveItem: (item: CartItem) => void;  // Neue Prop für das Entfernen einzelner Items
}

const CashRegister: React.FC<CashRegisterProps> = ({
  cashBalance,
  cartItems,
  onClearCart,
  onCheckout,
  onRemoveItem
}) => {
  const containerStyles: React.CSSProperties = {
    background: theme.colors.surface,
    padding: theme.spacing.lg,
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

  const cartStyles: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    minHeight: 0,
    padding: theme.spacing.sm
  };

  const cartItemStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderBottom: `1px solid ${theme.colors.border}`,
    gap: theme.spacing.md
  };

  const deleteButtonStyles: React.CSSProperties = {
    background: theme.colors.error,
    color: theme.colors.textLight,
    border: 'none',
    borderRadius: '4px',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontWeight: 'bold',
    padding: 0,
    fontSize: '16px'
  };

  const itemInfoStyles: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
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

  const actionButtonStyles = (isCancel: boolean): React.CSSProperties => ({
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
          <div key={`${item.id}-${index}`} style={cartItemStyles}>
            <button 
              style={deleteButtonStyles}
              onClick={() => onRemoveItem(item)}
              title="Produkt entfernen"
            >
              −
            </button>
            <div style={itemInfoStyles}>
              <span>{item.quantity}x {item.name}</span>
              <span>{(item.price * item.quantity).toFixed(2)} €</span>
            </div>
          </div>
        ))}
      </div>

      <div style={totalStyles}>
        <span>Zwischensumme:</span>
        <span>{total.toFixed(2)} €</span>
      </div>

      <div style={buttonContainerStyles}>
        <button 
          style={actionButtonStyles(true)}
          onClick={onClearCart}
        >
          Storno
        </button>
        <button 
          style={actionButtonStyles(false)}
          onClick={onCheckout}
        >
          Buchen
        </button>
      </div>
    </div>
  );
};

export default CashRegister;