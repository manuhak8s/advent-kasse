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
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '8px',
        padding: '8px',
        flex: 1,
        overflowY: 'auto',
        minHeight: 0
      };
      
      const productStyles: React.CSSProperties = {
        background: theme.colors.background,
        padding: '8px',
        borderRadius: '8px',
        boxShadow: theme.shadows.small,
        border: `1px solid ${theme.colors.border}`,
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        height: '90px', // Etwas reduzierte Höhe
        position: 'relative'
      };

  const nameStyles: React.CSSProperties = {
    fontWeight: 500,
    fontSize: '1rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    flex: 1
  };

  const priceStyles: React.CSSProperties = {
    color: theme.colors.primary,
    fontSize: '1.1rem',
    fontWeight: 600
  };

  const buttonStyles: React.CSSProperties = {
    margin: '8px',
    padding: '8px 16px',
    background: theme.colors.secondary,
    color: theme.colors.textLight,
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  };

  const quantityBadgeStyles: React.CSSProperties = {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: theme.colors.primary,
    color: theme.colors.textLight,
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    boxShadow: theme.shadows.small,
    border: `2px solid ${theme.colors.surface}`
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
                e.currentTarget.style.transform = 'translateY(-2px)';
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