import * as React from 'react';
import { theme } from '../styles/theme';
import { Product, CartItem } from '../types/types';

interface ProductGridProps {
  products: Product[];
  cartItems: CartItem[];
  onProductClick: (product: Product) => void;
  onEditProducts: () => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  cartItems,
  onProductClick,
  onEditProducts
}) => {
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxHeight: '100%',
    background: theme.colors.surface,
    borderRadius: '8px',
    boxShadow: theme.shadows.medium,
    border: `1px solid ${theme.colors.border}`,
    overflow: 'hidden'
  };

  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // 3 Spalten
    gap: '16px', // Größerer Abstand zwischen den Kacheln
    padding: '16px',
    flex: 1,
    overflowY: 'auto',
    minHeight: 0
  };

  const productStyles: React.CSSProperties = {
    background: theme.colors.background,
    padding: '20px', // Mehr Padding für größere Kacheln
    borderRadius: '12px', // Größerer Radius für weichere Ecken
    boxShadow: theme.shadows.small,
    border: '2px solid #CC3B3B', // Weihnachtlich roter Rand
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    height: '160px', // Deutlich größere Höhe
    position: 'relative',
    justifyContent: 'center', // Zentrierte Ausrichtung
    alignItems: 'center' // Zentrierte Ausrichtung
  };

  const nameStyles: React.CSSProperties = {
    fontWeight: 600,
    fontSize: '1.2rem', // Größere Schrift
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    flex: 1,
    width: '100%'
  };

  const priceStyles: React.CSSProperties = {
    color: theme.colors.primary,
    fontSize: '1.4rem', // Größere Schrift für den Preis
    fontWeight: 700,
    padding: '8px 16px',
    borderRadius: '8px',
    background: '#f8f9fa'
  };

  const quantityBadgeStyles: React.CSSProperties = {
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    background: '#CC3B3B', // Matching mit Rahmenfarbe
    color: theme.colors.textLight,
    borderRadius: '50%',
    width: '32px', // Größerer Badge
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    fontWeight: 'bold',
    boxShadow: theme.shadows.small,
    border: `2px solid ${theme.colors.surface}`
  };

  const buttonStyles: React.CSSProperties = {
    margin: '8px',
    padding: '12px 24px',
    background: theme.colors.secondary,
    color: theme.colors.textLight,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 500
  };

  const getProductQuantity = (productId: string): number => {
    const cartItem = cartItems.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <div style={containerStyles}>
      <div style={gridStyles}>
        {products.map((product) => {
          const quantity = getProductQuantity(product.id);
          return (
            <div
              key={product.id}
              style={productStyles}
              onClick={() => onProductClick(product)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = theme.shadows.medium;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = theme.shadows.small;
              }}
            >
              {quantity > 0 && (
                <div style={quantityBadgeStyles}>
                  {quantity}
                </div>
              )}
              <div style={nameStyles}>{product.name}</div>
              <div style={priceStyles}>{product.price.toFixed(2)} €</div>
            </div>
          );
        })}
      </div>
      
      <button
        onClick={onEditProducts}
        style={buttonStyles}
      >
        Produkte bearbeiten
      </button>
    </div>
  );
};

export default ProductGrid;