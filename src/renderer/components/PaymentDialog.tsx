import * as React from 'react';
import { useState, useEffect } from 'react';
import { theme } from '../styles/theme';
import { PaymentOption, PAYMENT_OPTIONS } from '../types/types';

interface PaymentDialogProps {
  total: number;
  onClose: () => void;
  onComplete: (receivedAmount: number, changeAmount: number, tipAmount: number) => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  total,
  onClose,
  onComplete
}) => {
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [changeAmount, setChangeAmount] = useState(0);
  const [tipAmount, setTipAmount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const finalTotal = total + tipAmount;

  useEffect(() => {
    setChangeAmount(Math.max(0, receivedAmount - finalTotal));
    
    if (receivedAmount > 0 && receivedAmount < finalTotal) {
      setError(`Noch ${(finalTotal - receivedAmount).toFixed(2)} € fehlen`);
    } else {
      setError(null);
    }
  }, [receivedAmount, finalTotal]);

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

  const tipSectionStyles: React.CSSProperties = {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    background: theme.colors.background,
    borderRadius: '4px',
    display: 'flex',
    gap: theme.spacing.md,
    alignItems: 'center'
  };

  const tipInputStyles: React.CSSProperties = {
    padding: theme.spacing.sm,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '4px',
    width: '100px'
  };

  const amountDisplayStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    background: theme.colors.background,
    borderRadius: '4px',
    marginBottom: theme.spacing.md
  };

  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl
  };

  const handleTipChange = (value: string) => {
    const tip = parseFloat(value);
    if (!isNaN(tip) && tip >= 0) {
      setTipAmount(Number(tip.toFixed(2)));
    } else {
      setTipAmount(0);
    }
  };

  return (
    <div style={overlayStyles}>
      <div style={dialogStyles}>
        <h2 style={{ marginTop: 0 }}>Zahlung</h2>

        <div style={amountDisplayStyles}>
          <span>Zu zahlen:</span>
          <span>{total.toFixed(2)} €</span>
        </div>

        <div style={tipSectionStyles}>
          <span style={{ fontWeight: 500 }}>Trinkgeld:</span>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={tipAmount || ''}
            onChange={(e) => handleTipChange(e.target.value)}
            style={tipInputStyles}
          />
          <span>€</span>
        </div>

        <div style={{
          ...amountDisplayStyles,
          fontWeight: 'bold',
          background: theme.colors.primary,
          color: theme.colors.textLight
        }}>
          <span>Gesamt:</span>
          <span>{finalTotal.toFixed(2)} €</span>
        </div>

        <div style={amountDisplayStyles}>
          <span>Erhalten:</span>
          <span>{receivedAmount.toFixed(2)} €</span>
        </div>

        <div style={amountDisplayStyles}>
          <span>Rückgeld:</span>
          <span>{changeAmount.toFixed(2)} €</span>
        </div>

        {error && (
          <div style={{
            color: theme.colors.error,
            padding: theme.spacing.md,
            marginBottom: theme.spacing.md,
            background: 'rgba(204, 59, 59, 0.1)',
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <div style={gridStyles}>
          {PAYMENT_OPTIONS.map((option, index) => (
            <button
              key={index}
              onClick={() => setReceivedAmount(prev => prev + option.value)}
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
              if (receivedAmount >= finalTotal) {
                onComplete(receivedAmount, changeAmount, tipAmount);
              }
            }}
            disabled={receivedAmount < finalTotal}
            style={{
              flex: 1,
              padding: theme.spacing.md,
              background: receivedAmount < finalTotal ? theme.colors.border : theme.colors.primary,
              color: receivedAmount < finalTotal ? theme.colors.text : theme.colors.textLight,
              border: 'none',
              borderRadius: '4px',
              cursor: receivedAmount < finalTotal ? 'not-allowed' : 'pointer',
              opacity: receivedAmount < finalTotal ? 0.7 : 1
            }}
          >
            Abschließen
          </button>
          <button
            onClick={() => {
              setReceivedAmount(0);
              setChangeAmount(0);
              setTipAmount(0);
            }}
            style={{
              flex: 1,
              padding: theme.spacing.md,
              background: theme.colors.secondary,
              color: theme.colors.textLight,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Zurücksetzen
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