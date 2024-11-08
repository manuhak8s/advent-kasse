import * as React from 'react';
import { useEffect, useState } from 'react';
import { theme } from '../styles/theme';
import { BaseTransaction, ProductStat } from '../types/types';
import { StorageService } from '../services/storage';

const Statistics: React.FC = () => {
  const [transactions, setTransactions] = useState<BaseTransaction[]>([]);
  const [stats, setStats] = useState<{
    totalProducts: number;
    totalRevenue: number;
    totalTips: number;
    productStats: ProductStat[];
  }>({
    totalProducts: 0,
    totalRevenue: 0,
    totalTips: 0,
    productStats: []
  });

  useEffect(() => {
    const loadedTransactions = StorageService.getTransactions();
    setTransactions(loadedTransactions);

    // Berechne Statistiken
    const totalProducts = loadedTransactions.reduce(
      (sum, t) => sum + t.quantity,
      0
    );

    const totalRevenue = loadedTransactions.reduce(
      (sum, t) => sum + (t.price * t.quantity),
      0
    );

    const totalTips = loadedTransactions.reduce(
      (sum, t) => sum + t.tip,
      0
    );

    // Berechne Produktstatistiken
    const productStatsMap = new Map<string, ProductStat>();
    const products = StorageService.loadProducts();
    
    loadedTransactions.forEach(transaction => {
      const product = products.find(p => p.id === transaction.productId);
      if (!product) return;

      const existing = productStatsMap.get(transaction.productId);
      if (existing) {
        existing.quantity += transaction.quantity;
        existing.totalRevenue += transaction.price * transaction.quantity;
      } else {
        productStatsMap.set(transaction.productId, {
          productId: transaction.productId,
          productName: product.name,
          quantity: transaction.quantity,
          totalRevenue: transaction.price * transaction.quantity
        });
      }
    });

    const productStats = Array.from(productStatsMap.values())
      .sort((a, b) => b.quantity - a.quantity);

    setStats({
      totalProducts,
      totalRevenue,
      totalTips,
      productStats
    });
  }, []);

  const kpiCardStyles: React.CSSProperties = {
    background: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: '8px',
    boxShadow: theme.shadows.medium,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.sm
  };

  const kpiLabelStyles: React.CSSProperties = {
    color: theme.colors.text,
    fontSize: '0.9rem',
    fontWeight: 500
  };

  const kpiValueStyles: React.CSSProperties = {
    color: theme.colors.primary,
    fontSize: '1.5rem',
    fontWeight: 600
  };

  return (
    <div style={{ padding: theme.spacing.lg, display: 'flex', flexDirection: 'column', gap: theme.spacing.xl }}>
      {/* KPI Kacheln */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: theme.spacing.lg 
      }}>
        <div style={kpiCardStyles}>
          <div style={kpiLabelStyles}>Verkaufte Produkte</div>
          <div style={kpiValueStyles}>{stats.totalProducts}</div>
        </div>
        <div style={kpiCardStyles}>
          <div style={kpiLabelStyles}>Gesamteinnahmen</div>
          <div style={kpiValueStyles}>{stats.totalRevenue.toFixed(2)} €</div>
        </div>
        <div style={kpiCardStyles}>
          <div style={kpiLabelStyles}>Trinkgeld</div>
          <div style={kpiValueStyles}>{stats.totalTips.toFixed(2)} €</div>
        </div>
      </div>

      {/* Produkttabelle */}
      <div style={{
        background: theme.colors.surface,
        padding: theme.spacing.lg,
        borderRadius: '8px',
        boxShadow: theme.shadows.medium
      }}>
        <h3 style={{ margin: 0, marginBottom: theme.spacing.lg }}>Verkaufte Produkte</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ 
              background: theme.colors.background,
              textAlign: 'left'
            }}>
              <th style={{ padding: theme.spacing.md }}>Produkt</th>
              <th style={{ padding: theme.spacing.md }}>Anzahl</th>
              <th style={{ padding: theme.spacing.md }}>Umsatz</th>
            </tr>
          </thead>
          <tbody>
            {stats.productStats.map((product, index) => (
              <tr key={product.productId} style={{
                borderBottom: `1px solid ${theme.colors.border}`,
                background: index % 2 === 0 ? theme.colors.surface : theme.colors.background
              }}>
                <td style={{ padding: theme.spacing.md }}>{product.productName}</td>
                <td style={{ padding: theme.spacing.md }}>{product.quantity}</td>
                <td style={{ padding: theme.spacing.md }}>{product.totalRevenue.toFixed(2)} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Statistics;