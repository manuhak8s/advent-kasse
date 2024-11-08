import * as React from 'react';
import { useState, useEffect } from 'react';
import { theme } from '../styles/theme';
import { PaymentOption, PAYMENT_OPTIONS } from '../types/types';

interface PaymentDialogProps {
  total: number;
  onClose: () => void;
  onComplete: (receivedAmount: number, changeAmount: number) => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  total,
  onClose,
  onComplete
}) => {
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [changeAmount, setChangeAmount] = useState(0);

  useEffect(() => {
    setChangeAmount(Math.max(0, receivedAmount - total));
  }, [receivedAmount, total]);

  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const dialogStyles: React.CSSProperties = {
    background: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: '8px',
    boxShadow: theme.shadows.large,
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto'
  };

  const headerStyles: React.CSSProperties = {
    marginBottom: theme.spacing.lg,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl
  };

  const amountDisplayStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    background: theme.colors.background,
    borderRadius: '4px',
    marginBottom: theme.spacing.md
  };

  const handlePaymentOptionClick = (option: PaymentOption) => {
    setReceivedAmount(prev => prev + option.value);
  };

  return (
    <div style={overlayStyles}>
      <div style={dialogStyles}>
        <div style={headerStyles}>
          <h2 style={{ margin: 0 }}>Zahlung</h2>
          <div style={amountDisplayStyles}>
            <span>Zu zahlen:</span>
            <span>{total.toFixed(2)} €</span>
          </div>
        </div>

        <div style={amountDisplayStyles}>
          <span>Erhalten:</span>
          <span>{receivedAmount.toFixed(2)} €</span>
        </div>

        <div style={amountDisplayStyles}>
          <span>Rückgeld:</span>
          <span>{changeAmount.toFixed(2)} €</span>
        </div>

        <div style={gridStyles}>
          {PAYMENT_OPTIONS.map((option, index) => (
            <button
              key={index}
              onClick={() => handlePaymentOptionClick(option)}
              style={{
                padding: theme.spacing.md,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '4px',
                background: option.type === 'bill' ? theme.colors.primary : theme.colors.secondary,
                color: theme.colors.textLight,
                cursor: 'pointer'
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: theme.spacing.md }}>
          <button
            onClick={() => {
              onComplete(receivedAmount, changeAmount);
              onClose();
            }}
            style={{
              flex: 1,
              padding: theme.spacing.md,
              background: theme.colors.primary,
              color: theme.colors.textLight,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Abschließen
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: theme.spacing.md,
              background: theme.colors.error,
              color: theme.colors.textLight,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDialog;