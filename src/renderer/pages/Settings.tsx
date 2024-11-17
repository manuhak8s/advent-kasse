import * as React from 'react';
import { useState } from 'react';
import { theme } from '../styles/theme';
import { StorageService } from '../services/storage';
import { BaseTransaction } from '../types/types';

const Settings: React.FC = () => {
    const [showResetDialog, setShowResetDialog] = useState(false);
    const [transactions, setTransactions] = useState<BaseTransaction[]>(
      StorageService.getTransactions()
    );

  const handleResetCashRegister = () => {
    if (window.confirm('Möchten Sie wirklich die Kasse zurücksetzen? Dieser Vorgang kann nicht rückgängig gemacht werden.')) {
      StorageService.saveCashBalance(0);
      StorageService.saveProducts([]);
      localStorage.setItem('transactions', '[]');
      setTransactions([]);
      alert('Die Kasse wurde erfolgreich zurückgesetzt.');
    }
  };

  const handleDeleteTransaction = (transaction: BaseTransaction) => {
    if (window.confirm('Möchten Sie diese Transaktion wirklich löschen?')) {
      // Update transactions
      const updatedTransactions = transactions.filter(t => 
        !(t.productId === transaction.productId && 
          t.timestamp.toString() === transaction.timestamp.toString())
      );
      setTransactions(updatedTransactions);
      StorageService.clearTransactions();
      updatedTransactions.forEach(t => StorageService.saveTransaction(t));

      // Update cash balance
      const currentBalance = StorageService.loadCashBalance();
      const newBalance = currentBalance - (transaction.price * transaction.quantity + transaction.tip);
      StorageService.saveCashBalance(newBalance);

      alert('Transaktion wurde erfolgreich gelöscht.');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProductName = (productId: string): string => {
    const products = StorageService.loadProducts();
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unbekanntes Produkt';
  };

  const sectionStyles: React.CSSProperties = {
    background: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: '8px',
    boxShadow: theme.shadows.medium,
    marginBottom: theme.spacing.xl
  };

  const buttonStyles: React.CSSProperties = {
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    background: theme.colors.error,
    color: theme.colors.textLight,
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  return (
    <div style={{ 
      padding: theme.spacing.lg,
      height: 'calc(100vh - 80px)', // Höhe abzüglich Header
      overflow: 'auto', // Ermöglicht Scrollen
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.xl
    }}>
      {/* Kasse zurücksetzen */}
      <div style={{
        ...sectionStyles,
        flex: 'none' // Verhindert, dass sich die Section dehnt
      }}>
        <h2 style={{ marginTop: 0, marginBottom: theme.spacing.lg }}>Kasse zurücksetzen</h2>
        <p style={{ marginBottom: theme.spacing.lg }}>
          Setzt den Kassenstand auf 0 € zurück und löscht alle Produkte und Transaktionen.
        </p>
        <button 
          onClick={handleResetCashRegister}
          style={buttonStyles}
        >
          Kasse zurücksetzen
        </button>
      </div>

      {/* Transaktionen */}
      <div style={{
        ...sectionStyles,
        flex: 1, // Nimmt verfügbaren Platz ein
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 0 // Entfernt den unteren Abstand
      }}>
        <h2 style={{ margin: 0, marginBottom: theme.spacing.lg }}>Transaktionen</h2>
        <div style={{ 
          flex: 1,
          overflow: 'auto', // Ermöglicht Scrollen in der Tabelle
          minHeight: 0 // Wichtig für Flex-Container
        }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            tableLayout: 'fixed' // Fixierte Spaltenbreiten
          }}>
            <thead style={{
              position: 'sticky',
              top: 0,
              background: theme.colors.surface,
              zIndex: 1
            }}>
              <tr style={{ background: theme.colors.background }}>
                <th style={{ padding: theme.spacing.md, textAlign: 'left', width: '20%' }}>Datum</th>
                <th style={{ padding: theme.spacing.md, textAlign: 'left', width: '20%' }}>Produkt(ID)</th>
                <th style={{ padding: theme.spacing.md, textAlign: 'left', width: '15%' }}>Menge</th>
                <th style={{ padding: theme.spacing.md, textAlign: 'left', width: '15%' }}>Preis</th>
                <th style={{ padding: theme.spacing.md, textAlign: 'left', width: '15%' }}>Trinkgeld</th>
                <th style={{ padding: theme.spacing.md, textAlign: 'left', width: '15%' }}>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr 
                  key={`${transaction.productId}-${transaction.timestamp}`}
                  style={{
                    borderBottom: `1px solid ${theme.colors.border}`,
                    background: index % 2 === 0 ? theme.colors.surface : theme.colors.background
                  }}
                >
                  <td style={{ padding: theme.spacing.md, whiteSpace: 'nowrap' }}>
                    {formatDate(transaction.timestamp)}
                  </td>
                  <td style={{ padding: theme.spacing.md }}>
                    <div>{getProductName(transaction.productId)}</div>
                    <div style={{ 
                      fontSize: '0.8em', 
                      color: theme.colors.secondary,
                      marginTop: '2px' 
                    }}>
                      {transaction.productId}
                    </div>
                  </td>
                  <td style={{ padding: theme.spacing.md }}>{transaction.quantity}</td>
                  <td style={{ padding: theme.spacing.md }}>{transaction.price.toFixed(2)} €</td>
                  <td style={{ padding: theme.spacing.md }}>{transaction.tip.toFixed(2)} €</td>
                  <td style={{ padding: theme.spacing.md }}>
                    <button
                      onClick={() => handleDeleteTransaction(transaction)}
                      style={{
                        ...buttonStyles,
                        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                        fontSize: '0.9em'
                      }}
                    >
                      Löschen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Settings;