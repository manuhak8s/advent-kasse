import * as React from 'react';
import { useState, useEffect } from 'react';
import { theme } from '../styles/theme';
import { PaymentOption, PAYMENT_OPTIONS } from '../types/types';

interface PaymentDialogProps {
  total: number;
  onClose: () => void;
  onComplete: (receivedAmount: number, changeAmount: number, tipAmount: number) => void;
}

interface CustomCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  id,
  checked,
  onChange,
  label
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div
        style={{
          width: '20px',
          height: '20px',
          border: `2px solid ${theme.colors.border}`,
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          background: checked ? theme.colors.primary : 'white',
        }}
        onClick={() => onChange(!checked)}
      >
        {checked && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <label
        htmlFor={id}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        {label}
      </label>
    </div>
  );
};

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  total,
  onClose,
  onComplete
}) => {
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [changeAmount, setChangeAmount] = useState(0);
  const [tipAmount, setTipAmount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [roundUp, setRoundUp] = useState(false);

  const getRoundUpDetails = (amount: number) => {
    const roundedAmount = Math.ceil(amount);
    const tipDifference = roundedAmount - amount;
    return {
      total: roundedAmount,
      tip: tipDifference
    };
  };

  useEffect(() => {
    if (roundUp) {
      // Berechne das Aufrunden nur auf Basis des ursprünglichen Betrags
      const { tip } = getRoundUpDetails(total);
      setTipAmount(Number(tip.toFixed(2)));
    }
  }, [roundUp, total]);

  // Berechne den finalen Gesamtbetrag
  const finalTotal = roundUp 
    ? Math.ceil(total)  // Runde nur den Ursprungsbetrag auf
    : total + tipAmount;

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
    maxWidth: '900px',
    maxHeight: '90vh',
    overflow: 'auto'
  };

  const containerStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing.xl,
  };

  const leftColumnStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
  };

  const rightColumnStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
  };

  const amountDisplayStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    background: theme.colors.background,
    borderRadius: '4px',
  };

  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: theme.spacing.md,
  };

  const buttonStyles: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  };

  const handleTipChange = (value: string) => {
    const tip = parseFloat(value);
    if (!isNaN(tip) && tip >= 0) {
      setTipAmount(Number(tip.toFixed(2)));
      setRoundUp(false);
    } else {
      setTipAmount(0);
    }
  };

  const handleRoundUpChange = (checked: boolean) => {
    setRoundUp(checked);
    if (!checked) {
      setTipAmount(0);
    }
  };

  return (
    <div style={overlayStyles}>
      <div style={dialogStyles}>
        <h2 style={{ marginTop: 0, marginBottom: theme.spacing.xl }}>Zahlung</h2>

        <div style={containerStyles}>
          <div style={leftColumnStyles}>
            <div style={amountDisplayStyles}>
              <span>Zu zahlen:</span>
              <span>{total.toFixed(2)} €</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.md,
              padding: theme.spacing.md,
              background: theme.colors.background,
              borderRadius: '4px',
            }}>
              <span style={{ fontWeight: 500 }}>Trinkgeld:</span>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={tipAmount || ''}
                onChange={(e) => handleTipChange(e.target.value)}
                style={{
                  padding: theme.spacing.sm,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '4px',
                  width: '100px'
                }}
              />
              <span>€</span>
            </div>

            <div style={{
              padding: theme.spacing.md,
              background: theme.colors.background,
              borderRadius: '4px',
            }}>
              <CustomCheckbox
                id="roundup"
                checked={roundUp}
                onChange={handleRoundUpChange}
                label="Aufrunden"
              />
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
                background: 'rgba(204, 59, 59, 0.1)',
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}
          </div>

          <div style={rightColumnStyles}>
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
          </div>
        </div>

        <div style={buttonStyles}>
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
          <button
            onClick={() => {
              setReceivedAmount(0);
              setChangeAmount(0);
              setTipAmount(0);
              setRoundUp(false);
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
        </div>
      </div>
    </div>
  );
};

export default PaymentDialog;