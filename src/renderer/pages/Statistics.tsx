import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { theme } from '../styles/theme';
import { BaseTransaction, ProductStat } from '../types/types';
import { StorageService } from '../services/storage';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type SortType = 'quantity' | 'revenue';
type SortDirection = 'asc' | 'desc';

const Statistics: React.FC = () => {
  const [transactions, setTransactions] = useState<BaseTransaction[]>([]);
  const [sortType, setSortType] = useState<SortType>('quantity');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
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
    loadData();
  }, []);

  const loadData = () => {
    const loadedTransactions = StorageService.getTransactions();
    setTransactions(loadedTransactions);

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

    const productStats = Array.from(productStatsMap.values());
    setStats({
      totalProducts,
      totalRevenue,
      totalTips,
      productStats: sortProducts(productStats, sortType, sortDirection)
    });
  };

  const sortProducts = (products: ProductStat[], type: SortType, direction: SortDirection): ProductStat[] => {
    return [...products].sort((a, b) => {
      const factor = direction === 'desc' ? -1 : 1;
      const value = type === 'quantity' 
        ? a.quantity - b.quantity 
        : a.totalRevenue - b.totalRevenue;
      return value * factor;
    });
  };

  const handleSort = (type: SortType) => {
    if (type === sortType) {
      const newDirection = sortDirection === 'desc' ? 'asc' : 'desc';
      setSortDirection(newDirection);
      setStats(prev => ({
        ...prev,
        productStats: sortProducts(prev.productStats, type, newDirection)
      }));
    } else {
      setSortType(type);
      setSortDirection('desc');
      setStats(prev => ({
        ...prev,
        productStats: sortProducts(prev.productStats, type, 'desc')
      }));
    }
  };

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

  const sortButtonStyles: React.CSSProperties = {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: theme.colors.text,
    padding: theme.spacing.md
  };

  const sortIconStyles = (active: boolean): React.CSSProperties => ({
    fontSize: '0.8em',
    opacity: active ? 1 : 0.3,
    color: theme.colors.primary
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const pdfContentRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!pdfContentRef.current) return;

    try {
      const loadingDiv = document.createElement('div');
      loadingDiv.style.position = 'fixed';
      loadingDiv.style.top = '50%';
      loadingDiv.style.left = '50%';
      loadingDiv.style.transform = 'translate(-50%, -50%)';
      loadingDiv.style.padding = '20px';
      loadingDiv.style.background = 'white';
      loadingDiv.style.borderRadius = '8px';
      loadingDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
      loadingDiv.style.zIndex = '9999';
      loadingDiv.textContent = 'Erstelle PDF...';
      document.body.appendChild(loadingDiv);

      const date = new Date();
      const dateStr = date.toLocaleDateString('de-DE').replace(/\./g, '-');
      const timeStr = date.toLocaleTimeString('de-DE').replace(/:/g, '-');

      const canvas = await html2canvas(pdfContentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      pdf.save(`Advent-Kasse_Statistik_${dateStr}.pdf`);
      document.body.removeChild(loadingDiv);
    } catch (error) {
      console.error('Fehler beim PDF-Export:', error);
      alert('Beim Erstellen des PDFs ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.');
    }
  };

  const pdfStyles = {
    container: {
      padding: '20px',
      background: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '30px',
      borderBottom: '2px solid #333',
      paddingBottom: '10px'
    },
    headerTitle: {
      fontSize: '24px',
      marginBottom: '10px'
    },
    headerDate: {
      fontSize: '14px',
      color: '#666'
    },
    kpiContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      marginBottom: '30px'
    },
    kpiCard: {
      padding: '15px',
      background: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #dee2e6'
    },
    kpiLabel: {
      fontSize: '14px',
      color: '#495057',
      marginBottom: '5px'
    },
    kpiValue: {
      fontSize: '20px',
      fontWeight: 'bold' as const,
      color: '#0F4C3A'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      marginTop: '20px'
    },
    th: {
      backgroundColor: '#f8f9fa',
      padding: '12px',
      borderBottom: '2px solid #dee2e6',
      textAlign: 'left' as const,
      fontSize: '14px'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #dee2e6',
      fontSize: '14px'
    }
  };

  return (
    <div style={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Export Button Container */}
      <div style={{ 
        padding: theme.spacing.lg,
        display: 'flex', 
        justifyContent: 'flex-end',
        background: theme.colors.background
      }}>
        <button
          onClick={handleExportPDF}
          style={{
            padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
            background: theme.colors.secondary,
            color: theme.colors.textLight,
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>📄</span>
          Als PDF exportieren
        </button>
      </div>

      {/* Scrollable Main Content */}
      <div style={{ 
        flex: 1,
        overflow: 'auto',
        padding: `${theme.spacing.lg} ${theme.spacing.lg} ${theme.spacing.xl}`,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.xl
      }}>
        {/* KPI Cards */}
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

        {/* Product Table */}
        <div style={{
          background: theme.colors.surface,
          padding: `${theme.spacing.lg} ${theme.spacing.lg} ${theme.spacing.xl}`,
          borderRadius: '8px',
          boxShadow: theme.shadows.medium,
          marginBottom: theme.spacing.xl
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: theme.spacing.lg 
          }}>
            <h3 style={{ margin: 0 }}>Verkaufte Produkte</h3>
            <div style={{ display: 'flex', gap: theme.spacing.sm }}>
              <button 
                onClick={() => handleSort('quantity')}
                style={{
                  ...sortButtonStyles,
                  fontWeight: sortType === 'quantity' ? 'bold' : 'normal'
                }}
              >
                Nach Anzahl sortieren
                <span style={sortIconStyles(sortType === 'quantity')}>
                  {sortDirection === 'desc' ? '↓' : '↑'}
                </span>
              </button>
              <button 
                onClick={() => handleSort('revenue')}
                style={{
                  ...sortButtonStyles,
                  fontWeight: sortType === 'revenue' ? 'bold' : 'normal'
                }}
              >
                Nach Umsatz sortieren
                <span style={sortIconStyles(sortType === 'revenue')}>
                  {sortDirection === 'desc' ? '↓' : '↑'}
                </span>
              </button>
            </div>
          </div>
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

      {/* Hidden PDF Content */}
      <div ref={pdfContentRef} style={{ ...pdfStyles.container, position: 'absolute', left: '-9999px' }}>
        <div style={pdfStyles.header}>
          <div style={pdfStyles.headerTitle}>Advent-Kasse - Statistikbericht</div>
          <div style={pdfStyles.headerDate}>
            Erstellt am: {new Date().toLocaleDateString('de-DE')} um {new Date().toLocaleTimeString('de-DE')}
          </div>
        </div>

        <div style={pdfStyles.kpiContainer}>
          <div style={pdfStyles.kpiCard}>
            <div style={pdfStyles.kpiLabel}>Verkaufte Produkte</div>
            <div style={pdfStyles.kpiValue}>{stats.totalProducts}</div>
          </div>
          <div style={pdfStyles.kpiCard}>
            <div style={pdfStyles.kpiLabel}>Gesamteinnahmen</div>
            <div style={pdfStyles.kpiValue}>{stats.totalRevenue.toFixed(2)} €</div>
          </div>
          <div style={pdfStyles.kpiCard}>
            <div style={pdfStyles.kpiLabel}>Trinkgeld</div>
            <div style={pdfStyles.kpiValue}>{stats.totalTips.toFixed(2)} €</div>
          </div>
        </div>

        <table style={pdfStyles.table}>
          <thead>
            <tr>
              <th style={pdfStyles.th}>Produkt</th>
              <th style={pdfStyles.th}>Anzahl</th>
              <th style={pdfStyles.th}>Umsatz</th>
            </tr>
          </thead>
          <tbody>
            {stats.productStats.map((product, index) => (
              <tr key={product.productId}>
                <td style={pdfStyles.td}>{product.productName}</td>
                <td style={pdfStyles.td}>{product.quantity}</td>
                <td style={pdfStyles.td}>{product.totalRevenue.toFixed(2)} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Statistics;