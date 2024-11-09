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
      // Wenn gleicher Typ, dann Richtung umkehren
      const newDirection = sortDirection === 'desc' ? 'asc' : 'desc';
      setSortDirection(newDirection);
      setStats(prev => ({
        ...prev,
        productStats: sortProducts(prev.productStats, type, newDirection)
      }));
    } else {
      // Wenn neuer Typ, dann absteigend sortieren
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

  const handleExportPDF = async () => {
    if (!contentRef.current) return;

    try {
      // Erstelle einen Loading-Indikator
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

      // Aktuelle Zeit für den Dateinamen
      const date = new Date();
      const dateStr = date.toLocaleDateString('de-DE').replace(/\./g, '-');
      const timeStr = date.toLocaleTimeString('de-DE').replace(/:/g, '-');

      // PDF erstellen
      const content = contentRef.current;
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: theme.colors.background
      });

      const imgWidth = 210; // A4 Breite in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // PDF speichern
      pdf.save(`Statistik_${dateStr}_${timeStr}.pdf`);

      // Loading-Indikator entfernen
      document.body.removeChild(loadingDiv);
    } catch (error) {
      console.error('Fehler beim PDF-Export:', error);
      alert('Beim Erstellen des PDFs ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.');
    }
  };

  return (
    <div style={{ padding: theme.spacing.lg, display: 'flex', flexDirection: 'column', gap: theme.spacing.xl }}>
      {/* Export Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
            gap: '8px',
            fontSize: '0.9rem'
          }}
        >
          <span style={{ fontSize: '1.2em' }}>📄</span>
          Als PDF exportieren
        </button>
      </div>

      {/* Zu exportierender Content */}
      <div ref={contentRef}>
        {/* KPI Kacheln */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: theme.spacing.lg,
          marginBottom: theme.spacing.xl
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
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: theme.spacing.lg 
          }}>
            <h3 style={{ margin: 0 }}>Verkaufte Produkte</h3>
            {/* Sortier-Buttons werden im PDF nicht benötigt */}
          </div>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            fontSize: '12px'  // Kleinere Schrift für bessere PDF-Lesbarkeit
          }}>
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
    </div>
  );
};

export default Statistics;